const mrm = require("mrm-core")

function configurePackage() {
	const hasBiome = mrm.file("biome.json").exists()
	const hasTypescript = mrm.file("tsconfig.json").exists()

	const lintScripts = []

	if (hasBiome) {
		const hasLintBiomeScript =
			"lint:biome" in mrm.packageJson().get("scripts")

		if (!hasLintBiomeScript) {
			mrm.packageJson().setScript("lint:biome", "biome check .").save()
		}

		lintScripts.push("lint:biome")
	}

	if (hasTypescript) {
		const hasLintTscScript = "lint:tsc" in mrm.packageJson().get("scripts")

		if (!hasLintTscScript) {
			mrm.packageJson().setScript("lint:tsc", "tsc").save()
		}

		lintScripts.push("lint:tsc")
	}

	mrm.packageJson().setScript("lint", lintScripts.join(" && ")).save()

	const hasTsup = mrm.file("tsup.config.ts").exists()

	if (hasTsup) {
		mrm.packageJson().setScript("build", "tsup").save()
	} else if (hasTypescript) {
		mrm.packageJson().setScript("build", "tsc").save()
	}

	const hasBuildScript = "build" in mrm.packageJson().get("scripts")

	if (hasBuildScript) {
		mrm.packageJson().setScript("prepublishOnly", "pnpm build").save()
	}
}

configurePackage.description =
	"Links different tools together and configures package.json, intended to be used after all setup tasks"

module.exports = configurePackage
