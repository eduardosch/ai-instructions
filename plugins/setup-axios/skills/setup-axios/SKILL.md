---
name: setup-axios
description: Creates the typed axios HTTP client module (src/lib/http.ts) with a base URL, auth token interceptor, and error normalisation, plus shared API types in src/types/api.ts. Run once per project. For ongoing service/composable conventions use rules-client-api.
oneshot: true
---

# Axios Setup

Creates the single typed axios instance and shared API types that all service modules use.

Pairs naturally with [[setup-vue-project]], [[setup-zod]] (env gateway), and [[rules-client-api]] (service and composable conventions).

---

## Step 1 — Install

```bash
pnpm add axios
```

---

## Step 2 — Create the HTTP client module

Create `src/lib/http.ts`:

```ts
// src/lib/http.ts
import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

function createApiError(error: AxiosError): ApiError {
  return {
    message: (error.response?.data as { message?: string })?.message ?? error.message,
    status: error.response?.status ?? 0,
    code: (error.response?.data as { code?: string })?.code,
  }
}

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(createApiError(error)),
)

export default http
```

Key rules:
- One instance per app — never call `axios.create()` outside this file.
- All env vars must be prefixed `VITE_` and documented in `.env.example`.
- The interceptor must swallow `AxiosError` and rethrow an `ApiError`; callers must never receive a raw `AxiosError`.

If the project uses [[setup-zod]], update `src/env.ts` to include `VITE_API_BASE_URL`:

```ts
VITE_API_BASE_URL: z.string().url(),
```

Then update `http.ts` to read from the env gateway:

```ts
import { env } from '@/env'
// ...
const http: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  // ...
})
```

---

## Step 3 — Create shared API types

Create `src/types/api.ts`:

```ts
// src/types/api.ts

export interface ApiError {
  message: string
  status: number
  code?: string
}

/** Wrap every paginated collection endpoint */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
  }
}
```

---

## Step 4 — File & folder layout

```
src/
├── lib/
│   └── http.ts               # singleton axios instance
├── types/
│   ├── api.ts                # ApiError, PaginatedResponse, shared shapes
│   └── users.ts              # domain-specific types (optional split)
├── services/
│   └── (service files go here — see rules-client-api)
└── composables/
    └── (composables go here — see rules-client-api)
```

---

## Quick checklist

- [ ] `axios` installed
- [ ] `src/lib/http.ts` created with interceptors
- [ ] `src/types/api.ts` created with `ApiError` and `PaginatedResponse<T>`
- [ ] `VITE_API_BASE_URL` added to `src/env.ts` schema (if using setup-zod)
- [ ] `VITE_API_BASE_URL` added to `.env.example`
