# `env-validation` Claude Skill

Enforces `.env` schema validation with Zod so projects fail fast on missing or malformed config — never silently at runtime. Works with Vite/Vue and Node/Express projects.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install env-validation@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall env-validation

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/env-validation
```

Invoke the skill when:

- Setting up env validation in a new or existing project
- Adding a new environment variable
- Reviewing `src/env.ts` or `.env.example`
- Debugging "undefined" env variable errors at runtime

## What it enforces

| Rule | Short form |
|---|---|
| Single validated gateway | All env reads go through `src/env.ts`, never `import.meta.env` directly |
| Fail fast | App/server exits at startup when a required variable is missing |
| Typed output | `env.*` is fully typed — no `string \| undefined` surprises |
| Boolean coercion | String `'true'` / `'false'` values are transformed to `boolean` |
| `.env.example` parity | Every variable in the schema has a placeholder entry in `.env.example` |
| Test-safe | Vitest config or `vi.mock` provides test values so tests never fail on env |

## Pairs with

- [`api-client-conventions`](../api-client-conventions/README.md) — http client reads `env.VITE_API_URL`
- [`testing-conventions`](../testing-conventions/README.md) — how to stub env in Vitest
- [`vue-project-setup`](../vue-project-setup/README.md) — adds env validation to a fresh Vue project
