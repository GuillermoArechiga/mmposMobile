// Generates the mmPOS design package from ONE source of truth (this file):
//   design-system/tokens.json · tokens.css · themes.css · daisyui-theme.css · accessibility.md
//   brand/logos/*.svg · assets/favicon.svg · examples/react/BrandMark.jsx
//
//   node design/scripts/build.mjs
//
// PNG / ICO / ICNS exports and the brand board come from export-icons.cjs
// (needs Electron: see scripts/README.md).
import { mkdirSync, writeFileSync, readdirSync, statSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = (p, content) => {
  const file = join(ROOT, p)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

// ── colour maths ───────────────────────────────────────────────────────────
const oklchToHex = (L, C, h) => {
  const a = C * Math.cos((h * Math.PI) / 180)
  const b = C * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ]
  const enc = (x) => {
    x = Math.max(0, Math.min(1, x))
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
  }
  return '#' + lin.map((v) => Math.round(enc(v) * 255).toString(16).padStart(2, '0')).join('')
}
const ok = (L, C, h) => ({ oklch: `oklch(${L}% ${C} ${h})`, hex: oklchToHex(L / 100, C, h) })
const hexOnly = (hex) => ({ hex })

const luminance = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const mix = (fg, bg, alpha) => {
  const f = [1, 3, 5].map((i) => parseInt(fg.slice(i, i + 2), 16))
  const g = [1, 3, 5].map((i) => parseInt(bg.slice(i, i + 2), 16))
  return '#' + f.map((v, i) => Math.round(v * alpha + g[i] * (1 - alpha)).toString(16).padStart(2, '0')).join('')
}

// ── OFFICIAL theme: copied from src/index.css (dark, shipped) ──────────────
const dark = {
  base100: ok(20, 0.004, 264), // cards, elevated surfaces
  base200: ok(15, 0.003, 264), // page background
  base300: ok(11, 0.002, 264), // header, deepest surface, borders
  baseContent: ok(96, 0.002, 264),
  primary: ok(72.3, 0.163, 162.48), // emerald
  primaryContent: ok(11, 0.002, 264),
  secondary: ok(70.4, 0.14, 182.5), // teal
  secondaryContent: ok(11, 0.002, 264),
  accent: ok(82.8, 0.141, 97.3), // amber
  accentContent: ok(15, 0.003, 264),
  neutral: ok(35, 0.004, 264),
  neutralContent: ok(96, 0.002, 264),
  info: ok(72, 0.149, 213.1),
  infoContent: ok(11, 0.002, 264),
  success: ok(72.3, 0.163, 162.48),
  successContent: ok(11, 0.002, 264),
  warning: ok(82.8, 0.141, 97.3),
  warningContent: ok(15, 0.003, 264),
  error: ok(66.5, 0.195, 21.2),
  errorContent: ok(97, 0.001, 264)
}

// ── PROPOSED light theme: same brand colours and contents, light surfaces ──
const light = {
  ...dark,
  base100: ok(100, 0, 0),
  base200: ok(97.5, 0.003, 264),
  base300: ok(92, 0.004, 264),
  baseContent: ok(21, 0.006, 264),
  neutral: ok(30, 0.005, 264),
  neutralContent: ok(97, 0.002, 264)
}

const radius = { selector: '0.5rem', field: '0.375rem', box: '0.75rem' }

// Domain palettes taken from the code (Tailwind hexes where the apps use utilities)
const domain = {
  module: {
    pos: { from: dark.primary.hex, to: '#059669', note: 'Vender / POS — brand green' },
    shift: { from: '#38bdf8', to: '#2563eb', note: 'sky-400 → blue-600' },
    products: { from: '#fbbf24', to: '#f97316', note: 'amber-400 → orange-500' },
    inventory: { from: '#2dd4bf', to: '#059669', note: 'teal-400 → emerald-600' },
    reports: { from: '#a78bfa', to: '#9333ea', note: 'violet-400 → purple-600' },
    settings: { from: '#a1a1aa', to: '#52525b', note: 'zinc-400 → zinc-600' }
  },
  pageTone: {
    emerald: '#34d399',
    sky: '#38bdf8',
    pink: '#f472b6',
    violet: '#a78bfa',
    amber: '#fbbf24',
    teal: '#2dd4bf',
    rose: '#fb7185',
    indigo: '#818cf8'
  },
  expenseCategory: {
    RENT: '#3987e5',
    SALARIES: '#d95926',
    UTILITIES: '#199e70',
    INTERNET_PHONE: '#c98500',
    TAXES: '#d55181',
    INSURANCE: '#008300',
    MARKETING: '#9085e9',
    LOAN: '#e66767',
    OTHER: '#8b8a85',
    DRAWER: '#2aa8b8'
  },
  orderStatus: {
    PENDING: 'warning',
    IN_PROGRESS: 'info',
    SERVED: 'info',
    BILLING: 'warning',
    COMPLETED: 'success',
    PAID: 'success',
    CANCELED: 'error'
  },
  cashResult: { balanced: 'success', short: 'error', over: 'warning', notCounted: 'neutral', open: 'info' },
  paymentTile: { CASH: 'success', CARD: 'primary', WALLET: 'info', ONLINE: 'info', OTHER: 'warning', OTHERS: 'info' }
}

const typography = {
  fontDisplay: "'Plus Jakarta Sans', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontMono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace",
  scale: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem' },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, black: 900 },
  lineHeight: { tight: 1.15, snug: 1.35, normal: 1.5, ticket: 1.45 },
  bundling: 'Both faces ship with the apps via @fontsource (Inter variable for UI, Plus Jakarta Sans 700/800 for display). Never rely on the OS having Inter — Windows tills do not.',
  rules: ['Display (wordmark, page titles, hero numbers): Plus Jakarta Sans 800, tracking -0.02em.', 'UI and body: Inter 400–700.', 'Numbers in tables, totals and tickets use tabular-nums.', 'Labels use 12px medium at 50–60% content.']
}

const tokens = {
  meta: {
    name: 'mmPOS Design System',
    version: '2.0.0',
    updated: '2026-11-11',
    source: 'Colours and shape are the shipped dark theme in mmPosWeb/src/index.css and mmPosApp/src/renderer/src/assets/main.css. The light theme is a proposal.',
    intent: 'A point of sale for restaurants AND shops: calm dark surfaces, one confident green, line icons. The mark is the "m." monogram — the dot is the point of sale.'
  },
  color: {
    surface: { base100: dark.base100, base200: dark.base200, base300: dark.base300 },
    text: { content: dark.baseContent },
    brand: { primary: dark.primary, secondary: dark.secondary, accent: dark.accent, neutral: dark.neutral },
    semantic: { info: dark.info, success: dark.success, warning: dark.warning, error: dark.error },
    onColor: {
      primary: dark.primaryContent, secondary: dark.secondaryContent, accent: dark.accentContent,
      neutral: dark.neutralContent, info: dark.infoContent, success: dark.successContent,
      warning: dark.warningContent, error: dark.errorContent
    },
    module: domain.module,
    pageTone: domain.pageTone,
    expenseCategory: domain.expenseCategory,
    status: { order: domain.orderStatus, cashResult: domain.cashResult, paymentTile: domain.paymentTile },
    print: { ink: hexOnly('#000000'), paper: hexOnly('#ffffff') }
  },
  opacity: { text: 1, textSecondary: 0.7, textMuted: 0.6, textSubtle: 0.5, textFaint: 0.4, disabled: 0.5, tintBackground: 0.1 },
  typography,
  space: { unit: '4px', scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64], pageGutter: '16px', cardPadding: '16px', cardPaddingLarge: '24px' },
  radius: { ...radius, card: '0.75rem', hero: '1rem', pill: '9999px', appIcon: '22.5%' },
  border: { width: '1px', color: 'base300' },
  elevation: { depth: 0, noise: 0, note: 'Flat. Separate with borders; shadows only on modals (shadow-lg) and hover lift on tappable cards.' },
  motion: { fast: '150ms', base: '200ms', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  touch: { minTarget: '44px', button: '48px', keypadKey: '96px', note: 'The Electron POS runs on touchscreens: controls in POS/shift flows are at least 48px.' },
  breakpoint: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', note: 'Below md the web Orders table becomes cards.' },
  icon: { library: 'lucide-react', stroke: 2, caps: 'round', joins: 'round', sizes: [14, 16, 18, 20, 24] }
}
out('design-system/tokens.json', JSON.stringify(tokens, null, 2) + '\n')

// ── tokens.css ─────────────────────────────────────────────────────────────
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-z])(\d)/g, '$1-$2').toLowerCase()
const cssColor = (c) => c.oklch ?? c.hex
let css = `/* mmPOS design tokens — generated by design/scripts/build.mjs. Do not edit by hand. */\n:root {\n`
const vars = (title, obj, fn = cssColor) => {
  css += `\n  /* ${title} */\n`
  for (const [k, v] of Object.entries(obj)) css += `  --mmpos-${kebab(k)}: ${fn(v)};\n`
}
vars('Surfaces and text (dark, official)', { base100: dark.base100, base200: dark.base200, base300: dark.base300, baseContent: dark.baseContent })
vars('Brand', { primary: dark.primary, primaryContent: dark.primaryContent, secondary: dark.secondary, secondaryContent: dark.secondaryContent, accent: dark.accent, accentContent: dark.accentContent, neutral: dark.neutral, neutralContent: dark.neutralContent })
vars('Semantic', { info: dark.info, infoContent: dark.infoContent, success: dark.success, successContent: dark.successContent, warning: dark.warning, warningContent: dark.warningContent, error: dark.error, errorContent: dark.errorContent })
vars('Expense categories', Object.fromEntries(Object.entries(domain.expenseCategory).map(([k, v]) => [`expense${k[0]}${k.slice(1).toLowerCase().replace(/_(.)/g, (_, c) => c.toUpperCase())}`, v])), (v) => v)
vars('Page header tones', Object.fromEntries(Object.entries(domain.pageTone).map(([k, v]) => [`tone-${k}`, v])), (v) => v)
css += `\n  /* Type */\n  --mmpos-font-display: ${typography.fontDisplay};\n  --mmpos-font-sans: ${typography.fontSans};\n  --mmpos-font-mono: ${typography.fontMono};\n`
css += `\n  /* Shape */\n  --mmpos-radius-selector: ${radius.selector};\n  --mmpos-radius-field: ${radius.field};\n  --mmpos-radius-box: ${radius.box};\n  --mmpos-radius-card: 0.75rem;\n  --mmpos-radius-hero: 1rem;\n  --mmpos-border: 1px;\n`
css += `\n  /* Space (4px grid) */\n  --mmpos-space-1: 4px;\n  --mmpos-space-2: 8px;\n  --mmpos-space-3: 12px;\n  --mmpos-space-4: 16px;\n  --mmpos-space-6: 24px;\n  --mmpos-space-8: 32px;\n  --mmpos-page-gutter: 16px;\n`
css += `\n  /* Motion and touch */\n  --mmpos-motion-fast: 150ms;\n  --mmpos-motion-base: 200ms;\n  --mmpos-ease: cubic-bezier(0.4, 0, 0.2, 1);\n  --mmpos-touch-min: 44px;\n  --mmpos-touch-button: 48px;\n  --mmpos-touch-key: 96px;\n}\n`
out('design-system/tokens.css', css)

// ── themes.css ─────────────────────────────────────────────────────────────
const themeVars = (t) =>
  [
    ['base-100', t.base100], ['base-200', t.base200], ['base-300', t.base300], ['base-content', t.baseContent],
    ['primary', t.primary], ['primary-content', t.primaryContent], ['secondary', t.secondary], ['secondary-content', t.secondaryContent],
    ['accent', t.accent], ['accent-content', t.accentContent], ['neutral', t.neutral], ['neutral-content', t.neutralContent],
    ['info', t.info], ['info-content', t.infoContent], ['success', t.success], ['success-content', t.successContent],
    ['warning', t.warning], ['warning-content', t.warningContent], ['error', t.error], ['error-content', t.errorContent]
  ].map(([k, v]) => `  --mmpos-${k}: ${v.oklch};`).join('\n')
out(
  'design-system/themes.css',
  `/* mmPOS themes — generated by design/scripts/build.mjs. Do not edit by hand.
   mmpos        = the shipped theme (dark). Official.
   mmpos-light  = PROPOSED light theme: identical brand colours and "content" colours,
                  light surfaces only. Not used by any app yet. */
:root,
[data-theme="mmpos"] {
  color-scheme: dark;
${themeVars(dark)}
}

[data-theme="mmpos-light"] {
  color-scheme: light;
${themeVars(light)}
}
`
)

// ── daisyui-theme.css ──────────────────────────────────────────────────────
const daisy = (name, t, isDefault, scheme) => `@plugin "daisyui/theme" {
  name: "${name}";
  default: ${isDefault};
  prefersdark: ${scheme === 'dark'};
  color-scheme: ${scheme};

  --color-base-100: ${t.base100.oklch};
  --color-base-200: ${t.base200.oklch};
  --color-base-300: ${t.base300.oklch};
  --color-base-content: ${t.baseContent.oklch};

  --color-primary: ${t.primary.oklch};
  --color-primary-content: ${t.primaryContent.oklch};
  --color-secondary: ${t.secondary.oklch};
  --color-secondary-content: ${t.secondaryContent.oklch};
  --color-accent: ${t.accent.oklch};
  --color-accent-content: ${t.accentContent.oklch};
  --color-neutral: ${t.neutral.oklch};
  --color-neutral-content: ${t.neutralContent.oklch};

  --color-info: ${t.info.oklch};
  --color-info-content: ${t.infoContent.oklch};
  --color-success: ${t.success.oklch};
  --color-success-content: ${t.successContent.oklch};
  --color-warning: ${t.warning.oklch};
  --color-warning-content: ${t.warningContent.oklch};
  --color-error: ${t.error.oklch};
  --color-error-content: ${t.errorContent.oklch};

  --radius-selector: ${radius.selector};
  --radius-field: ${radius.field};
  --radius-box: ${radius.box};
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}
`
out(
  'design-system/daisyui-theme.css',
  `/* daisyUI 5 / Tailwind 4 themes for mmPOS — generated. Paste after @plugin "daisyui";
   "mmpos" is byte-for-byte the theme the apps ship today. "mmpos-light" is proposed. */
${daisy('mmpos', dark, true, 'dark')}
${daisy('mmpos-light', light, false, 'light')}`
)

// ── accessibility.md (computed contrast) ───────────────────────────────────
const pair = (fgName, fg, bgName, bg, use) => {
  const r = contrast(fg, bg)
  return `| ${fgName} on ${bgName} | ${use} | ${r.toFixed(2)}:1 | ${r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large / UI only' : 'FAIL'} |`
}
const d = (k) => dark[k].hex
const rows = [
  pair('base-content', d('baseContent'), 'base-100', d('base100'), 'Body text on cards'),
  pair('base-content', d('baseContent'), 'base-200', d('base200'), 'Body text on the page'),
  pair('base-content 60%', mix(d('baseContent'), d('base100'), 0.6), 'base-100', d('base100'), 'Secondary text (labels, hints)'),
  pair('base-content 50%', mix(d('baseContent'), d('base100'), 0.5), 'base-100', d('base100'), 'Subtle text (captions)'),
  pair('base-content 40%', mix(d('baseContent'), d('base100'), 0.4), 'base-100', d('base100'), 'Faint text (placeholders, disabled)'),
  pair('primary-content', d('primaryContent'), 'primary', d('primary'), 'Primary button, app icon glyph'),
  pair('primary', d('primary'), 'base-100', d('base100'), 'Green text/icons on cards'),
  pair('secondary-content', d('secondaryContent'), 'secondary', d('secondary'), 'Secondary button'),
  pair('accent-content', d('accentContent'), 'accent', d('accent'), 'Warning / accent badge'),
  pair('info-content', d('infoContent'), 'info', d('info'), 'Info button ("Ver turno")'),
  pair('error-content', d('errorContent'), 'error', d('error'), 'Destructive button'),
  pair('error', d('error'), 'base-100', d('base100'), 'Red text (shortage, expenses)'),
  pair('accent', d('accent'), 'base-100', d('base100'), 'Amber text (over / warning)')
]
out(
  'design-system/accessibility.md',
  `# Accessibility — measured contrast

Generated from the official dark theme by \`scripts/build.mjs\` (WCAG 2.x relative luminance; semi-transparent text is blended onto its surface).

| Pair | Where it is used | Ratio | Result |
| --- | --- | --- | --- |
${rows.join('\n')}

## Known issue — white text on the red error button

\`error-content\` (near white) on \`error\` is **${contrast(d('errorContent'), d('error')).toFixed(2)}:1**, below the 4.5:1 needed for small button labels.
Dark text on the same red measures **${contrast(d('primaryContent'), d('error')).toFixed(2)}:1**. Recommended change (not yet applied to the apps): set \`--color-error-content\` to the same dark ink as the other contents (\`oklch(11% 0.002 264)\`).

## Rules

- Body and label text must reach **4.5:1**. Anything below that (faint 40% text) is for placeholders and disabled states only, never for information a cashier needs.
- Never rely on colour alone: shortage/over/balanced always carry words ("Faltante", "Sobrante", "Caja cuadrada"); order status is a labelled badge.
- Touch targets are at least **44 px** on the web and **48 px** in POS/shift flows; the keypad uses 96 px keys.
- Focus is always visible (daisyUI focus ring on primary); do not remove outlines.
- The ticket is printed in pure black on white; sizes are in the print style (spacing / text size) and are tested on thermal and system printers.
`
)

// ── SVG brand ──────────────────────────────────────────────────────────────
// The mark: "m." — two rounded arches and a period on the baseline. The dot
// is the point (of sale). Drawn on a 24-grid, 2px-class stroke like the icons.
const MARK = {
  arches: 'M3.2 17.5V11a3.5 3.5 0 0 1 7 0v6.5M10.2 11a3.5 3.5 0 0 1 7 0v6.5',
  dot: { cx: 20.9, cy: 17.4, r: 1.75 },
  stroke: 2.9,
  // inset so the mark sits optically centred in its box
  box: { x: 3.6, y: 3.6, scale: 0.7 }
}
const glyph = (ink, weight = 1) =>
  `<g transform="translate(${MARK.box.x} ${MARK.box.y}) scale(${MARK.box.scale})" fill="none" stroke="${ink}" stroke-width="${MARK.stroke * weight}" stroke-linecap="round" stroke-linejoin="round"><path d="${MARK.arches}"/><circle cx="${MARK.dot.cx}" cy="${MARK.dot.cy}" r="${MARK.dot.r}" fill="${ink}" stroke="none"/></g>`

const GREEN = dark.primary.hex
const INK = dark.primaryContent.hex
const LIGHT_TEXT = dark.baseContent.hex
const DEEP_GREEN = oklchToHex(0.52, 0.12, 162.5) // "POS" on light backgrounds (readable)
const GRAD = ['#19d79a', '#00a676'] // app-icon gradient: brand green, lit top-left

const svg = (w, h, body, title, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">\n  <title>${title}</title>${defs ? `\n  <defs>${defs}</defs>` : ''}\n${body}\n</svg>\n`
const gradDef = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${GRAD[0]}"/><stop offset="1" stop-color="${GRAD[1]}"/></linearGradient>`

// mark placed in a square of `size` (glyph fills the 24-grid, i.e. 100% of the square)
const placed = (size, ink, x = 0, y = 0, weight = 1) =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})">${glyph(ink, weight)}</g>`
const square = (size, fill, x = 0, y = 0) =>
  `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.235}" fill="${fill}"/>`

// Wordmark: Plus Jakarta Sans 800 outlined once (scripts/wordmark-paths.json), so no font is needed.
const WM = JSON.parse(readFileSync(join(ROOT, 'scripts/wordmark-paths.json'), 'utf8'))
const word = (x, y, capHeight, c1, c2) => {
  // WM is drawn at size 100 with the baseline at y=74; scale so the cap height matches
  const k = capHeight / 72
  return `<g transform="translate(${x} ${y - 74 * k}) scale(${k})"><path d="${WM.mm}" fill="${c1}"/><path d="${WM.pos}" fill="${c2}"/></g>`
}
const wordWidth = (capHeight) => (WM.width * capHeight) / 72

out('brand/logos/mmpos-symbol.svg', svg(240, 240, `  ${placed(240, INK)}`, 'mmPOS symbol'))
out('brand/logos/mmpos-symbol-green.svg', svg(240, 240, `  ${placed(240, GREEN)}`, 'mmPOS symbol (green, for dark backgrounds)'))
out('brand/logos/mmpos-symbol-white.svg', svg(240, 240, `  ${placed(240, '#ffffff')}`, 'mmPOS symbol (white)'))
out('brand/logos/mmpos-app-icon.svg', svg(1024, 1024, `  ${square(1024, 'url(#g)')}\n  ${placed(1024, INK)}`, 'mmPOS app icon', gradDef('g')))
// macOS icon grid (Big Sur+): 1024 canvas, 824 rounded square at (100,100), corner
// radius 185.4, soft drop shadow in the margin. Full-bleed icons look ~25% too big
// in the Dock next to every other app, so the .icns and the dev dock use this one.
out(
  'brand/logos/mmpos-app-icon-macos.svg',
  svg(
    1024, 1024,
    `  <g filter="url(#s)">\n    <rect x="100" y="100" width="824" height="824" rx="185.4" fill="url(#g)"/>\n  </g>\n  ${placed(824, INK, 100, 100)}`,
    'mmPOS app icon (macOS grid)',
    gradDef('g') + '<filter id="s" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity="0.3"/></filter>'
  )
)
// Windows 11 grid: the plate sits inside a small margin (896 of 1024 = 87.5%)
// with Fluent's tighter corners and no shadow, so it stays crisp at 16–32 px
// in the taskbar and Start next to other apps. Used for icon.ico and the window icon.
out(
  'brand/logos/mmpos-app-icon-windows.svg',
  svg(
    1024, 1024,
    `  <rect x="64" y="64" width="896" height="896" rx="168" fill="url(#g)"/>\n  ${placed(896, INK, 64, 64)}`,
    'mmPOS app icon (Windows 11 grid)',
    gradDef('g')
  )
)
out('brand/logos/mmpos-app-icon-flat.svg', svg(1024, 1024, `  ${square(1024, GREEN)}\n  ${placed(1024, INK)}`, 'mmPOS app icon (flat green)'))
out('brand/logos/mmpos-app-icon-mono.svg', svg(1024, 1024, `  ${square(1024, '#000000')}\n  ${placed(1024, '#ffffff')}`, 'mmPOS app icon (black and white, for thermal printing)'))
out('assets/favicon.svg', svg(64, 64, `  ${square(64, GREEN)}\n  ${placed(64, INK, 0, 0, 1.15)}`, 'mmPOS'))

const CAP = 64
const horizontal = (bg, markInk, c1, c2, title = 'mmPOS') => {
  const w = 96 + 22 + wordWidth(CAP) + 8
  const mark = bg === 'grad' ? `${square(96, 'url(#g)', 8, 8)}\n  ${placed(96, INK, 8, 8)}`
    : bg === 'mono' ? `${square(96, '#000', 8, 8)}\n  ${placed(96, '#fff', 8, 8)}`
    : placed(96, markInk, 8, 8)
  return svg(Math.ceil(w), 112, `  ${mark}\n  ${word(118, 56 + CAP / 2, CAP, c1, c2)}`, title, bg === 'grad' ? gradDef('g') : '')
}
out('brand/logos/mmpos-logo-horizontal.svg', horizontal('grad', INK, LIGHT_TEXT, GREEN))
out('brand/logos/mmpos-logo-horizontal-light.svg', horizontal('grad', INK, INK, DEEP_GREEN))
out('brand/logos/mmpos-logo-white.svg', horizontal('none', '#ffffff', '#ffffff', '#ffffff'))
out('brand/logos/mmpos-logo-monochrome.svg', horizontal('mono', '#000000', '#000000', '#000000'))
{
  const w = wordWidth(CAP)
  const W = Math.max(260, Math.ceil(w + 16))
  out('brand/logos/mmpos-logo-stacked.svg',
    svg(W, 250, `  ${square(140, 'url(#g)', (W - 140) / 2, 8)}\n  ${placed(140, INK, (W - 140) / 2, 8)}\n  ${word((W - w) / 2, 222, CAP, LIGHT_TEXT, GREEN)}`, 'mmPOS', gradDef('g')))
  out('brand/logos/mmpos-wordmark.svg', svg(Math.ceil(w + 8), 80, `  ${word(4, 66, CAP, LIGHT_TEXT, GREEN)}`, 'mmPOS'))
}

// ── React component (source for both apps) ─────────────────────────────────
out(
  'examples/react/BrandMark.jsx',
  `// The mmPOS mark: "m." — two rounded arches and a period on the baseline (the
// dot is the point of sale). Inherits colour from the parent (currentColor), so
// it works on any surface. Source of truth: design/brand/logos/mmpos-symbol.svg.
export const BrandMark = ({ size = 24, className = '', strokeScale = 1, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    role={title ? 'img' : undefined}
    aria-label={title}
    aria-hidden={title ? undefined : true}
  >
    <g
      transform="translate(${MARK.box.x} ${MARK.box.y}) scale(${MARK.box.scale})"
      fill="none"
      stroke="currentColor"
      strokeWidth={${MARK.stroke} * strokeScale}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="${MARK.arches}" />
      <circle cx="${MARK.dot.cx}" cy="${MARK.dot.cy}" r="${MARK.dot.r}" fill="currentColor" stroke="none" />
    </g>
  </svg>
)
`
)

// ── manifest ───────────────────────────────────────────────────────────────
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    if (f === '.DS_Store' || f === 'manifest.json') return []
    return statSync(p).isDirectory() ? walk(p) : [relative(ROOT, p)]
  })
out('manifest.json', JSON.stringify({ name: 'mmpos-design-system', version: tokens.meta.version, updated: tokens.meta.updated, files: walk(ROOT).sort() }, null, 2) + '\n')
console.log('design package generated')
