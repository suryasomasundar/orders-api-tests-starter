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

// GET /api/menu: strict UPPERCASE enum, case-sensitive, not normalized.
export const menuCategories = ["ENTREE", "SIDE", "DRINK"];

// A known, live-verified menu item used to assert real values (not just shape).
export const knownMenuItem = {
  id: "burrito",
  name: "Burrito",
  priceCents: 1095,
  category: "ENTREE",
};
