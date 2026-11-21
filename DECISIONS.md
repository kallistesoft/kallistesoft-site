# Decisions

Non-blocking choices Claude made with its default; owner validates later. When a choice isn't blocking, write it
here with the default taken and keep working; ask only when it blocks.

| Date | Decision | Default taken | Status |
|---|---|---|---|
| 2026-11-21 | What `tools/check.sh` checks (no build step) | every page loads `style.css` and `site.js` with one shared `?v=` each, and every `sitemap.xml` URL exists | to validate |
| 2026-11-21 | CanImmiKit home card without screenshots or product page | `.card.feature` first in Réalisations/Work with the store icon on the right (Mathnut layout), "coming soon" store badges, independence note; swap in screenshots + store links when published | to validate |
| 2026-11-21 | CanImmiKit legal URLs | the app links to `/canimmikit/privacy` + `/canimmikit/terms` (one URL, both languages): language redirect in `.htaccess` + JS fallback page, like Mathnut; the real pages follow the per-app pattern (`/confidentialite/canimmikit/` etc.) | to validate |
