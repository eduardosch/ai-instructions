---
name: rules-vue-scss
description: SCSS coding conventions for Vue 3 + Vite projects — use lang="scss" on all style blocks, rely on globally injected variables and mixins from setup-scss, follow BEM-style naming, no inline styles, and mobile-first responsive design. Use when writing or reviewing <style> blocks in Vue components.
---

# SCSS Conventions

Coding rules for writing SCSS in Vue 3 components. Requires [[setup-scss]] to have been run — the global variables and mixins are pre-injected via `vite.config.ts` and available in every `<style lang="scss">` block without an explicit `@use`.

---

## 1. Always use `<style lang="scss">`

Every component with styles must use `lang="scss"`:

```vue
<!-- ✅ Correct -->
<style lang="scss" scoped>
.my-component { ... }
</style>

<!-- ❌ Wrong — plain CSS loses access to variables and mixins -->
<style scoped>
.my-component { ... }
</style>
```

Use `scoped` by default on component-level styles. Only omit `scoped` for global layout styles in `App.vue` or a dedicated global stylesheet.

---

## 2. Use global variables — no raw values

Global variables are injected automatically — use them instead of raw pixel/color values.

**Colors** (from `src/assets/styles/variables/_colors.scss`):

```scss
// ✅ Use variables
.button { background-color: $color-primary; }

// ❌ Raw hex values
.button { background-color: #3b82f6; }
```

**Typography** (from `src/assets/styles/variables/_fonts.scss`):

```scss
// ✅
.title { font-size: $font-size-xl; font-family: $font-family-base; }

// ❌
.title { font-size: 24px; font-family: 'Inter', sans-serif; }
```

**Breakpoints** (from `src/assets/styles/variables/_breakpoints.scss`):

Use the `respond-to()` mixin rather than the `$breakpoint-*` variables directly — the mixin handles the `min-width` media query for you (see §4).

---

## 3. Use the `rem()` mixin for spacing and sizes

Convert pixel values through `rem()` (defined in `src/assets/styles/mixins/_rem.scss`) instead of writing raw `px`:

```scss
// ✅ Use rem()
.card { padding: rem(16); border-radius: rem(8); }

// ❌ Raw px
.card { padding: 16px; border-radius: 8px; }
```

Exception: `1px` borders and outlines stay in `px` — `rem(1)` rounds unexpectedly at small root sizes.

---

## 4. Responsive design with `respond-to()`

Use the `respond-to()` mixin (from `src/assets/styles/mixins/_responsive.scss`) for all breakpoint queries. Always write mobile-first styles first, then override with larger breakpoints:

```scss
// ✅ Mobile-first
.grid {
  display: grid;
  grid-template-columns: 1fr;

  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}

// ❌ Desktop-first (avoid)
.grid {
  grid-template-columns: repeat(3, 1fr);

  @include respond-to('md', 'down') {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

Pass `'down'` as the second argument only when a `max-width` query is genuinely needed.

---

## 5. Text truncation with `truncate-lines()`

Use the `truncate-lines()` mixin (from `src/assets/styles/mixins/_truncate.scss`) instead of writing `-webkit-line-clamp` by hand:

```scss
// ✅
.description { @include truncate-lines(3); }

// ❌
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

---

## 6. No inline styles

Never use the `style` attribute in templates for anything other than truly dynamic values that cannot be expressed as class toggles:

```vue
<!-- ✅ Dynamic value, acceptable -->
<div :style="{ width: `${progress}%` }"></div>

<!-- ❌ Static value that should be a class -->
<div style="color: red; font-size: 14px;"></div>
```

---

## 7. Naming — BEM-inspired

Use a flat BEM-inspired naming scheme inside scoped components:

```scss
// Block
.user-card { ... }

// Element
.user-card__avatar { ... }
.user-card__name { ... }

// Modifier
.user-card--featured { ... }
.user-card__avatar--large { ... }
```

- Use `kebab-case` for all class names.
- Avoid nesting deeper than 2 levels — prefer sibling selectors over deep nesting.
- State classes (e.g. `.is-active`, `.is-loading`) are acceptable at the root level.

---

## 8. Adding new tokens

If the project needs new global tokens (spacing scale, shadows, z-index, etc.):

1. Add a new partial under `src/assets/styles/variables/` (e.g. `_spacing.scss`).
2. Add `@forward "<name>";` to `src/assets/styles/variables/index.scss`.
3. The new variables become globally available in all components automatically.

Same pattern for new mixins under `src/assets/styles/mixins/`.

---

## Quick checklist

- [ ] All `<style>` blocks use `lang="scss"`
- [ ] Color values use `$color-*` variables, not raw hex
- [ ] Font sizes and spacing use `$font-*` variables or `rem()`, not raw `px`
- [ ] Breakpoint queries use `@include respond-to(...)`, mobile-first
- [ ] Multi-line truncation uses `@include truncate-lines(n)`
- [ ] No static inline `style` attributes
- [ ] Class names follow BEM-inspired `kebab-case` within scoped blocks
