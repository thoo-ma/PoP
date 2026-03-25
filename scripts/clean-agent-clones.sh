#!/bin/bash
# Remove all agent-managed clone directories (identified by .agent-clone-origin marker)

REPO_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
PARENT_DIR=$(dirname "$REPO_DIR")
REMOVED=0

for dir in "$PARENT_DIR"/*/; do
  # Skip non-directories and symlinks
  if [ ! -d "$dir" ]; then
    continue
  fi
  if [ -L "$dir" ]; then
    echo "Skipping symlink $dir"
    continue
  fi

  # Only remove directories that look like agent clones
  if [ -f "${dir}.agent-clone-origin" ] && [ -d "${dir}.git" ]; then
    echo "Removing $dir"
    rm -rf "$dir" && REMOVED=$((REMOVED + 1)) || echo "Failed to remove $dir"
  fi
done

echo "Done. Removed $REMOVED agent clone(s)."
