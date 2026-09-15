---
name: element-plus-setup
description: Installs and configures Element Plus in a Vue 3 + Vite project — sets up auto-import, asks about dark mode (via VueUse useDark with moon/sun toggle), aligns theming with existing SCSS variables or Element Plus defaults, optionally installs the icons package, and scaffolds an optional app structure with authentication pages and a chosen navigation layout using the project folder name as the brand. Use when adding Element Plus to any Vue 3 project.
---

# Element Plus Setup

Installs and wires Element Plus into a Vue 3 + Vite project with auto-import, optional dark mode, custom theming, optional icons, and an optional starter app structure.

Pairs naturally with [[vue-project-setup]] (project scaffolding) and [[vue-scss-setup]] (global SCSS variables).

---

## Step 1 — Install packages

```bash
npm install element-plus --save
npm install -D unplugin-vue-components unplugin-auto-import
```

- **element-plus** — the UI component library
- **unplugin-vue-components** — auto-imports Element Plus components on demand
- **unplugin-auto-import** — auto-imports composables (`ElMessage`, `ElNotification`, etc.)

---

## Step 2 — Wire auto-import into vite.config.ts

Update `vite.config.ts` to register both plugins. Preserve any existing plugin config and add the two new entries:

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

If the project already has a `vite.config.ts`, read it first and **merge** — do not overwrite the existing config. Add the two import lines at the top and the two resolver entries inside the existing `plugins` array.

---

## Step 3 — Ask about dark mode

Ask the user:

> Do you want to enable dark mode support?
> - **Yes** — I want a dark/light mode toggle (moon/sun button in the header)
> - **No** — light mode only

### If dark mode is enabled

Dark mode is powered by VueUse's `useDark()`, which handles the `class="dark"` toggle and persists the preference to `localStorage` automatically. A moon/sun icon button will appear on the right side of the header.

1. Install VueUse:

```bash
npm install @vueuse/core
```

2. In `src/main.ts`, import the Element Plus dark mode CSS variables so the dark theme tokens load:

```ts
import 'element-plus/theme-chalk/dark/css-vars.css'
```

The `useDark()` composable from VueUse will be used directly in the header component — no separate composable file is needed.

---

## Step 4 — Theming

Check whether the project has a global CSS/SCSS variable file (common paths: `src/assets/styles/variables/_colors.scss`, `src/assets/styles/variables.scss`, `src/styles/variables.scss`, or a CSS custom properties file like `src/assets/styles/variables.css`).

If a variable file **exists**, ask the user:

> I found an existing variable file at `<path>`. How would you like to handle theming?
>
> **A) Use my variables** — override Element Plus tokens with my project's colors/fonts/radii  
> **B) Use Element Plus defaults** — update my variable file to align with Element Plus default values

### Option A — Custom theme based on user's variables

Read the user's variable file. Extract relevant values (primary color, success/warning/danger/info colors, border radius, font family, etc.).

Create `src/assets/styles/element/index.scss` (create the folder if it does not exist):

```scss
// Override Element Plus design tokens with project variables.
// Full token list: https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/common/var.scss

@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': $color-primary,
    ),
    'success': (
      'base': $color-success,
    ),
    'warning': (
      'base': $color-warning,
    ),
    'danger': (
      'base': $color-danger,
    ),
    'info': (
      'base': $color-info,
    ),
  )
);
```

Map the user's variable names to the corresponding Element Plus tokens. Only override what actually exists in the user's variable file — do not invent values.

Install the SCSS dependency for Element Plus theming:

```bash
npm install -D sass
```

Update `vite.config.ts` to point the resolvers at the custom theme file:

```ts
Components({
  resolvers: [
    ElementPlusResolver({
      importStyle: 'sass',
    }),
  ],
}),
AutoImport({
  resolvers: [
    ElementPlusResolver({
      importStyle: 'sass',
    }),
  ],
}),
```

Add `css.preprocessorOptions.scss.additionalData` to prepend the custom var file before every component's SCSS:

```ts
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
    },
  },
},
```

If the project already has an `additionalData` entry (from `vue-scss-setup`), append the Element Plus line — do not replace the existing one.

### Option B — Update user variables with Element Plus defaults

Read the user's variable file. Add or update it with the standard Element Plus color names as comments and equivalent values, so the project vocabulary aligns with what Element Plus uses:

```scss
// Primary — Element Plus default: #409EFF
$color-primary: #409eff;

// Semantic palette
$color-success: #67c23a;
$color-warning: #e6a23c;
$color-danger:  #f56c6c;
$color-info:    #909399;
```

Preserve any variables that already exist; only add the ones that are missing.

### No variable file found

If no variable file exists, skip theming and proceed. Element Plus default tokens apply automatically with no extra config.

---

## Step 5 — Ask about Element Plus icons

Ask the user:

> Do you want to install the Element Plus icons package (`@element-plus/icons-vue`)?
> - **Yes** — install and register all icons globally
> - **No** — skip icons

### If icons are requested

```bash
npm install @element-plus/icons-vue
```

Register all icons globally in `src/main.ts` so they can be used anywhere without explicit imports:

```ts
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
```

If `src/main.ts` already exists, add only the icon registration loop — preserve any existing imports and `app.mount()` call.

---

## Step 6 — Read the project name

Before scaffolding any layout, read the project name to use as the brand label in the header and sidebar.

1. Read `package.json` and get the `name` field.
2. Convert it to title case for display (e.g., `my-app` → `My App`, `acme-dashboard` → `Acme Dashboard`).
3. Use this value wherever "My App" appears in the templates below.

If `package.json` is missing or has no `name`, fall back to the current directory name (last segment of the working path), title-cased.

---

## Step 7 — Ask about app structure

Ask the user:

> Do you want me to scaffold a basic app structure using Element Plus layouts?
> - **Yes** — give me pages, navigation, and an optional login flow
> - **No** — just the library setup, I'll build the pages myself

### If yes — ask about authentication

Ask the user:

> Do you want authentication pages?
> - **Yes** — create login, register, forgot password, and password-reset pages
> - **No** — skip auth pages

#### Auth pages (if requested)

Create the following pages under `src/views/auth/`:

**`LoginPage.vue`**

```vue
<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <h2>Sign in</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" type="email" placeholder="you@example.com" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" native-type="submit" @click="submit" style="width: 100%">
          Sign in
        </el-button>
      </el-form>
      <div class="auth-links">
        <router-link to="/auth/forgot-password">Forgot password?</router-link>
        <router-link to="/auth/register">Create account</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({ email: '', password: '' })
const rules: FormRules = {
  email: [{ required: true, type: 'email', message: 'Enter a valid email', trigger: 'blur' }],
  password: [{ required: true, min: 6, message: 'At least 6 characters', trigger: 'blur' }],
}

async function submit() {
  await formRef.value?.validate()
  // TODO: call your auth service here
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-card {
  width: 400px;
  max-width: 100%;
}
.auth-links {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
</style>
```

**`RegisterPage.vue`** — same structure as LoginPage but with a `name` field and `confirm password` field.

**`ForgotPasswordPage.vue`** — single email field with a "Send reset link" button.

**`PasswordSentPage.vue`** — confirmation card: "Check your inbox — we sent a reset link to `<email>`."

**`PasswordResetPage.vue`** — `new password` + `confirm password` fields; reads a token from `route.query.token`.

Add auth routes to `src/router/index.ts`:

```ts
{
  path: '/auth',
  children: [
    { path: 'login',            component: () => import('@/views/auth/LoginPage.vue') },
    { path: 'register',         component: () => import('@/views/auth/RegisterPage.vue') },
    { path: 'forgot-password',  component: () => import('@/views/auth/ForgotPasswordPage.vue') },
    { path: 'password-sent',    component: () => import('@/views/auth/PasswordSentPage.vue') },
    { path: 'password-reset',   component: () => import('@/views/auth/PasswordResetPage.vue') },
    { path: '',                 redirect: '/auth/login' },
  ],
},
```

---

### Ask about the app layout

Ask the user:

> Which navigation layout do you want?
>
> **1) Level 1** — top bar + sidebar + main content  
> **2) Level 2** — top bar + sidebar with category groups + main content  
> **3) Level 3** — top bar + two-column sidebar (first-level left, second-level middle) + main content  
> **4) Top navigation** — top bar with inline nav links + main content (no sidebar)

#### AppHeader component

All layouts that have a top bar use a shared `src/components/AppHeader.vue`. Create it first, then reference it from the layout files below.

Replace `PROJECT_NAME` with the title-cased project name resolved in Step 6.

**With dark mode enabled:**

```vue
<template>
  <div class="app-header">
    <span class="app-header__brand">PROJECT_NAME</span>
    <div class="app-header__right">
      <el-button :icon="isDark ? Sunny : Moon" circle text @click="toggleDark" />
      <el-avatar :icon="UserFilled" size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny, UserFilled } from '@element-plus/icons-vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped>
.app-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.app-header__brand { font-weight: 600; font-size: 18px; }
.app-header__right { display: flex; align-items: center; gap: 12px; }
</style>
```

**Without dark mode:**

```vue
<template>
  <div class="app-header">
    <span class="app-header__brand">PROJECT_NAME</span>
    <div class="app-header__right">
      <el-avatar :icon="UserFilled" size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.app-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.app-header__brand { font-weight: 600; font-size: 18px; }
.app-header__right { display: flex; align-items: center; gap: 12px; }
</style>
```

The `Moon`, `Sunny`, and `UserFilled` icon imports are always explicit here even when icons are registered globally, to keep the component self-contained and avoid ambiguity.

If icons were **not** installed (Step 5 declined), replace `el-button :icon="..."` with a plain text or emoji button:

```vue
<el-button circle text @click="toggleDark">{{ isDark ? '☀️' : '🌙' }}</el-button>
```

---

#### Layout 1 — Top bar + sidebar + body

Create `src/layouts/DefaultLayout.vue`:

```vue
<template>
  <el-container class="layout-root">
    <el-header class="layout-header">
      <AppHeader />
    </el-header>
    <el-container>
      <el-aside width="220px" class="layout-aside">
        <el-menu router :default-active="$route.path">
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>Home</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { House, Setting } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
.layout-root { height: 100vh; }
.layout-header { border-bottom: 1px solid var(--el-border-color); display: flex; align-items: center; }
.layout-aside { border-right: 1px solid var(--el-border-color); overflow-y: auto; }
</style>
```

If icons were not installed, remove the `el-icon` wrappers and use plain text labels only.

#### Layout 2 — Top bar + sidebar with category groups + body

Same structure as Layout 1 but the sidebar uses `el-menu-item-group` to group items:

```vue
<el-menu router :default-active="$route.path">
  <el-menu-item-group title="Main">
    <el-menu-item index="/dashboard">Dashboard</el-menu-item>
    <el-menu-item index="/reports">Reports</el-menu-item>
  </el-menu-item-group>
  <el-menu-item-group title="Admin">
    <el-menu-item index="/users">Users</el-menu-item>
    <el-menu-item index="/settings">Settings</el-menu-item>
  </el-menu-item-group>
</el-menu>
```

#### Layout 3 — Top bar + two-level sidebar + body

The left panel (64px wide) shows icon-only first-level navigation. The middle column (180px) shows text second-level items for the active section:

```vue
<template>
  <el-container class="layout-root">
    <el-header class="layout-header"><AppHeader /></el-header>
    <el-container>
      <!-- Primary nav (icon only) -->
      <el-aside width="64px" class="layout-primary-nav">
        <el-menu :default-active="activeSection" @select="setSection">
          <el-menu-item index="dashboard" title="Dashboard">
            <el-icon><House /></el-icon>
          </el-menu-item>
          <el-menu-item index="settings" title="Settings">
            <el-icon><Setting /></el-icon>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- Secondary nav -->
      <el-aside width="180px" class="layout-secondary-nav">
        <el-menu router :default-active="$route.path">
          <template v-if="activeSection === 'dashboard'">
            <el-menu-item index="/dashboard/overview">Overview</el-menu-item>
            <el-menu-item index="/dashboard/analytics">Analytics</el-menu-item>
          </template>
          <template v-if="activeSection === 'settings'">
            <el-menu-item index="/settings/profile">Profile</el-menu-item>
            <el-menu-item index="/settings/security">Security</el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { House, Setting } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'

const activeSection = ref('dashboard')
function setSection(key: string) { activeSection.value = key }
</script>

<style scoped>
.layout-root { height: 100vh; }
.layout-header { border-bottom: 1px solid var(--el-border-color); display: flex; align-items: center; }
.layout-primary-nav { border-right: 1px solid var(--el-border-color); }
.layout-secondary-nav { border-right: 1px solid var(--el-border-color); overflow-y: auto; }
</style>
```

#### Layout 4 — Top navigation only

The header holds the nav links directly. Replace `PROJECT_NAME` with the title-cased project name.

**With dark mode:**

```vue
<template>
  <el-container class="layout-root" direction="vertical">
    <el-header class="layout-header">
      <span class="layout-brand">PROJECT_NAME</span>
      <el-menu mode="horizontal" router :default-active="$route.path" class="layout-nav">
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/about">About</el-menu-item>
        <el-menu-item index="/contact">Contact</el-menu-item>
      </el-menu>
      <div class="layout-actions">
        <el-button :icon="isDark ? Sunny : Moon" circle text @click="toggleDark" />
        <el-avatar :icon="UserFilled" size="small" />
      </div>
    </el-header>
    <el-main><router-view /></el-main>
  </el-container>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny, UserFilled } from '@element-plus/icons-vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped>
.layout-root { height: 100vh; }
.layout-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
  gap: 0;
}
.layout-brand { font-weight: 600; font-size: 18px; margin-right: 24px; white-space: nowrap; }
.layout-nav { flex: 1; border-bottom: none; }
.layout-actions { display: flex; align-items: center; gap: 8px; margin-left: 16px; }
</style>
```

**Without dark mode:** remove the `el-button` toggle, `useDark`/`useToggle` imports, and `Moon`/`Sunny` imports.

---

#### Wire the layout in the router

Update `src/router/index.ts` so app routes are children of the chosen layout:

```ts
import DefaultLayout from '@/layouts/DefaultLayout.vue'

{
  path: '/',
  component: DefaultLayout,
  children: [
    { path: '',        component: () => import('@/views/HomePage.vue') },
    { path: 'about',   component: () => import('@/views/AboutPage.vue') },
  ],
},
```

Create stub pages (`HomePage.vue`, `AboutPage.vue`) under `src/views/` so the router does not throw on startup.

---

## Step 8 — Show a summary

Once everything is done, show a bullet list with what was set up:

- 📦 **Element Plus installed** — `element-plus` + `unplugin-vue-components` + `unplugin-auto-import`
- ⚡ **Auto-import configured** — components and composables resolved on demand via `vite.config.ts`
- 🌙 **Dark mode** — powered by `@vueuse/core` `useDark()` with moon/sun toggle in the header (if enabled)
- 🎨 **Custom theme** — `src/assets/styles/element/index.scss` overriding Element Plus tokens with project variables (if Option A chosen)
- 🔗 **Variable alignment** — project variable file updated with Element Plus default values (if Option B chosen)
- 🧭 **Icons** — `@element-plus/icons-vue` installed and globally registered (if requested)
- 🔐 **Auth pages** — Login, Register, Forgot Password, Password Sent, Password Reset under `src/views/auth/` (if requested)
- 🏗️ **App layout** — `src/layouts/DefaultLayout.vue` scaffolded with `PROJECT_NAME` as brand (layout variant name, if requested)

---

## Quick checklist

- [ ] `element-plus` installed
- [ ] `unplugin-vue-components` + `unplugin-auto-import` installed and wired in `vite.config.ts`
- [ ] `@vueuse/core` installed and dark mode CSS imported in `main.ts` (if dark mode enabled)
- [ ] Custom SCSS theme file created and `css.preprocessorOptions` updated (if custom theming)
- [ ] Variable file updated with Element Plus defaults (if alignment chosen)
- [ ] `@element-plus/icons-vue` installed and globally registered (if icons requested)
- [ ] Auth pages + routes added (if requested)
- [ ] Project name read from `package.json` and used as brand in header/layout
- [ ] Layout component created and wired in router (if requested)
- [ ] `AppHeader.vue` created with moon/sun toggle (if dark mode + layout both enabled)
