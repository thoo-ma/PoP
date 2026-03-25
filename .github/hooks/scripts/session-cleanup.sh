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

# If this is an agent-managed clone, delete it
if [ -f "$CWD/.agent-clone-origin" ]; then
  rm -rf "$CWD"
fi

exit 0
