#!/bin/bash
# Remove all agent-managed worktrees and their branches

REPO_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
# If running from inside an agent worktree, resolve the true origin repo
if [ -f "$REPO_DIR/.agent-worktree-origin" ]; then
  REPO_DIR=$(cat "$REPO_DIR/.agent-worktree-origin" 2>/dev/null || echo "$REPO_DIR")
fi
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
    # Skip the current repo dir itself (in case we're running from a worktree)
    dir_real=$(realpath "$dir" 2>/dev/null || echo "$dir")
    repo_real=$(realpath "$REPO_DIR" 2>/dev/null || echo "$REPO_DIR")
    if [ "$dir_real" = "$repo_real" ]; then
      continue
    fi

    branch=$(git -C "$dir" branch --show-current 2>/dev/null || true)
    echo "Removing worktree $dir"
    git -C "$REPO_DIR" worktree remove "$dir" --force 2>/dev/null || rm -rf "$dir"
    if [ -n "$branch" ] && [[ "$branch" == agent/task-* ]]; then
      git -C "$REPO_DIR" branch -D "$branch" 2>/dev/null || true
    fi
    REMOVED=$((REMOVED + 1))
  fi
done

git -C "$REPO_DIR" worktree prune 2>/dev/null || true

echo "Done. Removed $REMOVED agent worktree(s)."
