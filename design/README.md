# mmPOS — Design System

**Version 2.0.0 · November 2026**

mmPOS is one point of sale for **restaurants and shops**: the same calm dark surfaces, one confident green, line icons and large touch targets across the Electron POS, the web dashboard and the printed ticket.

The **mark** is the **"m." monogram**: two rounded arches and a period on the baseline — the dot is the *point* of sale. It is neutral between restaurant and shop and shares the 2px line weight of the icon set. The **wordmark** is Plus Jakarta Sans 800, outlined in every SVG.

> Colours and shape here are the theme the apps already ship (`mmPosWeb/src/index.css`, `mmPosApp/src/renderer/src/assets/main.css`). Nothing was re-coloured. The **light theme is a proposal** and is not used by any app yet.

## Package map

| Folder | What is in it |
| --- | --- |
| `design-system/tokens.json` | Every token (colour with oklch + hex, type, space, radius, motion, touch). Source for the rest. |
| `design-system/tokens.css` | The same tokens as `--mmpos-*` CSS variables. |
| `design-system/themes.css` | `mmpos` (dark, official) and `mmpos-light` (proposed) as plain CSS variables. |
| `design-system/daisyui-theme.css` | The two themes as daisyUI 5 / Tailwind 4 `@plugin "daisyui/theme"` blocks. `mmpos` is identical to what the apps ship. |
| `design-system/guidelines.md` | Principles, colour roles, typography, layout, density, money and number formatting. |
| `design-system/components.md` | How the app's recurring components are built (header, KPI, badges, tables, modals, tiles, tickets). |
| `design-system/iconography.md` | Icon library rules, the module → icon map and how the brand mark is constructed. |
| `design-system/accessibility.md` | Measured contrast of every important colour pair, with one known issue. |
| `design-system/preview.html` | Living style guide: open it in a browser. |
| `brand/logos/` | SVGs: symbol (3 colours), app icon (gradient, flat, black/white), horizontal logo (dark / light bg), white, monochrome, stacked, wordmark. Wordmark outlined — no fonts needed. |
| `brand/app-icons/` | Exports: `icon-1024.png`, `icon-512.png` (full-bleed: Windows, web, in-app), `icon-macos-*.png` + `icon.icns` (Apple grid), `icon-windows-*.png` + `icon.ico` (Windows 11 grid), `icon.ico` (Windows), `ticket-brand.png` (thermal ticket signature). |
| `brand/brand-guidelines.md` | Logo rules: clear space, minimum sizes, colour variants, don'ts, ticket signature. |
| `assets/` | `favicon.svg`, PNG favicons, `brand-board.png`. |
| `examples/react/BrandMark.jsx` | The mark as a React component (inherits `currentColor`). Copied into both apps. |
| `scripts/` | `build.mjs` generates tokens/themes/SVGs; `export-icons.cjs` renders the PNG/ICO/ICNS/board exports; `wordmark-paths.json` is the outlined wordmark. |

## Quick start

- **Tailwind 4 + daisyUI 5 app:** paste `design-system/daisyui-theme.css` after `@plugin "daisyui";`.
- **Anything else:** `@import "design-system/tokens.css"` and `design-system/themes.css`, then use `var(--mmpos-primary)` etc.; set `data-theme="mmpos"` on `<html>`.
- **React:** `import { BrandMark } from '.../BrandMark.jsx'` and colour it with the text colour of its parent.

## Regenerating

```sh
node design/scripts/build.mjs                       # tokens, themes, SVGs, accessibility.md, manifest
cd ../mmPosApp && env -u ELECTRON_RUN_AS_NODE npx electron ../mmPosWeb/design/scripts/export-icons.cjs   # PNG / ICO / ICNS / board
```

Edit **only** `scripts/build.mjs` (tokens and mark geometry) and the markdown; the rest is generated. After changing the mark, update `BrandMark.jsx` in both apps and re-copy `brand/app-icons/*` into `mmPosApp/resources` and `mmPosApp/build`.

## Foundations at a glance

- **Primary** emerald `#00c486` (`oklch(72.3% 0.163 162.48)`) · **secondary** teal · **accent** amber · **info** sky · **error** red.
- **Surfaces** are three near-blacks: `base-100` cards, `base-200` page, `base-300` header and borders. Flat: borders, not shadows.
- **Type** Plus Jakarta Sans 800 for display (wordmark, page titles, hero numbers), Inter for UI; both bundled with the apps via @fontsource. Tabular numbers for money.
- **Shape** 8px selectors, 6px fields, 12px boxes, 22.5% app icon radius.
- **Touch** 44px minimum, 48px in POS flows, 96px keypad keys.
