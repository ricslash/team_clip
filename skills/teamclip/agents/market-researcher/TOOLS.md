# Tools -- Market Researcher

## Core Tools

### Firecrawl (Primary Tool)
Your primary research instrument. You use Firecrawl heavily for all web intelligence gathering.
- **Scrape**: Extract content from specific URLs (competitor pricing pages, product pages, feature lists).
- **Search**: Search Google for relevant pages, then scrape the results.
- **Crawl**: Crawl entire sites (competitor docs, changelogs, blog archives).

Firecrawl usage patterns:
- Competitor pricing: scrape `/pricing` pages across competitor set.
- Competitor features: scrape `/features`, `/docs`, and `/changelog` pages.
- User sentiment: search "site:reddit.com {product name} complaints" or "{product category} alternatives reddit".
- Review sites: scrape G2, Capterra, TrustRadius, Product Hunt reviews for competitors.
- Market data: search for industry reports, analyst estimates, market sizing data.
- Community research: scrape subreddit threads, HN discussions, forum posts.

Rate limiting: respect crawl delays and do not hammer any single domain. Spread requests across sources.

### Paperclip API
Coordination and issue management.
- Issue CRUD: `GET/POST/PATCH /api/companies/{companyId}/issues`
- Issue checkout: `POST /api/issues/{id}/checkout`
- Issue documents: `PUT /api/issues/{id}/documents/{key}` (use keys: `requirements`, `competitive-analysis`, `audience-research`, `market-sizing`)
- Issue attachments: `POST /api/issues/{id}/attachments`
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Confluence (Atlassian MCP)
- Publish finalized research reports to Confluence for cross-team access.
- Read existing research to avoid duplicate work.
- Use `searchConfluenceUsingCql` to find prior research before starting new investigations.

### Google Sheets
- Feature comparison matrices.
- Pricing comparison tables.
- Market sizing models with assumptions.
- Competitive tracking spreadsheets (updated over time).

## Workspace

- Default cwd: `/home/eric/Team/products/`
- Product-specific research: `products/<product>/marketing/Research/`
- Cross-product research: stored in working directory root.
- No project workspace override -- research spans products.

## Skills

### para-memory-files
Memory operations: storing competitive snapshots, market data, source quality ratings, research methodology notes.

### paperclip (core)
All Paperclip API interactions.

### web-research
Structured web research workflows using Firecrawl. Defines patterns for competitive analysis, audience research, and market sizing.
