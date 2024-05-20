const path = require("node:path")
const mrm = require("mrm-core")

const templateDirectory = path.resolve(__dirname, "template")

/**
 * @param {string} filepath
 */
function fromTemplate(filepath) {
	return path.resolve(templateDirectory, filepath)
}

function setupGitignore() {
	const gitignoreTemplate = mrm.file(fromTemplate("gitignore"))

	const gitignore = mrm.file(".gitignore")

	if (!gitignore.exists()) {
		gitignore.save(gitignoreTemplate.get())
	}
}

setupGitignore.description = "Creates .gitignore file"

module.exports = setupGitignore
