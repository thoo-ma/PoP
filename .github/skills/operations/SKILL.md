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
- **Manual CLI override:** `cd frontend && eas build --profile production --platform all`

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
4. Merge → GitHub Release created per package, git tags pushed
5. Tags trigger platform-specific deploys (EAS for `pop@*`, Cloud Run for `cloud-run@*`, Edge Functions for `edge-functions@*`)

### Monorepo milestone releases (manual)
For marking coherent cross-stack releases (e.g. launch day, major milestones):
1. Go to GitHub → Releases → Draft a new release
2. Tag: `v1.0.0` (no package prefix — this is the monorepo milestone)
3. Body template:
   ```
   ## PoP v1.0.0 — <tagline>
   - Mobile app: pop@x.y.z (iOS build N, Android build N)
   - Dashboard: dashboard@x.y.z
   - Edge functions: deployed from commit <sha>
   - Cloud Run: cloud-run@x.y.z
   - Database: latest migration <filename>.sql
   ```
4. This is a human-curated snapshot — not automated.
   Future improvement: a workflow_dispatch action to auto-fill current versions.

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
- `git revert <commit> && git push origin main` → auto-redeploys previous version

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
