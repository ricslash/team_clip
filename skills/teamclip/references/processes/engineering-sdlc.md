# Engineering SDLC — Full Lifecycle Reference (TeamClip)

_Last updated: 2026-03-25_

**The cardinal rule:** The issue tree is the heartbeat. Every phase reads it, updates it, and tracks status via Paperclip. If the issue tree isn't current, stop and fix it before doing anything else.

---

## The Full Lifecycle

```
IDEATE --> DECOMPOSE --> SCAFFOLD --> BUILD ----> CLOSE
                                      ^  |
                                      +--+  (checkpoint + next milestone)
```

| # | Phase | TeamClip Pattern | Key Output |
|---|-------|------------------|------------|
| 1 | **Ideate** | PM creates milestone "Ideation: {feature}" | PRD as issue document (key: `prd`) |
| 2 | **Decompose** | PM creates milestone "Planning: {feature}" with task subtree | Issue tree with parent/child relationships |
| 3 | **Scaffold** | CTO assigns to Full-Stack Engineer | Working repo with project config |
| 4 | **Build** | CTO assigns tasks to Full-Stack Engineer; QA reviews at milestone end | Working code, passing tests |
| 5 | **Checkpoint** | Chief of Staff auto-detects milestone completion | Checkpoint report, updated issue tree |
| 6 | **Close** | Update issue statuses, attach handoff doc | Handoff document on milestone issue |

Additional patterns:
- **Onboard** — Bring an existing project in by creating the project + milestone + issue tree in Paperclip
- **Workflow detect** — Query `GET /api/companies/{id}/issues?projectId=...` to auto-detect state and proceed

---

## Phase 1: IDEATE

**Trigger:** You have an idea — napkin sketch, paragraph, or full vision.

**TeamClip pattern:** Product Manager creates a milestone issue via `POST /api/companies/{id}/issues` with title "Ideation: {feature}". Architect gets a subtask for feasibility, CTO for architecture review.

**What happens:**
1. You describe your idea in plain language
2. PM checks if enough context was provided — only asks targeted questions for genuinely missing info
3. PM produces a **Technical PRD** with: product overview, target users/personas, core user stories by feature area, technical architecture (stack, hosting, data model), non-functional requirements, MVP scope (what's in v1, what's deferred), risk assessment
4. PRD stored: `PUT /api/issues/{id}/documents/prd` on the milestone issue

**Deliverable storage:**
- PRD full text: `PUT /api/issues/{id}/documents/prd` (keyed, revisioned, no character limit)
- Supporting artifacts: `POST /api/issues/{id}/attachments` (binary files)
- Description field: summary only — never the full PRD

**Exit criteria:**
- [ ] PRD reviewed and approved by CEO
- [ ] User stories cover all core workflows
- [ ] Architecture decision is explicit (stack, hosting, data model)
- [ ] MVP scope defined — v1 IS and ISN'T are clear
- [ ] Architect feasibility confirmed

---

## Phase 2: DECOMPOSE

**Trigger:** PRD complete. Auto-chains from ideation (PM can pause for CEO review).

**TeamClip pattern:** PM creates milestone "Planning: {feature}" with subtasks. Chief of Staff auto-creates cross-team issues for dependencies.

**What happens:**
1. PM reads the PRD from `GET /api/issues/{id}/documents/prd`
2. Breaks PRD into **milestones** (logical groups) — each becomes an issue
3. Breaks each milestone into **tasks**: user story format, acceptance criteria checkboxes, file paths, source tracing to PRD, priority (P0-P4), complexity (S/M/L)
4. Creates full issue tree: `POST /api/companies/{id}/issues` with `parentId` linking to milestone
5. Complex tasks get requirements docs: `PUT /api/issues/{id}/documents/requirements`

**Priority groups:** P0 ship blockers, P1 core MVP, P2 competitive parity, P3 tech debt, P4 market expansion.

**Issue tree structure:**
```
Milestone 1 (parentId=project) — [Name] — [1-line goal]
  Epic A (parentId=milestone) — [Feature area]
    Task A.1 (parentId=epic) — [Deliverable] — P1, Size M
    Task A.2 (parentId=epic) — [Deliverable] — P1, Size S
```

**Exit criteria:**
- [ ] Every PRD user story maps to at least one task
- [ ] Every task has acceptance criteria checkboxes
- [ ] Tasks ordered within milestones (dependencies explicit)
- [ ] Issue tree populated and matches plan
- [ ] CEO reviewed and agreed on scope

---

## Phase 3: SCAFFOLD

**Trigger:** Decomposition complete. Skipped for existing projects (straight to BUILD).

**TeamClip pattern:** CTO assigns to Full-Stack Engineer. DevOps Engineer gets CI/CD subtask.

**What happens:**
1. Full-Stack Engineer creates project structure from PRD architecture
2. Sets up dev environment: Docker/compose, dependencies, DB + migrations, `.env.example`
3. DevOps Engineer sets up test harness (runner + first passing test) and CI/CD skeleton

**Exit criteria:**
- [ ] Project config exists with safety rules, architecture, conventions
- [ ] Test command runs and passes (at least 1 smoke test)
- [ ] Dev environment starts cleanly

---

## Phase 4: BUILD

**Trigger:** Scaffold complete with passing tests. Auto-chains from scaffold.

**TeamClip pattern:** CTO creates task tree under milestone, assigns to Full-Stack Engineer. QA Engineer reviews at milestone boundaries. UX Director gets visual QA for user-facing milestones.

**The build loop:**
```
For each milestone:
  1. Full-Stack Engineer works through tasks in priority order
     - Update issue status --> "in_progress" via PATCH /api/issues/{id}
     - Implement, commit at natural stopping points (multiple small fixes can share a commit)
     - Reference issue IDs in commit messages
     - Update issue status --> "done" via PATCH /api/issues/{id}
     - Move to next task without stopping
  2. At milestone end: QA Engineer runs full test suite + checks ALL acceptance criteria
     - If fail --> back to Full-Stack Engineer --> QA re-verifies
     - If pass --> checkpoint triggers automatically
```

**Agent roles during BUILD:**

| Agent | Responsibilities |
|-------|-----------------|
| **Full-Stack Engineer** | API routes, ORM models, business logic, migrations, tests, UI components, TypeScript, styles |
| **QA Engineer** | Runs tests at milestone end, checks acceptance criteria, does NOT write implementation code |
| **DevOps Engineer** | Docker, cloud deployment, CI/CD pipeline work |
| **Architect** | Architecture-level code review at checkpoints |
| **UX Director** | Visual QA, UX flow review, accessibility audits (Gemini adapter) |

**Hard rules:**
- QA Engineer must sign off at milestone end — "looks right" is not verification
- Tests must pass before and after every milestone (clean baseline)
- No `any` in TypeScript, no skipped tests, no partial implementations
- Issue tree must stay in sync at all times
- A task is Done or it's not — no partial credit

**When to stop and alert (the ONLY reasons):**
- Critical regression that can't be self-resolved
- Architectural decision that contradicts the PRD
- Acceptance criteria too ambiguous to determine "done"
- Security concern requiring a design decision

Escalation: Full-Stack Engineer --> CTO --> Chief of Staff --> Eric (via Discord)

---

## Phase 5: CHECKPOINT

**Trigger:** Automatic after each milestone (Chief of Staff heartbeat detects completion). Can also be triggered manually.

**TeamClip pattern:** Chief of Staff auto-creates: "Code Review: {milestone}" (Architect), "UX Review: {milestone}" (UX Director, if user-facing), "Documentation: {milestone}" (CS Lead + Architect).

**What happens:**
1. Compare what was built vs. planned (issue tree audit)
2. QA Engineer runs full test suite, reports results
3. Check for: PRD drift, scope creep, missing coverage, security surfaces
4. Documentation generation (see below)
5. Log checkpoint report: `PUT /api/issues/{milestone-id}/documents/checkpoint-report`

**Checkpoint report:** milestone status, tasks completed (X/Y), tests passing/total, PRD alignment, issues found, next milestone.

**Issue tree update:** Confirm done tasks with timestamps, add new issues from findings, mark milestone complete, create quality gate issues.

**Automatic mode:** No P0 issues remain --> advance to next milestone immediately.

---

## Phase 6: CLOSE

**Trigger:** Session ending (shipped what you planned, or time/context is up).

**What happens:**
1. Update all issue statuses via `PATCH /api/issues/{id}`
2. Update project config if architecture changed
3. Create issues for anything discovered but unfinished
4. Generate handoff doc: `PUT /api/issues/{milestone-id}/documents/handoff`
   - Full operating instructions, agent roles, execution loop
   - All state: done list, test baseline, priority-ordered remaining tasks
   - All values filled — no placeholders

**Output:** Summary of what shipped, test baseline (pass count), next session phase + first task.

---

## Documentation Generation

Docs run at every milestone checkpoint, after QA passes but before advancing.

### Auto-generated (every milestone)

| Document Key | Content | Owner |
|-------------|---------|-------|
| `architecture` | System design with mermaid diagrams, components, data flows, tech stack | Architect |
| `api-reference` | All endpoints with request/response schemas | Architect |
| `decision-log` | Architectural decisions with context and rationale (append-only) | Architect |
| `release-notes` | What shipped, auto-generated from done issues | CS Lead |

### On-demand (when ready to publish)

| Document Key | Content | Owner |
|-------------|---------|-------|
| `end-user-docs` | Feature guides for non-technical users | CS Lead |
| `faq` | Common questions and answers | CS Lead |

Store via: `PUT /api/issues/{milestone-id}/documents/{key}`
Binary artifacts (screenshots, diagrams): `POST /api/issues/{milestone-id}/attachments`

### Documentation rules
- Incremental updates per milestone — only touch sections that changed
- Full regeneration at final milestone to catch drift
- Populate from actual code — read source files, config, models, routes
- Never guess or use placeholder data
- Decision log entries are append-only — never modify existing ADRs

---

## Task Tracking

**Non-negotiable.** Paperclip is the source of truth.

### Issue status flow
```
backlog --> todo --> in_progress --> done
                                --> blocked (with blocking issue reference)
                                --> cancelled (with reason in comment)
```

### When to update issues
| Event | Update |
|-------|--------|
| New task discovered | `POST /api/companies/{id}/issues` with parentId |
| Starting a task | `PATCH /api/issues/{id}` status --> "in_progress" |
| Task passes verification | `PATCH /api/issues/{id}` status --> "done" |
| Task blocked | `PATCH /api/issues/{id}` status --> "blocked", create blocking issue |
| Milestone complete | Chief of Staff heartbeat detects, creates gate issues |
| Session ending | Update all touched issue statuses |

### Issue documentation pattern
- Descriptions are summaries — enough to start work
- Full specs go in **issue documents**: `PUT /api/issues/{id}/documents/{key}`
- Binary files go in **attachments**: `POST /api/issues/{id}/attachments`

---

## Context Management

- **Resuming:** Read handoff doc from `GET /api/issues/{milestone-id}/documents/handoff`
- **Starting fresh:** Query issue tree (`GET /api/companies/{id}/issues?projectId=...`), find first incomplete milestone, proceed
- **Mid-session overflow:** Agent writes remaining work to issue comments and closes session; Chief of Staff heartbeat detects and re-assigns

---

## Quality Gates

Chief of Staff auto-creates these as blocking issues at milestone completion:

| Gate | Assigned To | Blocks |
|------|-------------|--------|
| Code Review | Architect | Merge/deploy |
| UX Review (if user-facing) | UX Director | Milestone ship |
| QA Verification | QA Engineer | Milestone completion |
| Documentation | CS Lead + Architect | Release |
| Deploy Gate | DevOps Engineer | Production deploy |

---

## Anti-Patterns

- **PRD --> "go build it"** — Always decompose first
- **Building without an issue tree** — If issues don't exist, you're freestyling
- **Skipping checkpoints** — They're automatic for a reason
- **Full specs in issue descriptions** — Use issue documents (`PUT /api/issues/{id}/documents/{key}`)
- **"It looks right" as verification** — QA runs actual tests at milestone end
- **Stale issue tree** — If issues are wrong, every decision built on them is wrong
- **Massive sessions without close** — The handoff doc is your future self's lifeline
- **Standalone files instead of issue documents** — Deliverables belong on issues

---

## Agent Summary

| Agent | Role in SDLC | Phases Active |
|-------|-------------|---------------|
| **Product Manager** | PRD authoring, decomposition, acceptance criteria | IDEATE, DECOMPOSE |
| **CTO** | Technical strategy, architecture oversight, task assignment | All (oversight) |
| **Architect** | System design, API design, code review, technical docs | IDEATE, BUILD (review), CHECKPOINT |
| **Full-Stack Engineer** | Frontend + backend implementation | SCAFFOLD, BUILD |
| **QA Engineer** | Milestone-level testing, acceptance criteria verification | BUILD (milestone end), CHECKPOINT |
| **DevOps Engineer** | CI/CD, infrastructure, deploys | SCAFFOLD, BUILD, CHECKPOINT |
| **UX Director** | Visual QA, UX flow review, accessibility (Gemini) | BUILD (review), CHECKPOINT |
| **Design Lead** | Design tokens, component specs, brand review | IDEATE, BUILD (spec reference) |
| **CS Lead** | User-facing docs, release notes | CHECKPOINT, CLOSE |
| **Chief of Staff** | Orchestration — milestone detection, handoffs, quality gates, escalation | All (heartbeat) |
