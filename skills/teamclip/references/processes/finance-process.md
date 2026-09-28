# Finance Process (TeamClip)

_Last updated: 2026-03-25_

Financial operations lifecycle. Every phase produces actionable artifacts and updates the finance issue tree.

**Cardinal rule:** Deliver actionable artifacts, not just documents. Every output should be a spreadsheet, model, or memo the CEO can use to make a decision today.

---

## Lifecycle

```
ASSESS --> MODEL --> REPORT --> RECOMMEND --> MONITOR
            ^                                   |
            +-----------------------------------+ (monthly cycle)
```

| # | Phase | Purpose | Key Output |
|---|-------|---------|------------|
| 1 | **Assess** | Gather and validate financial data | Data inventory, source verification |
| 2 | **Model** | Build/update financial models and scenarios | `.xlsx` workbooks, Python analysis |
| 3 | **Report** | Generate formatted reports and summaries | `.xlsx` reports + Confluence pages |
| 4 | **Recommend** | Pricing changes, cost cuts, investment priorities | Decision memos as issue documents |
| 5 | **Monitor** | Track actuals vs. forecast, alert on anomalies | Variance reports, monthly close |

**Agent:** Finance Analyst (sole agent — absorbs bookkeeper, cost-analyst, financial-analyst, pricing-strategist, tax-accountant roles).

---

## Phase Details

### 1. ASSESS

Finance Analyst creates milestone "Financial Assessment: {product}" with subtasks per data source.

**Data sources:** Stripe MCP (revenue/subscriptions), cloud dashboards (infra costs), vendor invoices, marketing spend, payroll/contractors.

**Activities:** Pull raw data, validate completeness, reconcile Stripe against bank, categorize transactions (MRR/one-time/expansion/contraction for revenue; COGS/OpEx/CapEx for costs).

**Storage:** `PUT /api/issues/{id}/documents/{data-inventory|data-gaps}`, attachments for Excel ledgers.

**Exit:** All revenue sources identified, all cost categories populated, gaps documented, reconciliation passes.

### 2. MODEL

**Activities:**
1. Revenue forecast (3 scenarios), unit economics (CAC/LTV/margins/payback), cash flow (12-month), cost model (fixed vs. variable)
2. For pricing: competitor data via Firecrawl, cost floor per tier, revenue impact scenarios, tier structure with feature gates
3. Scenario analysis: best/base/worst, sensitivity on key assumptions, break-even

**Output:** `.xlsx` workbooks with Summary, Detail (formulas), Assumptions, Scenario sheets.

**Storage:** Workbooks as attachments, `PUT /api/issues/{id}/documents/{assumptions|scenario-analysis}`

**Exit:** All revenue/cost streams covered, 3+ scenarios, assumptions documented, formulas validated.

### 3. REPORT

Generate formatted Excel reports (P&L, unit economics, cash flow, cost report, KPI summary) using Python + openpyxl. Professional formatting: currency, conditional formatting, charts, frozen panes. Markdown summaries for quick reference.

**Storage:** `.xlsx` as attachments, `PUT /api/issues/{id}/documents/{summary|kpi-snapshot}`

### 4. RECOMMEND

Analyze reports for actionable recommendations: pricing changes, cost optimization, investment priorities, tax strategies, cash management. Quantify impact (monthly/annual). Write decision memos with 2+ options and quantified rationale.

Chief of Staff auto-creates cross-team handoffs: pricing changes --> CMO + CTO + Legal; cost cuts --> DevOps + CTO; investments --> PM.

**Storage:** `PUT /api/issues/{id}/documents/{decision-memo|pricing-recommendation|cost-optimization}`

### 5. MONITOR (monthly cycle)

Track actuals vs. forecast, alert on anomalies, monthly close, update models with actuals.

**Alert thresholds:** Revenue miss >10%, cost overrun >15%, churn spike >2x, runway <6 months, vendor cost increase >25% MoM.

Chief of Staff escalates to CEO via Discord when thresholds exceeded.

---

## Excel Generation (Python + openpyxl)

### Standard workbook structure
| Sheet | Purpose | Required |
|-------|---------|----------|
| Summary | Key metrics, charts, executive view | Always |
| Detail | Full line-item data with formulas | Always |
| Assumptions | All inputs clearly labeled | Always |
| Scenarios | Conservative / moderate / aggressive | For models |
| Comparison | Competitor/benchmark data | For pricing |

### Formatting standards
- Headers: Bold, dark blue (#1F4E79), white text, frozen row
- Currency: `$#,##0.00` or `$#,##0`
- Negative: Red font, parentheses
- Conditional: Green (positive), Yellow (near threshold), Red (negative)
- Charts: bar for comparisons, line for trends
- File naming: `<report-type>-YYYY-MM-DD.xlsx`

---

## Revenue Data Pipeline

```
Stripe MCP --> Python processing --> Excel reports (attachments)
                                 --> Confluence summaries
                                 --> KPI dashboard (issue documents)
```

Steps: Extract (subscriptions, payments, cancellations) --> Transform (MRR, cohort aggregation, churn/expansion, margin calc) --> Load (Excel, Confluence, model updates).

---

## Key Metrics

| Metric | Target | Alert |
|--------|--------|-------|
| MRR/ARR | Growing MoM/YoY | Decline > 5% |
| Churn rate | < 5% monthly | > 8% monthly |
| LTV:CAC | > 3:1 | < 3:1 |
| Gross margin | > 70% | < 60% |
| Runway | > 12 months | < 6 months |
| Payback period | < 12 months | > 18 months |
| Net revenue retention | > 100% | < 90% |

---

## Cross-Team Interfaces

| Team | Finance Sends | Finance Receives |
|------|--------------|-----------------|
| **Product** | Unit economics, pricing recs, budget constraints | Feature cost implications |
| **Engineering** | Infra budget, vendor approvals, build vs. buy | Infra cost data, LOE estimates |
| **DevOps** | Cloud budget targets, cost optimization priorities | Cloud spend reports |
| **Marketing** | Campaign budgets, CAC targets | Campaign spend, channel ROI |
| **Legal** | Compliance data, tax filings | Regulatory requirements, compliance costs |
| **CS** | Support cost per user, LTV data | Churn data, expansion signals |

---

## Anti-Patterns

- **Reports without recommendations** — Every report answers "so what?" and "what should we do?"
- **Models without assumptions** — Black box models are useless
- **Static numbers in Excel** — Use formulas, not hardcoded values
- **Undated reports** — Date everything: filename and content
- **Pricing by gut feel** — Reference competitors, cost floor, willingness-to-pay, projections
- **Single-scenario planning** — Always 3+ scenarios
- **Disconnected from Stripe** — Revenue data must come from the payment processor
- **Standalone files** — Financial deliverables belong on issues as attachments or documents
