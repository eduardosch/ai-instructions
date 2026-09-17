# setup-firebase

Installs and configures Firebase in an existing TypeScript project — asks which services to enable (Firestore, Authentication, Realtime Database, Storage, Cloud Functions, Hosting), scaffolds typed service modules under `src/lib/`, and wires all Firebase config through environment variables. Integrates with `setup-zod` when present.

## Install

```bash
/plugin install setup-firebase@eduardosch-marketplace
```

## Usage

```
/setup-firebase
```

Run after the base project is already in place. Works with any TypeScript project (Vue, Node, etc.).
