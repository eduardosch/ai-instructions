# `element-plus-setup` Claude Skill

Installs and configures Element Plus in a Vue 3 + Vite project. Sets up auto-import, optionally enables dark mode, aligns theming with existing SCSS variables or Element Plus defaults, and scaffolds an optional starter app structure with authentication pages and a chosen navigation layout.

> **One-shot setup skill** — run once when adding Element Plus to a project. No persistent installation needed.

## Usage

In your project directory, open Claude Code and run:

```
/element-plus-setup
```

Claude Code will fetch this skill from the marketplace on demand and execute it without adding it to your permanent settings.

## What it does

1. Installs `element-plus`, `unplugin-vue-components`, and `unplugin-auto-import`.

2. Wires auto-import resolvers into `vite.config.ts` so Element Plus components and composables are resolved on demand — no manual imports needed.

3. Asks whether you want **dark mode** support:
   - Installs `@vueuse/core`, imports Element Plus dark CSS variables
   - Adds a moon/sun toggle button to the app header using `useDark()` + `useToggle()`

4. Checks for an existing global variable file and asks how to handle theming:
   - **Use your variables** — creates `src/assets/styles/element/index.scss` that overrides Element Plus design tokens with your project's colors and fonts
   - **Use Element Plus defaults** — updates your variable file to align with Element Plus default values

5. Asks whether you want **`@element-plus/icons-vue`** installed and globally registered.

6. Reads `package.json` `name` to derive the brand label for the app header.

7. Asks which **App components** to scaffold under `src/components/` (interactive checklist):
   AppButton, AppInput, AppSelect, AppDialog, AppDrawer, AppTable, AppPagination, AppCard, AppTag, AppAlert, AppEmpty, AppSkeleton, AppUpload, AppFormItem

8. Asks whether you want a **basic app structure**:
   - **Authentication pages** — Login, Register, Forgot Password, Password Sent, Password Reset under `src/views/auth/`, wired into the router
   - **Navigation layout** — choose one of four patterns:
     - **Level 1** — top bar + sidebar + main content
     - **Level 2** — top bar + sidebar with category groups + main content
     - **Level 3** — top bar + two-column sidebar (first-level left, second-level middle) + main content
     - **Top navigation** — top bar with inline nav links + main content (no sidebar)

## License

MIT
