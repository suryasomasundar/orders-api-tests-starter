---
name: api-discovery
description: How to read the Orders API OpenAPI spec via the Swagger MCP and summarize endpoints, fields, enums, and error shapes. Read-only. Use before planning tests.
---

# API discovery

Given a resource or endpoint, use the Swagger MCP tools to return a compact,
accurate description of the API surface the other agents need.

Steps:
1. Read the spec. Prefer the Swagger MCP tools (`mcp__orders-api__*`) if they are
   available in your tool set. If they are NOT available (subagent tool scoping),
   fall back to fetching the spec directly: `curl` the OPENAPI_SPEC_PATH URL
   (https://orders-api-workshop.onrender.com/openapi.json) and parse the JSON.
   State which method you used.
2. Extract: method, path, required fields with types and enum values, the success
   response shape, and every documented error (status code + what triggers it).
3. Return a compact, structured summary.

Rules:
- Read-only. Never create, update, or delete. Do not create real orders.
- For POST /api/orders, call out the traps: size is an uppercase enum
  (SMALL/REGULAR/LARGE); fulfillment is a nested object, not a string.
- The fallback needs Bash. If neither the MCP tools nor Bash are available, say so
  clearly rather than guessing the spec.
