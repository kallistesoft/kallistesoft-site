---
name: blog-article
description: Write bilingual (FR + EN) blog articles for kallistesoft.ca - short 2-3 minute reads on AI (Claude, ChatGPT, Gemini, AI for video, development, social networks), what's new in Android/iOS, web and mobile development, and security. Picks topics by what is not yet covered and how fresh the official sources are, writes both languages with inline SVG images and verified sources, updates the blog index and sitemap, and opens one PR. Use when the owner says "write an article", "new blog post", "article du jour", or when the daily blog routine runs.
---

# blog-article

Goal: genuinely useful, original articles that make kallistesoft.ca worth an AdSense approval
(rejected 2026-11-28 for "low value content"). Quality and accuracy beat volume.

## Inputs
- How many articles (default 2 per day, each FR + EN = 4 pages) and optional themes. With no theme, choose by step 2.

## Themes
Primary: AI in general; Claude; ChatGPT; Gemini; AI for video; AI for software development; AI for social networks;
what's new in mobile (Android and/or iOS).
Secondary (when the primary ones are saturated): web development, mobile development practices (Flutter, Swift,
Kotlin, store publishing), security (app/web, secrets, auth, OWASP, privacy).
Two articles of one run are on two different themes.

## Steps
1. `git checkout main && git pull`. If `blog/index.html` is missing the blog is not merged yet: stop and say so.
   Read `blog/index.html` and the titles of `blog/*/`, then read ONE existing article in full and copy its
   structure exactly: head (title, description, hreflang fr-CA/en-CA, canonical, og, JSON-LD Article), shared header and
   footer (same `?v=` stamps), `<main class="legal">` with h1, byline `Par Kallistesoft · <time> · Lecture : 3 min`
   (EN `By Kallistesoft · … · 3 min read`), h2 sections, hero SVG, one diagram SVG in `<figure>`+`<figcaption>`,
   `Sources`, `À lire aussi / Related reading`.
2. Prioritise topics: (1) themes least covered so far, (2) freshness and relevance of the sources today
   (WebSearch release notes, official blogs, changelogs), (3) usefulness for developers and small businesses in
   Canada/Quebec. Prefer practical angles ("how to use X for Y", "what changed and what to do") over hype. Never repeat or lightly
   rephrase an existing article; a follow-up on a real new development is fine.
3. Write each article in Quebec French at `/blog/<fr-slug>/index.html` and an English adaptation (not word for word) at
   `/en/blog/<en-slug>/index.html`. **550-750 words** (2-3 min read), counted on the `<main>` text without SVG.
   Concrete advice, one checklist/table/pitfall list, a short snippet when useful.
4. Accuracy: every product or news claim comes from an official page fetched today (vendor docs, release notes,
   developer blogs). Write `Information vérifiée le <date>` / `Information checked on <date>` for news. Never invent
   features, versions, dates, prices, benchmarks or quotes; if a source is unclear, drop the claim. Claude, ChatGPT
   and Gemini pieces are balanced and factual, never promotional. No ads, no affiliate links.
5. Images: original inline SVG only (hero + one diagram), `role="img"` with aria-label and `<title>`,
   `currentColor` + brand blue `#2f6bff` so light and dark themes both work. No stock photos, no hotlinked images,
   no third-party logos.
6. Sources: 3-5 links to official documentation, vendor pages or standards bodies (`target="_blank" rel="noopener"`),
   cited inline. Check each with `curl -sIL -o /dev/null -w '%{http_code}' URL` (200) and drop the ones that fail.
7. Add cards to `blog/index.html` and `en/blog/index.html` (newest first), add the URLs to `sitemap.xml`, link two
   related articles from each new one, and link the new one from an older related article when natural.
8. Check: `sh tools/check.sh`; one `<h1>` per page; hreflang pairs and the EN/FR switch point at each other;
   word count in range.
9. Branch `blog/<yyyy-mm-dd>`, commit `Blog: <EN title 1> and <EN title 2> (FR + EN)` with the Co-Authored-By line,
   push, open ONE PR to `main`. Never merge (the owner merges), never push to `main`, never touch other pages.
10. Report: PR link, article titles, word counts, sources checked.
