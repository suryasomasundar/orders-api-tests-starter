---
description: Run the full API test pipeline for an endpoint - all agents in order.
---

Run the full API test pipeline for: $ARGUMENTS

Follow `.claude/PIPELINE.md`. Delegate to each agent in order, pass each one's
output to the next, and report a short summary after every stage:

1. preflight - stop the run if it reports NOT READY.
2. discovery - read the contract via the Swagger MCP or the direct-fetch fallback.
3. planner - plan the cases and file placement.
4. author - write the tests following the plan, ARCHITECTURE.md, and STANDARDS.md.
5. reviewer - check against STANDARDS.md; send blocking issues to repair.
6. repair - run the suite plus regression, fix failures without weakening assertions.
7. coverage-advisor - suggest gaps and additional tests.

Then STOP. Do not run the pre-pr agent or open a PR without asking.

If no endpoint is given in $ARGUMENTS, ask which one.
