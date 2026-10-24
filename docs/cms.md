# Editing the site

Page copy, method stages, the glossary, and field notes live in `content/` as files. The editor is [Keystatic](https://keystatic.com). It writes those files. It does not need a paid Keystatic or Tina account.

Tina was the other git based option. Its hosted editor expects Tina Cloud, which is a separate account. Keystatic can run locally with no account, and on Vercel it uses a GitHub App you create yourself. That is why this site uses Keystatic.

The same collections can be copied to another site that needs frequent edits: `site`, `home`, `pages`, `steps`, `terms`, and `notes`. On this site, steps are the five stages and terms are the glossary. Labels in the editor say Steps and Terms so the model is not tied to one brand.

`{{email}}` and `{{host}}` in a field are replaced when the page renders. The address comes from the Site entry. The host comes from the canonical site URL in code.

## Edit on your machine

1. From the repo, run `npm run dev`.
2. Open `http://127.0.0.1:3000/admin`. That address sends you to `/keystatic`, which is the path the editor uses.
3. Change a page, a step, a term, or a note. Save.
4. The matching file under `content/` changes. Refresh the site to read it.
5. Commit the file when you want the change kept.

Local saving does not need GitHub App credentials. The editor writes the working tree.

## What a draft does

Set Status to Draft and save.

- The piece drops off lists: navigation is hand edited on Site, the home page only features a published note, the field notes index only lists published notes, and the sitemap skips drafts.
- The address still opens. A field note draft is `/field-notes/<file name>`. A step draft is `/method/<file name>`. A page draft is `/<file name>`.
- That page sends `noindex`, so it is a preview, not a public listing.
- `content/notes/before-the-room.mdoc` is a draft you can open to see this.

The preview button in the editor opens that path on the host you are using.

## Edit on the deployed site

Vercel cannot write the repo disk. Hosted editing commits through GitHub, onto a branch whose name starts with `cms/`. Those branches are allowed to build a preview. `main` is unchanged until you merge.

You create the GitHub App and the environment variables. This repo does not create the app, and it does not set the variables.

1. In the Vercel project, add these variables for the environment that should serve `/admin`. Do not commit the values.
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET` (at least 32 characters)
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (the app slug, so the install link can be built)
2. Optional: `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` if the repo is not `drive-brand-growth/circuitos-website`. The owner and name are public. The default is that repo.
3. Create a GitHub App (GitHub settings, Developer settings, GitHub Apps, New). Suggested permissions, matching what Keystatic asks GitHub for:
   - Contents: Read and write
   - Pull requests: Read
   - Metadata: Read
4. Callback URL: `https://<the deployment host>/api/keystatic/github/oauth/callback`
   Also add `http://127.0.0.1/api/keystatic/github/oauth/callback` if you want GitHub mode on your machine.
5. Setup URL can stay empty. Disable the webhook if GitHub asks.
6. Install the app on this repo only.
7. Redeploy so the variables are present, then open `/admin`. It sends you to `/keystatic`, where you sign in with GitHub.

Until those variables exist, `/admin` on a deployment shows a short setup note instead of an editor. A production build without them still renders the site from the files in the repo.

After you save in the hosted editor, open the Vercel preview for the `cms/...` branch to read the change, then merge the branch when it should become the next build of the site.

Keystatic's own setup screen can write a local `.env` when you create the app from a machine running the dev server. That file is for your machine. Do not commit it. On Vercel, paste the same names into the project settings yourself.
