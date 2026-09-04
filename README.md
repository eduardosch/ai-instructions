# AI Instructions

A collection of Claude Code plugins and skills by Eduardo Schröder.

This repo covers the essential things that I usually do on my projects.

But feel free to create a PR and add more plugins.

## Creating a new plugin

```bash
node create.mjs <plugin-name>
```

- The script creates the folders and files to a new plugin:
1. `plugins/<name>/README.md`
2. `plugins/<name>/skills/<name>/SKILL.md`
3. Registers the plugin in `.claude-plugin/marketplace.json`.

- Create a new branch on the format <plugin-name/author>
- After that you need to update the **README** and **SKILL** file of the plugin
- After this push commit and push via claude, the commit message and CHANGELOG will be automatically updated
- create a new pull request using the template provided on PULL_REQUEST_TEMPLATE.md

## Installation

Launch Claude Code first:

```bash
claude
```

Then add this marketplace:

```bash
/plugin marketplace add eduardosch/ai-instructions
```

Install any plugin individually:

```bash
/plugin install <plugin-name>@eduardosch-marketplace
```

---

## Plugins

### `commit-message`

Generates semantic git commit messages based on your staged changes, following the Conventional Commits format with emoji support. Handles branch creation, push confirmation, and breaking change detection.

```bash
/plugin install commit-message@eduardosch-marketplace
```

**Usage:** `/commit-message`

---

### `versioning`

Automated semantic versioning — reads commit history since the last git tag, decides the correct MAJOR/MINOR/PATCH bump, prepends a `CHANGELOG.md` entry, and creates a release commit + annotated git tag. Works in any git repo; updates `package.json` too when present.

> Requires commits to follow [Conventional Commits](https://www.conventionalcommits.org/) — use `commit-message` to enforce this automatically.

```bash
/plugin install versioning@eduardosch-marketplace
```

**Usage:** `/versioning` to set up a project, then `node release.mjs` (or `npm run release`) to cut a release.

---

### `vue-project-setup`

Scaffolds a new Vue 3 project with an opinionated stack: TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools — then automatically installs the `commit-message`, `versioning`, `vue-style-guide`, `vue-ts-style-guide`, and `pinia-style-guide` plugins so the project is ready to go from the first commit.

```bash
/plugin install vue-project-setup@eduardosch-marketplace
```

**Usage:** `/vue-project-setup`

---

### `pinia-style-guide`

Enforces conventions for writing Pinia stores with the Composition API — setup syntax, naming, folder structure, typed state, async actions with loading/error state, computed getters, persistence, testing, and correct usage inside components with `storeToRefs()`.

```bash
/plugin install pinia-style-guide@eduardosch-marketplace
```

**Usage:** `/pinia-style-guide`

---

### `vue-i18n`

Enforces internationalization best practices in Vue.js + vue-i18n projects, fully compatible with the i18n Ally VS Code extension. Covers i18n Ally config, key naming conventions, creating keys across all locale files, auditing missing/unused keys, and ensuring all user-facing strings go through `$t()`/`t()` instead of being hardcoded.

```bash
/plugin install vue-i18n@eduardosch-marketplace
```

**Usage:** `/vue-i18n`

---

### `vue-ts-style-guide`

Enforces Vue 3 + TypeScript conventions for Composition API codebases — props, emits, refs, reactive state, event handlers, provide/inject, and custom directives. Mandates `<script setup lang="ts">` and explicit named types throughout. Based on the [official Vue.js TypeScript guide](https://vuejs.org/guide/typescript/composition-api.html).

```bash
/plugin install vue-ts-style-guide@eduardosch-marketplace
```

**Usage:** `/vue-ts-style-guide`

---

### `vue-style-guide`

A comprehensive Vue style guide skill covering naming conventions, component structure, and code patterns — organized by priority (Essential / Strongly recommended / Recommended) so teams know what's negotiable and what isn't.

```bash
/plugin install vue-style-guide@eduardosch-marketplace
```

**Usage:** `/vue-style-guide`

---

## Uninstalling

```bash
/plugin uninstall <plugin-name>
/plugin marketplace remove eduardosch-marketplace
```

## License

MIT © [Eduardo Schröder](https://github.com/eduardosch)
