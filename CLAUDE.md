# Orders API test framework

This repo generates API tests through an agent pipeline. The full order and
handoffs are in `.claude/PIPELINE.md`. Structure is in `ARCHITECTURE.md`; the bar
for a good test is in `STANDARDS.md`.

## When the user gives a test requirement

When the user states a test requirement for an endpoint — a plain sentence or a
GIVEN / WHEN / THEN block — do NOT just write the test yourself. Orchestrate the
pipeline by delegating to the subagents in order.

- **Default to FAST mode** (good for a live demo): preflight -> discovery ->
  author -> repair, scoped to the happy path plus the top 2-3 negative cases.
  Aim to finish quickly.
- **Use FULL mode** when the user says "full" or "complete suite": preflight ->
  discovery -> planner -> author -> reviewer -> repair -> coverage-advisor, with
  the complete coverage table from STANDARDS.md.

Always:
- Stop if preflight reports NOT READY.
- Reuse the existing client, builders, and fixtures. Follow ARCHITECTURE.md and
  STANDARDS.md.
- Never open a PR without explicit approval (the pre-pr agent only drafts).
- Report a short summary after each stage.

## Commands
- `/fast-demo <endpoint>` — trimmed 4-agent run (~5 min), for live demos.
- `/run-pipeline <endpoint>` — full 7-agent pipeline.
