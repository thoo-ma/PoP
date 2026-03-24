#!/bin/bash
set -e

# Read the hook input from stdin (VS Code pipes JSON with timestamp, cwd, etc.)
INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

# Fallback to git root if cwd not provided
if [ -z "$CWD" ]; then
  CWD=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
fi

REPO_NAME=$(basename "$CWD")

# Extract a descriptive slug from the initial prompt if available.
# SessionStart input includes "initialPrompt" with the user's first message.
# We take the first 5 words, lowercase, replace spaces with dashes, strip special chars.
RAW_PROMPT=$(echo "$INPUT" | jq -r '.initialPrompt // empty')
if [ -n "$RAW_PROMPT" ]; then
  SLUG=$(echo "$RAW_PROMPT" \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/[^a-z0-9 ]//g' \
    | awk '{for(i=1;i<=5&&i<=NF;i++) printf "%s-", $i}' \
    | sed 's/-$//' \
    | cut -c1-50)
else
  SLUG="task"
fi

# Append short timestamp for uniqueness
TASK_ID="${SLUG}-$(date +%H%M%S)"
WORKTREE_DIR="$(dirname "$CWD")/${REPO_NAME}-${TASK_ID}"

# Determine base branch (prefer main, fallback to master, then current HEAD)
BASE_BRANCH="origin/main"
if ! git rev-parse --verify "$BASE_BRANCH" &>/dev/null; then
  BASE_BRANCH="origin/master"
  if ! git rev-parse --verify "$BASE_BRANCH" &>/dev/null; then
    BASE_BRANCH="HEAD"
  fi
fi

# Fetch latest from remote (ignore failures for offline work)
git fetch origin --quiet 2>/dev/null || true

# Create the worktree with a new branch
BRANCH_NAME="agent/${TASK_ID}"
git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME" "$BASE_BRANCH" 2>/dev/null

# Install dependencies in the new worktree
if [ -f "$WORKTREE_DIR/pnpm-lock.yaml" ]; then
  (cd "$WORKTREE_DIR" && pnpm install --frozen-lockfile --quiet 2>/dev/null) || true
elif [ -f "$WORKTREE_DIR/package-lock.json" ]; then
  (cd "$WORKTREE_DIR" && npm ci --quiet 2>/dev/null) || true
elif [ -f "$WORKTREE_DIR/yarn.lock" ]; then
  (cd "$WORKTREE_DIR" && yarn install --frozen-lockfile --quiet 2>/dev/null) || true
elif [ -f "$WORKTREE_DIR/requirements.txt" ]; then
  (cd "$WORKTREE_DIR" && pip install -r requirements.txt --quiet 2>/dev/null) || true
elif [ -f "$WORKTREE_DIR/go.mod" ]; then
  (cd "$WORKTREE_DIR" && go mod download 2>/dev/null) || true
fi

# Write a marker file so the cleanup script knows this is a hook-managed worktree
echo "$CWD" > "$WORKTREE_DIR/.agent-worktree-origin"

# Output JSON that injects context into the agent session.
# The additionalContext tells the agent where to work.
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "IMPORTANT: You are working in an isolated git worktree for parallel agent safety. Your working directory is: ${WORKTREE_DIR} — Branch: ${BRANCH_NAME}. All file edits, terminal commands, and operations MUST happen inside this directory. Do NOT cd to or modify files in the original repo at ${CWD}. When you are done, push your branch and create a PR from '${BRANCH_NAME}'."
  }
}
EOF
