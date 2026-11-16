/** Colour helpers. Pure functions so guard tests can run them under `node --test`. */

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value.slice(0, 6)
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`Not a hex colour: ${hex}`)
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number]
}

/** `#rrggbb` + opacity 0..1 → `#rrggbbaa` (React Native understands 8-digit hex). */
export function withOpacity(hex: string, opacity: number): string {
  const [r, g, b] = parseHex(hex)
  const alpha = Math.round(Math.min(1, Math.max(0, opacity)) * 255)
  return `#${[r, g, b, alpha].map((n) => n.toString(16).padStart(2, '0')).join('')}`
}

function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio between two opaque colours (1..21). */
export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}
