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

# Rebuild public/sitemap.xml from the HTML pages (run after adding a page or post)
sitemap:
    #!/usr/bin/env python3
    import pathlib, subprocess, datetime
    site = "https://girlinabookstore.com"
    urls = []
    for f in sorted(pathlib.Path("public").glob("*.html")):
        path = "/" if f.name == "index.html" else "/" + f.stem
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", str(f)], capture_output=True, text=True).stdout.strip()
        urls.append(f"  <url><loc>{site}{path}</loc><lastmod>{out or datetime.date.today()}</lastmod></url>")
    body = "\n".join(urls)
    pathlib.Path("public/sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}\n</urlset>\n')
    print(f"sitemap.xml: {len(urls)} urls")
