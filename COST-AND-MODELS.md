# Cost and model strategy

An honest account of what this pipeline costs to run, and how to cut that cost by
matching each agent to the right model - without losing quality.

> The dollar figures below are ILLUSTRATIVE placeholders to show the method.
> Fill in your real numbers: run the pipeline, then `/cost` in Claude Code for
> the session total, and read each subagent's reported token usage per stage.

## How cost works

You pay per token: text in (the skill + ARCHITECTURE.md + STANDARDS.md the agent
reads) and text out (what it writes). A 7-agent pipeline re-reads the docs seven
times and the author stage produces a lot of output, so cost is uneven across
stages.

Get the numbers two ways:
- `/cost` - session total (tokens + dollars).
- Each subagent result prints its own token usage (for example `subagent_tokens: 33993`).

## Baseline: one model for everything

Running all agents on the top model (Opus):

| Stage | ~Tokens | ~Cost (Opus) |
|---|---|---|
| preflight | 35k | $$ |
| discovery | 40k | $$ |
| planner | 50k | $$$ |
| author | 120k | $$$$ |
| reviewer | 40k | $$$ |
| repair | 50k | $$$ |
| coverage-advisor | 35k | $$ |
| **Full run** | **~370k** | **$X (baseline)** |

The author stage dominates. The mechanical stages (preflight, pre-pr) are paying
Opus prices for work a small model does fine.

## Optimized: the right model per agent

Rule of thumb: **match the model to the reasoning depth and the cost of a
mistake.** Mechanical -> cheap. Judgment where a wrong call ships bad tests -> strong.

| Agent | Model | Why |
|---|---|---|
| preflight | **haiku** | mechanical checks, deterministic |
| discovery | **sonnet** | structured extraction; wrong contract -> bad tests |
| planner | **opus** | judgment; missed coverage is expensive |
| author | **sonnet** | strong code-gen, big token volume, ~5x cheaper than Opus |
| reviewer | **opus** | independent judgment; the safety net |
| repair | **sonnet** | debugging, moderate |
| coverage-advisor | **sonnet** | advisory, low blast radius |
| triage | **sonnet** | reasoning + clear writing |
| pre-pr | **haiku** | mechanical |

Only the two judgment-critical agents (planner, reviewer) keep the expensive
model. Everything else drops to sonnet or haiku. Because haiku is ~10-20x cheaper
and sonnet ~5x cheaper than opus, moving 7 of 9 agents off opus typically cuts the
run cost by well over half while keeping quality where it matters.

This is set in one line per agent - the `model:` field in `.claude/agents/*.md`.

## How you KNOW the cheaper model is safe: evals

Downgrading a model risks silently worse output. So you eval each agent at the
point you downgrade it - keep the downgrade only if it still clears the bar. See
`evals/`.

| Agent | The eval that justifies the model |
|---|---|
| author | generated suite still passes AND covers every STANDARDS rule (`evals/coverage-check.mjs`) |
| reviewer | catches all seeded violations in `evals/seeded-violations.test.js` |
| discovery | extracted schema matches the known spec (fields, enums, errors) |
| repair | fixes a known-broken test without weakening the assertion |

"You don't guess the model per agent. You downgrade, run the eval, and keep it
only if the eval passes." That is eval-driven model selection.

## The levers, in order of impact

1. **Right-size the model per agent** (above) - usually the biggest win.
2. **Prompt caching** - the docs are re-read every stage; caching cuts input tokens.
3. **Fewer agents / scoped cases** - `/fast-demo` (4 agents) vs `/run-pipeline` (7).
4. **Shorter skills and prompts** - less input per call.

## Bottom line for the talk

State the baseline cost, show the per-agent model table, state the optimized cost,
and show the eval that proves the cheap model still passes. That is the honest
cost-and-limits story: it is not free, but it is measurable and tunable.
