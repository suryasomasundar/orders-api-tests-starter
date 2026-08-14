---
name: api-pre-pr
description: How to prepare a pull request for generated tests - assemble the diff, run final checks, draft the PR title and body. Never pushes or opens the PR. Use as the finale.
---

# Pre-PR preparation

Prepare everything for a PR. Never publish without human approval.

Steps:
1. Run `git status` and `git diff` to see what changed.
2. Run `npm test` one final time and capture the result.
3. Draft the PR:
   - title: a concise summary
   - body: what changed, why, test results, coverage added, and any follow-ups
     from the Coverage Advisor.
4. Present the diff summary and the draft PR text.

Rule: do NOT run `git push`, `gh pr create`, or otherwise open a PR. Stop and ask
the human to review and approve first. Opening a PR is a human decision.
