/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sourceFiles } from '../test/sourceFiles.ts'

const IMPORT = /from\s+['"]([^'"]+)['"]/g

function importsOf(text: string): string[] {
  return [...text.matchAll(IMPORT)].map((match) => match[1])
}

test('src/shared never imports a feature (features build on shared, not the other way)', () => {
  const offenders = sourceFiles()
    .filter((file) => file.path.startsWith('shared/'))
    .filter((file) => importsOf(file.text).some((spec) => /(^@\/features|\/features\/)/.test(spec)))
    .map((file) => file.path)
  assert.deepEqual(offenders, [])
})

test('only route files import from src/app (routes are leaves)', () => {
  const offenders = sourceFiles()
    .filter((file) => !file.path.startsWith('app/'))
    .filter((file) => importsOf(file.text).some((spec) => /^@\/app\//.test(spec)))
    .map((file) => file.path)
  assert.deepEqual(offenders, [])
})
