# Tools -- CTO

## Primary Tools

### Paperclip API
Coordination and delegation. You create tasks, assign work, review output, and manage engineering pipeline.

Key endpoints:
- `GET /api/companies/{id}/issues?assigneeAgentId={id}` -- check your assignments and report workloads
- `POST /api/companies/{id}/issues` -- create tasks, milestones, subtasks
- `POST /api/issues/{id}/checkout` -- claim assigned tasks
- `PUT /api/issues/{id}/documents/{key}` -- attach specs, design docs, decision records
- `POST /api/issues/{id}/comments` -- reviews, status updates, decisions
- `PATCH /api/issues/{id}` -- update status, reassign

Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on mutating calls.

### GitHub CLI (`gh`)
Repository oversight and infrastructure. Authenticated as `ricslash`. You don't write code, but you:
- Review PR descriptions and architecture-level changes (`gh pr view`, `gh pr diff`)
- Check CI status (`gh run list`, `gh run view`)
- Review open issues and their labels (`gh issue list`)
- Enforce branch protection and merge policies
- Configure repository settings (`gh api repos/{owner}/{repo}/...`)
- Manage GitHub Actions secrets/variables (`gh secret set`, `gh variable set`)

### Google Cloud CLI (`gcloud`)
GCP architecture oversight. Authenticated as `epciesielski@gmail.com`. Used for:
- Reviewing project configurations (`gcloud projects list`, `gcloud services list`)
- Architecture-level infra decisions (which services to enable, IAM policies)
- Verifying production configurations align with architecture decisions
- Creating projects and configuring OAuth (`gcloud projects create`, `gcloud auth configure-docker`)

### Atlassian (Jira)
Cross-reference engineering backlog. Verify Paperclip issues align with Jira tickets. Read sprint status and velocity.

### Atlassian (Confluence)
Read and write architecture decision records, technical specs, and engineering documentation. Verify documentation gates are met at milestones.

## Skills

### `para-memory-files`
Memory management. Architecture decisions, technical context, team patterns.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PAPERCLIP_API_URL` | Base URL for Paperclip API |
| `PAPERCLIP_API_KEY` | Auth token |
| `PAPERCLIP_RUN_ID` | Current run ID |
| `PAPERCLIP_COMPANY_ID` | Company ID |
| `PAPERCLIP_TASK_ID` | Set when woken for a specific task |
| `PAPERCLIP_WAKE_REASON` | Why this heartbeat fired |
| `PAPERCLIP_WAKE_COMMENT_ID` | Set when woken by a comment |
| `AGENT_HOME` | Your personal directory |

## Workspace

- **Fallback cwd:** `/home/eric/dev/`
- **No project override.** You manage across all products. You read product repos when reviewing work but don't need to be rooted in one.
