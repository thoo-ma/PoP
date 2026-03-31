---
name: operations
description: "Deployment pipelines, CI/CD workflows, GitHub Environments, secrets management, release process (Changesets), milestone releases, emergency rollback procedures, and cost monitoring. Use when working on GitHub Actions, deployment automation, infrastructure, or incident response. Keywords: deploy, release, CI, CD, workflow, rollback, environment, secrets, pipeline, EAS, Cloud Run, Vercel, Supabase, milestone."
user-invocable: true
metadata:
  author: PoP team
  version: "1.0.0"
---

# Operations Skill

Use this skill when working on CI/CD pipelines, deployment workflows,
GitHub Actions, environments, secrets, releases, or emergency procedures.

## Deployment Pipelines

### Mobile App (iOS + Android)
- **Trigger:** Git tag `pop@x.y.z` (created by Changesets) OR manual workflow_dispatch
- **Workflow:** `.github/workflows/eas-build.yml`
- **What it does:** EAS build → App Store / Play Store submission
- **Manual dispatch inputs:** platform (ios/android/all), profile (production/preview), skip_submit (bool)
- **Manual CLI override (build):** `cd frontend && eas build --profile production --platform all`
- **Manual CLI override (submit):** `cd frontend && eas submit --platform all --latest`

### Mobile Preview Build
- **Trigger:** PR labeled `preview-build` OR manual workflow_dispatch
- **Workflow:** `.github/workflows/eas-preview.yml`
- **What it does:** EAS preview build only (no store submission)
- **Manual dispatch inputs:** platform (ios/android/all)

### Dashboard (Next.js)
- **Trigger:** Push to `main` (Vercel auto-deploy)
- **Dashboard URL:** https://pop-dashboard.vercel.app
- **Manual override:** Vercel dashboard → Deployments → Redeploy

### Edge Functions (Supabase)
- **Deployment trigger:** Git tag `edge-functions@x.y.z` OR manual workflow_dispatch
- **Deployment workflow:** `.github/workflows/deploy-edge-functions.yml`
- **CI check (PR only):** `.github/workflows/edge-functions.yml` — deno lint + type-check on PRs touching `supabase/functions/**` or `shared/**`
- **Manual override:** `pnpm deploy:functions`
- **Function secrets:** The GH Actions workflow only deploys code — it does not inject per-function secrets. Runtime env vars (`CLOUD_RUN_URL`, `CLOUD_RUN_API_KEY` for `detect-toilet-flush`, etc.) must be set separately in Supabase: Dashboard → Edge Functions → Secrets, or via `supabase secrets set <KEY>=<VALUE> --project-ref $SUPABASE_PROJECT_REF`.

### Cloud Run (YAMNet ML)
- **Trigger:** Git tag `cloud-run@x.y.z` OR manual workflow_dispatch
- **Workflow:** `.github/workflows/cloud-run.yml`
- **Manual dispatch inputs:** reason (required string)
- **Manual CLI override:** (see gcloud command in Emergency section)

### CI (Pull Requests)
- **Trigger:** Pull requests targeting `main`
- **Workflow:** `.github/workflows/ci.yml`
- **What it does:** TypeScript type-check (all workspaces), Biome lint, changeset presence check

### Database Migrations
- **Trigger:** Manual (no CI — intentional for safety)
- **Command:** `supabase db push`
- ⚠️ Always review migration SQL before pushing

## Release Process

### Package releases (automated via Changesets)
1. PRs include changeset files (`.changeset/<slug>.md`)
2. Merge to `main` → Changesets bot opens "Version Packages" PR (`chore: version packages`)
3. Review the version PR (check CHANGELOG, version bumps)
4. Merge → Changesets workflow runs and creates/pushes git tags per package
5. Tags trigger platform-specific deploys (EAS for `pop@*`, Cloud Run for `cloud-run@*`, Edge Functions for `edge-functions@*`)

### Monorepo milestone releases

Milestone releases mark a **coherent cross-stack snapshot** — e.g. "PoP v1.0.0 is the combination that shipped on launch day." The `v` prefix distinguishes these from Changesets package tags (`pop@1.0.0`).

#### Phase 1 — Manual (always required)
1. Go to GitHub → Releases → Draft a new release
2. Tag: `v1.0.0` (no package prefix)
3. Title: `PoP v1.0.0 — <tagline>`
4. Body template:
   ```markdown
   ## PoP v1.0.0 — <tagline>

   ### Components
   | Component | Version | Notes |
   |---|---|---|
   | Mobile app | pop@x.y.z | iOS build N, Android build N |
   | Dashboard | dashboard@x.y.z | |
   | Shared | @pop/shared@x.y.z | |
   | Edge functions | commit <sha> | |
   | Cloud Run | cloud-run@x.y.z | |
   | Database | <migration-filename>.sql | |

   ### Highlights
   - ...
   ```
5. Publish (or save as draft and add highlights before publishing)

#### Phase 2 — Automated (workflow_dispatch)
Use `.github/workflows/milestone-release.yml` to auto-fill current component versions:
1. Go to Actions → **Milestone Release** → Run workflow
2. Inputs:
   - `version` — e.g. `1.0.0`
   - `name` — e.g. `Launch` or `Beta`
   - `prerelease` — check if this is a pre-release
3. The workflow reads all `package.json` versions, the latest migration filename, and the current commit SHA, then creates a GitHub Release with the table pre-filled.
4. Open the created release and add highlights before publishing.

> Agent runbook: to create a milestone release programmatically, read `frontend/package.json`, `dashboard/package.json`, `shared/package.json`, `google-cloud-run/package.json` for versions; run `git rev-parse --short HEAD` for the commit SHA; list `supabase/migrations/` and take the last entry for the DB migration; compose the body from the template above; then trigger the workflow via `gh workflow run milestone-release.yml -f version=X.Y.Z -f name=<name>`.

## GitHub Environment & Secrets

Only `production` environment exists (we have one backend, no staging).

| Environment | Branch restriction | Secrets |
|---|---|---|
| `production` | `main` only | EXPO_TOKEN, GCP_SA_KEY, GCP_PROJECT_ID, CLOUD_RUN_API_KEY, SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF |

> Note: GitHub Environments are orthogonal to EAS channels (development/preview/production).
> EAS channels control OTA update branches. GitHub Environments control secret access and deployment tracking. No sync needed.

## Emergency Rollback Procedures

### Mobile app
- **OTA update:** `cd frontend && eas update --branch production --message "rollback to vX.Y.Z"`
- **Native rollback:** Submit previous build version via App Store Connect / Play Console

### Edge functions
- `git revert <commit> && git push origin main` → restores previous code on `main`
- Redeploy the reverted version via `.github/workflows/deploy-edge-functions.yml`:
  - Either trigger the workflow manually using **workflow_dispatch** in the GitHub Actions UI
  - Or create a new tag pointing to the reverted commit and push it, e.g.:
    - `git tag edge-functions@rollback-<date>`
    - `git push origin edge-functions@rollback-<date>`

### Cloud Run
- GCP Console → Cloud Run → yamnet-detector → Revisions → Route 100% to previous revision

### Dashboard
- Vercel dashboard → Deployments → previous deploy → Promote to Production

### Database migration
- Write a reverse migration in `supabase/migrations/` and `supabase db push`
- ⚠️ No automatic rollback — always test migrations carefully

## Cost Overview

| Service | ~Monthly cost |
|---|---|
| Cloud Run (1 min instance) | $15–25 |
| Supabase Pro | $25 |
| EAS builds | Free (30/month) or $99/month |
| Vercel | Free (hobby) or $20/month |

## Manual Deploy Commands (emergency only)

These are fallbacks when CI is broken. Prefer the automated pipelines above.

### Cloud Run
```
cd google-cloud-run
gcloud run deploy yamnet-detector \
  --source . --region us-central1 \
  --memory 2Gi --cpu 2 \
  --min-instances 1 --max-instances 100 \
  --timeout 60s --allow-unauthenticated \
  --set-env-vars MODEL_VERSION=yamnet-v1,API_SECRET_KEY=$CLOUD_RUN_API_KEY
```

### Edge functions
```
pnpm deploy:functions
# or individually:
supabase functions deploy detect-toilet-flush --project-ref $SUPABASE_PROJECT_REF
```
