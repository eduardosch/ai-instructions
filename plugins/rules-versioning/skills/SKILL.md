---
name: rules-versioning
description: Run automated semantic versioning via release.mjs. Reads commit history since the last tag, bumps MAJOR/MINOR/PATCH, updates package.json and Kotlin/Android version files, prepends CHANGELOG.md, and creates a release commit + git tag.
---

## Versioning

Version numbers follow Semantic Versioning (`MAJOR.MINOR.PATCH`) and are bumped automatically from commit history — never edit the version in `package.json`, `build.gradle.kts` or `gradle.properties` by hand.

### Initial version

- A new repository starts at **`0.1.0`** (initial development: `0.x.y` means the public API may still change).
- The first release is cut with `release.mjs`, which produces `v0.1.0` when no tag exists yet.
- While the major version is `0`, a breaking change (`!`) bumps **minor** instead of major.
- Don't tag the initial commit; tag only when there is something worth releasing.

### Going to 1.0.0

- **`1.0.0`** means the public API is stable and ready for real use. Don't start here, and don't move to it, unless you're actually committing to **backward compatibility**.
- From `1.0.0` onward, any breaking change (`!`) requires a **major** bump (`2.0.0`, `3.0.0`, ...), so think twice before breaking existing behavior, data shapes, or routes.
- Move to `1.0.0` manually, only when the project is stable enough for real users to depend on it: create the `v1.0.0` tag yourself and the script continues from there.

## Installation

No installation is needed. This skill ships as a plugin (enabled in the project's `.claude/settings.json` under `enabledPlugins`), so `release.mjs` lives in the plugin's installed directory, next to this `SKILL.md`, and is **never** copied into the project. Claude Code replaces `${CLAUDE_SKILL_DIR}` with the absolute path of this skill's directory before you read this file, so the script path always resolves, wherever the plugin is installed.

1. Run the script from the **project root**: `node ${CLAUDE_SKILL_DIR}/release.mjs`. All paths (`package.json`, `CHANGELOG.md`, `app/build.gradle.kts`, `gradle.properties`) and git commands are relative to the current working directory, so running it from a subfolder would skip the version files and write `CHANGELOG.md` in the wrong place.
2. Do not add a `"release"` script to the project's `package.json` and do not hardcode the plugin path anywhere: the plugin cache path changes between machines and plugin versions.
3. If the project has neither `package.json` nor Kotlin/Android files, the skill still works, but the version is stored only in git tags and `CHANGELOG.md`.
4. Execute the release script every time a push is made to `main` or `master` to cut a new release.

## Version files updated

| File | What is updated |
|---|---|
| `package.json` / `package-lock.json` | `version` |
| `app/build.gradle.kts` / `app/build.gradle` | `versionName` and `versionCode` (`major*10000 + minor*100 + patch`) |
| `gradle.properties` | `VERSION_NAME` or `version` |

Files that don't exist are skipped. The git tag is always the source of truth.

## Usage

- To cut a release: from the project root, run `node ${CLAUDE_SKILL_DIR}/release.mjs`. It reads every commit since the last `vX.Y.Z` git tag, decides the bump, updates the version files above, prepends a `CHANGELOG.md` entry, and creates a release commit + annotated git tag. Then `git push && git push --tags` and deploy as usual.
- The script has no dependencies beyond Node built-ins (plus `pnpm` when a `package.json` exists), so it works from any location.
- Anyone with the plugin enabled can cut a release. CI does not have the plugin, so if releases are cut there, install the plugin in the pipeline or copy `release.mjs` into the project.
- The script only runs on `main` or `master` — it checks the current branch and refuses to run anywhere else, so feature branches never get a version bump before their changes are merged.

## Bump Rules

- **Major** (`X.0.0`) — any commit since the last tag marked breaking with `!` after the type, e.g. `✨ feat!: redesign salary calculation`. Use this for anything that removes/renames a Firestore field or collection other code depends on, changes the shape of data the app writes, removes an existing feature/route, or needs a manual migration step. (While on `0.x`, this bumps minor instead. Once on `1.0.0` or higher, a major bump is your signal that backward compatibility is broken.)
- **Minor** (`0.X.0`) — at least one `feat:` commit and nothing breaking. New, backward-compatible functionality (a new field, view, report, base component).
- **Patch** (`0.0.X`) — at least one `fix:`, `perf:`, or `security:` commit and nothing above. Bug fixes, performance work, security patches.
- If a release only has `refactor`/`docs`/`style`/`test`/`chore`/`ci`/`build` commits, it still bumps **patch** — every release gets a new version number.