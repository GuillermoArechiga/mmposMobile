/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  DEVICE_MODES,
  MODE_DEFINITIONS,
  SETUP_ROUTE,
  isDeviceMode,
  startRouteFor
} from './modes.ts'
import { resources } from '../../../i18n/resources.ts'

test('every mode is defined once, with its own route', () => {
  assert.deepEqual(
    MODE_DEFINITIONS.map((m) => m.id),
    [...DEVICE_MODES]
  )
  assert.equal(new Set(MODE_DEFINITIONS.map((m) => m.route)).size, DEVICE_MODES.length)
})

test('only admin talks to the cloud; the rest pair with the main POS on the LAN', () => {
  const cloud = MODE_DEFINITIONS.filter((m) => m.connection === 'cloud').map((m) => m.id)
  assert.deepEqual(cloud, ['admin'])
})

test('the app opens on the chosen mode, or the picker when there is none / it is invalid', () => {
  assert.equal(startRouteFor('kitchen'), '/kitchen')
  assert.equal(startRouteFor(null), SETUP_ROUTE)
  assert.equal(startRouteFor('cashier'), SETUP_ROUTE)
  assert.equal(isDeviceMode('display'), true)
})

test('every mode has words in both languages', () => {
  for (const lang of ['es', 'en'] as const) {
    for (const mode of DEVICE_MODES) {
      assert.ok(resources[lang].setup.modes[mode].title, `${lang} ${mode}`)
      assert.ok(resources[lang].setup.comingSoon[mode], `${lang} ${mode}`)
    }
  }
})
