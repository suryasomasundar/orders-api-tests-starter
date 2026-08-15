---
description: Fast, scoped demo run - 4 agents, about 5 minutes. For live workshop demos.
---

Run a FAST, scoped test-generation demo for: $ARGUMENTS

Goal: finish in about five minutes for a live audience. Delegate to only these
agents, in order, and report briefly after each:

1. preflight - stop the run if it reports NOT READY.
2. discovery - read the contract (Swagger MCP, or the direct-fetch fallback).
3. author - write ONLY the happy path plus the top 2-3 negative cases, not the
   full coverage table. Reuse the existing client, builders, and fixtures. Follow
   ARCHITECTURE.md and STANDARDS.md.
4. repair - run `npm test`, fix failures without weakening assertions.

Skip planner, reviewer, coverage-advisor, and pre-pr for speed. At the end, say
clearly that this was a scoped demo run, and that the full pipeline
(`/run-pipeline`) adds planning, independent review, and coverage analysis.

If no endpoint is given in $ARGUMENTS, ask which one.
