---
name: setup-firebase
description: Installs and configures Firebase in the current project — asks which services are needed (Firestore, Authentication, Storage, Realtime Database, Functions, Hosting), scaffolds typed service modules, and wires Firebase config through environment variables. Firebase credentials can be filled in later or passed as parameters. Use when adding Firebase to any TypeScript project (Vue, React, Node, etc.).
---

# Firebase Setup

Installs Firebase and wires it into the current project with typed service modules and environment variable–driven configuration.

Pairs naturally with [[setup-zod]] (validates Firebase env vars at startup) and [[setup-vue-project]] (Vue 3 projects).

---

## Step 1 — Ask which services to enable

Before doing anything else, ask the user which Firebase services they want:

```
Which Firebase services do you need for this project?
  [ ] Firestore (document database)
  [ ] Authentication (email, Google, GitHub, etc.)
  [ ] Realtime Database (JSON tree database)
  [ ] Storage (file uploads and downloads)
  [ ] Cloud Functions (server-side logic)
  [ ] Hosting (static site / SPA deployment)
```

Also ask whether Firebase credentials are available now or will be filled in later:
- **Now** — user will paste the Firebase config object (apiKey, authDomain, projectId, etc.)
- **Later** — create placeholder `.env` entries and leave them empty

---

## Step 2 — Ask for the Firebase config (if available now)

If the user chose "now", ask them to paste their Firebase config object from the Firebase Console:

```js
// Example shape from the Firebase Console
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."   // optional, only if Analytics is enabled
}
```

Extract each value and map it to the corresponding `VITE_FIREBASE_*` env var (see Step 4).

If the user is working on a Node project (no Vite), use `FIREBASE_*` without the `VITE_` prefix.

---

## Step 3 — Install packages

Always install the core Firebase SDK:

```bash
pnpm add firebase
```

Install extra packages based on selected services:

| Service           | Extra package          |
|-------------------|------------------------|
| Cloud Functions   | `firebase-admin`       |
| Hosting only      | (no extra package)     |

---

## Step 4 — Create `.env` and `.env.example`

### `.env.example`

Always create (or append to) `.env.example` with all Firebase keys. Add comments explaining each var:

```dotenv
# Firebase — copy values from Firebase Console > Project Settings > Your apps
# Leave empty here; fill in .env (never commit .env)

# Required for all Firebase services
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=

# Required when Realtime Database is enabled
VITE_FIREBASE_DATABASE_URL=

# Required when Storage is enabled
VITE_FIREBASE_STORAGE_BUCKET=

# Required for push notifications / FCM
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Optional — only when Analytics is enabled in the Firebase Console
VITE_FIREBASE_MEASUREMENT_ID=
```

Only include the keys relevant to the selected services.

### `.env`

If the user provided credentials now, create `.env` with the actual values filled in. Never commit `.env`.

Ensure `.env` and `.env.local` are in `.gitignore`. If they are not, add them:

```
.env
.env.local
```

---

## Step 5 — Create `src/lib/firebase.ts`

Create the central Firebase initialisation file. Every other service module imports from here.

```ts
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
```

**Node/Express project** (no Vite):

```ts
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
```

Only include the keys relevant to the selected services.

---

## Step 6 — Integration with env-validation (if present)

If the project already uses [[env-validation]] (`src/env.ts` exists), add Firebase vars to the Zod schema instead of reading `import.meta.env` directly in `firebase.ts`.

Add to `src/env.ts`:

```ts
// Add inside the existing schema object:
VITE_FIREBASE_API_KEY: z.string().min(1),
VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
VITE_FIREBASE_PROJECT_ID: z.string().min(1),
VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1).optional(),
VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
VITE_FIREBASE_APP_ID: z.string().min(1),
VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
```

Then update `src/lib/firebase.ts` to import from `env`:

```ts
import { env } from '@/env'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
```

---

## Step 7 — Scaffold service modules

Create one file per selected service under `src/lib/`. Each file exports the initialised service instance and any helper utilities.

### 7.1 Firestore — `src/lib/firestore.ts`

```ts
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { app } from './firebase'

export const db = getFirestore(app)

export { collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp }
```

### 7.2 Authentication — `src/lib/auth.ts`

```ts
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth'
import { app } from './firebase'

export const auth = getAuth(app)

export { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, GithubAuthProvider }
```

For Vue projects, also create `src/composables/useAuth.ts`:

```ts
import { ref, onMounted, onUnmounted } from 'vue'
import { auth, onAuthStateChanged } from '@/lib/auth'
import type { User } from 'firebase/auth'

export function useAuth() {
  const user = ref<User | null>(null)
  const isLoading = ref(true)

  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      isLoading.value = false
    })
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

  return { user, isLoading }
}
```

### 7.3 Realtime Database — `src/lib/database.ts`

```ts
import { getDatabase, ref as dbRef, set, get, update, remove, push, onValue, off } from 'firebase/database'
import { app } from './firebase'

export const database = getDatabase(app)

export { dbRef, set, get, update, remove, push, onValue, off }
```

### 7.4 Storage — `src/lib/storage.ts`

```ts
import { getStorage, ref as storageRef, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage'
import { app } from './firebase'

export const storage = getStorage(app)

export { storageRef, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject, listAll }
```

### 7.5 Cloud Functions — `src/lib/functions.ts`

```ts
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { app } from './firebase'

export const functions = getFunctions(app)

// Uncomment to use the local emulator during development:
// if (import.meta.env.DEV) {
//   connectFunctionsEmulator(functions, 'localhost', 5001)
// }

export { httpsCallable }
```

---

## Step 8 — Emulator support (optional)

If the user asks for emulator support or the project uses `firebase.json`, add emulator connections to each service module.

Typical emulator ports:
- Auth: `localhost:9099`
- Firestore: `localhost:8080`
- Realtime Database: `localhost:9000`
- Storage: `localhost:9199`
- Functions: `localhost:5001`

Add to `src/lib/firebase.ts` (wrap each in `if (import.meta.env.DEV)`):

```ts
import { connectAuthEmulator } from 'firebase/auth'
import { connectFirestoreEmulator } from 'firebase/firestore'

// Uncomment to use local emulators in development
// if (import.meta.env.DEV) {
//   connectAuthEmulator(auth, 'http://localhost:9099')
//   connectFirestoreEmulator(db, 'localhost', 8080)
// }
```

---

## Step 9 — Show a summary

Once everything is done, show the user a bullet list with emojis summarising what was set up:

- 🔥 **Firebase initialised** — `src/lib/firebase.ts` with env-driven config
- 📄 **.env.example** — all Firebase keys documented with placeholders
- 🗃️ **Firestore** — `src/lib/firestore.ts` (if selected)
- 🔐 **Authentication** — `src/lib/auth.ts` + `src/composables/useAuth.ts` (if selected)
- ⚡ **Realtime Database** — `src/lib/database.ts` (if selected)
- 📦 **Storage** — `src/lib/storage.ts` (if selected)
- ☁️ **Cloud Functions** — `src/lib/functions.ts` (if selected)
- 🌐 **Hosting** — `firebase.json` configuration ready (if selected)
- ✅ **env-validation** — Firebase vars added to Zod schema (if env-validation was already in use)

If credentials were not provided, remind the user:

> Firebase credentials are not set yet. Go to Firebase Console → Project Settings → Your apps → SDK setup and copy the config object, then fill in `.env` with the values from `.env.example`.

---

## Quick checklist

- [ ] `firebase` installed
- [ ] `src/lib/firebase.ts` created with env-driven config
- [ ] `.env.example` lists all Firebase keys (no real values)
- [ ] `.env` in `.gitignore`
- [ ] Service modules created for each enabled service
- [ ] `useAuth.ts` composable created (Vue projects with Auth)
- [ ] env-validation schema updated (if env-validation plugin is present)
- [ ] Emulator comments added for local development
