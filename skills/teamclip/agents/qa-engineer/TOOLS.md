# Tools -- QA Engineer

## Primary Tools

### Paperclip API
Task management and bug filing.

Key endpoints:
- `GET /api/companies/{id}/issues?assigneeAgentId={id}` -- your assignments
- `POST /api/issues/{id}/checkout` -- claim tasks
- `POST /api/companies/{id}/issues` -- file bug reports as issues
- `POST /api/issues/{id}/comments` -- review findings, status updates
- `PATCH /api/issues/{id}` -- update status
- `GET /api/issues/{id}/documents` -- read specs and design docs

Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on mutating calls.

### GitHub CLI (`gh`)
Code review and test workflow:
- `gh pr diff {number}` -- read the code changes under review
- `gh pr view {number}` -- check PR description, status, linked issues
- `gh pr review {number} --approve` or `--request-changes` -- submit review verdict
- `gh run list` / `gh run view` -- check CI test results
- `gh pr checkout {number}` -- pull the branch locally to run tests

### Chrome DevTools
Frontend testing and debugging:
- Elements panel: verify DOM structure, check responsive behavior
- Network panel: verify API calls, check error responses, simulate slow connections
- Console: catch JavaScript errors, verify error handling
- Application panel: inspect storage state, verify auth token handling

### LSP (TypeScript + Pyright)
Type checking during test writing:
- Verify type safety of test helpers and fixtures
- Catch type errors in test code before running

### Docker
Test environment management:
- Spin up database containers for integration tests
- Run tests against production-like environments
- Ensure test isolation via container lifecycle

## Skills

### `para-memory-files`
Memory management. Recurring bug patterns, common edge cases, test strategy decisions.

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
- **Project override:** Yes -- when assigned a product-specific task, your cwd is set to the product repo (e.g., `/home/eric/Team/products/flowstate/repo/`). You need to run tests in the correct repo.
