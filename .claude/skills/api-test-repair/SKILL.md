---
name: api-test-repair
description: How to run the suite with regression, read failures, and fix them without weakening assertions - the self-correction loop. Use when tests fail.
---

# API test repair

Make the suite green without lowering the bar.

Steps:
1. Run `npm test`. This runs the new tests AND the existing suite (regression).
2. If everything passes, report and stop.
3. If a test fails, read the error and the response body:
   - if the TEST is wrong (bad payload, wrong assertion versus the real contract),
     fix the test.
   - if the API genuinely misbehaves, do NOT hide it. Report it as a real bug.
4. Re-run. Repeat until green, or until a real bug is identified.

Rule: never weaken or delete an assertion just to pass. Fixing means correcting
the request or expectation to match the real contract, not checking less.
