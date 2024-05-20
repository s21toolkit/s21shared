const path = require("node:path")
const mrm = require("mrm-core")

/**
 * @param {string} filepath
 */
function fromTemplate(filepath) {
	return path.resolve(__dirname, "template", filepath)
}

function setupBasicPackage() {
	if (!mrm.packageJson().exists()) {
		// Set these fields only if package.json didn't exist
		mrm.packageJson()
			.merge({
				name: "@s21toolkit/<package>",
				description: "New s21toolkit package.",
				version: "0.0.1",
			})
			.save()
	}

	const packageJsonTemplate = mrm.json(fromTemplate("package.json"))

	mrm.packageJson().merge(packageJsonTemplate.get()).save()
}

setupBasicPackage.description =
	"Creates package.json file and sets up basic fields"

module.exports = setupBasicPackage
