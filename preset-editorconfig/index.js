const path = require("node:path")
const mrm = require("mrm-core")

const templateDirectory = path.resolve(__dirname, "template")

function setupEditorconfig() {
	mrm.copyFiles(templateDirectory, ".editorconfig", { overwrite: true })
}

setupEditorconfig.description = "Creates .editorconfig file"

module.exports = setupEditorconfig
