---
name: setup-scss
description: Configures Sass/SCSS in a Vue 3 + Vite project — installs sass-embedded, creates global variable partials (colors, fonts, breakpoints) and mixin partials (px-to-rem, responsive breakpoints, single-line truncate, multi-line truncate), and wires them into every component automatically via vite.config.ts additionalData. Trigger whenever the user asks to add Sass/SCSS to a Vue project, set up global SCSS variables/mixins, or scaffold styling for a create-vue project.
---

# Vue + SCSS setup

Sets up global, zero-import Sass variables and mixins for a Vue 3 + Vite
project. After this runs, every `<style lang="scss">` block in the project
can use `$color-primary`, `@include respond-to('md') { ... }`,
`@include truncate-lines(2)`, etc. without an explicit `@use` in each file.

## When to use this

- Right after `pnpm create vue@latest` scaffolds a new project.
- Any time the user asks to "add Sass", "set up global SCSS variables and
  mixins", or similar, in a Vue + Vite project.

## Steps

### 1. Install Sass

```bash
pnpm add -D sass-embedded
```

Always use `sass-embedded`, not the plain `sass` package — it's the modern,
faster Dart Sass implementation and avoids the legacy-JS-API deprecation
warning under Vite.

### 2. Copy the style partials

Copy the `assets/styles/` folder from this skill into the target project at
`src/assets/styles/`, preserving structure:

```
src/assets/styles/
├── variables/
│   ├── _colors.scss
│   ├── _fonts.scss
│   ├── _breakpoints.scss
│   └── index.scss
└── mixins/
    ├── _rem.scss
    ├── _responsive.scss
    ├── _truncate.scss
    └── index.scss
```

Each folder's `index.scss` uses `@forward` so the whole folder can be
imported with one `@use` statement. Do not flatten these into a single file
— keep variables and mixins split by concern (colors / fonts / breakpoints,
rem / responsive / truncate) so each token group stays easy to find and
diff in review.

If the user asks for additional token groups later (spacing scale, shadows,
z-index, radii, etc.), add a new partial under `variables/` and add a
matching `@forward "<name>";` line to `variables/index.scss` — same pattern
for new mixins under `mixins/`.

### 3. Wire the partials into every component

Edit (or create) `vite.config.ts` and add `css.preprocessorOptions.scss`:

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/variables" as *;
          @use "@/assets/styles/mixins" as *;
        `,
      },
    },
  },
})
```

- `additionalData` is prepended to every SCSS-compiled block in the project
  (including `<style lang="scss">` in `.vue` files), so the `@use ... as *`
  only needs to be written once, here.
- If the project's `vite.config.ts` does not already have the `@` alias
  resolving to `src`, add the `resolve.alias` block above (create-vue adds
  this by default when TypeScript is selected — check before duplicating).

### 4. Verify

Confirm the project actually uses the tokens by checking or updating one
component's `<style>` block, e.g.:

```vue
<style lang="scss">
.example {
  color: $color-primary;
  font-size: $font-size-lg;
  @include truncate-lines(2);

  @include respond-to('md') {
    font-size: $font-size-xl;
  }
}
</style>
```

Run `pnpm run dev` and confirm there are no Sass compile errors before
considering the task done.

## Notes

- `rem()` (in `mixins/_rem.scss`) assumes a 16px root font-size
  (`$base-font-size`). If the project's `html { font-size }` differs,
  update `$base-font-size` there — everything using `rem()` picks it up
  automatically.
- `respond-to()` is mobile-first by default (`min-width`); pass `'down'` as
  the second argument for a `max-width` query.
- `truncate-lines()` relies on `-webkit-line-clamp`, which is supported in
  all current evergreen browsers; no vendor-prefixed fallback is included
  since none is needed today.
