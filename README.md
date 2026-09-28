# AI Instructions

A collection of Claude Code plugins and skills by Eduardo Schröder.

This repo covers the essential things that I usually do on my projects.

Feel free to create a PR and add more plugins.

## Installation

### 1. Create the project folder

```bash
mkdir my-project-name
```

### 2. Access the folder

```bash
cd my-project-name
```

### 3. Initialize Claude

```bash
claude
```

### 4. Add the marketplace

```bash
/plugin marketplace add eduardosch/ai-instructions
```

### 5. Install the desired plugin

```bash
/plugin install <plugin-name>@eduardosch-marketplace
```

### 6. Create the Auto Mode file — **(IMPORTANT)**

All `setup-*` plugins run many shell commands. Create `.claude/settings.local.json` right after installing the plugin so Claude can run without pausing for permission prompts on every command.

<details>
<summary><strong>Windows (PowerShell)</strong></summary>

```powershell
New-Item -ItemType Directory -Force .claude | Out-Null
@'
{
  "permissions": {
    "allow": [
      "PowerShell(pnpm create vue@latest *)",
      "PowerShell(pnpm install *)",
      "PowerShell(pnpm add *)",
      "PowerShell(Remove-Item *)",
      "PowerShell(Expand-Archive *)",
      "PowerShell(Get-Content *)",
      "PowerShell(Set-Content *)",
      "PowerShell(Get-ChildItem *)",
      "PowerShell(Set-Location *)",
      "PowerShell(Copy-Item *)",
      "PowerShell(New-Item *)",
      "PowerShell(code *)"
    ]
  }
}
'@ | Set-Content .claude/settings.local.json
```

</details>

<details>
<summary><strong>macOS / Linux (Bash)</strong></summary>

```bash
mkdir -p .claude && cat > .claude/settings.local.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(pnpm create vue@latest *)",
      "Bash(pnpm install *)",
      "Bash(pnpm add *)",
      "Bash(rm -rf *)",
      "Bash(rm -f *)",
      "Bash(unzip *)",
      "Bash(sed *)",
      "Bash(grep *)",
      "Bash(cp *)",
      "Bash(mkdir *)",
      "Bash(code *)"
    ]
  }
}
EOF
```

</details>

---

## Auto Mode **(IMPORTANT)**

All `setup-*` plugins run many shell commands. In **auto-mode** Claude Code will pause to ask for permission at each one unless you pre-approve them upfront. **After installing any `setup-*` plugin, create `.claude/settings.local.json` in the project folder before running the plugin** — see step 6 above for the ready-to-run commands.

You can also add the block directly to `~/.claude/settings.local.json` to apply it globally to all projects.

<details>
<summary><strong>Windows (PowerShell)</strong></summary>

```json
{
  "permissions": {
    "allow": [
      "PowerShell(pnpm create vue@latest *)",
      "PowerShell(pnpm install *)",
      "PowerShell(pnpm add *)",
      "PowerShell(Remove-Item *)",
      "PowerShell(Expand-Archive *)",
      "PowerShell(Get-Content *)",
      "PowerShell(Set-Content *)",
      "PowerShell(Get-ChildItem *)",
      "PowerShell(Set-Location *)",
      "PowerShell(Copy-Item *)",
      "PowerShell(New-Item *)",
      "PowerShell(code *)"
    ]
  }
}
```

</details>

<details>
<summary><strong>macOS / Linux (Bash)</strong></summary>

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm create vue@latest *)",
      "Bash(pnpm install *)",
      "Bash(pnpm add *)",
      "Bash(rm -rf *)",
      "Bash(rm -f *)",
      "Bash(unzip *)",
      "Bash(sed *)",
      "Bash(grep *)",
      "Bash(cp *)",
      "Bash(mkdir *)",
      "Bash(code *)"
    ]
  }
}
```

</details>

> These cover all `setup-*` plugins: `setup-vue-project` (including sub-skills `setup-scss`, `setup-zod`, `setup-axios`), `setup-i18n`, `setup-element-plus`, `setup-firebase`, and `setup-firebase-functions`. The `pnpm add *` rule handles every package installation across all of them. `code *` is used by `setup-i18n` to install the i18n Ally VS Code extension. `setup-firebase-functions` uses `npm install` (not pnpm) — no extra permission needed as `npm` is already trusted by the system.

---

## Setup Plugins

### <img src="icons/vue.svg" height="20" valign="middle"> `setup-vue-project`

Scaffolds a new Vue 3 project with an opinionated stack — TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier — then runs the core setup sub-skills (SCSS, Zod, Axios) and installs all rules plugins so the project is ready from the first commit.

Core sub-skills (run automatically):

| Sub-skill | What it does |
|---|---|
| `setup-scss` | Installs sass-embedded, global variable + mixin partials, wires vite.config.ts |
| `setup-zod` | Installs Zod, creates `src/env.ts` gateway, fail-fast import |
| `setup-axios` | Creates `src/lib/http.ts` typed wrapper + `src/types/api.ts` |
| `setup-i18n` | Installs vue-i18n, creates config + locale files, wires i18n Ally *(optional)* |

```bash
/plugin install setup-vue-project@eduardosch-marketplace
```

**Usage:** `/setup-vue-project`

---

### 🧩 `setup-element-plus`

Installs and configures Element Plus in an existing Vue 3 + Vite project — auto-import, optional dark mode via VueUse `useDark()`, theming against existing SCSS variables or Element Plus defaults, optional icons package, reusable App* wrapper components, and an optional app structure with authentication pages and a chosen navigation layout.

Run after `/setup-vue-project` has created the base project.

```bash
/plugin install setup-element-plus@eduardosch-marketplace
```

**Usage:** `/setup-element-plus`

---

### 🔥 `setup-firebase`

Installs and configures Firebase in an existing TypeScript project — asks which services to enable (Firestore, Authentication, Realtime Database, Storage, Cloud Functions, Hosting), scaffolds typed service modules under `src/lib/`, and wires all Firebase config through environment variables. Integrates with `setup-zod` when present.

```bash
/plugin install setup-firebase@eduardosch-marketplace
```

**Usage:** `/setup-firebase`

---

### ⚡ `setup-firebase-functions`

Scaffolds a Firebase Cloud Functions project in a sibling folder next to your app. Creates `<app-name>-firebase-functions/` with TypeScript, ESLint, shared types, and callable/HTTP/Firestore trigger stubs — ready to build and deploy. Invoked automatically by `setup-firebase` when Cloud Functions is selected, or run standalone to add a functions project to any existing app.

```bash
/plugin install setup-firebase-functions@eduardosch-marketplace
```

**Usage:** `/setup-firebase-functions`

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

### <img src="icons/vue.svg" height="20" valign="middle"> `rules-vue-router`

Enforces Vue Router best practices — lazy-loaded routes, file-based routing conventions, Composition API usage (`useRouter`, `useRoute`, `onBeforeRouteLeave`), data fetching patterns (render-first vs guard-first), and `v-slot` for transitions, Suspense, and KeepAlive on shared layouts.

```bash
/plugin install rules-vue-router@eduardosch-marketplace
```

**Usage:** `/rules-vue-router`

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

### ⚡ `rules-firebase-functions`

Coding conventions for Firebase Cloud Functions with TypeScript — function naming, typed callable/HTTP/trigger patterns, error handling with `HttpsError`, structured logging with `functions.logger`, security validation, and testing conventions. Automatically installed by `setup-firebase-functions`.

```bash
/plugin install rules-firebase-functions@eduardosch-marketplace
```

**Usage:** `/rules-firebase-functions`

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
