# `setup-versioning` Claude Skill

One-time setup of automated semantic versioning via GitHub Actions. Installs a workflow that runs on every push to `main`/`master` — reads commit history since the last tag, decides the correct MAJOR/MINOR/PATCH bump, updates `CHANGELOG.md` (and `package.json` / Kotlin version files when present), and creates a release commit + annotated git tag.

## Requirements

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format. Use the [`rules-commit`](../rules-commit) skill to enforce this automatically.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install setup-versioning-gh-actions@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall setup-versioning-gh-actions

/plugin marketplace remove eduardosch-marketplace
```

## Usage

Invoke the skill once to set up versioning in a project:

```
/setup-versioning
```

It will copy `release.mjs` to `.github/scripts/release.mjs` and `release.yml` to `.github/workflows/release.yml`. Commit and push both files — the workflow cuts a release on every subsequent push to `main`/`master`.

## Bump rules

| Bump | Trigger |
|------|---------|
| **Major** `X.0.0` | Any commit with `!` after the type, e.g. `feat!: …` |
| **Minor** `0.X.0` | At least one `feat:` commit, nothing breaking |
| **Patch** `0.0.X` | At least one `fix:`, `perf:`, or `security:` commit |
| **Patch** `0.0.X` | Only `refactor`/`docs`/`style`/`test`/`chore`/`ci`/`build` commits |
