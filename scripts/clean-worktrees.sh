#!/bin/bash
# Remove all agent-managed worktrees and their branches

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

  # Only remove directories that look like agent worktrees
  if [ -f "${dir}.agent-worktree-origin" ]; then
    branch=$(git -C "$dir" branch --show-current 2>/dev/null || true)
    echo "Removing worktree $dir"
    git -C "$REPO_DIR" worktree remove "$dir" --force 2>/dev/null || rm -rf "$dir"
    [ -n "$branch" ] && git -C "$REPO_DIR" branch -D "$branch" 2>/dev/null || true
    REMOVED=$((REMOVED + 1))
  fi
done

git -C "$REPO_DIR" worktree prune 2>/dev/null || true

echo "Done. Removed $REMOVED agent worktree(s)."
