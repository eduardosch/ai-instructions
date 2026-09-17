---
name: rules-client-api
description: Style guide for structuring API calls and services — never call axios/fetch directly in components, typed service modules per domain, composables own loading/error state, typed ApiError from interceptor. Use when creating or reviewing service files or API composables. Requires setup-axios to have been run first.
---

# API Client Conventions

A house style guide for writing API service layers with full TypeScript coverage. Requires [[setup-axios]] to have been run (creates `src/lib/http.ts` and `src/types/api.ts`).

Pairs naturally with [[rules-ts]] — follow both when building Vue 3 apps that consume REST APIs.

---

## 0. Golden Rule: never call `axios` / `fetch` directly in a component

All network traffic must go through a typed service module. Components call composables; composables call service functions; service functions call the shared http client. No exceptions.

```ts
// ❌ Never: raw axios inside a component
const res = await axios.get('/api/users')

// ✅ Always: composable → service → http client
const { users, isLoading } = useUsers()
```

---

## 1. Service modules

Each domain gets its own service file: `src/services/usersService.ts`, `src/services/postsService.ts`, etc.

Rules:
- The file exports only pure async functions — no state, no Vue reactivity.
- Every function has an explicit return type.
- Functions accept typed input objects, not positional primitives for more than one argument.

```ts
// src/services/usersService.ts
import http from '@/lib/http'
import type { PaginatedResponse } from '@/types/api'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export enum UserRole {
  Admin = 'admin',
  Viewer = 'viewer',
}

export interface ListUsersParams {
  page?: number
  perPage?: number
  role?: UserRole
}

export interface CreateUserInput {
  name: string
  email: string
  role: UserRole
}

export async function listUsers(params: ListUsersParams = {}): Promise<PaginatedResponse<User>> {
  const { data } = await http.get<PaginatedResponse<User>>('/users', { params })
  return data
}

export async function getUser(id: string): Promise<User> {
  const { data } = await http.get<User>(`/users/${id}`)
  return data
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const { data } = await http.post<User>('/users', input)
  return data
}

export async function updateUser(id: string, input: Partial<CreateUserInput>): Promise<User> {
  const { data } = await http.patch<User>(`/users/${id}`, input)
  return data
}

export async function deleteUser(id: string): Promise<void> {
  await http.delete(`/users/${id}`)
}
```

- Always pass the expected response type as a generic to `http.get<T>()`, `http.post<T>()`, etc.
- Use `Partial<T>` on update/patch inputs only when every field is genuinely optional — if some fields are always required, write a dedicated `UpdateXInput` type.

---

## 2. Composables

Composables bridge Vue 3 reactivity with service functions. They own loading/error state; they do not own business logic beyond translating service results into reactive state.

```ts
// src/composables/useUsers.ts
import { ref, type Ref } from 'vue'
import { listUsers, type User, type ListUsersParams } from '@/services/usersService'
import type { ApiError, PaginatedResponse } from '@/types/api'

interface UseUsersReturn {
  users: Ref<User[]>
  total: Ref<number>
  isLoading: Ref<boolean>
  error: Ref<ApiError | null>
  fetchUsers: (params?: ListUsersParams) => Promise<void>
}

export function useUsers(): UseUsersReturn {
  const users = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<ApiError | null>(null)

  async function fetchUsers(params: ListUsersParams = {}): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const result: PaginatedResponse<User> = await listUsers(params)
      users.value = result.data
      total.value = result.meta.total
    } catch (err) {
      error.value = err as ApiError
    } finally {
      isLoading.value = false
    }
  }

  return { users, total, isLoading, error, fetchUsers }
}
```

Rules:
- Always declare `isLoading`, `error`, and the primary data ref.
- Reset `error` to `null` at the start of each call.
- Type the caught error as `ApiError` (the http interceptor guarantees this shape).
- Declare a return-type interface and export it if callers need to annotate props or inject it.

---

## 3. Using composables in components

```vue
<script setup lang="ts">
import { useUsers } from '@/composables/useUsers'

const { users, isLoading, error, fetchUsers } = useUsers()

fetchUsers()
</script>

<template>
  <div v-if="isLoading">Loading…</div>
  <div v-else-if="error" class="error">{{ error.message }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

- Never `try/catch` a composable call in a component — the composable owns that; the component just reads `error`.
- Use `error.status` to branch on 401/403/404 when different UI is needed per status.

---

## 4. Global error bus (optional)

For app-wide toasts on 5xx errors, add a second response interceptor in `http.ts`:

```ts
http.interceptors.response.use(undefined, (error: ApiError) => {
  if (error.status >= 500) eventBus.emit('api:server-error', error)
  return Promise.reject(error)
})
```

---

## 5. File & folder layout

```
src/
├── lib/
│   └── http.ts               # singleton axios instance (from setup-axios)
├── types/
│   ├── api.ts                # ApiError, PaginatedResponse (from setup-axios)
│   └── users.ts              # domain-specific types (optional split)
├── services/
│   ├── usersService.ts
│   └── postsService.ts
└── composables/
    ├── useUsers.ts
    └── usePosts.ts
```

- One service file per domain noun (not per endpoint).
- Composables live alongside Vue components' composables, not inside `services/`.
- `lib/http.ts` is the only file that imports from `axios` directly.

---

## Quick checklist

- [ ] All API calls go through `src/lib/http.ts` — no direct `axios`/`fetch` in components
- [ ] Every service function has an explicit return type using a named interface/enum
- [ ] `PaginatedResponse<T>` wraps all paginated endpoints
- [ ] Composables own `isLoading`, `error`, and data refs; components only read them
- [ ] `error` is reset to `null` at the start of each composable call
- [ ] No `any` in response types — use generics and narrow `unknown` explicitly
- [ ] One axios instance, created once in `lib/http.ts`, imported everywhere else
