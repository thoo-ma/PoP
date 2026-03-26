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
# Regenerate TASK_ID until both the directory AND branch name are free
# (handles orphaned branches from prior crashes where worktree was removed but branch was not)
while true; do
  TASK_ID="task-$(date +%s)-$$"
  WORKTREE_DIR="$(dirname "$CWD")/${REPO_NAME}-${TASK_ID}"
  [ -e "$WORKTREE_DIR" ] && continue
  git -C "$CWD" show-ref --verify --quiet "refs/heads/agent/${TASK_ID}" 2>/dev/null && continue
  break
done
BRANCH_NAME="agent/${TASK_ID}"

if git -C "$CWD" show-ref --verify --quiet "refs/remotes/origin/main"; then
  BASE_BRANCH="origin/main"
else
  BASE_BRANCH="HEAD"
fi

# Clean up partial worktree on any error
trap 'git -C "$CWD" worktree remove "$WORKTREE_DIR" --force 2>/dev/null; git -C "$CWD" worktree prune 2>/dev/null' ERR

git -C "$CWD" worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME" "$BASE_BRANCH"

# Record source repo path immediately so cleanup/clean scripts can find this worktree
echo "$CWD" > "$WORKTREE_DIR/.agent-worktree-origin"

# Install dependencies in the new worktree
(cd "$WORKTREE_DIR" && pnpm install --frozen-lockfile --prefer-offline --quiet < /dev/null 2>/dev/null) || true

ADDITIONAL_CONTEXT=$(jq -Rn \
  --arg worktree "$WORKTREE_DIR" \
  --arg branch "$BRANCH_NAME" \
  --arg cwd "$CWD" \
  '
  "IMPORTANT: You are working in an isolated git worktree.\nYour worktree directory: \($worktree)\nBranch: \($branch)\n\nCRITICAL — TERMINAL ISOLATION RULES (parallel sessions share the same shell):\n1. EVERY terminal command MUST start with: cd \($worktree) &&\n2. NEVER rely on the current working directory being correct — another session may have changed it between your commands.\n3. For git operations, prefer: git -C \($worktree) <command>\n4. Do NOT modify files in \($cwd) (the original repo).\n\nExample (correct):\n  cd \($worktree) && git add -A && git commit -m [msg] && git push\nExample (WRONG — cwd may be another sessions worktree):\n  git add -A && git commit -m [msg]"
  ')

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": ${ADDITIONAL_CONTEXT}
  }
}
EOF
