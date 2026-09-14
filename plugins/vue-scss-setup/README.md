# `vue-scss-setup` Claude Skill

Configures Sass/SCSS in a Vue 3 + Vite project scaffolded with `npm create vue@latest` — installs `sass-embedded`, creates global variable partials (colors, fonts, breakpoints) and mixin partials (px-to-rem, responsive breakpoints, truncate), and wires them into every component automatically via `vite.config.ts` `additionalData`.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install vue-scss-setup@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall vue-scss-setup

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/vue-scss-setup
```
