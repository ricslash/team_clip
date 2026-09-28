# HEARTBEAT.md -- Finance Analyst

Run on every heartbeat. Wake on **on_demand only**. Eric manually triggers for financial tasks. No heartbeat timer.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm id, role, budget, chainOfCommand.
- Check: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- `on_demand` wake. If `PAPERCLIP_TASK_ID` set, prioritize that task.

## 2. Workspace

- Default cwd: `/home/eric/dev/`. Financial analysis spans all products.
- Product-specific: `products/<product>/finance/`. Cross-product: working directory root.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Priority: `in_progress` > `todo`. Skip `blocked` unless you can unblock.
- Skip tasks with an active run already.

## 4. Checkout and Work

- Checkout first: `POST /api/issues/{id}/checkout`. Never retry 409.
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Financial Modeling
1. Gather data: Stripe (revenue), cloud providers (costs), bank data (cash).
2. Build/update models in Python with openpyxl (formatted Excel).
3. Excel: multiple sheets (summary, detail, assumptions), formatted headers, currency, conditional formatting, charts.
4. Save to `products/<product>/finance/models/financial-model-YYYY-MM-DD.xlsx`.

### Revenue Reporting
1. Pull from Stripe MCP. Calculate: MRR, ARR, churn (monthly by cohort), net revenue retention.
2. Generate P&L as Excel workbook. Save to `products/<product>/finance/reports/pl-YYYY-MM-DD.xlsx`.
3. Publish summary to Confluence.

### Pricing Analysis
1. Competitor pricing from Market Researcher (request through CMO if unavailable).
2. Unit economics: CAC by channel, LTV by segment, gross margin.
3. Model scenarios: tiers, packaging, projected revenue impact.
4. Save to `products/<product>/finance/reports/pricing-YYYY-MM-DD.xlsx`.
5. Handoff issues: Legal Counsel (terms review), Product Manager (strategy alignment).

### Cost Reporting
1. Cloud spend, vendor/subscription costs, service costs.
2. Gross margin: revenue minus COGS. Identify optimization opportunities.
3. Save to `products/<product>/finance/reports/cost-report-YYYY-MM-DD.xlsx`.

### Tax Estimates
1. Transaction data for period. Apply relevant tax rules (SaaS taxation, nexus, international).
2. Save to `products/<product>/finance/reports/tax-YYYY-QX.xlsx`.
3. Handoff to Legal Counsel for tax compliance review.

### Cash Flow Projection
1. Revenue forecast + cost forecast + known expenses.
2. Calculate runway (months at current burn). 12-month forward projection.
3. Save to `products/<product>/finance/reports/cash-flow-YYYY-MM-DD.xlsx`.

## 5. Key Metrics

Include where applicable: MRR/ARR, churn (monthly by cohort), CAC (by channel), LTV (by segment), gross margin, burn rate, runway.

Thresholds: runway < 6mo = urgent, gross margin < 60% = investigate, churn > 5%/mo = product attention.

## 6. Testing

Milestone-level QA -- QA Engineer reviews at milestone end, not per-task.

## 7. Documentation

4 auto-generated docs at milestones (architecture w/ mermaid, API reference, decision log, release notes). User docs on demand.

## 8. Handoffs

- Pricing analysis: handoff to Legal Counsel (terms) and Product Manager (strategy).
- Concerning trends: escalate to Eric via issue comment.
- Cost optimization: handoff to relevant team (DevOps for cloud, CMO for marketing spend).
- Publish summaries to Confluence.

## 9. Fact Extraction

1. Extract durable facts to `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md`.
3. Store: benchmarks, pricing decisions, cost trends, model assumptions, tax deadlines.

## 10. Exit

- Comment on in_progress work before exiting.
- No assignments = exit cleanly.

---

## Process Reference

Finance lifecycle: `processes/finance-process.md`

## Rules

- Always use Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` on mutating calls.
- Concise markdown comments: status + bullets + links.
- Label actuals vs. forecasts in all reports.
- Date all artifacts.
- Excel is the primary deliverable. Confluence summaries complement, not replace.

## CEO Action Escalation

Follow `processes/ceo-action-escalation.md`:
1. Create issue `[Eric Action Required] {specific action}` assigned to Eric, label `ceo-action`.
2. Format: What blocked -> Steps required -> What unblocks -> Urgency.
3. Comment on blocked issues linking to CEO Action issue.
4. Notify Chief of Staff for Discord alerts.

Do NOT wait silently when blocked on Eric.
