# Quality Gate: Code Review

## Gate Metadata

| Field | Value |
|---|---|
| Gate Name | Code Review |
| Assigned To | Architect |
| Trigger | Any issue tagged `code` reaches status `done` |
| Blocks | Merge to main branch and production deploy |

## When This Gate Is Created

The Chief of Staff auto-creates this gate issue during its heartbeat when it detects an issue with the `code` tag has moved to `done`. This covers all code changes — features, bug fixes, refactors, infrastructure code, test additions.

Common triggers:
- Feature implementation complete (Full-Stack Engineer)
- Bug fix complete (Full-Stack Engineer or QA Engineer)
- Infrastructure change complete (DevOps Engineer)
- Database migration created (Full-Stack Engineer or Architect)

## API Call to Create

```
POST /api/companies/{companyId}/issues
{
  "title": "Code review: {triggeringIssueTitle}",
  "description": "Architecture-level code review of {triggeringIssueTitle}. Review PRs for architecture compliance, security, and code quality. PR(s): {prUrls}. Linked issue: {triggeringIssueKey}.",
  "status": "backlog",
  "priority": "high",
  "tags": ["gate:code-review", "review", "code"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{milestoneId}",
  "assigneeAgentId": "{architectId}"
}
```

## Checklist

### Architecture Compliance
- [ ] **Design adherence:** Implementation matches the approved architecture design (if one exists for this feature)
- [ ] **Separation of concerns:** Business logic, data access, and presentation layers are properly separated
- [ ] **API design:** Endpoints follow REST conventions, request/response schemas are consistent with existing API patterns
- [ ] **Data model:** Database schema changes are sound, migrations are reversible where possible, indexes are appropriate
- [ ] **No unnecessary complexity:** No over-engineering — the solution is proportionate to the problem

### Code Quality
- [ ] **TypeScript strict mode:** No `any` types. All types are explicit or correctly inferred. Strict mode enabled.
- [ ] **Error handling:** All error paths handled explicitly. No swallowed errors. User-facing errors are clear and actionable.
- [ ] **Clean abstractions:** Functions do one thing. Naming is clear. No god objects or 500-line functions.
- [ ] **No dead code:** No commented-out code, unused imports, or orphaned functions
- [ ] **Conventions:** Code follows the product's CLAUDE.md conventions (formatting, naming, file organization)

### Security (OWASP Top 10)
- [ ] **Injection:** All user input is validated and sanitized. Parameterized queries for database access.
- [ ] **Authentication:** Auth checks present on all protected endpoints. No hardcoded credentials.
- [ ] **Authorization:** Permission checks enforce proper access control. Users cannot access other users' data.
- [ ] **Data exposure:** API responses do not leak sensitive fields (passwords, tokens, internal IDs unnecessarily)
- [ ] **Input validation:** All inputs validated for type, length, range, and format. Reject unexpected input.

### Testing
- [ ] **Tests pass:** All existing and new tests pass in CI
- [ ] **No skipped tests:** No `test.skip`, `xit`, `xdescribe`, or `@Ignore` in the final PR
- [ ] **Meaningful assertions:** Tests assert meaningful outcomes, not just that code runs without throwing
- [ ] **Edge cases:** Tests cover boundary conditions, empty inputs, invalid inputs, and concurrent operations where applicable

### PR Quality
- [ ] **PR size:** Each PR is a reviewable unit — ideally under 400 lines of functional change
- [ ] **PR description:** Describes what changed and why, links to the issue key
- [ ] **Commits:** Commit messages are descriptive. No "fix", "update", or "wip" as the entire message.
- [ ] **No unrelated changes:** PR does not bundle unrelated changes (formatting fixes, refactors, feature additions in one PR)

## Pass Criteria

All checklist items pass. The Architect posts: "Code review: APPROVED" and approves the PR(s) on GitHub. The issue moves to a state where it can proceed to the deploy gate.

## Fail Criteria

Any item fails. The Architect posts: "Code review: CHANGES REQUIRED" with:
- Specific file and line references
- What is wrong and why it matters
- Suggested fix (not just "this is wrong" — provide direction)
- Severity: `blocking` (must fix before merge) or `nit` (optional improvement)

The Full-Stack Engineer addresses all blocking items and requests re-review. Nits can be addressed in a follow-up PR if agreed upon.

## Escalation

If the Full-Stack Engineer disagrees with a review finding, the CTO makes the final call. The CTO considers both code quality and shipping velocity — but security and correctness issues are non-negotiable.
