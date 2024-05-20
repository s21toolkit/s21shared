import type { DistinctQuestion } from "inquirer"

declare global {
	type TaskParameter = DistinctQuestion

	type TaskParameters = Record<string, TaskParameter>
}
