# Accessibility — measured contrast

Generated from the official dark theme by `scripts/build.mjs` (WCAG 2.x relative luminance; semi-transparent text is blended onto its surface).

| Pair | Where it is used | Ratio | Result |
| --- | --- | --- | --- |
| base-content on base-100 | Body text on cards | 16.15:1 | AAA |
| base-content on base-200 | Body text on the page | 17.57:1 | AAA |
| base-content 60% on base-100 | Secondary text (labels, hints) | 6.42:1 | AA |
| base-content 50% on base-100 | Subtle text (captions) | 4.84:1 | AA |
| base-content 40% on base-100 | Faint text (placeholders, disabled) | 3.55:1 | AA large / UI only |
| primary-content on primary | Primary button, app icon glyph | 9.02:1 | AAA |
| primary on base-100 | Green text/icons on cards | 7.97:1 | AAA |
| secondary-content on secondary | Secondary button | 8.46:1 | AAA |
| accent-content on accent | Warning / accent badge | 11.67:1 | AAA |
| info-content on info | Info button ("Ver turno") | 8.92:1 | AAA |
| error-content on error | Destructive button | 3.07:1 | AA large / UI only |
| error on base-100 | Red text (shortage, expenses) | 5.41:1 | AA |
| accent on base-100 | Amber text (over / warning) | 10.73:1 | AAA |

## Known issue — white text on the red error button

`error-content` (near white) on `error` is **3.07:1**, below the 4.5:1 needed for small button labels.
Dark text on the same red measures **6.12:1**. Recommended change (not yet applied to the apps): set `--color-error-content` to the same dark ink as the other contents (`oklch(11% 0.002 264)`).

## Rules

- Body and label text must reach **4.5:1**. Anything below that (faint 40% text) is for placeholders and disabled states only, never for information a cashier needs.
- Never rely on colour alone: shortage/over/balanced always carry words ("Faltante", "Sobrante", "Caja cuadrada"); order status is a labelled badge.
- Touch targets are at least **44 px** on the web and **48 px** in POS/shift flows; the keypad uses 96 px keys.
- Focus is always visible (daisyUI focus ring on primary); do not remove outlines.
- The ticket is printed in pure black on white; sizes are in the print style (spacing / text size) and are tested on thermal and system printers.
