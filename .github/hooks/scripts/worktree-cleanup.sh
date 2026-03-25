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

# Check if we're inside a hook-managed worktree
if [ -f "$CWD/.agent-worktree-origin" ]; then
  ORIGIN_REPO=$(cat "$CWD/.agent-worktree-origin")
  # Resolve ORIGIN_REPO to git top-level
  RESOLVED_ORIGIN=$(git -C "$ORIGIN_REPO" rev-parse --show-toplevel 2>/dev/null || true)
  if [ -n "$RESOLVED_ORIGIN" ]; then
    ORIGIN_REPO="$RESOLVED_ORIGIN"
  fi

  # Remove the worktree from the original repo
  if [ -d "$ORIGIN_REPO/.git" ] || [ -f "$ORIGIN_REPO/.git" ]; then
    git -C "$ORIGIN_REPO" worktree remove "$CWD" --force 2>/dev/null || true
    git -C "$ORIGIN_REPO" worktree prune 2>/dev/null || true
  fi
fi

exit 0