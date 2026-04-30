#!/usr/bin/env tsx
/**
 * audit-design-tokens.ts
 *
 * On-demand audit: reports which global.css tokens are actually used in the
 * frontend source, which are HeroUI-internal, and which are completely unused.
 *
 * Usage: pnpm tsx scripts/audit-design-tokens.ts
 *
 * Output groups:
 *   APP     — className or CSS variable reference found in frontend/ source
 *   HEROUI  — HeroUI theme variable (used internally by HeroUI components)
 *   UNUSED  — declared in global.css but not referenced anywhere
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FRONTEND = resolve(__dirname, '../frontend')
const CSS_PATH = resolve(FRONTEND, 'global.css')

const FG_RED = '\x1b[31m'
const FG_YELLOW = '\x1b[33m'
const FG_GREEN = '\x1b[32m'
const FG_CYAN = '\x1b[36m'
const FG_GRAY = '\x1b[2m'
const FG_BOLD = '\x1b[1m'
const RESET = '\x1b[0m'

// ── Tokens that are standard HeroUI system variables —───────────────
// These are used by HeroUI components internally even when the app code
// never references them directly as className utilities.
const HEROUI_CORE_VARS = new Set([
  '--surface-foreground',
  '--surface-secondary-foreground',
  '--surface-tertiary-foreground',
  '--overlay',
  '--overlay-foreground',
  '--backdrop',
  '--default-foreground',
  '--accent-foreground',
  '--field-background',
  '--field-foreground',
  '--field-placeholder',
  '--field-border',
  '--success-foreground',
  '--warning-foreground',
  '--danger-foreground',
  '--info',
  '--info-foreground',
  '--focus',
  '--link',
  '--separator',
  '--segment',
  '--segment-foreground',
])

// Variables that alias to HeroUI vars (via `@theme inline`)
const HEROUI_ALIAS_VARS = new Set([
  '--color-info',
  '--color-info-foreground',
  '--color-amber',
  '--color-amber-foreground',
  '--color-mystery',
  '--color-mystery-foreground',
])

// Tokens that are classed via @utility or referenced via CSS var() in layouts
const CSS_UTILITY_TOKENS = new Set([
  '--border-press',   // @utility border-b-press
  '--border-raise',   // @utility border-b-raise
  '--surface-shadow',
  '--overlay-shadow',
  '--field-shadow',
  '--opacity-disabled-light',
  '--opacity-disabled-heavy',
  '--z-header',
  '--leading-modal-body',
  '--tracking-otp',
  '--spacing-card-image',
  '--spacing-control-lg',
  '--spacing-control-md',
  '--spacing-counter-min',
  '--spacing-dialog-max',
  '--spacing-label-lg',
  '--spacing-label-md',
  '--spacing-label-sm',
  '--spacing-nft-picker-h',
  '--spacing-nft-picker-w',
  '--spacing-phase-px',
  '--spacing-screen-top-md',
  '--spacing-screen-top-sm',
  '--spacing-tab-clearance',
  '--spacing-tab-clearance-header',
  '--spacing-tab-clearance-xl',
  '--spacing-thumbnail',
  '--text-display-lg--line-height',
  '--text-display-xl--line-height',
])

// ── Helpers ────────────────────────────────────────────────────────

function loadCSS(path: string): string {
  try {
    return readFileSync(path, 'utf8')
  } catch (err) {
    console.error(`✗ Failed to read ${path}`)
    process.exit(1)
  }
}

/**
 * Extract CSS variable names declared in a `@theme` block (or `@theme inline`)
 * by looking for `--name:` patterns.
 */
function extractThemeVarNames(body: string): string[] {
  const names: string[] = []
  const re = /(--[a-zA-Z0-9_-]+)\s*:/g
  let m = re.exec(body)
  while (m !== null) {
    names.push(m[1])
    m = re.exec(body)
  }
  return names
}

/**
 * Extract CSS variable names from inside `@layer theme { :root { … } }`.
 * Strips comments first, finds the first `@variant light { … }` block,
 * then extracts var names.
 */
function extractLayerThemeVarNames(body: string): string[] {
  const cleaned = body.replace(/\/\*[\s\S]*?\*\//g, '')
  const names: string[] = []
  const layerMatch = cleaned.match(/@layer theme\s*\{/)
  if (!layerMatch) return names

  // Find first @variant light { … } block
  const lightStart = cleaned.indexOf('@variant light')
  if (lightStart === -1) return names
  const openBrace = cleaned.indexOf('{', lightStart)
  if (openBrace === -1) return names

  let depth = 1
  let i = openBrace + 1
  while (i < cleaned.length && depth > 0) {
    const ch = cleaned[i]
    if (ch === '{') depth++
    else if (ch === '}') depth--
    i++
  }
  const lightBlock = cleaned.slice(openBrace + 1, i - 1)

  const re = /(--[a-zA-Z0-9_-]+)\s*:/g
  let m = re.exec(lightBlock)
  while (m !== null) {
    names.push(m[1])
    m = re.exec(lightBlock)
  }
  return names
}

/**
 * Grep the frontend source for references to a token as a className utility
 * (e.g., `text-foreground`, `bg-accent`, `border-hairline`, `rounded-card`)
 * or a CSS variable reference (e.g., `--color-stat-efficiency`).
 */
function countAppRefs(tokenName: string): number {
  // Derive possible className patterns from the CSS variable name
  const patterns: string[] = []

  // `--color-foo-bar` → `bg-foo-bar`, `text-foo-bar`, `border-foo-bar`, `foo-bar`
  if (tokenName.startsWith('--color-')) {
    const suffix = tokenName.replace('--color-', '')
    patterns.push(suffix)
  }

  // `--text-foo` → `text-foo`
  if (tokenName.startsWith('--text-')) {
    const cls = tokenName.replace('--', '')
    patterns.push(cls)
  }

  // `--radius-foo` → `rounded-foo`
  if (tokenName.startsWith('--radius-')) {
    const cls = 'rounded-' + tokenName.replace('--radius-', '')
    patterns.push(cls)
  }

  // `--spacing-foo` → token name itself
  if (tokenName.startsWith('--spacing-')) {
    patterns.push(tokenName)
  }

  // `--border-foo` → `border-foo` (as className)
  if (tokenName.startsWith('--border-')) {
    const cls = tokenName.replace('--', '')
    patterns.push(cls)
  }

  // For HeroUI theme vars like `--background`, `--foreground`, etc.
  // search for `bg-token`, `text-token`, `border-token`
  if (!tokenName.startsWith('--color-') && !tokenName.startsWith('--text-') &&
      !tokenName.startsWith('--radius-') && !tokenName.startsWith('--spacing-') &&
      !tokenName.startsWith('--border-')) {
    const suffix = tokenName.replace('--', '')
    patterns.push(`bg-${suffix}`)
    patterns.push(`text-${suffix}`)
    patterns.push(`border-${suffix}`)
  }

  // Also search for the raw CSS variable name in app code
  patterns.push(tokenName)

  let total = 0
  for (const pattern of patterns) {
    try {
      const out = execSync(
        `grep -r "${escapeGrep(pattern)}" frontend/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "node_modules" | grep -v "/dev/" | wc -l`,
        { cwd: resolve(__dirname, '..'), encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] },
      )
      total += parseInt(out.trim(), 10) || 0
    } catch {
      // grep returns exit code 1 when no match — ignore
    }
  }
  return total
}

function escapeGrep(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function classify(
  token: string,
  refCount: number,
): 'APP' | 'HEROUI' | 'UNUSED' {
  if (refCount > 0) return 'APP'
  if (HEROUI_CORE_VARS.has(token) || HEROUI_ALIAS_VARS.has(token) || CSS_UTILITY_TOKENS.has(token))
    return 'HEROUI'
  return 'UNUSED'
}

// ── Main ───────────────────────────────────────────────────────────

const css = loadCSS(CSS_PATH)

// Block A: `@theme { }` static tokens (color-*, text-*, spacing-*, radius-*, border-*)
const themeBlock = css.match(/@theme\s*\{[^}]+\}/)?.[0] ?? ''
const themeTokens = extractThemeVarNames(themeBlock)

// Block B: `@layer theme { :root { @variant light { … } } }` variable declarations
const layerTokens = extractLayerThemeVarNames(css)

// Block C: `@theme inline { }` re-exports
const inlineBlock = css.match(/@theme\s+inline\s*\{[^}]+\}/)?.[0] ?? ''
const inlineTokens = extractThemeVarNames(inlineBlock)

const allTokens = [...new Set([...themeTokens, ...layerTokens, ...inlineTokens])].sort()

// ── Categorize ─────────────────────────────────────────────────────

const app: string[] = []
const heroui: string[] = []
const unused: string[] = []

for (const token of allTokens) {
  const refs = countAppRefs(token)
  const cat = classify(token, refs)
  if (cat === 'APP') app.push(`${token} (${refs} refs)`)
  else if (cat === 'HEROUI') heroui.push(token)
  else unused.push(token)
}

// ── Report ─────────────────────────────────────────────────────────

const total = allTokens.length
const header = `${FG_BOLD}Design Token Audit${RESET} — ${total} tokens in global.css`

console.log(`\n${FG_CYAN}${'═'.repeat(60)}${RESET}`)
console.log(header)
console.log(`${FG_CYAN}${'═'.repeat(60)}${RESET}\n`)

console.log(`${FG_GREEN}✓ ${app.length} APP tokens${RESET} (referenced by app code)`)
for (const t of app) console.log(`   ${t}`)

console.log()
console.log(`${FG_CYAN}∼ ${heroui.length} HEROUI tokens${RESET} (HeroUI system vars — used internally)`)
for (const t of heroui) console.log(`   ${FG_GRAY}${t}${RESET}`)

if (unused.length > 0) {
  console.log()
  console.log(`${FG_RED}✗ ${unused.length} UNUSED tokens${RESET} (declared but never referenced)`)
  for (const t of unused) console.log(`   ${FG_RED}${t}${RESET}`)
}

console.log()
console.log(`${FG_YELLOW}Note:${RESET} Only searches frontend/ source code. HeroUI's internal module`)
console.log(`uses its own CSS variables — tokens not directly referenced by app code`)
console.log(`are marked HEROUI, not UNUSED.`)

// ── Write mode: update storybook indicators ─────────────────────────

if (process.argv.includes('--write')) {
  const STORY_PATH = resolve(
    __dirname,
    '../frontend/components/dev/tokens/TokenStories.tsx',
  )

  const indicatorMap: Record<string, string> = {}
  for (const token of allTokens) {
    const refs = countAppRefs(token)
    const cat = classify(token, refs)
    if (cat === 'APP') indicatorMap[token] = 'app'
    else if (cat === 'HEROUI') indicatorMap[token] = 'heroui'
    else indicatorMap[token] = 'unused'
  }

  let storySrc = readFileSync(STORY_PATH, 'utf8')
  const original = storySrc

  storySrc = storySrc.replace(
    /ColorSwatch\s+name="(--[^"]+)"(?:\s+indicator="[^"]+")?/g,
    (match: string, tokenName: string) => {
      const indicator = indicatorMap[tokenName] ?? 'app'
      return `ColorSwatch name="${tokenName}" indicator="${indicator}"`
    },
  )

  if (storySrc === original) {
    console.log(`\n${FG_YELLOW}∼ No changes needed — storybook indicators already up to date.${RESET}`)
  } else {
    writeFileSync(STORY_PATH, storySrc, 'utf8')
    console.log(
      `\n${FG_GREEN}✓ Wrote updated indicators to frontend/components/dev/tokens/TokenStories.tsx${RESET}`,
    )
  }
}

console.log()
