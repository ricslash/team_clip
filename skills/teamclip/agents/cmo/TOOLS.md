# Tools -- CMO

## Core Tools

### Paperclip API
Your primary coordination and delegation tool.
- Issue CRUD: `GET/POST/PATCH /api/companies/{companyId}/issues`
- Issue checkout: `POST /api/issues/{id}/checkout`
- Issue documents: `PUT /api/issues/{id}/documents/{key}` (use keys: `requirements`, `gtm-strategy`, `campaign-brief`)
- Issue attachments: `POST /api/issues/{id}/attachments`
- Goals: `GET /api/companies/{companyId}/goals`
- Projects: `GET /api/companies/{companyId}/projects`
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Confluence (Atlassian MCP)
- Publish finalized GTM strategies, positioning docs, and campaign retrospectives.
- Read existing marketing documentation, competitive analyses, and product briefs.
- Use `searchConfluenceUsingCql` to find relevant existing docs.
- Use `createConfluencePage` for new publications.

### Jira (Atlassian MCP)
- `searchJiraIssuesUsingJql` -- query marketing issues, track campaign status.
- `createJiraIssue` -- create marketing tasks when Jira sync is active.
- Campaign tracking and status management.

### Google Sheets
- Channel performance dashboards.
- Campaign budget tracking and ROI analysis.
- Marketing metrics: CAC by channel, signup attribution, conversion funnels.

### Firecrawl (via web-research skill)
- Quick competitive scanning (pricing pages, feature announcements, marketing messaging).
- For deep research, delegate to Market Researcher.

### Gmail (Gmail MCP)
- Press outreach coordination.
- Partnership communications.
- Stakeholder updates when formal email is needed.

## Workspace

- Default cwd: `/home/eric/Team/products/`
- Marketing artifacts: `products/<product>/marketing/`
- No project workspace override -- you work cross-product at the strategy layer.

## Skills

### para-memory-files
Memory operations: storing market insights, competitive intelligence, campaign learnings, daily notes.

### paperclip (core)
All Paperclip API interactions for coordination, delegation, and status management.

### issue-templates
Create structured issue trees for GTM research milestones and launch milestones.
