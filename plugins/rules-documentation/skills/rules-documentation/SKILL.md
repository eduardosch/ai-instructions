---
name: rules-documentation
description: Enforces JSDoc-style comments on Vue 3 reusable components — component description with @displayName, every prop annotated, emits with @param, slots with @slot, and exposed members documented. Use when writing or reviewing reusable components, or when auditing missing documentation. Requires setup-docgen to have been run.
---

# Documentation Rules

Conventions for documenting Vue 3 reusable components with JSDoc comments compatible with **vue-docgen-api** and **Vue Styleguidist**. Requires [[setup-docgen]] to have been run.

Pairs naturally with [[rules-vue-code]] and [[rules-ts]].

---

## 1. Component-level comment

Place a JSDoc block directly above `<script setup>`. This becomes the component description in the docs.

```vue
<script setup lang="ts">
/**
 * A button that triggers an action. Supports multiple variants and sizes.
 * Use `default` slot for label text or icon + label combinations.
 *
 * @displayName BaseButton
 */
</script>
```

Rules:
- `@displayName` overrides the component name shown in the docs. Use PascalCase.
- Keep the description to 1–3 sentences. Details go in examples.

---

## 2. Props

Document every prop with a JSDoc comment immediately above its definition in the TypeScript interface:

```vue
<script setup lang="ts">
/**
 * A button that triggers an action.
 * @displayName BaseButton
 */

export interface BaseButtonProps {
  /** Visual style of the button. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'

  /** Size preset. */
  size?: 'sm' | 'md' | 'lg'

  /** Disables the button and prevents interaction. */
  disabled?: boolean

  /**
   * Shows a loading spinner and disables interaction.
   * @default false
   */
  loading?: boolean

  /**
   * HTML `type` attribute forwarded to the native `<button>`.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})
</script>
```

Rules:
- Every prop must have a JSDoc comment. Single-line `/** ... */` is fine for simple props.
- Use `@default` when the default value is non-obvious (not `false` or `undefined`).
- Document union string types inline — vue-docgen-api renders them as accepted values.

---

## 3. Emits

Document each emit with a `@param` describing the payload:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  /**
   * Fires when the button is clicked and not disabled or loading.
   * @param event - The native MouseEvent.
   */
  click: [event: MouseEvent]

  /**
   * Fires when the button receives keyboard focus.
   * @param event - The native FocusEvent.
   */
  focus: [event: FocusEvent]
}>()
</script>
```

---

## 4. Slots

Document slots with a `@slot` JSDoc tag inside the component-level comment:

```vue
<script setup lang="ts">
/**
 * A card container with optional header and footer areas.
 * @displayName BaseCard
 *
 * @slot default - Main card content.
 * @slot header - Content placed above the body; replaces the default title.
 * @slot footer - Content placed below the body; typically action buttons.
 */
</script>
```

Rules:
- Name each slot after its actual slot name in the template.
- Describe what it renders and what changes when it is filled.

---

## 5. Exposed API

If the component exposes a public API with `defineExpose`, document each member:

```vue
<script setup lang="ts">
/**
 * A text input with built-in validation display.
 * @displayName BaseInput
 */

/** Focuses the underlying input element programmatically. */
function focus() { inputRef.value?.focus() }

/** Clears the current value and resets validation state. */
function reset() { inputRef.value!.value = ''; touched.value = false }

defineExpose({ focus, reset })
</script>
```

---

## 6. Examples

Create a `ComponentName.examples.md` file in the same directory as the component:

```md
Basic usage:

​```vue
<template>
  <BaseButton @click="onClick">Save changes</BaseButton>
</template>
<script setup>
function onClick() { alert('Saved!') }
</script>
​```

With variants:

​```vue
<template>
  <div style="display: flex; gap: 8px">
    <BaseButton variant="primary">Primary</BaseButton>
    <BaseButton variant="secondary">Secondary</BaseButton>
    <BaseButton variant="ghost">Ghost</BaseButton>
    <BaseButton variant="danger">Danger</BaseButton>
  </div>
</template>
​```
```

Rules:
- One `.examples.md` per reusable component, co-located with the `.vue` file.
- Show the most common usage first, then variants.
- Keep examples minimal — the point is to show usage, not to test every prop combination.

---

## 7. Auditing missing documentation

When asked to audit an existing codebase:

> "Scan all `.vue` files under `src/components/`. For every component that is missing a component-level JSDoc comment, a `@displayName` tag, or JSDoc on any prop, emit, or named slot — report it as a table: file path, missing item, suggested fix."

---

## Quick checklist

- [ ] Every reusable component has a component-level JSDoc with `@displayName`
- [ ] Every prop has a single-line JSDoc comment
- [ ] Every emit is annotated with `@param` describing the payload
- [ ] Named slots are documented with `@slot` tags
- [ ] `defineExpose` members are individually commented
- [ ] At least one `.examples.md` per reusable component
