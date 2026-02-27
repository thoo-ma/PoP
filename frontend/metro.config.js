const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the shared/ folder which lives outside the frontend project root
config.watchFolders = [workspaceRoot];

// Resolve @shared/* to the repo-root shared/ directory
config.resolver.alias = {
  '@shared': path.join(workspaceRoot, 'shared'),
};

module.exports = config;
