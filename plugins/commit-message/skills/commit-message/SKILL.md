---
name: commit-message
description: Generates semantic git commit messages based on staged changes following conventional commits format.
---

# Git Commit Message

## Instructions

When this skill is invoked, follow these steps:

1. **Check for staged changes**: Run `git status`
   - If output contains `nothing to commit, working tree clean`: inform the user there are no changes and stop.
   - If output contains `Changes not staged for commit`: ask the user whether to stage all changes before proceeding. Upon confirmation run `git add -A`.
2. **Inspect the diff**: Run `git diff --cached` to understand what changed — which files, what functionality, and the purpose of the changes.
3. **Check current branch**: Run `git branch --show-current`
   - If on `main`, `master`, `dev`, or `development`: warn the user and suggest a branch name in the format `<type>/<short-description>`. Ask whether to create and switch to it via `git switch -c <branch-name>`. If the user declines, continue on the current branch.
4. **Check for emoji request**: Look for keywords like "emoji", "gitmoji", or "with emoji" in the user's original message.
   - Default: generate the commit message **without** emoji.
   - If explicitly requested: prefix the type with the appropriate emoji from the table below.
5. **Generate the commit message** following the format and rules in the sections below.
6. **Present for approval**: Show the commit message and ask "Would you like me to create this commit?" Do not run `git commit` without confirmation.
7. **After committing**: Ask "Would you like me to push this to the remote?" Do not push without confirmation.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

- `type`: nature of the change (see table below)
- `scope`: optional, the area of the codebase affected (e.g. `auth`, `api`, `ui`)
- `subject`: short imperative description, lowercase, under 50 characters
- `body`: optional, explains the *why* and *what* in more detail; wrap at 72 characters; use bullet points for multiple items
- `footer`: optional, references issues (`Closes #123`) or breaking changes (`BREAKING CHANGE: ...`)

### Commit Types

| Type       | When to use                                      | Emoji |
| ---------- | ------------------------------------------------ | ----- |
| `feat`     | New feature                                      | ✨    |
| `fix`      | Bug fix                                          | 🐛    |
| `docs`     | Documentation only                               | 📚    |
| `style`    | Formatting, whitespace — no logic change         | 💄    |
| `refactor` | Code change that is neither a fix nor a feature  | ♻️    |
| `perf`     | Performance improvement                          | ⚡    |
| `test`     | Adding or updating tests                         | ✅    |
| `chore`    | Build process, tooling, dependencies             | 🔨    |
| `ci`       | CI/CD configuration                              | 👷    |
| `build`    | Build system changes                             | 📦    |
| `revert`   | Reverts a previous commit                        | ⏮️    |
| `security` | Security fix                                     | 🔒    |

### Branch Naming (when suggesting a new branch)

Format: `<type>/<short-description>` (3–4 words max, hyphen-separated)

Examples: `feature/add-user-auth`, `fix/null-response-handling`, `docs/update-install-guide`

## Rules

- Subject line must be **lowercase** and **imperative mood** ("add feature", not "added feature")
- Keep the subject line under **50 characters**
- Separate subject from body with a blank line
- Use bullet points in the body for multiple changes
- Do **not** add `Co-Authored-By` or any AI attribution trailers
- Do **not** run `git commit` or `git push` without explicit user approval

## Examples

**Without emoji:**
```
feat(auth): add two-factor authentication

- Implements TOTP-based 2FA for enhanced security
- Users can enable 2FA from account settings

Closes #42
```

**With emoji:**
```
✨ feat(auth): add two-factor authentication

- Implements TOTP-based 2FA for enhanced security
- Users can enable 2FA from account settings

Closes #42
```
