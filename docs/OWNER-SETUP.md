# Owner Setup Guide: GitHub, Cloudflare and Rachel's Workflow

For the person setting the site up (one-time, about 30 minutes). Rachel's day-to-day guide is `RACHEL-GUIDE.md`.

## How it works

```
Rachel edits (with Claude) → pushes a branch to GitHub → Cloudflare builds a PREVIEW link
                           → Rachel approves → branch merged to main → Cloudflare publishes LIVE
```

- **GitHub** stores the site: `github.com/pillowsoft/a-girl-in-a-bookstore` (public).
- **Cloudflare** hosts it as a **Worker with static assets** (not a Pages project). Rachel's account already has one, `girl-in-a-bookstore`, serving `girlinabookstore.com`, deployed by upload.
- There is **no build step**. The site is plain files in `public/`; `wrangler.jsonc` points Cloudflare at that folder.
- With **no Worker script** in `wrangler.jsonc`, every request is served straight from Cloudflare's edge network as a static file. No Worker code runs. Static asset requests are free and unlimited (verify on Cloudflare's current pricing page).

Nobody needs Wrangler or the Cloudflare API for day-to-day work. Git pushes are enough.

## Part 1: Connect the existing Worker to GitHub

The Worker already exists and has the domain. Connect it to the repo in place (Cloudflare calls this **Workers Builds**), which keeps the name and the domain.

1. Make sure `wrangler.jsonc` is on `main` first. It sets the Worker `name` (`girl-in-a-bookstore`, **must match the dashboard name exactly** or the build fails) and the assets directory `./public`.
2. Cloudflare dashboard (Rachel's account) → **Workers & Pages → girl-in-a-bookstore → Settings → Builds → Connect**.
3. Choose GitHub. The GitHub window asks to install the Cloudflare app: allow it for **only** `pillowsoft/a-girl-in-a-bookstore`, not "all repositories". Select the repo.
4. Settings:

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Build command | *(empty)* |
   | Deploy command | `npx wrangler deploy` |
   | Non-production branch deploy command | `npx wrangler versions upload` |
   | Root directory | `/` |

5. Save. Push a trivial change to a branch and confirm a preview appears. Merge to `main` and confirm the live site updates.

### Before you rely on it: compare with the old Worker

The live Worker has a `fetch` handler, an older script I couldn't see. `wrangler.jsonc` deploys **assets only** (no script), which serves `index.html` at `/` and every file under `public/`. After the first connected deploy, check:

- All pages load, including clean URLs like `/about` and `/about.html`.
- Images, fonts, menu, search and page transitions work.
- `https://girlinabookstore.com/sitemap.xml` and `/robots.txt` load.
- Any redirect the old script performed still works (if you know of one).

If something is missing, the old script is the cause; ask Claude to port that behavior into `wrangler.jsonc` (redirects and headers can usually be handled without a script).

## Part 2: Previews, privacy and domain

### Preview links

Non-production branches get a preview version. Enable **Settings → Domains & Routes → Preview URLs** on the Worker. Preview links look like `https://<id>-girl-in-a-bookstore.<account>.workers.dev`, and Cloudflare reports the URL on the GitHub commit or PR and in **Deployments**. Give that link to Rachel.

### Keep previews private (recommended)

The repo is public and preview links are hard to guess but not secret. To lock previews down, put **Cloudflare Access** in front of the preview URLs (Settings → Domains & Routes → Preview URLs → Access policy, or Zero Trust → Access → Applications) and allow only your emails and Rachel's. Visitors sign in with a one-time email code. Production stays public.

### Custom domain

Already attached (`girlinabookstore.com`). To add another: Worker → **Settings → Domains & Routes → Add → Custom domain**. HTTPS is automatic.

## Part 3: Set up Rachel

### Who owns the repo? (decision made)

The repo stays under the setup person's GitHub account (`pillowsoft`). Rachel is added as a **collaborator with Write access**. Reasons:

- Fastest: no migration, and nothing in Cloudflare needs reconnecting.
- The setup person remains admin and can fix problems on her behalf.
- Her pushes go straight to the real repo, so previews and publishing just work.

**Don't have her fork or re-clone it into her own account.** Her changes would land in a copy, the Cloudflare connection would have to follow the copy, and the two repos would drift apart.

**If Rachel later wants to own it outright:** she makes a GitHub account (if she hasn't), then the repo owner goes to **Settings → General → Danger Zone → Transfer ownership**, and she then adds the setup person back as an admin collaborator. After a transfer, reconnect Cloudflare: Worker → Settings → Builds → disconnect and connect the repo again (about 2 minutes). Do this transfer *before* any long break, not mid-change.

### On GitHub

1. Rachel creates a free account at https://github.com/signup (if she doesn't have one) and sends you her **username**.
2. Invite her, either in the web UI (repo → **Settings → Collaborators → Add people**, Write role) or with the terminal:

   ```bash
   gh api -X PUT repos/pillowsoft/a-girl-in-a-bookstore/collaborators/<her-username> -f permission=push
   ```

3. She gets an email invitation. **She must click Accept** (invitations expire after 7 days). Until she does, her pushes will be rejected.
4. *Optional but recommended safety net:* **Settings → Branches → Add rule** for `main` → require a pull request before merging. She can't publish by accident, and you approve each release. Skip it if you want her to publish herself; the skill already tells Claude to wait for her "publish" instruction.

### On her computer

Install once:

| Tool | Why | How |
|---|---|---|
| Git | saves changes | already on Mac; otherwise https://git-scm.com |
| GitHub CLI (`gh`) | logs in to GitHub | `brew install gh`, then `gh auth login` |
| `just` | one-word shortcuts | `brew install just` |
| ImageMagick | resizes photos | `brew install imagemagick` |
| Claude Code | the assistant that edits the site | https://claude.com/claude-code |

Then:

```bash
gh repo clone pillowsoft/a-girl-in-a-bookstore
cd a-girl-in-a-bookstore
```

Open Claude Code in that folder. The skill in `.claude/skills/edit-website/SKILL.md` loads automatically, and only in this folder.

Test it together: ask Claude to "change the home page tagline to something silly, and show me a preview", confirm a preview link appears and works, then discard the branch.


## Part 4: Things to know

- **Rollback:** Worker → **Deployments** → pick an older good version → **Rollback**. Or `git revert` the bad commit and push.
- **Build logs:** Worker → Deployments (or Builds) → click one.
- **After adding a page or blog post,** run `just sitemap` to refresh `public/sitemap.xml`, and commit it. (The skill does this for Rachel.)
- **Newsletter and contact forms do nothing yet.** They show a thank-you but collect no emails. Connect a real mailing-list service before launch.
- **Footer social links** point at the generic Instagram and YouTube homepages. Replace them with Rachel's.
- **"Coming soon" cards** link nowhere until stories exist.
- **Not built, on purpose:** RSS feed, category filters, comments. Add when asked.

## Optional: Cloudflare API / Wrangler

Only needed for automation, such as listing deployments from a script. Install Wrangler (`npm i -g wrangler`) and run `wrangler login`, or create an **API token** (My Profile → API Tokens, scoped to Workers edit/read) and set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Examples:

```bash
wrangler deployments list --name girl-in-a-bookstore
just deploy        # manual deploy, bypassing GitHub
```

**Never commit the token.** The repo is public.

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails with a name error | The `name` in `wrangler.jsonc` doesn't match the Worker's dashboard name. |
| Build fails otherwise | Build command must be empty and deploy command `npx wrangler deploy`. |
| Site is blank or 404 | `assets.directory` in `wrangler.jsonc` must be `./public`. |
| No preview link after a push | Wait about a minute. Check Deployments. Confirm Preview URLs are enabled and the non-production deploy command is `npx wrangler versions upload`. |
| Old CSS still showing | Bump `styles.css?v=N` in the HTML files, then hard-refresh. |
| Rachel's push is rejected | She hasn't accepted the GitHub invitation, doesn't have Write access (Part 3), or `gh auth login` isn't done. |
| Preview asks for a login | The Access policy is on (Part 2). Add her email. |

## Appendix: if you ever move to Cloudflare Pages

Not recommended: Workers is the current direction for static sites, the existing Worker already holds the domain, and moving gains nothing for this site. If you ever need to anyway:

### Create a Pages project

1. Log in at https://dash.cloudflare.com and choose the correct account.
2. Go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Click **Connect GitHub**. A GitHub window asks to install the Cloudflare Pages app. Allow it for **only** the repo `a-girl-in-a-bookstore`, not "all repositories".
4. Select the repo and click **Begin setup**.
5. Fill in:

   | Setting | Value |
   |---|---|
   | Project name | e.g. `girl-in-a-bookstore` (this becomes `girl-in-a-bookstore.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | *(leave empty)* |
   | Build output directory | `public` |

6. Click **Save and Deploy**. In about a minute the site is live at `https://<project-name>.pages.dev`.

Check that all 7 pages load and the images and fonts show.


Pages previews are `https://<branch>.<project>.pages.dev`, and a project can't be converted between Direct Upload and Git, so you create a new Git-connected project, check it, move the custom domain (remove it from the old project, add it to the new), then delete the old one after a few days. Rewrite the skill's preview and publish instructions to match.
