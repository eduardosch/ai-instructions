---
name: rules-testing
description: House style guide for Vitest unit tests and Playwright e2e tests — file layout, naming, patterns, and anti-patterns for Vue 3 + TypeScript projects.
---

# Testing Conventions

A house style guide for writing tests in Vue 3 + TypeScript projects. Covers two layers:

- **Unit / component tests** — Vitest + Vue Test Utils
- **End-to-end tests** — Playwright

Pairs naturally with [[vue-ts-style-guide]] and [[api-client-conventions]].

---

## Part 1 — Vitest Unit & Component Tests

### 1.1 File layout

Co-locate test files with the source file they exercise:

```
src/
├── components/
│   ├── UserCard.vue
│   └── UserCard.spec.ts      ← component test
├── composables/
│   ├── useUsers.ts
│   └── useUsers.spec.ts      ← composable test
└── services/
    ├── usersService.ts
    └── usersService.spec.ts  ← service test
```

Rules:
- Test file name mirrors the source file name with a `.spec.ts` suffix.
- Never put tests in a separate `__tests__/` folder — discoverability suffers.
- One source file → one spec file. Do not aggregate unrelated tests.

### 1.2 Describe / it naming

```ts
describe('useUsers', () => {
  it('returns an empty users array on initialisation', () => { ... })
  it('sets isLoading to true while fetching', async () => { ... })
  it('populates users on successful fetch', async () => { ... })
  it('captures the error and sets isLoading to false on failure', async () => { ... })
})
```

Rules:
- `describe` block = the unit under test (function name, component name).
- `it` strings read as full English sentences starting with a verb; they state behaviour, not implementation.
- Never use `test()` — always use `it()` for consistency.
- Nest a second `describe` only for a distinct sub-behaviour (e.g. a second public method).

### 1.3 The AAA pattern

Every test body follows **Arrange → Act → Assert**:

```ts
it('populates users on successful fetch', async () => {
  // Arrange
  const mockUsers = [{ id: '1', name: 'Alice', email: 'a@example.com', role: UserRole.Admin }]
  vi.mocked(listUsers).mockResolvedValueOnce({ data: mockUsers, meta: { total: 1, page: 1, perPage: 10 } })

  // Act
  const { users, fetchUsers } = useUsers()
  await fetchUsers()

  // Assert
  expect(users.value).toEqual(mockUsers)
})
```

- A blank line separates each phase (no comments needed if the three blocks are obvious; add them only when the separation isn't clear).
- One logical assertion group per test — if you need to assert many things, split into separate `it` blocks or use `expect.assertions(n)` to make the count explicit.

### 1.4 Mocking

Only mock at the boundary:

| Boundary | What to mock |
|---|---|
| External API calls | The service function (e.g. `listUsers`) |
| Browser APIs | `window.localStorage`, `window.matchMedia`, etc. |
| Third-party libs | Their public API, not internal implementation details |
| Vue Router / Pinia | Use the real instances (`createRouter`, `createPinia`) — not mocks |

```ts
// ✅ Mock the service, not the http client
vi.mock('@/services/usersService')
vi.mocked(listUsers).mockResolvedValueOnce(...)

// ❌ Never mock the http client itself in a composable test
vi.mock('@/lib/http')
```

Rules:
- Use `vi.mock()` at the module level (top of the file), never inside `beforeEach` or a test body.
- Always prefer `mockResolvedValueOnce` / `mockRejectedValueOnce` over `mockResolvedValue` — `Once` variants prevent state leaking between tests.
- Reset mocks between tests: add `vi.clearAllMocks()` (or set `clearMocks: true` in `vitest.config.ts`).

### 1.5 Component tests with Vue Test Utils

```ts
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UserCard from '@/components/UserCard.vue'

describe('UserCard', () => {
  it('renders the user name', () => {
    const wrapper = mount(UserCard, {
      props: { user: { id: '1', name: 'Alice', email: 'a@example.com', role: UserRole.Viewer } },
      global: {
        plugins: [createTestingPinia()],
      },
    })
    expect(wrapper.text()).toContain('Alice')
  })

  it('emits select when the card is clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { user: { id: '1', name: 'Alice', email: 'a@example.com', role: UserRole.Viewer } },
      global: { plugins: [createTestingPinia()] },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual([{ id: '1', name: 'Alice', email: 'a@example.com', role: UserRole.Viewer }])
  })
})
```

Rules:
- Always use `createTestingPinia()` from `@pinia/testing` — never the real `createPinia()` in component tests.
- Assert on user-visible text and emitted events — not on internal state or implementation details.
- Query elements with `wrapper.find('[data-testid="submit"]')` when CSS selectors are fragile. Add `data-testid` attributes to the Vue template when needed.
- Avoid `wrapper.vm` access; if you need it, rethink whether the test is too implementation-coupled.

### 1.6 Vitest configuration

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'dist', 'e2e'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

### 1.7 Vitest quick checklist

- [ ] Test files co-located with source, named `*.spec.ts`
- [ ] `describe` = unit under test; `it` = behaviour in plain English; always `it()` not `test()`
- [ ] AAA structure with blank lines between phases
- [ ] Mocks declared at module level with `vi.mock()`; `Once` variants used to prevent state leakage
- [ ] `createTestingPinia()` in all component mounts
- [ ] Assertions on visible output, not internal state

---

## Part 2 — Playwright E2E Tests

### 2.1 File layout

E2E tests live under `e2e/` at the project root, **not** inside `src/`:

```
e2e/
├── fixtures/
│   └── auth.ts               ← custom fixture for auth state
├── pages/
│   ├── LoginPage.ts          ← Page Object Models
│   └── UsersPage.ts
└── tests/
    ├── login.spec.ts
    └── users.spec.ts
playwright.config.ts
```

Rules:
- One `*.spec.ts` file per user-facing feature (not per page, not per endpoint).
- Page Object Models (POMs) live in `e2e/pages/` — never inline locators in test files.
- Fixtures (auth, seeded data) live in `e2e/fixtures/`.

### 2.2 Page Object Model

Every page or significant UI section gets a POM class. It owns locators and actions; test files own assertions.

```ts
// e2e/pages/UsersPage.ts
import type { Page, Locator } from '@playwright/test'

export class UsersPage {
  readonly page: Page
  readonly heading: Locator
  readonly userRows: Locator
  readonly addUserButton: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Users' })
    this.userRows = page.getByTestId('user-row')
    this.addUserButton = page.getByRole('button', { name: 'Add user' })
  }

  async goto() {
    await this.page.goto('/users')
  }

  async addUser(name: string, email: string) {
    await this.addUserButton.click()
    await this.page.getByLabel('Name').fill(name)
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByRole('button', { name: 'Save' }).click()
  }
}
```

Rules:
- Constructor only assigns locators — no network calls or `await` inside it.
- `goto()` navigates to the page's canonical URL.
- Methods named after user intent (`addUser`, `deleteUser`, `searchFor`) — not implementation (`clickAddButton`, `fillNameInput`).
- Never assert inside a POM method — return data or leave assertions to the test.

### 2.3 Test structure

```ts
// e2e/tests/users.spec.ts
import { test, expect } from '@playwright/test'
import { UsersPage } from '../pages/UsersPage'

test.describe('Users page', () => {
  test('shows the users list', async ({ page }) => {
    const usersPage = new UsersPage(page)
    await usersPage.goto()
    await expect(usersPage.heading).toBeVisible()
    await expect(usersPage.userRows).toHaveCount(3)
  })

  test('adds a new user', async ({ page }) => {
    const usersPage = new UsersPage(page)
    await usersPage.goto()
    await usersPage.addUser('Bob', 'bob@example.com')
    await expect(page.getByText('Bob')).toBeVisible()
  })
})
```

Rules:
- `test.describe` = feature or page; `test` = user scenario.
- Each test is independent — never rely on state left by a previous test.
- Prefer `getByRole`, `getByLabel`, `getByText`, `getByTestId` in that order of preference. Avoid CSS selectors and XPath.
- Do not add `await page.waitForTimeout(...)` — use built-in auto-waiting (`toBeVisible`, `toHaveCount`, `waitForURL`).

### 2.4 Authentication fixture

Avoid logging in through the UI in every test. Use Playwright's storage-state approach:

```ts
// e2e/fixtures/auth.ts
import { test as base } from '@playwright/test'

export const test = base.extend<{ authenticatedPage: void }>({
  authenticatedPage: [async ({ page }, use) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(process.env.E2E_USER_EMAIL!)
    await page.getByLabel('Password').fill(process.env.E2E_USER_PASSWORD!)
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.waitForURL('/dashboard')
    await use()
  }, { auto: true }],
})

export { expect } from '@playwright/test'
```

```ts
// e2e/tests/users.spec.ts — use the auth fixture
import { test, expect } from '../fixtures/auth'
```

Rules:
- Store `storageState` as a JSON file in `e2e/fixtures/` when your app uses session cookies (run a global setup script once, reuse across tests).
- Never hardcode credentials in test files — use environment variables or `.env.test` (git-ignored).
- E2E env vars are prefixed `E2E_` and documented in `.env.example`.

### 2.5 Playwright configuration

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 2.6 `data-testid` conventions

When ARIA roles and visible text are not enough to target an element reliably, add a `data-testid`:

```vue
<li v-for="user in users" :key="user.id" data-testid="user-row">
  {{ user.name }}
</li>
```

Rules:
- `data-testid` values are kebab-case, singular noun or noun phrase describing the element's role.
- Never use `data-testid` as a primary locator strategy — only add it when `getByRole` / `getByLabel` / `getByText` cannot uniquely identify the element.
- Remove `data-testid` attributes from production builds if bundle size is a concern (`vite-plugin-remove-attr` or an ESLint rule).

### 2.7 Playwright quick checklist

- [ ] One `*.spec.ts` per user-facing feature under `e2e/tests/`
- [ ] Page Object Models in `e2e/pages/`, locators owned by POMs, assertions in tests
- [ ] Tests are fully independent — no shared state between `test` blocks
- [ ] Auth via fixture or `storageState`, never UI login in each test
- [ ] `getByRole` / `getByLabel` / `getByText` before `getByTestId` before CSS selectors
- [ ] No `waitForTimeout` — use auto-waiting assertions
- [ ] Credentials in env vars only, documented in `.env.example`

---

## Quick Reference

| | Vitest (unit) | Playwright (e2e) |
|---|---|---|
| Location | `src/**/*.spec.ts` | `e2e/tests/*.spec.ts` |
| Describe | Function / component name | Feature / page name |
| Test verb | `it('does X', ...)` | `test('user can X', ...)` |
| Assertions | `expect(...).toBe(...)` | `await expect(...).toBeVisible()` |
| Selectors | `wrapper.find('[data-testid]')` | `getByRole` first |
| Mocking | `vi.mock()` at module level | `page.route()` for network |
| Auth | `createTestingPinia()` | Storage state / fixture |
