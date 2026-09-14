# `api-client-conventions` Claude Skill

A style guide for structuring API calls and services with full TypeScript coverage — typed axios/fetch wrapper, service modules, error normalisation, and Vue 3 composables. Pairs naturally with `vue-ts-style-guide`.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install api-client-conventions@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall api-client-conventions

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/api-client-conventions
```

Invoke the skill when writing or reviewing:

- `src/lib/http.ts` — the singleton axios instance and interceptors
- `src/services/*.ts` — domain service modules
- `src/composables/use*.ts` — composables that wrap service calls
- `src/types/api.ts` — shared `ApiError` and `PaginatedResponse<T>` types

## What it enforces

| Rule | Short form |
|---|---|
| No raw axios/fetch in components | All calls go through a service → composable chain |
| Typed http client | `http.get<T>()`, `http.post<T>()` etc. with explicit generics |
| Normalised errors | Interceptor converts `AxiosError` → `ApiError` before rethrowing |
| Named response types | No `any`; every response shape is a named interface |
| Composable contract | Always exposes `isLoading`, `error`, data ref, and a fetch function |
| Paginated wrapper | `PaginatedResponse<T>` for all paginated endpoints |

## Pairs with

- [`vue-ts-style-guide`](../vue-ts-style-guide/README.md) — Vue 3 + TypeScript Composition API conventions
