import { test } from "node:test";
import assert from "node:assert/strict";
import { BASE_URL } from "../config.js";

// =============================================================================
// Orders API tests -- the traditional way
//
// You point at the API by hand (see config.js) and write every assertion
// yourself. Run everything with:  npm test
//
// This file has TWO parts:
//   PART 1  a finished GET test, so you know the setup works out of the box.
//   PART 2  a POST test for YOU to write. It starts commented out.
// =============================================================================


// ----- PART 1: finished example (GET) ----------------------------------------
// Run `npm test` now. This one passes and prints the menu.

test("GET /api/menu returns items", async () => {
  const res = await fetch(`${BASE_URL}/api/menu`);
  assert.equal(res.status, 200);

  const body = await res.json();
  console.log("\nGET /api/menu ->", res.status);
  console.log(JSON.stringify(body, null, 2));

  assert.ok(body.items.length > 0, "menu should not be empty");
});


// ----- PART 2: your turn (POST) ----------------------------------------------
// Goal: create an order and assert it worked.
//
//   1. UNCOMMENT the whole test below (select the block, then Cmd + / ).
//   2. Replace the two  ???  with real values:
//        size         must be UPPERCASE  ->  "REGULAR"
//        fulfillment  must be an OBJECT  ->  { method: "PICKUP", scheduledFor: "..." }
//   3. Run `npm test`.
//
//   Tip: try it "the way you'd guess" first -> size: "medium", fulfillment: "pickup"
//        Run it, read the 422 error the API sends back, then fix the two fields
//        and watch the same test turn green.
//
// vvvvvvvvvv   UNCOMMENT FROM HERE   vvvvvvvvvv

// test("POST /api/orders creates an order", async () => {
//   const body = {
//     customerId: "cus_demo",
//     items: [{ menuItemId: "burrito", quantity: 1, size: "???" }],
//     fulfillment: "???",
//   };
//   const res = await fetch(`${BASE_URL}/api/orders`, {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   assert.equal(res.status, 201);
//
//   const order = await res.json();
//   console.log("\nPOST /api/orders ->", res.status);
//   console.log(JSON.stringify(order, null, 2));
//
//   assert.ok(order.id, "created order should have an id");
//   assert.equal(order.status, "PLACED");
// });

// ^^^^^^^^^^   UNCOMMENT TO HERE   ^^^^^^^^^^
