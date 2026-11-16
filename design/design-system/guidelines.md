# Guidelines

## Principles

1. **Calm over loud.** Dark, low-chroma surfaces; colour is reserved for meaning and for the one primary action on a screen.
2. **One green.** Primary emerald is the brand, the main action, success and "paid". Do not introduce a second brand colour.
3. **Restaurant and shop, same product.** Nothing in the chrome is restaurant-only or retail-only. Differences (tables, kitchen tickets) are content, shown only when the device is set up for them.
4. **Built for touch and for speed.** Large targets, few taps, numbers you can read across the counter.
5. **Say it in words too.** Colour never carries a status alone.

## Colour roles

| Role | Token | Use |
| --- | --- | --- |
| Page | `base-200` | App background |
| Card / elevated | `base-100` | Cards, modals, table surfaces |
| Header / deepest / borders | `base-300` | Top bar, dividers, card borders |
| Text | `base-content` (+ alpha) | 100% titles, 70% body detail, 60% labels, 50% captions, 40% placeholders only |
| Primary | `primary` / `primary-content` | Main button, active filter, success, paid, brand mark |
| Secondary | `secondary` | Secondary accents and charts |
| Accent / warning | `accent` | Over, pending, low stock, notices |
| Info | `info` | Informational actions and open shifts (e.g. **Ver turno**) |
| Error | `error` | Destructive actions, shortage, cancellations, expenses |
| Neutral | `neutral` | Quiet fills |

**Domain colours** (fixed identities, never reassigned by rank): module gradients (shift sky→blue, products amber→orange, inventory teal→emerald, reports violet→purple, settings zinc), page-header tones, expense categories, order status → semantic colour, cash result (balanced green / short red / over amber). Full lists are in `tokens.json`.

**Rules**

- Text on a coloured surface uses that colour's `-content` token.
- Tints are the colour at 10% opacity with the colour itself for the icon/text (icon boxes, page-header icons).
- Use at most one filled `primary` button per view.
- Red means money lost or an irreversible action; never use it for decoration.

## Typography

Two faces, both bundled with the apps (`@fontsource`), never taken from the OS:

- **Display — Plus Jakarta Sans 800**, tracking −0.02em: the wordmark, page titles, the dashboard hero (business name, clock) and big totals. Rounded, friendly, matches the arches of the mark.
- **UI — Inter** 400–700: everything else.

Scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60.

- Money, quantities and times use `tabular-nums`.
- Labels above values: 12px, 500, 50–60% content. Values: 16–24px, 700.
- Uppercase labels (table headers, section kickers) use 12px with `tracking-wide`.

## Layout

- 4px spacing grid; page gutter and card padding 16px (24px for hero cards).
- Cards: `base-100`, 1px `base-300` border, 12px radius (16px for hero). No shadows.
- Page header on every dashboard page: tinted icon box + title + subtitle, actions on the right.
- **Modals** are cards inset 16px from the screen edge on phones: fixed header, one scrolling body, max height `100dvh − 2rem`.
- **Tables** become one card per row below `md` (768px); nothing scrolls sideways on a phone.
- Filters wrap on phones; they only scroll sideways on desktop.

## Density and touch

The Electron POS runs on touchscreens. Targets are at least 44px everywhere and 48px in POS, shift and payment flows; the numeric keypad uses 96px keys. Hover is a bonus, never the only affordance. Every clickable control shows the pointer cursor (base CSS rule), disabled ones keep the arrow.

## Money, numbers, dates

- Money is shown with the business currency, always 2 decimals (`MX$1,428.50`); headline figures may drop cents.
- Negatives use a true minus **−**, never a hyphen; expenses and shortages are red.
- Quantities show at most 2 decimals; weighed items show kg with 3 decimals on tickets.
- Dates are written for the locale (es-MX / en-US); orders and shifts show their creation or open time, not print time.

## Language

Spanish first, English second; every string is translated. Tone is direct and short: verbs on buttons ("Abrir turno", "Agregar gasto"), plain words for cash control ("Caja cuadrada", "Faltante", "Sobrante"). System reasons stored in English are translated when displayed.

## Tickets

Pure black on white. Sections in order: business, title, order info, items, totals, payments, footer, the mmPOS signature (mark + name on one row, then `https://mmpos.cc`). The print style (spacing, text size, font for system printers) is device-wide and shown exactly in the designer's preview. Restaurant tickets add table, waiter and kitchen notes; retail tickets are simpler and never show a table.

## Do / Don't

- Do reuse tokens; don't hard-code hex values in components (except the fixed domain palettes above).
- Do pair every status colour with text; don't use colour alone.
- Do keep one primary action per view; don't add another brand colour.
- Do show the mark on the green rounded square or in one flat colour; don't recolour, outline, rotate or stretch it.
