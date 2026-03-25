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

# If this is an agent-managed clone, delete it (with safety checks)
if [ -f "$CWD/.agent-clone-origin" ]; then
  ORIGIN_PATH=$(cat "$CWD/.agent-clone-origin" 2>/dev/null || true)
  BASENAME=$(basename "$CWD")

  if \
    [ -n "$CWD" ] && \
    [ "$CWD" != "/" ] && \
    [ -d "$CWD/.git" ] && \
    [[ "$BASENAME" == *-task-* ]] && \
    [ -n "$ORIGIN_PATH" ] && \
    [ "$ORIGIN_PATH" != "$CWD" ] && \
    [ -d "$ORIGIN_PATH/.git" ]; then
    rm -rf "$CWD" || echo "session-cleanup: warning — could not remove $CWD" >&2
  fi
fi

# Always exit 0: cleanup is best-effort, must not fail the Stop hook
exit 0
