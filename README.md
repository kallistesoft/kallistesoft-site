# kallistesoft.ca

Static site for Kallistesoft, hosted on the GoDaddy web hosting at https://kallistesoft.ca. Every push to `main` uploads it over FTPS (`.github/workflows/deploy-godaddy.yml`, which calls the shared `deploy-ftp.yml` that every site repo uses).

- French at `/`, English at `/en/`. Every page exists in both languages: `block-daily/` ↔ `en/block-daily/`, `unarrow/` ↔ `en/unarrow/`, `void-raid/` ↔ `en/void-raid/` (likewise `neon-pop/`, `neon-snake/`, `neon-stack/`), `confidentialite/` ↔ `en/privacy/`, `audit-equipe/` ↔ `en/team-audit/` (dev-team audit and coaching offer).
- The home page opens in the browser's language: `.htaccess` sends `/` to `/en/` unless `Accept-Language` starts with `fr`. Clicking a FR/EN link stores a `lang` cookie (`site.js`) that overrides this; requests with no `Accept-Language`, like crawlers, stay at `/`.
- Plain HTML, one stylesheet (`assets/style.css`) and one small script (`assets/site.js`, the light/dark switch), with no build step. Push to `main` to publish.
- Light and dark themes: each page's `<head>` has a one-line inline script that sets `<html data-theme>` before paint (the visitor's stored choice, else the system setting). `site.js` drives the sun/moon button in the header and remembers the choice in `localStorage`. Colours are CSS variables at the top of `style.css`, defined once per theme.
- Every page shares the same header (logo, Services / Réalisations / Jeux / Approche / Équipes, language link, theme button, Contact). Keep it identical when adding a page.
- Home page: a game released on a store gets a card in the Jeux section (`#jeux` ↔ `#games`). The others stay in the Labo strip under Réalisations until they ship.
- `sitemap.xml` lists every indexable page. Add a new page there; redirect and `noindex` pages stay out.
- Preview locally: `python3 -m http.server` and open http://localhost:8000.
