---
name: setup-vue-project
description: Scaffolds a new Vue 3 project with TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools, then runs the core setup sub-skills (setup-scss, setup-zod, setup-axios, setup-docgen) and installs all rules plugins. Always strips example files and replaces App.vue with a clean landing page. Use when starting a new Vue 3 project.
---

# Vue Project Setup

Instructions for scaffolding a new Vue project.

## 1. Create the project

`create-vue` requires a valid package name as the positional argument — passing `.` triggers an interactive prompt. Run the command from the **parent directory**, using the current folder name as the project name:

```bash
# from the parent directory (e.g. cd ..)
pnpm create vue@latest <project-folder-name> --typescript --jsx --router --pinia --playwright --eslint --prettier --force
```

Then change back into the project directory before running the remaining steps.

## 1.5 Strip examples

Delete all example files that `create-vue` generates (run inside the project directory):

```bash
# macOS / Linux
rm -rf src/components src/views/HomeView.vue src/views/AboutView.vue src/assets
rm -f src/stores/counter.ts
```

```powershell
# Windows (PowerShell)
Remove-Item -Recurse -Force src/components, src/assets
Remove-Item -Force src/views/HomeView.vue, src/views/AboutView.vue
Remove-Item -Force src/stores/counter.ts
```

Also remove the CSS import from `src/main.ts` — delete the line `import './assets/main.css'` (or `import './assets/base.css'` — whichever `create-vue` generated), then add the global stylesheet import in its place:

```ts
import '@/assets/styles/global.scss'
```

Then clear the router so the deleted views no longer cause TypeScript errors.
Replace the contents of `src/router/index.ts` with:

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
  ],
})

export default router
```

Replace `src/App.vue` with the layout shell. Read the file `App.vue` located in the same directory as this skill file and copy its contents to `src/App.vue`.

Copy the home view and its page-specific subcomponents to `src/views/` (create the directory if it does not exist). Read the files from the `views/` subdirectory next to this skill file and write each one to `src/views/`:
- `HomeView.vue`
- `HomeViewRulesList.vue`
- `HomeViewRulesListItem.vue`

Create `src/assets/styles/` and copy the global stylesheet. Read the file `global.scss` from the same directory as this skill file and write it to `src/assets/styles/global.scss`.

Also create the icons directory and copy the bundled SVG assets. Read the files `vue-logo.svg`, `icon-terminal.svg`, `icon-folder.svg`, `icon-help.svg`, `icon-contact.svg`, `icon-check-circle.svg`, `icon-code.svg`, `icon-drop.svg`, `icon-shield.svg`, `icon-globe.svg`, and `icon-document.svg` from the same directory as this skill file, then write each one to `src/assets/icons/` (create the directory first).

Copy the component templates to `src/components/` (create the directory first). Read each file from the `components/` subdirectory next to this skill file and write it to `src/components/`:
- `TheHeader.vue`
- `TheFooter.vue`
- `AppButton.vue`
- `AppCard.vue`
- `AppTag.vue`

Copy the store template to `src/stores/`. Read `stores/useHomeStore.ts` from the same directory as this skill file and write it to `src/stores/useHomeStore.ts`.

Copy the favicon files to `public/`. Read each file from the `favicons/` subdirectory next to this skill file and write it to `public/`:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-48x48.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest` — substitute every occurrence of `<project-name>` with the actual project folder name before writing

Update `index.html` in the project root:
1. Replace `<title>Vite App</title>` with `<title>%VITE_APP_TITLE%</title>`
2. Add the following favicon links inside `<head>`, after the existing `<link rel="icon" ...>` tag (replace it):

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

Add `VITE_APP_TITLE=<project-folder-name>` to `.env.example` (substituting the actual project folder name).

## 2. Install packages

```bash
pnpm install
pnpm add axios
pnpm add -D sass-embedded vue-styleguidist vue-docgen-api webpack webpack-dev-server css-loader style-loader vue-loader ts-loader vite-svg-loader
```

- **axios** — HTTP client used by `setup-axios` (`src/lib/http.ts`)
- **sass-embedded** — modern Dart Sass implementation required by `setup-scss`; use this instead of `sass` to avoid the legacy-JS-API deprecation warning under Vite
- **vue-styleguidist** + **vue-docgen-api** — powers the live component documentation site (`pnpm run styleguide`)
- **webpack**, **webpack-dev-server**, **css-loader**, **style-loader**, **vue-loader**, **ts-loader** — webpack peer dependencies required by Vue Styleguidist in a Vite-only project
- **vite-svg-loader** — imports SVG files as Vue components via the `?component` query suffix

## 2.5 Configure vite-svg-loader

Open `vite.config.ts` and add the import at the top after the existing imports:

```ts
import svgLoader from 'vite-svg-loader'
```

Then add `svgLoader()` to the `plugins` array alongside the existing plugins (e.g. `vue()`, `vueJsx()`, `vueDevTools()`).

Open `env.d.ts` and add the type reference on a new line after the existing `/// <reference types="vite/client" />` line:

```ts
/// <reference types="vite-svg-loader" />
```

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

## 4. Register marketplace and wire plugins

Register the marketplace so Claude Code can resolve the sub-skill and rules plugins:

```
/plugin marketplace add eduardosch/ai-instructions
```

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
    "rules-zod@eduardosch-marketplace": true,
    "rules-vue-router@eduardosch-marketplace": true
  }
}
```

Write this file to `.claude/settings.json` inside the project directory (create the `.claude` folder if it does not exist).

## 4.5 Run setup sub-skills

Do NOT stop or summarise here — continue running all steps in this section without pausing.

Invoke each sub-skill in order using the Skill tool and follow all of its instructions before moving to the next one:

1. Invoke the `setup-scss` skill and follow all its instructions.
2. Invoke the `setup-zod` skill and follow all its instructions.
3. Invoke the `setup-axios` skill and follow all its instructions.
4. Invoke the `setup-docgen` skill and follow all its instructions.

`setup-i18n` is optional — invoke the `setup-i18n` skill only if the project requires internationalization.

`setup-element-plus` and `setup-firebase` are separate standalone plugins — the user must invoke them explicitly after the project is created.

## 4.75 Create .env.development.local

Copy `.env.example` to `.env.development.local` so Vite can load environment variables on `pnpm run dev`:

```bash
# macOS / Linux
cp .env.example .env.development.local
```

```powershell
# Windows (PowerShell)
Copy-Item .env.example .env.development.local
```

> Without this file the app will fail to load because `setup-zod` validates env vars at startup and `.env.example` is not loaded by Vite automatically.

## 5. Plugin descriptions

- **rules-commit** — semantic commit messages
- **rules-versioning** — automatic app versioning and `CHANGELOG.md` generation
- **rules-vue-code** — Vue style guide rules
- **rules-ts** — TypeScript Composition API conventions
- **rules-pinia** — Pinia store conventions
- **rules-vue-scss** — SCSS coding conventions
- **rules-client-api** — typed API client conventions
- **rules-documentation** — JSDoc and component documentation conventions
- **rules-zod** — Zod usage patterns and env validation rules
- **rules-vue-router** — Vue Router conventions (lazy loading, file-based routing, Composition API, data fetching)

## 6. Show a summary

Once everything is finished, show the user a bullet list with emojis and short descriptions of what was done, e.g.:

- ⚡ **Vue project created** — scaffolded with TypeScript, JSX, Router, and Pinia; example files stripped, custom App.vue landing page applied
- 🧩 **Components** — `TheHeader`, `TheFooter`, `AppButton`, `AppCard`, `AppTag` created in `src/components/`; `HomeView`, `HomeViewRulesList`, `HomeViewRulesListItem` created in `src/views/`
- 🍍 **Home store** — `useHomeStore` created in `src/stores/` with cards, setupCards, ruleRows, and tags
- 🎨 **Favicons** — favicon set copied to `public/`, `index.html` updated with favicon links and `%VITE_APP_TITLE%`
- 🧪 **Playwright** — end-to-end testing solution added
- 🧹 **ESLint + Prettier** — code quality and formatting configured
- 🎨 **setup-scss** — Sass/SCSS configured with global variables and mixins
- 🔒 **setup-zod** — environment variable validation with Zod gateway
- 📄 **.env.development.local** — copied from `.env.example` so Vite loads env vars on dev
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
- 🛣️ **rules-vue-router** — Vue Router conventions installed
- 📦 **axios** — HTTP client installed
- 📦 **sass-embedded** — Dart Sass installed
- 📦 **vue-styleguidist + deps** — Styleguidist and webpack peer dependencies installed
- 📦 **vite-svg-loader** — SVG-as-component support configured
