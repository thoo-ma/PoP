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

# If this is an agent-managed worktree, remove it
if [ -f "$CWD/.agent-worktree-origin" ]; then
  ORIGIN_REPO=$(cat "$CWD/.agent-worktree-origin" 2>/dev/null || true)
  BASENAME=$(basename "$CWD")

  if \
    [ -n "$CWD" ] && \
    [ "$CWD" != "/" ] && \
    [[ "$BASENAME" == *-task-* ]] && \
    [ -n "$ORIGIN_REPO" ] && \
    [ "$ORIGIN_REPO" != "$CWD" ] && \
    [ -d "$ORIGIN_REPO/.git" ]; then
    git -C "$ORIGIN_REPO" worktree remove "$CWD" --force 2>/dev/null || echo "session-cleanup: warning — could not remove worktree $CWD" >&2
    git -C "$ORIGIN_REPO" worktree prune 2>/dev/null || true
  fi
fi

# Always exit 0: cleanup is best-effort, must not fail the Stop hook
exit 0
