# Test framework architecture and standards

This is the single source of truth for how we structure API tests. Every test,
whether a human or an agent writes it, follows this document. If the skill file
and this document ever disagree, this document wins.

The goal: any test reads the same way, lives in a predictable place, and asserts
the same way, so the suite stays legible as it grows to hundreds of tests.

## The layers

We use a Service Object model. This is the API equivalent of Page Object Model:
the "how we talk to the API" is kept separate from the "what we are asserting".

```
orders-api-tests-starter/
  config.js                  Layer 1  where the API lives (base URL, env)
  src/
    clients/                 Layer 2  service objects, one per resource
      orders.client.js
      menu.client.js
    models/                  Layer 3  request builders (valid + invalid shapes)
      order.builder.js
    data/                    Layer 4  fixtures, canonical payloads
      fixtures.js
  tests/                     Layer 5  the specs, assertions only
    orders.test.js
    menu.test.js
  ARCHITECTURE.md            this file
```

Each layer has one job and is not allowed to do the others' jobs. That rule is
what keeps the framework robust.

## Layer 1: config

One place holds the base URL and environment. Tests never hardcode a URL.

```js
// config.js
export const BASE_URL =
  process.env.BASE_URL || "https://orders-api-workshop.onrender.com";
```

## Layer 2: clients (service objects)

One client per resource. The client owns the HTTP: path, method, headers, and
parsing. It returns a plain result and never asserts anything.

```js
// src/clients/orders.client.js
import { BASE_URL } from "../../config.js";

const json = { "content-type": "application/json" };

export const ordersClient = {
  async create(body) {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: json,
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  },

  async get(id) {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`);
    return { status: res.status, body: await res.json() };
  },

  async list() {
    const res = await fetch(`${BASE_URL}/api/orders`);
    return { status: res.status, body: await res.json() };
  },
};
```

Why: when a path or header changes, you fix it in one file, not in fifty tests.

## Layer 3: models (builders)

Builders construct request payloads. A test asks for the shape it needs without
repeating the full object every time. Builders make the valid case the default
and the invalid variants explicit.

```js
// src/models/order.builder.js
export function anOrder() {
  const order = {
    customerId: "cus_demo",
    items: [{ menuItemId: "burrito", quantity: 1, size: "REGULAR" }],
    fulfillment: { method: "PICKUP", scheduledFor: "2026-08-20T18:30:00.000Z" },
  };
  const builder = {
    build: () => structuredClone(order),
    withSize(s) { order.items[0].size = s; return builder; },
    withFulfillment(f) { order.fulfillment = f; return builder; },
  };
  return builder;
}

// Usage:  anOrder().withSize("LARGE").build()
```

## Layer 4: data (fixtures)

The canonical payloads live in one place so the "valid" and the "reasonable but
wrong" bodies are defined once and reused.

```js
// src/data/fixtures.js
export const validOrder = {
  customerId: "cus_demo",
  items: [{ menuItemId: "burrito", quantity: 1, size: "REGULAR" }],
  fulfillment: { method: "PICKUP", scheduledFor: "2026-08-20T18:30:00.000Z" },
};

// Looks fine, breaks two rules on purpose (used for the 422 tests).
export const reasonableButWrong = {
  customerId: "cus_demo",
  items: [{ menuItemId: "burrito", quantity: 1, size: "medium" }],
  fulfillment: "pickup",
};
```

## Layer 5: tests

Tests use the client and the data. They assert behaviour and nothing else. No
fetch, no URL building, no payload assembly inline.

```js
// tests/orders.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { ordersClient } from "../src/clients/orders.client.js";
import { validOrder, reasonableButWrong } from "../src/data/fixtures.js";

test("creates an order when the body is valid", async () => {
  const { status, body } = await ordersClient.create(validOrder);
  assert.equal(status, 201);
  assert.equal(body.status, "PLACED");
  assert.equal(body.totalCents, 1095);
});

test("rejects a lowercase size and a string fulfillment with 422", async () => {
  const { status, body } = await ordersClient.create(reasonableButWrong);
  assert.equal(status, 422);
  const fields = body.violations.map((v) => v.field);
  assert.ok(fields.includes("items[0].size"));
  assert.ok(fields.includes("fulfillment"));
});
```

## Standards

**Naming**
- Files: `<resource>.client.js`, `<resource>.builder.js`, `<resource>.test.js`.
- Tests describe behaviour, not endpoints: "rejects a lowercase size with 422",
  not "test POST orders".

**Assertions**
- Assert on the response body, not just the status code.
- Assert derived values (for example `totalCents`), not just that a field exists.

**Error handling**
- Every endpoint that validates input has at least one negative test.
- Cover each documented validation rule once (uppercase size, nested
  fulfillment, required fields, unknown menu id, quantity >= 1).
- Assert the error is actionable: it names the field and carries a hint.

**Independence**
- Tests do not depend on how many orders exist or on another test running first.
  The server is shared. A test creates the data it needs.

## Who may do what

| Layer | May | May not |
|---|---|---|
| config | hold URLs and env | contain test logic |
| clients | own HTTP, parse responses | assert, build payloads |
| models | build request payloads | call the API |
| data | hold canonical payloads | call the API or assert |
| tests | assert behaviour | call fetch, build URLs, assemble payloads inline |

## How the agent uses this

When asked to write a test, the agent:
1. reads this document for structure and standards,
2. reuses the existing client and builders (does not reinvent them),
3. places new files per the layout above,
4. writes behaviour-named tests that assert bodies and cover the error paths.

The skill file encodes the judgment calls. This document defines the structure
they apply to.
