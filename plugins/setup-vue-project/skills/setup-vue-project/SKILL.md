---
name: setup-vue-project
description: Scaffolds a new Vue 3 project with TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools, then runs all setup sub-skills (setup-scss, setup-zod, setup-axios, setup-docgen, setup-i18n) and installs the rules plugins. Always strips example files and replaces App.vue with a clean landing page. Use when starting a new Vue 3 project.
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

- **axios** — HTTP client used by `setup-axios` (`src/lib/http.ts`)
- **sass-embedded** — modern Dart Sass implementation required by `setup-scss`; use this instead of `sass` to avoid the legacy-JS-API deprecation warning under Vite
- **vue-styleguidist** + **vue-docgen-api** — powers the live component documentation site (`npm run styleguide`)
- **webpack**, **webpack-dev-server**, **css-loader**, **style-loader**, **vue-loader**, **ts-loader** — webpack peer dependencies required by Vue Styleguidist in a Vite-only project

## 3. Fix tsconfig.app.json

Always replace `tsconfig.app.json` with the following inline configuration — `@vue/tsconfig/tsconfig.dom.json` is frequently missing from the installed package, so the extends is inlined instead:

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
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

## 4. Run setup sub-skills

After the base project is created and packages are installed, load and follow each sub-skill in order:

1. **`setup-scss`** — installs sass-embedded, copies global SCSS partials, wires `vite.config.ts`
2. **`setup-zod`** — installs Zod, creates `src/env.ts` gateway, adds fail-fast import to `main.ts`
3. **`setup-axios`** — creates `src/lib/http.ts` typed axios wrapper and `src/types/api.ts`
4. **`setup-docgen`** — installs Vue Styleguidist, creates `styleguide.config.js`, adds npm scripts

`setup-i18n` is optional — run it only if the project requires internationalization.

`setup-element-plus` and `setup-firebase` are optional and run on demand when the user asks for them.

## 5. Wire the plugins

Create the project's `.claude/settings.json` so Claude Code picks up all rules plugins when the project is opened:

```json
{
  "enabledPlugins": {
    "rules-commit@eduardosch-marketplace": true,
    "rules-versioning@eduardosch-marketplace": true,
    "rules-vue-code@eduardosch-marketplace": true,
    "rules-ts@eduardosch-marketplace": true,
    "rules-pinia@eduardosch-marketplace": true,
    "rules-vue-scss@eduardosch-marketplace": true,
    "rules-client-api@eduardosch-marketplace": true,
    "rules-documentation@eduardosch-marketplace": true,
    "rules-zod@eduardosch-marketplace": true
  }
}
```

Write this file to `.claude/settings.json` inside the project directory (create the `.claude` folder if it does not exist).

Then register the marketplace so Claude Code can resolve the plugin source:

```
/plugin marketplace add eduardosch/ai-instructions
```

- **rules-commit** — semantic commit messages
- **rules-versioning** — automatic app versioning and `CHANGELOG.md` generation
- **rules-vue-code** — Vue style guide rules
- **rules-ts** — TypeScript Composition API conventions
- **rules-pinia** — Pinia store conventions
- **rules-vue-scss** — SCSS coding conventions
- **rules-client-api** — typed API client conventions
- **rules-documentation** — JSDoc and component documentation conventions
- **rules-zod** — Zod usage patterns and env validation rules

## 6. Show a summary

Once everything is finished, show the user a bullet list with emojis and short descriptions of what was done, e.g.:

- ⚡ **Vue project created** — scaffolded with TypeScript, JSX, Router, and Pinia; example files stripped, custom App.vue landing page applied
- 🧪 **Playwright** — end-to-end testing solution added
- 🧹 **ESLint + Prettier** — code quality and formatting configured
- 🎨 **setup-scss** — Sass/SCSS configured with global variables and mixins
- 🔒 **setup-zod** — environment variable validation with Zod gateway
- 🌐 **setup-axios** — typed axios wrapper with error normalisation, service modules, and composables
- 📚 **setup-docgen** — Vue Styleguidist configured for component library documentation
- 📝 **rules-commit** — semantic commit messages enabled
- 🔖 **rules-versioning** — automatic versioning and CHANGELOG generation
- 🎨 **rules-vue-code** — Vue style guide installed
- 📘 **rules-ts** — TypeScript Composition API rules installed
- 🍍 **rules-pinia** — Pinia store conventions installed
- 🖌️ **rules-vue-scss** — SCSS coding conventions installed
- 🌐 **rules-client-api** — API client conventions installed
- 📚 **rules-documentation** — component documentation rules installed
- 🔒 **rules-zod** — Zod usage rules installed
- 📦 **axios** — HTTP client installed
- 📦 **sass-embedded** — Dart Sass installed
- 📦 **vue-styleguidist + deps** — Styleguidist and webpack peer dependencies installed
