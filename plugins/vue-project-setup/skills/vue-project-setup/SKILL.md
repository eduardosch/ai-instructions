---
name: vue-project-setup
description: Scaffolds a new Vue 3 project with TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools, then installs the commit-message, versioning, vue-style-guide, vue-ts-style-guide, pinia-style-guide, vue-scss-setup, api-client-conventions, and vue-component-docs plugins. Use when starting a new Vue 3 project.
---

# Vue Project Setup

Instructions for scaffolding a new Vue project.

## 1. Create the project

Run:

```
npm create vue@latest -- .
```

## 2. Ask for the project name

Prompt the user for the project name before continuing.

## 3. Select these options

```
✔ Project name: … name of the project that the user chose before
✔ Add TypeScript? … Yes
✔ Add JSX Support? … Yes
✔ Add Vue Router for Single Page Application development? … Yes
✔ Add Pinia for state management? … Yes
✔ Add Vitest for Unit testing? … No
✔ Add an End-to-End Testing Solution? … Playwright
✔ Add ESLint for code quality? … Yes
✔ Add Prettier for code formatting? … Yes
✔ Add Vue DevTools … Yes
```

## 4. Install additional plugins

​```
1. /plugin marketplace add eduardosch/ai-instructions
2. /plugin install commit-message@eduardosch-marketplace
3. /plugin install versioning@eduardosch-marketplace
4. /plugin install vue-style-guide@eduardosch-marketplace
5. /plugin install vue-ts-style-guide@eduardosch-marketplace
6. /plugin install pinia-style-guide@eduardosch-marketplace
7. /plugin install vue-scss-setup@eduardosch-marketplace
8. /plugin install api-client-conventions@eduardosch-marketplace
9. /plugin install vue-component-docs@eduardosch-marketplace
​```

- **commit-message** — enables semantic commit messages
- **versioning** — keeps control of the app version and automatically generates a `CHANGELOG.md`
- **vue-style-guide** — Vue style guide rules
- **vue-ts-style-guide** — TypeScript style guide rules
- **pinia-style-guide** — Pinia store conventions
- **vue-scss-setup** — configures Sass/SCSS with global variables and mixins via Vite
- **api-client-conventions** — typed axios/fetch wrapper, error normalisation, service modules, and Vue 3 composables
- **vue-component-docs** — JSDoc conventions and Vue Styleguidist site for component library documentation

## 5. Install npm packages

Run the following after the project scaffolding and plugin installation:

```bash
npm install axios
npm install -D sass-embedded vue-styleguidist vue-docgen-api webpack webpack-dev-server css-loader style-loader vue-loader ts-loader
```

- **axios** — HTTP client used by `api-client-conventions` (`src/lib/http.ts`)
- **sass-embedded** — modern Dart Sass implementation required by `vue-scss-setup`; use this instead of `sass` to avoid the legacy-JS-API deprecation warning under Vite
- **vue-styleguidist** + **vue-docgen-api** — powers the live component documentation site (`npm run styleguide`)
- **webpack**, **webpack-dev-server**, **css-loader**, **style-loader**, **vue-loader**, **ts-loader** — webpack peer dependencies required by Vue Styleguidist in a Vite-only project

## 6. Show a summary

Once everything is finished, show the user a bullet list with emojis and short descriptions of what was done, e.g.:

- ⚡ **Vue project created** — scaffolded with TypeScript, JSX, Router, and Pinia
- 🧪 **Playwright** — end-to-end testing solution added
- 🧹 **ESLint + Prettier** — code quality and formatting configured
- 🛠️ **Vue DevTools** — enabled for debugging
- 📝 **Commit-message plugin** — semantic commit messages enabled
- 🔖 **Versioning plugin** — automatic app versioning and `CHANGELOG.md` generation
- 🎨 **vue-style-guide** — Vue style guide rules installed
- 📘 **vue-ts-style-guide** — TypeScript style guide rules installed
- 🍍 **pinia-style-guide** — Pinia store conventions installed
- 🎨 **vue-scss-setup** — Sass/SCSS configured with global variables and mixins
- 🌐 **api-client-conventions** — typed API client with error normalisation, service modules, and composables
- 📚 **vue-component-docs** — JSDoc conventions and Styleguidist site for component library documentation
- 📦 **axios** — HTTP client installed for the API service layer
- 📦 **sass-embedded** — Dart Sass installed for SCSS compilation
- 📦 **vue-styleguidist + deps** — Styleguidist and webpack peer dependencies installed for component docs