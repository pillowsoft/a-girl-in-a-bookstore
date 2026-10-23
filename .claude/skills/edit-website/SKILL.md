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
| `travel.html`, `cuisine.html`, `books.html` | The three blog pages: each lists its own posts |
| `travel-*.html`, `cuisine-*.html`, `books-*.html` | One file per blog post, named after its page |
| `about.html`, `videos.html`, `fashion.html` | The other pages |
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

## Blog posts (the Journal)

The Journal is the blog: `public/journal.html` lists posts **newest first**, and each post is its own page named `journal-<short-name>.html` (all in `public/`, no subfolders). There's no database or build step: a post is a file plus a card on the list.

### When Rachel wants a new post

1. **Get the material.** Ask for her notes, bullet points, a voice-memo transcript, or a rough draft, plus the photos. Ask what she wants it to feel like, and who it's for.
2. **Draft it in her voice.** Warm, curious, literary, first person, like the existing pages. Aim for 400-900 words unless she says otherwise. **Never invent facts**: names, places, prices, quotes, dates, opening hours, or things she "saw". If something is missing, ask or leave it out. Show her the text and **get her OK on the words before building the page.**
3. **Create the page:** copy `.claude/skills/edit-website/post-template.html` to `public/journal-<short-name>.html` (lowercase, dashes, e.g. `journal-lisbon-bookshops.html`), then fill in:
   - `<title>` and the `description` meta (one sentence; this is what Google shows)
   - the category (Travel, Cuisine, Books, Videos, Fashion or Notes) and the **real date**, both in the visible text and in `datetime="YYYY-MM-DD"`
   - the headline, a one- or two-sentence `post__lede`, then the paragraphs (`<p>`) and optional `<h2>` section headings
   - photos in `<figure>` blocks, using the image steps above (resize, `srcset`, real `alt`)
   - remove any template placeholder text that's left over
4. **Add a card to the list**: paste this at the **top** of the `journal-grid` in `journal.html`, directly under the `NEW POSTS GO HERE` comment, so the newest post is first:

   ```html
   <article class="story-card reveal">
     <a href="journal-lisbon-bookshops.html" class="story-card__image">
       <img src="assets/images/lisbon-960.webp" srcset="assets/images/lisbon-480.webp 480w, assets/images/lisbon-960.webp 960w" sizes="(max-width: 720px) calc(100vw - 34px), 33vw" width="4000" height="3000" alt="Describe the cover photo" loading="lazy" decoding="async">
     </a>
     <div class="story-card__meta"><span>Travel</span><time datetime="2026-10-23">Oct 23, 2026</time></div>
     <h3><a href="journal-lisbon-bookshops.html">Post title</a></h3>
     <p>One or two sentences that make you want to read it.</p>
   </article>
   ```

5. **After the first real post only:** delete the "The first dispatches are on their way" `coming-soon-band` section from `journal.html`. Offer to replace the three placeholder "First dispatches" cards on `index.html` with the latest three real posts (same card HTML).
6. Run `just sitemap` (refreshes `public/sitemap.xml` for Google), then `just lint`, and check the post and the list at phone and desktop width, then follow the normal **preview, approve, publish** steps. An unmerged branch is effectively a **draft**: the post exists only at the preview link until she says publish.

### Editing, reordering, removing

- **Fix a typo or change a post:** edit its `journal-*.html` file (and the card text if the title or summary changed).
- **Order:** newest first means position in `journal.html`, not the date text. If she backdates or publishes out of order, move the card.
- **Take a post down:** remove its card and its file, after asking her. Deleted pages still exist in git history if she changes her mind.
- Posts are not in the site search or the menu (those use the `pages` list in `site.js` and are for the main pages only). Don't add every post there.
- Not built yet, and not needed until she asks: an RSS feed, a categories filter, comments, and email-on-new-post.

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

## Preview and publish (Cloudflare Workers + GitHub)

The live site (`girlinabookstore.com`) is a **Cloudflare Worker serving static files** (config in `wrangler.jsonc`: Worker name `girl-in-a-bookstore`, assets directory `./public`, no script). It is connected to the GitHub repo `pillowsoft/a-girl-in-a-bookstore` with Cloudflare Workers Builds. **Never delete or rename `wrangler.jsonc`.** The rule that makes this easy:

- A push to any **branch other than `main`** is built as a **preview version** with its own link, like `https://<id>-girl-in-a-bookstore.<account>.workers.dev`. Cloudflare posts it on the GitHub commit or PR and in the dashboard under the Worker's Deployments.
- A change that reaches **`main`** goes **live** within a minute or two.

### Normal flow, step by step

1. **Check the change locally first.** Run `just serve` and open http://localhost:8000. Then run `just lint` to catch broken image or link paths.
2. **Make a branch** with a descriptive name, e.g. `new-lisbon-photos`: `git switch -c new-lisbon-photos`
3. **Commit** the changes (short plain-language message) and **push**: `git push -u origin new-lisbon-photos`
4. **Find and give her the preview link.** Use `gh pr create --fill` if needed and read the Cloudflare comment, or `gh api repos/pillowsoft/a-girl-in-a-bookstore/commits/<sha>/check-runs` for the link, or check the dashboard. If it isn't there yet, wait a minute. If you truly can't find it, tell her honestly and ask the site helper, don't guess a URL.
5. **She looks at it** on her phone and computer and tells you what to adjust. Repeat 1-4 on the same branch; the preview updates each push.
6. **When she says to publish**, merge into `main` and push (a pull request on GitHub is fine, or `git switch main && git merge <branch> && git push`). Then confirm the live site shows the change.
7. Delete the finished branch.

### Undoing a mistake

The previous version is never lost. Either:
- `git revert <commit>` then push to `main` (cleanest), or
- In the Cloudflare dashboard: Workers & Pages → `girl-in-a-bookstore` → Deployments → pick an older good version → **Rollback**.

### Wrangler and the API are optional

Rachel doesn't need Wrangler. If it's installed and logged in (`wrangler login`), these help:

```bash
wrangler deployments list --name girl-in-a-bookstore   # recent deployments
just deploy                                            # manual deploy, bypasses GitHub: only if asked
```

For scripts, use an API token scoped to Workers, set as `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment. **Never put a token in a file in this repo** or in a chat message; the repo is public. Prefer branch pushes over `just deploy`, since a manual deploy skips the preview step.

### Before telling her it's done, check

- It looks right on a phone-width window and a desktop-width window.
- Every photo has a descriptive `alt`.
- `just lint` reports no missing files.
- She has seen the preview and said to publish.
- After publishing, the live site actually shows the change (hard-refresh to avoid a cached copy).

## How to talk to her

Plain words. Say "I changed the headline on the Books page; here's the preview link" instead of "I updated books.html on a feature branch". Offer one clear next step: "Does that look right? Say 'publish' and I'll make it live."
