---
name: rules-zod
description: Enforces Zod usage conventions — always consume env variables through the src/env.ts gateway, never read import.meta.env or process.env directly, write self-documenting schemas with .describe(), test the schema, and enforce via ESLint. Requires setup-zod to have been run first.
---

# Zod Usage Rules

Conventions for consuming environment variables and writing Zod schemas in projects that have run [[setup-zod]].

---

## 1. Always import from `@/env` — never from `import.meta.env` or `process.env`

```ts
// ✅ Correct — fully typed, validated at startup
import { env } from '@/env'

const client = axios.create({ baseURL: env.VITE_API_URL })
```

```ts
// ❌ Wrong — bypasses validation, loses type safety
const client = axios.create({ baseURL: import.meta.env.VITE_API_URL })
```

The only file allowed to read `import.meta.env` or `process.env` is `src/env.ts` itself. Never export anything from `src/env.ts` other than `env`.

---

## 2. Add new variables to the schema, not inline

Whenever a new env variable is needed:

1. Add it to the `schema` object in `src/env.ts`.
2. Add a matching entry to `.env.example` with a comment explaining its purpose.
3. Never read the variable anywhere outside `src/env.ts`.

```ts
// src/env.ts — add to the existing schema object
const schema = z.object({
  // existing vars...
  VITE_STRIPE_KEY: z.string().min(1),
})
```

```dotenv
# .env.example
VITE_STRIPE_KEY=pk_test_...
```

---

## 3. Schema conventions

- Use `z.string().url()` for URL vars — provides a clear error if the value is malformed.
- Use `z.coerce.number()` for numeric vars (Node/Express) — `process.env` values are always strings.
- Use `.transform()` for boolean-like strings: `z.enum(['true', 'false']).transform(v => v === 'true')`.
- Use `.default()` for optional vars with sensible fallbacks.
- Prefer `.optional()` over omitting a field when a variable can legitimately be absent.
- Avoid `.nullable()` — env vars are either present (string) or absent (use `.optional()`).
- Use `safeParse` (not `parse`) so all field errors are logged before throwing, rather than stopping at the first failure.
- In Node/Express projects use `process.exit(1)` on validation failure — a server should never start with broken config.

---

## 4. `.env.example` maintenance

`.env.example` is the source of truth for onboarding — every variable in `src/env.ts` must have a matching entry there.

- Every new variable requires a `.env.example` update in the same PR.
- Comments must explain the purpose and whether the variable is required or optional.
- Never put real secrets (tokens, passwords, keys) in `.env.example` — use placeholder values only.

```dotenv
# Required — base URL of the backend API
VITE_API_URL=https://api.example.com

# Optional — enables the beta dashboard (default: false)
VITE_FEATURE_FLAG=false
```

---

## 5. Testing env.ts

### Provide test values in Vitest config

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    env: {
      VITE_API_URL: 'http://localhost:3000',
      VITE_APP_TITLE: 'Test App',
    },
  },
})
```

### Or mock the module directly

```ts
vi.mock('@/env', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3000',
    VITE_APP_TITLE: 'Test App',
    VITE_FEATURE_FLAG: false,
  },
}))
```

### Test the schema itself

Keep a dedicated spec that documents which fields are required and optional:

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

Use dynamic `import()` in env spec tests so the module re-evaluates with the stubbed env. Add `resetModules: true` to the Vitest config or call `vi.resetModules()` in `beforeEach`.

---

## 6. ESLint enforcement (optional)

Prevent direct `import.meta.env` access outside `src/env.ts`:

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

- [ ] All code reads from `env.*`, never from `import.meta.env` / `process.env`
- [ ] `src/env.ts` exports only `env` — nothing else
- [ ] New variables are added to the schema in `src/env.ts` and to `.env.example` in the same PR
- [ ] `.env.example` entries have comments explaining purpose and required/optional status
- [ ] Boolean env vars use `.transform()`, not manual string comparison
- [ ] Vitest config provides test values so tests don't fail on missing env
- [ ] (Optional) ESLint rule blocks direct `import.meta.env` access
