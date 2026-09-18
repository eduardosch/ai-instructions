---
name: styleguide
description: Runs the Vue Styleguidist dev server or static build in the current project. Requires setup-docgen to have been run first.
---

# Styleguide

Ask the user which operation they want:

- **Serve** — live dev server with hot reload (`pnpm run styleguide`)
- **Build** — generate static docs to `docs/styleguide/` (`pnpm run styleguide:build`)

Run the chosen command with the Bash tool.

After **Serve**: tell the user the server is running at http://localhost:6060.
After **Build**: tell the user the static output is in `docs/styleguide/`.
