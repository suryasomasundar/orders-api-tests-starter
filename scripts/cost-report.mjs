// Cost report: what did the last pipeline run cost, per agent and per model?
//
// Reads Claude Code's local transcripts (~/.claude/projects/...) for this
// project, adds up the tokens each agent used, and prices them. Zero deps.
//
//   node scripts/cost-report.mjs                 # latest session in this folder
//   node scripts/cost-report.mjs --all           # every session in this folder
//   node scripts/cost-report.mjs --session <id>  # one specific session
//   node scripts/cost-report.mjs --dir /path/to/project
//
// Prices are API list prices in USD per million tokens. If you are on a Pro or
// Max plan you are not billed per token; read the result as "what this would
// cost on the API". Check current prices before quoting numbers.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const PRICES = {
  // model prefix: input, output, cache read
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-haiku-4-5": { input: 1, output: 5, cacheRead: 0.1 },
};
// Cache writes are priced as a multiple of the input price.
const CACHE_WRITE_5M = 1.25;
const CACHE_WRITE_1H = 2;

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const projectDir = flag("--dir") || process.cwd();
const transcriptsDir = join(
  homedir(),
  ".claude",
  "projects",
  projectDir.replace(/[^a-zA-Z0-9]/g, "-")
);

if (!existsSync(transcriptsDir)) {
  console.error(`No Claude Code transcripts found for ${projectDir}`);
  console.error(`(looked in ${transcriptsDir})`);
  process.exit(2);
}

const sessions = readdirSync(transcriptsDir)
  .filter((f) => f.endsWith(".jsonl"))
  .map((f) => ({ id: f.slice(0, -6), mtime: statSync(join(transcriptsDir, f)).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime);

if (args.includes("--list")) {
  console.log(`Sessions for ${projectDir}, newest first:\n`);
  for (const s of sessions) {
    const subDir = join(transcriptsDir, s.id, "subagents");
    const agents = existsSync(subDir)
      ? readdirSync(subDir).filter((f) => f.endsWith(".meta.json")).map((f) => {
          try { return JSON.parse(readFileSync(join(subDir, f), "utf8")).agentType; } catch { return "?"; }
        })
      : [];
    const when = new Date(s.mtime).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
    console.log(`${s.id.slice(0, 8)}  ${when.padEnd(18)} ${agents.length ? agents.join(", ") : "(no agents)"}`);
  }
  console.log("\nThen: node scripts/cost-report.mjs --session <first 8 characters>");
  process.exit(0);
}

let selected;
if (args.includes("--all")) selected = sessions;
else if (flag("--session")) selected = sessions.filter((s) => s.id.startsWith(flag("--session")));
else selected = sessions.slice(0, 1);

if (selected.length === 0) {
  console.error("No matching session.");
  process.exit(2);
}

function priceFor(model) {
  const key = Object.keys(PRICES).find((p) => model?.startsWith(p));
  return key ? PRICES[key] : null;
}

// Roughly 4 characters per token for English text and code.
const CHARS_PER_TOKEN = 4;

// One API response is written to the transcript once per content block, and
// the usage saved with it is a snapshot from the START of the response: input
// and cache counts are exact, but output_tokens is far too low. So output is
// estimated from the size of everything the response actually produced.
function readUsage(file) {
  const byId = new Map();
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line) continue;
    let rec;
    try { rec = JSON.parse(line); } catch { continue; }
    const msg = rec.message;
    if (!msg || typeof msg !== "object" || !msg.usage) continue;
    const id = msg.id || `${file}:${byId.size}`;
    const entry = byId.get(id) || { model: msg.model, sidechain: rec.isSidechain === true, usage: msg.usage, chars: 0 };
    for (const c of Array.isArray(msg.content) ? msg.content : []) {
      entry.chars += (c.text || "").length + (c.thinking || "").length + (c.input ? JSON.stringify(c.input).length : 0);
    }
    entry.usage = msg.usage;
    byId.set(id, entry);
  }
  return [...byId.values()].map((e) => ({
    ...e,
    usage: { ...e.usage, output_tokens: Math.max(e.usage.output_tokens || 0, Math.ceil(e.chars / CHARS_PER_TOKEN)) },
  }));
}

const rows = new Map(); // "agent|model" -> totals
function add(agent, { model, usage }) {
  if (!model || model === "<synthetic>") return;
  const key = `${agent}|${model}`;
  const r = rows.get(key) || { agent, model, input: 0, cacheWrite: 0, cacheRead: 0, output: 0, cost: 0, priced: true };
  const cw5 = usage.cache_creation?.ephemeral_5m_input_tokens ?? usage.cache_creation_input_tokens ?? 0;
  const cw1 = usage.cache_creation?.ephemeral_1h_input_tokens ?? 0;
  r.input += usage.input_tokens || 0;
  r.cacheWrite += cw5 + cw1;
  r.cacheRead += usage.cache_read_input_tokens || 0;
  r.output += usage.output_tokens || 0;
  const p = priceFor(model);
  if (p) {
    r.cost +=
      ((usage.input_tokens || 0) * p.input +
        cw5 * p.input * CACHE_WRITE_5M +
        cw1 * p.input * CACHE_WRITE_1H +
        (usage.cache_read_input_tokens || 0) * p.cacheRead +
        (usage.output_tokens || 0) * p.output) / 1e6;
  } else {
    r.priced = false;
  }
  rows.set(key, r);
}

for (const s of selected) {
  const subDir = join(transcriptsDir, s.id, "subagents");
  const hasSubagentFiles = existsSync(subDir);

  // The main conversation is the orchestrator (the "head chef").
  for (const u of readUsage(join(transcriptsDir, `${s.id}.jsonl`))) {
    if (u.sidechain && hasSubagentFiles) continue; // counted from subagent files
    add(u.sidechain ? "subagent (unknown)" : "main session", u);
  }

  // Each subagent run has its own transcript plus a .meta.json naming the agent.
  if (hasSubagentFiles) {
    for (const f of readdirSync(subDir).filter((f) => f.endsWith(".jsonl"))) {
      let agent = "subagent (unknown)";
      try {
        agent = JSON.parse(readFileSync(join(subDir, f.replace(/\.jsonl$/, ".meta.json")), "utf8")).agentType || agent;
      } catch {}
      for (const u of readUsage(join(subDir, f))) add(agent, u);
    }
  }
}

const k = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
const usd = (n) => `$${n.toFixed(3)}`;
const shortModel = (m) => m.replace(/^claude-/, "").replace(/-\d{8}$/, "");

const list = [...rows.values()].sort((a, b) => b.cost - a.cost);
const total = list.reduce((t, r) => t + r.cost, 0);

console.log(
  `Cost report: ${selected.length === 1 ? `session ${selected[0].id.slice(0, 8)}` : `${selected.length} sessions`}  (${projectDir})\n`
);
console.log(
  ["Agent".padEnd(20), "Model".padEnd(16), "Input".padStart(8), "Cache wr".padStart(9), "Cache rd".padStart(9), "Output".padStart(8), "Cost".padStart(9), "Share".padStart(6)].join(" ")
);
for (const r of list) {
  console.log(
    [
      r.agent.padEnd(20),
      shortModel(r.model).padEnd(16),
      k(r.input).padStart(8),
      k(r.cacheWrite).padStart(9),
      k(r.cacheRead).padStart(9),
      k(r.output).padStart(8),
      (r.priced ? usd(r.cost) : "no price").padStart(9),
      (total ? `${Math.round((r.cost / total) * 100)}%` : "-").padStart(6),
    ].join(" ")
  );
}
console.log(`\nTotal: ${usd(total)}  (API list prices; cache writes at ${CACHE_WRITE_5M}x/${CACHE_WRITE_1H}x input)`);
console.log("Output is estimated from what was written; hidden thinking is not counted. Use /cost for the exact session total.");

// What-if: the same tokens, all on Opus. This is the "one model for everything" baseline.
const opus = PRICES["claude-opus-5-5"];
const allOpus = list.reduce(
  (t, r) => t + (r.input * opus.input + r.cacheWrite * opus.input * CACHE_WRITE_5M + r.cacheRead * opus.cacheRead + r.output * opus.output) / 1e6,
  0
);
if (allOpus > 0) {
  console.log(`Same tokens, all on opus-5-5: ${usd(allOpus)}  (mixed models save ${Math.round((1 - total / allOpus) * 100)}%)`);
}
if (list.some((r) => !r.priced)) {
  console.log("Some models have no price in PRICES; add them at the top of this script.");
}
