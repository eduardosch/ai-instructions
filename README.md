# AI Instructions

A collection of Claude Code plugins and skills by Eduardo Schröder.

## Installation

Launch Claude Code first:

```bash
claude
```

Then add this marketplace:

```bash
/plugin marketplace add eduardosch/ai-instructions
```

Install any plugin individually:

```bash
/plugin install <plugin-name>@eduardosch-marketplace
```

---

## Plugins

### `commit-message`

Generates semantic git commit messages based on your staged changes, following the Conventional Commits format with emoji support. Handles branch creation, push confirmation, and breaking change detection.

```bash
/plugin install commit-message@eduardosch-marketplace
```

**Usage:** `/commit-message`

---

### `versioning`

Automated semantic versioning — reads commit history since the last git tag, decides the correct MAJOR/MINOR/PATCH bump, prepends a `CHANGELOG.md` entry, and creates a release commit + annotated git tag. Works in any git repo; updates `package.json` too when present.

> Requires commits to follow [Conventional Commits](https://www.conventionalcommits.org/) — use `commit-message` to enforce this automatically.

```bash
/plugin install versioning@eduardosch-marketplace
```

**Usage:** `/versioning` to set up a project, then `node release.mjs` (or `npm run release`) to cut a release.

---

### `vue-style-guide`

A comprehensive Vue style guide skill covering naming conventions, component structure, and code patterns — organized by priority (Essential / Strongly recommended / Recommended) so teams know what's negotiable and what isn't.

```bash
/plugin install vue-style-guide@eduardosch-marketplace
```

**Usage:** `/vue-style-guide`

---

## Uninstalling

```bash
/plugin uninstall <plugin-name>
/plugin marketplace remove eduardosch-marketplace
```

## Creating a new plugin

```bash
node create.mjs <plugin-name>
```

Scaffolds `plugins/<name>/README.md` and `plugins/<name>/skills/<name>/SKILL.md` and registers the plugin in `.claude-plugin/marketplace.json`.
