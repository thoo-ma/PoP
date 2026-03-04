#!/usr/bin/env node
/**
 * Pre-warm all dashboard routes so the dev server compiles them upfront
 * instead of on first user visit.
 *
 * Usage: node scripts/prewarm.mjs          (default: localhost:3000)
 *        node scripts/prewarm.mjs 3001     (custom port)
 */

const PORT = process.argv[2] || 3000
const BASE = `http://localhost:${PORT}`

const ROUTES = [
  '/xp',
  '/currency',
  '/cooldown',
  '/stat-points',
  '/breed',
  '/minting',
  '/sensors',
  '/energy',
  '/loot',
  '/cloud-run',
]

async function waitForServer(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fetch(`${BASE}/xp`, { method: 'HEAD' })
      return true
    } catch {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
  return false
}

async function main() {
  console.log(`⏳ Waiting for dev server at ${BASE}…`)
  const up = await waitForServer()
  if (!up) {
    console.error('❌ Dev server did not start in time')
    process.exit(1)
  }

  console.log(`🔥 Pre-warming ${ROUTES.length} routes…`)
  const start = Date.now()

  // Warm sequentially to avoid overwhelming the compiler
  for (const route of ROUTES) {
    const t = Date.now()
    try {
      const res = await fetch(`${BASE}${route}`)
      const ms = Date.now() - t
      console.log(`  ${res.status === 200 ? '✅' : '⚠️'}  ${route} (${ms}ms)`)
    } catch (err) {
      console.log(`  ❌  ${route} — ${err.message}`)
    }
  }

  const total = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n✅ All routes pre-warmed in ${total}s — dashboard is ready!`)
}

main()
