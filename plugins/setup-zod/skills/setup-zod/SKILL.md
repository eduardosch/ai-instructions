---
name: setup-zod
description: Installs Zod and creates a single validated environment variable gateway in src/env.ts — the app throws at startup on missing or malformed config. Also creates .env.example and wires the fail-fast import into main.ts. Run once per project. For ongoing Zod usage conventions use rules-zod.
oneshot: true
---

# Zod Environment Setup

Enforces a single validated gateway for all environment variables using Zod. The app throws at startup when a required variable is missing or malformed — never silently at runtime.

Pairs naturally with [[setup-vue-project]], [[setup-axios]], and [[rules-zod]] (usage patterns and schema conventions).

---

## Part 1 — Installation

```bash
npm install zod
```

No extra packages needed. Avoid `@t3-oss/env-core` unless the project already depends on it — raw Zod is simpler and has no transitive deps.

---

## Part 2 — The env gateway file

Create a single file that parses and exports all env variables. Nothing else in the app reads `import.meta.env` or `process.env` directly.

### 2.1 Vite / Vue projects — `src/env.ts`

```ts
import { z } from 'zod'

const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_APP_TITLE: z.string().min(1),
  VITE_FEATURE_FLAG: z.enum(['true', 'false']).transform(v => v === 'true').optional().default('false'),
})

const parsed = schema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:\n', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables — check the console for details.')
}

export const env = parsed.data
```

Rules:
- The file is named `env.ts` and lives at the root of `src/`.
- Use `safeParse` so you can log all field errors at once before throwing, rather than stopping at the first failure.
- Transform boolean-like strings (`'true'` / `'false'`) with `.transform()` — Vite injects all variables as strings.
- Never export anything from this file other than `env`.

### 2.2 Node / Express projects — `src/env.ts`

```ts
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().url().optional(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:\n', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
```

Rules:
- Use `process.exit(1)` in Node servers — they should not start with broken config.
- Use `z.coerce.number()` for numeric env vars — `process.env` values are always strings.
- Provide `.default()` for optional vars with sensible fallbacks (e.g. `PORT: 3000`).

---

## Part 3 — Fail fast at startup

Import `env.ts` as the very first import in the app entry point so the process exits immediately if any variable is missing.

### Vite / Vue — `src/main.ts`

```ts
import './env'  // ← must be first
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

### Node / Express — `src/index.ts`

```ts
import './env'  // ← must be first
import express from 'express'
import { env } from './env'

const app = express()
app.listen(env.PORT, () => console.log(`Server on port ${env.PORT}`))
```

---

## Part 4 — `.env` files and `.env.example`

```
.env               ← never committed (add to .gitignore)
.env.local         ← local overrides, also never committed
.env.example       ← committed; lists all keys with placeholder values
.env.test          ← committed only when it contains non-secret values
```

### `.env.example` shape

Every variable in `src/env.ts` must have a matching entry in `.env.example` with a placeholder or documented default:

```dotenv
# Required — base URL of the backend API
VITE_API_URL=https://api.example.com

# Required — page title shown in <title>
VITE_APP_TITLE=My App

# Optional — enables the beta dashboard (default: false)
VITE_FEATURE_FLAG=false
```

Rules:
- `.env.example` is the source of truth for onboarding. Every new variable requires a `.env.example` update in the same PR.
- Comments explain the purpose and whether the variable is required or optional.
- Never put real secrets (tokens, passwords, keys) in `.env.example`.

---

## Quick checklist

- [ ] `zod` installed
- [ ] `src/env.ts` created with a schema covering all variables
- [ ] `src/env.ts` imported first in `main.ts` / `index.ts`
- [ ] `.env.example` created with every variable (no real secrets)
- [ ] `.env` and `.env.local` in `.gitignore`
