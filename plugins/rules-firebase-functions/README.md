# `rules-firebase-functions` Claude Skill

Coding conventions for Firebase Cloud Functions with TypeScript — function naming, typed callable/HTTP/trigger patterns, error handling with `HttpsError`, structured logging, security validation, and testing conventions.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install rules-firebase-functions@eduardosch-marketplace
```

Automatically installed into new functions projects by `setup-firebase-functions`.

## Usage

```
/rules-firebase-functions
```

Invoke when writing, reviewing, or modifying code in a `*-firebase-functions` project.

## Uninstalling

```bash
/plugin uninstall rules-firebase-functions

/plugin marketplace remove eduardosch-marketplace
```
