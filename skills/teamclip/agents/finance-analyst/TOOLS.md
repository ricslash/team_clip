# Tools -- Finance Analyst

## Core Tools

### Python (openpyxl)
Your primary output tool. All financial deliverables are generated as formatted Excel workbooks.
- Use openpyxl for: workbook creation, sheet management, cell formatting, conditional formatting, chart generation.
- Standard workbook structure: Summary sheet (executive view), Detail sheet (full data), Assumptions sheet (all inputs and their sources).
- Formatting: bold headers, freeze panes, currency format on financial cells, percentage format on ratios, conditional formatting (red/yellow/green) on threshold metrics.
- Charts: line charts for trends (revenue, costs), pie charts for breakdowns (cost allocation, revenue by product), bar charts for comparisons (pricing scenarios).

### Paperclip API
Coordination and issue management.
- Issue CRUD: `GET/POST/PATCH /api/companies/{companyId}/issues`
- Issue checkout: `POST /api/issues/{id}/checkout`
- Issue documents: `PUT /api/issues/{id}/documents/{key}` (use keys: `requirements`, `financial-analysis`, `pricing-recommendation`)
- Issue attachments: `POST /api/issues/{id}/attachments` (Excel workbooks, PDF summaries)
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Stripe CLI (`stripe`)
Revenue data and payment infrastructure. Authenticated for account `acct_1TEV7fJn2cEY0lly`.
- `stripe products list` / `stripe prices list` — inspect product catalog and pricing
- `stripe customers list` — customer data
- `stripe subscriptions list` — active subscriptions for MRR/churn analysis
- `stripe invoices list` — invoice history for revenue recognition
- `stripe balance_transactions list` — transaction-level revenue data
- `stripe charges list --limit 100` — recent charge data with fees
- `stripe disputes list` — dispute/chargeback tracking
- `stripe logs tail` — real-time API event monitoring
Use these for pulling transaction data, subscription metrics, refunds, and disputes. Calculate MRR, ARR, churn rate, net revenue retention. Segment revenue by plan, cohort, and acquisition channel.

### Google Sheets
- Shared financial dashboards accessible to Eric and other agents.
- Collaborative models where real-time access matters.
- KPI tracking spreadsheets updated at regular intervals.

### Confluence (Atlassian MCP)
- Publish financial report summaries (executive-friendly format).
- Publish pricing strategy documentation.
- Read existing financial docs to maintain consistency.
- Use `createConfluencePage` for new reports, `updateConfluencePage` for periodic updates.

### Firecrawl (via web-research skill)
- Competitor pricing page scraping (for pricing analysis).
- SaaS benchmark research (industry margins, churn rates, CAC benchmarks).
- Tax regulation research (nexus rules, SaaS tax updates).
- For deep market pricing research, request through CMO/Market Researcher.

## Workspace

- Default cwd: `/home/eric/dev/`
- Financial artifacts: `products/<product>/finance/`
  - `models/` -- financial models (`.xlsx`)
  - `reports/` -- P&L, cost reports, unit economics, tax estimates, cash flow (`.xlsx`)
- No project workspace override -- financial view spans products.

## Skills

### para-memory-files
Memory operations: storing financial benchmarks, pricing decisions, cost trends, tax deadlines.

### paperclip (core)
All Paperclip API interactions.
