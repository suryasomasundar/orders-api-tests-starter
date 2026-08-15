---
name: api-failure-triage
description: How to read a red CI run and explain the root causes in plain language a product manager could read. Groups failures by cause, separates real bugs from test/infra issues, and recommends a fix per group. Use for failure analysis.
---

# API failure triage

Turn a red CI run into a short, plain-language explanation of what actually went
wrong. The audience is a product manager, not an engineer. No stack traces, no
jargon.

## Steps
1. Read the failing run (for example `fixtures/failed-run.json`, or the output of
   `npm test`).
2. GROUP the failures by root cause, not by test. Several tests failing for one
   reason is one problem, not many.
3. For each group, classify it:
   - product/contract change (the API now behaves differently on purpose)
   - test issue (the test is stale or wrong, the API is fine)
   - infrastructure/flake (timeout, 503, cold start - not a code problem)
4. For each group, write: what broke, why, how many tests it explains, and the
   one recommended fix.
5. End with a one-line "bottom line" a PM can act on.

## Rules
- Lead with the root cause, not the symptom. "Tests used a past date; the API now
  requires a future date" beats "3 tests returned 422".
- Say how confident you are, and flag anything you could not confirm.
- Do not fix anything. This is analysis. Hand fixes to the repair agent.

## Output shape
For each group:
- **What happened** (plain language)
- **Root cause**
- **Tests affected** (count + names)
- **Type** (contract change / test issue / infra)
- **Recommended fix**

Then: **Bottom line:** one sentence.
