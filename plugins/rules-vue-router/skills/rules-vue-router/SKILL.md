---
name: rules-vue-router
description: Enforces Vue Router best practices — lazy-loaded routes, file-based routing conventions, Composition API usage, data fetching patterns, and v-slot for multi-route layouts. Use when creating or editing Vue Router configuration, route components, or navigation logic.
---

# Vue Router Guide

Conventions and recommendations to follow whenever working with Vue Router in this project.

## 1. Lazy-loaded routes

Always define routes with dynamic imports so each route's component is code-split into its own chunk and loaded only when navigated to.

```ts
// ❌ Bad — eager import bundles everything upfront
import UserProfile from './views/UserProfile.vue'

const routes = [
  { path: '/users/:id', component: UserProfile }
]

// ✅ Good — lazy-loaded, code-split per route
const routes = [
  {
    path: '/users/:id',
    component: () => import('./views/UserProfile.vue')
  }
]
```

Group related routes into the same chunk when they are likely to be needed together:

```ts
const UserRoutes = () => import('./views/users/UserRoutes.vue')

const routes = [
  {
    path: '/users',
    component: UserRoutes,
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "user" */ './views/users/UserProfile.vue')
      },
      {
        path: ':id/edit',
        component: () => import(/* webpackChunkName: "user" */ './views/users/UserEdit.vue')
      }
    ]
  }
]
```

## 2. File-based routing conventions

- Organise route components under `src/views/` following the file-based routing naming convention so the folder layout mirrors the URL structure.
- The component name should follow the vue-code naming convention (PascalCase) and at least 2 words (e.g. `UserProfile.vue` instead of `Profile.vue`).

```
src/
  views/
    IndexView.vue             → /
    AboutView.vue             → /about
    users/
      IndexView.vue           → /users
      [id].vue            → /users/:id
      [id]/
        IndexView.vue         → /users/:id
        EditView.vue          → /users/:id/edit
    [...path].vue         → /* (catch-all / 404)
```

Naming rules:

| Pattern | Route |
|---|---|
| `IndexView.vue` | `/` of parent segment |
| `[param].vue` | Dynamic segment `:param` |
| `[[param]].vue` | Optional param `:param?` |
| `[...rest].vue` | Catch-all `/:rest*` |
| `(group)/` | Nested folder with no URL segment |

Keep the file name meaningful and match the URL segment it represents. Avoid generic names like `Page.vue`.

## 3. Composition API

Use `useRouter` and `useRoute` from `vue-router` inside `<script setup>` — never access `this.$router` or `this.$route`.

```ts
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Read params
const userId = computed(() => route.params.id as string)

// Navigate programmatically
function goBack() {
  router.back()
}

function goToProfile(id: string) {
  router.push({ name: 'UserProfile', params: { id } })
}
```

Use `useLink` when building custom link components:

```ts
import { useLink } from 'vue-router'

const props = defineProps<{ to: string }>()
const { href, isActive, navigate } = useLink({ to: props.to })
```

Use navigation guards inside components with `onBeforeRouteLeave` / `onBeforeRouteUpdate`:

```ts
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    return confirm('Discard unsaved changes?')
  }
})

onBeforeRouteUpdate(async (to) => {
  // re-fetch when :id changes without unmounting the component
  await fetchUser(to.params.id as string)
})
```

## 4. Data fetching

Two accepted patterns — choose based on whether a loading state should block navigation or render immediately.

### Fetch after navigation (render-first)

Navigate immediately; show a skeleton/spinner while data loads inside the component. Prefer this for most cases.

```ts
// UserProfile.vue
const route = useRoute()
const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function fetchUser(id: string) {
  isLoading.value = true
  error.value = null
  try {
    user.value = await userService.getById(id)
  } catch {
    error.value = 'Failed to load user'
  } finally {
    isLoading.value = false
  }
}

// fetch on mount and re-fetch when params change
watch(() => route.params.id, (id) => fetchUser(id as string), { immediate: true })
```

### Fetch before navigation (guard-first)

Block navigation until data resolves. Use only when the page is meaningless without its data (e.g. an edit form needs the record before it can render).

```ts
// in router.ts
{
  path: '/users/:id/edit',
  component: () => import('./views/UserEdit.vue'),
  async beforeEnter(to) {
    const user = await userService.getById(to.params.id as string)
    if (!user) return { name: 'NotFound' }
    to.meta.user = user
  }
}
```

```ts
// UserEdit.vue — access pre-fetched data from meta
const route = useRoute()
const user = computed(() => route.meta.user as User)
```

Declare meta types in `router.d.ts` to keep meta typed:

```ts
// src/router.d.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    user?: User
  }
}
```

## 5. RouterView with v-slot

Use the `v-slot` API on `<RouterView>` to wrap every route's component in a shared layout (transitions, error boundaries, suspense) without creating a separate layout component for each route.

### Transitions

```vue
<RouterView v-slot="{ Component }">
  <Transition name="fade" mode="out-in">
    <component :is="Component" :key="$route.path" />
  </Transition>
</RouterView>
```

### Suspense with async components

```vue
<RouterView v-slot="{ Component }">
  <Suspense>
    <template #default>
      <component :is="Component" />
    </template>
    <template #fallback>
      <AppSpinner />
    </template>
  </Suspense>
</RouterView>
```

### KeepAlive for specific routes

Only keep-alive routes that declare it, so the cache stays bounded:

```vue
<RouterView v-slot="{ Component, route }">
  <KeepAlive v-if="route.meta.keepAlive">
    <component :is="Component" />
  </KeepAlive>
  <component v-else :is="Component" />
</RouterView>
```

Declare `keepAlive` in RouteMeta as shown in the data fetching section above.

## 6. Named routes

Always name every route. Navigate using `{ name }` objects, never hardcoded path strings, so path changes don't break navigation call-sites.

```ts
const routes = [
  { path: '/', name: 'Home', component: () => import('./views/Index.vue') },
  { path: '/users/:id', name: 'UserProfile', component: () => import('./views/users/[id].vue') }
]

// ✅ Good
router.push({ name: 'UserProfile', params: { id: '42' } })

// ❌ Bad
router.push('/users/42')
```

## 7. Route guards

Define global guards in `router.ts`, per-route guards in the route definition (`beforeEnter`), and in-component guards via `onBeforeRouteLeave` / `onBeforeRouteUpdate`. Never use the Options API `beforeRouteLeave` hook.

```ts
// router.ts
router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})
```
