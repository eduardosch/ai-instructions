---
name: rules-i18n
description: >
  Enforces internationalization conventions in Vue.js + vue-i18n projects, fully compatible
  with the i18n Ally VS Code extension. Use whenever the user mentions translations, locale
  files, adding new user-visible text, missing i18n keys, hardcoded strings, or language support.
  Also trigger proactively when writing or editing any Vue component that renders user-facing
  text — always check that strings go through $t()/t() instead of being hardcoded.
  Requires setup-i18n to have been run first.
---

# i18n Rules

Conventions for writing and maintaining translation keys in Vue 3 + vue-i18n projects. Requires [[setup-i18n]] to have been run.

Compatibility with the **i18n Ally** VS Code extension (`Lokalise.i18n-ally`) is not optional — config and conventions always come before writing translation code.

---

## 0. Before doing any i18n work — verify the setup

1. Check `package.json` for `vue-i18n` in `dependencies`. If missing, run [[setup-i18n]] first.
2. Check `.vscode/settings.json` has `i18n-ally.*` config (see [[setup-i18n]] §5). If missing, add it.
3. Check `.vscode/extensions.json` recommends `lokalise.i18n-ally`. If missing, add it.

**If any prerequisite is missing, stop and fix it before writing keys.**

---

## 1. Required project structure

- **Locale files**: `src/locales/<lang>.json` (e.g. `en.json`, `pt-BR.json`, `es.json`)
- **Config**: `src/i18n.ts` with `createI18n({ legacy: false, ... })`
- **Usage in components**: `const { t } = useI18n()` from `vue-i18n`, called in `<script setup>`

---

## 2. Key naming conventions

Keys are dot-separated paths matching the nested JSON structure:

```
<screen-or-component>.<subsection?>.<key>
```

Examples:
- `auth.login.submitBtn`
- `home.stats.workouts`
- `common.cancel`
- `common.validation.required`

**Rules:**
- `camelCase` for every key segment.
- Group by the component/view/feature the string belongs to — mirror the folder or component name.
- Shared/reusable strings go under `common.`.
- Validation and error messages go under `<feature>.validation.` (or `common.validation.` if generic).
- Use `{variable}` for interpolation: `"Olá, {name}"`, `"{count} itens"`.
- Never construct a key by string concatenation unless every possible value already exists as a real key and is documented.

---

## 3. Namespaces (only if the project uses them)

If locale files are split per feature (`src/locales/en/auth.json`, `src/locales/en/home.json`, ...):
- Set `"i18n-ally.namespace": true` in `.vscode/settings.json`.
- `localesPaths` should point to the language root (`src/locales`).
- Keys keep the same nested/camelCase rules; the namespace is implicit from the file.

---

## 4. Creating new translation keys

When adding a key (or writing a component with new user-visible text):

1. **Confirm i18n Ally is configured** (§0) before touching locale files.
2. **Determine the namespace/section** — match the component/view name, or use `common.` for shared strings.
3. **Write the source-language string first**, in the file matching `i18n-ally.sourceLanguage`.
4. **Translate to every other locale file** — natural, idiomatic translations, matching the app's tone.
5. **Preserve JSON nesting** — insert at the same nested position in every locale file. Respect `i18n-ally.sortKeys`.
6. **Update all locale files atomically** — never leave one out.

Example — adding a "Save" button to a settings view:

```json
// en.json
"settings": {
  "saveBtn": "Save changes"
}

// pt-BR.json
"settings": {
  "saveBtn": "Salvar alterações"
}
```

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <button>{{ t('settings.saveBtn') }}</button>
</template>
```

---

## 5. Using translations in components — no hardcoded strings

Every `.vue` file that renders user-visible text must go through `t()`.

**Correct pattern:**
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <p>{{ t('home.greeting') }}</p>
  <input :placeholder="t('auth.login.emailPlaceholder')" />
</template>
```

**Template-only shorthand** (i18n-Ally-compatible): `$t('home.greeting')` directly in the template.

When writing or reviewing a component, scan every literal string inside `<template>` (text nodes, `placeholder`, `title`, `alt`, `aria-label`, toast messages, validation messages) and replace with `t('key')` / `$t('key')`. Exceptions: developer-facing strings (console/debug output), pure numbers/symbols, strings never shown to a user.

---

## 6. Auditing & syncing missing keys

When asked to audit or sync locale files:

1. Parse every locale JSON under `i18n-ally.localesPaths` and collect all leaf key paths.
2. Diff against the source language — that's the source of truth.
3. Report before making changes:
   ```
   Missing in pt-BR.json: settings.saveBtn
   Extra in pt-BR.json (not in en.json): home.oldPromoBanner
   ```
4. Translate and insert missing keys; ask the user before deleting "extra" keys.

Quick audit script:
```js
import fs from 'node:fs'
import path from 'node:path'

function flatten(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null && !Array.isArray(v)
      ? flatten(v, prefix ? `${prefix}.${k}` : k)
      : [prefix ? `${prefix}.${k}` : k]
  )
}

const localesDir = 'src/locales'
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'))
const keysByLocale = Object.fromEntries(
  files.map(f => [f, new Set(flatten(JSON.parse(fs.readFileSync(path.join(localesDir, f)))))])
)

const [sourceFile, ...rest] = files
for (const f of rest) {
  const missing = [...keysByLocale[sourceFile]].filter(k => !keysByLocale[f].has(k))
  const extra = [...keysByLocale[f]].filter(k => !keysByLocale[sourceFile].has(k))
  console.log(`Missing in ${f}:`, missing)
  console.log(`Extra in ${f}:`, extra)
}
```

---

## 7. Renaming / refactoring keys

1. Search the codebase for every `t('old.key')`, `$t('old.key')`, and any dynamic template that could match.
2. Rename the key at the same nested position in every locale file.
3. Update every component reference.
4. Report the full list of files changed.

---

## 8. Quality checklist

- [ ] `.vscode/extensions.json` recommends `lokalise.i18n-ally` (and user has it installed)
- [ ] `.vscode/settings.json` has correct `i18n-ally.*` config for this project's folder structure
- [ ] All locale files have the same set of keys as the source language
- [ ] No hardcoded user-visible strings remain in modified `.vue` files
- [ ] Interpolation placeholders (`{name}`, `{count}`) match across every locale file
- [ ] Keys follow `camelCase` segments and the configured `keystyle`
- [ ] No ambiguous dynamically-constructed keys without a documented, enumerable value set
