const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('node:path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')

const config = getDefaultConfig(projectRoot)

// Watch only the shared/ folder which lives outside the frontend project root
config.watchFolders = [path.join(workspaceRoot, 'shared')]

// Resolve @pop/shared to the repo-root shared/ directory
config.resolver.alias = {
  '@pop/shared': path.join(workspaceRoot, 'shared'),
}

// Let files outside frontend/ (e.g. shared/) resolve node_modules from frontend/
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
})
