---
name: rules-firebase-functions
description: Coding conventions for Firebase Cloud Functions (2nd gen, v2) with TypeScript — project structure, function naming, typed callable/HTTP/Firestore-trigger/scheduler patterns, input validation with Zod, authorization checks, error handling with HttpsError, structured logging with firebase-functions/logger, secrets and params, idempotency, performance/cold start, cost limits, and testing with the Emulator Suite. Use this skill whenever writing, reviewing, refactoring, or debugging code in a `*-firebase-functions` project or any `functions/` folder, and whenever the user mentions Cloud Functions, callable functions, Firestore triggers, onRequest/onCall, scheduled functions, HttpsError, or Firebase backend logic — even if they don't explicitly ask for "conventions".
---

# Firebase Functions Rules

Conventions for writing Firebase Cloud Functions in TypeScript. Apply these rules whenever writing, reviewing, or modifying code in a `*-firebase-functions` project.

Pairs naturally with [[setup-firebase-functions]] (project scaffolding) and [[setup-firebase]] (client-side Firebase setup).

## Core principle

A function is only the **edge**: it receives the event, validates input, checks authorization, calls a service, and returns. Business logic lives in `services/`, data access lives in `repositories/`. This keeps logic testable without the emulator.

## 1. Stack and baseline

- Use **2nd gen (v2)** APIs only: import from `firebase-functions/v2/*`. Do not write new v1 functions.
- TypeScript with `strict: true`. No `any`; use `unknown` and narrow.
- Pin a supported LTS Node version in `package.json` (`"engines": { "node": "22" }`). Check the Firebase docs for the currently supported runtimes.
- ESLint + Prettier run in `predeploy` and CI.
- Use modular imports (`firebase-admin/firestore`, `firebase-admin/auth`), never the legacy namespaced `admin.*` API.

## 2. Project structure

```
functions/
├── src/
│   ├── index.ts              # re-exports only, no logic
│   ├── config/               # setGlobalOptions, params, admin init
│   ├── functions/
│   │   ├── callable/
│   │   ├── http/
│   │   ├── firestore/        # document triggers
│   │   ├── auth/
│   │   └── scheduler/
│   ├── services/             # business rules
│   ├── repositories/         # Firestore/Storage access
│   ├── middlewares/
│   ├── schemas/              # Zod schemas + inferred types
│   ├── types/
│   └── utils/
├── test/
├── .env.example
├── tsconfig.json
└── package.json
```

- `index.ts` contains only `export * from "./functions/..."` lines.
- One exported function per file, named after the function.
- Initialize the Admin SDK once, in `config/`, and import that module for its side effect.

## 3. Naming

| Kind | Convention | Example |
| --- | --- | --- |
| Callable | `verbNoun` (camelCase) | `createOrder`, `getUserProfile` |
| HTTP (`onRequest`) | `api` or `http` + Name | `apiWebhooks`, `httpStripeWebhook` |
| Firestore trigger | `on` + Entity + Event | `onOrderCreated`, `onUserUpdated` |
| Auth trigger | `on` + Event | `onUserSignedUp` |
| Scheduler | `scheduled` + Task | `scheduledCleanupExpiredSessions` |

- The exported name is the deployed function name. **Renaming a function deletes the old one and creates a new one**, which can drop in-flight trigger events. Treat names as stable.
- Files: `kebab-case.ts`. Types/interfaces: `PascalCase`. Constants: `UPPER_SNAKE_CASE`.

## 4. Global options and performance

Set defaults once in `config/`:

```ts
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({
  region: "southamerica-east1",
  maxInstances: 10,
  memory: "256MiB",
  timeoutSeconds: 60,
});
```

- Always set `maxInstances` to cap cost on bugs or abuse. Raise it per function only when justified.
- Use `minInstances` only when cold-start latency is proven to matter and the cost is accepted.
- Keep the region consistent with Firestore/Storage location.
- Lazy-load heavy dependencies inside the function that needs them.
- Keep dependencies lean. Every package adds to cold start.

## 5. Typed function patterns

### Callable

```ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/logger";
import { z } from "zod";
import { orderService } from "../../services/order.service";

const CreateOrderInput = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(100),
});
type CreateOrderInput = z.infer<typeof CreateOrderInput>;

interface CreateOrderOutput {
  orderId: string;
}

export const createOrder = onCall<CreateOrderInput, Promise<CreateOrderOutput>>(
  { enforceAppCheck: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in is required.");
    }

    const parsed = CreateOrderInput.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError("invalid-argument", "Invalid payload.", parsed.error.flatten());
    }

    try {
      const orderId = await orderService.create(request.auth.uid, parsed.data);
      return { orderId };
    } catch (error) {
      logger.error("createOrder failed", { uid: request.auth.uid, error });
      throw toHttpsError(error);
    }
  },
);
```

### HTTP

```ts
import { onRequest } from "firebase-functions/v2/https";

export const apiWebhooks = onRequest({ cors: ["https://app.example.com"] }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  // validate signature/payload, delegate to a service, respond
});
```

- Restrict CORS to known origins. Never use `cors: true` in production.
- Verify webhook signatures before doing anything else.
- Always end the request (`res.send/json/status().end()`), or the function runs until timeout.

### Firestore trigger

```ts
import { onDocumentCreated } from "firebase-functions/v2/firestore";

export const onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  await notificationService.notifyOrderCreated({
    eventId: event.id,
    orderId: event.params.orderId,
    data: snapshot.data() as Order,
  });
});
```

### Scheduler

```ts
import { onSchedule } from "firebase-functions/v2/scheduler";

export const scheduledCleanupExpiredSessions = onSchedule(
  { schedule: "every day 03:00", timeZone: "America/Sao_Paulo" },
  async () => {
    await sessionService.cleanupExpired();
  },
);
```

- Always set `timeZone` explicitly on schedulers.

## 6. Error handling

- In callables, throw only `HttpsError` with the most specific code: `invalid-argument`, `unauthenticated`, `permission-denied`, `not-found`, `already-exists`, `failed-precondition`, `resource-exhausted`, `internal`.
- Map domain errors to `HttpsError` in one place (`utils/errors.ts` → `toHttpsError`). Services throw domain errors, never `HttpsError`.
- Never leak stack traces, internal ids, or raw exception messages to the client. Unknown errors become `internal` with a generic message.
- In triggers and schedulers, let unexpected errors propagate (so retries and error reporting work) but only enable retries on idempotent functions.
- Always `await`/return every Promise. Work left pending after the function returns can be terminated.

## 7. Logging

- Use `logger` from `firebase-functions/logger` (`logger.info/warn/error`), never `console.log`.
- Pass context as an object, not a concatenated string:

```ts
logger.info("Order created", { orderId, uid, total });
logger.error("Payment failed", { orderId, error });
```

- Never log tokens, passwords, full payloads with PII, or secrets.
- Use `warn` for recoverable situations, `error` for failures that need attention.

## 8. Security

- **Authentication ≠ authorization.** After checking `request.auth`, also check roles/custom claims or resource ownership.
- Enable **App Check** (`enforceAppCheck: true`) on callables and sensitive HTTP endpoints.
- **Validate every input** with Zod schemas kept in `schemas/`. Never trust `request.data`, `req.body`, or `req.query`.
- Least privilege: use a dedicated service account for functions that need narrower permissions.
- Firestore Security Rules are still required. Functions using the Admin SDK bypass them, so enforce access rules in code.

## 9. Config and secrets

- Use `defineString`, `defineInt`, and `defineSecret` from `firebase-functions/params`. Do not use `functions.config()` (deprecated).
- Secrets go in Secret Manager (`firebase functions:secrets:set NAME`) and must be declared in the function options: `onCall({ secrets: [STRIPE_KEY] }, ...)`.
- Read a secret's `.value()` only at runtime inside the handler, never at module top level.
- Per-environment values: `.env.<projectId>` files. Commit `.env.example`, never real values.
- Separate Firebase projects per environment (`dev`, `staging`, `prod`) using aliases in `.firebaserc`.

## 10. Reliability and idempotency

- Event-driven functions are **at-least-once**. Make handlers idempotent: deduplicate with `event.id` (store processed ids or use deterministic document ids).
- Avoid **infinite trigger loops**: a trigger that writes to the document (or collection) that fires it will re-trigger itself. Guard with a change check or write to a different path.
- Use transactions or batched writes for related Firestore writes.
- Keep triggers cheap: avoid extra reads and heavy work per event, since cost multiplies with volume.
- Prefer event-driven design or scheduled jobs over polling.

## 11. Testing

- Unit-test `services/` and `utils/` with **Vitest** (or Jest). They should have no dependency on the Functions runtime.
- Mock repositories in service tests. Do not mock Firestore internals.
- Integration-test with the **Firebase Emulator Suite** (Functions, Firestore, Auth, Storage). Never test against production.
- Use `firebase-functions-test` only when the function wrapper itself needs testing.
- Test names describe behavior: `it("rejects unauthenticated callers")`.
- Cover at least: valid input, invalid input, unauthenticated, unauthorized, and idempotent re-delivery for triggers.
- CI runs lint, type-check, build, and tests before any deploy.

## 12. Deploy and operations

- Selective deploy: `firebase deploy --only functions:createOrder`.
- Automate deploys per branch/environment with CI (e.g. GitHub Actions), with secrets stored in the CI provider.
- Configure a **cleanup policy** for container images in Artifact Registry to avoid growing storage costs.
- Set Cloud Monitoring alerts for error rate and latency.

## Review checklist

Before finishing any change in a functions project, verify:

- [ ] v2 API, region and `maxInstances` set (globally or per function)
- [ ] `index.ts` only re-exports; logic is in `services/`
- [ ] Input validated with Zod; authorization checked, not only authentication
- [ ] Errors are `HttpsError` in callables, with no internal details leaked
- [ ] `logger` with structured context, no sensitive data
- [ ] Secrets via `defineSecret`, declared in function options
- [ ] Triggers are idempotent and cannot loop on themselves
- [ ] All Promises awaited; HTTP responses always ended
- [ ] Function name unchanged (or rename consequences considered)
- [ ] Tests added or updated for the new behavior