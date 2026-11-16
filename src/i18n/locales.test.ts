/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pickLanguage, resources } from './resources.ts'

function keys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix]
  return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
}

test('Spanish and English have exactly the same keys in every namespace', () => {
  for (const ns of Object.keys(resources.es) as (keyof typeof resources.es)[]) {
    assert.deepEqual(keys(resources.en[ns]).sort(), keys(resources.es[ns]).sort(), ns)
  }
})

test('unknown or missing device languages fall back to Spanish', () => {
  assert.equal(pickLanguage('en'), 'en')
  assert.equal(pickLanguage('ES'), 'es')
  assert.equal(pickLanguage('fr'), 'es')
  assert.equal(pickLanguage(undefined), 'es')
})
