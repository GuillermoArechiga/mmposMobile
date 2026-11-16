/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { contrastRatio, withOpacity } from './color.ts'
import { theme } from './theme.ts'

const AA_TEXT = 4.5
const AA_LARGE = 3

test('body text is readable on every surface (WCAG AA)', () => {
  for (const background of [theme.color.page, theme.color.surface, theme.color.chrome]) {
    assert.ok(contrastRatio(theme.color.text, background) >= AA_TEXT, background)
  }
})

test('text on brand and status colours is readable', () => {
  for (const tone of ['primary', 'secondary', 'accent', 'info', 'success', 'warning'] as const) {
    assert.ok(contrastRatio(theme.color.on[tone], theme.color[tone]) >= AA_TEXT, tone)
  }
})

test('error buttons meet the large-text bar (known design gap for small text)', () => {
  // design/design-system/accessibility.md: error-content on error fails 4.5:1
  // for small text — use it only for button labels (large/bold) until fixed
  // in mmPosWeb/design.
  assert.ok(contrastRatio(theme.color.on.error, theme.color.error) >= AA_LARGE)
})

test('withOpacity produces 8-digit hex', () => {
  assert.equal(withOpacity('#00c486', 0.1), '#00c4861a')
  assert.equal(withOpacity('#fff', 1), '#ffffffff')
})
