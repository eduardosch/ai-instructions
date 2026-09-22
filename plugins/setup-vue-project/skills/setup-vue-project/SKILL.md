---
name: setup-vue-project
description: Scaffolds a new Vue 3 project with TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools, then runs the core setup sub-skills (setup-scss, setup-zod, setup-axios, setup-docgen) and installs all rules plugins. Always strips example files and replaces App.vue with a clean landing page. Use when starting a new Vue 3 project.
---

# Vue Project Setup

Instructions for scaffolding a new Vue project.

## 0. Flags (`--log`, `--verbose`)

Check which flags the user passed when invoking this skill.

**Default mode is quiet** — the progress bar and fun messages are always active unless overridden.

**Verbose mode is active when `--verbose` is passed OR when `--log` is passed** (logging implies verbose). Both flags can be combined, but `--log` alone is enough to switch to verbose.

---

### Default (quiet) mode

Unless verbose mode is active, run in quiet mode for the entire skill:

1. **Before any step**, output exactly this opening message (pick one randomly to keep it fun):
   - `☕ Grab a coffee — we're setting up your Vue project!`
   - `🎧 Put on some music — your project is being wired up!`
   - `🍕 Perfect time for a snack — we'll handle the scaffolding!`
   - `🛋️ Sit back and relax — your Vue app is being born!`

2. **Suppress all narration** — do not output explanatory prose between steps. Just execute each step silently (file reads/writes, shell commands, sub-skill invocations) and then output the progress line below.

3. **After each step completes**, output exactly one progress line using the table below. Use `█` for filled blocks and `░` for empty blocks (bar is 20 chars wide):

| After step | Bar | % | Label |
|---|---|---|---|
| 1 | `[███░░░░░░░░░░░░░░░░░]` | 12% | `Creating project scaffold` |
| 1.5 | `[█████░░░░░░░░░░░░░░░]` | 25% | `Stripping example files` |
| 2–2.5 | `[███████░░░░░░░░░░░░░]` | 37% | `Installing packages` |
| 3 | `[██████████░░░░░░░░░░]` | 50% | `Fixing TypeScript config` |
| 4 | `[████████████░░░░░░░░]` | 62% | `Wiring plugins & marketplace` |
| 4.5 | `[███████████████░░░░░]` | 75% | `Running setup sub-skills` |
| 4.75 | `[██████████████████░░]` | 90% | `Creating env files` |
| 6 | `[████████████████████]` | 100% | `All done!` |

   Format each line as:
   ```
   <bar>  <percent>  <label>
   ```
   Example: `[███░░░░░░░░░░░░░░░░░]  12%  Creating project scaffold`

4. **At step 6**, after the 100% line output the closing summary:
   ```
   ✅ Your Vue project is ready!
   ```
   Then show the bullet summary as usual (step 6 instructions apply regardless of mode).

---

### `--verbose` flag

**If verbose mode is active** (either `--verbose` or `--log` was passed), narrate each step normally as it runs — no suppression, no progress bar.

---

### `--log` flag

**Implies verbose mode.** Check whether the user passed `--log` when invoking this skill.

**If `--log` was NOT passed**, skip all log-writing steps and proceed normally.

**If `--log` was passed**, create `.claude/setup.log.json` **immediately after step 1 completes** (not before) — `pnpm create vue@latest --force` overwrites the entire project directory, including any `.claude/` folder created beforehand. After the scaffold command returns, create the `.claude/` directory inside the project folder if it does not exist, then write the skeleton below. Update the file by appending a new entry to `steps` as each numbered section completes — write partial progress so the log survives an interrupted run. Finalize it in step 6.

```json
{
  "plugin": "setup-vue-project",
  "project": "<project-folder-name>",
  "startedAt": "<ISO-8601 timestamp>",
  "startedAtTime": "<HH:MM:SS>",
  "completedAt": null,
  "completedAtTime": null,
  "duration": null,
  "issues": [],
  "steps": []
}
```

Each step entry shape:

```json
{
  "step": "<section number and title, e.g. '1. Create the project'>",
  "completedAt": "<ISO-8601 timestamp>",
  "details": {}
}
```

Populate `details` with the relevant facts for that step (see per-step notes below). Use `null` for any field that is not applicable.

**Logging issues:** Whenever an error, warning, or unexpected recovery occurs at any point during the setup — regardless of which step — immediately append an entry to the top-level `issues` array. Do not wait until the step or the run finishes. Capture it as soon as it is detected.

**Known warnings are suppressed from the issues array.** Do not log entries whose `message` matches any pattern in the "Known non-blocking warnings" table above. If all warnings from a step are known-non-blocking, omit the step from `issues` entirely (or summarize in a single `type: "info"` entry with `message: "Known non-blocking warnings suppressed — see install.log"`). Only surface what is genuinely new or unexpected.

Each issue entry shape:

```json
{
  "type": "error | warning | info",
  "step": "<section number and title where it occurred>",
  "message": "<concise description of what went wrong or was unexpected>",
  "resolution": "<how it was resolved or worked around, or null if it blocked the run>"
}
```

Examples of things that must be logged as issues:

- A skill could not be loaded directly and had to be found through an alternative path (e.g. `"Unknown skill: setup-vue-project:setup-scss"` → loaded from marketplace cache instead) → `type: "warning"`
- A shell command failed and was retried or skipped → `type: "error"`
- A file already existed and was overwritten → `type: "info"`
- A package install produced deprecation warnings or peer dependency conflicts → `type: "warning"`
- A sub-skill was not found via the normal Skill tool and required a manual workaround → `type: "warning"`

---

## Known non-blocking warnings

If any of the patterns below appear during installation, do not investigate, do not stop, do not ask the user — just proceed and mention them in one line in the final summary:

| Pattern in output | Cause | Action |
|---|---|---|
| `ENOENT.*\.bin/sass` | Windows: sass-embedded bin symlink fails under pnpm | Ignore — Vite uses sass-embedded via its API, not via the bin |
| `deprecated.*glob@7\|rimraf@2\|rimraf@3\|uuid@3\|uuid@8` | Indirect subdependencies of vue-styleguidist (webpack peer deps) | Ignore — upstream issue, no functional impact |

General rule: if the command's exit code is 0, treat it as success regardless of stderr warnings, unless the text matches a known error pattern.

---

## 1. Create the project

`create-vue` requires a valid package name as the positional argument — passing `.` triggers an interactive prompt. Run the command from the **parent directory**, using the current folder name as the project name:

```bash
# from the parent directory (e.g. cd ..)
pnpm create vue@latest <project-folder-name> --typescript --jsx --router --pinia --playwright --eslint --prettier --force
```

Then change back into the project directory before running the remaining steps.

> **Log entry (if --log):** append `{ "step": "1. Create the project", "completedAt": "...", "details": { "command": "pnpm create vue@latest <name> --typescript --jsx --router --pinia --playwright --eslint --prettier --force" } }`.

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

Also remove the CSS import from `src/main.ts` — delete the line `import './assets/main.css'` (or `import './assets/base.css'` — whichever `create-vue` generated), then add the global stylesheet import and wire vue-i18n:

```ts
import '@/assets/styles/global.scss'
```

Open `src/main.ts` and add the i18n plugin — the final file must include:

```ts
import i18n from './i18n'
// ...
app.use(i18n)
```

Full `src/main.ts` after this step:

```ts
import './env'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import '@/assets/styles/global.scss'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
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
      component: () => import('@/views/HomeModule/HomeView.vue'),
    },
  ],
})

export default router
```

Extract the template zip to populate all custom files in one step. `template.zip` is in the same directory as this SKILL.md file — note the full path to that directory (`<skill-dir>`), then run from inside the project directory:

```powershell
# Windows (PowerShell)
Expand-Archive -Path "<skill-dir>/template.zip" -DestinationPath "." -Force
```

```bash
# macOS / Linux
unzip -o "<skill-dir>/template.zip" -d .
```

This extracts the full custom template tree (`src/` and `public/`) directly into the project root. After extracting, fix `public/site.webmanifest` — replace every occurrence of `<project-name>` with the actual project folder name:

```powershell
# Windows (PowerShell)
(Get-Content public/site.webmanifest) -replace '<project-name>', '<actual-project-name>' | Set-Content public/site.webmanifest
```

```bash
# macOS / Linux
sed -i 's/<project-name>/<actual-project-name>/g' public/site.webmanifest
```

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

> **Log entry (if --log):** append `{ "step": "1.5. Strip examples", "completedAt": "...", "details": { "removed": ["src/components", "src/views/HomeView.vue", "src/views/AboutView.vue", "src/assets", "src/stores/counter.ts"], "filesWritten": ["src/router/index.ts", "src/App.vue", "src/assets/styles/global.scss", "src/assets/icons/*", "src/components/*", "src/views/HomeModule/*", "src/stores/useHomeStore.ts", "public/favicons", "index.html", ".env.example"] } }`.

## 2. Install packages

Before running any install command, create `pnpm-workspace.yaml` in the project root with exactly this content:

```yaml
allowBuilds:
  '@parcel/watcher': true
  core-js: true
  vue-inbrowser-compiler-demi: true
onlyBuiltDependencies:
  - core-js
  - vue-inbrowser-compiler-demi
  - '@parcel/watcher'
  - esbuild
```

Both `allowBuilds` (explicit opt-in map) and `onlyBuiltDependencies` (list form) are required together — pnpm v9+ raises `ERR_PNPM_IGNORED_BUILDS` if either is missing for a package that runs build scripts.

> **Note:** If `ERR_PNPM_IGNORED_BUILDS` still appears for other packages after install, add them to both `allowBuilds` (as `package: true`) and `onlyBuiltDependencies`, then re-run `pnpm install`.

Now run the installs:

```bash
pnpm install --reporter=append-only > install.log 2>&1
grep -iE "error|failed" install.log || echo "Install OK (warnings suppressed, see install.log if needed)"
pnpm add axios vue-i18n
pnpm add -D sass-embedded vue-styleguidist vue-docgen-api webpack webpack-dev-server css-loader style-loader vue-loader ts-loader vite-svg-loader
```

- **axios** — HTTP client used by `setup-axios` (`src/lib/http.ts`)
- **vue-i18n** — internationalisation; `src/i18n.ts` and `src/locales/` are included in the template
- **sass-embedded** — modern Dart Sass implementation required by `setup-scss`; use this instead of `sass` to avoid the legacy-JS-API deprecation warning under Vite. On Windows, pnpm may print a warning about failing to create `sass.js.EXE` — this is non-blocking and can be safely ignored; sass-embedded works via Vite's Sass integration regardless.
- **vue-styleguidist** + **vue-docgen-api** — powers the live component documentation site (`pnpm run styleguide`). Expect deprecation warnings from its indirect dependencies (glob, rimraf, uuid, etc.) — these are upstream issues in vue-styleguidist's webpack peer deps and are non-blocking.
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

> **Log entry (if --log):** append `{ "step": "2-2.5. Install packages + vite-svg-loader", "completedAt": "...", "details": { "packagesAdded": ["axios"], "devPackagesAdded": ["sass-embedded", "vue-styleguidist", "vue-docgen-api", "webpack", "webpack-dev-server", "css-loader", "style-loader", "vue-loader", "ts-loader", "vite-svg-loader"], "filesModified": ["vite.config.ts", "env.d.ts", "pnpm-workspace.yaml"] } }`.

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

> **Log entry (if --log):** append `{ "step": "3. Fix tsconfig.app.json", "completedAt": "...", "details": { "filesModified": ["tsconfig.app.json"] } }`.

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

> **Log entry (if --log):** append `{ "step": "4. Register marketplace and wire plugins", "completedAt": "...", "details": { "marketplace": "eduardosch/ai-instructions", "filesWritten": [".claude/settings.json"], "pluginsEnabled": ["rules-commit", "rules-versioning", "rules-vue-code", "rules-ts", "rules-pinia", "rules-vue-scss", "rules-client-api", "rules-documentation", "rules-zod", "rules-vue-router"] } }`.

## 4.5 Run setup sub-skills

Do NOT stop or summarise here — continue running all steps in this section without pausing.

These are **separate marketplace plugins** — `setup-scss`, `setup-zod`, `setup-axios`, and `setup-docgen`. Because the marketplace is registered in step 4 of this same session, the Skill tool's cache will never contain these skills in time — **do not attempt to invoke them via the Skill tool**. Go directly to inline execution:

For each sub-skill, find the `ai-instructions` marketplace root (the local clone Claude Code pulled when the marketplace was registered — typically `~/.claude/plugins/<marketplace-id>/ai-instructions` or the equivalent path on the current platform), then:

1. Read `plugins/setup-scss/skills/setup-scss/SKILL.md` and execute every instruction it contains.
2. Read `plugins/setup-zod/skills/setup-zod/SKILL.md` and execute every instruction it contains.
3. Read `plugins/setup-axios/skills/setup-axios/SKILL.md` and execute every instruction it contains.
4. Read `plugins/setup-docgen/skills/setup-docgen/SKILL.md` and execute every instruction it contains.

Follow each skill's full instructions before moving to the next one.

**If a SKILL.md file cannot be found at the expected path**, log it as a `"warning"` issue and try resolving the marketplace root via `glob **/setup-scss/SKILL.md` under the Claude plugins directory.

`setup-i18n` is optional — `vue-i18n`, `src/i18n.ts`, `src/locales/en.json`, and `src/locales/pt-BR.json` are already included in the template. Invoke `setup-i18n` only if you need the additional VS Code i18n Ally extension configuration.

`setup-element-plus` and `setup-firebase` are separate standalone plugins — the user must invoke them explicitly after the project is created.

> **Log entry (if --log):** append `{ "step": "4.5. Run setup sub-skills", "completedAt": "...", "details": { "skillsInvoked": ["setup-scss (inline)", "setup-zod (inline)", "setup-axios (inline)", "setup-docgen (inline)"] } }`. All sub-skills are always run inline in this step — the `(inline)` suffix is correct and expected, not a fallback.

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

> **Log entry (if --log):** append `{ "step": "4.75. Create .env.development.local", "completedAt": "...", "details": { "filesWritten": [".env.development.local"] } }`.

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

**If `--log` was passed**, finalize `.claude/setup.log.json`:
- Set `completedAt` to the current ISO-8601 timestamp
- Set `completedAtTime` to the current wall-clock time as `HH:MM:SS`
- Set `duration` to a human-readable string of elapsed time since `startedAtTime`, e.g. `"lasted 2 mins"` or `"lasted 1 min 45 secs"`

Then tell the user:
```
📋 Setup log written to .claude/setup.log.json
   Started at: <HH:MM:SS>  Finished at: <HH:MM:SS>  Lasted <duration>
```

Once everything is finished, show the user a bullet list with emojis and short descriptions of what was done, e.g.:

- ⚡ **Vue project created** — scaffolded with TypeScript, JSX, Router, and Pinia; example files stripped, custom App.vue landing page applied
- 🧩 **Components** — `TheHeader`, `TheFooter`, `AppButton`, `AppCard`, `AppTag` created in `src/components/`; `HomeView`, `HomeViewRulesList`, `HomeViewRulesListItem` created in `src/views/HomeModule/`
- 🍍 **Home store** — `useHomeStore` created in `src/stores/` with cards, setupCards, ruleRows, and tags
- 🎨 **Favicons** — favicon set copied to `public/`, `index.html` updated with favicon links and `%VITE_APP_TITLE%`
- 🧪 **Playwright** — end-to-end testing solution added
- 🧹 **ESLint + Prettier** — code quality and formatting configured
- 🎨 **setup-scss** — Sass/SCSS configured with dual-theme CSS custom properties (light/dark) and global mixins
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
