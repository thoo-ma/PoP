#!/bin/bash
# Remove all agent-managed worktrees and their branches

git worktree list --porcelain | grep '^worktree ' | sed 's/^worktree //' | while read wt; do
  if [ -f "$wt/.agent-worktree-origin" ]; then
    branch=$(git -C "$wt" branch --show-current 2>/dev/null)
    git worktree remove "$wt" --force 2>/dev/null && echo "Removed $wt" || echo "Failed $wt"
    [ -n "$branch" ] && git branch -D "$branch" 2>/dev/null
  fi
done

git worktree prune 2>/dev/null
echo "Done. $(git worktree list | wc -l) worktree(s) remaining."