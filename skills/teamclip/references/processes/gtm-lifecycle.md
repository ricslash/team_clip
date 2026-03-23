# GTM Marketing Lifecycle — Full Reference (TeamClip)

_Last updated: 2026-03-20_
_Adapted from: Team workflow/gtm-process.md_

This is the complete go-to-market marketing lifecycle. It applies to any product launch. Every phase produces deliverables, updates the marketing issue tree, and has defined outputs before moving forward.

**The cardinal rule:** The marketing issue tree is the heartbeat. Every phase reads it, updates it, and tracks status via Paperclip. If the issue tree isn't current, stop and fix it before doing anything else.

---

## GTM Model System

Every product's project in Paperclip declares its GTM model in the project description or a keyed document (`PUT /api/issues/{id}/documents/gtm-model`). This is the single most important config — it determines which phases emphasize what, which agents activate, and which templates are relevant.

| Model | Description | Key Tactics | Example |
|-------|-------------|-------------|---------|
| **B2B Enterprise** | Sales-led, longer cycles, fewer larger deals | Battlecards, sales sequences, case studies, LinkedIn, webinars | SaaS for teams |
| **B2C / Consumer** | Brand-led, high volume, emotional triggers | Ad creative, social campaigns, influencer, viral loops | Consumer app |
| **PLG / Community** | Product-led growth, community-first, grassroots | Reddit engagement, ProductHunt, HackerNews, campaign automation, free tier, word-of-mouth | TaskKnife, dev tools |
| **Indie / Solo** | Bootstrapped, founder-led, scrappy | Personal brand, Twitter/X threads, build-in-public, micro-communities, SEO | Side projects |

Templates are tagged `[B2B]`, `[PLG]`, `[B2C]`, `[Indie]`, `[ALL]`. Agents read the GTM model and only surface relevant templates.

---

## The Full Lifecycle

```
RESEARCH --> STRATEGY --> LAUNCH PLAN --> CREATE --> MEASURE --> OPTIMIZE
                                           ^          |
                                           +----------+ (iterate)
```

| # | Phase | TeamClip Pattern | Purpose | Key Output |
|---|-------|------------------|---------|------------|
| 1 | **Research** | CMO creates milestone "GTM Research: {product}" via Paperclip API, assigns subtasks to Market Researcher | Market, audience, competitive landscape | Competitive analysis, audience research, market sizing |
| 2 | **Strategy** | CMO creates milestone "GTM Strategy: {product}" with subtasks for positioning, pricing, channels | Positioning, messaging, pricing, channels | Messaging hierarchy, positioning, pricing, channel plan |
| 3 | **Launch Plan** | CMO creates milestone "Launch: {product}" with cross-team subtasks (Content & Growth Lead, Design Lead, CS Lead, Legal Counsel) | Sequenced execution plan | Timeline, issue tree, content calendar |
| 4 | **Create** | Content & Growth Lead executes tasks from issue tree. Design Lead reviews via brand gate issues. | Produce marketing assets | Landing pages, emails, ads, automations, sales collateral |
| 5 | **Measure** | Finance Analyst + CMO create KPI tracking issues | KPIs, attribution, analysis | KPI dashboard, attribution model |
| 6 | **Optimize** | CMO creates "Optimization: {product}" milestone with experiment subtasks | Post-launch iteration | Retrospective, experiments, next-cycle plan |

Additional patterns:
- **GTM status** — Query `GET /api/companies/{id}/issues?projectId=...` to auto-detect current GTM state, recommend next action
- **GTM sync** — One-way read from engineering project issues, flag misalignments between product state and marketing state
- **New product GTM** — Create a new GTM project in Paperclip linked to the product goal via `goalIds`

---

## Phase 1: RESEARCH

**TeamClip pattern:** CMO creates milestone "GTM Research: {product}" via `POST /api/companies/{id}/issues`. Market Researcher gets assigned subtasks for competitive analysis, audience research, and market sizing.

**What:** Understand the market, audience, and competitive landscape before making any strategic decisions.

**Deliverables (all models):**
- Competitive landscape analysis (features, pricing, positioning, weaknesses)
- Audience research (where they are, what they say, pain points, language)
- Market sizing (TAM/SAM/SOM where relevant)

**Deliverables (model-specific):**
- `[B2B]` Buyer journey mapping, ICP definition, stakeholder analysis
- `[PLG]` Community mapping (subreddits, Discord servers, forums), viral coefficient analysis
- `[B2C]` Trend analysis, emotional trigger inventory, influencer landscape
- `[Indie]` Niche community identification, SEO keyword research, build-in-public audience analysis

**Agents:**
- **Market Researcher** (primary) — deep web research via Firecrawl skill: Reddit, Google, review sites, competitor products, user forums. Feeds findings to CMO and Product Manager.
- **Content & Growth Lead** (channel-specific research) — evaluates channel fit, existing content landscape, SEO opportunity

**Deliverable storage:**
- Competitive analysis: `PUT /api/issues/{research-milestone-id}/documents/competitive-analysis`
- Audience research: `PUT /api/issues/{research-milestone-id}/documents/audience-research`
- Market sizing: `PUT /api/issues/{research-milestone-id}/documents/market-sizing`
- Supporting data (screenshots, spreadsheets): `POST /api/issues/{id}/attachments`

**Cross-team handoffs triggered (Chief of Staff auto-creates):**
- Product Manager: receives issue with research findings for roadmap input
- Finance Analyst: receives market sizing data for revenue modeling

**Exit criteria:**
- [ ] 3+ competitors analyzed with specific findings
- [ ] Audience pain points documented with evidence (not assumptions)
- [ ] Market sizing complete with methodology documented
- [ ] All deliverables stored as issue documents on the research milestone
- [ ] CMO has reviewed and approved the research

---

## Phase 2: STRATEGY

**TeamClip pattern:** CMO creates milestone "GTM Strategy: {product}" with subtasks for each strategic decision. Content & Growth Lead gets channel strategy subtask. Finance Analyst gets pricing subtask.

**What:** Make the strategic decisions — positioning, messaging, pricing, channel selection, and GTM model validation.

**Deliverables (all models):**
- Messaging hierarchy (core message --> supporting pillars --> proof points)
- Positioning statement
- Pricing strategy
- Channel prioritization (ranked by fit, cost, and expected ROI)

**Deliverables (model-specific):**
- `[B2B]` Sales process design, lead scoring criteria, enterprise objection handling
- `[PLG]` Free tier boundary definition, viral loop design, community engagement strategy
- `[B2C]` Brand campaign themes, emotional positioning, influencer partnership framework
- `[Indie]` Personal brand strategy, build-in-public content plan, micro-community seeding plan

**Agents:**
- **CMO** (primary) — positioning, messaging, overall strategy direction
- **Finance Analyst** — pricing models, revenue projections, tier economics
- **Content & Growth Lead** — channel strategy, content planning

**Deliverable storage:**
- Messaging hierarchy: `PUT /api/issues/{strategy-milestone-id}/documents/messaging`
- Positioning: `PUT /api/issues/{strategy-milestone-id}/documents/positioning`
- Pricing strategy: `PUT /api/issues/{strategy-milestone-id}/documents/pricing`
- Channel plan: `PUT /api/issues/{strategy-milestone-id}/documents/channel-plan`

**Cross-team handoffs triggered:**
- Finance Analyst: pricing strategy for financial modeling (Chief of Staff auto-creates issue)
- Legal Counsel: pricing terms review (Chief of Staff auto-creates blocking issue)
- Product Manager: positioning inputs for roadmap alignment

---

## Phase 3: LAUNCH PLAN

**TeamClip pattern:** CMO creates milestone "Launch: {product}" with cross-team subtasks. Content & Growth Lead gets content calendar task. Design Lead gets asset creation tasks. CS Lead gets documentation tasks. Legal Counsel gets compliance review tasks. Chief of Staff auto-creates all cross-team issues.

**What:** Build the sequenced execution plan — what happens, when, on which channels, in what order.

**Deliverables (all models):**
- Launch timeline with milestones and dependencies (as issue tree with parent/child and blocking relationships)
- Marketing issue tree (all tasks decomposed and prioritized)
- Content calendar (4+ weeks)

**Deliverables (model-specific):**
- `[B2B]` Sales enablement timeline, demo script, enterprise pilot plan
- `[PLG]` ProductHunt launch plan, HackerNews submission strategy, Reddit rollout sequence, beta/waitlist strategy
- `[B2C]` Campaign media plan, ad budget allocation, influencer outreach timeline
- `[Indie]` Build-in-public content schedule, Twitter/X thread calendar, community launch sequence

**Agents:**
- **CMO** (plan ownership, strategic direction)
- **Content & Growth Lead** (content calendar, channel-specific tactics)
- **Design Lead** (asset timeline, brand review scheduling)

**Deliverable storage:**
- Launch timeline: `PUT /api/issues/{launch-milestone-id}/documents/timeline`
- Content calendar: `PUT /api/issues/{launch-milestone-id}/documents/content-calendar`
- Channel-specific plans: stored as documents on their respective subtask issues

---

## Phase 4: CREATE

**TeamClip pattern:** Content & Growth Lead executes tasks from the launch milestone issue tree. Design Lead gets brand review gate issues (blocking issues auto-created by Chief of Staff for all `public-facing` tagged work). Legal Counsel gets compliance review gate issues.

**What:** Produce the actual marketing assets — copy, pages, emails, automations, ads, sequences.

**Asset types by GTM model:**

**All models:** Landing page copy, email onboarding sequence

**PLG / Community:** ProductHunt launch page, Show HN post, Reddit engagement posts, campaign automation flows, changelog, README optimization

**B2B Enterprise:** Sales battlecards, one-pagers, case study templates, email sequences, webinar scripts, LinkedIn content

**B2C / Consumer:** Ad creative briefs, social content batches, influencer kits, referral program copy, app store listing

**Indie / Solo:** Twitter/X threads, build-in-public updates, newsletter drafts, personal brand content, SEO blog posts

**Execution loop:**
```
FOR each task issue in launch milestone (priority order):
  1. Content & Growth Lead produces deliverable
  2. Store deliverable as issue document: PUT /api/issues/{id}/documents/draft
  3. Chief of Staff auto-creates blocking gate issues:
     - "Brand review: {asset}" assigned to Design Lead
     - "Legal review: {asset}" assigned to Legal Counsel (if public-facing)
     - "UX review: {asset}" assigned to UX Director (if user-facing)
  4. IF rejected --> Content & Growth Lead revises with specific feedback
  5. IF approved --> Update issue status to "done" via PATCH /api/issues/{id}
```

**Agents:**
- **Content & Growth Lead** (content creation, SEO, social, campaigns, community, growth tactics — absorbs old content-strategist, seo-specialist, social-media-manager, email-marketer, growth-hacker, community-manager roles)
- **Design Lead** (brand review quality gate — mandatory. Checks brand guidelines, messaging alignment, visual consistency)
- **Legal Counsel** (compliance review for public-facing content)
- **UX Director** (UX review for user-facing marketing assets — landing pages, onboarding flows)

**Deliverable storage pattern:**
- Draft content: `PUT /api/issues/{task-id}/documents/draft`
- Final approved content: `PUT /api/issues/{task-id}/documents/final`
- Binary assets (images, videos): `POST /api/issues/{task-id}/attachments`

---

## Phase 5: MEASURE

**TeamClip pattern:** CMO creates measurement issues under the launch milestone. Finance Analyst gets KPI dashboard task. Content & Growth Lead gets funnel analysis task.

**What:** Define what success looks like, set up tracking, analyze results.

**Deliverables (all models):**
- KPI dashboard (targets + actuals)
- Attribution model (how do we know what's working)

**Model-specific KPI focus:**
- `[B2B]` Pipeline value, SQL-->close rate, ACV, sales cycle length
- `[PLG]` Signup-->activation rate, organic referral %, community engagement, free-->paid conversion
- `[B2C]` CAC, LTV, ROAS, brand recall
- `[Indie]` MRR, traffic, email list growth, community size

**Agents:**
- **Finance Analyst** — KPIs, attribution, financial metrics (absorbs old revenue-analyst role)
- **Content & Growth Lead** — experiments, funnel analysis, channel performance

**Deliverable storage:**
- KPI dashboard: `PUT /api/issues/{id}/documents/kpi-dashboard`
- Attribution model: `PUT /api/issues/{id}/documents/attribution`
- Metric reports: `POST /api/issues/{id}/attachments` (Excel workbooks)

---

## Phase 6: OPTIMIZE

**TeamClip pattern:** CMO creates "Optimization: {product}" milestone with experiment subtasks. Content & Growth Lead gets A/B test and channel optimization tasks. Market Researcher gets updated competitive analysis task.

**What:** Post-launch iteration — double down on what works, kill what doesn't, plan the next cycle.

**Deliverables:**
- Post-launch retrospective (what worked, what didn't, learnings)
- Optimization experiments (A/B tests, new channels, messaging pivots)
- Next-cycle content calendar and campaign plan
- Updated competitive analysis (market has moved since launch)

**Agents:**
- **Content & Growth Lead** (experiments, next cycle content, channel optimization)
- **Market Researcher** (updated competitive landscape, market shifts since launch)
- **Finance Analyst** (ROI analysis, budget reallocation recommendations)

**Deliverable storage:**
- Retrospective: `PUT /api/issues/{optimize-milestone-id}/documents/retrospective`
- Experiment results: `PUT /api/issues/{id}/documents/experiment-results` (per experiment subtask)
- Next-cycle plan: `PUT /api/issues/{optimize-milestone-id}/documents/next-cycle-plan`

---

## Agent Team

| Agent | Role | When Active |
|-------|------|-------------|
| **CMO** | GTM strategy, positioning, market assessment, direction. Delegates research to Market Researcher, content execution to Content & Growth Lead. (Absorbs old gtm-strategist, paid-media-buyer, analytics-lead, pr-specialist roles) | All phases (strategy layer) |
| **Market Researcher** | Deep web research: Reddit, Google, review sites, competitor analysis, real user feedback, gap identification. Goes to the real internet to assess markets. (Absorbs old market-researcher + new deep-research capability) | RESEARCH, OPTIMIZE |
| **Content & Growth Lead** | Content creation, SEO, social, campaigns, community, growth hacking, automation. Creates and distributes content. (Absorbs old content-strategist, seo-specialist, social-media-manager, email-marketer, growth-hacker, community-manager roles) | LAUNCH PLAN, CREATE, MEASURE, OPTIMIZE |
| **Finance Analyst** | Pricing models, KPIs, financial modeling, attribution, funnel metrics. (Absorbs old revenue-analyst role for GTM purposes) | STRATEGY (pricing), MEASURE, OPTIMIZE |
| **Design Lead** | Brand review quality gate — reviews all output against brand guidelines and messaging hierarchy. Does NOT create marketing content. (Absorbs old brand-reviewer role) | CREATE (mandatory gate) |
| **Legal Counsel** | Compliance review for public-facing content, ad policy, required disclaimers | CREATE (gate for public-facing) |
| **UX Director** | UX review for user-facing marketing assets (landing pages, onboarding flows) | CREATE (gate for user-facing) |

### Content & Growth Lead adapts by GTM model:
- **PLG:** Campaign automation, Reddit monitoring, ProductHunt copy, HN posts, viral loops, community workflows
- **B2B:** ABM campaigns, LinkedIn content, webinar funnels
- **B2C:** Ad briefs, referral programs, influencer outreach
- **Indie:** Build-in-public strategy, SEO content, micro-community seeding

---

## Quality Gates (Blocking Issues)

The Chief of Staff auto-creates these as blocking issues during the CREATE phase:

| Gate | Auto-Created When | Assigned To | Blocks |
|------|-------------------|-------------|--------|
| **Brand Review** | Any marketing issue tagged `public-facing` reaches "done" | Design Lead | Parent issue's "shipped" status |
| **Legal Review** | Any marketing issue tagged `public-facing` or with claims/disclaimers | Legal Counsel | Parent issue's "shipped" status |
| **UX Review** | Any marketing issue tagged `user-facing` (landing pages, onboarding) | UX Director | Parent issue's "shipped" status |
| **Pricing Gate** | Any issue tagged `pricing` | Finance Analyst + Product Manager + Legal Counsel | Pricing publication |

---

## Cross-Team Interfaces

| Team | Marketing Sends | Marketing Receives |
|------|----------------|-------------------|
| **Engineering** | Launch readiness requirements, feature marketing needs | Feature completion notifications (via Chief of Staff handoff issues), technical details for content |
| **Product** | Market research findings, user language for personas, competitive intel | Product roadmap updates, feature priorities, PRDs for positioning |
| **Design** | Content for brand review (via gate issues), asset requests | Brand review feedback, brand guidelines, approved assets |
| **Finance** | Campaign budgets, CAC targets, ROAS thresholds | Pricing models, unit economics, budget constraints |
| **Legal** | Public-facing copy for review (via gate issues), campaign concepts | Ad policy constraints, required disclaimers, compliance feedback |
| **CS** | Launch communications, update announcements | User language, testimonial candidates, community insights |
| **DevOps** | Launch window infrastructure needs | Uptime guarantees, infrastructure readiness confirmation |

All cross-team handoffs are automated via Chief of Staff heartbeat creating issues with full context in issue documents.

---

## Key Principles

1. **GTM model drives everything** — declared in the product's project description, adapts all phases
2. **Marketing-native phases** — RESEARCH --> STRATEGY --> LAUNCH PLAN --> CREATE --> MEASURE --> OPTIMIZE
3. **Design Lead brand gate is mandatory** — no content ships without brand guidelines check (blocking issue)
4. **Templates are tagged** `[B2B]`, `[PLG]`, `[B2C]`, `[Indie]`, `[ALL]` — only relevant ones surface
5. **Campaign automation is first-class** — Content & Growth Lead uses Paperclip skills for execution (Reddit posts, email drafts, social content)
6. **One-way engineering sync** — marketing reads from engineering project issues, never writes to them
7. **Issue tree is the heartbeat** — always current, statuses always up to date via `PATCH /api/issues/{id}`
8. **Deliverables live on issues** — use keyed documents and attachments, not standalone files

---

## Anti-Patterns

- **Research without Market Researcher** — The Market Researcher goes to the real internet. CMO strategizes from research, not from assumptions.
- **Skipping the brand gate** — Design Lead brand review is mandatory for public-facing content. "We're in a hurry" is not an exemption.
- **Standalone deliverable files** — All marketing deliverables belong as issue documents or attachments. Not orphaned files.
- **Marketing without GTM model** — If the product project doesn't declare a GTM model, stop and define one first.
- **One-size-fits-all tactics** — PLG tactics don't work for B2B. Indie tactics don't scale to B2C. Match tactics to model.
- **Ignoring the feedback loop** — CS Lead sends user language and testimonial candidates. If marketing ignores CS data, messaging will miss.
- **Manual cross-team handoffs** — Let the Chief of Staff create handoff issues automatically. Manual handoffs get lost.
