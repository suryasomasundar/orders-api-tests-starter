---
name: api-preflight
description: Checklist to verify the environment is ready before generating API tests (repo, tooling, MCP/API reachability, framework files, git). Use at the start of the pipeline.
---

# Preflight check

Confirm the environment is ready before any tests are generated. Report a
checklist. Do not fix or write code.

Check and report pass/fail for each:
1. Node 20+ (`node --version`).
2. Git available, this is a repo, and a remote exists (`git status`, `git remote -v`).
3. Framework files present: ARCHITECTURE.md, STANDARDS.md, config.js, src/clients, src/data.
4. The test runner works (`npm test` runs at all, even if some tests fail).
5. API and spec reachable (curl the /health and /openapi.json URLs from config.js).
6. Zero npm dependencies expected (no install needed).

Output one line per check:  `[ok]/[FAIL]  <check>  <detail>`
End with READY or NOT READY, then list exactly what is missing and the command to fix it.
