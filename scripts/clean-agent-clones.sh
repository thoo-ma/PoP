#!/bin/bash
# Remove all agent-managed clone directories (identified by .agent-clone-origin marker)

REPO_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
PARENT_DIR=$(dirname "$REPO_DIR")
REMOVED=0

for dir in "$PARENT_DIR"/*/; do
  if [ -f "${dir}.agent-clone-origin" ]; then
    echo "Removing $dir"
    rm -rf "$dir" && REMOVED=$((REMOVED + 1)) || echo "Failed to remove $dir"
  fi
done

echo "Done. Removed $REMOVED agent clone(s)."
