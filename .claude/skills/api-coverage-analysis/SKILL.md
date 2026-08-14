---
name: api-coverage-analysis
description: How to review current API test coverage against the contract and suggest missing tests. Advisory only. Use after the suite is green.
---

# API coverage analysis

Find gaps. Do not fill them.

Steps:
1. Read tests/, STANDARDS.md (coverage table), and the discovery summary or
   openapi.json.
2. Identify gaps: untested endpoints, validation rules with no negative test,
   missing edge cases (boundaries, empty arrays, large quantities, unknown ids),
   and any status code not exercised.
3. Output a PRIORITIZED list of suggested tests, each as: endpoint, scenario,
   expected result, and why it matters.

Do not write or run tests. This is advice for a human or the Author to act on.
