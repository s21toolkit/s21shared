#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { binary, command, restPositionals, run, string } from "cmd-ts"

const s21scaffoldCommand = command({
	name: "s21scaffold",
	aliases: ["s21!"],
	args: {
		tasks: restPositionals({
			type: string,
			displayName: "tasks",
			description: "Tasks to run",
		}),
	},
	handler(argv) {
		const { tasks } = argv

		const result = spawnSync(
			"pnpx",
			["mrm", ...tasks, "--preset", "@s21toolkit/shared", "-i"],
			{ stdio: "inherit" },
		)

		if (result.status !== 0) {
			process.exitCode = 1

			console.error(
				"Failed to execute tasks:\n",
				result.stderr.toString("utf-8"),
			)
		}
	},
})

run(binary(s21scaffoldCommand), process.argv)
