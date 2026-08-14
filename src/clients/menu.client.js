import { BASE_URL } from "../../config.js";

// Service object for /api/menu. Owns the HTTP. Never asserts.
export const menuClient = {
  async list(category) {
    const url = category
      ? `${BASE_URL}/api/menu?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/api/menu`;
    const res = await fetch(url);
    return { status: res.status, body: await res.json() };
  },
};
