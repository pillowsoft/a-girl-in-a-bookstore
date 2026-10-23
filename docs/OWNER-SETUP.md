# Owner Setup Guide: GitHub, Cloudflare Pages and Rachel's Workflow

For the person setting the site up (one-time, about 30 minutes). Rachel's day-to-day guide is `RACHEL-GUIDE.md`.

## How it works

```
Rachel edits (with Claude) → pushes a branch to GitHub → Cloudflare builds a PREVIEW link
                           → Rachel approves → branch merged to main → Cloudflare publishes LIVE
```

- **GitHub** stores the site: `github.com/pillowsoft/a-girl-in-a-bookstore` (public).
- **Cloudflare Pages** watches the repo. Every branch gets a preview URL; `main` is the live site.
- There is **no build step**. The site is plain files in `public/`.

Nobody needs Wrangler or the Cloudflare API for this. Git pushes are enough.

## Part 1: Create the Cloudflare Pages project

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

> Cloudflare is gradually moving new projects to "Workers with static assets". If the dashboard steers you there, the same idea applies: connect the GitHub repo, no build command, asset directory `public`. The Pages route above remains the simplest for a static site.

### Rachel's actual situation: it is a Worker, not a Pages project

Checked with `wrangler deployments list`: the existing `girl-in-a-bookstore` on her account (`girlinabookstore.com`) is a **Cloudflare Worker with static assets**, deployed by upload. It is **not** a Pages project, so the "create a new project and move the domain" route below doesn't apply. Workers can be connected to GitHub in place (**Workers Builds**), which keeps the name and the domain.

1. The repo now has `wrangler.jsonc` (name `girl-in-a-bookstore`, assets directory `./public`). Make sure it is on `main` first.
2. Cloudflare dashboard → **Workers & Pages → girl-in-a-bookstore → Settings → Builds → Connect**.
3. Choose GitHub, authorize the Cloudflare app for **only** this repo, and select `pillowsoft/a-girl-in-a-bookstore`.
4. Settings:

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Build command | *(empty)* |
   | Deploy command | `npx wrangler deploy` |
   | Non-production branch deploy command | `npx wrangler versions upload` |
   | Root directory | `/` |

5. Save, then push a trivial change to a branch and confirm a preview appears. Merge to `main` and confirm the live site updates.
6. Preview URLs for Workers must be enabled (**Settings → Domains & Routes → Preview URLs**). They look like `<id>-girl-in-a-bookstore.<account>.workers.dev`. Cloudflare reports the URL on the GitHub commit or PR, and in **Deployments**. Give that link to Rachel. Previews are **not** `*.pages.dev` here.
7. The Worker name in `wrangler.jsonc` **must match** the Worker's name in the dashboard, or the build fails.

Heads up: the live Worker has a `fetch` handler, so it runs some script I can't see. `wrangler.jsonc` deploys the site as **assets only** (no script), which serves `index.html` at `/` and every file under `public/`. Compare the live site with the first connected deploy before relying on it, especially any redirects or clean URLs like `/about`.

The Pages-only instructions in Parts 1-3 (`.pages.dev` URLs, Pages Access policy, Pages rollback) differ for Workers. Rollback is under the Worker's **Deployments** tab. To keep previews private, use Cloudflare Access on the preview URLs (Settings → Domains & Routes).

### Pages only: already have a Direct Upload Pages project? Convert it to Git

Cloudflare **cannot** convert a Direct Upload Pages project to Git-connected, and there is no setting for it. The way around it is to create a new Git-connected project, move the domain across, and retire the old one. Visitors see no downtime if you do it in this order.

1. **Note what the old project uses.** Open it and write down its name, its custom domain(s), and any environment variables or settings. A plain static site usually has none.
2. **Create the new Git-connected project** with the steps above. Its name must differ from the old one (names are unique), e.g. `girl-in-a-bookstore-git`. Don't touch the domain yet.
3. **Check the new `.pages.dev` site** thoroughly: all 7 pages, images, fonts, menu, search.
4. **Move the custom domain:**
   1. In the **old** project: **Custom domains** → remove the domain.
   2. In the **new** project: **Custom domains** → **Set up a domain** → add it.

   If the domain's DNS is on Cloudflare (it usually is), the DNS record updates automatically and the switch takes under a minute. If the DNS is elsewhere, repoint the CNAME to `<new-project>.pages.dev`.
5. **Check the live domain** shows the site (hard-refresh).
6. **Retire the old project** after a few days: old project → **Settings → Delete project**. This is irreversible, but the files all live in GitHub.

The new project's address will be `<new-name>.pages.dev`. That only matters if anyone used the old `.pages.dev` link. Once the custom domain is set, it doesn't.

If you'd rather keep the original `.pages.dev` name, delete the old project first and recreate it with that name. Do this **only after** pointing the custom domain somewhere else or accepting a few minutes of downtime.

## Part 2: Preview deployments

Preview deployments are on by default for branches other than `main`. Confirm under **the project → Settings → Builds & deployments → Branch control**: "Preview branches" should be **All non-Production branches**.

Preview link format:
- Per branch: `https://<branch-name>.<project-name>.pages.dev` (slashes in branch names become `-`, long names are truncated)
- Per commit: `https://<commit-hash>.<project-name>.pages.dev`

The PR check or the dashboard's **Deployments** tab shows the exact URL.

### Keep previews private (recommended)

The repo is public and preview links are guessable, so unfinished work could be seen. To lock previews down:

1. **Project → Settings → General → Access policy → Enable**.
2. Add the emails allowed to view previews (yours and Rachel's).

Visitors then sign in with a one-time email code. Production stays public.

## Part 3: Custom domain (when ready)

**Project → Custom domains → Set up a domain.** If the domain is on Cloudflare, it configures DNS automatically. If it's elsewhere, follow the CNAME instructions shown. HTTPS is automatic.

## Part 4: Set up Rachel

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

## Part 5: Things to know

- **Rollback:** project → **Deployments** → pick an older good one → **Rollback**. Or `git revert` the bad commit and push.
- **Deployment logs:** project → Deployments → click one.
- **Cost:** a static site on Cloudflare Pages is free at this scale (500 builds/month on the free plan, unlimited bandwidth).
- **Newsletter and contact forms do nothing yet.** They show a thank-you but collect no emails. Connect a real mailing-list service before launch.
- **Footer social links** point at the generic Instagram and YouTube homepages. Replace them with Rachel's.
- **"Coming soon" cards** link nowhere until stories exist.

## Optional: Cloudflare API / Wrangler

Only needed for automation, such as listing deployments from a script.

1. Dashboard → My Profile → **API Tokens → Create Token**, with *Account → Cloudflare Pages → Read* (or Edit if rolling back).
2. Use as `Authorization: Bearer <token>` against
   `https://api.cloudflare.com/client/v4/accounts/<account-id>/pages/projects/<project>/deployments`
3. **Never commit the token.** The repo is public.

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails | Check that build command is empty and output directory is exactly `public`. |
| Site shows a blank page or 404 | Same: output directory wrong. |
| No preview link after a push | Wait about a minute. Check Deployments. Confirm Preview branches is set to All non-Production. |
| Old CSS still showing | Bump `styles.css?v=N` in the HTML files, then hard-refresh. |
| Rachel's push is rejected | She hasn't accepted the GitHub invitation, doesn't have Write access (Part 4), or `gh auth login` isn't done. |
| Preview asks for a login | The access policy is on (Part 2). Add her email. |
