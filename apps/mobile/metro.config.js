const path = require("path");
const {
	getDefaultConfig,
	mergeConfig,
} = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");

const monorepoRoot = path.resolve(__dirname, "../..");

/**
 * Metro configuration for Bun monorepo + NativeWind.
 */
const config = {
	watchFolders: [monorepoRoot],
	resolver: {
		nodeModulesPaths: [
			path.resolve(__dirname, "node_modules"),
			path.resolve(monorepoRoot, "node_modules"),
		],
		extraNodeModules: {
			"@tstack/shared": path.resolve(monorepoRoot, "packages/shared"),
		},
	},
};

module.exports = withNativeWind(
	mergeConfig(getDefaultConfig(__dirname), config),
	{ input: "./src/global.css" },
);
