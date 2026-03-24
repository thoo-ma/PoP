#!/usr/bin/env bash
# apply-labels-to-issues.sh — Apply the new label taxonomy to all open PoP issues
#
# Prerequisites:
#   1. gh CLI authenticated (`gh auth login`)
#   2. Labels already created (`bash scripts/setup-github-labels.sh`)
#
# Usage: bash scripts/apply-labels-to-issues.sh
#
# This script:
#   - Removes old labels (enhancement, bug, feat) from each issue
#   - Applies new type/scope/priority/size labels
#   - Adds 'epic' label to tracking issues
#   - Cleans up [Epic] / Epic: title prefixes

set -euo pipefail

REPO="thoo-ma/PoP"

label_issue() {
  local num="$1"
  shift
  echo "  #$num → $*"
  gh issue edit "$num" --repo "$REPO" --add-label "$*" 2>/dev/null || echo "    ⚠ failed to add labels to #$num"
}

remove_old_labels() {
  local num="$1"
  gh issue edit "$num" --repo "$REPO" --remove-label "enhancement" 2>/dev/null || true
  gh issue edit "$num" --repo "$REPO" --remove-label "bug"         2>/dev/null || true
  gh issue edit "$num" --repo "$REPO" --remove-label "feat"        2>/dev/null || true
}

rename_issue() {
  local num="$1"
  local new_title="$2"
  echo "  #$num title → $new_title"
  gh issue edit "$num" --repo "$REPO" --title "$new_title" 2>/dev/null || echo "    ⚠ failed to rename #$num"
}

echo "=== Applying labels to open issues ==="

# #79 — Epic: Landing page
remove_old_labels 79
label_issue 79 "epic,type: feature,scope: infra,priority: low,size: XL"
rename_issue 79 "Landing page / marketing site (Astro + GitHub Pages)"

# #78 — Unify iOS and Android bundle identifiers
remove_old_labels 78
label_issue 78 "type: chore,scope: frontend,priority: medium,size: S"

# #76 — Dashboard game_config save/publish
remove_old_labels 76
label_issue 76 "type: feature,scope: dashboard,priority: high,size: M"

# #75 — Dashboard error boundary and loading states
remove_old_labels 75
label_issue 75 "type: feature,scope: dashboard,priority: medium,size: S"

# #74 — Fix unsafe Supabase client typing
remove_old_labels 74
label_issue 74 "type: bug,scope: dashboard,priority: high,size: S"

# #73 — Standardize edge function error response shape
remove_old_labels 73
label_issue 73 "type: refactor,scope: supabase,scope: shared,priority: medium,size: L"

# #72 — Add workspace-level linting and formatting
remove_old_labels 72
label_issue 72 "type: chore,scope: infra,priority: medium,size: M"

# #71 — Centralize edge function import_map.json
remove_old_labels 71
label_issue 71 "type: chore,scope: supabase,priority: medium,size: S"

# #70 — Extract response helpers for edge functions
remove_old_labels 70
label_issue 70 "type: refactor,scope: supabase,priority: medium,size: M"

# #68 — Align shared/ import convention
remove_old_labels 68
label_issue 68 "type: refactor,scope: frontend,scope: shared,priority: medium,size: M"

# #67 — Remove unused dashboard dependencies
remove_old_labels 67
label_issue 67 "type: chore,scope: dashboard,priority: low,size: XS"

# #66 — Fix Zod version mismatch
remove_old_labels 66
label_issue 66 "type: bug,scope: shared,scope: dashboard,priority: high,size: M"

# #65 — Add unit tests for shared/
remove_old_labels 65
label_issue 65 "type: chore,scope: shared,priority: high,size: L"

# #64 — Add GitHub Actions CI pipeline
remove_old_labels 64
label_issue 64 "type: chore,scope: infra,priority: critical,size: M"

echo ""
echo "=== Labeling closed epic issues ==="

# #32 — [Epic] Tailwind-Variants Style Extraction (closed)
remove_old_labels 32
label_issue 32 "epic,type: refactor,scope: frontend,priority: high,size: XL"

# #9 — [Epic] HeroUI Native Migration (closed)
remove_old_labels 9
label_issue 9 "epic,type: refactor,scope: frontend,priority: high,size: XL"

echo ""
echo "=== Done! ==="
echo ""
echo "Useful queries now available:"
echo "  All epics:           gh issue list --repo $REPO --label epic"
echo "  Critical priority:   gh issue list --repo $REPO --label 'priority: critical'"
echo "  Frontend scope:      gh issue list --repo $REPO --label 'scope: frontend'"
echo "  Bugs:                gh issue list --repo $REPO --label 'type: bug'"
echo "  Dashboard features:  gh issue list --repo $REPO --label 'scope: dashboard' --label 'type: feature'"
