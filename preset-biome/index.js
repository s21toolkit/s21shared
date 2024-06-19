const path = require("node:path")
const mrm = require("mrm-core")

/**
 * @param {string} filepath
 */
function fromTemplate(filepath) {
	return path.resolve(__dirname, "template", filepath)
}

/**
 * @param {object} parameters
 * @param {boolean} parameters.configureVSCode
 */
function setupBiome(parameters) {
	mrm.install(["@biomejs/biome", "@s21toolkit/shared"], {
		pnpm: true,
		dev: true,
	})

	const configTemplate = mrm.json(fromTemplate("biome.json"))
	const vscodeSettingsTemplate = mrm.json(fromTemplate("settings.json"))

	const config = mrm.json("biome.json")

	config.merge(configTemplate.get()).save()

	if (parameters.configureVSCode) {
		const vscodeSettings = mrm.json(".vscode/settings.json")

		vscodeSettings.merge(vscodeSettingsTemplate.get()).save()
	}

	mrm.packageJson()
		.setScript("lint:biome", "biome check .")
		.setScript("fix:biome", "biome check --write .")
		.save()
}

setupBiome.description = "Sets up biome linter"

/** @type {TaskParameters} */
setupBiome.parameters = {
	configureVSCode: {
		type: "select",
		default: false,
		message: "Configure VSCode to use biome as a formatter",
	},
}

module.exports = setupBiome
