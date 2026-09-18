---
name: setup-i18n
description: Installs and bootstraps vue-i18n v9 in a Vue 3 project — installs the package, creates src/i18n.ts with createI18n, creates src/locales/en.json, wires the plugin into main.ts, and configures the i18n Ally VS Code extension via .vscode/settings.json. Run once when adding i18n support to a project. For ongoing key conventions use rules-i18n.
oneshot: true
---

# i18n Setup

Bootstraps `vue-i18n` v9 (Composition API mode) and the **i18n Ally** VS Code extension in a Vue 3 project.

Pairs naturally with [[setup-vue-project]] and [[rules-i18n]] (key naming and usage conventions).

---

## Step 1 — Install

```bash
pnpm add vue-i18n
```

Also recommend the VS Code extension to the user:

```
i18n Ally (Lokalise.i18n-ally)
code --install-extension lokalise.i18n-ally
```

---

## Step 2 — Create the i18n config

Create `src/i18n.ts`:

```ts
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en },
})
```

---

## Step 3 — Create initial locale file

Create `src/locales/en.json`:

```json
{
  "common": {
    "loading": "Loading…",
    "error": "Something went wrong."
  }
}
```

---

## Step 4 — Wire into main.ts

Import and use the i18n plugin in `src/main.ts`. Add after the existing `createApp` call:

```ts
import i18n from './i18n'
// ...
app.use(i18n)
```

Full `main.ts` example:

```ts
import './env'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
```

---

## Step 5 — Configure i18n Ally

Create or merge `.vscode/settings.json`:

```json
{
  "i18n-ally.localesPaths": ["src/locales"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.sourceLanguage": "en",
  "i18n-ally.displayLanguage": "en",
  "i18n-ally.enabledFrameworks": ["vue"],
  "i18n-ally.enabledParsers": ["json"],
  "i18n-ally.sortKeys": true,
  "i18n-ally.namespace": false,
  "i18n-ally.extract.autoDetect": true
}
```

Add the extension recommendation to `.vscode/extensions.json`:

```json
{
  "recommendations": ["lokalise.i18n-ally"]
}
```

---

## Quick checklist

- [ ] `vue-i18n` installed
- [ ] `src/i18n.ts` created with `legacy: false`
- [ ] `src/locales/en.json` created
- [ ] `app.use(i18n)` added to `main.ts`
- [ ] `.vscode/settings.json` has `i18n-ally.*` config
- [ ] `.vscode/extensions.json` recommends `lokalise.i18n-ally`
