/// <reference types="node" />
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sourceFiles } from '../../test/sourceFiles.ts'

// Colours come from the theme (design tokens), never from literals in components.
const LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/

test('no literal colours outside src/shared/theme', () => {
  const offenders = sourceFiles()
    .filter((file) => !file.path.startsWith('shared/theme/'))
    .filter((file) => LITERAL.test(file.text))
    .map((file) => file.path)
  assert.deepEqual(offenders, [])
})
