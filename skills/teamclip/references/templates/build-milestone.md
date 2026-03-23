# Issue Template: Build Milestone

## Overview

**Phase:** build
**Created by:** CTO
**Trigger:** Decomposition milestone completes (backlog finalized, architecture approved)
**Output:** Feature implemented, tested, reviewed, and deploy-ready

## Issue Tree

```
Build: {featureName}                                 [Milestone — unassigned]
├── Implement: {featureName}                         [Task — Full-Stack Engineer]
│   ├── {Subtask from backlog}                       [Subtask — Full-Stack Engineer]
│   ├── {Subtask from backlog}                       [Subtask — Full-Stack Engineer]
│   └── ...
├── Write tests: {featureName}                       [Task — QA Engineer]
├── Code review: {featureName}                       [Task — Architect]
├── UX review: {featureName}                         [Task — UX Director]
└── Deploy preparation: {featureName}                [Task — DevOps Engineer]
```

## Milestone Issue

| Field | Value |
|---|---|
| Title | `Build: {featureName}` |
| Description | Implement {featureName} per the approved backlog from the planning milestone. All code reviewed, tests passing, UX validated, and deploy-ready. |
| Status | `backlog` |
| Priority | `high` |
| Tags | `phase:build`, `milestone`, `code`, `user-facing` |
| Goal | Link to the product goal |
| Project | Link to the product project |
| Assignee | None |
| Document: `requirements` | Copy or link to the finalized backlog from decomposition |

## Child Tasks

### 1. Implementation

| Field | Value |
|---|---|
| Title | `Implement: {featureName}` |
| Description | Build the feature per the technical breakdown and PRD. Follow the product's CLAUDE.md conventions. Create PRs with descriptive titles and linked issue keys. Conventions: no `any` types in TypeScript, strict mode enabled, no skipped tests. Self-decompose into subtasks for each logical unit of work (one PR per subtask is ideal). |
| Tags | `phase:build`, `code`, `implementation` |
| Assignee | Full-Stack Engineer |
| Document: `requirements` | Implementation notes, API contracts, database schema changes |

**Acceptance criteria:**
- All PRD acceptance criteria met
- Code compiles with zero warnings
- No `any` types in TypeScript
- PR descriptions reference the issue key
- Each PR is a reviewable unit (not a monolith)

**Subtasks:** The Full-Stack Engineer creates subtasks during execution, one per logical unit of work. Typical subtask structure:
- Database schema / migrations
- API endpoints (one per resource or domain)
- Frontend components (one per page or major component)
- Integration wiring (connecting frontend to API)
- Edge case handling and error states

### 2. Write Tests

| Field | Value |
|---|---|
| Title | `Write tests: {featureName}` |
| Description | Write comprehensive tests per the test plan. Coverage targets: unit tests for all business logic functions, integration tests for API endpoints, e2e tests for critical user flows. Test edge cases: empty states, error states, boundary values, concurrent operations, permission boundaries. No skipped or disabled tests in the final PR. |
| Tags | `phase:build`, `code`, `testing` |
| Assignee | QA Engineer |
| Document: `test-plan` | Test strategy, test cases, coverage requirements |

**Acceptance criteria:**
- Unit tests cover all business logic with >80% line coverage
- Integration tests cover all API endpoints (happy path + error cases)
- E2e tests cover critical user flows identified in the PRD
- All tests pass in CI
- No skipped or disabled tests
- Edge cases documented and tested: empty state, max input, invalid input, unauthorized access

### 3. Code Review

| Field | Value |
|---|---|
| Title | `Code review: {featureName}` |
| Description | Review all PRs for this feature. Check: architecture compliance (does the implementation match the approved design?), code quality (clean abstractions, proper error handling, no premature optimization), security (OWASP Top 10, input validation, auth checks), conventions (TypeScript strict mode, no `any`, project CLAUDE.md rules), test quality (meaningful assertions, not just coverage padding). |
| Tags | `phase:build`, `code`, `review` |
| Assignee | Architect |

**Acceptance criteria:**
- Every PR reviewed with written feedback
- No unresolved review comments at merge time
- Architecture compliance verified
- Security review checklist completed
- All TypeScript strict mode violations flagged

### 4. UX Review

| Field | Value |
|---|---|
| Title | `UX review: {featureName}` |
| Description | Review the built feature end-to-end from a user's perspective. Take screenshots of every state: default, loading, empty, error, success, edge cases. Verify: visual consistency with design specs, responsive behavior (mobile, tablet, desktop), accessibility (keyboard navigation, screen reader, contrast ratios, focus indicators), loading performance (perceived and actual), error messaging (clear, actionable, non-technical). |
| Tags | `phase:build`, `user-facing`, `review` |
| Assignee | UX Director |

**Acceptance criteria:**
- Screenshots attached for all major states (default, empty, error, loading, success)
- Responsive behavior verified at 3 breakpoints minimum
- Accessibility audit: keyboard navigable, screen reader compatible, WCAG 2.1 AA contrast
- No UX regressions in existing flows
- Issues filed for anything that does not meet the quality bar (even if not blocking)

### 5. Deploy Preparation

| Field | Value |
|---|---|
| Title | `Deploy preparation: {featureName}` |
| Description | Prepare for production deployment. Verify: all environment variables configured in production, database migrations tested against production-like data, monitoring and alerting in place for new endpoints/features, rollback procedure documented and tested (how to revert if something breaks), staging environment tested end-to-end by QA, no known P0/P1 bugs in the deployment scope. |
| Tags | `phase:build`, `deploy` |
| Assignee | DevOps Engineer |

**Acceptance criteria:**
- Environment variables verified in production config
- Migrations tested against production-like data volume
- Monitoring dashboards updated for new features
- Alerting rules configured for new error conditions
- Rollback procedure written and tested
- Staging sign-off from QA

## Quality Gates Triggered

When this milestone reaches `done`, the Chief of Staff auto-creates:

| Gate | Assigned To | Blocks |
|---|---|---|
| Code review gate | Architect | Merge to main |
| UX review gate | UX Director | Production deploy |
| Deploy gate | DevOps Engineer | Production deploy |
| Documentation gate | CS Lead + Architect | Release announcement |

## Completion Criteria

The build milestone is complete when:
1. All implementation subtasks are done and PRs merged
2. All tests pass in CI with required coverage
3. Code review approved with no unresolved comments
4. UX review passed with no blocking issues
5. Deploy preparation complete with staging sign-off
6. All quality gates created and assigned

## Next Step

When this milestone completes, the Chief of Staff detects it and creates cross-team handoff issues:
- Marketing: "Update marketing for {featureName}" assigned to CMO
- CS: "Write documentation for {featureName}" assigned to CS Lead
- Legal: "Review {featureName} for compliance" assigned to Legal Counsel (if tagged `data-handling` or `public-facing`)
