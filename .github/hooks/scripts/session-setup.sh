#!/bin/bash
set -e

INPUT=$(cat)

CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

if [ -z "$CWD" ]; then
  CWD=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
fi

TOPLEVEL=$(git -C "$CWD" rev-parse --show-toplevel 2>/dev/null || true)
if [ -n "$TOPLEVEL" ]; then
  CWD="$TOPLEVEL"
fi

REPO_NAME=$(basename "$CWD")
# Regenerate TASK_ID until we find a free directory (handles orphaned clones from prior crashes)
while true; do
  TASK_ID="task-$(date +%s)-$$"
  CLONE_DIR="$(dirname "$CWD")/${REPO_NAME}-${TASK_ID}"
  [ ! -e "$CLONE_DIR" ] && break
done
BRANCH_NAME="agent/${TASK_ID}"

if git -C "$CWD" show-ref --verify --quiet "refs/remotes/origin/main"; then
  BASE_BRANCH="origin/main"
else
  BASE_BRANCH="HEAD"
fi

# Clean up partial clone on any error
trap 'rm -rf "$CLONE_DIR"' ERR

# Create a shared clone — near-instant, near-zero extra disk space, fully isolated refs
git clone --shared --no-checkout "$CWD" "$CLONE_DIR"

# Record source repo path immediately so cleanup/clean scripts can find this clone
echo "$CWD" > "$CLONE_DIR/.agent-clone-origin"

git -C "$CLONE_DIR" checkout -b "$BRANCH_NAME" "$BASE_BRANCH"

# Re-point origin to the real remote URL so the agent can push to GitHub
ORIGIN_URL=$(git -C "$CWD" remote get-url origin 2>/dev/null || true)
if [ -n "$ORIGIN_URL" ]; then
  git -C "$CLONE_DIR" remote set-url origin "$ORIGIN_URL"
fi

# Install dependencies
(cd "$CLONE_DIR" && pnpm install --frozen-lockfile --prefer-offline --quiet < /dev/null 2>/dev/null) || true

ADDITIONAL_CONTEXT=$(jq -Rn \
  --arg clone "$CLONE_DIR" \
  --arg branch "$BRANCH_NAME" \
  --arg cwd "$CWD" \
  '"IMPORTANT: You are working in an isolated git clone. Your working directory is: \($clone) — Branch: \($branch). All operations MUST happen inside this directory. Do NOT modify files in \($cwd)."')

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": ${ADDITIONAL_CONTEXT}
  }
}
EOF
