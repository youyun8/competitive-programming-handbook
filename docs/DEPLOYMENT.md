# Deployment Guide

This project uses a split deployment:

- GitHub Pages hosts the static Astro frontend.
- Supabase hosts authentication, PostgreSQL, RLS, and Edge Functions.
- The browser stores offline data in IndexedDB and synchronizes it after login.

The current repository URL is expected to be:

```text
git@github.com:youyun8/algorithm-handbook.git
```

The expected project Pages URL is:

```text
https://youyun8.github.io/algorithm-handbook/
```

If you rename the repository, follow the rename section at the end.

## 1. Push the private repository

The commits are already local. Push them yourself:

```bash
git push -u origin main
```

In GitHub, confirm the repository visibility is **Private**.

GitHub Pages availability for a private repository depends on the GitHub plan. A private repository does
not necessarily produce a private website: on most plans the Pages site is public, while access-controlled
private Pages sites require eligible GitHub Enterprise Cloud configuration.

## 2. Enable GitHub Pages

In the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Do not select a branch-based `/docs` deployment.
4. Leave the custom domain empty unless you already control one.

The workflow is:

```text
.github/workflows/deploy.yml
```

It builds Astro with the project repository base path and deploys the Pages artifact.

## 3. Create a Supabase project

Create a Supabase project from the Supabase dashboard.

Record:

- Project reference, for example `abcdefghijklmnop`
- Project URL, for example `https://abcdefghijklmnop.supabase.co`
- Publishable key, preferably the current `sb_publishable_...` key
- Region

Do not put the service-role key in GitHub repository variables, Astro variables, or any `PUBLIC_*`
environment variable.

## 4. Link the local Supabase project

Install and authenticate the Supabase CLI, then link this repository:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Check the pending database changes:

```bash
supabase db diff --linked
```

Apply the migration:

```bash
supabase db push --linked
```

The migration creates:

- `profiles`
- `user_settings`
- `lesson_progress`
- `exercise_progress`
- `exercise_notes`
- `bookmarks`
- `sync_receipts`
- RLS policies that isolate every user's rows

## 5. Configure Edge Function secrets

The hosted functions automatically receive Supabase's standard server-side environment variables. Add the
allowed browser origins:

```bash
supabase secrets set \
  ALLOWED_ORIGINS="https://youyun8.github.io,http://localhost:4321,http://127.0.0.1:4321" \
  --project-ref YOUR_PROJECT_REF
```

Use origins only: do not include `/algorithm-handbook/` in `ALLOWED_ORIGINS`, because the browser `Origin`
header contains only scheme, host, and port.

Deploy both functions:

```bash
supabase functions deploy sync-progress --project-ref YOUR_PROJECT_REF
supabase functions deploy account-data --project-ref YOUR_PROJECT_REF
```

Inspect the deployed functions:

```bash
supabase functions list --project-ref YOUR_PROJECT_REF
```

## 6. Configure Supabase Auth URLs

In **Supabase Dashboard → Authentication → URL Configuration** set:

```text
Site URL:
https://youyun8.github.io/algorithm-handbook/

Redirect URL:
https://youyun8.github.io/algorithm-handbook/auth/callback/
```

Also keep explicit development redirects:

```text
http://localhost:4321/**
http://127.0.0.1:4321/**
```

Do not use a broad wildcard for production domains.

## 7. Configure email/password authentication

In **Authentication → Providers → Email**:

1. Enable email/password signup.
2. Require email confirmation.
3. Keep secure password requirements enabled.
4. Configure a production SMTP provider before inviting real users.
5. Customize confirmation and password-reset email templates if needed.

Test:

- Registration
- Confirmation email
- Login
- Forgot password
- Reset password
- Session refresh
- Logout

## 8. Configure GitHub OAuth

Create a GitHub OAuth App.

Use:

```text
Homepage URL:
https://youyun8.github.io/algorithm-handbook/

Authorization callback URL:
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Then in **Supabase Dashboard → Authentication → Providers → GitHub**:

1. Enable GitHub.
2. Paste the OAuth Client ID.
3. Paste the OAuth Client Secret.
4. Save.

The OAuth client secret stays only in Supabase. It must not be stored in this repository or GitHub Actions
frontend variables.

## 9. Add GitHub Actions repository variables

In **GitHub repository → Settings → Secrets and variables → Actions → Variables**, create:

```text
PUBLIC_SITE_URL
https://youyun8.github.io/algorithm-handbook/

PUBLIC_BASE_PATH
/algorithm-handbook

PUBLIC_SUPABASE_URL
https://YOUR_PROJECT_REF.supabase.co

PUBLIC_SUPABASE_PUBLISHABLE_KEY
YOUR_SUPABASE_PUBLISHABLE_KEY

PUBLIC_API_URL
https://YOUR_PROJECT_REF.supabase.co/functions/v1

PUBLIC_AUTH_MODE
supabase
```

These values are embedded in the static frontend and therefore must be public-safe. Never place a service
role key, database password, OAuth secret, or personal access token in these variables.

## 10. Run and verify GitHub Actions

After the first push, open the **Actions** tab.

Confirm both workflows pass:

```text
Deploy frontend to GitHub Pages
Backend, RLS, content, and security checks
```

If Pages was enabled after the first failed run, use **Re-run all jobs** or trigger the deployment manually
with **Run workflow**.

The expected frontend URL is:

```text
https://youyun8.github.io/algorithm-handbook/
```

## 11. Production verification checklist

Verify in a clean or private browser window:

1. Home, chapter, lesson, practice, profile, and 404 routes load below `/algorithm-handbook/`.
2. CSS, JavaScript, favicon, Pagefind, and React islands have no base-path 404 errors.
3. Public lessons and exercises are readable while logged out.
4. Email registration sends a confirmation email.
5. Email login and logout work.
6. Forgot-password and reset-password return to the Pages callback route.
7. GitHub OAuth returns to `/algorithm-handbook/auth/callback/`.
8. A guest can set exercise status and write solution/thought notes.
9. First login merges guest progress and notes.
10. A second browser sees the synchronized status and notes.
11. Offline edits enter the queue and synchronize after network recovery.
12. User A cannot access user B's progress or notes.
13. Data export includes lesson progress, exercise status, notes, bookmarks, and settings.
14. Account deletion removes the Auth user and cascades all personal database rows.

## 12. Useful diagnostics

Frontend build:

```bash
PUBLIC_BASE_PATH=/algorithm-handbook \
PUBLIC_SITE_URL=https://youyun8.github.io/algorithm-handbook/ \
pnpm build
```

Local browser tests with the project base:

```bash
PUBLIC_BASE_PATH=/algorithm-handbook \
PUBLIC_AUTH_MODE=mock \
pnpm test:e2e
```

Supabase function logs:

1. Open the Supabase dashboard.
2. Select the project.
3. Open **Edge Functions**.
4. Select `sync-progress` or `account-data`.
5. Open the function's **Logs** view.

Reapply migrations:

```bash
supabase db push --linked
```

List remote migration state:

```bash
supabase migration list --linked
```

## 13. Custom domain

If you add a custom domain:

1. Configure it in **GitHub Settings → Pages**.
2. Set `PUBLIC_SITE_URL` to the custom-domain root.
3. Set `PUBLIC_BASE_PATH=/` if the site is served at the domain root.
4. Add the custom origin to `ALLOWED_ORIGINS`.
5. Add the custom callback URL to Supabase Auth redirect URLs.
6. Update the GitHub OAuth App homepage URL if desired.
7. Re-run the Pages workflow.

## 14. Renaming the repository

The Astro workflow derives the Pages base from `GITHUB_REPOSITORY`, so Actions builds automatically adapt
to a renamed repository.

After a rename, update:

```bash
git remote set-url origin git@github.com:youyun8/NEW_REPO_NAME.git
```

Then update:

- `PUBLIC_SITE_URL`
- `PUBLIC_BASE_PATH`
- Supabase Site URL
- Supabase redirect URL
- GitHub OAuth homepage URL
- Any production CORS origin only if the hostname changes

The internal IndexedDB database name does not need to change.
