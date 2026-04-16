const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('node:path')

/** Escape a string for use inside a RegExp literal. */
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')

const config = getDefaultConfig(projectRoot)

// watchFolders must cover the whole workspace root: Expo resolves the app
// entry point relative to the monorepo root (where pnpm-workspace.yaml lives),
// so Metro needs to watch it regardless of where the dev server is started from.
config.watchFolders = [workspaceRoot]

// Prevent Metro from crawling or resolving modules in workspace packages that
// are irrelevant to the mobile app.  This recovers most of the startup-time
// cost of watching the full workspace root without breaking entry resolution.
// Spread existing defaults (e.g. /.expo\/types/, /__tests__/) so they are not lost.
const existingBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : config.resolver.blockList
    ? [config.resolver.blockList]
    : []
config.resolver.blockList = [
  ...existingBlockList,
  new RegExp(`${escapeRegExp(path.join(workspaceRoot, 'dashboard'))}(/.*)?$`),
  new RegExp(`${escapeRegExp(path.join(workspaceRoot, 'supabase'))}(/.*)?$`),
  new RegExp(`${escapeRegExp(path.join(workspaceRoot, 'google-cloud-run'))}(/.*)?$`),
]

// Resolve @pop/shared to the repo-root shared/ directory
config.resolver.alias = {
  '@pop/shared': path.join(workspaceRoot, 'shared'),
}

// Let files outside frontend/ (e.g. shared/) resolve node_modules from frontend/
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
})
