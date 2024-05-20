#!/usr/bin/env node

import { binary, command, run } from "cmd-ts"

const helloCommand = command({
	name: "hello",
	args: {},
	handler() {
		console.log("Hello, World!")
	},
})

run(binary(helloCommand), process.argv)
