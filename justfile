default:
    @just --list

# Preview locally at http://localhost:8000
serve:
    python3 -m http.server 8000 --directory public

# Check that every local href/src in the HTML points at a real file
lint:
    #!/usr/bin/env bash
    set -euo pipefail
    cd public
    bad=0
    for f in *.html; do
      for ref in $(grep -oE '(href|src)="[^"#?:]+"' "$f" | sed -E 's/^[a-z]+="//; s/"$//' | grep -v '^//'); do
        [ -e "${ref#/}" ] || { echo "$f: missing $ref"; bad=1; }
      done
    done
    exit $bad

# Manual deploy straight to Cloudflare (normal path: push to GitHub and let Cloudflare build)
deploy:
    npx wrangler deploy
