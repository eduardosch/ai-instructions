# AI Instructions

A collection of Claude Code plugins and skills by Eduardo Schröder.

This repo covers the essential things that I usually do on my projects.

Feel free to create a PR and add more plugins.

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

## Setup Plugin

### <img src="icons/vue.svg" height="20" valign="middle"> `setup-vue-project`

Scaffolds a new Vue 3 project with an opinionated stack — TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier — then runs all setup sub-skills (SCSS, Zod, Axios, Docgen, i18n) and installs all rules plugins so the project is ready from the first commit.

Sub-skills available standalone:

| Sub-skill | What it does |
|---|---|
| `setup-scss` | Installs sass-embedded, global variable + mixin partials, wires vite.config.ts |
| `setup-zod` | Installs Zod, creates `src/env.ts` gateway, fail-fast import |
| `setup-axios` | Creates `src/lib/http.ts` typed wrapper + `src/types/api.ts` |
| `setup-docgen` | Installs Vue Styleguidist, creates `styleguide.config.js` |
| `setup-i18n` | Installs vue-i18n, creates config + locale files, wires i18n Ally |
| `setup-element-plus` | Installs Element Plus with auto-import, dark mode, theming, layouts |
| `setup-firebase` | Installs Firebase, scaffolds typed service modules per selected service |

```bash
/plugin install setup-vue-project@eduardosch-marketplace
```

**Usage:** `/setup-vue-project` — or individual sub-skills like `/setup-element-plus`, `/setup-firebase`

---

## Rules Plugins

Rules plugins enforce coding conventions. They are automatically installed into new projects by `setup-vue-project`, or can be installed individually.

---

### <img src="icons/github.svg" height="20" valign="middle"> `rules-commit`

Generates semantic git commit messages based on staged changes, following the Conventional Commits format with emoji support.

```bash
/plugin install rules-commit@eduardosch-marketplace
```

**Usage:** `/rules-commit`

---

### 📖 `rules-versioning`

Automated semantic versioning — reads commit history since the last git tag, decides the correct MAJOR/MINOR/PATCH bump, prepends a `CHANGELOG.md` entry, and creates a release commit + annotated git tag.

> Requires commits to follow [Conventional Commits](https://www.conventionalcommits.org/) — use `rules-commit` to enforce this.

```bash
/plugin install rules-versioning@eduardosch-marketplace
```

**Usage:** `/rules-versioning`, then `node release.mjs` to cut a release.

---

### <img src="icons/vue.svg" height="20" valign="middle"> `rules-vue-code`

Enforces the official Vue.js style guide for naming and structuring components, composables, and code — organized by priority (Essential / Strongly recommended / Recommended).

```bash
/plugin install rules-vue-code@eduardosch-marketplace
```

**Usage:** `/rules-vue-code`

---

### <img src="icons/vue.svg" height="20" valign="middle"> `rules-ts`

Enforces Vue 3 + TypeScript Composition API conventions — typed props, emits, refs, reactive state, event handlers, provide/inject, and custom directives. Mandates `<script setup lang="ts">` and explicit named types.

```bash
/plugin install rules-ts@eduardosch-marketplace
```

**Usage:** `/rules-ts`

---

### <img src="icons/pinia.svg" height="20" valign="middle"> `rules-pinia`

Enforces conventions for writing Pinia stores with the Composition API — setup syntax, naming, typed state, async actions with loading/error state, computed getters, persistence, and `storeToRefs()` usage.

```bash
/plugin install rules-pinia@eduardosch-marketplace
```

**Usage:** `/rules-pinia`

---

### 🎨 `rules-vue-scss`

SCSS coding conventions for Vue 3 + Vite projects — `lang="scss"` on all style blocks, global variables and mixins, BEM-inspired naming, no inline styles, mobile-first responsive design. Requires `setup-scss`.

```bash
/plugin install rules-vue-scss@eduardosch-marketplace
```

**Usage:** `/rules-vue-scss`

---

### <img src="icons/vue-i18n.svg" height="20" valign="middle"> `rules-i18n`

Enforces internationalization conventions in Vue + vue-i18n projects, compatible with the i18n Ally VS Code extension — key naming, no hardcoded strings, creating keys across all locale files, and auditing missing keys. Requires `setup-i18n`.

```bash
/plugin install rules-i18n@eduardosch-marketplace
```

**Usage:** `/rules-i18n`

---

### 🔒 `rules-zod`

Enforces Zod usage conventions — always consume env variables through `src/env.ts`, never read `import.meta.env` directly, schema conventions, testing patterns, and optional ESLint enforcement. Requires `setup-zod`.

```bash
/plugin install rules-zod@eduardosch-marketplace
```

**Usage:** `/rules-zod`

---

### 🔌 `rules-client-api`

Style guide for structuring API calls — never call axios/fetch in components, typed service modules per domain, composables own loading/error state, typed `ApiError` from interceptor. Requires `setup-axios`.

```bash
/plugin install rules-client-api@eduardosch-marketplace
```

**Usage:** `/rules-client-api`

---

### 🧪 `rules-testing`

House style guide for Vitest unit/component tests and Playwright e2e tests — file layout, naming, Page Object Models, mocking, and auth fixtures for Vue 3 + TypeScript projects.

```bash
/plugin install rules-testing@eduardosch-marketplace
```

**Usage:** `/rules-testing`

---

### 📚 `rules-documentation`

Enforces JSDoc-style comments on Vue 3 reusable components — component description with `@displayName`, every prop/emit/slot documented, side-car `.examples.md` files, and auditing missing documentation. Requires `setup-docgen`.

```bash
/plugin install rules-documentation@eduardosch-marketplace
```

**Usage:** `/rules-documentation`

---

## Uninstalling

```bash
/plugin uninstall <plugin-name>
/plugin marketplace remove eduardosch-marketplace
```

## Contributing 🚀

1. Give this project a star ⭐
2. Fork the project.
3. Execute:

```bash
node create.mjs <plugin-name>
```

- The script creates the folders and files to a new plugin:
  - `plugins/<name>/README.md`
  - `plugins/<name>/skills/<name>/SKILL.md`
  - Registers the plugin in `.claude-plugin/marketplace.json`.
  - Create a new block of description on the root folder of this project


4. Create a branch. (git checkout -b your-branch-name).
5. Make your changes on the new SKILL.md file just created.
6. After that you need to update:
    1. the **README** file of the plugin
    2. the **README** of root folder with the description of the plugin
    3. the **description** and **category** in marketplace.json
7. After this push commit and push via claude, the commit message and CHANGELOG will be automatically updated when the PR is merged
8. create a new pull request using the template provided on PULL_REQUEST_TEMPLATE.md

## License

MIT © [Eduardo Schröder](https://github.com/eduardosch)
