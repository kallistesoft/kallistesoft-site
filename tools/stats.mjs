// Reads the anonymous event logs of the free web tools (hit.php → stats.php) and prints,
// per site, what visitors did: the step funnel, results, buttons, and (once ads run) ad slots.
// Run: node tools/stats.mjs [quiz|cnp] [days, default 14]
// The read key is ~/.config/kallistesoft/stats.key (stats.php holds its SHA-256).
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const sites = process.argv[2] ? [process.argv[2]] : ["quiz", "cnp"];
const days = Number(process.argv[3] || 14);
const key = readFileSync(`${homedir()}/.config/kallistesoft/stats.key`, "utf8").trim();
const day = (d) => d.toISOString().slice(0, 10);
const from = day(new Date(Date.now() - (days - 1) * 864e5));

const count = (list, by) => list.reduce((m, x) => m.set(by(x), (m.get(by(x)) || 0) + 1), new Map());
const median = (xs) => (xs.length ? xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0);
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)} %` : "–");
const table = (map, label) => {
  const rows = [...map].sort((a, b) => b[1] - a[1]);
  if (rows.length) console.log(`  ${label}: ` + rows.map(([k, n]) => `${k} ${n}`).join(" · "));
};

for (const site of sites) {
  const res = await fetch(`https://kallistesoft.ca/stats.php?s=${site}&from=${from}`, { headers: { "X-Stats-Key": key } });
  if (!res.ok) throw new Error(`${site}: HTTP ${res.status}`);
  const events = (await res.text()).split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const of = (e) => events.filter((x) => x.e === e);
  console.log(`\n${site} — last ${days} days (since ${from}): ${events.length} events`);
  table(count(events, (x) => x.e), "events");

  // Funnel: views and answers per step, median seconds spent, and how many went back.
  const views = count(of("step_view"), (x) => x.p.step);
  const answers = of("step_answer");
  const backs = count(of("step_back"), (x) => x.p.step);
  const first = views.get(1) || 0;
  if (views.size) {
    console.log("  step  views  kept   answered  median s  back");
    for (const step of [...views.keys()].sort((a, b) => a - b)) {
      const a = answers.filter((x) => x.p.step === step);
      const ms = median(a.map((x) => x.p.ms).filter((m) => typeof m === "number"));
      console.log(`  ${String(step).padStart(4)}  ${String(views.get(step)).padStart(5)}  ${pct(views.get(step), first).padStart(5)}  ${String(a.length).padStart(8)}  ${(ms / 1000).toFixed(1).padStart(8)}  ${backs.get(step) || 0}`);
    }
  }
  const results = of("result_view");
  if (results.length) {
    console.log(`  results: ${results.length} (${pct(results.length, first)} of step 1 views)`);
    table(count(results, (x) => x.p.result), "result");
    table(count(results, (x) => x.p.via ?? "–"), "via");
  }
  table(count(of("cta_click"), (x) => x.p.cta), "buttons");
  table(count(of("share"), (x) => x.p.method), "shares");

  // Ads (Phase B/C): viewability per slot and rewarded outcomes.
  const seen = count(of("ad_slot_visible"), (x) => x.p.slot);
  const filled = count(of("ad_slot_filled").filter((x) => x.p.filled), (x) => x.p.slot);
  for (const [slot, n] of seen) console.log(`  ad ${slot}: ${n} seen, ${filled.get(slot) || 0} filled`);
  table(count(of("reward_result"), (x) => `${x.p.arm ?? ""}:${x.p.status}`), "rewarded");
}
