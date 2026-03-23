# Issue Template: Decomposition Milestone

## Overview

**Phase:** decompose
**Created by:** Product Manager
**Trigger:** Ideation milestone completes (PRD approved, feasibility confirmed)
**Output:** Prioritized, estimated backlog ready for build phase

## Issue Tree

```
Planning: {featureName}                              [Milestone — unassigned]
├── Create backlog: {featureName}                    [Task — Product Manager]
├── Technical breakdown: {featureName}               [Task — Architect]
└── Identify design requirements: {featureName}      [Task — Design Lead]
```

## Milestone Issue

| Field | Value |
|---|---|
| Title | `Planning: {featureName}` |
| Description | Decompose the approved PRD for {featureName} into milestones, tasks, and subtasks. Produce a prioritized backlog with effort estimates, assignees, and dependencies mapped. |
| Status | `backlog` |
| Priority | `high` |
| Tags | `phase:decompose`, `milestone` |
| Goal | Link to the product goal |
| Project | Link to the product project |
| Assignee | None |
| Document: `requirements` | Link or copy of the approved PRD from ideation |

## Child Tasks

### 1. Create Backlog

| Field | Value |
|---|---|
| Title | `Create backlog: {featureName}` |
| Description | Break the PRD into implementable tasks. For each task: clear title, description with enough context for the assigned agent to work independently, acceptance criteria (testable), size estimate (S/M/L/XL), suggested assignee, and dependencies on other tasks. Group tasks into logical milestones that can be shipped incrementally. Order milestones by dependency and value — ship the highest-value, lowest-dependency work first. |
| Tags | `phase:decompose`, `backlog` |
| Assignee | Product Manager |
| Document: `requirements` | Full backlog specification |

**Acceptance criteria:**
- Every task has a clear title, description, acceptance criteria, and size estimate
- Tasks are grouped into milestones with a logical shipping order
- Dependencies between tasks are explicitly mapped
- No task is larger than XL — XL tasks are broken down further
- Assignees are suggested for each task based on the org chart

### 2. Technical Breakdown

| Field | Value |
|---|---|
| Title | `Technical breakdown: {featureName}` |
| Description | Review the PM's backlog from an engineering perspective. For each task: (1) add technical subtasks where the PM's task is too high-level for direct implementation (database migrations, API endpoint creation, state management changes), (2) flag tasks that need architecture decisions before implementation can start, (3) assign complexity estimates from an engineering perspective (may differ from PM's sizing), (4) identify shared code or infrastructure that multiple tasks depend on and ensure it is scheduled first. |
| Tags | `phase:decompose`, `technical` |
| Assignee | Architect |

**Acceptance criteria:**
- All PM tasks reviewed with engineering commentary
- Technical subtasks added where needed
- Architecture decision points flagged
- Task dependency graph validated from a technical perspective
- Shared infrastructure tasks identified and front-loaded

### 3. Design Requirements Identification

| Field | Value |
|---|---|
| Title | `Identify design requirements: {featureName}` |
| Description | Review the backlog and identify which tasks require design work. For each design-dependent task: (1) specify the design deliverable needed (wireframe, mockup, component spec, design token update, icon, illustration), (2) list design constraints (existing component library, brand guidelines, accessibility requirements), (3) note which existing components can be reused vs. what needs to be created new, (4) estimate design effort per task. |
| Tags | `phase:decompose`, `design` |
| Assignee | Design Lead |
| Document: `design` | Design requirements specification |

**Acceptance criteria:**
- Every backlog task assessed for design needs (even if the answer is "none")
- Design deliverables specified with enough detail for execution
- Reuse opportunities identified to minimize new design work
- Design tasks can be parallelized with engineering tasks where possible
- No task marked "design-dependent" without a corresponding design deliverable specified

## Completion Criteria

The decomposition milestone is complete when:
1. Full backlog exists with all tasks specified, estimated, and assigned
2. Architect has validated the technical breakdown and added subtasks
3. Design Lead has identified all design requirements and mapped them to tasks
4. PM has reconciled all inputs and finalized the backlog order
5. No unresolved architecture decision points remain

## Next Step

When this milestone completes, the Chief of Staff detects it and triggers: **build-milestone** template, creating the implementation milestone with tasks pre-populated from the finalized backlog.
