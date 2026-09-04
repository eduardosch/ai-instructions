# Vue Project Setup

Instructions for scaffolding a new Vue project.

## 1. Create the project

Run:

```
npm create vue@latest -- .
```

## 2. Ask for the project name

Prompt the user for the project name before continuing.

## 3. Select these options

```
✔ Project name: … name of the project that the user chose before
✔ Add TypeScript? … Yes
✔ Add JSX Support? … Yes
✔ Add Vue Router for Single Page Application development? … Yes
✔ Add Pinia for state management? … Yes
✔ Add Vitest for Unit testing? … No
✔ Add an End-to-End Testing Solution? … Playwright
✔ Add ESLint for code quality? … Yes
✔ Add Prettier for code formatting? … Yes
✔ Add Vue DevTools … Yes
```

## 4. Install additional plugins

Install, without asking for confirmation:

- Commit-message plugin, to create semantic commits
- Versioning plugin, to keep control of the app version and automatically generate a `CHANGELOG.md`
- `vue-style-guide`
- `vue-ts-style-guide`
- `pinia-style-guide`

## 5. Show a summary

Once everything is finished, show the user a bullet list with emojis and short descriptions of what was done, e.g.:

- ⚡ **Vue project created** — scaffolded with TypeScript, JSX, Router, and Pinia
- 🧪 **Playwright** — end-to-end testing solution added
- 🧹 **ESLint + Prettier** — code quality and formatting configured
- 🛠️ **Vue DevTools** — enabled for debugging
- 📝 **Commit-message plugin** — semantic commit messages enabled
- 🔖 **Versioning plugin** — automatic app versioning and `CHANGELOG.md` generation
- 🎨 **vue-style-guide** — Vue style guide rules installed
- 📘 **vue-ts-style-guide** — TypeScript style guide rules installed
- 🍍 **pinia-style-guide** — Pinia store conventions installed