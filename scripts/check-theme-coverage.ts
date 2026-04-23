#!/usr/bin/env tsx
/**
 * check-theme-coverage.ts
 *
 * CI gate enforcing that `frontend/global.css` declares every CSS variable
 * required by HeroUI Native's bundled stylesheet inside the
 * `@layer theme { :root { @variant light { … } } }` block.
 *
 * Without this gate, removing an upstream override silently falls through to
 * HeroUI's default OKLCH palette (which is brand-incorrect for PoP).
 *
 * Reads:
 *   - frontend/node_modules/heroui-native/src/styles/variables.css  (source of truth)
 *   - frontend/global.css                                            (our overrides)
 *
 * Excludes "no-override primitives" that live in HeroUI's static `@theme {}`
 * block rather than the theme-variant block.
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FRONTEND_ROOT = resolve(__dirname, '../frontend')

const UPSTREAM_PATH = resolve(
  FRONTEND_ROOT,
  'node_modules/heroui-native/src/styles/variables.css',
)
const LOCAL_PATH = resolve(FRONTEND_ROOT, 'global.css')

// Primitives declared in upstream's static `@theme {}` block — not theme-bound,
// no override required.
const NO_OVERRIDE_PRIMITIVES = new Set([
  '--white',
  '--black',
  '--snow',
  '--eclipse',
  '--border-width',
  '--field-border-width',
  '--radius',
  '--field-radius',
  '--opacity-disabled',
])

/**
 * Extract the body of the first `@variant light { … }` block within a
 * `@layer theme { :root { … } }` wrapper. Uses brace counting so nested
 * blocks/declarations are handled correctly. Strips CSS comments first so
 * documentation prose mentioning `@variant light { … }` doesn't confuse the
 * locator.
 */
function extractVariantLightBody(rawSource: string): string | null {
  const source = rawSource.replace(/\/\*[\s\S]*?\*\//g, '')
  const marker = '@variant light'
  const start = source.indexOf(marker)
  if (start === -1) return null
  const openBrace = source.indexOf('{', start)
  if (openBrace === -1) return null
  let depth = 1
  for (let i = openBrace + 1; i < source.length; i++) {
    const ch = source[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return source.slice(openBrace + 1, i)
    }
  }
  return null
}

/**
 * Collect declared CSS variable names (`--name`) from a CSS body.
 */
function collectVarNames(body: string): Set<string> {
  const names = new Set<string>()
  const re = /(--[a-zA-Z0-9_-]+)\s*:/g
  let m = re.exec(body)
  while (m !== null) {
    names.add(m[1])
    m = re.exec(body)
  }
  return names
}

function loadFile(path: string, label: string): string {
  try {
    return readFileSync(path, 'utf8')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`✗ Failed to read ${label} (${path}): ${message}`)
    process.exit(2)
  }
}

const upstreamSrc = loadFile(UPSTREAM_PATH, 'HeroUI variables.css')
const localSrc = loadFile(LOCAL_PATH, 'frontend/global.css')

const upstreamBody = extractVariantLightBody(upstreamSrc)
if (!upstreamBody) {
  console.error('✗ Could not locate `@variant light` block in upstream variables.css')
  process.exit(2)
}
const localBody = extractVariantLightBody(localSrc)
if (!localBody) {
  console.error('✗ Could not locate `@variant light` block in frontend/global.css')
  process.exit(2)
}

const required = new Set(
  [...collectVarNames(upstreamBody)].filter((n) => !NO_OVERRIDE_PRIMITIVES.has(n)),
)
const declared = collectVarNames(localBody)

const missing = [...required].filter((n) => !declared.has(n)).sort()

if (missing.length > 0) {
  console.error(
    `✗ Theme coverage check failed — ${missing.length} HeroUI required var(s) missing from frontend/global.css @variant light block:\n` +
      missing.map((n) => `    ${n}`).join('\n') +
      '\n\nDeclare each missing var inside `@layer theme { :root { @variant light { … } } }` with a Digital Atelier OKLCH value.',
  )
  process.exit(1)
}

console.log(
  `✓ Theme coverage OK — all ${required.size} HeroUI required vars overridden in frontend/global.css`,
)
