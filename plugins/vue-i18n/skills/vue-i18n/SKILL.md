---
name: vue-i18n
description: >
  Enforces internationalization (i18n) best practices in Vue.js + vue-i18n projects,
  fully compatible with the "i18n Ally" VS Code extension (Lokalise.i18n-ally).
  Use this skill whenever the user mentions translations, locale files, adding new
  user-visible text, missing i18n keys, hardcoded strings, language support, i18n Ally,
  or wants to create/rename/refactor translation keys. Also trigger proactively when
  writing or editing any Vue component (.vue) that renders user-facing text — always
  check that strings go through $t()/t() instead of being hardcoded, and that i18n Ally's
  configuration and conventions (key style, locales path, source language) are respected.
  Covers: verifying/bootstrapping i18n Ally config in the repo, key naming conventions,
  creating new keys across all locale files, auditing for missing/unused keys, and
  keeping components extension-friendly (inline annotations, hover previews, go-to-definition).
---

# i18n Skill — Vue.js (vue-i18n) + i18n Ally

This skill enforces i18n conventions in Vue projects so that **every key created or used
is immediately recognized by the "i18n Ally" VS Code extension**
(`Lokalise.i18n-ally`, marketplace: https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally).
Compatibility with the extension is not optional — it's the reason this skill exists — so
config and conventions always come before writing translation code.

## Prerequisites — ask the user before doing anything else

At the very start of the skill, ask the user to confirm both of the following are in place:

1. **`vue-i18n` is installed** — check `package.json` for `vue-i18n` in `dependencies`. If it's missing, stop and tell the user to install it first:
   ```bash
   npm install vue-i18n
   ```

2. **i18n Ally VS Code extension is installed** — ask the user directly: *"Do you have the i18n Ally extension installed in VS Code?"* (extension id: `Lokalise.i18n-ally`). If not, stop and tell them to install it first:
   - Via VS Code marketplace: https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally
   - Or from the terminal: `code --install-extension lokalise.i18n-ally`

**If either prerequisite is missing, stop execution entirely** — do not proceed with any i18n work. Resume only after the user confirms both are installed.

## 0. Prerequisite: check the i18n Ally extension itself

Before doing any i18n work in a repo, verify the extension is set up:

1. Look for `.vscode/extensions.json` in the project root.
2. Check whether it recommends `lokalise.i18n-ally`.

**If the extension is not listed as a recommendation (or the file doesn't exist):**
- Tell the user to install it first: **"i18n Ally"** by Lokalise —
  https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally
  (or `code --install-extension lokalise.i18n-ally` from the terminal).
- Add/create `.vscode/extensions.json` with the recommendation so teammates get prompted too:
  ```json
  {
    "recommendations": ["lokalise.i18n-ally"]
  }
  ```
- Only proceed with key creation/editing after flagging this — the extension is what gives
  the user inline previews, missing-key diagnostics, and hover translations, so working
  without it defeats the point of this skill.

## 1. Required project setup

- **Library**: `vue-i18n` (v9+, Composition API)
- **Locale files**: `src/locales/<lang>.json` (e.g. `en.json`, `pt-BR.json`, `es.json`) — flat directory of one file per language, unless the project already uses per-feature namespaces (see §4).
- **Config**: `src/i18n.ts` (or `src/plugins/i18n.ts`), created with `createI18n({ legacy: false, ... })`
- **Usage in components**: `const { t } = useI18n()` from `vue-i18n`, called in `<script setup>`

## 2. i18n Ally configuration (`.vscode/settings.json`)

This is what makes the repo compatible with the extension — check it exists and matches
the project's actual structure. If missing, create/merge it:

```json
{
  "i18n-ally.localesPaths": ["src/locales"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.sourceLanguage": "en",
  "i18n-ally.displayLanguage": "pt-BR",
  "i18n-ally.enabledFrameworks": ["vue"],
  "i18n-ally.enabledParsers": ["json"],
  "i18n-ally.sortKeys": true,
  "i18n-ally.namespace": false,
  "i18n-ally.extract.autoDetect": true
}
```

Adjust `localesPaths`, `sourceLanguage` and `displayLanguage` to match the project. If the
project uses per-feature namespaces (multiple folders under `locales/<lang>/*.json`), set
`"i18n-ally.namespace": true` and update `localesPaths` accordingly — see §4.

**Never** hand-write a key style that conflicts with `i18n-ally.keystyle`: if it's `"nested"`,
keys must be dot-separated paths matching real nested JSON objects (not flat strings with
literal dots as keys). If it's `"flat"`, keys stay flat strings even if they contain dots.
Mismatches break the extension's inline annotations and go-to-definition.

## 3. Key naming conventions

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
- Group by the component/view/feature the string belongs to — mirror the folder or component name so the extension's tree view stays legible.
- Shared/reusable strings go under `common.`.
- Validation and error messages go under `<feature>.validation.` (or `common.validation.` if generic).
- Use `{variable}` for interpolation (vue-i18n named interpolation), e.g. `"Olá, {name}"`, `"{count} itens"`.
- Never construct a key by string concatenation unless the interpolated segment is itself
  enumerable and documented (e.g. `` t(`status.${status}`) ``) — i18n Ally can resolve these
  via its "dynamic key" detection, but only if every possible value already exists as a real
  key. Flag ambiguous dynamic keys for manual review instead of guessing.

## 4. Namespaces (only if the project uses them)

If locale files are split per feature (`src/locales/en/auth.json`, `src/locales/en/home.json`, ...):
- Set `"i18n-ally.namespace": true` in settings.
- `localesPaths` should point to the language root (`src/locales`) so the extension can
  discover namespace subfolders automatically.
- Keys keep the same nested/camelCase rules above; the namespace is implicit from the file, not repeated inside the key path.

## 5. Creating new translation keys

When adding a key (or writing a component with new user-visible text):

1. **Confirm i18n Ally is configured** (§0–§2) before touching locale files.
2. **Determine the namespace/section** — match the component/view name, or use `common.` for shared strings.
3. **Write the source-language string first**, in the file matching `i18n-ally.sourceLanguage`.
4. **Translate to every other locale file** in the project — natural, idiomatic translations (not literal), matching the app's tone.
5. **Preserve JSON nesting** — insert the key at the same nested position in every locale file. Respect `i18n-ally.sortKeys` (alphabetical) if enabled.
6. **Update all locale files atomically** — edit every language file in the same response; never leave one out, or the extension will flag a missing-translation diagnostic.

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

## 6. Using translations in components — no hardcoded strings

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

**Template-only shorthand** (no `<script setup>` logic needed) is also valid and
i18n-Ally-compatible: `$t('home.greeting')` directly in the template.

**When writing or reviewing a component**, scan every literal string inside `<template>`
(text nodes, `placeholder`, `title`, `alt`, `aria-label`, toast/snackbar messages, validation
messages) and replace it with `t('key')` / `$t('key')`. Exceptions: developer-facing strings
(console/debug output, internal error codes), pure numbers/symbols, and strings genuinely
never shown to a user.

Prefer letting i18n Ally do the extraction when working interactively: select the hardcoded
string, run its **"Extract as i18n"** code action, then fill in the generated key following
§3's naming rules — this keeps key placement consistent with what the extension expects.

## 7. Auditing & syncing missing keys

When asked to audit or sync locale files:

1. Parse every locale JSON under `i18n-ally.localesPaths` and collect all leaf key paths.
2. Diff against the source language (`i18n-ally.sourceLanguage`) — that's the source of truth.
3. Report before making changes:
   ```
   Missing in pt-BR.json: settings.saveBtn
   Missing in es.json: settings.saveBtn, common.retry
   Extra in pt-BR.json (not in en.json): home.oldPromoBanner
   ```
4. Translate and insert missing keys; ask the user before deleting "extra" keys (they may be
   legitimately unused-but-pending, or a genuine leftover — i18n Ally's "Unused keys" report
   in its sidebar is the authoritative check, prefer that over guessing).

Quick script for a flat check (adjust paths to the project's `localesPaths`):
```js
const fs = require('fs')
const path = require('path')

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

## 8. Renaming / refactoring keys

1. Search the codebase for every `t('old.key')`, `$t('old.key')`, and any dynamic template
   (`` t(`old.${x}`) ``) that could match.
2. Rename the key at the same nested position in every locale file.
3. Update every component reference.
4. For dynamic key templates, verify the new key still fits the template pattern.
5. Report the full list of files changed — i18n Ally will re-index automatically once files
   are saved, but a stale VS Code window may need "Reload Window" to refresh its tree view.

## 9. Quality checklist before finishing any i18n task

- [ ] `.vscode/extensions.json` recommends `lokalise.i18n-ally` (and the user has it installed)
- [ ] `.vscode/settings.json` has correct `i18n-ally.*` config for this project's actual folder structure
- [ ] All locale files have the same set of keys as the source language
- [ ] No hardcoded user-visible strings remain in modified `.vue` files
- [ ] Interpolation placeholders (`{name}`, `{count}`) match across every locale file
- [ ] Keys follow `camelCase` segments and the configured `keystyle`
- [ ] No ambiguous dynamically-constructed keys without a documented, enumerable value set