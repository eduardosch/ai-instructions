# `testing-conventions` Claude Skill

House style guide for writing tests in Vue 3 + TypeScript projects — covers Vitest unit/component tests and Playwright e2e tests.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the skill:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install testing-conventions@eduardosch-marketplace
```

## Uninstalling

```bash
/plugin uninstall testing-conventions

/plugin marketplace remove eduardosch-marketplace
```

## Usage

```
/testing-conventions
```

Invoke this skill when:
- Starting a new test file (unit, component, or e2e)
- Reviewing or refactoring existing tests
- Deciding where to put a new test or how to name it
- Setting up Vitest or Playwright configuration

## What it covers

**Vitest (unit & component tests)**
- File layout and co-location rules
- `describe` / `it` naming conventions
- Arrange → Act → Assert structure
- Mocking strategy — what to mock and what not to
- Vue Test Utils + `@pinia/testing` patterns
- `vitest.config.ts` reference configuration

**Playwright (e2e tests)**
- File layout under `e2e/`
- Page Object Model structure and naming
- Locator preference order (`getByRole` → `getByLabel` → `getByText` → `getByTestId`)
- Authentication fixture pattern
- `playwright.config.ts` reference configuration
- `data-testid` conventions
