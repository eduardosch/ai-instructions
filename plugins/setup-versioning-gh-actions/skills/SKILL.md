---
name: setup-versioning
description: One-time setup of automated semantic versioning for a project. Installs a GitHub Actions workflow that runs on every push to main/master, reads the commit history since the last tag, bumps MAJOR/MINOR/PATCH, updates package.json and Kotlin/Android version files, prepends CHANGELOG.md, and creates a release commit + git tag.
disable-model-invocation: true
---

## Setup versioning

This skill is a **one-time setup**. It installs the versioning automation into the current project; it does not cut releases itself. Releases are cut by GitHub Actions on every push to `main`/`master`.

The files installed come from this skill's directory (`${CLAUDE_SKILL_DIR}`, resolved by Claude Code to the plugin's installed path). Nothing in the project depends on the plugin afterwards.

### Steps

Run everything from the **project root**.

1. **Check if it is already set up.** If `.github/workflows/release.yml` or `.github/scripts/release.mjs` already exists, tell the user versioning is already set up and **stop**. Never overwrite existing files.
2. **Check the remote.** Run `git remote get-url origin`. This setup only supports GitHub Actions: if there is no remote or it is not GitHub, tell the user and stop.
3. **Install the files** (create the folders if needed):
   - Copy `${CLAUDE_SKILL_DIR}/release.mjs` to `.github/scripts/release.mjs`
   - Copy `${CLAUDE_SKILL_DIR}/release.yml` to `.github/workflows/release.yml`
4. **Do not** add a `"release"` script to `package.json`, edit the version by hand, or run `release.mjs` locally. Do not commit or push: leave that to the user.
5. **Confirm to the user**: "Versioning is set up. Commit and push the two new files to `main`/`master`; the workflow will cut the first release (`v0.1.0` if there is no tag yet)." Then mention the notes below.

### Notes to give the user

- The workflow needs `contents: write` (already declared in the file). If the organization or repository restricts the default `GITHUB_TOKEN` to read-only, enable **Settings → Actions → General → Workflow permissions → Read and write**.
- If `main` is protected and blocks direct pushes, the default `GITHUB_TOKEN` can't push the release commit. Use a PAT or GitHub App token, or allow the bot to bypass the rule.
- Tags pushed with `GITHUB_TOKEN` don't trigger other workflows. If a deploy workflow runs on `v*` tags, push with a PAT, or deploy from the same workflow.
- The release commit (`🔨 chore: release vX.Y.Z`) is skipped by the workflow, so it doesn't loop.
- Every merge to `main`/`master` cuts a release, including maintenance-only merges (which bump patch).

## Versioning rules

Version numbers follow Semantic Versioning (`MAJOR.MINOR.PATCH`) and are bumped automatically from commit history — never edit the version in `package.json`, `build.gradle.kts` or `gradle.properties` by hand.

### Initial version

- A new repository starts at **`0.1.0`** (initial development: `0.x.y` means the public API may still change).
- The first release is cut by the workflow, which produces `v0.1.0` when no tag exists yet.
- While the major version is `0`, a breaking change (`!`) bumps **minor** instead of major.
- Don't tag the initial commit; tag only when there is something worth releasing.

### Going to 1.0.0

- **`1.0.0`** means the public API is stable and ready for real use. Don't start here, and don't move to it, unless you're actually committing to **backward compatibility**.
- From `1.0.0` onward, any breaking change (`!`) requires a **major** bump (`2.0.0`, `3.0.0`, ...), so think twice before breaking existing behavior, data shapes, or routes.
- Move to `1.0.0` manually, only when the project is stable enough for real users to depend on it: create and push the `v1.0.0` tag yourself and the workflow continues from there.

### Bump rules

- **Major** (`X.0.0`) — any commit since the last tag marked breaking with `!` after the type, e.g. `✨ feat!: redesign salary calculation`. Use this for anything that removes/renames a Firestore field or collection other code depends on, changes the shape of data the app writes, removes an existing feature/route, or needs a manual migration step. (While on `0.x`, this bumps minor instead. Once on `1.0.0` or higher, a major bump is your signal that backward compatibility is broken.)
- **Minor** (`0.X.0`) — at least one `feat:` commit and nothing breaking. New, backward-compatible functionality (a new field, view, report, base component).
- **Patch** (`0.0.X`) — at least one `fix:`, `perf:`, or `security:` commit and nothing above. Bug fixes, performance work, security patches.
- If a release only has `refactor`/`docs`/`style`/`test`/`chore`/`ci`/`build` commits, it still bumps **patch** — every release gets a new version number.

### Version files updated

| File | What is updated |
|---|---|
| `package.json` / `package-lock.json` | `version` |
| `app/build.gradle.kts` / `app/build.gradle` | `versionName` and `versionCode` (`major*10000 + minor*100 + patch`) |
| `gradle.properties` | `VERSION_NAME` or `version` |

Files that don't exist are skipped. The git tag is always the source of truth.
