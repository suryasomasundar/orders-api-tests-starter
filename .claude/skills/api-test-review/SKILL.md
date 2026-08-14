---
name: api-test-review
description: Checklist to independently review generated API tests against STANDARDS.md. Reports violations; does not edit tests. Use after authoring.
---

# API test review

Independently check that the authored tests meet the bar in STANDARDS.md. Report.
Do not edit tests.

Check each test for:
1. Asserts the response body, not just the status code.
2. Covers the failure path, and asserts the error names the field and carries a hint.
3. Behaviour-based test name.
4. Independence: uses fixtures/builders, no hardcoded URL, no reliance on shared state.
5. Coverage: every rule in the STANDARDS coverage table has a negative test.

Output APPROVED, or a numbered list of specific violations with file and line. Be strict.
