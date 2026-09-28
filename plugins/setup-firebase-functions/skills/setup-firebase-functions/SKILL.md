---
name: setup-firebase-functions
description: Scaffolds a Firebase Cloud Functions project alongside an existing app — creates a sibling folder named <app-name>-firebase-functions with TypeScript, ESLint, shared types, and typed callable/HTTP/trigger function stubs. Invoked automatically by setup-firebase when Functions is selected, or standalone for a dedicated functions project.
oneshot: true
---

# Firebase Functions Setup

Scaffolds a TypeScript Firebase Cloud Functions project in a sibling folder next to the current app.

Pairs naturally with [[setup-firebase]] — `setup-firebase` invokes this automatically when Cloud Functions is selected.

---

## Context detection

Before doing anything, resolve two key values.

### App folder name

- **When invoked by `setup-firebase`:** the current working directory is the app folder — read its name from the last path segment.
- **When invoked standalone:** same — read the current working directory name.

The functions folder will always be created at `../<app-folder-name>-firebase-functions`.

### Firebase project ID

- **When invoked by `setup-firebase`:** the project ID may already be known from the user's Firebase config — reuse it.
- **When invoked standalone:** ask the user: *"Do you have a Firebase project ID? (You can skip this and add it later to `.firebaserc`)"*

---

## Step 1 — Create the functions folder

Create the sibling directory from inside the app folder:

```bash
# macOS / Linux
mkdir -p ../<app-folder-name>-firebase-functions
```

```powershell
# Windows (PowerShell)
New-Item -ItemType Directory -Force ../<app-folder-name>-firebase-functions
```

All subsequent files are written inside `../<app-folder-name>-firebase-functions/`. Resolve its absolute path and use it for every file write in the remaining steps.

---

## Step 2 — Create package.json

Create `package.json` (substitute `<app-folder-name>` with the actual name):

```json
{
  "name": "<app-folder-name>-firebase-functions",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log",
    "lint": "eslint --ext .ts src/"
  },
  "engines": {
    "node": "20"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.0.0",
    "firebase-functions-test": "^3.1.0"
  }
}
```

> Firebase Functions projects use **npm** (not pnpm) to stay compatible with the Firebase CLI deploy pipeline.

---

## Step 3 — Create tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "ES2020",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "compileOnSave": true,
  "include": ["src/**/*"],
  "exclude": ["lib/**", "node_modules"]
}
```

---

## Step 4 — Create .eslintrc.js

```js
module.exports = {
  root: true,
  env: { es2020: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['tsconfig.json'], sourceType: 'module' },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}
```

---

## Step 5 — Create .gitignore

```
node_modules/
lib/
.env
.env.*
!.env.example
*.log
```

---

## Step 6 — Create .env.example

```dotenv
# Firebase project ID — used by the local emulator
GCLOUD_PROJECT=your-project-id
```

---

## Step 7 — Create shared types

Create `src/types/index.ts`:

```ts
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}
```

---

## Step 8 — Create function stubs

### 8.1 Callable — `src/functions/callable/helloWorld.ts`

```ts
import * as functions from 'firebase-functions'

interface HelloRequest {
  name: string
}

interface HelloResponse {
  message: string
}

export const helloWorld = functions.https.onCall(
  (data: HelloRequest): HelloResponse => {
    return { message: `Hello, ${data.name}!` }
  }
)
```

### 8.2 HTTP — `src/functions/http/healthCheck.ts`

```ts
import * as functions from 'firebase-functions'
import type { Request, Response } from 'express'

export const healthCheck = functions.https.onRequest(
  (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  }
)
```

### 8.3 Firestore trigger — `src/functions/triggers/onUserCreated.ts`

```ts
import * as functions from 'firebase-functions'

export const onUserCreated = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data()
    functions.logger.info('New user created', {
      userId: context.params.userId,
      data,
    })
    // TODO: add your business logic here
  })
```

---

## Step 9 — Create src/index.ts

```ts
import * as admin from 'firebase-admin'

admin.initializeApp()

// Callable functions
export { helloWorld } from './functions/callable/helloWorld'

// HTTP functions
export { healthCheck } from './functions/http/healthCheck'

// Firestore triggers
export { onUserCreated } from './functions/triggers/onUserCreated'
```

---

## Step 10 — Update firebase.json in the app folder

Check if `firebase.json` exists in the **app folder** (the current working directory, one level up from the functions folder).

### If firebase.json exists — merge the functions key

Read the file and add or replace the `"functions"` array:

```json
{
  "functions": [
    {
      "source": "../<app-folder-name>-firebase-functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ],
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run build"
      ]
    }
  ]
}
```

Preserve any existing keys (`hosting`, `firestore`, `storage`, etc.) — only add/replace `"functions"`.

### If firebase.json does not exist — create it

```json
{
  "functions": [
    {
      "source": "../<app-folder-name>-firebase-functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ],
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run build"
      ]
    }
  ]
}
```

Also create `.firebaserc` in the app folder if it does not exist:

```json
{
  "projects": {
    "default": "<firebase-project-id>"
  }
}
```

If the project ID is unknown, leave it as `"<firebase-project-id>"` and note it in the summary.

---

## Step 11 — Install dependencies

Run from inside the functions folder:

```bash
npm install
```

---

## Step 11.5 — Register marketplace and wire rules plugin

Create `.claude/settings.json` inside the functions folder so Claude Code picks up `rules-firebase-functions` when the project is opened:

```json
{
  "enabledPlugins": {
    "rules-firebase-functions@eduardosch-marketplace": true
  }
}
```

Write this file to `.claude/settings.json` inside the functions folder (create the `.claude/` directory if it does not exist).

The marketplace is already registered from the session that invoked `setup-firebase-functions` (either from `setup-firebase` or directly). No `/plugin marketplace add` command is needed.

---

## Step 12 — Show a summary

```
📁  Created: ../<app-folder-name>-firebase-functions/
├── src/
│   ├── index.ts
│   ├── types/index.ts
│   ├── functions/callable/helloWorld.ts
│   ├── functions/http/healthCheck.ts
│   └── functions/triggers/onUserCreated.ts
├── package.json   (firebase-functions ^4, firebase-admin ^12, TypeScript ^5)
├── tsconfig.json
├── .eslintrc.js
├── .gitignore
└── .env.example
```

Then tell the user:

- 🔥 **firebase.json** — updated in the app folder to point at the functions project
- 📦 **Dependencies** — installed via `npm install`
- 📋 **rules-firebase-functions** — enabled in `.claude/settings.json`

### Next steps

```bash
cd ../<app-folder-name>-firebase-functions

# start the emulator
npm run serve

# deploy to Firebase
npm run deploy
```

> **Calling `helloWorld` from your app:**
> ```ts
> import { getFunctions, httpsCallable } from 'firebase/functions'
> const fn = httpsCallable<{ name: string }, { message: string }>(getFunctions(), 'helloWorld')
> const { data } = await fn({ name: 'World' })
> ```
