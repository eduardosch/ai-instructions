# `rules-vue-router` Claude Skill

Enforces Vue Router best practices — lazy-loaded routes, file-based routing conventions, Composition API usage (`useRouter`, `useRoute`, `onBeforeRouteLeave`), data fetching patterns (render-first vs guard-first), and `v-slot` for transitions, Suspense, and KeepAlive on shared layouts.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install rules-vue-router@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall rules-vue-router

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/rules-vue-router
```
