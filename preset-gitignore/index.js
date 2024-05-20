const path = require("node:path")
const mrm = require("mrm-core")

const templateDirectory = path.resolve(__dirname, "template")

function setupGitignore() {
	mrm.copyFiles(templateDirectory, ".gitignore", { overwrite: true })
}

setupGitignore.description = "Creates .gitignore file"

module.exports = setupGitignore
