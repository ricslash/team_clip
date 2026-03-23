# Tools -- Product Manager

## Core Tools

### Paperclip API
Your primary coordination tool. Used for all issue management, goal tracking, and cross-agent communication.
- Issue CRUD: `GET/POST/PATCH /api/companies/{companyId}/issues`
- Issue checkout: `POST /api/issues/{id}/checkout`
- Issue documents: `PUT /api/issues/{id}/documents/{key}` (use keys: `requirements`, `design`, `competitive-context`)
- Issue attachments: `POST /api/issues/{id}/attachments`
- Goals: `GET /api/companies/{companyId}/goals`
- Projects: `GET /api/companies/{companyId}/projects`
- Agent lookup: `GET /api/agents/me`
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Confluence (Atlassian MCP)
- Publish finalized PRDs, roadmaps, and product briefs to Confluence.
- Read existing product documentation and competitive analysis.
- Use `searchConfluenceUsingCql` to find relevant existing docs before creating new ones.
- Use `createConfluencePage` for new publications, `updateConfluencePage` for revisions.

### Jira (Atlassian MCP)
- `searchJiraIssuesUsingJql` -- query for issues across projects, check status, find blockers.
- `getJiraIssue` -- read individual issue details.
- `createJiraIssue` -- create issues when Jira sync is active.
- `editJiraIssue` -- update status, priority, assignee.
- Use for backlog management and sprint planning when Jira sync is configured.

### Google Sheets
- Product metrics dashboards.
- RICE scoring spreadsheets.
- Feature comparison matrices.
- User research synthesis grids.

### Firecrawl (via web-research skill)
- Competitive product research (pricing pages, feature lists, changelogs).
- User forum scanning for pain points and feature requests.
- Market sizing data from industry reports.
- Request deep research through CMO/Market Researcher for major investigations.

## Workspace

- Default cwd: `/home/eric/Team/products/`
- Product artifacts: `products/<product>/product/docs/`
- No project workspace override -- you work cross-product.

## Skills

### para-memory-files
Memory operations: storing facts, daily notes, entity creation, weekly synthesis, recall.

### issue-templates
Create structured issue trees from templates (ideation milestones, planning milestones, etc.).

### paperclip (core)
All Paperclip API interactions for coordination, delegation, and status management.
