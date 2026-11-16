# Scripts

- `build.mjs` — pure Node, no dependencies. Generates `tokens.json`, `tokens.css`, `themes.css`, `daisyui-theme.css`, `accessibility.md`, all SVGs in `brand/logos` and `assets/favicon.svg`, `examples/react/BrandMark.jsx`, and `manifest.json`.
- `export-icons.cjs` — needs Electron (it renders the SVGs with Chromium). Writes the PNG, ICO and ICNS app icons, the thermal ticket lockup, PNG favicons and the brand board.

```sh
node design/scripts/build.mjs
cd ../mmPosApp && env -u ELECTRON_RUN_AS_NODE npx electron ../mmPosWeb/design/scripts/export-icons.cjs
```

`ELECTRON_RUN_AS_NODE` must be unset or Electron's APIs are not available. `icon.icns` needs macOS (`iconutil`); on other systems that file is skipped.
