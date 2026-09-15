# firebase-setup

Installs and configures Firebase in the current project. Asks which services are needed, scaffolds typed service modules, and wires Firebase config through environment variables. Firebase credentials can be filled in later or passed as parameters.

## Install

```bash
/plugin install firebase-setup@eduardosch-marketplace
```

## Usage

```
/firebase-setup
```

## What it does

1. Asks which Firebase services you need:
   - **Firestore** — document database
   - **Authentication** — email, Google, GitHub sign-in
   - **Realtime Database** — JSON tree database
   - **Storage** — file uploads and downloads
   - **Cloud Functions** — server-side logic
   - **Hosting** — static site / SPA deployment

2. Asks whether Firebase credentials are available now or will be filled in later.

3. Installs `firebase` (and `firebase-admin` for Functions).

4. Creates `.env.example` with all required Firebase config keys and empty placeholders.

5. Creates `src/lib/firebase.ts` — central initialisation file driven by env vars.

6. Scaffolds a typed service module for each selected service:
   - `src/lib/firestore.ts`
   - `src/lib/auth.ts` + `src/composables/useAuth.ts` (Vue)
   - `src/lib/database.ts`
   - `src/lib/storage.ts`
   - `src/lib/functions.ts`

7. If **env-validation** is already installed, adds Firebase vars to the Zod schema in `src/env.ts` and updates `firebase.ts` to import from `env`.

## Passing credentials as parameters

You can pass the Firebase config object directly when invoking the skill:

```
/firebase-setup with these credentials:
apiKey: "AIza..."
authDomain: "my-app.firebaseapp.com"
projectId: "my-app"
storageBucket: "my-app.appspot.com"
messagingSenderId: "123456"
appId: "1:123:web:abc"
```

The skill will populate `.env` with the provided values automatically.

## License

MIT
