import { test } from "node:test";
import assert from "node:assert/strict";
import { BASE_URL } from "../config.js";

// The traditional way: point at the API by hand (config.js) and write the
// assertions yourself. Two calls, one GET and one POST. Run with:  npm test
//
// Each test logs the actual response so you can SEE what the API sent back,
// not just a green check.

// GET: read the menu.
test("GET /api/menu returns items", async () => {
  const res = await fetch(`${BASE_URL}/api/menu`);
  assert.equal(res.status, 200);

  const body = await res.json();
  console.log("\nGET /api/menu ->", res.status);
  console.log(JSON.stringify(body, null, 2));

  assert.ok(body.items.length > 0, "menu should not be empty");
});

// POST: create an order.
test("POST /api/orders creates an order", async () => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      customerId: "cus_demo",
      items: [{ menuItemId: "burrito", quantity: 1, size: "REGULAR" }],
      fulfillment: { method: "PICKUP", scheduledFor: "2026-08-20T18:30:00.000Z" },
    }),
  });
  assert.equal(res.status, 201);

  const order = await res.json();
  console.log("\nPOST /api/orders ->", res.status);
  console.log(JSON.stringify(order, null, 2));

  assert.ok(order.id, "created order should have an id");
});
