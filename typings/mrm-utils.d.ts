import type * as prompts from "@inquirer/prompts"

type Prompts = {
	[K in keyof typeof prompts & Lowercase<string>]: (typeof prompts)[K]
}

declare global {
	// This is far from perfect, but at least gives some hints
	type TaskParameter = {
		[K in keyof Prompts]: {
			type: K
		} & Partial<Parameters<Prompts[K]>[0]>
	}[keyof Prompts]

	type TaskParameters = Record<string, TaskParameter>
}
