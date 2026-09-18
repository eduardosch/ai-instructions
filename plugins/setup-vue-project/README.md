# `vue-project-setup` Claude Skill

Scaffolds a new Vue 3 project with an opinionated stack: TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, Prettier, and Vue DevTools — then automatically installs the `commit-message`, `versioning`, `vue-style-guide`, `vue-ts-style-guide`, and `pinia-style-guide` plugins so the project is ready to go from the first commit.

> **One-shot setup skill** — run once when creating a new project. No persistent installation needed.

## Usage

In your new project directory, open Claude Code and run:

```
/vue-project-setup
```

Claude Code will fetch this skill from the marketplace on demand and execute it without adding it to your permanent settings.

## What it does

1. Creates a Vue 3 project via `pnpm create vue@latest` with TypeScript, JSX, Vue Router, Pinia, Playwright, ESLint, and Prettier enabled.

2. Installs Vue DevTools for development.

3. Installs the companion plugins so the project is linted and release-ready from commit one:
   - `commit-message` — conventional commit messages
   - `versioning` — semantic release automation
   - `vue-style-guide` — Vue component conventions
   - `vue-ts-style-guide` — TypeScript + Composition API rules
   - `pinia-style-guide` — Pinia store conventions
