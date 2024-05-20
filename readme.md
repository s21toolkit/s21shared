# s21shared

Переиспользуемые конфигурации и шаблоны для проектов s21toolkit.

```sh
pnpx mrm setup --preset @s21toolkit/shared -i
```

## Конфигурации

Для использования конфигураций нужно установить пакет:

```sh
pnpm add -D @s21toolkit/shared
```

### biome

biome.json

```json
{
	"extends": ["node_modules/@s21toolkit/shared/biome.json"]
}
```

### tsconfig

Доступные конфигурации:

* `base.tsconfig.json` - Базовая конфигурация с настройками типизации.
* `node.tsconfig.json` - Конфигурация для сборки через tsc под Node.js.
* `tsup.tsconfig.json` - Конфигурация для сборки через tsup.

tsconfig.json

```json
{
	"extends": ["@s21toolkit/shared/tsconfig/tsup.tsconfig.json"]
}
```

### tsup

tsup.config.js

```ts
import { defineConfig } from "tsup"
import { configs } from "@s21toolkit/shared/tsup"

export default defineConfig([
	{
		...configs.nodeLibrary
	},
	{
		...configs.cli
	}
])
```

## Шаблоны

Шаблоны устанавливаются через `mrm` (см. [Документацию](https://mrm.js.org/)):

```sh
pnpx mrm <...шаблоны> --preset @s21toolkit/shared -i
```

Доступные шаблоны:

* `gitignore` - Создаёт `.gitignore`.
* `editorconfig` - Создаёт `.editorconfig`.
* `license` - Создаёт `LICENSE`.
* `biome` - Устанавливает линтер `biome` и конфигурацию для него (см. выше).
* `package-base` - Создаёт базовый `package.json` для проектов s21toolkit.
* `package` - Создаёт полноценный проект s21toolkit с typescript/tsup и конфигурацией, рекоммендуется использовать в интерактивном (`-i`) режиме.
* `configure` - Настраивает `package.json` (в основном скрипты) в зависимости от используемых инструментов.
* `setup` - Устанавливает все предыдущие шаблоны в нужном порядке.
