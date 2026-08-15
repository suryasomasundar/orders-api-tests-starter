// The "copy the URL into the code" step.
//
// Traditionally, this is how you point a test suite at an API: you find the URL
// and you paste it in by hand. Later in the workshop we replace this manual step
// by connecting the OpenAPI spec so the agent discovers the API on its own.
export const BASE_URL =
  process.env.BASE_URL || "https://orders-api-workshop.onrender.com";
