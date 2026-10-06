import { test } from "node:test";
import assert from "node:assert/strict";
import { menuClient } from "../src/clients/menu.client.js";
import { menuCategories, knownMenuItem } from "../src/data/fixtures.js";

test("returns the menu with the documented item shape", async () => {
  const { status, body } = await menuClient.list();
  assert.equal(status, 200);
  assert.ok(Array.isArray(body.items));
  assert.ok(body.items.length > 0);

  for (const item of body.items) {
    assert.equal(typeof item.id, "string");
    assert.equal(typeof item.name, "string");
    assert.equal(Number.isInteger(item.priceCents), true);
    assert.ok(menuCategories.includes(item.category));
  }

  const burrito = body.items.find((item) => item.id === knownMenuItem.id);
  assert.ok(burrito, "expected the known burrito item to be present");
  assert.equal(burrito.name, knownMenuItem.name);
  assert.equal(burrito.priceCents, knownMenuItem.priceCents);
  assert.equal(burrito.category, knownMenuItem.category);
});

test("filtering by a valid category returns only items in that category", async () => {
  const { status, body } = await menuClient.list("SIDE");
  assert.equal(status, 200);
  assert.ok(body.items.length > 0);
  assert.ok(body.items.every((item) => item.category === "SIDE"));

  const chips = body.items.find((item) => item.id === "chips");
  assert.ok(chips, "expected chips to be present in the SIDE category");
  assert.equal(chips.priceCents, 545);
});

test("rejects an unknown category with 400 and an actionable error", async () => {
  const { status, body } = await menuClient.list("DESSERT");
  assert.equal(status, 400);
  assert.equal(body.error, "invalid_query");
  for (const category of menuCategories) {
    assert.ok(
      body.message.includes(category),
      `expected message to name allowed value ${category}`
    );
  }
  assert.equal(body.received, "DESSERT");
});

test("rejects a lowercase category with 400 because the enum is case-sensitive", async () => {
  const { status, body } = await menuClient.list("entree");
  assert.equal(status, 400);
  assert.equal(body.error, "invalid_query");
  assert.equal(body.received, "entree");
});
