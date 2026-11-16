# Decisions

Format: **D# Title**, then the decision, why, and its status. `TBD(owner, date)` marks an open
decision that is running on a safe default until the owner decides.

**D1 Expo SDK 58** (latest stable at scaffold, 2026-11-16). FireSure is on SDK 54. A new app
starts on the current SDK. Accepted.

**D2 Routes in `src/app/`, features in `src/features/`.** SDK 58 Expo Router reserves
`src/app` for routes. The web keeps features in `src/app/<feature>`, so mobile uses the same
feature names and inner layout (`pages/components/store`) under `src/features`, plus FireSure's
`data/` and `domain/` layers. Accepted.

**D3 TypeScript strict.** mmPosWeb is JavaScript, but the standards require strict typing at
boundaries (FE principle 2). This deviates from the web on purpose. Accepted.

**D4 State: zustand per feature plus repositories, no TanStack Query.** Offline-first data comes
from SQLite through repositories. Admin reports use a small `useRemote` hook with SQLite
snapshots. This matches FireSure. It deviates from the FE pack's "server data → TanStack Query"
default because native is outside that profile. Revisit if online-only screens grow. Accepted.

**D5 Tests: `node --test` for pure logic and guard tests** (tokens, contrast, layering, i18n
parity), as in FireSure. React Native rendering tests are not part of the default suite. Accepted.

**D6 Dark theme only.** The POS and the web ship dark. The design system's light theme is
"proposed". Revisit when mmPosWeb/design marks light as shipped. Accepted.

**D7 One app, four modes** (admin, handheld, kitchen, display), chosen at setup and changeable
by an admin. Accepted.

**D8 LAN modes hold no business data.** The main Electron POS is the only place data is
stored, exactly like the cashier station. Handheld drafts are the only local queue. Accepted.

**D9 Platforms.** Default: admin on Android and iOS; handheld and displays Android-first
(cheap devices, kiosk mode). TBD(owner: Guillermo, 2026-11-30).

**D10 Printing from the handheld.** Default: everything prints on the main POS's printers in
v1; Bluetooth printers later. TBD(owner: Guillermo, 2026-11-30).

**D11 Admin edits while offline.** Default: queue catalog and inventory edits in the outbox
with a "pending" badge. TBD(owner: Guillermo, 2026-11-30).

**D12 Order cancels from the phone.** Default: online only (GraphQL `cancelOrder`), never
queued. TBD(owner: Guillermo, 2026-11-30).

**D13 App id `com.mmpos.mobile`** (iOS bundle id and Android package). Provisional: it can
change freely until the first store build. TBD(owner: Guillermo, before first EAS build).

**D14 Repository visibility.** `GuillermoArechiga/mmposMobile` is public on GitHub. Nothing
secret is committed (env values stay in `.env*.local`, which git ignores), but a POS client's
code being public is a product decision. TBD(owner: Guillermo, 2026-11-30).

**D15 One main POS per location, on any platform.** A location's *main* is the one device
whose local database is the location's source of truth: the Electron POS today, and the Expo
app in main mode later. Every other device (cashier station, handheld, displays) connects to
it over the LAN and keeps no business database. The backend enforces it through
`/devices/main` (`claim`, `status`, `release`, and a `transfer` that needs the admin
password), under a per-location lock:
- A second device can never become main while another active main exists. It gets
  `409 MAIN_ALREADY_ASSIGNED`, along with the current main's name and when it was last seen.
- That device must connect as a secondary, or an admin must transfer the main.
- An Expo main must claim through the same endpoints before it starts using a location.
- An Expo main never starts an unverified local database: claiming needs the server.
- Periodic checks never block a main that is only offline.

Accepted, 2026-11-16 (backend and Electron implemented).

**D16 The Expo app can be a full main POS** (offline-first, own encrypted SQLite, cloud sync,
LAN host), as well as a second cashier, handheld, kitchen display, second display or admin.
Business logic is shared with Electron through a core package rather than written twice.
Hosting the LAN works fully on Android; on iPad it only works while the app is in the
foreground. Open questions: monorepo or versioned package, iPad as main, build order.
TBD(owner: Guillermo, 2026-11-30).
