---
name: pr-review-handler
description: "Handle Copilot code review comments on a pull request: auto-fix clear bugs, escalate ambiguous comments to the human, reply to everything, and push fixes. Keywords: PR review, code review, Copilot, auto-fix, escalate, review triage."
user-invocable: true
disable-model-invocation: true
argument-hint: "PR number to review (e.g. 42)"
metadata:
  author: PoP team
  version: "1.0.0"
---

# Skill: PR Review Handler

Handle Copilot code review comments on a pull request: auto-fix clear bugs, escalate ambiguous comments to the human, reply to everything, and push fixes.

## Required MCP Tools

| Tool | Purpose |
|---|---|
| `github/pull_request_read` | Fetch review comments on a PR |
| `github/add_reply_to_pull_request_comment` | Reply to a review comment thread |
| `read/readFile` | Read local working copy |
| `edit/editFiles` | Apply fixes locally |
| `execute/runInTerminal` | Run type-check / lint / tests |
| `vscode/askQuestions` | Present escalated comments to the human |

## Inputs

The calling agent must provide:
- `owner` / `repo` — GitHub repository
- `pullNumber` — the PR number
- `issueNumber` — the related issue number (for commit messages and scoping)
- `typeCheckCommand` — the command to validate changes (e.g. `turbo typecheck --filter=pop`)

## Guiding Principle

**Be conservative.** Only auto-fix comments where the problem AND the solution are both unambiguous. When in doubt, escalate — a false fix is worse than asking the human.

## Workflow

### Step 1 — Wait for review

Poll `github/pull_request_read` every 30 seconds until review comments appear.
- Timeout: **5 minutes** (Copilot can be slow on large PRs)
- If no comments arrive after timeout, the PR is clean — skip to the review report

### Step 2 — Fetch and group comments

Use `github/pull_request_read` to collect **both** types of feedback:

1. **Inline review comments** — line-level comments attached to a specific file and line. These require triage (Steps 3–5). Group by file path.
2. **Overall review body** — the top-level `body` field on each review object. This is the reviewer's conclusion summary, NOT actionable per-line feedback. **Do not triage, fix, or escalate it.** Read it, include it verbatim in the review report, and move on.

Filter inline comments to unresolved items only (no reply from the PR author).

### Step 3 — Triage each comment

Read the comment body carefully. Look for these signals to classify:

**Auto-fix** (agent handles it autonomously):
- The comment points to a clear, objective bug: wrong import, missing null check, typo, unused variable, incorrect prop name
- The fix is mechanical — there is only one reasonable way to address it
- Signal words: "bug", "error", "missing", "undefined", "unused", "wrong", "incorrect", "typo"

**Escalate to human** (agent does NOT touch the code):
- The comment suggests an alternative approach or design choice: "Consider using X", "You might want to", "It would be better to"
- The comment asks a question: "Why did you…?", "Is this intentional?", "Should this be…?"
- The comment is about style, naming, or architecture preferences
- The comment involves a trade-off where reasonable people could disagree
- The fix would change behavior or logic, not just correct an obvious mistake
- Signal words: "consider", "suggest", "might", "could", "prefer", "alternative", "opinion"

**If you hesitate even slightly on classification → escalate.** Do not fix.

### Step 4 — Fix (auto-fix comments only)

For each comment classified as auto-fix:

1. Read the target file locally (`read/readFile`)
2. Understand the exact line and context from the comment
3. Apply the minimal fix (`edit/editFiles`) — change as little as possible
4. Run type-check with the provided `typeCheckCommand`
5. If type-check fails, revert the change and reclassify this comment as "escalate"

### Step 5 — Reply to every comment

Use `github/add_reply_to_pull_request_comment` for each:

- **Auto-fixed**: `"Fixed in <sha>. <one-line explanation of the change>."`
- **Escalated**: `"Flagging for human review. <brief summary of why: e.g. 'This involves a design choice between X and Y.'>"`

Do NOT use generic replies. Each reply must show you understood the comment.

### Step 6 — Commit & push (if there were any fixes)

Bundle all auto-fixes into one commit:
- Message: `"fix: address review comments on #<issueNumber>"`
- Regular push (never force-push)

If there were zero auto-fixes (everything was escalated), skip this step.

### Step 7 — Present summary to human

Use `vscode/askQuestions` to present:

```
Review complete. Here's what happened:

Auto-fixed (N comments):
- file.tsx:42 — Added missing null check on `user.name`
- file.tsx:78 — Fixed import: `Button` from heroui-native

Escalated for your review (M comments):
- file.tsx:15 — Copilot suggests using `Card.Body` instead of `View`. This is a design choice.
- file.tsx:55 — Copilot asks: "Is this fallback intentional?"

What should I do with the escalated comments?
  [a] Apply some of them (tell me which ones)
  [b] Dismiss them all as-is
  [c] I'll handle them on GitHub myself
```

Wait for the human's response before proceeding.

### Step 8 — Act on human's decisions

Based on the human's answer:
- **[a] Apply some**: Use `vscode/askQuestions` to present each escalated comment **one at a time**. For each, show the file, line, Copilot's suggestion, and options (Apply / Dismiss / Skip). Apply approved changes → edit, type-check, commit, push. Reply to dismissed comments with the human's reasoning.
- **[b] Dismiss all**: Reply to every escalated comment on GitHub with the dismissal reasoning.
- **[c] Human handles**: Stop and let them handle it on GitHub.

### Step 9 — Review report

Before returning control to the calling agent, output a structured review report:

```
## Review report

Total comments: X

Auto-fixed (N):
- file.tsx:42 — <what was fixed>

Human-approved fixes (N):
- file.tsx:15 — <what was changed and why>

Dismissed (N):
- file.tsx:55 — <reason>

Remaining / escalated (N):
- file.tsx:80 — <why it needs human attention>
```

This report covers **review activity only**. The calling agent is responsible for any broader task summary.

## Constraints

- Do NOT auto-fix a comment if there is any ambiguity about what the correct fix is
- Do NOT force-push — always regular push to preserve review history
- Do NOT use generic replies — each reply must show understanding of the comment
- ALWAYS run type-check before pushing fixes
- ALWAYS present escalated comments to the human before continuing
