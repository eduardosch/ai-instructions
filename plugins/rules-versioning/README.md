# `versioning` Claude Skill

Automated semantic versioning — reads commit history since the last git tag, decides the correct MAJOR/MINOR/PATCH bump, updates `CHANGELOG.md` (and `package.json` when present), and creates a release commit + annotated git tag.

## Requirements

Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format. Use the [`commit-message`](../commit-message) skill to enforce this automatically.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install versioning@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall versioning

/plugin marketplace remove eduardosch-marketplace
```

## Usage

Invoke the skill to set up versioning in a project for the first time:

```
/versioning
```

It will copy `release.mjs` into the project root and wire up the npm script if a `package.json` exists. To cut a release afterwards:

```bash
node release.mjs
# or, if package.json has a "release" script:
npm run release
```

Then push:

```bash
git push && git push --tags
```

## Bump rules

| Bump | Trigger |
|------|---------|
| **Major** `X.0.0` | Any commit with `!` after the type, e.g. `feat!: …` |
| **Minor** `0.X.0` | At least one `feat:` commit, nothing breaking |
| **Patch** `0.0.X` | At least one `fix:`, `perf:`, or `security:` commit |
| **Patch** `0.0.X` | Only `refactor`/`docs`/`style`/`test`/`chore`/`ci`/`build` commits |
