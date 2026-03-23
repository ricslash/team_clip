# Product Management Process — Full Lifecycle Reference (TeamClip)

_Last updated: 2026-03-20_
_Adapted from: Team workflow/product-process.md_

This is the complete product management lifecycle. It applies to any product. Every phase produces artifacts, updates the product issue tree, and has defined exit criteria before moving forward.

**The cardinal rule:** Every feature decision traces back to a validated user problem. If you can't point to real user evidence (feedback, analytics, research), stop and find it before committing resources.

---

## The Full Lifecycle

```
DISCOVER --> DEFINE --> PRIORITIZE --> SPECIFY --> VALIDATE
                                        |             ^
                                  Engineering         |
                              IDEATE --> BUILD --> SHIP+
```

| # | Phase | TeamClip Pattern | Purpose | Key Output |
|---|-------|------------------|---------|------------|
| 1 | **Discover** | Product Manager creates milestone "Discovery: {product}" via Paperclip API with research subtasks | Identify opportunities from users, data, and market | Opportunity brief |
| 2 | **Define** | Product Manager creates definition subtasks with success criteria | Frame the problem, set success criteria | Problem statement + success metrics |
| 3 | **Prioritize** | Product Manager scores and ranks via RICE, stored as issue documents | Score, rank, and sequence the roadmap | Prioritized roadmap |
| 4 | **Specify** | Product Manager creates PRD as issue document, Chief of Staff creates cross-team handoff issues | Write the PRD with user stories and acceptance criteria | PRD stored as issue document |
| 5 | **Validate** | Product Manager creates validation tasks post-launch | Post-launch analysis against success criteria | Validation report |

---

## Phase 1: DISCOVER

**Trigger:** New signal — user feedback from CS Lead, analytics anomaly, competitive move, market shift, or CEO directive.

**TeamClip pattern:** Product Manager creates milestone "Discovery: {product}" via `POST /api/companies/{id}/issues` with subtasks for each signal source. Market Researcher gets assigned competitive analysis and deep research subtasks.

**What happens:**
1. **Gather signals** from all available sources:
   - CS Lead feedback reports (issue documents on CS feedback milestones)
   - Product analytics (Firebase, usage dashboards)
   - Market Researcher competitive analysis (issue documents from GTM research milestones)
   - CMO marketing research (issue documents from marketing milestones)
   - Direct user research (interviews, surveys, session recordings)
   - Support ticket patterns and NPS data
2. **Synthesize into an opportunity brief:**
   - What is the problem or opportunity?
   - Who experiences it? (persona, segment, frequency)
   - How big is it? (reach, revenue impact, churn risk)
   - What evidence supports it? (cite specific data points)
   - What's the cost of inaction?
3. Store as issue document on the discovery milestone

**Agents:**
- **Product Manager** (primary — synthesizes signals into opportunity brief. Absorbs old product-manager, product-analyst, and competitive-analyst roles)
- **Market Researcher** — deep web research for competitive intel, market sizing, user forum analysis. Feeds findings to Product Manager.

**Deliverable storage:**
- Opportunity brief: `PUT /api/issues/{discovery-milestone-id}/documents/opportunity-brief`
- Supporting research data: `POST /api/issues/{id}/attachments` (spreadsheets, screenshots)
- Competitive analysis: `PUT /api/issues/{research-subtask-id}/documents/competitive-analysis` (from Market Researcher)

**Exit criteria:**
- [ ] Problem is stated in user terms (not solution terms)
- [ ] At least 2 independent evidence sources support the opportunity
- [ ] Affected user segment and estimated reach are identified
- [ ] Opportunity brief stored as issue document with date

---

## Phase 2: DEFINE

**Trigger:** Opportunity brief exists and warrants further investment.

**TeamClip pattern:** Product Manager creates definition subtasks under the discovery milestone for problem framing, success metrics, and solution hypotheses.

**What happens:**
1. **Frame the problem precisely:**
   - Who is the target user? (reference or create persona)
   - What is the current behavior / workaround?
   - What does success look like from the user's perspective?
   - What does success look like from the business's perspective?
2. **Define success metrics:**
   - Primary metric (the one number that tells you it worked)
   - Secondary metrics (guardrails — things that shouldn't get worse)
   - Leading indicators (signals you'll see before the primary metric moves)
   - Measurement method (how you'll actually track it)
3. **Generate solution hypotheses:**
   - At least 2 possible approaches (don't anchor on the first idea)
   - For each: rough effort estimate, expected impact, risks
   - Recommended approach with reasoning
4. Update opportunity brief issue document with problem definition and success criteria

**Agent:** **Product Manager**

**Deliverable storage:**
- Updated opportunity brief with problem definition: `PUT /api/issues/{discovery-milestone-id}/documents/opportunity-brief`
- Success metrics: `PUT /api/issues/{define-task-id}/documents/success-metrics`
- Solution hypotheses: `PUT /api/issues/{define-task-id}/documents/solution-hypotheses`

**Exit criteria:**
- [ ] Problem statement is specific and falsifiable
- [ ] Success metrics are measurable with current (or planned) instrumentation
- [ ] At least 2 solution approaches were considered
- [ ] Recommended approach is stated with rationale

---

## Phase 3: PRIORITIZE

**Trigger:** Multiple defined opportunities competing for the same resources.

**TeamClip pattern:** Product Manager scores each opportunity using RICE, stores the roadmap as an issue document. Market Researcher provides market timing inputs.

**What happens:**
1. **Score each opportunity using RICE:**
   - **Reach** — How many users will this affect in a given period? (number)
   - **Impact** — How much will it move the target metric per user? (3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal)
   - **Confidence** — How sure are we about reach and impact estimates? (100% = high, 80% = medium, 50% = low)
   - **Effort** — How many person-weeks of work? (number)
   - **RICE Score = (Reach x Impact x Confidence) / Effort**

2. **Apply the Decision Framework** (5 questions, in order):
   1. **Does it solve a validated user problem?** — If no evidence, it goes to the research queue, not the build queue.
   2. **Does it align with product strategy?** — Check against roadmap themes, GTM model, competitive positioning.
   3. **What's the impact/effort ratio?** — RICE score. High score = strong candidate.
   4. **Are there dependencies?** — Technical dependencies (CTO/Architect), cross-team dependencies (Design Lead, Legal Counsel), market timing.
   5. **Does it create compound value?** — Platform effects, data network effects, ecosystem value. Tiebreaker for similar RICE scores.

3. **Build the prioritized roadmap:**
   - Now (this sprint/cycle): top 2-3 items
   - Next (next cycle): 3-5 items
   - Later (backlog): everything else, loosely ordered
   - Never (explicitly rejected): items with reasoning for rejection

4. **Map dependencies:**
   - Which items depend on each other?
   - Which items need cross-team input (Design Lead, Legal Counsel, Finance Analyst)?
   - Which items have market timing constraints?

5. Store roadmap as issue document: `PUT /api/issues/{id}/documents/roadmap`

**Agent:** **Product Manager** (with Market Researcher providing competitive urgency and market timing inputs)

**Deliverable storage:**
- Prioritized roadmap: `PUT /api/issues/{id}/documents/roadmap`
- RICE scoring data: `PUT /api/issues/{id}/documents/rice-scores`
- Product backlog: individual issues in the Paperclip issue tree, each with RICE score in description

**Exit criteria:**
- [ ] Every backlog item has a RICE score
- [ ] Top items pass all 5 decision framework questions
- [ ] Roadmap has clear Now / Next / Later / Never buckets
- [ ] Dependencies are mapped (blocking relationships in issue tree)
- [ ] Roadmap stored as issue document with date

---

## Phase 4: SPECIFY

**Trigger:** An item moves to "Now" on the roadmap.

**TeamClip pattern:** Product Manager creates PRD as an issue document on a new milestone issue. Chief of Staff auto-creates cross-team handoff issues for Engineering (via CTO), Design Lead (UX requirements), and Legal Counsel (if data handling or compliance implications).

**What happens:**
1. **Write the PRD** with these sections:
   - **Problem statement** — from the Define phase (copy, don't rewrite)
   - **Target users** — personas with names, not abstract segments
   - **User stories** — "As a [persona], I can [action], so that [value]"
     - Grouped by feature area
     - Each with numbered acceptance criteria (checkboxes)
   - **Success metrics** — from the Define phase
   - **Scope** — what's IN v1, what's explicitly OUT
   - **Technical requirements** — performance, security, data, integration needs
   - **Design requirements** — UX expectations, reference points, accessibility
   - **Dependencies** — what needs to happen first, cross-team needs
   - **Open questions** — unresolved items with owners and deadlines
   - **Risks** — what could go wrong and mitigation strategies

2. **Review cycle:**
   - Product Manager drafts
   - Eric (CEO) reviews and approves
   - Design Lead reviews UX requirements (via gate issue)
   - Architect reviews technical feasibility (via gate issue)

3. Store PRD as issue document: `PUT /api/issues/{milestone-id}/documents/prd`

**Agent:** **Product Manager**

**Deliverable storage:**
- PRD: `PUT /api/issues/{milestone-id}/documents/prd` (full PRD as keyed document — no character limit, revisioned)
- Supporting materials (mockups, competitive screenshots): `POST /api/issues/{milestone-id}/attachments`
- Description field: summary only — never put the full PRD in the description

**Exit criteria:**
- [ ] Every user story has acceptance criteria with checkboxes
- [ ] Success metrics are specific and measurable
- [ ] Scope boundary is explicit (IN vs. OUT)
- [ ] Technical requirements are stated (not solutioned — that's Engineering's job)
- [ ] PRD is reviewed and approved by CEO
- [ ] PRD stored as issue document

---

## The Handoff: SPECIFY --> Engineering IDEATE

This is the critical bridge between Product and Engineering. It's a formal handoff, not a toss-over-the-wall.

**TeamClip pattern:** Chief of Staff auto-creates a handoff issue assigned to CTO when the Product Manager marks the SPECIFY milestone as done. The handoff issue contains:

**What Product delivers (as issue documents and attachments):**
- Approved PRD: linked via issue document reference
- Priority level and target timeline
- Success metrics (so Engineering knows what "done" looks like beyond code)
- Known constraints (technical, legal, timeline)
- Availability for questions during BUILD

**What Engineering does with it:**
1. CTO creates "Ideation: {feature}" milestone — reviews PRD, assigns Architect for technical feasibility, produces technical PRD
2. CTO creates "Planning: {feature}" milestone — decomposes into tasks, creates issue tree
3. CTO assigns build tasks to Full-Stack Engineer, QA Engineer gets review tasks, UX Director gets visual QA tasks

**Product's role during Engineering BUILD:**
- Available for scope questions and acceptance criteria clarification (responds via issue comments)
- Does NOT change scope mid-sprint (if something changes, it goes to the next cycle)
- Reviews completed features against acceptance criteria
- Flags misalignments early via issue comments

**Handoff issue document (stored as `PUT /api/issues/{handoff-id}/documents/handoff`):**
```
From: Product Manager
To: CTO
Product: [name]
PRD: Issue #{milestone-id} document key "prd"
Priority: [P0-P4]
Target: [timeline]
Context: [why this, why now]
Success metrics: [from PRD]
Open questions: [if any remain]
```

---

## Phase 5: VALIDATE

**Trigger:** Engineering ships the feature. Post-launch analysis begins. Chief of Staff auto-creates validation task assigned to Product Manager when engineering milestone reaches "done".

**TeamClip pattern:** Product Manager creates validation subtasks. CS Lead provides user feedback data via handoff issue.

**What happens:**
1. **Collect data** against the success metrics defined in DEFINE/SPECIFY:
   - Primary metric: did it move?
   - Secondary metrics: did anything get worse?
   - Leading indicators: are early signals positive?
2. **Analyze adoption:**
   - Feature adoption rate (who's using it, how often)
   - User flow completion rate
   - Error rates and support ticket volume
   - User feedback (qualitative — CS Lead reports, in-app feedback)
3. **Compare to hypothesis:**
   - Did the solution solve the problem we identified?
   - Was the impact in the range we estimated?
   - Were there unexpected effects (positive or negative)?
4. **Decide next action:**
   - **Ship and move on** — metrics met, problem solved
   - **Iterate** — partially solved, specific improvements identified --> new issues in the tree
   - **Revert or pivot** — didn't solve the problem, need a different approach
5. Store validation report as issue document
6. Feed learnings back into DISCOVER for the next cycle

**Agent:** **Product Manager** (with CS Lead providing user feedback and Market Researcher providing competitive context)

**Deliverable storage:**
- Validation report: `PUT /api/issues/{validation-task-id}/documents/validation-report`
- Adoption metrics: `POST /api/issues/{id}/attachments` (dashboards, spreadsheets)
- Decision and rationale: stored in validation report document

**Exit criteria:**
- [ ] All success metrics measured against baseline
- [ ] User feedback collected (at least qualitative from CS Lead)
- [ ] Decision made with rationale (ship / iterate / pivot)
- [ ] Learnings documented
- [ ] If iterating: new issues created in tree with evidence

---

## Agent Team

| Agent | Role | Active Phases |
|-------|------|---------------|
| **Product Manager** | PRDs, user stories, roadmap, prioritization, stakeholder coordination, usage analytics, feature adoption, churn signals, competitive analysis. Reports directly to Eric (peer to CTO). Owns the full product cycle. Design Lead reports to PM. (Absorbs old product-manager, product-analyst, and competitive-analyst roles) | All phases |
| **Market Researcher** | Deep web research for competitive intel, market sizing, user forum analysis. Goes to the real internet. Feeds findings to Product Manager and CMO. | DISCOVER (competitive research), PRIORITIZE (market timing) |
| **CS Lead** | User feedback synthesis, NPS data, support ticket patterns, churn analysis. Feeds findings to Product Manager. | DISCOVER (feedback), VALIDATE (user feedback) |

### Agent activation by phase

```
DISCOVER:   Product Manager + Market Researcher + CS Lead (feedback)
DEFINE:     Product Manager
PRIORITIZE: Product Manager + Market Researcher (market timing)
SPECIFY:    Product Manager (writing the PRD)
VALIDATE:   Product Manager + CS Lead (user feedback)
```

---

## Product Backlog vs. Engineering Sprint Backlog

These are two different things. Conflating them causes chaos.

| | Product Backlog | Engineering Sprint Backlog |
|--|----------------|--------------------------|
| **Granularity** | Epics and features | Tasks and subtasks |
| **Owner** | Product Manager | CTO |
| **Items look like** | "User can filter dashboard by date range" | "Add DateRangePicker component", "Create /api/dashboard?from=&to= endpoint", "Write integration tests for date filtering" |
| **Prioritization** | RICE scoring + decision framework | Task dependencies + sprint capacity |
| **Storage** | Issues in Paperclip with RICE scores in description | Issues in Paperclip with parentId linking to milestone |
| **Updated by** | Product Manager | CTO + Full-Stack Engineer |
| **Paperclip level** | Milestone-level issues | Task and subtask issues |

**The flow:**
1. Product backlog item (epic/feature) gets prioritized to "Now"
2. Product Manager writes PRD (SPECIFY phase) as issue document
3. Chief of Staff creates handoff issue to CTO
4. CTO decomposes into sprint backlog items (task issues with parentId)
5. Full-Stack Engineer + QA Engineer build, test, ship
6. Product Manager validates against success metrics

Product NEVER writes Engineering's task issues. Engineering NEVER changes Product's priority order.

---

## Prioritization Framework: RICE in Detail

### Scoring Guide

**Reach** — Number of users affected in a defined time period (e.g., per quarter)
- Use actual data when available (DAU, MAU, segment size)
- For new features targeting new segments, use market research estimates
- Be specific: "500 users/quarter" not "medium"

**Impact** — Effect on the target metric per user reached
| Score | Meaning | Example |
|-------|---------|---------|
| 3 | Massive | Solves a top-3 user complaint; drives primary conversion metric |
| 2 | High | Significant improvement to core workflow |
| 1 | Medium | Noticeable improvement, users will appreciate it |
| 0.5 | Low | Nice-to-have, marginal improvement |
| 0.25 | Minimal | Edge case, few users notice |

**Confidence** — How certain are the Reach and Impact estimates?
| Score | Meaning | Evidence Required |
|-------|---------|-------------------|
| 100% | High | Direct user data, A/B test results, multiple evidence sources |
| 80% | Medium | User feedback + analytics alignment, single strong signal |
| 50% | Low | Gut feel, competitive parity argument, single anecdote |

**Effort** — Person-weeks of work across all teams (Product + Engineering + Design)
- Get Architect/CTO estimate before finalizing (or use T-shirt sizing: S=1, M=2, L=4, XL=8)
- Include design effort if UX work is needed
- Include Product effort for spec and validation

### RICE Score Calculation
```
RICE = (Reach x Impact x Confidence) / Effort
```

### Example
| Feature | Reach | Impact | Confidence | Effort | RICE |
|---------|-------|--------|------------|--------|------|
| Dashboard date filter | 2000 | 2 | 80% | 2 weeks | 1600 |
| Dark mode | 3000 | 0.5 | 100% | 4 weeks | 375 |
| Export to CSV | 500 | 3 | 80% | 1 week | 1200 |
| AI suggestions | 1000 | 2 | 50% | 8 weeks | 125 |

RICE is a starting point, not a decree. The decision framework (5 questions) provides the qualitative overlay.

---

## Integration Points

### Product reads from (via Paperclip issue documents):
| Team | What | Source |
|------|------|--------|
| CS Lead | User feedback reports, NPS, ticket patterns | CS feedback milestone issue documents |
| CMO + Market Researcher | Market research, competitive intel, user language | GTM research milestone issue documents |
| CTO + Architect | Technical feasibility, LOE estimates, shipped features | Engineering milestone issue documents |
| Finance Analyst | Unit economics, pricing analysis | Finance milestone issue documents |
| Design Lead + UX Director | Usability findings, wireframes | Design milestone issue documents |

### Product sends to (via Chief of Staff handoff issues):
| Team | What | Trigger |
|------|------|---------|
| CTO (Engineering) | PRDs, priority decisions, scope rulings | SPECIFY phase complete --> Chief of Staff creates handoff issue |
| Design Lead | UX requirements, personas, competitive benchmarks | SPECIFY phase (design requirements in PRD) |
| CMO | Positioning inputs, feature narratives, competitive differentiation | PRIORITIZE phase (roadmap decisions) |
| Finance Analyst | Pricing recommendations, packaging proposals | As needed |
| Legal Counsel | Data handling requirements, compliance needs | SPECIFY phase (if applicable) |

---

## Backlog Management

The product backlog is the master list of opportunities, features, and improvements. It is NOT a task list — it's a prioritized inventory of user problems to solve.

### Backlog item format (stored as issue description)
```markdown
## [EPIC-ID] Feature Name
**Status:** [current status]
**RICE:** Reach: X | Impact: X | Confidence: X% | Effort: X weeks | Score: X
**Source:** [CS feedback / Analytics / Competitive / CEO directive / User research]
**Persona:** [Which user persona]
**Problem:** [The user problem this solves]
**Success metric:** [How we'll know it worked]
**Dependencies:** [Cross-team or technical dependencies]
**PRD:** [Issue #{id} document key "prd" when SPECIFY begins]
```

### Issue status flow
```
backlog --> defining --> specified --> in_engineering --> shipped --> validated
                                                                --> deferred (with reason)
                                                                --> cancelled (with reason)
```

---

## Anti-Patterns

- **Solution-first thinking** — "Let's add dark mode" without evidence anyone wants it. Start with the problem.
- **PRD without success metrics** — If you can't measure it, you can't validate it. You're guessing.
- **Changing scope mid-sprint** — If it's important enough to change, it's important enough to wait for the next cycle. Exceptions only for P0 issues.
- **RICE without real data** — Garbage in, garbage out. Use actual reach numbers, not vibes.
- **Skipping VALIDATE** — You shipped it. Did it work? If you never check, you never learn.
- **Product writing Engineering's tasks** — Product says WHAT and WHY. Engineering decides HOW. Don't cross the line.
- **Backlog archaeology** — Items older than 2 quarters without progress should be re-evaluated or killed. Stale backlogs create false optionality.
- **Consensus-driven prioritization** — RICE + decision framework, not committee votes. Data and frameworks beat opinions.
- **PRD as a novel** — PRDs are tools for alignment, not literature. If it's longer than 5 pages, it's probably two features.
- **Putting full PRDs in issue descriptions** — Descriptions are summaries. Full PRDs go in issue documents (`PUT /api/issues/{id}/documents/prd`).
- **Standalone PRD files** — All product deliverables belong as issue documents. Not orphaned files.
- **Undated artifacts** — If it doesn't have a date, you can't tell if it's current. Date everything.
- **Manual cross-team handoffs** — Let the Chief of Staff create handoff issues automatically. Manual handoffs get lost.
