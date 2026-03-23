# Issue Template: Ideation Milestone

## Overview

**Phase:** ideate
**Created by:** Product Manager
**Trigger:** CEO or PM identifies a new feature or product idea to validate
**Output:** Approved PRD with feasibility assessment, ready for decomposition

## Issue Tree

```
Ideation: {featureName}                          [Milestone — unassigned]
├── Write PRD: {featureName}                     [Task — Product Manager]
├── Technical feasibility: {featureName}         [Task — Architect]
├── Architecture review: {featureName}           [Task — CTO]
└── Competitive analysis: {featureName}          [Task — Market Researcher]
```

## Milestone Issue

| Field | Value |
|---|---|
| Title | `Ideation: {featureName}` |
| Description | Validate the idea for {featureName}. Produce a technical PRD, assess feasibility, and get architecture sign-off before moving to decomposition. |
| Status | `backlog` |
| Priority | `high` |
| Tags | `phase:ideate`, `milestone` |
| Goal | Link to the product goal this feature serves |
| Project | Link to the product project |
| Assignee | None (owned by PM, tracked at milestone level) |
| Document: `requirements` | Idea brief with: problem statement, target users, proposed solution, success criteria, constraints |

## Child Tasks

### 1. Write PRD

| Field | Value |
|---|---|
| Title | `Write PRD: {featureName}` |
| Description | Draft a complete Product Requirements Document covering: user stories with acceptance criteria, scope boundaries (what is explicitly out of scope), success metrics (quantified), dependencies on other features or teams, and timeline constraints. Store the full PRD in the `requirements` document — descriptions are summaries only. |
| Tags | `phase:ideate`, `prd` |
| Assignee | Product Manager |
| Document: `requirements` | Full PRD text |

**Acceptance criteria:**
- User stories have testable acceptance criteria
- Scope boundaries are explicitly stated
- Success metrics are quantified and measurable
- Dependencies identified and flagged to relevant teams
- Timeline includes milestones with estimated dates

### 2. Technical Feasibility

| Field | Value |
|---|---|
| Title | `Technical feasibility: {featureName}` |
| Description | Assess technical feasibility against the current architecture. Deliverables: (1) required stack changes or new dependencies, (2) estimated complexity on S/M/L/XL scale with justification, (3) technical risks and unknowns with proposed mitigations, (4) dependencies on existing systems or infrastructure, (5) estimated engineering effort in person-days. |
| Tags | `phase:ideate`, `technical` |
| Assignee | Architect |
| Document: `requirements` | Feasibility assessment text |

**Acceptance criteria:**
- Complexity estimate provided with justification
- All technical risks identified with severity and mitigation
- External dependencies listed with availability status
- Effort estimate provided as a range (optimistic/pessimistic)

### 3. Architecture Review

| Field | Value |
|---|---|
| Title | `Architecture review: {featureName}` |
| Description | Review the PRD and feasibility assessment. Approve, request changes, or flag blockers. Evaluate: does this feature fit the existing system architecture? Does it introduce unnecessary complexity? Are there simpler alternatives? Will it scale with the product? |
| Tags | `phase:ideate`, `review`, `code` |
| Assignee | CTO |

**Acceptance criteria:**
- Written verdict: approved, approved with conditions, or rejected with rationale
- If approved with conditions: specific conditions listed
- If rejected: alternative approach suggested

### 4. Competitive Analysis

| Field | Value |
|---|---|
| Title | `Competitive analysis: {featureName}` |
| Description | Research how competitors implement similar functionality. Identify: which competitors have this feature, how they implement it (UX and technical approach if visible), what users say about competitor implementations (likes and dislikes), differentiation opportunities for our implementation. Use the web-research skill. |
| Tags | `phase:ideate`, `research` |
| Assignee | Market Researcher |
| Document: `research` | Competitive analysis report |

**Acceptance criteria:**
- Minimum 5 competitors analyzed
- Each competitor entry includes: feature presence (yes/no/partial), UX approach, user sentiment
- Differentiation opportunities identified with evidence
- At least 3 direct user quotes from review sites or forums

## Completion Criteria

The ideation milestone is complete when:
1. PRD is written and stored in the `requirements` document
2. Technical feasibility is assessed — no blocking technical risks identified (or mitigations approved)
3. CTO has approved the architecture approach
4. Competitive analysis is complete and informs the PRD
5. PM has updated the PRD based on all inputs

## Next Step

When this milestone completes, the Chief of Staff detects it and triggers: **decompose-milestone** template for the same feature, with the ideation milestone linked as context.
