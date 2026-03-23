# HEARTBEAT.md -- Full-Stack Engineer Heartbeat Checklist

No timer-based heartbeat. Wake triggers: assignment only. You wake when given a task and work until it's done.

## 0. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`.
- Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` header on mutating API calls.

## 1. Get Assignment

- If `PAPERCLIP_TASK_ID` is set, that's your task.
- Otherwise: `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress`
- Prioritize: `in_progress` first (finish what's started), then `todo`.
- `POST /api/issues/{id}/checkout` before working. Never retry a 409.

## 2. Understand the Task

Before writing a single line of code:

1. **Read the task description** and all attached documents (`GET /api/issues/{id}/documents`).
2. **Read the parent issue/milestone** for broader context.
3. **Read the design doc** if one exists (keyed as `design` on the parent or this issue).
4. **Read the product CLAUDE.md** in the repo -- it has project-specific conventions, architecture, and safety rules. The repo CLAUDE.md takes precedence over team-level conventions.
5. **Read existing code** in the area you'll be modifying. Understand the patterns already in use. Match them.

If the task is underspecified (no clear acceptance criteria, ambiguous scope), comment on the issue asking for clarification and set status to `blocked`. Do not guess at requirements.

## 3. Establish Baseline

Before making changes:

1. Run the full test suite. Record the result.
2. If tests are already failing, comment on the issue noting pre-existing failures. Do not fix unrelated failures unless asked.
3. Your contract: tests passing before you start → tests passing when you finish.

## 4. Implement

1. **Work in a feature branch.** Branch naming: `feat/{issue-key}-{short-description}` or `fix/{issue-key}-{short-description}`.
2. **Write the implementation.** Follow the design doc. Follow the product's coding conventions.
3. **Write tests alongside code.** Not after. Not "later." Each feature gets unit tests. User-facing flows get integration tests. API endpoints get contract tests.
4. **Commit frequently** with clear messages. Reference the issue key: `{ISSUE-KEY}: {description}`.
5. **Self-decompose if needed.** If the task is large, create subtasks under it (`POST /api/companies/{companyId}/issues` with `parentId`). Work through them sequentially.

## 5. Quality Check

Before marking done:

1. **Run the full test suite.** All tests pass. No skipped tests. No new warnings.
2. **Type check passes.** `tsc --noEmit` for TypeScript. `pyright` for Python. Zero errors.
3. **No `any` types introduced.** Strict typing enforced.
4. **Lint passes.** ESLint/Prettier for JS/TS. Ruff/Black for Python.
5. **No secrets in code.** No API keys, passwords, or credentials committed.
6. **Documentation updated.** If you changed an API, update the API docs. If you changed a component, update its JSDoc/docstring.

## 6. Submit for Review

1. **Create a PR** via `gh pr create`. Include:
   - Clear title referencing the issue key
   - Description of what changed and why
   - Testing notes (what you tested, how to verify)
   - Screenshots if user-facing changes
2. **Update the issue** with a comment linking the PR.
3. **Set issue status to `done`** (which triggers the review pipeline: Architect reviews architecture, QA reviews tests, UX Director reviews UI if applicable).

## 7. Handle Review Feedback

When reviews come back with requested changes:
- Read the feedback carefully.
- Fix blocking issues. Discuss suggestions you disagree with in PR comments.
- Push fixes to the same branch. Comment on the PR when ready for re-review.
- Do not resolve review comments yourself -- let the reviewer resolve them.

## 8. Fact Extraction

1. Record product-specific patterns and conventions in `$AGENT_HOME/life/` (PARA).
2. Update daily notes with task progress.
3. Technical learnings (gotchas, workarounds, useful patterns) are worth persisting.

## 9. Exit

- Comment on any in_progress work before exiting.
- If all assigned tasks are done or blocked, exit cleanly.

---

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Tests pass before AND after every task. This is non-negotiable.
- No `any` in TypeScript. No untyped Python.
- No skipped tests. Every test runs, every test passes.
- Commits reference the issue key.
- Never push directly to main. All code goes through PRs.
- Never deploy. DevOps Engineer owns deployment.
