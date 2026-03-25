#!/bin/bash
set -e

INPUT=$(cat)
echo "$INPUT" > /tmp/hook-debug.json

CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

if [ -z "$CWD" ]; then
  CWD=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
fi

TOPLEVEL=$(git -C "$CWD" rev-parse --show-toplevel 2>/dev/null || true)
if [ -n "$TOPLEVEL" ]; then
  CWD="$TOPLEVEL"
fi

REPO_NAME=$(basename "$CWD")
TASK_ID="task-$(date +%H%M%S)"
WORKTREE_DIR="$(dirname "$CWD")/${REPO_NAME}-${TASK_ID}"
BRANCH_NAME="agent/${TASK_ID}"

if git show-ref --verify --quiet "refs/remotes/origin/main"; then
  BASE_BRANCH="origin/main"
else
  BASE_BRANCH="HEAD"
fi

git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME" "$BASE_BRANCH"

echo "$CWD" > "$WORKTREE_DIR/.agent-worktree-origin"

# Install dependencies in the new worktree
(cd "$WORKTREE_DIR" && pnpm install --frozen-lockfile --prefer-offline --quiet < /dev/null 2>/dev/null) || true

ADDITIONAL_CONTEXT=$(jq -Rn \
  --arg worktree "$WORKTREE_DIR" \
  --arg branch "$BRANCH_NAME" \
  --arg cwd "$CWD" \
  '"IMPORTANT: You are working in an isolated git worktree. Your working directory is: \($worktree) — Branch: \($branch). All operations MUST happen inside this directory. Do NOT modify files in \($cwd)."')

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": ${ADDITIONAL_CONTEXT}
  }
}
EOF