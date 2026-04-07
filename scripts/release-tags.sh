#!/usr/bin/env bash
# release-tags.sh — Create git tags for private packages and dispatch deploy workflows
#
# Called by changesets/action as the "publish" command after the version PR merges.
# Replaces `changeset tag` which skips private packages.
#
# Requirements: node, git, gh (all available on ubuntu-latest runners)
# Environment: GITHUB_TOKEN must be set for `gh` CLI auth

set -euo pipefail

REPO="${GITHUB_REPOSITORY:-thoo-ma/PoP}"

# ── Package → Tag → Workflow mapping ──────────────────────────────────────────
# Format: "packageJsonPath|tagPrefix|workflowFile"
# workflowFile is empty for packages with no deploy target
PACKAGES=(
  "frontend/package.json|pop|eas-build.yml"
  "dashboard/package.json|dashboard|deploy-dashboard.yml"
  "shared/package.json|@pop/shared|"
  "google-cloud-run/package.json|cloud-run|cloud-run.yml"
  "supabase/functions/package.json|edge-functions|deploy-edge-functions.yml"
)

new_tags=()
dispatches=()

for entry in "${PACKAGES[@]}"; do
  IFS='|' read -r pkg_path tag_prefix workflow <<< "$entry"

  if [[ ! -f "$pkg_path" ]]; then
    echo "⚠ $pkg_path not found, skipping"
    continue
  fi

  version=$(node -p "require('./$pkg_path').version")
  tag="${tag_prefix}@${version}"

  # Check if tag already exists on remote
  if git ls-remote --tags origin "refs/tags/$tag" | grep -q "$tag"; then
    echo "✓ $tag already exists"
    continue
  fi

  echo "→ Creating tag: $tag"
  git tag "$tag"
  new_tags+=("$tag")

  if [[ -n "$workflow" ]]; then
    dispatches+=("$workflow|$tag")
  fi
done

if [[ ${#new_tags[@]} -eq 0 ]]; then
  echo ""
  echo "All tags up to date — no deploys needed."
  exit 0
fi

# Push all new tags in one command
echo ""
echo "Pushing ${#new_tags[@]} new tag(s)..."
git push origin "${new_tags[@]}"

# Dispatch deploy workflows for new tags
if [[ ${#dispatches[@]} -gt 0 ]]; then
  echo ""
  echo "Dispatching deploy workflows..."
  for dispatch in "${dispatches[@]}"; do
    IFS='|' read -r workflow tag <<< "$dispatch"

    echo "→ Dispatching $workflow (reason: Release $tag)"

    if [[ "$workflow" == "eas-build.yml" ]]; then
      # EAS build uses different inputs — defaults are fine (all platforms, production, no skip)
      gh workflow run "$workflow" --repo "$REPO" --ref main
    else
      gh workflow run "$workflow" --repo "$REPO" --ref main -f "reason=Release $tag"
    fi
  done
fi

# Summary
echo ""
echo "=== Release Summary ==="
echo "Tags created: ${new_tags[*]}"
if [[ ${#dispatches[@]} -gt 0 ]]; then
  echo "Deploys dispatched:"
  for dispatch in "${dispatches[@]}"; do
    IFS='|' read -r workflow tag <<< "$dispatch"
    echo "  • $workflow ($tag)"
  done
fi
