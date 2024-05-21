const path = require("node:path")
const mrm = require("mrm-core")

const templateDirectory = path.resolve(__dirname, "template")

/**
 * @param {string} filepath
 */
function fromTemplate(filepath) {
	return path.resolve(templateDirectory, filepath)
}

/**
 * @param {object} parameters
 * @param {string} parameters.packageType
 */
function setupPackage(parameters) {
	mrm.install(["tsup", "typescript", "@total-typescript/ts-reset"], {
		pnpm: true,
		dev: true,
	})

	mrm.packageJson()
		.merge({
			type: "module",
		})
		.save()

	const tsconfigTemplate = mrm.json(fromTemplate("tsconfig.json"))

	const tsconfig = mrm.json("tsconfig.json")

	tsconfig.merge(tsconfigTemplate.get()).save()

	if (parameters.packageType === "cli") {
		mrm.install("cmd-ts", { pnpm: true })

		mrm.packageJson()
			.merge({
				bin: "build/main.js",
			})
			.save()
	} else {
		mrm.packageJson()
			.merge({
				main: "build/index.js",
			})
			.save()
	}

	if (parameters.packageType.toLowerCase().endsWith("library")) {
		mrm.packageJson()
			.merge({
				types: "build/index.d.ts",
			})
			.save()
	}

	if (
		parameters.packageType.toLowerCase().includes("node") ||
		parameters.packageType === "cli"
	) {
		mrm.install("@types/node", { pnpm: true, dev: true })
	}

	mrm.packageJson()
		.setScript("build:tsup", "tsup")
		.setScript("lint:tsc", "tsc")
		.save()

	const tsupConfigTemplate = mrm
		.template("tsup.config.ts", fromTemplate("tsup.config.ts"))
		.apply({
			configuration: parameters.packageType,
		})

	if (!tsupConfigTemplate.exists()) {
		tsupConfigTemplate.save()
	}

	if (parameters.packageType === "cli") {
		mrm.copyFiles(templateDirectory, "src/main.ts", { overwrite: false })
	} else {
		mrm.copyFiles(templateDirectory, "src/index.ts", { overwrite: false })
	}

	mrm.copyFiles(templateDirectory, "src/reset.d.ts")
}

setupPackage.description = "Creates package.json file and sets up basic fields"

/** @type {TaskParameters} */
setupPackage.parameters = {
	packageType: {
		type: "list",
		message: "Select package type",
		default: "base",
		choices: [
			{
				name: "Basic",
				value: "base",
			},
			{
				name: "Basic Node",
				value: "nodeBase",
			},
			{
				name: "Basic Browser",
				value: "browserBase",
			},
			{
				name: "Library",
				value: "library",
			},
			{
				name: "Node Library",
				value: "nodeLibrary",
			},
			{
				name: "Browser Library",
				value: "browserLibrary",
			},
			{
				name: "CLI",
				value: "cli",
			},
		],
	},
}

module.exports = setupPackage
