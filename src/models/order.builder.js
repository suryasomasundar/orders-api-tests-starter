// Builds order request payloads. The valid case is the default; invalid
// variants are explicit. Builders construct payloads and never call the API.
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
    withItem(item) { order.items = [item]; return builder; },
  };
  return builder;
}

// Usage:  anOrder().withSize("LARGE").build()
