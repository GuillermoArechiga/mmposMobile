/// <reference types="node" />
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

export const SRC_DIR = join(import.meta.dirname, '..')

/** Every .ts/.tsx source file under `dir` (tests excluded), as { path, text }. */
export function sourceFiles(dir: string = SRC_DIR): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      out.push(...sourceFiles(full))
    } else if (/\.(ts|tsx)$/.test(name) && !/\.test\.ts$/.test(name)) {
      out.push({ path: relative(SRC_DIR, full), text: readFileSync(full, 'utf8') })
    }
  }
  return out
}
