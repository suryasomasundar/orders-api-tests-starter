---
name: api-preflight
description: Checklist to verify the environment is ready before generating API tests (repo, tooling, MCP/API reachability, framework files, git). Use at the start of the pipeline.
---

# Preflight check

Confirm the environment is ready before any tests are generated. Report a
checklist. Do not fix or write code.

## Core checks (these gate READY)
1. Node 20+ (`node --version`).
2. Git available, this is a repo, and a remote exists (`git status`, `git remote -v`).
3. Framework files present: ARCHITECTURE.md, STANDARDS.md, config.js, src/clients, src/data.
4. The test runner works (`npm test` runs at all, even if some tests fail).
5. API and spec reachable (curl the /health and /openapi.json URLs from config.js).
6. Zero npm dependencies expected (no install needed).
7. The Swagger MCP (`orders-api`) is present in .mcp.json.

## GitHub checks (ADVISORY - for the PR / triage demo, do NOT gate READY)
Report these, but their absence does not make the environment NOT READY, because
the core hands-on pipeline only needs the Swagger MCP.
8. The `github` MCP server is present in .mcp.json.
9. A GitHub token is available: report whether `GITHUB_PERSONAL_ACCESS_TOKEN` is
   set in the environment. Report ONLY present or absent. NEVER print, echo, or
   log the token value.
10. The gh CLI is authenticated (`gh auth status`), which the pre-pr agent uses.

Output one line per check:  `[ok]/[FAIL]/[skip]  <check>  <detail>`
Group the output under "Core" and "GitHub (demo)".
End with READY or NOT READY based on the CORE checks only, then list what is
missing and the command to fix it. If a GitHub check fails, note it as a demo
prerequisite, not a blocker.
