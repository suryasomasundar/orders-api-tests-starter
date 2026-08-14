import { BASE_URL } from "../../config.js";

// Service object for /api/orders. Owns the HTTP. Never asserts.
const json = { "content-type": "application/json" };

export const ordersClient = {
  async create(body) {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: json,
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  },

  async get(id) {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`);
    return { status: res.status, body: await res.json() };
  },

  async list() {
    const res = await fetch(`${BASE_URL}/api/orders`);
    return { status: res.status, body: await res.json() };
  },
};
