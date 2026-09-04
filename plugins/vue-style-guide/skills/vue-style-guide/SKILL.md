# Vue Style Guide
 
A generic, framework-agnostic-within-Vue style guide for naming and structuring Vue components, composables, and code. Organized by priority so teams know what's negotiable and what isn't.
 
---
 
## Priority A — Essential (always follow)
 
Rules that prevent real bugs. Deviating from these should be rare and deliberate.
 
### Component names must be multi-word
Single-word component names can collide with current or future native HTML elements.
 
```js
// ❌ Bad
export default { name: 'Card' }
 
// ✅ Good
export default { name: 'ProfileCard' }
```
Exception: the root `App` component and Vue's own built-ins (`<Transition>`, `<component>`, etc).
 
### `data` must always return a fresh object
If `data` is a plain object (outside the root instance), every component instance shares it — mutating one instance's state leaks into all the others.
 
```js
// ❌ Bad
export default {
  data: { count: 0 }
}
 
// ✅ Good
export default {
  data() {
    return { count: 0 }
  }
}
```
 
### Declare props with explicit types
Loosely typed props (`props: ['status']`) skip Vue's runtime validation and document nothing.
 
```ts
// ✅ Good
defineProps<{
  status: 'idle' | 'loading' | 'error'
}>()
```
 
### Always key your `v-for`
Without a stable `key`, Vue can't reliably track which DOM node maps to which data item, which breaks animations, focus state, and component-local state during reordering.
 
```html
<!-- ✅ Good -->
<li v-for="item in items" :key="item.id">{{ item.label }}</li>
```
 
### Never combine `v-if` and `v-for` on the same element
`v-for` has higher precedence, so `v-if` re-evaluates on every iteration instead of gating the loop. Filter with a computed property, or move the conditional to a wrapper element.
 
```html
<!-- ❌ Bad -->
<li v-for="user in users" v-if="user.active" :key="user.id">{{ user.name }}</li>
 
<!-- ✅ Good -->
<li v-for="user in activeUsers" :key="user.id">{{ user.name }}</li>
```
 
### Scope your component styles
Global CSS bleeding out of one component into the rest of the app is a common source of hard-to-trace bugs. Use `<style scoped>`, CSS Modules, or a naming convention like BEM — pick one and stick to it. Shared component libraries should favor a class-naming convention over `scoped`, since it's easier for consumers to override.
 
### Prefix private helpers so they can't collide
For mixins, plugins, or composables exposing internals that shouldn't be treated as public API, prefix with something unlikely to collide (e.g. `_yourLibName_helperName`), or better — keep the helper out of the exported object entirely via module scope.
 
---
 
## Priority B — Strongly recommended
 
Improves readability and consistency across a codebase. Violations should be rare and justified.
 
### One component per file
Makes components easy to locate, review, and diff independently.
 
### Filenames: PascalCase or kebab-case, pick one
```
components/UserCard.vue      // PascalCase
components/user-card.vue     // kebab-case
```
Don't mix the two within a project.
 
### Prefix base/presentational components
Components with no app-specific logic — just markup, styling, and slots — get a shared prefix (`Base`, `App`, or `V` are common choices):
```
BaseButton.vue
BaseInput.vue
BaseIcon.vue
```
This groups them together alphabetically and avoids ad-hoc naming for simple wrappers.
 
### Prefix singleton components with `The`
Components that appear exactly once per page (a header, a sidebar) signal that with a `The` prefix:
```
TheNavbar.vue
TheFooter.vue
```
These shouldn't take props — if you find yourself adding one, it's probably not actually a singleton.
 
### Prefix tightly-coupled child components with their parent's name
```
TodoList.vue
TodoListItem.vue
TodoListItemButton.vue
```
Keeps related files adjacent in an alphabetically sorted file tree, and makes the relationship obvious without nested folders.
 
### Order component name words from general to specific
```
// ❌ Bad — hard to tell these are related
ClearSearchButton.vue
RunSearchButton.vue
SearchInput.vue
 
// ✅ Good — grouped by feature at a glance
SearchButtonClear.vue
SearchButtonRun.vue
SearchInput.vue
```
 
### Self-close components with no content
```html
<!-- In SFCs / JSX -->
<UserAvatar />
 
<!-- Never in raw DOM templates — HTML doesn't support self-closing custom tags there -->
```
 
### Casing: PascalCase in code, kebab-case in raw DOM templates
```html
<!-- SFC template -->
<UserAvatar :size="large" />
```
```js
// script
import UserAvatar from './UserAvatar.vue'
```
Kebab-case is only mandatory in-DOM templates (HTML is case-insensitive there).
 
### Prefer full words over abbreviations
```
// ❌ Bad
UsrProfOpts.vue
 
// ✅ Good
UserProfileOptions.vue
```
 
### Props: camelCase in script, kebab-case in templates
```ts
defineProps<{ greetingText: string }>()
```
```html
<Welcome greeting-text="hi" />
```
 
### One attribute per line for multi-attribute elements
```html
<!-- ✅ Good -->
<UserCard
  :user="user"
  :highlighted="isActive"
  @select="onSelect"
/>
```
 
### Keep template expressions simple
Move anything beyond a trivial expression into a computed property or method — templates should describe *what*, not *how*.
 
### Keep computed properties small and single-purpose
A computed doing three things at once is harder to test, name, and reuse than three small computeds.
 
### Always quote attribute values
```html
<!-- ✅ Good -->
<input type="text" :style="{ width: sidebarWidth + 'px' }">
```
 
### Use directive shorthands consistently
Pick `:` / `@` / `#` (or the long form `v-bind:` / `v-on:` / `v-slot:`) and apply it everywhere — don't mix within a project.
 
---
 
## Priority C — Recommended (pick one, stay consistent)
 
Where several options are equally valid, consistency matters more than which one you pick.
 
### Suggested component option order
1. Side effects (`el`)
2. Global awareness (`name`, `parent`)
3. Template compiler options (`delimiters`, `comments`)
4. Template dependencies (`components`, `directives`)
5. Composition (`extends`, `mixins`)
6. Interface (`props`, `inheritAttrs`, `model`)
7. Local state (`data`, `computed`)
8. Events (`watch`, lifecycle hooks in call order)
9. Non-reactive members (`methods`)
10. Rendering (`template` / `render`)
### Suggested element/attribute order
1. `is`
2. `v-for`
3. Conditionals (`v-if`, `v-else-if`, `v-else`, `v-show`)
4. Render modifiers (`v-pre`, `v-once`)
5. `id`
6. `ref`, `key`
7. `v-model`
8. Other bound/unbound attributes
9. Events (`v-on` / `@`)
10. Content overrides (`v-html`, `v-text`)
### SFC block order
```vue
<script setup>
/* ... */
</script>
 
<template>
  <!-- ... -->
</template>
 
<style scoped>
/* ... */
</style>
```
Keep this order consistent across every component; `<style>` last since at least one of the other two blocks is always required.
 
---