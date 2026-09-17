---
name: vue-project-setup
description: Scaffolds a new Vue 3 project with TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools, then installs the commit-message, versioning, vue-style-guide, vue-ts-style-guide, pinia-style-guide, vue-scss-setup, api-client-conventions, and vue-component-docs plugins. Always strips example files and replaces App.vue with a clean landing page. Use when starting a new Vue 3 project.
---

# Vue Project Setup

Instructions for scaffolding a new Vue project.

## 1. Create the project

`create-vue` requires a valid package name as the positional argument — passing `.` triggers an interactive prompt. Run the command from the **parent directory**, using the current folder name as the project name:

```bash
# from the parent directory (e.g. cd ..)
npx create-vue@latest <project-folder-name> --typescript --jsx --router --pinia --playwright --eslint --prettier --force
```

Then change back into the project directory before running the remaining steps.

## 1.5 Strip examples

Delete all example files that `create-vue` generates (run inside the project directory):

```bash
# macOS / Linux
rm -rf src/components src/views/HomeView.vue src/views/AboutView.vue src/assets
```

```powershell
# Windows (PowerShell)
Remove-Item -Recurse -Force src/components, src/assets
Remove-Item -Force src/views/HomeView.vue, src/views/AboutView.vue
```

Also remove the CSS import from `src/main.ts` — delete the line `import './assets/main.css'` (or `import './assets/base.css'` — whichever `create-vue` generated).

Then clear the router so the deleted views no longer cause TypeScript errors.
Replace the contents of `src/router/index.ts` with:

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

export default router
```

Replace `src/App.vue` with the landing page template. Read the file `home-page.vue` located in the same directory as this skill file and copy its contents to `src/App.vue`, then substitute every occurrence of `<project-name>` with the actual project folder name.

## 2. Install npm packages

```bash
npm install --legacy-peer-deps
npm install axios
npm install -D sass-embedded vue-styleguidist vue-docgen-api webpack webpack-dev-server css-loader style-loader vue-loader ts-loader
```

- **axios** — HTTP client used by `api-client-conventions` (`src/lib/http.ts`)
- **sass-embedded** — modern Dart Sass implementation required by `vue-scss-setup`; use this instead of `sass` to avoid the legacy-JS-API deprecation warning under Vite
- **vue-styleguidist** + **vue-docgen-api** — powers the live component documentation site (`npm run styleguide`)
- **webpack**, **webpack-dev-server**, **css-loader**, **style-loader**, **vue-loader**, **ts-loader** — webpack peer dependencies required by Vue Styleguidist in a Vite-only project

## 3. Fix tsconfig.app.json

Always replace `tsconfig.app.json` with the following inline configuration — `@vue/tsconfig/tsconfig.dom.json` is frequently missing from the installed package, so the extends is inlined instead:

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "baseUrl": ".",
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "skipLibCheck": true
  },
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"]
}
```

## 4. Wire the plugins

The `/plugin install` slash commands do not run reliably inside a skill. Instead, directly create the project's `.claude/settings.json` so Claude Code picks up all plugins when the project is opened:

```json
{
  "enabledPlugins": {
    "commit-message@eduardosch-marketplace": true,
    "versioning@eduardosch-marketplace": true,
    "vue-style-guide@eduardosch-marketplace": true,
    "vue-ts-style-guide@eduardosch-marketplace": true,
    "pinia-style-guide@eduardosch-marketplace": true,
    "vue-scss-setup@eduardosch-marketplace": true,
    "api-client-conventions@eduardosch-marketplace": true,
    "vue-component-docs@eduardosch-marketplace": true
  }
}
```

Write this file to `.claude/settings.json` inside the project directory (create the `.claude` folder if it does not exist).

Then register the marketplace so Claude Code can resolve the plugin source:

```
/plugin marketplace add eduardosch/ai-instructions
```

- **commit-message** — enables semantic commit messages
- **versioning** — keeps control of the app version and automatically generates a `CHANGELOG.md`
- **vue-style-guide** — Vue style guide rules
- **vue-ts-style-guide** — TypeScript style guide rules
- **pinia-style-guide** — Pinia store conventions
- **vue-scss-setup** — configures Sass/SCSS with global variables and mixins via Vite
- **api-client-conventions** — typed axios/fetch wrapper, error normalisation, service modules, and Vue 3 composables
- **vue-component-docs** — JSDoc conventions and Vue Styleguidist site for component library documentation

## 5. Show a summary

Once everything is finished, show the user a bullet list with emojis and short descriptions of what was done, e.g.:

- ⚡ **Vue project created** — scaffolded with TypeScript, JSX, Router, and Pinia; example files stripped, custom App.vue landing page applied
- 🧪 **Playwright** — end-to-end testing solution added
- 🧹 **ESLint + Prettier** — code quality and formatting configured
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