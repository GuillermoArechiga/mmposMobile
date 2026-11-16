#!/bin/sh
# Run mmPos Mobile on a real iPhone (adapted from FireSure's scripts/phone.sh). Through npm:
#
#   npm run phone:check     is everything ready? (this Mac's address, the API, the iPhone, signing, native project)
#   npm run phone           build, install and open the app on the iPhone; Metro serves the live code from this Mac
#   npm run phone:release   Release build: the code is inside the app, so it opens without Metro
#
# Why not `expo run:ios`: it insists on finding the Simulator app even for a real phone, and some Xcode installs
# have none. This builds with xcodebuild and installs with devicectl (both ship with Xcode).
#
# ios/ is generated (CNG, git-ignored): it is (re)created with `expo prebuild` when missing or when app.json /
# package.json changed since the last prebuild.
#
# Signing: the Apple team id lives in .phone.local (git-ignored; this repo is public), as PHONE_TEAM_ID=XXXXXXXXXX.
# Overrides: PHONE_DEVICE="name of the iPhone", PHONE_API_URL=http://host:port, PHONE_DRY_RUN=1 (print, don't run).
set -eu

cd "$(dirname "$0")/.."

[ -f .phone.local ] && . ./.phone.local

DEVICE="${PHONE_DEVICE:-iPhone MM}"
BUNDLE_ID="com.mmpos.mobile"
SCHEME="MMPos"
WORKSPACE="ios/${SCHEME}.xcworkspace"
TEAM="${PHONE_TEAM_ID:-}"
API_PORT="${PHONE_API_PORT:-4100}" # mmPosBackend local dev port (Developer/DEV-PORTS.md)

# This Mac's address on the network it is using right now; found again on every run.
detect_ip() {
  iface="$(route -n get default 2>/dev/null | awk '/interface:/{print $2}')"
  case "$iface" in
    en*|bridge*)
      IP="$(ipconfig getifaddr "$iface" 2>/dev/null || true)"
      if [ -n "$IP" ]; then NET_IFACE="$iface"; return; fi
      ;;
  esac
  for n in 0 1 2 3 4 5 6 7 8; do
    IP="$(ipconfig getifaddr "en$n" 2>/dev/null || true)"
    if [ -n "$IP" ]; then NET_IFACE="en$n"; return; fi
  done
}
NET_IFACE=""
IP=""
detect_ip
# The address React Native's build step writes into the app so the iPhone finds Metro (first en0..en8 with one).
BUILD_IP=""
for n in 0 1 2 3 4 5 6 7 8; do
  BUILD_IP="$(ipconfig getifaddr "en$n" 2>/dev/null || true)"
  [ -n "$BUILD_IP" ] && break
done
API_URL="${PHONE_API_URL:-http://${IP:-localhost}:${API_PORT}}"
DRY="${PHONE_DRY_RUN:-}"

# The app reads the API address from EXPO_PUBLIC_API_URL (from Phase 2 on).
export EXPO_PUBLIC_API_URL="$API_URL"
[ -n "$IP" ] && export REACT_NATIVE_PACKAGER_HOSTNAME="$IP"
export LANG="${LANG:-en_US.UTF-8}"

FAILED=0
ok() { printf '  ok    %s\n' "$1"; }
bad() { printf '  FIX   %s\n' "$1"; FAILED=1; }
say() { printf '%s\n' "$1"; }
run() { if [ -n "$DRY" ]; then printf '  would run: %s\n' "$*"; else "$@"; fi; }

# Expo merges .env files OVER command-line variables in development; .env.development.local (git-ignored) is
# written while Metro runs so the phone gets this Mac's address, and removed when Metro stops.
DEV_ENV_FILE=".env.development.local"
write_dev_env() {
  if [ -n "$DRY" ]; then say "  would write $DEV_ENV_FILE with EXPO_PUBLIC_API_URL=$API_URL"; return; fi
  printf 'EXPO_PUBLIC_API_URL=%s\n' "$API_URL" > "$DEV_ENV_FILE"
}
remove_dev_env() { rm -f "$DEV_ENV_FILE"; }

# pod install leaves React Native's prebuilt core in its Release flavor and the Debug swap is skipped when this
# marker is missing, so a Debug build fails to link. (Same fix as FireSure.)
fix_core_marker() {
  marker="ios/Pods/React-Core-prebuilt/.last_build_configuration"
  if [ -d ios/Pods/React-Core-prebuilt ] && [ ! -f "$marker" ]; then printf 'Release' > "$marker"; fi
}

native_stale() {
  [ ! -d "$WORKSPACE" ] && return 0
  [ app.json -nt ios/Podfile.lock ] && return 0
  [ package.json -nt ios/Podfile.lock ] && return 0
  return 1
}

prebuild() {
  if native_stale; then
    say "Generating the native iOS project (expo prebuild + pod install)"
    run npx expo prebuild --platform ios --no-install
    run sh -c "cd ios && pod install"
  fi
}

# The UDID of the connected iPhone called $DEVICE, from Xcode's own device list.
find_udid() {
  tmp="$(mktemp -t phone-devices)"
  xcrun devicectl list devices --json-output "$tmp" >/dev/null 2>&1 || true
  python3 - "$tmp" "$DEVICE" <<'PY'
import json, sys
try:
    devices = json.load(open(sys.argv[1]))["result"]["devices"]
except Exception:
    sys.exit(0)
for d in devices:
    if d.get("hardwareProperties", {}).get("reality") == "physical" and d.get("deviceProperties", {}).get("name") == sys.argv[2]:
        print(d["hardwareProperties"]["udid"])
        break
PY
  rm -f "$tmp"
}

check() {
  say "Phone test: is everything ready?"
  if [ -n "$IP" ]; then ok "this Mac's address is $IP (on ${NET_IFACE:-?})"; else bad "no network address: connect this Mac to the same Wi-Fi as the iPhone"; fi
  if [ -n "$IP" ] && [ -n "$BUILD_IP" ] && [ "$IP" != "$BUILD_IP" ]; then bad "the build would point the iPhone at $BUILD_IP, not $IP (another adapter comes first): disconnect it"; fi

  if curl -s -m 3 -o /dev/null -w '%{http_code}' "$API_URL/auth/health" 2>/dev/null | grep -q '^200$'; then
    ok "the mmPos API answers at $API_URL"
  else
    say "  note  the mmPos API is not reachable at $API_URL (only needed from Phase 2: start mmPosBackend with npm run dev)"
  fi

  if [ -n "$(find_udid)" ]; then
    ok "the iPhone \"$DEVICE\" is connected and paired"
  else
    bad "the iPhone \"$DEVICE\" is not connected: plug it in, unlock it, tap Trust, and turn on Developer Mode (Settings > Privacy & Security)"
  fi

  if [ -n "$TEAM" ]; then ok "signing team set (.phone.local)"; else bad "no signing team: add PHONE_TEAM_ID=<your Apple team id> to .phone.local (git-ignored)"; fi
  if [ -d node_modules ]; then ok "npm packages are installed"; else bad "run: npm install"; fi
  if native_stale; then say "  note  the native iOS project will be (re)generated on the next build"; else ok "native iOS project is up to date"; fi

  if [ "$FAILED" -eq 0 ]; then say "Ready. Next: npm run phone"; else say "Fix the lines marked FIX, then run this check again."; exit 1; fi
}

# build_install <Debug|Release>: builds for the iPhone and installs it. Sets UDID.
build_install() {
  config="$1"
  if [ -z "$TEAM" ]; then say "No signing team: add PHONE_TEAM_ID=... to .phone.local (see npm run phone:check)."; exit 1; fi
  UDID="$(find_udid)"
  if [ -z "$UDID" ]; then
    say "The iPhone \"$DEVICE\" is not connected. Plug it in, unlock it, tap Trust and turn on Developer Mode, then try again."
    if [ -n "$DRY" ]; then UDID="<udid of $DEVICE>"; else exit 1; fi
  fi
  prebuild
  fix_core_marker
  say "Building $config for \"$DEVICE\" ($UDID)"
  say "(the first build takes several minutes; if macOS asks to let Xcode use the signing key, choose Always Allow)"
  run xcodebuild -workspace "$WORKSPACE" -scheme "$SCHEME" -configuration "$config" \
    -destination "id=$UDID" -derivedDataPath ios/build/derived -allowProvisioningUpdates \
    DEVELOPMENT_TEAM="$TEAM" CODE_SIGN_STYLE=Automatic build
  say "Installing on the iPhone"
  run xcrun devicectl device install app --device "$UDID" "ios/build/derived/Build/Products/$config-iphoneos/$SCHEME.app"
}

launch() {
  say "Opening the app"
  if ! run xcrun devicectl device process launch --device "$UDID" --terminate-existing "$BUNDLE_ID"; then
    say "Installed but would not open. On the iPhone: Settings > General > VPN & Device Management > your Apple ID > Trust, then open MMPos."
  fi
}

case "${1:-check}" in
  check) check ;;
  run)
    build_install Debug
    say "Starting Metro (the phone loads the live code from this Mac). Ctrl+C stops it."
    if [ -n "$DRY" ]; then
      write_dev_env
      run npx expo start --port 8081 --clear
      launch
      exit 0
    fi
    write_dev_env
    npx expo start --port 8081 --clear &
    METRO=$!
    trap 'kill $METRO 2>/dev/null || true; remove_dev_env' INT TERM EXIT
    n=0
    until curl -s -m 2 http://localhost:8081/status 2>/dev/null | grep -q "packager-status:running"; do
      n=$((n + 1))
      if [ "$n" -gt 60 ]; then say "Metro did not start in time."; exit 1; fi
      sleep 1
    done
    launch
    wait "$METRO"
    ;;
  release)
    build_install Release
    launch
    say "Done: the app has its code inside and opens without Metro."
    ;;
  *)
    sed -n '2,8p' "$0"
    exit 1
    ;;
esac
