# `vue-i18n` Claude Skill

Enforces internationalization best practices in Vue.js + vue-i18n projects, fully compatible with the i18n Ally VS Code extension. Covers i18n Ally config, key naming conventions, creating keys across all locale files, auditing missing/unused keys, and ensuring all user-facing strings go through `$t()`/`t()` instead of being hardcoded.

## Prerequisites

Before using this skill, make sure you have:

- **`vue-i18n`** installed in your project:
  ```bash
  npm install vue-i18n
  ```

- **i18n Ally** VS Code extension installed (id: `Lokalise.i18n-ally`):
  - [Install from marketplace](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)
  - Or from the terminal: `code --install-extension lokalise.i18n-ally`

The skill will check for both at startup and stop if either is missing.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install vue-i18n@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall vue-i18n

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/vue-i18n
```
