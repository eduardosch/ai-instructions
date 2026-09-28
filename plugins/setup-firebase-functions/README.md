# `setup-firebase-functions` Claude Skill

Scaffolds a Firebase Cloud Functions project in a sibling folder next to your app. Creates `<app-name>-firebase-functions/` with TypeScript, ESLint, shared types, and callable/HTTP/Firestore trigger stubs — ready to build and deploy.

Invoked automatically by `setup-firebase` when Cloud Functions is selected, or run standalone to add a functions project to any existing TypeScript app.

## Installation

Launch Claude Code first:

```bash
claude
```

Then from within Claude Code, add the marketplace and install the plugin:

```bash
/plugin marketplace add eduardosch/ai-instructions

/plugin install setup-firebase-functions@eduardosch-marketplace
```

## Usage

Run from inside your app folder:

```
/setup-firebase-functions
```

This creates `../<your-app-name>-firebase-functions/` as a sibling directory with:

```
<app-name>-firebase-functions/
├── src/
│   ├── index.ts
│   ├── types/index.ts
│   ├── functions/
│   │   ├── callable/helloWorld.ts
│   │   ├── http/healthCheck.ts
│   │   └── triggers/onUserCreated.ts
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .gitignore
└── .env.example
```

`firebase.json` in the app folder is also created or updated to point at the functions project.

## Uninstalling

```bash
/plugin uninstall setup-firebase-functions

/plugin marketplace remove eduardosch-marketplace
```
