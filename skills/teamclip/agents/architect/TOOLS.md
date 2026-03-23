# Tools -- Architect

## Primary Tools

### Paperclip API
Coordination, task management, design document storage.

Key endpoints:
- `GET /api/companies/{id}/issues?assigneeAgentId={id}` -- your assignments
- `POST /api/issues/{id}/checkout` -- claim tasks
- `PUT /api/issues/{id}/documents/{key}` -- store design docs (`design`, `data-model`, `api-contract`)
- `POST /api/companies/{id}/issues` -- create implementation subtasks
- `POST /api/issues/{id}/comments` -- review feedback, decisions

Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on mutating calls.

### LSP (TypeScript + Pyright)
Real-time type checking for code review. Use to verify type safety, catch `any` usage, and validate interface contracts.

- TypeScript: strict mode, no implicit any, no unused locals
- Pyright: strict mode for Python type checking

### GitHub CLI (`gh`)
Code review workflow:
- `gh pr view {number}` -- read PR description, status, reviews
- `gh pr diff {number}` -- read the diff for architecture review
- `gh pr review {number} --approve` or `--request-changes` -- submit review
- `gh issue list` -- check for open architecture-related issues
- `gh repo view` -- understand repo structure

### Atlassian (Confluence)
Architecture documentation:
- Publish finalized design docs to Confluence
- Read existing architecture decision records for context
- Maintain the architecture knowledge base

### Atlassian (Jira)
Cross-reference engineering backlog. Read task status and sprint context.

## Skills

### `para-memory-files`
Memory management. Architecture decisions are your most important persistent artifacts.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PAPERCLIP_API_URL` | Base URL for Paperclip API |
| `PAPERCLIP_API_KEY` | Auth token |
| `PAPERCLIP_RUN_ID` | Current run ID |
| `PAPERCLIP_COMPANY_ID` | Company ID |
| `PAPERCLIP_TASK_ID` | Set when woken for a specific task |
| `PAPERCLIP_WAKE_REASON` | Why you were woken |
| `AGENT_HOME` | Your personal directory |

## Workspace

- **Fallback cwd:** `/home/eric/Team/products/`
- **Project override:** Yes -- when assigned a product-specific task, your cwd is set to the product repo (e.g., `/home/eric/Team/products/flowstate/repo/`). You need to read the codebase to design for it.
