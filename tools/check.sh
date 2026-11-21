#!/bin/sh
# Pre-push check (run by the global pre-push hook, or by hand). The site has no build step, so this checks
# what the README asks for: all pages load /assets/style.css (and /assets/site.js) with one shared ?v= stamp each,
# and every page in sitemap.xml exists locally.
set -e
cd "$(dirname "$0")/.."
fail=0
for asset in style.css site.js; do
  versions="$(grep -rhoE --include='*.html' "/assets/$asset\\?v=[0-9A-Za-z]+" . | sed 's/.*?v=//' | sort -u)"
  pages="$(grep -rlE --include='*.html' "/assets/$asset" . | wc -l | tr -d ' ')"
  stamped="$(grep -rlE --include='*.html' "/assets/$asset\\?v=" . | wc -l | tr -d ' ')"
  if [ "$(printf '%s\n' "$versions" | grep -c .)" -gt 1 ] || [ "$pages" != "$stamped" ]; then
    echo "FAIL $asset: every page must load it with the same ?v= stamp (bump it in every page with one sed):"
    for v in $versions; do printf '  v=%s  %s pages\n' "$v" "$(grep -rlE --include='*.html' "/assets/$asset\\?v=$v" . | wc -l | tr -d ' ')"; done
    [ "$pages" != "$stamped" ] && echo "  $((pages - stamped)) pages load it without ?v="
    fail=1
  fi
done
for url in $(grep -oE '<loc>[^<]+</loc>' sitemap.xml | sed -E 's#<loc>https://kallistesoft\.ca/?##; s#</loc>##'); do
  path="./$url"
  case "$url" in ""|*/) path="${path}index.html" ;; esac
  [ -f "$path" ] || { echo "FAIL sitemap.xml lists a missing page: /$url"; fail=1; }
done
[ "$fail" = 0 ] && echo "check: all passed"
exit "$fail"
