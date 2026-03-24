#!/usr/bin/env bash
# setup-github-labels.sh — Create the PoP label taxonomy on GitHub
#
# Prerequisites: gh CLI authenticated (`gh auth login`)
# Usage: bash scripts/setup-github-labels.sh
#
# Safe to run multiple times — gh label create --force overwrites existing.

set -euo pipefail

REPO="thoo-ma/PoP"

echo "=== Creating labels on $REPO ==="

# --- Type labels ---
gh label create "type: bug"        --repo "$REPO" --color "d73a4a" --description "Something isn't working"                   --force
gh label create "type: feature"    --repo "$REPO" --color "0e8a16" --description "New feature or enhancement"                --force
gh label create "type: refactor"   --repo "$REPO" --color "1d76db" --description "Code improvement, no behavior change"      --force
gh label create "type: chore"      --repo "$REPO" --color "bfd4f2" --description "Maintenance, deps, tooling, CI"            --force
gh label create "type: docs"       --repo "$REPO" --color "0075ca" --description "Documentation only"                        --force

# --- Scope labels (monorepo areas) ---
gh label create "scope: frontend"  --repo "$REPO" --color "c2e0c6" --description "React Native app (frontend/)"              --force
gh label create "scope: dashboard" --repo "$REPO" --color "d4c5f9" --description "Next.js admin (dashboard/)"                --force
gh label create "scope: shared"    --repo "$REPO" --color "fef2c0" --description "@pop/shared package"                       --force
gh label create "scope: supabase"  --repo "$REPO" --color "3ecf8e" --description "Edge functions & migrations"               --force
gh label create "scope: cloud-run" --repo "$REPO" --color "f9d0c4" --description "Python ML service"                         --force
gh label create "scope: infra"     --repo "$REPO" --color "e6e6e6" --description "CI/CD, monorepo config, tooling"           --force

# --- Priority labels ---
gh label create "priority: critical" --repo "$REPO" --color "b60205" --description "Pre-launch blocker (Tier 1)"             --force
gh label create "priority: high"     --repo "$REPO" --color "d93f0b" --description "Should be done soon (Tier 2-3)"          --force
gh label create "priority: medium"   --repo "$REPO" --color "fbca04" --description "Normal priority (Tier 4-5)"              --force
gh label create "priority: low"      --repo "$REPO" --color "c2e0c6" --description "Nice to have (Tier 6-7)"                 --force

# --- Structure labels ---
gh label create "epic"             --repo "$REPO" --color "3E4B9E" --description "Parent tracking issue with sub-issues"     --force
gh label create "blocked"          --repo "$REPO" --color "e99695" --description "Waiting on another issue"                  --force

# --- Size labels ---
gh label create "size: XS"        --repo "$REPO" --color "ededed" --description "< 1 hour"                                  --force
gh label create "size: S"         --repo "$REPO" --color "d4d4d4" --description "1-4 hours"                                  --force
gh label create "size: M"         --repo "$REPO" --color "bababa" --description "1-2 days"                                   --force
gh label create "size: L"         --repo "$REPO" --color "a0a0a0" --description "3-5 days"                                   --force
gh label create "size: XL"        --repo "$REPO" --color "878787" --description "1+ week"                                    --force

echo ""
echo "=== Cleaning up old labels ==="

# Remove redundant/unused default labels
gh label delete "feat"        --repo "$REPO" --yes 2>/dev/null || true
gh label delete "enhancement" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "duplicate"   --repo "$REPO" --yes 2>/dev/null || true
gh label delete "invalid"     --repo "$REPO" --yes 2>/dev/null || true
gh label delete "question"    --repo "$REPO" --yes 2>/dev/null || true
gh label delete "wontfix"     --repo "$REPO" --yes 2>/dev/null || true

echo ""
echo "=== Done! Labels created. ==="
echo ""
echo "Next: run 'bash scripts/apply-labels-to-issues.sh' to label existing issues."
