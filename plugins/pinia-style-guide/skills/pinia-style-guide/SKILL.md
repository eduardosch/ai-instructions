# Pinia Store Guide

Conventions and recommendations to follow whenever creating or editing a Pinia store in this project.

## 1. Store style

- Use the **Composition API (setup) syntax** for stores, not the Options API.
- Define stores with `defineStore(id, () => { ... })`.
- Use `ref` for state, computed for getters, and plain functions for actions.

```ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => user.value !== null)

  function setUser(newUser: User) {
    user.value = newUser
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, setUser, logout }
})
```

## 2. Naming conventions

- File name: `useXStore.ts` (camelCase, `use` prefix, `Store` suffix), e.g. `useUserStore.ts`.
- Store id: kebab-case or camelCase matching the domain, e.g. `'user'`, `'shopping-cart'`.
- Composable export name matches the file name: `useUserStore`.

## 3. Folder structure

```
src/
  stores/
    useUserStore.ts
    useCartStore.ts
    modules/
      useAuthStore.ts
```

- Group related stores under `stores/`.
- If a domain grows large, split into `stores/modules/`.

## 4. State

- Type all state explicitly; avoid `any`.
- Keep state minimal — derive values with `computed` instead of duplicating state.
- Initialize state with sensible defaults (`null`, `[]`, `{}`) rather than leaving it `undefined`.

## 5. Actions

- Keep actions focused on a single responsibility.
- Handle async logic (API calls) inside actions, not in components.
- Wrap async actions in `try/catch` and expose loading/error state when relevant:

```ts
const isLoading = ref(false)
const error = ref<string | null>(null)

async function fetchUser(id: string) {
  isLoading.value = true
  error.value = null
  try {
    user.value = await api.getUser(id)
  } catch (e) {
    error.value = 'Failed to fetch user'
  } finally {
    isLoading.value = false
  }
}
```

## 6. Getters

- Use `computed` for any derived/read-only value.
- Avoid heavy logic in getters — extract to a helper function if it grows complex.

## 7. TypeScript

- Export interfaces/types used by the store from a dedicated `types.ts` (or colocated) file when reused elsewhere.
- Type function parameters and return values explicitly.

## 8. Persistence

- If a store needs to persist data (e.g. auth token, user preferences), use a persistence plugin (e.g. `pinia-plugin-persistedstate`) instead of manually reading/writing `localStorage` inside the store.

## 9. Testing

- Each store should have a matching test file when the project has testing enabled (e.g. `useUserStore.spec.ts`).
- Test actions and getters in isolation using `setActivePinia(createPinia())`.

## 10. Usage in components

- Only call `useXStore()` inside `setup()` / `<script setup>`, never at module scope.
- Destructure state/getters with `storeToRefs()` to preserve reactivity:

```ts
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user, isLoggedIn } = storeToRefs(userStore)
const { logout } = userStore
```

## 11. Documentation

- Add a short comment at the top of each store explaining its purpose and responsibility.
- Document non-obvious actions/getters with JSDoc comments.