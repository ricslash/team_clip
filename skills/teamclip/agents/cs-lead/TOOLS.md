# Tools -- CS Lead

## Core Tools

### Paperclip API
Coordination and issue management.
- Issue CRUD: `GET/POST/PATCH /api/companies/{companyId}/issues`
- Issue checkout: `POST /api/issues/{id}/checkout`
- Issue documents: `PUT /api/issues/{id}/documents/{key}` (use keys: `requirements`, `feedback-synthesis`, `documentation`)
- Issue attachments: `POST /api/issues/{id}/attachments` (screenshots, user flow diagrams)
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Confluence (Atlassian MCP)
Your primary publication platform. All finalized documentation goes to Confluence.
- `createConfluencePage` -- publish new help center articles, guides, changelogs.
- `updateConfluencePage` -- update existing documentation when features change.
- `searchConfluenceUsingCql` -- find existing docs before creating duplicates.
- `getConfluencePage` -- read current documentation state.
- `getPagesInConfluenceSpace` -- audit documentation coverage.

### Jira (Atlassian MCP)
- `searchJiraIssuesUsingJql` -- find user-reported bugs, feature requests, and support tickets.
- `createJiraIssue` -- file bug reports from user feedback (with reproduction steps).
- `getJiraIssue` -- read engineering ticket details for documentation context.

### Firebase (when configured)
- User analytics: activation rates, retention curves, feature adoption.
- Onboarding funnel analysis: where users drop off, time to activation.
- NPS/CSAT survey data collection and analysis.
- Cohort analysis for churn signals.

### Chrome DevTools
- Test help center pages for usability (load time, responsive, accessibility).
- Verify onboarding flows work correctly in the live product.
- Screenshot capture for documentation.
- Test search functionality in help center.

### Firecrawl
- Monitor competitor help centers for structure and coverage ideas.
- Scan Reddit, Discord, and forums for user feedback and community sentiment.
- Research best practices in user documentation and onboarding.

### Google Sheets
- NPS/CSAT tracking over time.
- Feedback theme tracking and scoring.
- Documentation coverage matrix (feature x doc status).
- Onboarding funnel metrics.

## Workspace

- Default cwd: `/home/eric/dev/`
- **Project workspace override**: Gets product workspace from task context for product-specific documentation.
- CS artifacts: `products/<product>/customer-success/`
  - `docs/help-center/` -- help center articles
  - `docs/guides/` -- user guides
  - `docs/feedback-YYYY-MM-DD.md` -- feedback synthesis reports
  - `docs/onboarding-flow.md` -- onboarding flow spec
  - `docs/faq.md` -- FAQ
  - `docs/changelog.md` -- user-facing changelog
  - `docs/nps-YYYY-MM-DD.md` -- NPS/CSAT reports
  - `docs/community-YYYY-MM-DD.md` -- community health reports

## Skills

### para-memory-files
Memory operations: storing feedback themes, documentation status, onboarding metrics, community health data.

### paperclip (core)
All Paperclip API interactions.
