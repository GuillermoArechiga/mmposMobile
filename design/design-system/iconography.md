# Iconography

## Library and rules

**lucide-react**, 24px grid, **2px stroke, round caps and joins**, `currentColor`. Sizes: 14 (inline with text), 16, 18 (buttons), 20, 24 (navigation, cards). Icon-only buttons need an `aria-label`. Don't mix in filled or two-tone icons.

## Module map

| Module | Icon | Notes |
| --- | --- | --- |
| POS / Vender | `ShoppingCart` | brand green |
| Turnos | `WalletCards` | sky → blue |
| Productos | `Package` | amber → orange |
| Inventario | `Boxes` (app) · `Warehouse` (web) | teal → emerald |
| Reportes | `BarChart3` | violet → purple |
| Configuración | `Settings` | zinc |
| Órdenes | `ClipboardList` | web |
| Gastos | `Wallet` | web |
| Sucursales | `MapPin` | web |
| Integraciones | `Plug` | |
| Estadísticas | `LayoutDashboard` | web |

## Domain icons

| Concept | Icon |
| --- | --- |
| Cash / drawer expense | `Banknote` |
| Card | `CreditCard` |
| Wallet / online | `Wallet`, `Globe` |
| Other payment methods (sum) | `Layers` |
| Shift | `Timer`, `Clock` |
| Person / staff | `User`, `Users` |
| Cancel / removed | `Ban` |
| Sales / trend | `TrendingUp` |
| Receipt / ticket | `Receipt` |
| Top products | `Trophy` |
| Print | `Printer` |
| Table | `Table2` |
| Detail panel | `PanelRightOpen` |

## The mmPOS mark

**"m."** — two rounded arches and a period on the baseline. The m is the start of the name; the dot is the *point* of sale. It is deliberately not a fork, a bag or a cart: mmPOS serves restaurants and shops alike, and a monogram stays neutral while the line weight ties it to the icon set.

Construction (24 × 24 grid):

- Arches: `M3.2 17.5V11a3.5 3.5 0 0 1 7 0v6.5M10.2 11a3.5 3.5 0 0 1 7 0v6.5`, stroke 2.9, round caps.
- Dot: circle at (20.9, 17.4), r 1.75, filled.
- The group is inset 3.6 and scaled 0.7 so the mark sits optically centred in its box.
- Favicon weight: stroke × 1.15 so the arches hold at 16 px.

App icon: rounded square (radius 23.5% of the side) with a subtle top-left-lit gradient of the brand green (`#19d79a → #00a676`); flat `#00c486` for in-app use and the favicon; black square + white mark for thermal printing.

Source files: `brand/logos/mmpos-symbol*.svg`, `mmpos-app-icon*.svg`; React: `examples/react/BrandMark.jsx` (geometry generated from the same constants).
