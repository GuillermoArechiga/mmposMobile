# Brand guidelines

## Files

| File | Use |
| --- | --- |
| `logos/mmpos-app-icon.svg` | App icon: green gradient rounded square, dark mark. Stores, installers, social avatars. |
| `logos/mmpos-app-icon-macos.svg` | macOS grid: 824 px square with margin and shadow on the 1024 canvas. Used for `icon.icns` and the dev Dock — full-bleed icons look ~25% too big next to other Mac apps. |
| `logos/mmpos-app-icon-windows.svg` | Windows 11 grid: 87.5% plate, Fluent corners, no shadow. Used for `icon.ico` (16–256 px) and the window/taskbar icon. |
| `logos/mmpos-app-icon-flat.svg` | Same, flat brand green (print, small sizes). |
| `logos/mmpos-app-icon-mono.svg` | Black square, white mark. Thermal printing, one-colour stamps. |
| `logos/mmpos-symbol.svg` | The mark alone, dark ink, for light backgrounds. |
| `logos/mmpos-symbol-green.svg` | The mark alone in brand green, for dark backgrounds. |
| `logos/mmpos-symbol-white.svg` | The mark alone in white, for photos and green/coloured fields. |
| `logos/mmpos-logo-horizontal.svg` | Icon + wordmark for **dark** backgrounds ("mm" light, "POS" green). |
| `logos/mmpos-logo-horizontal-light.svg` | Icon + wordmark for **light** backgrounds ("mm" ink, "POS" deep green). |
| `logos/mmpos-logo-stacked.svg` | Square formats. |
| `logos/mmpos-logo-white.svg` / `-monochrome.svg` | One-colour uses. |
| `logos/mmpos-wordmark.svg` | Name only. |
| `app-icons/*` | `icon-1024.png`, `icon-512.png`, `icon.icns`, `icon.ico`, `ticket-brand.png`. |

The wordmark is **Plus Jakarta Sans 800** at −0.02em tracking, already outlined in every SVG (no font needed anywhere). Regenerate `scripts/wordmark-paths.json` only if the typeface changes.

## Clear space and minimum size

- Clear space: **¼ of the app icon's width** on every side.
- Minimum: symbol 16 px (use the favicon weight), app icon 16 px, horizontal logo 24 px tall (96 px wide).
- Thermal signature: ≈ 190 × 48 dots (≈ 25 × 6 mm); on system printers 6 mm tall (5 mm on 58 mm paper).

## Colour

Official green `#00c486` (`oklch(72.3% 0.163 162.48)`), ink `#040405`, light text `#f4f4f5`. On light backgrounds the "POS" uses deep green `#007e54` (`oklch(52% 0.12 162.5)`) because the bright green is only ~2:1 on white.

## Don't

- Don't recolour the mark, add outlines or shadows, rotate or stretch it.
- Don't redraw the bag or utensils; use the supplied SVGs.
- Don't put the green icon on a green field; use the white or dark symbol instead.
- Don't use the old fork-and-spoon or fork-and-bag icons.
- Don't set the wordmark in another typeface; use the SVGs.

## Ticket signature

Customer tickets end with the **mark and "mmPOS" on one row, then `https://mmpos.cc`**, centred and small. It is printed on receipts and pre-checks only (never kitchen, bar, shift or inventory tickets). Thermal printers get `ticket-brand.png` as a raster image; system printers get the same black-and-white image; without the image the name prints as bold text.
