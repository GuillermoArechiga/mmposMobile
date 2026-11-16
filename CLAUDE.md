# mmPos Mobile: working rules

Expo app for mmPos with four modes on one install: **admin** (cloud), **handheld order taker /
mobile till**, **kitchen display** and **second display** (all three LAN, paired with the main
Electron POS). The plan is `docs/mobile-plan.md` and decisions are in `docs/decisions.md`.

The general standards are in `../../FireInspection/CLAUDE.md` (frontend pack). Native apps
are outside that pack's profile, so apply its **principles and hard stops** and record any
deviation in `docs/decisions.md`. FireSure (`FireInspection/FireInspectionApp`) is the
reference Expo app.

## Branches and done
- Work on `dev` only, never `main`. `main` only receives merges from `dev`.
- Before saying "done", run `npm run check` (tokens up to date, `tsc`, lint, `node --test`). If a step
  could not run, say which one and why.
- Don't use Playwright or screenshot checks. The user checks screens on real devices.

## Expo (SDK 58)
- Expo changes every SDK. Read the versioned docs (`https://docs.expo.dev/versions/v58.0.0/`,
  `https://docs.expo.dev/llms.txt`) before touching an Expo or React Native API, and don't trust memory.
- Add packages with `npx expo install <pkg>`. If npm complains about peers, install the Expo-matched
  version first (e.g. `react-dom`).
- `ios/` and `android/` are generated (CNG) and git-ignored. Configure native behaviour through
  `app.json` and config plugins, never by editing those folders.

## Structure (layering is enforced by `src/shared/layering.test.ts`)
```
src/app/                expo-router routes ONLY, thin: read params, render a feature page
src/features/<feature>/ same feature names as mmPosWeb/src/app/<feature>
  pages/ components/ store/   web convention (one zustand store per feature)
  data/                 repositories (SQLite) / LAN clients
  domain/               pure rules + zod schemas + *.test.ts (no React, no Expo)
src/shared/             theme, ui, db, sync, session, api, lan, hooks; never imports features
src/i18n/               i18next, es + en with the same keys (locales.test.ts)
design/                 copy of mmPosWeb/design; don't edit (see design/SOURCE.md)
```
- `src/shared` never imports `src/features`. Only routes import from `src/app`.
- Tests run under plain `node --test`, so domain code imported by tests uses relative imports
  with a `.ts` extension and no enums or namespaces.

## Design system
- Colours, sizes and fonts come only from `src/shared/theme/theme.ts`, which is generated from
  `design/design-system/tokens.json` (`npm run tokens`). Literal colours fail `noLiteralColors.test.ts`.
- Always use `@/shared/ui/Text` (bundled Inter and Plus Jakarta Sans, capped font scaling).
- Follow `design/design-system/guidelines.md`: one green and at most one primary button per
  screen, never colour alone, Spanish first, 48px touch targets in POS flows, money with
  tabular digits.

## Security and data (hard stops)
- Access and refresh tokens and the database key go in `expo-secure-store` only. Never in
  AsyncStorage, SQLite, zustand-persist, logs or URLs.
- The server authorizes everything. Hidden buttons and cached roles are UX only.
- Logout or an account switch wipes the local database and every store. A forced sign-out
  keeps unsent work.
- LAN modes never call the cloud and never store business data. The main POS is the
  source of truth, and its LAN API is the contract (`docs/lan-api.md` once Phase 4 starts).
- Offline writes: save the row and its outbox entry in one transaction. Inventory changes are
  movements only, never a quantity, and stock is never clamped. Never auto-retry a payment.
- One API client per surface (cloud and LAN). No raw `fetch` in components.
- Never call `POST /auth/logout-device` (it resets every admin PIN; see the plan §7).
