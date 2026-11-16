# Components

How the recurring pieces are built. Class names are Tailwind 4 + daisyUI 5 as used in the apps.

## Buttons

| Intent | Recipe | Example |
| --- | --- | --- |
| Main action (one per view) | `btn btn-primary` | Abrir turno, Guardar |
| Informational / navigation to detail | `btn btn-info` | Ver turno |
| Neutral | `btn btn-outline border-base-300` or `btn btn-ghost` | Actualizar, Atrás |
| Destructive | `btn btn-error btn-outline` | Cancelar orden |
| Filter chip | `btn btn-xs h-7 rounded-full`, active = `btn-primary` | Status filters |

Sizes: `btn-sm` (web dashboard), default 48px and `lg` in POS and shift flows. Icons are 14–18px, 2px stroke, with `gap-1.5`.

## Page header

Tinted icon box (`h-9 w-9 rounded-xl`, colour at 10% + the colour for the icon; tones: emerald, sky, pink, violet, amber, teal, rose, indigo), title (`text-xl font-bold`), subtitle (`text-sm`, 55%), actions right. One shared `PageHeader` component on every page.

## Cards and KPIs

- Card: `bg-base-100 border border-base-300 rounded-xl`, padding 16.
- KPI card: icon badge (36px, tinted), value `text-2xl font-bold tabular-nums`, label 12px at 50–60%, optional trend vs previous period (green up / red down).
- Stat strip: several `StatSegment`s in one divided card (icon, value, label, hint).
- Payment tiles on the shift page: **Cash · Card · Others · Total**; "Others" sums every other active method and lists them underneath.

## Badges

`badge badge-sm`. Order status: pending/billing → warning, in progress/served → info, completed/paid → success, canceled → error. Shift status: open = success, closed = outline. Cash result: `badge-soft` — balanced success, short error, over warning, not counted ghost.

## Tables and lists

Desktop: `table table-sm`, uppercase 12px muted headers, right-aligned tabular numbers, clickable rows use the pointer and expand in place. Phone: one **card per row** (id + status + total on the first line, details wrapped below, actions at the end).

Shift groups: a band above each shift's rows with the title, status badge, opener, location, times, opening cash, the cash result, total and the info "Ver turno" button.

## Modals

`modal modal-open modal-middle`; box `w-[calc(100%-2rem)] max-w-4xl max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden p-0`. Fixed header with title and close, **one** scrolling body (`min-h-0 flex-1 overflow-y-auto`), sections as bordered cards that can shrink (`min-w-0`). Escape and the backdrop close it.

## Forms and POS inputs

Fields: 6px radius, 1px border, label above. Money inputs are numeric with entry limits (barcodes can't land in an amount). The cash keypad (`Keypad`) has 96px keys; the open-shift pad shows keypad left and actions right, with the primary action reading "Abrir".

## Shift

- **Open shift:** keypad modal for the opening cash.
- **Expenses:** "Agregar gasto" opens a fixed-height modal (list scrolls); the close dialog asks for counted cash first, then shows expenses and a live summary (opening + cash sales − expenses = expected; difference with words).
- **History:** collapsible rows; KPIs (payment tiles, expenses, orders) always visible, cash count and expenses as matching cards when expanded.

## Tickets

Customer receipt and pre-check: header, optional address and phone, title, meta rows (order, date, table, waiter, operator), items with notes and extras, totals, payment, footer, signature. Kitchen/bar: large items, notes. Shift close: sales, top products, payments, cash session, cancellations and removals as totals, orders, signature lines. Print style (spacing / size / font) applies to all.

## States

Loading uses skeletons that match the final layout; empty states are one sentence plus the next action; errors are an `alert alert-error` with a plain-language message, never a raw backend string.
