# `vue-scss-setup` Claude Skill

Configures Sass/SCSS in a Vue 3 + Vite project scaffolded with `npm create vue@latest` — installs `sass-embedded`, creates global variable partials (colors, fonts, breakpoints) and mixin partials (px-to-rem, responsive breakpoints, truncate), and wires them into every component automatically via `vite.config.ts` `additionalData`.

> **One-shot setup skill** — run once when adding SCSS to a project. No persistent installation needed.

## Usage

In your project directory, open Claude Code and run:

```
/vue-scss-setup
```

Claude Code will fetch this skill from the marketplace on demand and execute it without adding it to your permanent settings.

## What it does

1. Installs `sass-embedded` as a dev dependency.

2. Creates global SCSS partials under `src/assets/styles/`:
   - `_variables.scss` — colors, fonts, spacing tokens
   - `_breakpoints.scss` — responsive breakpoint map
   - `_mixins.scss` — `px-to-rem()`, `responsive()`, `truncate()`

3. Updates `vite.config.ts` to inject the global partials into every Vue component via `css.preprocessorOptions.scss.additionalData`.
