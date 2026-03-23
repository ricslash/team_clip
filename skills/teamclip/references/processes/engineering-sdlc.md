# Engineering SDLC — Full Lifecycle Reference (TeamClip)

_Last updated: 2026-03-20_
_Adapted from: Team workflow/process.md_

This is the complete, proactive software development lifecycle. It applies to any project. Every phase produces artifacts, updates the issue tree, and has a defined checkpoint before moving forward.

**The cardinal rule:** The issue tree is the heartbeat. Every phase reads it, updates it, and tracks status via Paperclip. If the issue tree isn't current, stop and fix it before doing anything else.

---

## The Full Lifecycle

```
IDEATE --> DECOMPOSE --> SCAFFOLD --> BUILD ----> CLOSE
                                      ^  |
                                      +--+  (checkpoint + next milestone -- automatic)
```

| # | Phase | TeamClip Pattern | Purpose | Key Output |
|---|-------|------------------|---------|------------|
| 1 | **Ideate** | PM creates milestone "Ideation: {feature}" via Paperclip API | Idea --> Technical PRD with user stories | PRD stored as issue document (key: `prd`) |
| 2 | **Decompose** | PM creates milestone "Planning: {feature}" with task subtree | PRD --> Milestones --> Tasks --> Issue tree | Issue tree with parent/child relationships |
| 3 | **Scaffold** | CTO creates task under milestone, assigns to Full-Stack Engineer | Repo setup, project config, CI/CD, test harness | Working repo with project configuration |
| 4 | **Build** | CTO creates task tree under milestone, assigns to Full-Stack Engineer + QA Engineer. UX Director gets review task. | Execute tasks with specialist agents | Working code, passing tests |
| 5 | **Checkpoint** | Chief of Staff auto-detects milestone completion, creates gate issues | Inline review after each milestone during build | Checkpoint log as issue document, updated issue tree |
| 6 | **Close** | Update issue statuses via `PATCH /api/issues/{id}`, attach handoff doc | Session wrap-up, handoff for next session | Handoff document attached to milestone issue |

Additional patterns:
- **Onboard** — Bring an existing project into this workflow by creating the project + milestone + issue tree in Paperclip
- **Workflow detect** — Query `GET /api/companies/{id}/issues?projectId=...` to auto-detect project state and proceed to the right phase
- **Doc generation** — CS Lead writes/updates project documentation at milestone checkpoints
- **Task sync** — Verify Paperclip issue tree matches actual project state
- **Doc review** — Fix documentation drift (audit existing docs for accuracy)

---

## Phase 1: IDEATE

**Trigger:** You have an idea — could be a napkin sketch, a paragraph, or a full vision.

**TeamClip pattern:** Product Manager creates a milestone issue via `POST /api/companies/{id}/issues` with title "Ideation: {feature}", assigned to themselves. Architect gets a subtask for technical feasibility review. CTO gets a subtask for architecture review.

**What happens:**
1. You describe your idea in plain language
2. The Product Manager checks if enough context was provided — only asks targeted questions for genuinely missing information
3. The Product Manager produces a **Technical PRD** with:
   - Product overview and problem statement
   - Target users and personas (specific, named)
   - Core user stories grouped by feature area (As a [persona], I can [action], so that [value])
   - Technical architecture recommendation (stack, hosting, data model)
   - Non-functional requirements (performance, security, scale)
   - MVP scope definition — what's in v1, what's deferred
   - Risk assessment and open questions
4. PRD stored as an issue document: `PUT /api/issues/{id}/documents/prd` on the milestone issue

**Issue tree update:** Product Manager creates subtask issues under the milestone for each review needed (Architect feasibility, CTO architecture review).

**Deliverable storage:**
- PRD full text: `PUT /api/issues/{id}/documents/prd` (keyed document on the milestone issue — no character limit, revisioned)
- Supporting artifacts (diagrams, mockups): `POST /api/issues/{id}/attachments` (binary files)
- Description field: summary only — never put the full PRD in the description

**Exit criteria (before moving to Phase 2):**
- [ ] PRD reviewed and approved by Eric (CEO)
- [ ] User stories cover all core workflows
- [ ] Architecture decision is explicit (stack, hosting, data model)
- [ ] MVP scope is defined — you know what v1 IS and ISN'T
- [ ] Architect subtask marked done (feasibility confirmed)

---

## Phase 2: DECOMPOSE

**Trigger:** PRD is complete. Auto-chains from ideation (Product Manager can pause for CEO review first).

**TeamClip pattern:** Product Manager creates milestone "Planning: {feature}" with subtasks for backlog creation and sprint planning. Chief of Staff auto-creates cross-team issues for any dependencies.

**What happens:**
1. Product Manager reads the PRD from `GET /api/issues/{id}/documents/prd`
2. Breaks the PRD into **milestones** (logical groups of related functionality) — each becomes an issue in Paperclip
3. Breaks each milestone into **tasks** using the standard format:
   - User story format with acceptance criteria checkboxes
   - File paths (for existing codebases) or target paths (for greenfield)
   - Source tracing back to PRD section
   - Priority assignment (P0-P4)
   - Estimated complexity (S/M/L)
4. Creates the full issue tree: `POST /api/companies/{id}/issues` for each task with `parentId` linking to milestone
5. For complex tasks, attaches requirements as issue documents: `PUT /api/issues/{id}/documents/requirements`

**Priority groups:**
- **P0** — Ship blockers (bugs, security) — must fix before any release
- **P1** — Core experience — users will feel these gaps (MVP features)
- **P2** — Competitive parity — closes gaps vs. named competitors
- **P3** — Tech debt — compounds as scale grows
- **P4** — Market expansion — unlocks new segments

**Milestone structure (as Paperclip issue tree):**
```
Milestone 1 (Issue, parentId=project-level) — [Name] — [1-line goal]
  Epic A (Issue, parentId=milestone) — [Feature area]
    Task A.1 (Issue, parentId=epic) — [Specific deliverable] — P1, Size M
    Task A.2 (Issue, parentId=epic) — [Specific deliverable] — P1, Size S
  Epic B (Issue, parentId=milestone) — [Feature area]
    Task B.1 ...
```

**Issue tree update:** Full tree created. Every task has a status, priority, and assignment. Complex tasks get a `requirements` document attachment via `PUT /api/issues/{id}/documents/requirements`.

**Exit criteria (before moving to Phase 3):**
- [ ] Every PRD user story maps to at least one task issue
- [ ] Every task has acceptance criteria checkboxes (not vague descriptions)
- [ ] Tasks are ordered within milestones (dependencies explicit via issue links or blocking relationships)
- [ ] Issue tree is populated and matches the plan
- [ ] CEO has reviewed the decomposition and agrees with the scope

---

## Phase 3: SCAFFOLD

**Trigger:** Decomposition is complete. Auto-chains for greenfield projects. Skipped for existing projects (goes straight to BUILD).

**TeamClip pattern:** CTO creates scaffold task, assigns to Full-Stack Engineer. DevOps Engineer gets a subtask for CI/CD setup.

**What happens:**
1. Full-Stack Engineer creates the project structure based on the architecture from the PRD
2. Sets up project configuration (equivalent to CLAUDE.md in the old system)
3. Sets up the development environment:
   - Docker/docker-compose if applicable
   - Package managers and dependency installation
   - Database setup and initial migrations
   - Environment variable templates (`.env.example`)
4. DevOps Engineer sets up the test harness (test runner, first passing test)
5. DevOps Engineer sets up CI/CD skeleton if applicable

**Issue tree update:** Mark scaffold tasks as done via `PATCH /api/issues/{id}` with status update. Date-stamp in issue comments.

**Exit criteria (before moving to Phase 4):**
- [ ] Project configuration exists with safety rules, architecture, and conventions
- [ ] Test command runs and passes (even if it's just 1 smoke test)
- [ ] Dev environment starts cleanly
- [ ] Issue tree is accessible and reflects current state

---

## Phase 4: BUILD

**Trigger:** Scaffold is complete with passing tests. Auto-chains from scaffold.

**TeamClip pattern:** CTO creates task tree under milestone, assigns individual tasks to Full-Stack Engineer. QA Engineer gets review tasks. UX Director (Gemini) gets visual QA tasks for user-facing work.

**What happens:**
1. Full-Stack Engineer reads project configuration, issue tree, and architecture docs
2. Confirms clean test baseline (0 failures before starting)
3. Executes tasks in priority order using the agentic loop:

```
For each task issue:
  1. Update issue status --> "in_progress" via PATCH /api/issues/{id}
  2. Full-Stack Engineer works until implementation is complete
  3. QA Engineer runs tests + checks ALL acceptance criteria checkboxes
  4. If fail --> back to Full-Stack Engineer --> re-verify (loop until passing)
  5. If pass:
     a. Commit with issue reference in message
     b. Update issue status --> "done" via PATCH /api/issues/{id}
  6. Move to next task -- do not stop between tasks
```

**Agent assignments during BUILD:**

| Agent | Responsibilities |
|-------|-----------------|
| **Full-Stack Engineer** | API routes, ORM models, business logic, migrations, tests, UI components, TypeScript, data-fetching, styles |
| **QA Engineer** | Runs tests, checks acceptance criteria, does NOT write implementation code. Reviews Full-Stack Engineer output. |
| **DevOps Engineer** | Docker, cloud deployment, CI/CD pipeline work |
| **Architect** | Architecture-level code review, structural quality checks |
| **UX Director** | Visual QA via screenshots, end-to-end UX flow review, accessibility audits (Gemini adapter) |

**Deliverable storage:** All build artifacts (test reports, code review notes, architecture decisions) stored as issue documents or attachments:
- Test reports: `PUT /api/issues/{id}/documents/test-report`
- Architecture decisions: `PUT /api/issues/{id}/documents/adr`
- Screenshots: `POST /api/issues/{id}/attachments`

**Hard rules:**
- QA Engineer must sign off — "looks right" is not verification
- Tests must pass before AND after every task (clean baseline)
- No `any` in TypeScript, no skipped tests, no partial implementations
- Issue tree must stay in sync at all times
- A task is either Done or it's not — no partial credit

**Checkpoints are automatic.** After completing all tasks in a milestone, the Chief of Staff detects this in its heartbeat cycle and triggers:
1. Quality gate issues (Code Review by Architect, UX Review by UX Director for user-facing work)
2. Documentation gate issue assigned to CS Lead
3. The checkpoint runs (task audit, test suite, PRD alignment) and results are stored as an issue document on the milestone

**Documentation is generated at every checkpoint.** The CS Lead runs after tests pass, updating all project documentation from the actual codebase. The Architect generates technical documentation (architecture, API reference, decision log).

**When to stop and alert (the ONLY reasons):**
- Critical regression that can't be self-resolved
- Architectural decision that contradicts the PRD
- Acceptance criteria too ambiguous to determine "done"
- Security concern requiring a design decision

Escalation path: Full-Stack Engineer --> CTO --> Chief of Staff --> Eric (via Discord)

---

## Phase 5: CHECKPOINT

**Trigger:** Runs automatically after each milestone during BUILD (Chief of Staff heartbeat detects milestone completion). Can also be triggered manually.

**TeamClip pattern:** Chief of Staff auto-creates checkpoint issues: "Code Review: {milestone}" assigned to Architect, "UX Review: {milestone}" assigned to UX Director (if user-facing), "Documentation: {milestone}" assigned to CS Lead + Architect.

**What happens (same in both manual and automatic modes):**
1. Review what was built in this milestone vs. what was planned (compare issue tree)
2. Run the full test suite and report results
3. Check for:
   - PRD drift — are we still building what we said we'd build?
   - Scope creep — did we add things not in the issue tree?
   - Missing coverage — are there acceptance criteria we skipped?
   - Security — any new attack surfaces introduced?
4. **Documentation generation** — CS Lead updates user-facing docs, Architect updates technical docs
5. Log the **Checkpoint Report** as an issue document on the milestone:
   `PUT /api/issues/{milestone-id}/documents/checkpoint-report`

**Checkpoint report contents:**
- Milestone: [name] — COMPLETE / PARTIAL
- Tasks completed: X/Y
- Tests: passing/total
- PRD alignment: [on track / drifting — specifics]
- Issues found: [list with severity]
- New issues discovered: [created as new issues in the tree]
- Next milestone: [name and first task]

**Issue tree update:**
- All completed tasks confirmed done with timestamps
- New issues added to the tree from checkpoint findings
- Milestone marked complete
- Quality gate issues created as blocking issues for the next phase

**Automatic mode:** If no P0 issues remain, Chief of Staff advances to next milestone immediately.
**Manual mode:** Report findings and recommend next action.

---

## Phase 6: CLOSE

**Trigger:** Session is ending (shipped what you planned, or time/context is up).

**TeamClip pattern:** Update all issue statuses, attach handoff document to the active milestone.

**What happens:**
1. Update issue statuses for all items worked on (via `PATCH /api/issues/{id}`)
2. Update project configuration if architectural decisions changed
3. Note any new issues discovered (create as new issues in the tree)
4. Generate handoff document and store as issue document:
   `PUT /api/issues/{milestone-id}/documents/handoff`
   Includes:
   - Full operating instructions (agent roles, execution loop, verification)
   - Inline checkpoint and completion sweep instructions
   - All state (done list, test baseline, priority-ordered task table)
   - All brackets filled with real project values — no placeholders
5. Confirm issue tree is in sync

**Output:**
- Summary: what shipped today (one line per task)
- Test baseline: pass count
- Next session: phase, first task
- All state preserved in Paperclip issue documents (no standalone files needed)

---

## Documentation Generation

Documentation is a first-class output of the build process, not an afterthought. Documentation agents run at every milestone checkpoint, after tests pass but before advancing to the next milestone.

### Flow
```
All tasks done --> QA Engineer passes --> CS Lead + Architect run docs --> checkpoint log --> next milestone
```

### Standard docs (every project)

All documentation is stored as **issue documents** on the milestone issue, keyed by type:

| Document Key | Content | Owner |
|-------------|---------|-------|
| `architecture` | System design, components, data flows, tech stack | Architect |
| `api-reference` | All endpoints with request/response schemas | Architect |
| `database-schemas` | ERD, table definitions, enums, JSON schemas | Architect |
| `security` | Auth, authorization, data protection, attack surface | DevOps Engineer |
| `configuration` | All env vars, settings, defaults, failure modes | DevOps Engineer |
| `error-catalog` | Every error the system produces with resolution steps | QA Engineer |
| `runbook` | Operational procedures, common issues, diagnostics | DevOps Engineer |
| `deployment-guide` | Setup, deployment, rollback, security hardening | DevOps Engineer |
| `decision-log` | Architectural decisions with context and rationale | Architect |
| `end-user-docs` | Feature guides written for non-technical users | CS Lead |
| `uat-scripts` | Human-executable test scenarios from acceptance criteria | QA Engineer |
| `release-notes` | What shipped, written for stakeholders | CS Lead |

Store via: `PUT /api/issues/{milestone-id}/documents/{key}`

Binary artifacts (screenshots, diagrams, exported PDFs) stored as attachments: `POST /api/issues/{milestone-id}/attachments`

### Documentation rules
- **Incremental updates** per milestone — only touch sections that changed
- **Full regeneration** at the final milestone to catch drift
- Populate from actual code — read source files, config, models, routes
- Never guess or use placeholder data in generated docs
- UAT scripts transform acceptance criteria into step-by-step human test scripts
- Release notes auto-generate from done issues per milestone
- Decision log entries are **append-only** — never modify existing ADRs
- Skip doc types that don't apply to the project

---

## Task Tracking — The Backbone

**This is non-negotiable.** Every phase reads and updates the issue tree. Paperclip is the source of truth.

### Issue status flow
```
backlog --> todo --> in_progress --> done
                                --> blocked (with blocking issue reference)
                                --> cancelled (with reason in comment)
```

### When to update issues
| Event | Update |
|-------|--------|
| New task discovered | `POST /api/companies/{id}/issues` with parentId linking to milestone |
| Starting a task | `PATCH /api/issues/{id}` status --> "in_progress" |
| Task passes verification | `PATCH /api/issues/{id}` status --> "done" |
| Task blocked | `PATCH /api/issues/{id}` status --> "blocked", create blocking issue |
| Milestone complete | Chief of Staff heartbeat detects, creates gate issues |
| Session ending | Update all touched issue statuses |

### Issue documentation pattern
- Issue descriptions are summaries + context — enough to start work
- Full specs, requirements, and detailed content go in **issue documents** (keyed text via `PUT /api/issues/{id}/documents/{key}`)
- Binary files (screenshots, mockups, spreadsheets) go in **issue attachments** (`POST /api/issues/{id}/attachments`)
- Never put full specs in the description field — descriptions are for scanning, documents are for depth

---

## Tool Stack

These should be available to engineering agents:

| Tool | Agent | Purpose |
|------|-------|---------|
| **LSP (TypeScript)** | Full-Stack Engineer, Architect | Real-time type checking, go-to-definition |
| **LSP (Pyright)** | Full-Stack Engineer | Python type checking for backend work |
| **GitHub CLI** | Full-Stack Engineer, Architect, QA Engineer | PRs, code review, issues |
| **Atlassian MCP** | All agents | Jira issue management, Confluence docs |
| **Chrome DevTools** | UX Director, QA Engineer | Visual testing, responsive testing |
| **Firecrawl** | Architect | Research, competitive analysis |

---

## Context Management

### Resuming from a handoff
The handoff document is stored as an issue document on the active milestone. Read it via `GET /api/issues/{milestone-id}/documents/handoff`. This contains the full state needed to resume work.

### Starting fresh (no handoff exists)
Query the issue tree (`GET /api/companies/{id}/issues?projectId=...`) to auto-detect project state. Find the first incomplete milestone and proceed.

### Mid-session context overflow
The Chief of Staff heartbeat handles this — it detects stalled work and can re-assign or escalate. For agent-level context overflow, the agent writes remaining work to issue comments and closes its session.

---

## Quality Gates (Blocking Issues)

The Chief of Staff auto-creates these as blocking issues when milestones approach completion:

| Gate | Auto-Created When | Assigned To | Blocks |
|------|-------------------|-------------|--------|
| Code Review | Any code task reaches "done" | Architect | Merge/deploy |
| UX Review | Any issue tagged `user-facing` reaches "done" | UX Director | Parent issue's "shipped" status |
| QA Verification | Any implementation task reaches "done" | QA Engineer | Milestone completion |
| Documentation Gate | Any milestone with `user-facing` tag | CS Lead + Architect | Release |
| Deploy Gate | Milestone reaches 100% tasks done | DevOps Engineer | Production deploy |

---

## Cross-Team Handoffs

When an engineering milestone completes, the Chief of Staff heartbeat detects it and auto-creates:

1. **Issue: "Update marketing for {feature}"** --> assigned to CMO
   - Document `requirements`: feature list, screenshots, technical details
2. **Issue: "Write {feature} documentation"** --> assigned to CS Lead
   - Document `requirements`: feature spec, API docs, user flows
3. **Issue: "Review {feature} for compliance"** --> assigned to Legal Counsel
   - Document `requirements`: data handling changes, new user flows
4. **Issue: "UX review: {feature}"** --> assigned to UX Director
   - Document `requirements`: expected flows, edge cases to test

Full handoff context goes into **issue documents** (keyed text, revisioned, no character limit) rather than the description field.

---

## Anti-Patterns

- **PRD --> "go build it"** — Always decompose first. The decomposition IS the planning.
- **Building without an issue tree** — If the issues don't exist, you're freestyling. Stop and create them.
- **Disabling inline checkpoints** — Checkpoints are automatic for a reason. Don't override them.
- **Putting full specs in issue descriptions** — Descriptions are summaries. Full content goes in issue documents (`PUT /api/issues/{id}/documents/{key}`).
- **"It looks right" as verification** — QA Engineer runs the actual tests. Checks the actual acceptance criteria.
- **Letting the issue tree go stale** — If the issues are wrong, every decision built on them is wrong.
- **Massive sessions without close** — Always close. The handoff document is your future self's lifeline.
- **Standalone files instead of issue documents** — Deliverables belong on issues. Use keyed documents and attachments, not orphaned files.
- **Skipping quality gates** — The Chief of Staff creates them for a reason. "We're in a hurry" is not an exemption.

---

## Agent Summary

| Agent | Role in SDLC | Phases Active |
|-------|-------------|---------------|
| **Product Manager** | PRD authoring, decomposition, acceptance criteria, scope decisions | IDEATE, DECOMPOSE |
| **CTO** | Technical strategy, architecture oversight, task assignment to engineering | All phases (oversight) |
| **Architect** | System design, API design, architecture-level code review, technical docs | IDEATE (feasibility), BUILD (review), CHECKPOINT |
| **Full-Stack Engineer** | Frontend + backend implementation, the primary coder | SCAFFOLD, BUILD |
| **QA Engineer** | Testing, quality verification, bug reproduction, test reports | BUILD, CHECKPOINT |
| **DevOps Engineer** | CI/CD, infrastructure, security hardening, deploys | SCAFFOLD, BUILD, CHECKPOINT |
| **UX Director** | Visual QA, end-to-end UX flow review, accessibility audits (Gemini adapter) | BUILD (review), CHECKPOINT |
| **Design Lead** | Design tokens, component specs, brand review gate | IDEATE (design input), BUILD (spec reference) |
| **CS Lead** | User-facing documentation, release notes, help center updates | CHECKPOINT, CLOSE |
| **Chief of Staff** | Orchestration — detects milestone completion, creates handoffs, creates quality gates, escalates blockers | All phases (automated via heartbeat) |
