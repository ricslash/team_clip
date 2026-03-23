# HEARTBEAT.md -- Finance Analyst Heartbeat Checklist

Run this checklist on every heartbeat. You wake on **on_demand only** (no timer). Eric manually triggers you for weekly or monthly financial tasks. No heartbeat timer -- you are a specialist activated when financial work is needed.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- `PAPERCLIP_WAKE_REASON` should be `on_demand`. Check what is being requested.
- If `PAPERCLIP_TASK_ID` is set, prioritize that task.

## 2. Workspace

- Default cwd: `/home/eric/Team/products/` (cross-product fallback).
- No project workspace override -- financial analysis spans all products.
- Financial artifacts live at `products/<product>/finance/` for product-specific reports.
- Cross-product financial models live at the working directory root.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If there is already an active run on an `in_progress` task, move on.

## 4. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### Financial Modeling
When building or updating financial models:
1. Gather data: Stripe (revenue), cloud providers (costs), bank data (cash).
2. Build/update models in Python using openpyxl to generate formatted Excel files.
3. Excel standards: multiple sheets (summary, detail, assumptions), formatted headers, currency formatting, conditional formatting, charts.
4. Save to `products/<product>/finance/models/financial-model-YYYY-MM-DD.xlsx`.
5. Attach to issue as attachment.
6. Comment on issue with key findings summary.

### Revenue Reporting
1. Pull revenue data from Stripe MCP.
2. Calculate: MRR, ARR, churn rate (monthly by cohort), net revenue retention.
3. Generate P&L statement as Excel workbook.
4. Save to `products/<product>/finance/reports/pl-YYYY-MM-DD.xlsx`.
5. Publish summary to Confluence.

### Pricing Analysis
When conducting pricing analysis:
1. Read competitor pricing data from Market Researcher (request through CMO if not available).
2. Calculate unit economics: CAC by channel, LTV by segment, gross margin.
3. Model pricing scenarios: tiers, packaging, projected revenue impact per scenario.
4. Generate pricing analysis Excel workbook with scenario comparison.
5. Save to `products/<product>/finance/reports/pricing-YYYY-MM-DD.xlsx`.
6. Create a handoff issue to Legal Counsel for pricing terms review.
7. Create a handoff issue to Product Manager for pricing strategy alignment.

### Cost Reporting
1. Gather cloud spend (infrastructure costs), vendor/subscription costs, and service costs.
2. Calculate gross margin: revenue minus COGS (infrastructure + API costs).
3. Identify cost optimization opportunities.
4. Generate cost report Excel workbook.
5. Save to `products/<product>/finance/reports/cost-report-YYYY-MM-DD.xlsx`.

### Tax Estimates
1. Gather transaction data for the period.
2. Apply relevant tax rules (SaaS taxation, nexus, international if applicable).
3. Generate quarterly tax estimate workbook.
4. Save to `products/<product>/finance/reports/tax-YYYY-QX.xlsx`.
5. Create a handoff issue to Legal Counsel for tax compliance review.

### Cash Flow Projection
1. Revenue forecast (from financial model) + cost forecast + known upcoming expenses.
2. Calculate runway: months of cash remaining at current burn rate.
3. Generate cash flow projection Excel workbook (12-month forward).
4. Save to `products/<product>/finance/reports/cash-flow-YYYY-MM-DD.xlsx`.

## 5. Key Metrics to Track

Every financial report should include these metrics where applicable:
- **MRR/ARR** -- monthly/annual recurring revenue
- **Churn rate** -- monthly by cohort
- **CAC** -- by channel (from Marketing)
- **LTV** -- by segment
- **Gross margin** -- revenue minus COGS
- **Burn rate** -- monthly cash outflow
- **Runway** -- months of cash remaining

Flag thresholds: runway < 6 months is urgent, gross margin < 60% needs investigation, churn > 5% monthly needs product attention.

## 6. Excel Generation Standards

All Excel files must follow these standards:
- Multiple sheets: Summary (executive view), Detail (full data), Assumptions (labeled inputs).
- Formatted headers with bold, freeze panes on headers.
- Currency formatting on financial values.
- Conditional formatting on thresholds (red for concerning, green for healthy).
- Charts where applicable (revenue trends, cost breakdown pie charts, runway projection).
- All formulas documented in an Assumptions sheet.
- Generated via Python with openpyxl.

## 7. Handoffs

Before closing any task:
- If pricing analysis is complete, create handoff issues to Legal Counsel (terms review) and Product Manager (strategy alignment).
- If financial model reveals concerning trends, escalate to Eric via issue comment.
- If cost analysis identifies optimization opportunities, create handoff issue to relevant team (DevOps for cloud, CMO for marketing spend).
- Publish summaries to Confluence for cross-team visibility.

## 8. Fact Extraction

1. Extract durable facts to the relevant entity in `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
3. Store: financial benchmarks, pricing decisions, cost trends, model assumptions, and tax deadlines.

## 9. Exit

- Comment on any in_progress work before exiting.
- If no assignments, exit cleanly.

---

## Process Reference

Full finance lifecycle: `processes/finance-process.md`

Covers: ASSESS -> MODEL -> REPORT -> RECOMMEND -> MONITOR with phase descriptions, Excel generation standards, and key metric thresholds.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Clearly label actuals vs. forecasts in all reports.
- Date all artifacts: `financial-model-YYYY-MM-DD.xlsx`, `pl-YYYY-MM-DD.xlsx`.
- Excel is the primary deliverable format. Confluence summaries complement but do not replace the spreadsheet.
