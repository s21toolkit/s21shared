const path = require("node:path")
const mrm = require("mrm-core")

const templateDirectory = path.resolve(__dirname, "template")

function setupLicense() {
	mrm.copyFiles(templateDirectory, "LICENSE", { overwrite: true })
}

setupLicense.description = "Creates LICENSE file"

module.exports = setupLicense
