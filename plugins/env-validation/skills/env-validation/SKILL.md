---
name: env-validation
description: Enforces .env schema validation with Zod so projects fail fast on missing or malformed config. Use when setting up environment variable validation in any TypeScript project (Vue, Node, etc.).
---

# Environment Validation

Enforces a single validated gateway for all environment variables using Zod. The app throws at startup when a required variable is missing or malformed — never silently at runtime.

Pairs naturally with [[vue-project-setup]], [[api-client-conventions]], and [[testing-conventions]].

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

## Part 4 — Consuming env variables

Always import from `./env`, never from `import.meta.env` or `process.env`.

```ts
// ✅ Correct
import { env } from '@/env'

const client = axios.create({ baseURL: env.VITE_API_URL })
```

```ts
// ❌ Wrong — bypasses validation and loses type safety
const client = axios.create({ baseURL: import.meta.env.VITE_API_URL })
```

Rules:
- The `@/env` alias (or `./env` for relative imports) is the only allowed source of env values.
- This gives full TypeScript types — `env.VITE_API_URL` is `string`, not `string | undefined`.
- ESLint can enforce this with a `no-restricted-syntax` rule targeting `import.meta.env` and `process.env` outside `src/env.ts`.

---

## Part 5 — `.env` files and `.env.example`

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

## Part 6 — Testing

### 6.1 Unit tests — stub env in Vitest

Never import `env.ts` directly in tests. Use `vi.mock` to stub the module or set `import.meta.env` / `process.env` in `beforeEach`:

```ts
// vitest.config.ts — provide test values so env.ts passes at import time
export default defineConfig({
  test: {
    env: {
      VITE_API_URL: 'http://localhost:3000',
      VITE_APP_TITLE: 'Test App',
    },
  },
})
```

Or mock the module directly:

```ts
vi.mock('@/env', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3000',
    VITE_APP_TITLE: 'Test App',
    VITE_FEATURE_FLAG: false,
  },
}))
```

### 6.2 Testing `env.ts` itself

Keep a dedicated spec for the schema to document which fields are required and which are optional:

```ts
// src/env.spec.ts
import { describe, it, expect, vi } from 'vitest'

describe('env schema', () => {
  it('throws when VITE_API_URL is missing', () => {
    vi.stubEnv('VITE_API_URL', '')
    expect(() => import('./env')).toThrow()
    vi.unstubAllEnvs()
  })

  it('coerces VITE_FEATURE_FLAG string to boolean', async () => {
    vi.stubEnv('VITE_FEATURE_FLAG', 'true')
    const { env } = await import('./env')
    expect(env.VITE_FEATURE_FLAG).toBe(true)
    vi.unstubAllEnvs()
  })
})
```

Note: use dynamic `import()` in env spec tests so the module re-evaluates with the stubbed env. Add the file to Vitest's `resetModules: true` config or call `vi.resetModules()` in `beforeEach`.

---

## Part 7 — ESLint enforcement (optional)

Prevent direct `import.meta.env` access outside `src/env.ts` with a `no-restricted-syntax` rule:

```js
// eslint.config.js
export default [
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MemberExpression[object.property.name="env"][object.object.name="meta"]',
          message: 'Access env variables through src/env.ts, not import.meta.env directly.',
        },
      ],
    },
    ignores: ['src/env.ts'],
  },
]
```

---

## Quick checklist

- [ ] `zod` installed
- [ ] `src/env.ts` created with a schema covering all variables
- [ ] `src/env.ts` imported first in `main.ts` / `index.ts`
- [ ] All code reads from `env.*`, never from `import.meta.env` / `process.env`
- [ ] `.env.example` updated with every variable (no real secrets)
- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] Vitest config provides test values so tests don't fail on missing env
- [ ] (Optional) ESLint rule blocks direct `import.meta.env` access
