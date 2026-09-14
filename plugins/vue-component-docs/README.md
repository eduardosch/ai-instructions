# `vue-component-docs` Claude Skill

Documents Vue 3 reusable components with JSDoc-style comments and generates a live, browsable style guide with Vue Styleguidist powered by `vue-docgen-api`.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install vue-component-docs@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall vue-component-docs

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/vue-component-docs
```

Invoke the skill when:

- Setting up component documentation in a new or existing Vue project
- Adding JSDoc comments to reusable components
- Configuring Vue Styleguidist for the first time
- Auditing components that are missing documentation
- Writing examples for the component library

## What it enforces

| Rule | Short form |
|---|---|
| Component-level JSDoc | Every reusable `.vue` file has a description block with `@displayName` |
| Prop documentation | Every prop has a `/** ... */` comment; `@default` used when non-obvious |
| Emit documentation | Every `defineEmits` entry has a `@param` describing its payload |
| Slot documentation | Named slots are documented with `@slot` tags in the component JSDoc |
| Side-car examples | Each component ships a `.examples.md` with rendered Styleguidist examples |
| Live docs server | `npm run styleguide` serves the docs; `styleguide:build` generates static output |

## Pairs with

- [`vue-style-guide`](../vue-style-guide/README.md) — naming and structure conventions for components
- [`vue-ts-style-guide`](../vue-ts-style-guide/README.md) — TypeScript conventions for props and emits
- [`vue-project-setup`](../vue-project-setup/README.md) — scaffolding a new Vue project
