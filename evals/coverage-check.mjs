// Tiny eval for the AUTHOR agent.
//
// Reads a generated test file and checks that every validation rule in the
// STANDARDS.md coverage table has a negative test. This is the evidence that
// justifies running the author on a cheaper model: if the cheaper model's suite
// still covers all 8 rules, the downgrade is safe.
//
//   node evals/coverage-check.mjs                     # checks tests/orders.test.js
//   node evals/coverage-check.mjs tests/orders.test.js
//
// Heuristic by design: it looks for the field path or the rule's builder/bad-value
// signature. Expect RED on the bare starter (few tests) and GREEN after the
// author generates the full suite - that red -> green is the point.

import { readFileSync } from "node:fs";

const file = process.argv[2] || "tests/orders.test.js";

let src = "";
try {
  src = readFileSync(file, "utf8");
} catch {
  console.error(`Cannot read ${file}`);
  process.exit(2);
}

// rule name -> any of these signals means it is covered
const rules = [
  ["lowercase size", [/items\[0\]\.size/, /["']medium["']/i, /lowercase\s*size/i, /withSize\(/]],
  ["string fulfillment", [/string\s*fulfillment/i, /["']pickup["']/, /fulfillment[^\n]*not[^\n]*object/i]],
  ["missing customerId", [/without\s*customerId/i, /withoutCustomerId/i, /missing\s*customerId/i]],
  ["empty items", [/empty\s*items/i, /withItems\(\s*\[\s*\]\s*\)/, /items:\s*\[\s*\]/]],
  ["unknown menuItemId", [/items\[0\]\.menuItemId/, /unknown\s*menu/i, /withMenuItemId\(/]],
  ["quantity below 1", [/items\[0\]\.quantity/, /withQuantity\(\s*0/, /quantity[^\n]*\b0\b/]],
  ["unknown method", [/fulfillment\.method/, /unknown\s*method/i, /withMethod\(/]],
  ["non-ISO scheduledFor", [/fulfillment\.scheduledFor/, /non-?ISO/i, /invalid[^\n]*scheduledFor/i, /withScheduledFor\(/]],
];

const testCount = (src.match(/\btest\s*\(/g) || []).length;
let covered = 0;
const missing = [];

console.log(`Coverage check: ${file}  (${testCount} test blocks)\n`);
for (const [name, signals] of rules) {
  const ok = signals.some((re) => re.test(src));
  console.log(`${ok ? "[ok]  " : "[MISS]"} ${name}`);
  ok ? covered++ : missing.push(name);
}

console.log(`\n${covered}/${rules.length} validation rules covered`);
if (missing.length) {
  console.log(`Missing: ${missing.join(", ")}`);
  process.exit(1);
}
