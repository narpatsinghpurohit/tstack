const path = require("path");
const {
	getDefaultConfig,
	mergeConfig,
} = require("@react-native/metro-config");

const monorepoRoot = path.resolve(__dirname, "../..");

/**
 * Metro configuration for Bun monorepo.
 * Watches the monorepo root and resolves node_modules from both
 * the mobile app and the monorepo root (where Bun hoists packages).
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
	watchFolders: [monorepoRoot],
	resolver: {
		nodeModulesPaths: [
			path.resolve(__dirname, "node_modules"),
			path.resolve(monorepoRoot, "node_modules"),
		],
		// Ensure @tstack/shared resolves to source TS
		extraNodeModules: {
			"@tstack/shared": path.resolve(monorepoRoot, "packages/shared"),
		},
	},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
