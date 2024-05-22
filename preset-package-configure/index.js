const mrm = require("mrm-core")

const SCRIPT_SORT_PRIORITY = ["lint", "fix", "test", "build"]

/**
 * @param {object} parameters
 * @param {boolean} parameters.sortPackageScripts
 */
function configurePackage(parameters) {
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

	if (parameters.sortPackageScripts) {
		/** @type {Record<string, string>} */
		const packageScripts = mrm.packageJson().get("scripts") ?? {}

		/** @type {Map<string, string[]>} */
		const categorizedScripts = new Map()

		for (const name in packageScripts) {
			const category = name.split(":")[0] ?? ""

			const scripts = categorizedScripts.get(category) ?? []

			scripts.push(name)

			categorizedScripts.set(category, scripts)
		}

		const sortedCategories = Array.from(categorizedScripts.entries()).sort(
			(a, b) => {
				let aPriority = SCRIPT_SORT_PRIORITY.indexOf(a[0])
				let bPriority = SCRIPT_SORT_PRIORITY.indexOf(b[0])

				if (aPriority === -1) {
					aPriority = SCRIPT_SORT_PRIORITY.length
				}

				if (bPriority === -1) {
					bPriority = SCRIPT_SORT_PRIORITY.length
				}

				return aPriority - bPriority || a[1].length - b[1].length
			},
		)

		const sortedScriptsEntries = []

		for (const [, scripts] of sortedCategories) {
			const sortedScripts = scripts.sort((a, b) => b.localeCompare(a))

			sortedScriptsEntries.push(
				...sortedScripts.map(
					(script) =>
						/** @type {const} */ ([script, packageScripts[script] ?? ""]),
				),
			)
		}

		mrm.packageJson()
			.set("scripts", Object.fromEntries(sortedScriptsEntries))
			.save()
	}
}

configurePackage.description =
	"Links different tools together and configures package.json, intended to be used after all setup tasks"

/** @type {TaskParameters} */
configurePackage.parameters = {
	sortPackageScripts: {
		type: "confirm",
		default: true,
		message: "Sort package.json scripts",
	},
}

module.exports = configurePackage
