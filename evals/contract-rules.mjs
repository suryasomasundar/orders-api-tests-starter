// Tiny eval: fire each of the 8 documented bad payloads at the live API and
// confirm each is rejected with 422 and flags the right field.
//
// This is the GROUND TRUTH a generated suite must cover. Run it to prove the
// contract still enforces every rule (and to justify a cheaper model for the
// author: if the author's suite covers all 8, it matches this).
//
//   node evals/contract-rules.mjs
//   node evals/contract-rules.mjs http://localhost:3000

const BASE = process.argv[2] || "https://orders-api-workshop.onrender.com";

const valid = () => ({
  customerId: "cus_demo",
  items: [{ menuItemId: "burrito", quantity: 1, size: "REGULAR" }],
  fulfillment: { method: "PICKUP", scheduledFor: "2026-08-20T18:30:00.000Z" },
});

// [name, mutate(body), expectedField]
const cases = [
  ["lowercase size", (b) => (b.items[0].size = "medium"), "items[0].size"],
  ["string fulfillment", (b) => (b.fulfillment = "pickup"), "fulfillment"],
  ["missing customerId", (b) => delete b.customerId, "customerId"],
  ["empty items", (b) => (b.items = []), "items"],
  ["unknown menuItemId", (b) => (b.items[0].menuItemId = "sushi"), "items[0].menuItemId"],
  ["quantity below 1", (b) => (b.items[0].quantity = 0), "items[0].quantity"],
  ["unknown method", (b) => (b.fulfillment.method = "drone"), "fulfillment.method"],
  ["non-ISO scheduledFor", (b) => (b.fulfillment.scheduledFor = "tomorrow"), "fulfillment.scheduledFor"],
];

let pass = 0, fail = 0;

for (const [name, mutate, field] of cases) {
  const body = valid();
  mutate(body);
  const res = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  const fields = (json.violations || []).map((v) => v.field);
  const ok = res.status === 422 && fields.includes(field);
  console.log(`${ok ? "[ok]  " : "[FAIL]"} ${name.padEnd(22)} -> ${res.status}, flagged: ${fields.join(", ") || "(none)"}`);
  ok ? pass++ : fail++;
}

console.log(`\n${pass}/${cases.length} rules enforced`);
process.exit(fail === 0 ? 0 : 1);
