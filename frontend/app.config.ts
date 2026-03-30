import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => {
  const iOSAppId = process.env.EMBRACE_IOS_APP_ID ?? ''
  const apiToken = process.env.EMBRACE_API_TOKEN ?? ''

  if (iOSAppId && apiToken) {
    // Inject credentials into the Embrace plugin config
    ;(config.plugins![1] as [string, Record<string, string>])[1].iOSAppId = iOSAppId
    ;(config.plugins![1] as [string, Record<string, string>])[1].apiToken = apiToken
  } else {
    // Remove the Embrace plugin when credentials are not set
    config.plugins = config.plugins!.filter(
      (p) => !Array.isArray(p) || !String(p[0]).includes('embrace'),
    )
  }

  return config
}
