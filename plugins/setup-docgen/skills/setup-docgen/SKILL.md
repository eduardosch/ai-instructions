---
name: setup-docgen
description: Installs vue-styleguidist and vue-docgen-api, creates styleguide.config.js, adds styleguide/styleguide:build npm scripts, and optionally configures GitHub Pages CI. Run once per project. For JSDoc comment conventions use rules-documentation.
oneshot: true
---

# Docgen Setup

Installs **Vue Styleguidist** + **vue-docgen-api** and wires up the live component documentation site.

Pairs naturally with [[setup-vue-project]] and [[rules-documentation]] (JSDoc conventions and auditing rules).

---

## Part 1 — Installation

```bash
pnpm add -D vue-styleguidist vue-docgen-api
```

Vue Styleguidist uses webpack internally. If the project is Vite-only, install the peer deps it needs:

```bash
pnpm add -D webpack webpack-dev-server css-loader style-loader vue-loader ts-loader
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "styleguide": "vue-styleguidist server --config styleguide.config.cjs",
    "styleguide:build": "vue-styleguidist build --config styleguide.config.cjs"
  }
}
```

---

## Part 2 — Styleguidist configuration

Create `styleguide.config.cjs` at the project root (`.cjs` extension is required when `package.json` contains `"type": "module"` — Vue Styleguidist uses CommonJS `require()` internally):

```js
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path')

module.exports = {
  components: 'src/components/**/*.vue',
  ignore: [
    '**/index.vue',
    '**/*.spec.vue',
    '**/The*.vue',
  ],
  styleguideDir: 'docs/styleguide',
  title: 'Component Library',
  usageMode: 'expand',
  exampleMode: 'expand',

  webpackConfig: {
    module: {
      rules: [
        { test: /\.vue$/, loader: 'vue-loader' },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] },
          exclude: /node_modules/,
        },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
      extensions: ['.ts', '.js', '.vue'],
    },
  },
}
```

Rules:
- `/* eslint-disable @typescript-eslint/no-require-imports */` at the top suppresses the TypeScript ESLint rule that flags `require()` — the `.cjs` extension opts into CommonJS but ESLint still applies the rule.
- `components` glob targets only reusable components — `The*.vue` layout shells and spec files are excluded; layout components (`TheHeader`, `TheFooter`) are not individually documented.
- Do NOT add a `sections` block until you have subdirectories under `src/components/`; when `sections` is defined, Styleguidist ignores the top-level `components` glob and only looks inside each section's own glob — an empty match produces "no components found".
- `styleguideDir` puts the built docs in `docs/styleguide` — add this folder to `.gitignore` or include it for GitHub Pages.
- To add sections later (e.g. after creating `src/components/ui/`, `src/components/form/`), add a `sections` array with per-subdirectory globs and set `pagePerSection: true`.

---

## Part 3 — Running the documentation

```bash
# Start dev server (live reload)
pnpm run styleguide

# Build static docs
pnpm run styleguide:build
```

The dev server runs on `http://localhost:6060` by default. Adjust the port in `styleguide.config.js`:

```js
module.exports = {
  serverPort: 6061,
  // ...
}
```

---

## Part 4 — CI / deployment (optional)

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
      - run: pnpm install --frozen-lockfile
      - run: pnpm run styleguide:build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/styleguide
```

---

## Quick checklist

- [ ] `vue-styleguidist` and `vue-docgen-api` installed as devDependencies
- [ ] webpack peer deps installed
- [ ] `styleguide.config.cjs` created with correct `components` glob and `eslint-disable` header
- [ ] `styleguide` and `styleguide:build` scripts in `package.json` (with `--config styleguide.config.cjs`)
- [ ] `docs/styleguide` added to `.gitignore`
