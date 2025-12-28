/** @typedef {import("tsup").Options} BuildOptions */

/** @satisfies {BuildOptions} */
const base = {
	clean: true,
	outDir: "build",
	format: "esm",
}

/** @satisfies {BuildOptions} */
const nodeBase = {
	...base,
	platform: "node",
	target: "node24",
}

/** @satisfies {BuildOptions} */
const browserBase = {
	...base,
	platform: "browser",
}

/** @satisfies {BuildOptions} */
const library = {
	...base,
	platform: "neutral",
	entry: ["src/index.ts"],
	dts: true,
}

/** @satisfies {BuildOptions} */
const browserLibrary = {
	...library,
	...browserBase,
}

/** @satisfies {BuildOptions} */
const nodeLibrary = {
	...library,
	...nodeBase,
}

/** @satisfies {BuildOptions} */
const cli = {
	...nodeBase,
	entry: ["src/main.ts"],
}

module.exports.configs = {
	base,
	nodeBase,
	browserBase,
	library,
	browserLibrary,
	nodeLibrary,
	cli,
}
