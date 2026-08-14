# The agent pipeline

How the agents coordinate to turn one request into reviewed, passing, PR-ready
tests. Each agent is a file in `.claude/agents/`. Each does one job and hands its
output to the next.

## Order and handoffs

| # | Agent | Does | Hands off |
|---|---|---|---|
| 1 | preflight | Is the environment ready? | READY / NOT READY |
| 2 | discovery | Read the spec via MCP | endpoint contract |
| 3 | planner | Plan tests + file placement | test plan |
| 4 | author | Write the tests (loads the api-test-authoring skill) | test file |
| 5 | reviewer | Check against STANDARDS.md | APPROVED / violations |
| 6 | repair | Run suite + regression, fix failures | green suite |
| 7 | coverage-advisor | Suggest missing coverage | prioritized gaps |
| 8 | pre-pr | Assemble diff + PR draft (does not push) | PR text |

## Two ways to run it

- **Manual (best for teaching):** invoke each agent in order in the Claude Code
  panel. For example: "Use the discovery agent to read POST /api/orders", then
  "Use the planner agent to plan its tests", and so on. You see every step.
- **Orchestrated (production):** ask the main agent "Run the full test pipeline
  for POST /api/orders" and it delegates to each subagent in order.

## The rule that keeps it honest

Author writes, Reviewer checks independently, Repair fixes without weakening
assertions, Coverage advisor finds what is missing. No single agent both writes
its own tests and blesses them. That separation is why the output can be trusted.
