// Exports raster brand assets from the SVG sources. Needs Electron (it renders the
// SVGs with Chromium), e.g. from mmPosApp:
//   env -u ELECTRON_RUN_AS_NODE npx electron ../mmPosWeb/design/scripts/export-icons.cjs
// Writes: brand/app-icons/{icon-1024.png, icon-512.png, icon.icns, icon.ico, ticket-brand.png},
//         assets/{favicon-32.png, favicon-180.png, brand-board.png}
const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const write = (p, data) => {
  const file = path.join(ROOT, p)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, data)
}
const dataUrl = (svg) => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')
const tokens = JSON.parse(read('design-system/tokens.json'))
const FONT = "Inter,-apple-system,'Helvetica Neue',Arial,sans-serif"

async function snap(win, html, w, h, outW = w, outH = h) {
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
  await new Promise((r) => setTimeout(r, 350))
  const img = await win.webContents.capturePage({ x: 0, y: 0, width: w, height: h })
  return img.resize({ width: outW, height: outH, quality: 'best' })
}

const icoFromPngs = (entries) => {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(entries.length, 4)
  let offset = 6 + 16 * entries.length
  const dir = []
  for (const { size, png } of entries) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size === 256 ? 0 : size, 0)
    e.writeUInt8(size === 256 ? 0 : size, 1)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(png.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += png.length
    dir.push(e)
  }
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)])
}

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 1700, height: 1100, frame: false, transparent: true })
  win.setContentSize(1700, 1100)

  // ── App icon ─────────────────────────────────────────────────────────────
  const iconSvg = dataUrl(read('brand/logos/mmpos-app-icon.svg'))
  const big = await snap(win, `<body style="margin:0;background:transparent"><img src="${iconSvg}" width="1024" height="1024" style="display:block"></body>`, 1024, 1024, 1024, 1024)
  write('brand/app-icons/icon-1024.png', big.toPNG())
  write('brand/app-icons/icon-512.png', big.resize({ width: 512, height: 512, quality: 'best' }).toPNG())

  // macOS: Apple's grid (824 square + margin + shadow) for the .icns and the dock
  const macSvg = dataUrl(read('brand/logos/mmpos-app-icon-macos.svg'))
  const mac = await snap(win, `<body style="margin:0;background:transparent"><img src="${macSvg}" width="1024" height="1024" style="display:block"></body>`, 1024, 1024, 1024, 1024)
  write('brand/app-icons/icon-macos-1024.png', mac.toPNG())
  write('brand/app-icons/icon-macos-512.png', mac.resize({ width: 512, height: 512, quality: 'best' }).toPNG())
  const iconset = path.join(ROOT, 'brand/app-icons/icon.iconset')
  fs.mkdirSync(iconset, { recursive: true })
  const sets = [[16, 'icon_16x16'], [32, 'icon_16x16@2x'], [32, 'icon_32x32'], [64, 'icon_32x32@2x'], [128, 'icon_128x128'], [256, 'icon_128x128@2x'], [256, 'icon_256x256'], [512, 'icon_256x256@2x'], [512, 'icon_512x512'], [1024, 'icon_512x512@2x']]
  for (const [n, name] of sets) fs.writeFileSync(path.join(iconset, name + '.png'), mac.resize({ width: n, height: n, quality: 'best' }).toPNG())
  try {
    execFileSync('iconutil', ['-c', 'icns', iconset, '-o', path.join(ROOT, 'brand/app-icons/icon.icns')])
  } catch (e) {
    console.log('iconutil unavailable (not macOS): skipped icon.icns')
  }
  fs.rmSync(iconset, { recursive: true, force: true })

  // Windows 11: padded plate, Fluent corners → icon.ico and the window/taskbar icon
  const winSvg = dataUrl(read('brand/logos/mmpos-app-icon-windows.svg'))
  const winIcon = await snap(win, `<body style="margin:0;background:transparent"><img src="${winSvg}" width="1024" height="1024" style="display:block"></body>`, 1024, 1024, 1024, 1024)
  write('brand/app-icons/icon-windows-1024.png', winIcon.toPNG())
  write('brand/app-icons/icon-windows-512.png', winIcon.resize({ width: 512, height: 512, quality: 'best' }).toPNG())
  write('brand/app-icons/icon.ico', icoFromPngs([16, 20, 24, 32, 40, 48, 64, 96, 128, 256].map((size) => ({ size, png: winIcon.resize({ width: size, height: size, quality: 'best' }).toPNG() }))))

  // Favicons
  write('assets/favicon-32.png', big.resize({ width: 32, height: 32, quality: 'best' }).toPNG())
  write('assets/favicon-180.png', big.resize({ width: 180, height: 180, quality: 'best' }).toPNG())

  // ── Ticket lockup: the monochrome logo (black mark + black wordmark) at 48 dots tall ──
  const monoLogo = read('brand/logos/mmpos-logo-monochrome.svg')
  const [, lw, lh] = monoLogo.match(/width="(\d+)" height="(\d+)"/).map(Number)
  const H = 48
  const W = Math.ceil((lw * H) / lh / 8) * 8
  const lockup = await snap(win, `<body style="margin:0;background:#fff;width:${W}px;height:${H}px;display:flex;align-items:center;justify-content:center"><img src="${dataUrl(monoLogo)}" height="${H}"></body>`, W, H, W, H)
  write('brand/app-icons/ticket-brand.png', lockup.toPNG())

  // ── Brand board ──────────────────────────────────────────────────────────
  const c = tokens.color
  const swatch = (name, v, dark) => `<div style="background:${v.hex};color:${dark ? '#040405' : '#f4f4f5'};border:1px solid #2a2b2e;border-radius:12px;padding:14px;height:92px;display:flex;flex-direction:column;justify-content:flex-end;font-size:13px"><b>${name}</b><span style="opacity:.75">${v.hex}</span></div>`
  const grad = (name, m) => `<div style="background:linear-gradient(135deg,${m.from},${m.to});border-radius:12px;height:56px;display:flex;align-items:flex-end;padding:8px 12px;color:#fff;font-size:12px;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,.4)">${name}</div>`
  const logoH = dataUrl(read('brand/logos/mmpos-logo-horizontal.svg'))
  const logoL = dataUrl(read('brand/logos/mmpos-logo-horizontal-light.svg'))
  const board = `<body style="margin:0;background:#0f0f11;color:#f4f4f5;font-family:${FONT};width:1600px;height:1000px;padding:48px;box-sizing:border-box">
    <div style="display:flex;gap:40px;align-items:center">
      <img src="${iconSvg}" width="220" height="220">
      <div><div style="font-size:15px;letter-spacing:.2em;color:#00c486;font-weight:700">BRAND BOARD · v${tokens.meta.version}</div>
        <img src="${dataUrl(read('brand/logos/mmpos-wordmark.svg'))}" height="64" style="display:block;margin:10px 0 12px">
        <div style="font-size:20px;opacity:.7;max-width:640px">Restaurant and retail on one calm, dark point of sale. The mark is the “m.” monogram — the dot is the point of sale.</div></div>
      <div style="margin-left:auto;display:flex;gap:16px;align-items:flex-end">
        ${[128, 64, 32, 16].map((n) => `<img src="${iconSvg}" width="${n}" height="${n}">`).join('')}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:12px;margin-top:40px">
      ${swatch('primary', c.brand.primary, true)}${swatch('secondary', c.brand.secondary, true)}${swatch('accent', c.brand.accent, true)}${swatch('info', c.semantic.info, true)}
      ${swatch('error', c.semantic.error, true)}${swatch('base-100', c.surface.base100)}${swatch('base-200', c.surface.base200)}${swatch('base-300', c.surface.base300)}</div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-top:12px">
      ${Object.entries(c.module).map(([k, m]) => grad(k, m)).join('')}</div>
    <div style="display:flex;gap:24px;margin-top:32px;align-items:stretch">
      <div style="flex:1;background:#18181b;border:1px solid #2a2b2e;border-radius:16px;padding:28px;display:flex;align-items:center;justify-content:center"><img src="${logoH}" height="96"></div>
      <div style="flex:1;background:#fff;border-radius:16px;padding:28px;display:flex;align-items:center;justify-content:center"><img src="${logoL}" height="96"></div>
      <div style="flex:1.2;background:#18181b;border:1px solid #2a2b2e;border-radius:16px;padding:28px">
        <div style="font-size:12px;letter-spacing:.15em;opacity:.5;margin-bottom:8px">TYPE · PLUS JAKARTA SANS (display) + INTER (UI)</div>
        <div style="font-size:34px;font-weight:900;letter-spacing:-.02em">Abrir turno</div>
        <div style="font-size:20px;font-weight:600;margin-top:6px">$1,428.50 <span style="font-size:14px;font-weight:500;opacity:.6">Venta total</span></div>
        <div style="font-size:14px;opacity:.6;margin-top:6px">Texto secundario al 60% — 14 px / 400</div></div>
    </div></body>`
  const boardImg = await snap(win, board, 1600, 1000, 1600, 1000)
  write('assets/brand-board.png', boardImg.toPNG())

  console.log('exported', { lockup: [W, H] })
  app.quit()
})
