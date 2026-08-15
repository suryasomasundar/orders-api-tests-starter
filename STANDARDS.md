# Test standards

The rules for what a good test looks like. `ARCHITECTURE.md` defines the
structure; this document defines the judgment. The skill file points the agent
at both.

Read this as "the bar every test must clear before it is allowed in."

## 1. Naming

Files: `<resource>.client.js`, `<resource>.builder.js`, `<resource>.test.js`.

Test names describe the behaviour being proven, not the endpoint being hit.

```
BAD   test("POST /api/orders")
BAD   test("order creation works")
GOOD  test("creates an order when the body is valid")
GOOD  test("rejects a lowercase size with 422")
```

If a test fails at 3am, the name alone should tell you what broke.

## 2. Assertions

Assert on the response body, not just the status code. A 201 with a garbage
body must fail.

```
BAD
  const { status } = await ordersClient.create(validOrder);
  assert.equal(status, 201);           // a broken body would still pass

GOOD
  const { status, body } = await ordersClient.create(validOrder);
  assert.equal(status, 201);
  assert.equal(body.status, "PLACED");
  assert.equal(body.totalCents, 1095); // assert the derived value too
```

Rules:
- Check the fields and values the endpoint promises.
- Assert derived values (for example `totalCents`), not just that a field exists.
- One behaviour per test. If the name needs an "and", split it.

## 3. Error handling

This is the point of the whole suite. Errors are a first-class contract, not an
afterthought.

- Every endpoint that validates input has at least one negative test.
- Do not stop at the status code. Assert the error body is actionable: it names
  the field and carries a hint.

```
GOOD
  const { status, body } = await ordersClient.create(reasonableButWrong);
  assert.equal(status, 422);
  const fields = body.violations.map((v) => v.field);
  assert.ok(fields.includes("items[0].size"));
  assert.ok(body.violations.every((v) => v.hint));   // every error is actionable
```

## 4. Coverage

For each endpoint: one happy path, plus a negative test for each documented
rule. For `POST /api/orders`, the rules to cover are:

| Rule | Bad input that should return 422 |
|---|---|
| size is an uppercase enum | `size: "medium"` |
| fulfillment is a nested object | `fulfillment: "pickup"` |
| customerId is required | omit `customerId` |
| items is a non-empty array | `items: []` |
| menuItemId must be known | `menuItemId: "sushi"` |
| quantity is an integer >= 1 | `quantity: 0` |
| fulfillment.method is PICKUP or DELIVERY | `method: "drone"` |
| fulfillment.scheduledFor is ISO 8601 | `scheduledFor: "tomorrow"` |

A suite that only tests the happy path is not done, no matter how green it is.

## 5. Independence and reliability

- Tests do not depend on how many orders exist or on another test running first.
  The server is shared with everyone in the room.
- A test creates the data it needs, using a builder or fixture.
- No hardcoded URLs. The base URL comes from `config.js`.
- No invented data. Use real menu ids discovered from `GET /api/menu`.
- The API is live and writes are real: order ids are global and increment on a
  shared server. Never assert on an absolute id (`ord_1010`) or on a total order
  count. Assert on the shape and the values you sent, and read back by the id the
  response gave you.

## The bar, in one line

Behaviour-named, asserts the body, covers the failure path, and would pass or
fail the same way no matter what anyone else did to the server first.
