// One-off: outlines the wordmark with Plus Jakarta Sans 800 (official TTF from Google Fonts),
// serialising the raw glyph commands ourselves so no parser quirk can leak in.
const opentype = require('opentype.js'), fs = require('fs')
const b = fs.readFileSync(process.argv[2])
const font = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
const SIZE = 100, BASE = 74, LS = -0.02
const r2 = (n) => Math.round(n * 100) / 100
const glyphPath = (g, x) => {
  const k = SIZE / font.unitsPerEm
  const X = (v) => r2(x + v * k), Y = (v) => r2(BASE - v * k)
  return g.path.commands.map((c) => {
    if (c.type === 'M' || c.type === 'L') return `${c.type}${X(c.x)} ${Y(c.y)}`
    if (c.type === 'Q') return `Q${X(c.x1)} ${Y(c.y1)} ${X(c.x)} ${Y(c.y)}`
    if (c.type === 'C') return `C${X(c.x1)} ${Y(c.y1)} ${X(c.x2)} ${Y(c.y2)} ${X(c.x)} ${Y(c.y)}`
    return 'Z'
  }).join('')
}
const run = (text, x) => { let d = ''; const k = SIZE / font.unitsPerEm; let prev = null
  for (const ch of text) { const g = font.charToGlyph(ch); if (prev) x += font.getKerningValue(prev, g) * k
    d += glyphPath(g, x); x += g.advanceWidth * k + LS * SIZE; prev = g }
  return { d, x } }
const mm = run('mm', 0), pos = run('POS', mm.x)
if (/NaN|undefined/.test(mm.d + pos.d)) throw new Error('bad outline')
fs.writeFileSync(process.argv[3], JSON.stringify({ font: 'Plus Jakarta Sans 800 (Google Fonts TTF), letter-spacing -0.02em, size 100, baseline 74', width: r2(pos.x), height: 100, mm: mm.d, pos: pos.d }))
console.log('ok width', r2(pos.x))
