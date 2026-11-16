/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  OUTPUT_TS,
  TOKENS_JSON,
  renderNativeTokens
} from '../../../scripts/build-native-tokens.mjs'

test('native tokens are generated from the copied design package (run `npm run tokens`)', () => {
  const expected = renderNativeTokens(JSON.parse(readFileSync(TOKENS_JSON, 'utf8')))
  assert.equal(readFileSync(OUTPUT_TS, 'utf8'), expected)
})
