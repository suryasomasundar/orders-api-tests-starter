import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_URL } from '../config.js';

// The traditional way: you point at the API by hand (see config.js) and you
// write every assertion yourself. Run these with:  npm test
//
// This first test is complete, so you know the setup works out of the box.

test('GET /api/menu returns a non-empty list', async () => {
  const res = await fetch(`${BASE_URL}/api/menu`);
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.ok(Array.isArray(body.items), 'items should be an array');
  assert.ok(body.items.length > 0, 'menu should not be empty');
});

// ---------------------------------------------------------------------------
// TODO: write this one together, the traditional way.
//
// Goal: create an order via POST /api/orders and assert it worked.
//
//   1. Build a request body with: customerId, items (menuItemId, quantity,
//      size), and fulfillment (method, scheduledFor).
//   2. fetch(`${BASE_URL}/api/orders`, { method: 'POST', headers, body }).
//   3. Assert res.status === 201 and the returned order has an id.
//
// Try it "the way you'd guess" first  ->  size: "medium", fulfillment: "pickup"
// Run it, read the 422, then fix the body and watch it turn into a 201.
//
// Uncomment and fill in:
//
// test('POST /api/orders creates an order', async () => {
//   const body = {
//     customerId: 'cus_demo',
//     items: [{ menuItemId: 'burrito', quantity: 1, size: '???' }],
//     fulfillment: '???'
//   };
//   const res = await fetch(`${BASE_URL}/api/orders`, {
//     method: 'POST',
//     headers: { 'content-type': 'application/json' },
//     body: JSON.stringify(body)
//   });
//   assert.equal(res.status, 201);
//   const order = await res.json();
//   assert.ok(order.id, 'created order should have an id');
//   assert.equal(order.status, 'PLACED');
// });
