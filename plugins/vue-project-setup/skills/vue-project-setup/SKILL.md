---
name: vue-project-setup
description: Scaffolds a new Vue 3 project with TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools, then installs the commit-message, versioning, vue-style-guide, vue-ts-style-guide, pinia-style-guide, vue-scss-setup, api-client-conventions, and vue-component-docs plugins. Use when starting a new Vue 3 project. Supports a blank mode that strips example files and replaces App.vue with a clean landing page.
---

# Vue Project Setup

Instructions for scaffolding a new Vue project.

## 0. Determine project mode

Ask the user (or infer from their request) which mode they want:

- **Full** (default) — keeps the example components and views `create-vue` generates
- **Blank** — removes all example files and replaces `App.vue` with a minimal landing page design

## 1. Create the project

`create-vue` requires a valid package name as the positional argument — passing `.` triggers an interactive prompt. Run the command from the **parent directory**, using the current folder name as the project name:

```bash
# from the parent directory (e.g. cd ..)
npx create-vue@latest <project-folder-name> --typescript --jsx --router --pinia --playwright --eslint --prettier --force
```

Then change back into the project directory before running the remaining steps.

## 1.5 Strip examples — blank project only

Skip this entire section for the **full** mode.

Delete all example files that `create-vue` generates:

```bash
# Remove example components and views (run inside the project directory)
Remove-Item -Recurse -Force src/components
Remove-Item -Force src/views/HomeView.vue, src/views/AboutView.vue
```

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

Replace `src/App.vue` with the following landing page (substitute `<project-name>` with the actual project folder name):

```vue
<script setup lang="ts">
const projectName = '<project-name>'
</script>

<template>
  <div class="page">
    <div class="glow" />

    <nav class="nav">
      <div class="nav-inner">
        <div class="logo">
          <svg width="30" height="30" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path d="M6 10 L24 40 L42 10" stroke="#42B883" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 10 L24 25 L33 10" stroke="#f2f5f2" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="app-name">{{ projectName }}</span>
        </div>
        <a href="https://github.com/eduardosch" class="nav-link" target="_blank" rel="noopener">github.com/eduardosch ↗</a>
      </div>
    </nav>

    <section class="hero">
      <span class="badge">Project scaffolded</span>
      <h1>Your Vue app is ready.</h1>
      <p class="subtitle">
        This project was scaffolded with <strong>setup-vue-project</strong> —
        TypeScript and project tooling are wired up and ready for
        <code>npm run dev</code>.
      </p>
      <div class="terminal">
        <div><span class="prompt">$</span> npm install</div>
        <div><span class="prompt">$</span> npm run dev</div>
      </div>
      <div class="actions">
        <a href="https://vuejs.org" class="btn-primary" target="_blank" rel="noopener">Read the Vue docs</a>
        <a href="https://github.com/eduardosch" class="btn-ghost" target="_blank" rel="noopener">View the plugin</a>
      </div>
    </section>

    <section class="cards">
      <div class="card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#42B883" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <path d="M7 9l3 3-3 3"/><path d="M13 15h4"/>
        </svg>
        <h3>Start the dev server</h3>
        <p>Run <code>npm run dev</code> and open the local URL printed in your terminal.</p>
      </div>
      <div class="card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#42B883" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <h3>Explore the structure</h3>
        <p>Components and views go under <code>src/</code>, following the plugin's conventions.</p>
      </div>
      <div class="card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#42B883" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/>
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1.5 1-1.5 2.2"/>
          <circle cx="12" cy="17" r=".6" fill="#42B883" stroke="none"/>
        </svg>
        <h3>Get support</h3>
        <p>Questions or issues with the plugin go to <a href="https://github.com/eduardosch" class="accent-link" target="_blank" rel="noopener">github.com/eduardosch</a>.</p>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-inner">
        <span>Scaffolded with <em>setup-vue-project</em> — a plugin by Eduardo Schröder</span>
        <a href="https://github.com/eduardosch" class="accent-link" target="_blank" rel="noopener">github.com/eduardosch</a>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: #0f1412;
  color: #f2f5f2;
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
}

a { text-decoration: none; }
</style>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  top: -220px;
  left: 50%;
  transform: translateX(-50%);
  width: 760px;
  height: 760px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(66,184,131,0.16) 0%, rgba(66,184,131,0) 68%);
  pointer-events: none;
}

.nav { width: 100%; position: relative; }

.nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo { display: flex; align-items: center; gap: 12px; }

.app-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.01em;
}

.nav-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #a9b5ac;
}

.hero {
  max-width: 720px;
  margin: 88px auto 0;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  position: relative;
}

.badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #42B883;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 14px;
  border: 1px solid rgba(66,184,131,0.35);
  border-radius: 999px;
}

h1 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 52px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0;
  max-width: 520px;
  font-size: 17px;
  line-height: 1.6;
  color: #a9b5ac;
}

.subtitle strong { color: #f2f5f2; font-weight: 500; }

.subtitle code, p code {
  font-family: 'JetBrains Mono', monospace;
  color: #42B883;
}

.terminal {
  width: 100%;
  max-width: 420px;
  background: #16201c;
  border: 1px solid rgba(66,184,131,0.25);
  border-radius: 14px;
  padding: 20px 24px;
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.9;
}

.prompt { color: #5c6b60; }

.actions { display: flex; gap: 14px; margin-top: 4px; }

.btn-primary {
  background: #42B883;
  color: #0f1412;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 22px;
  border-radius: 10px;
}

.btn-ghost {
  border: 1px solid rgba(242,245,242,0.2);
  color: #f2f5f2;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 22px;
  border-radius: 10px;
}

.btn-ghost:hover { background: rgba(66,184,131,0.1); }

.cards {
  max-width: 1120px;
  margin: 72px auto 88px;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  position: relative;
}

.card {
  background: #141a17;
  border: 1px solid rgba(242,245,242,0.08);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card:hover { border-color: rgba(66,184,131,0.45); }

.card h3 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #a9b5ac;
}

.accent-link { color: #42B883; }
.accent-link:hover { text-decoration: underline; }

.footer {
  margin-top: auto;
  border-top: 1px solid rgba(242,245,242,0.08);
  position: relative;
}

.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 26px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: #6b7770;
}

.footer-inner em { color: #a9b5ac; font-style: normal; }
</style>
```

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

## 3. Fix tsconfig.app.json (if needed)

After `npm install`, verify that `@vue/tsconfig/tsconfig.dom.json` exists:

```bash
node -e "require.resolve('@vue/tsconfig/tsconfig.dom.json')" 2>&1
```

If the command **fails** (file not found), replace the contents of `tsconfig.app.json` with the following inline configuration — this is equivalent to what `@vue/tsconfig/tsconfig.dom.json` provides but without the broken extends:

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

- ⚡ **Vue project created** — scaffolded with TypeScript, JSX, Router, and Pinia (blank mode: example files stripped, custom App.vue applied)
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