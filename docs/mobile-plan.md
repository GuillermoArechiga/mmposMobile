# mmPos Mobile: plan

Status: Phase 0 (scaffold) done on `dev`, 2026-11-16. Decisions are in `docs/decisions.md`.

## 1. One app, four modes

| Mode | Device | Talks to | Data on the device |
|---|---|---|---|
| **Admin** | phone or tablet | cloud API (admin login) | encrypted cache and outbox |
| **Handheld order taker / mobile till** | phone | main POS over the LAN (paired) | offline order drafts and a menu snapshot |
| **Kitchen display** (restaurants) | tablet | main POS over the LAN | nothing |
| **Second display** (customer display or POS mirror) | tablet | main POS or a till over the LAN | nothing |

- **Admin:** a mirror of the web dashboard. It covers Today, sales, orders grouped by shift
  with "Ver turno", products, inventory, shifts and expenses, plus catalog and inventory edits.
- **Handheld:** waiters take orders at the table and send them to the kitchen, and it can
  charge as a second cashier. Staff unlock with their PIN.
- **Kitchen display:** an order board with "bump" (mark ready), a sound on new orders, and the
  screen kept awake.
- **Second display:** either the customer cart, total and change for one till, or the read-only
  POS mirror.

## 2. Architecture
```
Cloud API (Fastify + GraphQL + /sync) ◄── Admin mode (JWT; outbox → /sync/upload; cache ← /sync/download + reports)
        ▲
Main POS (Electron) ── its own cloud sync
        │  LAN API v1 (/health, /pair, /lan/v1/*, /display/*, /ws)
        ├── Handheld   (paired token + staff PIN; drafts queued while the LAN is down)
        ├── Kitchen    (/display/kitchen + push + bump)
        └── Display    (/display/pos-state + customer push channel per till)
```
LAN modes never talk to the cloud and never hold business data (D8).

## 3. Stack
- **Base:** Expo SDK 58, expo-router, TypeScript strict, ESLint `eslint-config-expo`.
- **State and data:** zustand per feature, zod at every boundary.
- **Storage and device:** expo-sqlite with SQLCipher and expo-secure-store (Phase 2),
  expo-network, expo-camera (pairing QR and barcodes), expo-keep-awake, expo-local-authentication.
- **i18n:** i18next with expo-localization, Spanish first.
- **Look:** fonts Inter and Plus Jakarta Sans, lucide icons, react-native-svg.

## 4. Offline-first, per mode
**Admin**
- Pull catalog, shift and order tables with `/sync/download`, using a per-table `serverTime`
  cursor with a 2-minute overlap and a manifest check for clock drift. Order history is pulled
  for a limited window.
- Save `report`, `dayPace`, `recentOrders` and `shiftSummary` results as snapshots and show
  "as of hh:mm". Refresh on foreground and every 60 seconds.
- Writes save the row and its outbox entry in one transaction. Backoff runs from 30 seconds to
  1 hour; missing-parent errors are retried and other errors stop. Inventory changes are
  movements only and stock is never clamped. Cancels are online only (D12).
- Logout wipes the database and stores. A forced sign-out keeps unsent work.

**Handheld**
- When the LAN is up, every action goes to the main POS.
- When the LAN is down, orders become drafts with client UUIDs and are submitted through an
  idempotent endpoint once the main is back. The menu snapshot is cached. Payments are never
  queued offline.

**Displays:** nothing stored. They reconnect with backoff.

## 5. Prerequisites
**Backend P0** (security hard stops)
1. `POST /auth/logout-device` resets every admin PIN in the business to "0000". Fix it and add
   a regression test.
2. `/sync/download?table=user` returns `passwordHash`, `pinHash` and `twoFactorSecret`. Add a
   per-client field allowlist.
3. The device-token gate is probably skipped in production (loopback behind the proxy). Verify
   it with `trustProxy`.

**Backend, needed for mobile**

4. Per-platform version gate: `X-App-Platform` header plus a minimum version per platform.
5. Paginated `/sync/download` (cursor plus limit) with a `since` window for orders.
6. Real-time updates. Poll for now. Later, fix the pubsub mismatch, add an `orderUpdates`
   subscription filtered by tenant, and fix the root `Subscription` type collision.
7. Later: push notifications (Expo push tokens).

**Electron main POS: LAN API v1**
- A `/lan/v1/*` facade over the station allowlist.
- `/health` reports `apiVersion` and `posType`.
- QR pairing `{url, pin, apiVersion}`.
- Idempotent `orders/submit` for offline drafts.
- Kitchen bump endpoint.
- Menu snapshot endpoint.
- Customer push channel per till.
- Push on order changes.
- `docs/lan-api.md`, with contract tests in both repos.

## 6. Phases
| # | Phase | Delivers | Size |
|---|---|---|---|
| 0 | Scaffold ✅ | repo, SDK 58, routes and layering, native tokens, theme, UI kit, i18n, mode picker, guard tests, docs | done |
| 1 | Backend P0 and prerequisites | items 1–5 with tests, on backend `dev` | 1 wk |
| 2 | Shared foundation | SQLCipher DB and migrations, SecureStore session, API client (timeout, refresh, errors), sync engine and outbox with tests, persisted mode, app lock | 1.5 wk |
| 3 | **Admin MVP** | login, Today, orders by shift and Ver turno, products and categories, inventory, shifts and expenses, settings, offline snapshots | 2–3 wk |
| 4 | LAN API v1 in Electron | facade, QR pairing, idempotent submit, bump, customer channel, push, contract tests | 1.5 wk |
| 5 | **Handheld** | QR pairing, PIN lock, tables and menu, orders with modifiers and variations, kitchen, bill, charge, offline drafts | 2–3 wk |
| 6 | **Kitchen display** | board, bump, sounds, keep-awake, kiosk guidance | 1 wk |
| 7 | **Second display** | POS mirror and customer display per till | 1 wk |
| 8 | Hardening and release | accessibility, performance on cheap Android devices, crash reporting (decide), EAS internal builds, then stores | 1–2 wk |

## 7. Definition of done
- `npm run check` passes: tokens up to date, `tsc`, lint, and `node --test`.
- Tests cover the domain rules, the sync engine (ordering, backoff, idempotent replay, stale
  updates, parents before children) and the LAN contract.
- The Electron and backend repos keep their own suites green.
- The user checks screens on real devices.
