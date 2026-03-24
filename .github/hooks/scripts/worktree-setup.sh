#!/bin/bash
set -e

# Read the hook input from stdin (VS Code pipes JSON with timestamp, cwd, etc.)
INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

# Fallback to git root if cwd not provided
if [ -z "$CWD" ]; then
  CWD=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
fi

# Normalize CWD to the git top-level so worktree paths are always based on the repo root
TOPLEVEL=$(git -C "$CWD" rev-parse --show-toplevel 2>/dev/null || true)
if [ -n "$TOPLEVEL" ]; then
  CWD="$TOPLEVEL"
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
fi

# Fallback if slug is empty (e.g. prompt was only punctuation/emoji)
if [ -z "$SLUG" ]; then
  SLUG="task"
fi

# Append short timestamp for uniqueness
TASK_ID="${SLUG}-$(date +%H%M%S)"
WORKTREE_DIR="$(dirname "$CWD")/${REPO_NAME}-${TASK_ID}"

# Fetch latest from remote (ignore failures for offline work)
git fetch origin --quiet 2>/dev/null || true


# PoP uses main — fallback to HEAD if origin/main ref is not present locally
if git show-ref --verify --quiet "refs/remotes/origin/main"; then
  BASE_BRANCH="origin/main"
else
  BASE_BRANCH="HEAD"
fi

# Create the worktree with a new branch
BRANCH_NAME="agent/${TASK_ID}"
if ! git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME" "$BASE_BRANCH"; then
  echo "worktree-setup: failed to create git worktree at '$WORKTREE_DIR' from base '$BASE_BRANCH'" >&2
  exit 1
fi

# Install pnpm dependencies in the new worktree
if ! (cd "$WORKTREE_DIR" && pnpm install --frozen-lockfile --prefer-offline --quiet); then
  echo "worktree-setup: WARNING: pnpm install failed in '$WORKTREE_DIR'. Dependencies may be missing." >&2
fi

# Write a marker file so the cleanup script knows this is a hook-managed worktree
echo "$CWD" > "$WORKTREE_DIR/.agent-worktree-origin"

# Build additionalContext as a JSON-escaped string to handle paths with special characters
ADDITIONAL_CONTEXT=$(jq -Rn \
  --arg worktree "$WORKTREE_DIR" \
  --arg branch "$BRANCH_NAME" \
  --arg cwd "$CWD" \
  '"IMPORTANT: You are working in an isolated git worktree for parallel agent safety. Your working directory is: \($worktree) — Branch: \($branch). All file edits, terminal commands, and operations MUST happen inside this directory. Do NOT cd to or modify files in the original repo at \($cwd). When you are done, push your branch and create a PR from '"'"'\($branch)'"'"'."')

# Output JSON that injects context into the agent session.
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": ${ADDITIONAL_CONTEXT}
  }
}
EOF
