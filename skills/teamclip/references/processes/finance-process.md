# Finance Process — Full Lifecycle Reference (TeamClip)

_Last updated: 2026-03-20_
_Adapted from: Team workflow/finance-process.md_

This is the complete financial operations lifecycle. It applies to any product in the organization. Every phase produces artifacts, updates the finance issue tree, and has defined exit criteria before moving forward.

**The cardinal rule:** Deliver actionable artifacts, not just documents. Every output should be a spreadsheet, model, or memo that the CEO can use to make a decision today. If it's not actionable, it's not done.

---

## The Full Lifecycle

```
ASSESS --> MODEL --> REPORT --> RECOMMEND --> MONITOR
            ^                                   |
            +-----------------------------------+ (monthly cycle)
```

| # | Phase | TeamClip Pattern | Purpose | Key Output |
|---|-------|------------------|---------|------------|
| 1 | **Assess** | Finance Analyst creates milestone "Financial Assessment: {product}" via Paperclip API | Gather and validate financial data | Data inventory, source verification |
| 2 | **Model** | Finance Analyst creates modeling subtasks | Build/update financial models and scenarios | `.xlsx` workbooks attached to issues, Python analysis scripts |
| 3 | **Report** | Finance Analyst creates report subtasks | Generate formatted reports and summaries | `.xlsx` reports as issue attachments + Confluence pages |
| 4 | **Recommend** | Finance Analyst creates recommendation issues with cross-team handoffs | Pricing changes, cost cuts, investment priorities | Decision memos as issue documents |
| 5 | **Monitor** | Finance Analyst creates monitoring tasks on monthly cadence | Track actuals vs. forecast, alert on anomalies | Variance reports, monthly close artifacts |

---

## Phase 1: ASSESS

**Trigger:** New reporting period begins, new product launches, CEO requests financial data, or monthly cycle resets.

**TeamClip pattern:** Finance Analyst creates milestone "Financial Assessment: {product}" via `POST /api/companies/{id}/issues` with subtasks for each data source.

**What happens:**
1. Identify data sources for the target product:
   - Stripe MCP for revenue and subscription data
   - Cloud provider dashboards for infrastructure costs
   - Vendor invoices and subscription tracking
   - Marketing spend from marketing analytics
   - Payroll and contractor costs
2. Pull raw data and validate completeness:
   - Check for missing transactions or gaps in time series
   - Reconcile Stripe data against bank statements
   - Verify cost allocations are current
3. Categorize and tag all transactions:
   - Revenue: MRR, one-time, expansion, contraction
   - COGS: hosting, API costs, support tools
   - OpEx: marketing, payroll, SaaS subscriptions, contractors
   - CapEx: equipment, long-term licenses
4. Create or update the data inventory document

**Agent:** **Finance Analyst** (sole finance agent — absorbs old bookkeeper, cost-analyst, financial-analyst, pricing-strategist, and tax-accountant roles). At current scale, one agent handles all financial operations.

**Deliverable storage:**
- Data inventory: `PUT /api/issues/{assess-milestone-id}/documents/data-inventory`
- Categorized transaction ledger: `POST /api/issues/{id}/attachments` (Excel workbook)
- Data gap report: `PUT /api/issues/{assess-milestone-id}/documents/data-gaps`

**Exit criteria:**
- [ ] All revenue sources identified and data pulled
- [ ] All cost categories populated with current data
- [ ] Data gaps documented with resolution plan
- [ ] Transaction categorization complete
- [ ] Reconciliation between sources passes (no unexplained discrepancies)

---

## Phase 2: MODEL

**Trigger:** ASSESS phase complete with clean data. Also triggered directly for pricing-specific modeling.

**TeamClip pattern:** Finance Analyst creates modeling subtasks under the finance milestone. For pricing work, Chief of Staff may auto-create cross-team issues linking to Product Manager and Legal Counsel.

**What happens:**
1. Build or update financial models in Python + openpyxl:
   - Revenue forecast (conservative / moderate / aggressive scenarios)
   - Unit economics model (CAC, LTV, margins, payback period)
   - Cash flow projection (12-month forward)
   - Cost model (fixed vs. variable, per-user marginal cost)
2. For pricing work:
   - Pull competitor pricing via Firecrawl
   - Calculate cost floor per user/tier
   - Model revenue impact of pricing changes across scenarios
   - Design tier structure with feature gates
3. Run scenario analysis:
   - Best case / base case / worst case
   - Sensitivity analysis on key assumptions (churn, growth rate, ARPU)
   - Break-even analysis
4. Generate `.xlsx` workbooks with multiple sheets:
   - Summary dashboard
   - Detailed model with formulas
   - Assumptions sheet (all inputs clearly labeled)
   - Scenario comparison

**Agent:** **Finance Analyst**

**Deliverable storage:**
- Financial model workbook: `POST /api/issues/{model-task-id}/attachments` (`.xlsx` file)
- Model assumptions: `PUT /api/issues/{model-task-id}/documents/assumptions`
- Pricing model (if applicable): `POST /api/issues/{id}/attachments` (`.xlsx` file)
- Scenario analysis summary: `PUT /api/issues/{model-task-id}/documents/scenario-analysis`

**Exit criteria:**
- [ ] Model covers all revenue streams and cost categories
- [ ] At least 3 scenarios modeled (conservative, moderate, aggressive)
- [ ] Assumptions document lists every input
- [ ] Formulas validated (spot-check key outputs manually)
- [ ] Model stored as issue attachment with date in filename

---

## Phase 3: REPORT

**Trigger:** MODEL phase complete, or standalone report request.

**TeamClip pattern:** Finance Analyst creates report subtasks. Reports are stored as issue attachments (Excel) and issue documents (markdown summaries).

**What happens:**
1. Generate formatted Excel reports using Python + openpyxl:
   - P&L statement (revenue, COGS, gross margin, OpEx, net income)
   - Unit economics dashboard (CAC, LTV, LTV:CAC ratio, payback)
   - Cash flow statement (operating, investing, financing activities)
   - Cost report (by category, by vendor, month-over-month trends)
   - KPI summary (MRR, ARR, churn, growth rate, runway)
2. Apply professional formatting:
   - Currency formatting, percentage formatting
   - Conditional formatting (red for negative, green for positive trends)
   - Charts: revenue trends, cost breakdowns, runway visualization
   - Header styling, frozen panes, print areas
3. Create markdown summaries for quick reference:
   - Key numbers at a glance
   - Trend analysis (up/down vs. prior period)
   - Anomalies or concerns flagged
4. Publish to Confluence (if Atlassian MCP available):
   - Summary page with key metrics
   - Link to Excel file for detail
   - Historical comparison section

**Agent:** **Finance Analyst**

**Deliverable storage:**
- Excel reports: `POST /api/issues/{report-task-id}/attachments` (`.xlsx` files)
- Markdown summaries: `PUT /api/issues/{report-task-id}/documents/summary`
- KPI snapshot: `PUT /api/issues/{report-task-id}/documents/kpi-snapshot`

**Exit criteria:**
- [ ] All requested report types generated
- [ ] Excel files have Summary + Detail + Assumptions sheets minimum
- [ ] Formatting applied (currency, conditional, charts)
- [ ] Files attached to issue with date in filename
- [ ] Markdown summary captures key numbers and trends
- [ ] Confluence page published (if MCP available)

---

## Phase 4: RECOMMEND

**Trigger:** REPORT phase complete, or standalone pricing/strategy request.

**TeamClip pattern:** Finance Analyst creates recommendation issues. Chief of Staff auto-creates cross-team handoff issues for affected teams (e.g., pricing change triggers issues for CMO, CTO, Legal Counsel).

**What happens:**
1. Analyze reports and models to identify actionable recommendations:
   - Pricing changes (raise/lower/restructure tiers)
   - Cost optimization opportunities (vendor consolidation, right-sizing)
   - Investment priorities (where to allocate next dollar)
   - Tax strategies (entity structure, deduction opportunities)
   - Cash management (runway extension, fundraising timing)
2. Quantify impact of each recommendation:
   - Revenue impact (monthly and annual)
   - Cost savings (monthly and annual)
   - Margin improvement (percentage points)
   - Payback period for investments
3. Write decision memos:
   - Problem statement
   - Options considered (minimum 2)
   - Recommended option with quantified rationale
   - Implementation requirements (cross-team handoffs)
   - Risk assessment
4. Chief of Staff auto-creates cross-team handoff issues:
   - Pricing changes --> CMO (page updates), CTO (billing), Legal Counsel (ToS)
   - Cost cuts --> DevOps Engineer (infrastructure), CTO (vendor changes)
   - Investment recommendations --> Product Manager (roadmap impact)

**Agent:** **Finance Analyst**

**Deliverable storage:**
- Decision memos: `PUT /api/issues/{recommend-task-id}/documents/decision-memo`
- Pricing recommendation: `PUT /api/issues/{id}/documents/pricing-recommendation`
- Cost optimization report: `PUT /api/issues/{id}/documents/cost-optimization`
- Supporting workbooks: `POST /api/issues/{id}/attachments`

**Exit criteria:**
- [ ] Every recommendation is quantified (dollar impact, not just "should do X")
- [ ] At least 2 options considered per recommendation
- [ ] Implementation requirements identified (who needs to do what)
- [ ] Cross-team handoff issues created by Chief of Staff for downstream work
- [ ] Decision memos stored as issue documents

---

## Phase 5: MONITOR

**Trigger:** Reports and recommendations delivered. Runs continuously on a monthly cycle.

**TeamClip pattern:** Finance Analyst creates monthly monitoring tasks. Eric (CEO) manually triggers the Finance Analyst via on-demand wake for weekly/monthly financial tasks.

**What happens:**
1. Track actuals vs. forecast:
   - Pull current month's actual revenue (Stripe)
   - Pull current month's actual costs (vendors, cloud, payroll)
   - Compare to model projections
   - Calculate variance (absolute and percentage)
2. Alert on anomalies:
   - Revenue miss > 10% of forecast
   - Cost overrun > 15% of budget
   - Churn spike > 2x baseline
   - Runway drops below 6 months
   - Any single vendor cost increase > 25% month-over-month
3. Monthly close procedures:
   - Reconcile all accounts
   - Finalize period numbers
   - Update rolling forecast with actuals
   - Generate month-end report package
4. Update models with actual data:
   - Replace forecast with actuals for completed months
   - Recalibrate projections based on trends
   - Adjust assumptions where actuals diverge from model

**Escalation:** For anomaly alerts, Finance Analyst updates the monitoring issue and the Chief of Staff detects this in its heartbeat. Chief of Staff escalates to Eric via Discord if thresholds are exceeded.

**Agent:** **Finance Analyst**

**Deliverable storage:**
- Variance report: `PUT /api/issues/{monitor-task-id}/documents/variance-report`
- Monthly close package: `POST /api/issues/{id}/attachments` (`.xlsx` bundle)
- Updated financial model: `POST /api/issues/{id}/attachments` (`.xlsx`)
- Alert notifications: stored as issue comments with severity tags

**Exit criteria:**
- [ ] All accounts reconciled
- [ ] Variance report generated with explanations for major deviations
- [ ] Financial model updated with actual data
- [ ] Rolling forecast recalibrated
- [ ] Monthly close package attached to issue
- [ ] Anomalies flagged and escalated if thresholds exceeded

---

## Excel Generation Process (Python + openpyxl)

This is a core competency. All financial reports are generated as formatted Excel workbooks and stored as issue attachments.

### Standard workbook structure
Every report workbook follows this structure:

| Sheet | Purpose | Required |
|-------|---------|----------|
| **Summary** | Key metrics at a glance, charts, executive view | Always |
| **Detail** | Full line-item data, formulas, month-by-month | Always |
| **Assumptions** | All inputs, rates, growth assumptions | Always |
| **Scenarios** | Conservative / moderate / aggressive | For models |
| **Comparison** | Competitor data, benchmark data | For pricing |

### Formatting standards
```python
# Standard formatting applied to all Finance workbooks:

# Headers: Bold, dark blue background (#1F4E79), white text, frozen row
# Currency: $#,##0.00 or $#,##0 (no decimals for large numbers)
# Percentages: 0.0% format
# Negative numbers: Red font, parentheses
# Conditional formatting:
#   - Green: positive trends, targets met
#   - Yellow: within 10% of threshold
#   - Red: negative trends, targets missed
# Column widths: auto-fit with minimum 12 characters
# Charts: bar charts for comparisons, line charts for trends
# Print area: set for Summary sheet
# Frozen panes: top row + left column on Detail sheet
```

### File naming convention
```
<report-type>-YYYY-MM-DD.xlsx
```
Stored as issue attachments: `POST /api/issues/{id}/attachments`

### Generation workflow
```
1. Gather data (Stripe, cloud APIs, manual inputs)
2. Process in Python (pandas for aggregation, calculations)
3. Build workbook with openpyxl:
   a. Create sheets in standard order
   b. Write data with formulas (not just static values)
   c. Apply formatting (headers, currency, conditional)
   d. Add charts (revenue trends, cost breakdowns)
   e. Set print areas and frozen panes
4. Attach to issue: POST /api/issues/{id}/attachments
5. Generate markdown summary as issue document: PUT /api/issues/{id}/documents/summary
6. Publish summary to Confluence (if available)
```

---

## Revenue Data Pipeline

```
Stripe MCP --> raw transaction data
  --> Python processing (categorize, aggregate, calculate metrics)
    --> Excel reports (.xlsx) -- attached to issues
    --> Confluence summaries -- published via Atlassian MCP
    --> KPI dashboard updates -- stored as issue documents
```

### Pipeline steps

1. **Extract:** Pull subscription and payment data from Stripe
   - Active subscriptions, new subscriptions, cancellations
   - One-time payments, refunds, disputes
   - Revenue by plan/tier
2. **Transform:** Python processing
   - Calculate MRR from active subscriptions
   - Aggregate by cohort, plan, time period
   - Calculate derived metrics (churn, expansion, contraction)
   - Join with cost data for margin calculations
3. **Load:** Output to reports
   - Generate Excel workbooks, attach to issues
   - Create Confluence summary pages
   - Update rolling financial model with new actuals

### Data freshness requirements
| Data Source | Update Frequency | Owner |
|-------------|-----------------|-------|
| Stripe revenue | Monthly (minimum), weekly preferred | Finance Analyst |
| Cloud costs | Monthly | Finance Analyst |
| Vendor subscriptions | Monthly | Finance Analyst |
| Marketing spend | Monthly (from CMO team) | Finance Analyst |
| Payroll | Monthly | Finance Analyst |

---

## Key Metrics Tracked

| Metric | Definition | Target Range | Alert Threshold |
|--------|-----------|-------------|-----------------|
| **MRR** | Monthly recurring revenue from active subscriptions | Growing month-over-month | Decline > 5% |
| **ARR** | MRR x 12 (annualized) | Growing year-over-year | Decline > 5% |
| **Churn rate** | Customers lost / customers at start of period | < 5% monthly | > 8% monthly |
| **CAC** | Total acquisition cost / new customers acquired | Declining over time | > 1/3 of LTV |
| **LTV** | Average revenue per customer x average lifespan | > 3x CAC | < 3x CAC |
| **LTV:CAC ratio** | Lifetime value / customer acquisition cost | > 3:1 | < 3:1 |
| **Gross margin** | (Revenue - COGS) / Revenue | > 70% for SaaS | < 60% |
| **Burn rate** | Monthly net cash outflow | Stable or declining | Increasing > 20% MoM |
| **Runway** | Cash balance / monthly burn rate | > 12 months | < 6 months |
| **Payback period** | CAC / monthly revenue per customer | < 12 months | > 18 months |
| **Net revenue retention** | Revenue from existing customers vs. prior period | > 100% | < 90% |
| **ARPU** | Total revenue / total active users | Stable or growing | Decline > 10% |

---

## Cross-Team Interfaces

| Team | Finance Sends | Finance Receives |
|------|--------------|-----------------|
| **Product** | Unit economics, pricing recommendations, budget constraints | Feature cost implications, revenue projections per feature |
| **Engineering** | Budget for infrastructure, vendor approvals, build vs. buy analysis | Infrastructure cost data, LOE estimates |
| **DevOps** | Cloud budget targets, cost optimization priorities | Cloud spend reports, cost breakdowns by service |
| **Marketing** | Campaign budgets, CAC targets, ROAS thresholds | Campaign spend reports, channel ROI data |
| **Legal** | Financial compliance data, tax filings, entity structure | Regulatory requirements, tax deadlines, compliance costs |
| **CS** | Support cost per user, customer lifetime value data | Churn data, expansion revenue signals |
| **Design** | Budget for design tools and assets | (minimal direct interface) |

### Handoff triggers (Chief of Staff auto-creates issues)
| Event | From Finance To | What Gets Passed |
|-------|----------------|-----------------|
| Pricing recommendation finalized | CMO, CTO, Legal Counsel | Tier design, amounts, implementation specs (as issue documents) |
| Budget approved | Requesting team | Budget amount, constraints, tracking requirements |
| Cost optimization identified | DevOps Engineer, CTO | Specific cuts, expected savings, timeline |
| Tax filing due | Legal Counsel | Filing data, compliance requirements |
| Runway alert | Eric (CEO) via Discord | Burn rate, runway months, recommended actions |

---

## Anti-Patterns

- **Reports without recommendations.** A P&L that says "revenue is $X" is useless. Every report should answer "so what?" and "what should we do?"
- **Models without assumptions documents.** If someone can't see what inputs drive the model, the model is a black box. Always include assumptions as an issue document.
- **Static numbers in Excel.** Use formulas and cell references, not hardcoded values. The model should update when inputs change.
- **Undated reports.** A financial report without a date is dangerous. Date everything: filename and content.
- **Pricing by gut feel.** Every pricing decision should reference: competitor data, cost floor, willingness-to-pay signals, and revenue projections.
- **Monthly close delays.** Close the books within 5 business days of month end. Stale financials lead to stale decisions.
- **Ignoring variance.** When actuals diverge from forecast, explain why. Unexplained variance means the model is broken or something changed.
- **Single-scenario planning.** Always model at least conservative, moderate, and aggressive. One number is a guess; three numbers is a range.
- **Overwriting reports.** Never overwrite a previous report. Date and version. The historical record matters. Store each version as a separate issue attachment.
- **Disconnected from Stripe.** If revenue data isn't coming from the actual payment processor, you're guessing. Connect to the source.
- **Standalone files instead of issue attachments.** Financial deliverables belong on issues. Use attachments for workbooks and keyed documents for summaries.
