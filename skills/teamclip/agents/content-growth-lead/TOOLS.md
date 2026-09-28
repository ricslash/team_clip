# Tools -- Content & Growth Lead

## Core Tools

### Paperclip API
Coordination and issue management.
- Issue CRUD: `GET/POST/PATCH /api/companies/{companyId}/issues`
- Issue checkout: `POST /api/issues/{id}/checkout`
- Issue documents: `PUT /api/issues/{id}/documents/{key}` (use keys: `requirements`, `content-draft`, `seo-analysis`)
- Issue attachments: `POST /api/issues/{id}/attachments` (images, assets, mockups)
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Firecrawl
Used for SEO research and competitive content analysis.
- Keyword research: search for target terms and analyze top-ranking content.
- Competitor content audit: scrape competitor blogs, landing pages, and content hubs.
- SERP analysis: check what ranks for target keywords and identify content gaps.
- Community monitoring: scan Reddit, HN, and forums for content opportunities.

### Confluence (Atlassian MCP)
- Publish finalized content (blog posts, guides, landing page copy) for approval workflows.
- Read existing content to maintain consistency and avoid duplication.
- Use `searchConfluenceUsingCql` to find related content before creating new pieces.

### Chrome DevTools
- Test landing page performance (load time, rendering, responsive behavior).
- Verify SEO implementation (meta tags, schema markup, heading structure).
- Check accessibility compliance on marketing pages.
- Debug tracking implementations (UTM parameters, conversion pixels).

### Google Sheets
- Content calendar management.
- SEO keyword tracking (rankings, search volume, competition).
- Campaign performance metrics (CTR, conversion rate, CAC by channel).
- Growth experiment tracking (hypothesis, test design, results).

### Gmail (Gmail MCP)
- Email campaign drafts and reviews.
- Outreach for PR and partnership opportunities.
- Newsletter management.

## Workspace

- Default cwd: `/home/eric/dev/`
- **Project workspace override**: Gets product workspace from task context for product-specific content.
- Marketing assets: `products/<product>/marketing/assets/`
  - `landing-pages/` -- HTML landing pages
  - `email-sequences/` -- email campaign content
  - `social/` -- social media content
  - `ads/` -- ad creative and copy
  - `automations/` -- automation workflow content
- Marketing docs: `products/<product>/marketing/docs/`

## Skills

### para-memory-files
Memory operations: storing content performance data, SEO insights, growth experiment results.

### paperclip (core)
All Paperclip API interactions.

### campaign-execute
Paperclip skills for campaign execution: Reddit posts, email drafts, social content distribution. Used in place of n8n for now -- agent-as-executor model.
