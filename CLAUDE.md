# kallistesoft.ca (`kallistesoft/kallistesoft-site`)

The studio site: a professional software, mobile-app and website studio (not a game studio). Plain HTML, no build,
FR at `/`, EN at `/en/`, every page in both languages. Also hosts the shared `deploy-ftp.yml` that EVERY site repo
calls: a change there affects all sites.

## Check, preview, deploy
- Check: `tools/check.sh` (one shared `?v=` per asset across pages, every `sitemap.xml` URL exists). The global pre-push hook runs it.
- Whenever `assets/style.css` or `assets/site.js` changes, bump `?v=YYYYMMDD` in EVERY page (one sed over `*.html`):
  GoDaddy sends no Cache-Control and browsers keep stale files.
- Add every new indexable page to `sitemap.xml`. Keep the shared header identical on every page.
- Preview: `python3 -m http.server`; phone sizes with puppeteer-core from `~/Sources/Repos/guidehunter-site/node_modules`.
- Deploy: every push to `main` uploads over FTPS (`deploy-godaddy.yml`). Branches don't deploy.
- Stats for cnp/quiz: `hit.php` / `stats.php`, read with `node tools/stats.mjs [quiz|cnp] [days]`.

## Rules (owner)
- New products go in as a `.card.feature` (text column + `.device` mockup) like GuideNord / Ottavi, first in
  Réalisations/Work; never a bespoke hero band. Extra media behind a button/modal.
- A game released on a store gets a card in Jeux (`#jeux` ↔ `#games`); the others stay in the Labo strip.
- Copy says "développeur senior", never "ingénieur". Real apps first, games secondary. Nocturne theme, light + dark.
- Nothing confidential: LawyerTool is client work shown without naming the client; no personal gmail. Contact is contact@kallistesoft.ca.
- Never touch the mail DNS records (MX, SPF, DKIM, DMARC) or the Search Console TXT record.

## Branches and PRs
- Ruleset "Protect main": PR with approval required. Feature branch → push → PR against `main` (never stacked);
  the owner merges through the bypass. Never `gh pr merge`, never `--admin`, never push to `main`.

## Autonomy, to-dos, decisions
- Show rendered mock-ups before any visual change and wait for the owner's pick.
- No to-do file yet: `FOLLOW-UP.md` when needed. Non-blocking choices: `DECISIONS.md`, with the default taken.
