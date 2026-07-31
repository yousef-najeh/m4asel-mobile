const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Import `.svg` files as React components (react-native-svg-transformer).
// The `/expo` transformer delegates non-svg files to Expo's default babel transformer,
// and NativeWind's transformer runs on top of it — order matters, so this is set
// before withNativeWind wraps the config.
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = withNativeWind(config, { input: './global.css' });
