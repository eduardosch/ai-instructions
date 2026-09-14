---
name: vue-component-docs
description: Documents Vue 3 reusable components with JSDoc-style comments and generates a live Vue Styleguidist site. Use when adding documentation to components, setting up a component library docs site, or auditing missing documentation.
---

# Vue Component Documentation

Enforces JSDoc-style comments on all reusable Vue 3 components and generates a live style guide with Vue Styleguidist. `vue-docgen-api` powers the extraction; the result is a browsable, searchable documentation site with rendered examples.

Pairs naturally with [[vue-style-guide]], [[vue-ts-style-guide]], and [[vue-project-setup]].

---

## Part 1 — Installation

```bash
npm install --save-dev vue-styleguidist vue-docgen-api
```

Vue Styleguidist uses webpack internally. If the project is Vite-only, install the peer deps it needs:

```bash
npm install --save-dev webpack webpack-dev-server css-loader vue-loader
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "styleguide": "vue-styleguidist server",
    "styleguide:build": "vue-styleguidist build"
  }
}
```

---

## Part 2 — Styleguidist configuration

Create `styleguide.config.js` at the project root:

```js
const path = require('path')

module.exports = {
  components: 'src/components/**/*.vue',
  ignore: [
    '**/index.vue',
    '**/*.spec.vue',
    '**/App.vue',
  ],
  outDir: 'docs/styleguide',
  title: 'Component Library',
  usageMode: 'expand',
  exampleMode: 'expand',
  pagePerSection: true,

  sections: [
    {
      name: 'UI Components',
      components: 'src/components/ui/**/*.vue',
    },
    {
      name: 'Form Components',
      components: 'src/components/form/**/*.vue',
    },
    {
      name: 'Layout',
      components: 'src/components/layout/**/*.vue',
    },
  ],

  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.ts', '.js', '.vue'],
    },
  },
}
```

Rules:
- `components` glob targets only reusable components — exclude pages, App.vue, and spec files.
- `sections` groups components by domain; add a section per feature folder.
- `outDir` puts the built docs in `docs/styleguide` — add this folder to `.gitignore` or include it for GitHub Pages.

---

## Part 3 — JSDoc comment conventions

### 3.1 Component-level comment

Place a JSDoc block directly above `<script setup>` (or inside a `<script>` block before `setup()`). This becomes the component description in the docs.

```vue
<script setup lang="ts">
/**
 * A button that triggers an action. Supports multiple variants and sizes.
 * Use `default` slot for label text or icon + label combinations.
 *
 * @displayName BaseButton
 */

// ... rest of setup
</script>
```

Rules:
- `@displayName` overrides the component name shown in the docs. Use PascalCase.
- Keep the description to 1–3 sentences. Details go in examples.

### 3.2 Props

Document props with a JSDoc comment immediately above each prop definition in `defineProps`. For TypeScript interfaces, annotate every field:

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

  /** Shows a loading spinner and disables interaction. */
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
- Use `@default` when the default differs from a reader's expectation (e.g., not `false` or `undefined`).
- Document union string types inline (e.g., `'primary' | 'secondary'`) — vue-docgen-api renders them as accepted values.

### 3.3 Emits

Document each emit with a `@param` describing what the payload carries:

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

### 3.4 Slots

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
- Describe what it renders and what replaces when it is filled.

### 3.5 Expose

If the component exposes a public API with `defineExpose`, document each member:

```vue
<script setup lang="ts">
/**
 * A text input with built-in validation display.
 * @displayName BaseInput
 */

const inputRef = ref<HTMLInputElement | null>(null)

/** Focuses the underlying input element programmatically. */
function focus() {
  inputRef.value?.focus()
}

/** Clears the current value and resets validation state. */
function reset() {
  inputRef.value!.value = ''
  touched.value = false
}

defineExpose({ focus, reset })
</script>
```

---

## Part 4 — Examples

Vue Styleguidist renders examples from a `.examples.md` or `.vue` file next to the component, or inline in the component file via a `## Usage` JSDoc section.

### 4.1 Inline examples (preferred for simple components)

Create a `ComponentName.examples.md` file in the same directory as the component:

```md
Basic usage:

```vue
<template>
  <BaseButton @click="onClick">Save changes</BaseButton>
</template>

<script setup>
function onClick() {
  alert('Saved!')
}
</script>
```

With variants:

```vue
<template>
  <div style="display: flex; gap: 8px">
    <BaseButton variant="primary">Primary</BaseButton>
    <BaseButton variant="secondary">Secondary</BaseButton>
    <BaseButton variant="ghost">Ghost</BaseButton>
    <BaseButton variant="danger">Danger</BaseButton>
  </div>
</template>
```

Loading state:

```vue
<template>
  <BaseButton :loading="true">Saving…</BaseButton>
</template>
```
```

### 4.2 Referencing examples in the component

Alternatively, point to the examples file from `styleguide.config.js` or use the `@example` tag in the component JSDoc. Most teams prefer the side-car `.examples.md` file because it keeps the `.vue` file small.

---

## Part 5 — Full component example

```vue
<!-- src/components/ui/BaseButton.vue -->
<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
    :type="type"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
/**
 * Primary interactive control. Forwards native button attributes and exposes
 * click/focus events. Use `default` slot for label text.
 *
 * @displayName BaseButton
 *
 * @slot default - Button label or icon + label combination.
 */

export interface BaseButtonProps {
  /** Visual style applied to the button. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'

  /** Size preset controlling padding and font size. */
  size?: 'sm' | 'md' | 'lg'

  /** Prevents click events and applies disabled styling. */
  disabled?: boolean

  /**
   * Replaces the slot with a spinner and blocks interaction.
   * @default false
   */
  loading?: boolean

  /**
   * Native `type` attribute forwarded to the `<button>` element.
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

const emit = defineEmits<{
  /**
   * Fires on click when the button is neither disabled nor loading.
   * @param event - The native MouseEvent.
   */
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
```

---

## Part 6 — Running the documentation

```bash
# Start dev server (live reload)
npm run styleguide

# Build static docs
npm run styleguide:build
```

The dev server runs on `http://localhost:6060` by default. Adjust the port in `styleguide.config.js`:

```js
module.exports = {
  serverPort: 6061,
  // ...
}
```

---

## Part 7 — CI / deployment (optional)

### GitHub Pages

```yaml
# .github/workflows/docs.yml
name: Publish Styleguide

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run styleguide:build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/styleguide
```

---

## Part 8 — Auditing missing documentation

Use this prompt to audit an existing codebase:

> "Scan all `.vue` files under `src/components/`. For every component that is missing a component-level JSDoc comment, a `@displayName` tag, or JSDoc on any prop, emit, or named slot — report it as a table: file path, missing item, suggested fix."

---

## Quick checklist

- [ ] `vue-styleguidist` and `vue-docgen-api` installed as devDependencies
- [ ] `styleguide.config.js` configured with correct `components` glob and `sections`
- [ ] `styleguide` and `styleguide:build` scripts in `package.json`
- [ ] Every reusable component has a component-level JSDoc with `@displayName`
- [ ] Every prop has a single-line JSDoc comment
- [ ] Every emit is annotated with `@param` describing the payload
- [ ] Named slots are documented with `@slot` tags
- [ ] At least one `.examples.md` or inline example per component
- [ ] `docs/styleguide` added to `.gitignore` (or wired into GitHub Pages)
