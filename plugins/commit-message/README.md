# `commit-message` Claude Skill

Generates semantic git commit messages based on your staged changes following the conventional commits format.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install commit-message@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall commit-message

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/commit-message
```

```
/versioning
```

## Notes

The `/versioning` skill requires commits to follow the [Conventional Commits](https://www.conventionalcommits.org/) format to correctly classify bump levels. The `/commit-message` skill (included in this plugin) enforces that format automatically — install and use it to ensure every commit is release-ready.
