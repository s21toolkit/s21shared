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

		lintScripts.push("pnpm lint:biome")
	}

	if (hasTypescript) {
		const hasLintTscScript = "lint:tsc" in mrm.packageJson().get("scripts")

		if (!hasLintTscScript) {
			mrm.packageJson().setScript("lint:tsc", "tsc").save()
		}

		lintScripts.push("pnpm lint:tsc")
	}

	mrm.packageJson().setScript("lint", lintScripts.join(" && ")).save()

	if (hasBiome) {
		const hasFixBiomeScript = "fix:biome" in mrm.packageJson().get("scripts")

		if (!hasFixBiomeScript) {
			mrm.packageJson()
				.setScript("fix:biome", "biome check --apply .")
				.save()
		}

		mrm.packageJson().setScript("fix", "pnpm fix:biome").save()
	}

	const hasTsup = mrm.file("tsup.config.ts").exists()

	if (hasTsup) {
		const hasBuildTsupScript =
			"build:tsup" in mrm.packageJson().get("scripts")

		const buildTsupScript = hasBuildTsupScript ? "pnpm build:tsup" : "tsup"

		mrm.packageJson()
			.setScript("build", `pnpm lint && ${buildTsupScript}`)
			.save()
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
