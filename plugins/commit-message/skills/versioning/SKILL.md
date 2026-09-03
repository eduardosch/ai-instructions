---
name: versioning
description: Set up and run automated semantic versioning via release.mjs. Reads commit history since the last tag, bumps MAJOR/MINOR/PATCH, updates package.json, prepends CHANGELOG.md, and creates a release commit + git tag.
---

## Versioning

Version numbers follow Semantic Versioning (`MAJOR.MINOR.PATCH`) and are bumped automatically from commit history — never edit `version` in `package.json` by hand.

## Installation

When this skill is invoked for the first time in a project (i.e. `release.mjs` does not exist yet), install it:

1. Copy the `release.mjs` file from the skill directory into the project root.
2. Open `package.json` and add `"release": "node release.mjs"` to the `"scripts"` section. Create `package.json` with `npm init -y` first if it does not exist.
3. Confirm to the user: "Versioning is set up. Run `npm run release` on `master` to cut a release."

## Usage

- To cut a release: `npm run release`. It reads every commit since the last `vX.Y.Z` tag, decides the bump, updates `package.json`/`package-lock.json`, prepends a `CHANGELOG.md` entry, and creates a release commit + git tag. Then `git push && git push --tags` and deploy as usual.
- `npm run release` only runs on `master` — it checks the current branch and refuses to run anywhere else, so feature branches never get a version bump before their changes are merged.

## Bump Rules

- **Major** (`X.0.0`) — any commit since the last tag marked breaking with `!` after the type, e.g. `✨ feat!: redesign salary calculation`. Use this for anything that removes/renames a Firestore field or collection other code depends on, changes the shape of data the app writes, removes an existing feature/route, or needs a manual migration step.
- **Minor** (`0.X.0`) — at least one `feat:` commit and nothing breaking. New, backward-compatible functionality (a new field, view, report, base component).
- **Patch** (`0.0.X`) — at least one `fix:`, `perf:`, or `security:` commit and nothing above. Bug fixes, performance work, security patches.
- If a release only has `refactor`/`docs`/`style`/`test`/`chore`/`ci`/`build` commits, it still bumps **patch** — every release gets a new version number.