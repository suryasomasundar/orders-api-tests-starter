---
name: api-discovery
description: How to read the Orders API OpenAPI spec via the Swagger MCP and summarize endpoints, fields, enums, and error shapes. Read-only. Use before planning tests.
---

# API discovery

Given a resource or endpoint, use the Swagger MCP tools to return a compact,
accurate description of the API surface the other agents need.

Steps:
1. Use the MCP tools to read the spec (list endpoints, get each schema).
2. Extract: method, path, required fields with types and enum values, the success
   response shape, and every documented error (status code + what triggers it).
3. Return a compact, structured summary.

Rules:
- Read-only. Never create, update, or delete. Do not create real orders.
- For POST /api/orders, call out the traps: size is an uppercase enum
  (SMALL/REGULAR/LARGE); fulfillment is a nested object, not a string.
