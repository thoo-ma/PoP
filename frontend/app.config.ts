import type { ConfigContext, ExpoConfig } from 'expo/config'
import packageJson from './package.json'

export default ({ config }: ConfigContext): ExpoConfig => {
  config.version = packageJson.version
  const iOSAppId = process.env.EMBRACE_IOS_APP_ID ?? ''
  const apiToken = process.env.EMBRACE_API_TOKEN ?? ''

  const plugins = config.plugins ?? []
  const embraceIndex = plugins.findIndex(
    (p) => Array.isArray(p) && String(p[0]).includes('embrace'),
  )

  if (iOSAppId && apiToken) {
    // Inject credentials into the Embrace plugin config
    if (embraceIndex !== -1) {
      const embracePlugin = plugins[embraceIndex]
      if (
        Array.isArray(embracePlugin) &&
        embracePlugin.length > 1 &&
        embracePlugin[1] &&
        typeof embracePlugin[1] === 'object'
      ) {
        ;(embracePlugin[1] as Record<string, string>).iOSAppId = iOSAppId
        ;(embracePlugin[1] as Record<string, string>).apiToken = apiToken
      }
    }
  } else {
    // Remove the Embrace plugin when credentials are not set
    if (plugins.length) {
      config.plugins = plugins.filter((p) => !Array.isArray(p) || !String(p[0]).includes('embrace'))
    }
  }

  if (process.env.APP_VARIANT === 'development') {
    if (config.ios) {
      config.ios.bundleIdentifier = 'com.popcorporation.pop.dev'
    }
    config.android = config.android ?? {}
    config.android.package = 'com.popcorporation.pop.dev'
    config.name = 'PoP (Dev)'
  } else if (process.env.APP_VARIANT === 'preview') {
    if (config.ios) {
      config.ios.bundleIdentifier = 'com.popcorporation.pop.prev'
    }
    config.android = config.android ?? {}
    config.android.package = 'com.popcorporation.pop.prev'
    config.name = 'PoP (Preview)'
  } else {
    config.name = 'PoP'
  }

  return config as ExpoConfig
}
