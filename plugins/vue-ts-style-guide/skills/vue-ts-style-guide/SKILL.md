# Vue 3 + TypeScript Style Guide

A house style guide for writing Vue 3 components with the Composition API and TypeScript. Based on the official Vue.js TypeScript with Composition API guide, adapted with stricter conventions for this codebase.

## 0. Golden Rule: Always use `<script setup lang="ts">`

> **Every single-file component in this project MUST use `<script setup lang="ts">`.**

The Vue docs describe an alternative pattern for projects that don't use `<script setup>`, based on wrapping the component in `defineComponent()` and typing the `props` argument of `setup()`. **Do not use that pattern here.** It exists for legacy/non-`<script setup>` codebases only.

Whenever you would reach for `defineComponent({ setup(props) { ... } })` to get typed props or typed emits, use `<script setup lang="ts">` with `defineProps` / `defineEmits` instead. This applies everywhere in this project, with no exceptions — even for very small or one-off components.

```vue
<!-- ✅ Always do this -->
<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<!-- ❌ Never do this in this codebase -->
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: String
  },
  setup(props) {
    // ...
  }
})
</script>
```

---

## 0.1 Golden Rule: Always type everything explicitly

> **Never leave a variable, function parameter, or function return value implicitly typed when a named type can be used instead.**

This project does not rely on loose inference alone. Every variable declaration, function parameter, and function return should be backed by an explicit `interface`, `type` alias, or `enum` — not `any`, not an inline anonymous shape repeated in multiple places, and not "whatever TypeScript infers" for anything beyond trivial primitives.

- **Variables**: when a variable holds a non-trivial shape (object, union of known states, etc.), declare or import a named `interface`/`type`/`enum` for it instead of an inline literal type or a bare `any`.
- **Function parameters**: every parameter must have an explicit type, using a named `interface`/`type`/`enum` for anything beyond a primitive (`string`, `number`, `boolean`).
- **Function return types**: always declare the return type explicitly, using a named `interface`/`type`/`enum` when the return value isn't a primitive.
- Prefer `enum` (or a string-literal union type) over raw string/number values for any fixed set of states or options.

```ts
// ❌ Avoid: no explicit types, inline/anonymous shapes, implicit return type
function createUser(data) {
  return { id: data.id, name: data.name, status: 'active' }
}

// ✅ Prefer: named types on parameters, variables, and return value
interface CreateUserInput {
  id: string
  name: string
}

enum UserStatus {
  Active = 'active',
  Inactive = 'inactive'
}

interface User {
  id: string
  name: string
  status: UserStatus
}

function createUser(data: CreateUserInput): User {
  const user: User = { id: data.id, name: data.name, status: UserStatus.Active }
  return user
}
```

This applies inside `<script setup lang="ts">` blocks too — local helper functions, computed getters with non-trivial logic, event handlers, and composables should all have their parameters and return types explicitly declared with named types rather than left to inference or written as inline object literals.

---

## 1. Typing Props

### Prefer type-based declaration

Use a generic type argument to `defineProps<T>()` rather than the runtime object form. This keeps props definitions as plain TypeScript, which is easier to read, refactor, and share.

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()
</script>
```

- Extract the shape into a named `Props` interface (or import one from a shared types file) rather than inlining a large anonymous type.
- A `Props` interface may be imported from another module (relative path, alias, or package) — prefer this for props shared across components.
- Do not mix type-based and runtime (object-literal) declarations in the same component; pick type-based declaration by default.
- Runtime declaration (`defineProps({ ... })`) is only acceptable when you need a runtime validator (e.g. a custom `validator` function) that type-based declaration can't express.

### Default values

Because type-based declaration has no place to attach defaults, use `withDefaults`:

```vue
<script setup lang="ts">
interface Props {
  label?: string
  tags?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Untitled',
  tags: () => []
})
</script>
```

- Default values for arrays/objects **must** be provided as a factory function (`() => [...]`), never as a shared literal, to avoid every instance sharing the same reference.

### Complex prop types

Complex/object props should reference a real interface or type alias, not an inline shape with many fields:

```vue
<script setup lang="ts">
interface Article {
  id: string
  title: string
  publishedAt: Date
}

const props = defineProps<{
  article: Article
}>()
</script>
```

---

## 2. Typing Emits

Prefer the type-based `defineEmits` syntax, using the succinct tuple form:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  submit: [id: string]
  cancel: []
}>()
</script>
```

- Name tuple arguments (`id: string`, not just `string`) so the intent of each payload is self-documenting.
- Avoid the older call-signature style (`(e: 'submit', id: string): void`) in new code — the tuple form is more concise and equally type-safe.
- Only fall back to runtime `defineEmits([...])` (array of event names, no typing) for trivial components with zero payload events, and even then prefer the typed form for consistency.

---

## 3. Typing `ref()`

- Let `ref()` infer the type from its initial value whenever possible; don't over-annotate.
- When the value can be more than one type, or starts empty, pass an explicit generic argument:

```ts
import { ref } from 'vue'

const status = ref<'idle' | 'loading' | 'error'>('idle')
const selectedId = ref<number>() // Ref<number | undefined>
```

- Reach for the imported `Ref<T>` type only when annotating a variable declared separately from its `ref()` call (e.g. a function return type).

---

## 4. Typing `reactive()`

- Prefer `ref()` for primitives and `reactive()` for grouped, always-present object state.
- Type `reactive()` values via a plain interface on the variable, not via `reactive<T>()`'s generic argument (nested ref-unwrapping makes that generic misleading):

```ts
import { reactive } from 'vue'

interface FormState {
  name: string
  age: number | null
}

const form: FormState = reactive({ name: '', age: null })
```

---

## 5. Typing `computed()`

- Let `computed()` infer its type from the getter's return value by default.
- Add an explicit generic argument only when you want TypeScript to enforce a return type stricter than what would be inferred (e.g. narrowing a union):

```ts
const total = computed<number>(() => cartItems.value.reduce((sum, i) => sum + i.price, 0))
```

---

## 6. Typing Event Handlers

Always annotate the native event type explicitly — never leave a handler parameter implicitly `any`.

```vue
<script setup lang="ts">
function onInputChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  // ...
}
</script>

<template>
  <input type="text" @change="onInputChange" />
</template>
```

- Use the most specific DOM event type available (`MouseEvent`, `KeyboardEvent`, `InputEvent`, etc.) instead of the generic `Event` when the extra fields are needed.
- Use a type assertion (`as HTMLInputElement`, etc.) to access `event.target` properties, since the DOM lib types `target` loosely.

---

## 7. Typing Provide / Inject

Always pair `provide`/`inject` with a typed `InjectionKey`, defined once in a shared module and imported by both sides:

```ts
// keys.ts
import type { InjectionKey } from 'vue'

export const themeKey: InjectionKey<'light' | 'dark'> = Symbol()
```

```ts
// provider component
import { provide } from 'vue'
import { themeKey } from './keys'

provide(themeKey, 'dark')
```

```ts
// consumer component
import { inject } from 'vue'
import { themeKey } from './keys'

const theme = inject(themeKey) // 'light' | 'dark' | undefined
```

- Do not use bare string keys for `provide`/`inject`; always use a typed `InjectionKey<T>`.
- If the value is always guaranteed to be provided, supply a default as the second argument to `inject()` to drop `undefined` from the type, rather than force-casting.

---

## 8. Typing Template Refs

Use `useTemplateRef()` for template refs. On this project's tooling (Vue 3.5+ / `@vue/language-tools` 2.1+), simple element refs are inferred automatically — no generic argument needed for a plain `<input ref="el" />`.

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef('input')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

- Supply an explicit generic argument only when auto-inference can't apply (dynamic `:is`, non-SFC usage, or picking between multiple possible component types):

```ts
type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
```

- Always guard access with optional chaining (`inputRef.value?.focus()`) — the ref is `null` before mount and can become `null` again if the element is removed by `v-if`.
- For generic components, type the ref via `ComponentExposed` from `vue-component-type-helpers` rather than `InstanceType`.

---

## 9. Typing Global Custom Directives

When registering a global custom directive, extend Vue's `GlobalDirectives` interface via module augmentation so the directive gets type-checked in templates:

```ts
// directives/tooltip.ts
import type { Directive } from 'vue'

export type TooltipDirective = Directive<HTMLElement, string>

declare module 'vue' {
  export interface GlobalDirectives {
    vTooltip: TooltipDirective
  }
}

export default {
  mounted(el, binding) {
    el.title = binding.value
  }
} satisfies TooltipDirective
```

- Always type the directive's element and binding value via `Directive<ElType, ValueType>`.
- Use `satisfies` (not a type annotation on the export) so the default export keeps its precise inferred shape while still being checked against the directive type.

---

## Quick Checklist

- [ ] `<script setup lang="ts">` on every SFC — never `defineComponent()` + `setup(props)`
- [ ] Variables, function parameters, and function return types are always explicitly typed via a named `interface`/`type`/`enum` — no implicit `any`, no unnamed inline shapes
- [ ] Props: type-based `defineProps<Props>()`, `withDefaults` for defaults, factory functions for array/object defaults
- [ ] Emits: typed `defineEmits<{ ... }>()` using the tuple syntax
- [ ] `ref()` typed only when inference isn't enough
- [ ] `reactive()` typed via a variable-level interface, not the generic argument
- [ ] Event handlers always annotated (`event: Event`, cast `event.target` as needed)
- [ ] `provide`/`inject` always via a typed `InjectionKey<T>`, never a bare string
- [ ] Template refs via `useTemplateRef()`, generic argument only when inference can't apply
- [ ] Global custom directives typed via `declare module 'vue' { interface GlobalDirectives { ... } }`

---

*Source: adapted from the official Vue.js guide, "TypeScript with Composition API" (https://vuejs.org/guide/typescript/composition-api.html).*