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

	config.merge(configTemplate).save()

	if (parameters.configureVSCode) {
		const vscodeSettings = mrm.json(".vscode/settings.json")

		vscodeSettings.merge(vscodeSettingsTemplate).save()
	}

	mrm.packageJson()
		.setScript("lint:biome", "biome check .")
		.setScript("fix:biome", "biome check --apply .")
}

setupBiome.description = "Sets up biome linter"

setupBiome.parameters = {
	configureVSCode: {
		type: "checkbox",
		default: false,
		description: "Configure VSCode to use biome as a formatter",
	},
}

module.exports = setupBiome
