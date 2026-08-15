// Eval fixture for the REVIEWER agent.
//
// This file deliberately breaks three STANDARDS.md rules. A good reviewer (on
// whatever model) must catch all three. Run the reviewer agent against this file
// and score it. If a cheaper model misses any, keep the reviewer on the stronger
// model.
//
// Seeded violations (the expected findings):
//   1. Status-only assertion - no response body checked (STANDARDS s2).
//   2. No failure-path test at all - only a happy path (STANDARDS s3).
//   3. Hardcoded URL instead of config.js / the client (STANDARDS s5).
//
// Do NOT "fix" this file. It is bait for the reviewer.

import { test } from "node:test";
import assert from "node:assert/strict";

test("create order", async () => {
  const res = await fetch("https://orders-api-workshop.onrender.com/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      customerId: "cus_demo",
      items: [{ menuItemId: "burrito", quantity: 1, size: "REGULAR" }],
      fulfillment: { method: "PICKUP", scheduledFor: "2026-08-20T18:30:00.000Z" },
    }),
  });
  assert.equal(res.status, 201); // status only, body never checked
});
