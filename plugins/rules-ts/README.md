# `vue-ts-style-guide` Claude Skill

Enforces Vue 3 + TypeScript conventions for Composition API codebases — props typing, emits, refs, reactive state, event handlers, provide/inject, and custom directives. Based on the official Vue.js guide at [vuejs.org/guide/typescript/composition-api](https://vuejs.org/guide/typescript/composition-api.html), with stricter rules (mandatory `<script setup lang="ts">`, explicit named types everywhere, no implicit `any`).

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install vue-ts-style-guide@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall vue-ts-style-guide

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/vue-ts-style-guide
```
