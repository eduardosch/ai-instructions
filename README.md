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

## Plugins

### <img src="icons/github.svg" height="20" valign="middle"> `commit-message`

Generates semantic git commit messages based on your staged changes, following the Conventional Commits format with emoji support. Handles branch creation, push confirmation, and breaking change detection.

```bash
/plugin install commit-message@eduardosch-marketplace
```

**Usage:** `/commit-message`

---

### 📖 `versioning`

Automated semantic versioning — reads commit history since the last git tag, decides the correct MAJOR/MINOR/PATCH bump, prepends a `CHANGELOG.md` entry, and creates a release commit + annotated git tag. Works in any git repo; updates `package.json` too when present.

> Requires commits to follow [Conventional Commits](https://www.conventionalcommits.org/) — use `commit-message` to enforce this automatically.

```bash
/plugin install versioning@eduardosch-marketplace
```

**Usage:** `/versioning` to set up a project, then `node release.mjs` (or `npm run release`) to cut a release.

---

### <img src="icons/vue.svg" height="20" valign="middle"> `vue-project-setup`

Scaffolds a new Vue 3 project with an opinionated stack: TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools — then automatically installs the `commit-message`, `versioning`, `vue-style-guide`, `vue-ts-style-guide`, and `pinia-style-guide` plugins so the project is ready to go from the first commit.

```bash
/plugin install vue-project-setup@eduardosch-marketplace
```

**Usage:** `/vue-project-setup`

---

### <img src="icons/pinia.svg" height="20" valign="middle"> `pinia-style-guide`

Enforces conventions for writing Pinia stores with the Composition API — setup syntax, naming, folder structure, typed state, async actions with loading/error state, computed getters, persistence, testing, and correct usage inside components with `storeToRefs()`.

```bash
/plugin install pinia-style-guide@eduardosch-marketplace
```

**Usage:** `/pinia-style-guide`

---

### <img src="icons/vue-i18n.svg" height="20" valign="middle"> `vue-i18n`

Enforces internationalization best practices in Vue.js + vue-i18n projects, fully compatible with the i18n Ally VS Code extension. Covers i18n Ally config, key naming conventions, creating keys across all locale files, auditing missing/unused keys, and ensuring all user-facing strings go through `$t()`/`t()` instead of being hardcoded.

```bash
/plugin install vue-i18n@eduardosch-marketplace
```

**Usage:** `/vue-i18n`

---

### <img src="icons/vue.svg" height="20" valign="middle"> `vue-style-guide`

A comprehensive Vue style guide skill covering naming conventions, component structure, and code patterns — organized by priority (Essential / Strongly recommended / Recommended) so teams know what's negotiable and what isn't.

```bash
/plugin install vue-style-guide@eduardosch-marketplace
```

**Usage:** `/vue-style-guide`

---

### <img src="icons/vue.svg" height="20" valign="middle"> `vue-ts-style-guide`

Enforces Vue 3 + TypeScript conventions for Composition API codebases — props, emits, refs, reactive state, event handlers, provide/inject, and custom directives. Mandates `<script setup lang="ts">` and explicit named types throughout. Based on the [official Vue.js TypeScript guide](https://vuejs.org/guide/typescript/composition-api.html).

```bash
/plugin install vue-ts-style-guide@eduardosch-marketplace
```

**Usage:** `/vue-ts-style-guide`

---

### 🎨 `vue-scss-setup`

Configures Sass/SCSS in a Vue 3 + Vite project — installs `sass-embedded`, creates global variable partials (colors, fonts, breakpoints) and mixin partials (px-to-rem, responsive, truncate), and wires them into every component automatically via `vite.config.ts` `additionalData`.

> Trigger when adding Sass to a Vue project, setting up global SCSS variables/mixins, or scaffolding styles for a `create-vue` project.

```bash
/plugin install vue-scss-setup@eduardosch-marketplace
```

**Usage:** `/vue-scss-setup`

---

### 🔌 `api-client-conventions`

Style guide for structuring API calls and services with full TypeScript coverage — singleton axios wrapper with interceptors, typed service modules, normalised `ApiError`, `PaginatedResponse<T>`, and Vue 3 composables with `isLoading`/`error` state. Pairs with `vue-ts-style-guide`.

> Style guide for structuring API calls and services — typed axios/fetch wrapper, error normalisation, service modules, and Vue 3 composables

```bash
/plugin install api-client-conventions@eduardosch-marketplace
```

**Usage:** `/api-client-conventions`

---

### 🔌 `testing-conventions`

House style guide for Vitest unit/component tests and Playwright e2e tests — file layout, naming, Page Object Models, mocking, and auth fixtures for Vue 3 + TypeScript projects.

> Pairs with `vue-project-setup` (which scaffolds Playwright) and `vue-ts-style-guide`.

```bash
/plugin install testing-conventions@eduardosch-marketplace
```

**Usage:** `/testing-conventions`

---

### 🔒 `env-validation`

Enforces `.env` schema validation with Zod so projects fail fast on missing or malformed config — never silently at runtime. Covers a single typed gateway file (`src/env.ts`), fail-fast startup import, `.env.example` parity, boolean coercion, and Vitest-safe environment stubs. Works with Vite/Vue and Node/Express projects.

```bash
/plugin install env-validation@eduardosch-marketplace
```

**Usage:** `/env-validation`

---

### <img src="icons/vue.svg" height="20" valign="middle"> `vue-component-docs`

Documents Vue 3 reusable components with JSDoc-style comments and generates a live, browsable style guide with Vue Styleguidist powered by `vue-docgen-api`. Covers component-level JSDoc, typed prop annotations, emit payloads, slot documentation, side-car `.examples.md` files, and Styleguidist config with sections and webpack setup.

```bash
/plugin install vue-component-docs@eduardosch-marketplace
```

**Usage:** `/vue-component-docs`

---

### 🧩 `element-plus-setup`

Installs and configures Element Plus in a Vue 3 + Vite project — sets up auto-import, enables optional dark mode via VueUse `useDark()` with a moon/sun toggle in the header, aligns theming with existing SCSS variables or Element Plus defaults, optionally installs the icons package, and scaffolds an optional app structure with authentication pages and a chosen navigation layout (top-bar only, top-bar + sidebar, two-level sidebar). Uses the project folder name as the brand label.

```bash
/plugin install element-plus-setup@eduardosch-marketplace
```

**Usage:** `/element-plus-setup`

---

### 🔥 `firebase-setup`

Installs and configures Firebase in any TypeScript project — asks which services to enable (Firestore, Authentication, Realtime Database, Storage, Cloud Functions, Hosting), scaffolds typed service modules under `src/lib/`, and wires all Firebase config through environment variables. Credentials can be provided upfront or filled in later via `.env.example`. Integrates with `env-validation` when present.

```bash
/plugin install firebase-setup@eduardosch-marketplace
```

**Usage:** `/firebase-setup`

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
