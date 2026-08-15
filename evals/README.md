# Tiny evals

Small, fast checks that measure quality - used to justify the model choice for
each agent (see `COST-AND-MODELS.md`). Not a framework, just enough to prove a
cheaper model still clears the bar.

## 1. Contract rules (runnable, deterministic) - the ground truth

Fires all 8 documented bad payloads at the API and confirms each is rejected with
422 and the right field. This is the ground truth a generated suite must match.

```bash
node evals/contract-rules.mjs
```

- **Green** = the contract enforces every rule.

## 2. Coverage check (the AUTHOR eval)

Reads a generated test file and checks every rule in the STANDARDS coverage table
has a negative test. This is the evidence that justifies running the author on a
cheaper model - if the cheaper model's suite still covers all 8, the downgrade is safe.

```bash
node evals/coverage-check.mjs                 # checks tests/orders.test.js
```

- Expect **RED (0/8)** on the bare starter and **GREEN (8/8)** after the author
  generates the full suite. That red -> green is the proof the author did its job.

## 3. Seeded violations (reviewer eval)

`seeded-violations.test.js` deliberately breaks three STANDARDS rules
(status-only assertion, no failure-path test, hardcoded URL). Run the reviewer
agent against it:

> Use the reviewer agent to check evals/seeded-violations.test.js.

- **Pass** = the reviewer reports all three violations.
- If a cheaper model misses any, keep the reviewer on the stronger model. That is
  the eval justifying the reviewer's `model:` setting.

## How this ties to cost

For each agent you move to a cheaper model, run its eval. Keep the downgrade only
if the eval still passes. Downgrade, measure, decide - never guess.
