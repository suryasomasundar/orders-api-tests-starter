---
name: api-test-planning
description: How to plan which API tests to write for an endpoint - file placement and the list of cases - from the architecture and standards. Use after discovery, before authoring.
---

# API test planning

Turn a request (plus the discovery summary) into a concrete test plan. Do not
write tests.

Steps:
1. Read ARCHITECTURE.md (structure, file placement) and STANDARDS.md (coverage
   table, the bar).
2. Check existing tests/ so you do not duplicate coverage.
3. Produce a plan:
   - the target file path, per ARCHITECTURE.md (for example tests/orders.test.js)
   - the test cases: one happy path, plus one negative per validation rule in the
     STANDARDS coverage table
   - which client, builders, and fixtures to reuse

Output the plan as a numbered list.
