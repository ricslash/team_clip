# Product Management Process (TeamClip)

_Last updated: 2026-03-25_

Complete product management lifecycle. Every phase produces artifacts, updates the product issue tree, and has exit criteria.

**Cardinal rule:** Every feature decision traces to a validated user problem. If you can't point to real evidence, stop and find it.

---

## Lifecycle

```
DISCOVER --> DEFINE --> PRIORITIZE --> SPECIFY --> VALIDATE
                                        |             ^
                                  Engineering         |
                              IDEATE --> BUILD --> SHIP+
```

| # | Phase | Purpose | Key Output |
|---|-------|---------|------------|
| 1 | **Discover** | Identify opportunities from users, data, market | Opportunity brief |
| 2 | **Define** | Frame the problem, set success criteria | Problem statement + success metrics |
| 3 | **Prioritize** | Score, rank, sequence the roadmap | Prioritized roadmap (RICE) |
| 4 | **Specify** | Write the PRD | PRD as issue document |
| 5 | **Validate** | Post-launch analysis against success criteria | Validation report |

---

## Phase Details

### 1. DISCOVER

**Trigger:** User feedback, analytics anomaly, competitive move, market shift, CEO directive.

PM creates milestone "Discovery: {product}" with subtasks per signal source. Market Researcher gets competitive analysis subtasks.

**Signal sources:** CS Lead feedback reports, product analytics, Market Researcher competitive analysis, CMO research, direct user research, support ticket patterns.

**Output:** Opportunity brief — problem/opportunity, who experiences it, how big, evidence, cost of inaction.

**Storage:** `PUT /api/issues/{id}/documents/opportunity-brief`

**Exit:** Problem in user terms, 2+ independent evidence sources, affected segment identified.

### 2. DEFINE

PM creates definition subtasks for problem framing, success metrics, solution hypotheses.

**Activities:**
1. Frame the problem (target user, current behavior, success from user/business perspective)
2. Define success metrics (primary, secondary guardrails, leading indicators, measurement method)
3. Generate 2+ solution hypotheses with effort/impact/risks
4. Recommend approach with reasoning

**Storage:** `PUT /api/issues/{id}/documents/{opportunity-brief|success-metrics|solution-hypotheses}`

**Exit:** Specific falsifiable problem statement, measurable metrics, 2+ approaches considered.

### 3. PRIORITIZE

PM scores opportunities using RICE, stores roadmap as issue document.

**RICE:** `(Reach x Impact x Confidence) / Effort`
- Reach: users affected per quarter (use real data)
- Impact: 3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal
- Confidence: 100%=high (direct data), 80%=medium, 50%=low (gut feel)
- Effort: person-weeks across all teams

**Decision framework (5 questions):**
1. Validated user problem?
2. Aligns with product strategy?
3. Impact/effort ratio (RICE)?
4. Dependencies?
5. Compound value?

**Roadmap buckets:** Now (top 2-3), Next (3-5), Later (loosely ordered), Never (with reasoning).

**Storage:** `PUT /api/issues/{id}/documents/{roadmap|rice-scores}`

### 4. SPECIFY

Item moves to "Now." PM writes PRD as issue document. Chief of Staff auto-creates handoff issues for Engineering, Design Lead, Legal Counsel.

**PRD sections:** Problem statement, target users (named personas), user stories with acceptance criteria, success metrics, scope (IN/OUT), technical requirements, design requirements, dependencies, open questions, risks.

**Review cycle:** PM drafts, CEO approves, Design Lead reviews UX (gate issue), Architect reviews feasibility (gate issue).

**Storage:** `PUT /api/issues/{milestone-id}/documents/prd` (full PRD as keyed document). Description field: summary only.

**Exit:** Every user story has acceptance criteria, metrics are measurable, scope boundary explicit, CEO approved.

### The Handoff: SPECIFY --> Engineering IDEATE

Chief of Staff auto-creates handoff issue to CTO when SPECIFY milestone is done.

**Handoff document (`PUT /api/issues/{handoff-id}/documents/handoff`):**
```
From: Product Manager | To: CTO
Product: [name] | PRD: Issue #{id} key "prd"
Priority: [P0-P4] | Target: [timeline]
Context: [why this, why now]
Success metrics: [from PRD]
```

**PM during Engineering BUILD:** Available for scope questions (via issue comments), does NOT change scope mid-sprint, reviews completed features against acceptance criteria.

### 5. VALIDATE

Engineering ships. Chief of Staff auto-creates validation task for PM.

**Activities:** Measure primary/secondary/leading metrics against baseline, analyze adoption, compare to hypothesis, decide: ship and move on / iterate / revert.

**Storage:** `PUT /api/issues/{id}/documents/validation-report`

**Exit:** All metrics measured, user feedback collected, decision made with rationale, learnings documented.

---

## Agent Team

| Agent | Role | Active Phases |
|-------|------|---------------|
| **Product Manager** | PRDs, roadmap, prioritization, stakeholder coordination. Reports to Eric (peer to CTO). | All phases |
| **Market Researcher** | Deep web research for competitive intel, market sizing. | DISCOVER, PRIORITIZE |
| **CS Lead** | User feedback, NPS, support ticket patterns. | DISCOVER, VALIDATE |

---

## Product Backlog vs. Engineering Sprint Backlog

| | Product Backlog | Engineering Sprint Backlog |
|--|----------------|--------------------------|
| **Granularity** | Epics and features | Tasks and subtasks |
| **Owner** | Product Manager | CTO |
| **Prioritization** | RICE + decision framework | Task dependencies + sprint capacity |
| **Paperclip level** | Milestone-level issues | Task and subtask issues |

Product NEVER writes Engineering's task issues. Engineering NEVER changes Product's priority order.

### Issue status flow
```
backlog --> defining --> specified --> in_engineering --> shipped --> validated
                                                                --> deferred (with reason)
                                                                --> cancelled (with reason)
```

---

## Anti-Patterns

- **Solution-first thinking** — Start with the problem, not "let's add X"
- **PRD without success metrics** — Can't measure it, can't validate it
- **Changing scope mid-sprint** — Important enough to change = important enough to wait
- **RICE without real data** — Use actual reach numbers, not vibes
- **Skipping VALIDATE** — Ship it, then check if it worked
- **Product writing Engineering's tasks** — Product says WHAT/WHY, Engineering decides HOW
- **Backlog archaeology** — Items older than 2 quarters: re-evaluate or kill
- **Full PRDs in issue descriptions** — Descriptions are summaries; PRDs go in keyed documents
- **Manual cross-team handoffs** — Let Chief of Staff handle them
