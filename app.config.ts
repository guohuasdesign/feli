import type { ConfigContext, ExpoConfig } from '@expo/config';

type ExpoPlugins = NonNullable<ExpoConfig['plugins']>;

export default ({ config }: ConfigContext): ExpoConfig => {
  const nativePlugins: ExpoPlugins =
    process.env.EXPO_PLATFORM === 'native'
      ? [['expo-dev-client', { launchMode: 'most-recent' }], 'react-native-maps']
      : [];

  return {
    ...config,
    name: 'FELI',
    slug: 'feli',
    newArchEnabled: true,
    version: process.env.BILT_APP_VERSION ?? '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    scheme: 'feli',
    runtimeVersion: {
      policy: 'appVersion',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      supportsTablet: true,
      bundleIdentifier: process.env.BILT_IOS_BUNDLE_ID ?? 'me.bilt.feli',
    },
    android: {
      package: process.env.BILT_ANDROID_PACKAGE ?? 'me.bilt.feli',
    },
    extra: {
      appStoreAppId: process.env.BILT_APP_STORE_APP_ID,
      // Read at config-eval time (Node) from the sandbox shell env, then exposed
      // to the app at runtime via expo-constants. Avoids stale build-time inlining.
      elevenLabsApiKey:
        process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ?? process.env.ELEVENLABS_API_KEY,
    },
    plugins: ['expo-router', 'expo-font', 'expo-audio', ...nativePlugins],
    experiments: {
      typedRoutes: true,
    }
  };
};
