---
name: edit-website
description: Edit, preview, and publish the Girl in a Bookstore website. Use when the user wants to change text, swap or add photos, add a page, change colors or fonts, see a preview, or publish the site. Written for a non-technical owner, so explain in plain words, make the change, then show the result.
---

# Editing the Girl in a Bookstore website

The owner is not a programmer. Make the change yourself, preview it, and say what you did in plain language. Never ask her to edit code. Always preview before publishing, and publish only when she says so.

## The golden rules

1. **Preview first, publish second.** Nothing goes live until she says "publish it" (or similar).
2. **Work on a branch, never directly on `main`.** `main` is the live site.
3. **Keep it simple.** The site is plain HTML, CSS and JavaScript with no build step. Don't add frameworks, packages or a database.
4. **Ask before anything irreversible**, like deleting a page or photo.

## How the site is laid out

Everything lives in `public/`:

| File | What it is |
|---|---|
| `index.html` | Home page |
| `about.html`, `travel.html`, `cuisine.html`, `books.html`, `videos.html`, `fashion.html` | The other pages |
| `styles.css` | All colors, fonts, spacing and animations |
| `site.js` | Menu, search, page transitions, pop-ups, and the header/footer |
| `assets/images/` | Photos (all `.webp`, in several sizes) |
| `assets/fonts/` | The two fonts (EB Garamond and DM Sans) |

To change **page text**, edit that page's `.html` file. Look for the words in the file and replace them.

### The header and footer are shared

The menu bar, search box and footer are written **once**, in `site.js` (`SiteHeader` and `SiteFooter`), and appear on every page. Don't copy them into HTML files.

- To rename or add a menu link, or add a page to search: edit the `pages` list at the top of `site.js`.
- To change footer text or social links: edit `SiteFooter` in `site.js`. The Instagram and YouTube links there currently point to the generic homepages and need Rachel's real addresses.

### Adding a new page

1. Copy an existing page such as `books.html` to a new name like `podcasts.html`.
2. Change the `<title>`, the `description` meta tag, and the page text.
3. Add it to the `pages` list at the top of `site.js` so it appears in the menu and search.
4. Add a hero image rule in `styles.css`, following the pattern of the existing `hero-books`, `hero-travel`, etc.

## Colors, fonts and style

All in `styles.css`. The color palette is at the very top, under `:root`:

- `--paper` and `--cream`: page backgrounds
- `--ink`: main text
- `--rust`: accent (buttons, links)
- `--sage`: secondary accent

Change a color there once and it changes everywhere. Fonts are `--serif` (headlines) and `--sans` (body text).

The layout has three screen-size tiers: phones (up to 720px), tablets (up to 980px), and large desktops (1200px and up). They are the `@media` sections near the bottom of `styles.css`. After any style change, **check it at phone width and desktop width**, not just one.

**After editing `styles.css`,** bump the version number so visitors' browsers don't show the old file: change `styles.css?v=6` to `?v=7` in every `.html` file (one find and replace across `public/*.html`). `site.js` has no version number yet; if you change it, add `?v=2` to its `<script>` tag in every page too.

## Page transitions (the smooth fade between pages)

The site uses the browser's built-in **View Transitions** feature. It's CSS only: the `@view-transition { navigation: auto; }` block near the top of `styles.css`. Pages fade and slide slightly when you click between them, while the header stays fixed in place.

- `site.js` also has a fallback for browsers that don't support it. It fetches the next page and swaps the `<main>` content. That is why every page needs a `<main id="main-content">`.
- People who have "reduce motion" turned on in their device settings get no animation. This is intentional and is a kindness. Keep it.
- To change the speed or feel, edit `page-out` / `page-in` and the `::view-transition-old/new(page-content)` rules in `styles.css`.
- Don't remove `<main>` from a page and don't give two things the same transition name, or transitions will break.

## Images (the important part)

Every photo exists in **multiple sizes** so phones download small files and big screens get sharp ones. This keeps the site fast. All photos are `.webp`, a modern format that is much smaller than JPEG.

Naming: `name-480.webp`, `name-960.webp`, `name-1920.webp` (the number is the width in pixels). Small cards use 480 and 960. Full-width banner photos also have 1920.

### How a photo is used in a page

```html
<img src="assets/images/travel-960.webp"
     srcset="assets/images/travel-480.webp 480w, assets/images/travel-960.webp 960w"
     sizes="(max-width: 720px) calc(100vw - 34px), (max-width: 1240px) 33vw, 400px"
     width="4500" height="3000"
     alt="Colorful direction signs pointing toward destinations"
     loading="lazy" decoding="async">
```

- `srcset`: the list of sizes available. The browser picks the best one for the visitor's screen.
- `sizes`: tells the browser how wide the photo will appear. Copy it from a similar existing photo.
- `width` / `height`: the original dimensions. These stop the page from jumping while loading.
- `alt`: **required.** A short description for blind visitors and search engines. Never leave it empty for a real photo.
- `loading="lazy"`: wait to download until it scrolls near the screen. Don't use it on the first big photo at the top of a page.

Full-width banner photos at the top of each page are set in CSS (`hero-home`, `hero-books`, ...) and switch from the 960 to the 1920 file at 1200px and wider. The page `<head>` has matching `<link rel="preload">` lines so the banner loads first.

### Adding or swapping a photo

When she gives you a photo (JPG, PNG, HEIC, etc.), create the sizes yourself and never put the original in the site. The tools `cwebp` and `magick` are installed:

```bash
# from the folder containing her photo, e.g. new-photo.jpg
for w in 480 960 1920; do
  magick new-photo.jpg -auto-orient -resize ${w}x -strip -quality 82 public/assets/images/new-photo-$w.webp
done
```

- Use short, lowercase, dash-separated names (`lisbon-bookshop`).
- Skip 1920 for photos that only appear small.
- Read the original's width and height (`magick identify new-photo.jpg`) for the `width`/`height` attributes.
- Write a real `alt` description. Ask her if you can't tell what the photo shows.
- Keep each file under ~300 KB if possible. Check with `ls -lh public/assets/images`.
- Remove old image files that are no longer used (after confirming with her).

## Things that are placeholders, so tell her honestly

- **The newsletter signup and contact forms don't actually send anything yet.** They show a thank-you message but collect no emails. If she asks about the mailing list, explain this and offer to connect a real service (e.g. Buttondown, Mailchimp, or Cloudflare Email Service).
- **Many "Coming soon" cards** link to nowhere (`data-coming-soon`). When she writes a real story, replace the card with a real link or page.
- The social links in the footer are generic.

## Preview and publish (Cloudflare Pages + GitHub)

> **Heads-up on Cloudflare type:** the live site is a **Cloudflare Worker with static assets** (config in `wrangler.jsonc`) connected to GitHub with Workers Builds, not a classic Pages project. The flow is identical (branch push = preview, `main` = live), but preview links look like `https://<id>-girl-in-a-bookstore.<account>.workers.dev`, not `*.pages.dev`, and Cloudflare posts them on the GitHub commit or PR and in the dashboard Deployments tab. Where the text below says `pages.dev`, use that instead. Never delete or rename `wrangler.jsonc`.


The live site is hosted on **Cloudflare Pages**, connected to the GitHub repo `pillowsoft/a-girl-in-a-bookstore`. The rule that makes this easy:

- A push to any **branch other than `main`** automatically gets its own **preview website** with a private-ish link like `https://<branch-name>.<project>.pages.dev`.
- A change that reaches **`main`** goes **live** within a minute or two.

### Normal flow, step by step

1. **Check the change locally first.** Run `just serve` and open http://localhost:8000. Then run `just lint` to catch broken image or link paths.
2. **Make a branch** with a descriptive name, e.g. `new-lisbon-photos`:
   `git switch -c new-lisbon-photos`
3. **Commit** the changes (short plain-language message) and **push**:
   `git push -u origin new-lisbon-photos`
4. **Give her the preview link.** It is `https://<branch>.<project>.pages.dev` (use `-` for any `/` in the branch name). If the link doesn't work yet, wait a minute for the build. Check the deployment list in the Cloudflare dashboard or with the API below.
5. **She looks at it** on her phone and computer and tells you what to adjust. Repeat 1-4 on the same branch; the preview updates each push.
6. **When she says to publish**, merge into `main` and push (a pull request on GitHub is fine, or `git switch main && git merge <branch> && git push`). Then confirm the live site shows the change.
7. Delete the finished branch.

### Undoing a mistake

The previous version is never lost. Either:
- `git revert <commit>` then push to `main` (cleanest), or
- In the Cloudflare dashboard: Workers & Pages → the project → Deployments → pick an older good one → **Rollback**.

### Using Cloudflare's API / wrangler (optional, once authenticated)

One-time setup, which the site owner or her helper does once on the computer:

```bash
npx wrangler login          # opens a browser to log in to Cloudflare
npx wrangler whoami         # confirms it worked
```

For automation, create an **API token** in the Cloudflare dashboard (My Profile → API Tokens, template "Edit Cloudflare Workers" or custom with *Account → Cloudflare Pages → Edit*) and set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment. **Never put the token in a file in this repo** or in a chat message; the repo is public.

With that you can:

```bash
# List recent deployments (preview and production) for the project
npx wrangler pages deployment list --project-name=<project>

# Direct-upload a preview without Git (only works if the Pages project is NOT Git-connected)
npx wrangler pages deploy public --project-name=<project> --branch=preview
```

The same data is available over the REST API at
`https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/<project>/deployments`
(send the header `Authorization: Bearer $CLOUDFLARE_API_TOKEN`). Use it to read each deployment's preview URL and status.

Note: a Pages project is either **Git-connected** (the normal flow above) or **direct-upload** (wrangler only). Don't mix them. This site uses the Git-connected flow, so prefer branches and pushes, and use the API only for reading status or rolling back.

### Before telling her it's done, check

- It looks right on a phone-width window and a desktop-width window.
- Every photo has a descriptive `alt`.
- `just lint` reports no missing files.
- She has seen the preview and said to publish.
- After publishing, the live site actually shows the change (hard-refresh to avoid a cached copy).

## How to talk to her

Plain words. Say "I changed the headline on the Books page; here's the preview link" instead of "I updated books.html on a feature branch". Offer one clear next step: "Does that look right? Say 'publish' and I'll make it live."
