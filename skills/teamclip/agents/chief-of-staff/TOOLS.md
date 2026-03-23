# Tools -- Chief of Staff

## Primary Tools

### Paperclip API
Your primary coordination tool. All orchestration happens through the Paperclip API.

Key endpoints you use constantly:
- `GET /api/companies/{id}/goals` -- list all product goals
- `GET /api/companies/{id}/issues?status={status}` -- find issues by status
- `GET /api/companies/{id}/issues?assigneeAgentId={id}` -- find agent workloads
- `POST /api/companies/{id}/issues` -- create handoff issues, gate issues, milestones
- `POST /api/issues/{id}/checkout` -- claim assigned tasks
- `PUT /api/issues/{id}/documents/{key}` -- attach structured documents to issues
- `POST /api/issues/{id}/attachments` -- attach binary files
- `POST /api/issues/{id}/comments` -- status updates, context
- `POST /api/goals/{id}/comments` -- daily/weekly status digests
- `PATCH /api/issues/{id}` -- update status, reassign

Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on mutating calls.

### Discord (via `discord-notify` skill)
Async communication channel to Eric. Use for:
- At-risk goal alerts
- Unresolved blockers (>24h)
- Milestone completions
- Weekly synthesis summaries
- Escalation requests requiring Eric's decision

### Atlassian (Jira)
Read-only for you. Engineering backlog lives in Jira. Use to cross-reference task status when Paperclip issues reference Jira tickets (e.g., `KAN-XX` format).

### Atlassian (Confluence)
Read access to published documentation. Use to verify that documentation gates have been fulfilled -- check that finalized docs exist in the expected Confluence spaces.

## Skills

### `para-memory-files`
Memory management. Daily notes, entity tracking, weekly synthesis, fact extraction. Use every heartbeat for logging and context recall.

### `discord-notify`
Send structured messages to Eric's Discord. Format: summary line + context bullets + recommended action.

### `issue-templates`
Create structured issue trees from templates. Used for:
- Handoff issue creation (engineering done → marketing + CS + legal)
- Quality gate creation (UX review, brand review, legal review, code review)
- Milestone decomposition templates

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PAPERCLIP_API_URL` | Base URL for Paperclip API |
| `PAPERCLIP_API_KEY` | Auth token |
| `PAPERCLIP_RUN_ID` | Current run ID -- include in all mutating API headers |
| `PAPERCLIP_COMPANY_ID` | Company ID for API calls |
| `PAPERCLIP_TASK_ID` | Set when woken for a specific task |
| `PAPERCLIP_WAKE_REASON` | Why this heartbeat fired (timer, mention, assignment) |
| `PAPERCLIP_WAKE_COMMENT_ID` | Set when woken by a comment/mention |
| `PAPERCLIP_APPROVAL_ID` | Set when an approval needs handling |
| `AGENT_HOME` | Your personal directory |

## Workspace

- **Fallback cwd:** `/home/eric/Team/products/`
- **No project override.** You always work cross-product. Your cwd gives you visibility into all product directories.
