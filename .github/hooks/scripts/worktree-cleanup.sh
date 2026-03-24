#!/bin/bash
set -e

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')

if [ -z "$CWD" ]; then
  CWD=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
fi

# Check if we're inside a hook-managed worktree
if [ -f "$CWD/.agent-worktree-origin" ]; then
  ORIGIN_REPO=$(cat "$CWD/.agent-worktree-origin")
  BRANCH=$(git -C "$CWD" branch --show-current 2>/dev/null)

  # Push the branch if there are commits ahead of the base
  if [ -n "$BRANCH" ]; then
    git -C "$CWD" push origin "$BRANCH" 2>/dev/null || true
  fi

  # Remove the worktree from the original repo
  if [ -d "$ORIGIN_REPO/.git" ] || [ -f "$ORIGIN_REPO/.git" ]; then
    git -C "$ORIGIN_REPO" worktree remove "$CWD" --force 2>/dev/null || true
  fi
fi

exit 0
