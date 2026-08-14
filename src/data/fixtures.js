// Canonical payloads, defined once and reused across tests.

export const validOrder = {
  customerId: "cus_demo",
  items: [{ menuItemId: "burrito", quantity: 1, size: "REGULAR" }],
  fulfillment: { method: "PICKUP", scheduledFor: "2026-08-20T18:30:00.000Z" },
};

// Looks fine, breaks two rules on purpose (used for the 422 tests):
//   size must be UPPERCASE, fulfillment must be a nested object.
export const reasonableButWrong = {
  customerId: "cus_demo",
  items: [{ menuItemId: "burrito", quantity: 1, size: "medium" }],
  fulfillment: "pickup",
};
