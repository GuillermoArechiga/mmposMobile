import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toPx } from './build-native-tokens.mjs'

test('rem and px become React Native numbers', () => {
  assert.equal(toPx('0.75rem'), 12)
  assert.equal(toPx('1.125rem'), 18)
  assert.equal(toPx('44px'), 44)
  assert.equal(toPx(8), 8)
  assert.throws(() => toPx('22.5%'))
})
