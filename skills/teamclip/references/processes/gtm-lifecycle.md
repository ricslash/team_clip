# GTM Marketing Lifecycle (TeamClip)

_Last updated: 2026-03-25_

Go-to-market lifecycle for any product launch. Every phase updates the marketing issue tree via Paperclip.

**Cardinal rule:** The marketing issue tree is the heartbeat. If it isn't current, stop and fix it.

---

## GTM Model System

Every product declares its GTM model in the project description or a keyed document (`PUT /api/issues/{id}/documents/gtm-model`). This determines which phases, agents, and templates apply.

| Model | Key Tactics | Example |
|-------|-------------|---------|
| **B2B Enterprise** | Battlecards, sales sequences, case studies, LinkedIn, webinars | SaaS for teams |
| **B2C / Consumer** | Ad creative, social campaigns, influencer, viral loops | Consumer app |
| **PLG / Community** | Reddit, ProductHunt, HackerNews, campaign automation, free tier | TaskKnife, dev tools |
| **Indie / Solo** | Personal brand, Twitter/X, build-in-public, micro-communities, SEO | Side projects |

Templates are tagged `[B2B]`, `[PLG]`, `[B2C]`, `[Indie]`, `[ALL]`. Agents surface only relevant ones.

---

## Lifecycle

```
RESEARCH --> STRATEGY --> LAUNCH PLAN --> CREATE --> MEASURE --> OPTIMIZE
                                           ^          |
                                           +----------+ (iterate)
```

| # | Phase | TeamClip Pattern | Key Output |
|---|-------|------------------|------------|
| 1 | **Research** | CMO creates milestone, assigns Market Researcher | Competitive analysis, audience research, market sizing |
| 2 | **Strategy** | CMO creates milestone with positioning, pricing, channel subtasks | Messaging hierarchy, positioning, pricing, channel plan |
| 3 | **Launch Plan** | CMO creates milestone with cross-team subtasks | Timeline, issue tree, content calendar |
| 4 | **Create** | Content & Growth Lead executes from issue tree; Design Lead brand gate | Landing pages, emails, ads, automations, sales collateral |
| 5 | **Measure** | Finance Analyst + CMO create KPI tracking issues | KPI dashboard, attribution model |
| 6 | **Optimize** | CMO creates optimization milestone with experiment subtasks | Retrospective, experiments, next-cycle plan |

Additional patterns:
- **GTM status** — Query `GET /api/companies/{id}/issues?projectId=...` to auto-detect current state
- **GTM sync** — One-way read from engineering project issues, flag misalignments
- **New product GTM** — Create GTM project linked to product goal via `goalIds`

---

## Phase Details

### 1. RESEARCH

CMO creates milestone "GTM Research: {product}" via `POST /api/companies/{id}/issues`. Market Researcher gets subtasks.

**Deliverables (all models):** Competitive landscape, audience research, market sizing (TAM/SAM/SOM).

**Model-specific:**
- `[B2B]` Buyer journey, ICP definition, stakeholder analysis
- `[PLG]` Community mapping, viral coefficient analysis
- `[B2C]` Trend analysis, emotional triggers, influencer landscape
- `[Indie]` Niche communities, SEO keywords, build-in-public audience

**Agents:** Market Researcher (primary), Content & Growth Lead (channel research)

**Storage:**
- `PUT /api/issues/{id}/documents/competitive-analysis`
- `PUT /api/issues/{id}/documents/audience-research`
- `PUT /api/issues/{id}/documents/market-sizing`

**Exit criteria:** 3+ competitors analyzed, audience pain points with evidence, market sizing with methodology, CMO reviewed.

### 2. STRATEGY

CMO creates milestone "GTM Strategy: {product}". Content & Growth Lead gets channel subtask. Finance Analyst gets pricing subtask.

**Deliverables:** Messaging hierarchy, positioning statement, pricing strategy, channel prioritization.

**Model-specific:**
- `[B2B]` Sales process, lead scoring, enterprise objection handling
- `[PLG]` Free tier boundaries, viral loop design, community engagement
- `[B2C]` Brand campaign themes, emotional positioning, influencer framework
- `[Indie]` Personal brand strategy, build-in-public plan, micro-community seeding

**Agents:** CMO (primary), Finance Analyst (pricing), Content & Growth Lead (channels)

**Storage:** `PUT /api/issues/{id}/documents/{messaging|positioning|pricing|channel-plan}`

**Cross-team handoffs:** Finance Analyst (pricing modeling), Legal Counsel (pricing terms), Product Manager (positioning alignment).

### 3. LAUNCH PLAN

CMO creates milestone "Launch: {product}" with cross-team subtasks. Chief of Staff auto-creates all cross-team issues.

**Deliverables:** Launch timeline (as issue tree with blocking relationships), content calendar (4+ weeks).

**Model-specific:**
- `[B2B]` Sales enablement timeline, demo script, enterprise pilot plan
- `[PLG]` ProductHunt plan, HN strategy, Reddit rollout, beta/waitlist
- `[B2C]` Campaign media plan, ad budget, influencer outreach timeline
- `[Indie]` Build-in-public schedule, Twitter/X calendar, community launch

**Agents:** CMO (ownership), Content & Growth Lead (content calendar), Design Lead (asset timeline)

### 4. CREATE

Content & Growth Lead executes tasks from launch issue tree. Chief of Staff auto-creates blocking gate issues for brand review (Design Lead) and compliance review (Legal Counsel).

**Execution loop:**
```
FOR each task issue in launch milestone (priority order):
  1. Content & Growth Lead produces deliverable
  2. Store as: PUT /api/issues/{id}/documents/draft
  3. Gate issues auto-created: brand (Design Lead), legal (Legal Counsel), UX (UX Director)
  4. IF rejected --> revise with specific feedback
  5. IF approved --> PATCH /api/issues/{id} status "done"
```

**Agents:** Content & Growth Lead (creation), Design Lead (brand gate), Legal Counsel (compliance), UX Director (UX gate)

### 5. MEASURE

CMO creates measurement issues. Finance Analyst gets KPI dashboard task.

**KPI focus by model:**
- `[B2B]` Pipeline value, SQL close rate, ACV, sales cycle length
- `[PLG]` Signup activation rate, organic referral %, free-to-paid conversion
- `[B2C]` CAC, LTV, ROAS, brand recall
- `[Indie]` MRR, traffic, email list growth, community size

**Storage:** `PUT /api/issues/{id}/documents/{kpi-dashboard|attribution}`

### 6. OPTIMIZE

CMO creates "Optimization: {product}" milestone with experiment subtasks.

**Deliverables:** Post-launch retrospective, optimization experiments, next-cycle plan, updated competitive analysis.

**Agents:** Content & Growth Lead (experiments), Market Researcher (updated landscape), Finance Analyst (ROI, budget reallocation)

---

## Agent Team

| Agent | Role | When Active |
|-------|------|-------------|
| **CMO** | GTM strategy, positioning, direction. Delegates to specialists. | All phases (strategy layer) |
| **Market Researcher** | Deep web research via Firecrawl: Reddit, Google, reviews, competitors. | RESEARCH, OPTIMIZE |
| **Content & Growth Lead** | Content creation, SEO, social, campaigns, community, growth. Adapts by GTM model. | LAUNCH PLAN, CREATE, MEASURE, OPTIMIZE |
| **Finance Analyst** | Pricing models, KPIs, financial metrics, attribution. | STRATEGY (pricing), MEASURE, OPTIMIZE |
| **Design Lead** | Brand review quality gate. Does NOT create marketing content. | CREATE (mandatory gate) |
| **Legal Counsel** | Compliance review for public-facing content. | CREATE (gate for public-facing) |
| **UX Director** | UX review for user-facing marketing assets. | CREATE (gate for user-facing) |

---

## Quality Gates (Blocking Issues)

Auto-created by Chief of Staff during CREATE phase:

| Gate | Trigger | Assigned To | Blocks |
|------|---------|-------------|--------|
| **Brand Review** | Issue tagged `public-facing` reaches "done" | Design Lead | "shipped" status |
| **Legal Review** | Issue tagged `public-facing` or with claims/disclaimers | Legal Counsel | "shipped" status |
| **UX Review** | Issue tagged `user-facing` | UX Director | "shipped" status |
| **Pricing Gate** | Issue tagged `pricing` | Finance Analyst + PM + Legal | Pricing publication |

---

## Cross-Team Interfaces

| Team | Marketing Sends | Marketing Receives |
|------|----------------|-------------------|
| **Engineering** | Launch readiness requirements | Feature completion notifications, technical details |
| **Product** | Market research, competitive intel | Roadmap updates, PRDs for positioning |
| **Design** | Content for brand review (gate issues) | Brand review feedback, approved assets |
| **Finance** | Campaign budgets, CAC targets | Pricing models, budget constraints |
| **Legal** | Public-facing copy for review (gate issues) | Ad policy constraints, disclaimers |
| **CS** | Launch comms, update announcements | User language, testimonial candidates |
| **DevOps** | Launch window infra needs | Uptime guarantees, infra readiness |

All handoffs automated via Chief of Staff heartbeat creating issues with context in documents.

---

## Key Principles

1. GTM model drives everything
2. Marketing-native phases: RESEARCH through OPTIMIZE
3. Design Lead brand gate is mandatory — no content ships without it
4. Campaign automation is first-class
5. One-way engineering sync — marketing reads, never writes
6. Issue tree is the heartbeat — always current
7. Deliverables live on issues — keyed documents and attachments

---

## Anti-Patterns

- **Research without Market Researcher** — CMO strategizes from research, not assumptions
- **Skipping the brand gate** — "We're in a hurry" is not an exemption
- **Standalone deliverable files** — All deliverables belong as issue documents or attachments
- **Marketing without GTM model** — Stop and define one first
- **One-size-fits-all tactics** — Match tactics to model
- **Manual cross-team handoffs** — Let Chief of Staff handle them
