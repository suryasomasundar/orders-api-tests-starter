---
name: api-test-authoring
description: Rules and flow for writing API tests for the Orders API. Use whenever generating, adding, or editing tests against the Orders API so they follow the team's architecture and standards.
---

# API test authoring

Follow this whenever you write a test for the Orders API.

## Read first
- `ARCHITECTURE.md` — the framework structure: service-object clients, builders,
  fixtures, and where files go.
- `STANDARDS.md` — the bar every test must clear.

## Flow
1. Understand which endpoint and behaviour is being asked for.
2. Discover the endpoint's contract via the Swagger MCP (fields, enums, error shapes).
3. Reuse the existing client in `src/clients` and builders/fixtures in
   `src/models` and `src/data`. Do not reinvent them and do not call `fetch`
   directly from a test.
4. Place the test in `tests/<resource>.test.js`.
5. Write one happy-path test plus a negative test for each validation rule listed
   in the coverage table in `STANDARDS.md`.
6. Run `npm test`. If a test fails, read the response body and fix the test.

## Non-negotiable rules
- Assert the response body, not just the status code.
- Always test the failure path, and assert the error names the field and carries a hint.
- Use behaviour-based test names ("rejects a lowercase size with 422").
- Tests are independent: use fixtures/builders, never a hardcoded URL.

## TODO (attendees complete these live)
- Rule: what edge cases must ALWAYS be covered when testing a new endpoint?
- Rule: how should tests handle authentication and headers once the API adds them?
- Rule: when is it acceptable to weaken or skip an assertion? (hint: it isn't)
