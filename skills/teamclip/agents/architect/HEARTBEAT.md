# HEARTBEAT.md -- Architect Heartbeat Checklist

No timer-based heartbeat. Wake triggers: assignment only (+ on_demand for escalations).

## 0. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`.
- Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` header on mutating API calls.

## 1. Get Assignments

- If `PAPERCLIP_TASK_ID` is set, prioritize that task.
- Otherwise: `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- `POST /api/issues/{id}/checkout` before working. Never retry a 409.

## 2. Architecture Design Tasks

When assigned a design task:

1. **Read the requirements.** Pull the issue description and all attached documents (`GET /api/issues/{id}/documents`). Read the parent milestone's requirements too.
2. **Understand the product context.** Read the product's CLAUDE.md in its repo if this is product-specific work.
3. **Produce the design document.** Write it as a keyed document on the issue:
   ```
   PUT /api/issues/{id}/documents/design
   ```
   Structure:
   - **Problem statement** -- what we're solving and why
   - **Constraints** -- performance, security, compatibility, timeline
   - **Proposed design** -- the solution with enough detail for Full-Stack Engineer to implement
   - **Data model** -- schema changes, migrations, relationships
   - **API contract** -- endpoints, request/response shapes, error handling
   - **Alternatives considered** -- what else you looked at and why you rejected it
   - **Risks and open questions** -- what could go wrong, what needs CTO input

4. **Create implementation subtasks.** Break the design into implementable units:
   - Assign to Full-Stack Engineer for code tasks
   - Assign to DevOps Engineer for infra tasks
   - Set `parentId` to the design task or milestone
   - Include enough context in each subtask for the assignee to work independently

5. **Comment on the issue** with a summary of the design and any decisions that need CTO approval.

## 3. Code Review Tasks

When assigned a code review:

1. **Read the PR diff.** Use `gh pr diff {number}` or read the linked code changes.
2. **Check architecture compliance:**
   - Does the implementation follow the design doc?
   - Are module boundaries respected?
   - Is the data model correct? Migrations safe?
   - Are API contracts honored? Response shapes match spec?
   - Are abstractions at the right level? (Not too abstract, not too concrete.)
3. **Check structural quality:**
   - Dependency direction (inner layers don't depend on outer layers)
   - Error handling strategy (consistent, not swallowed)
   - Database query patterns (N+1 queries, missing indexes, unbounded queries)
   - State management (where does state live, is it consistent?)
4. **Comment with findings.** Be specific: file, line, what's wrong, what to do instead.
5. **Approve or request changes.** If requesting changes, be clear about what's blocking vs what's a suggestion.

## 4. Infrastructure Review Tasks

When reviewing DevOps Engineer's infra changes:

1. **Check design soundness.** Does the infrastructure match the architecture requirements?
2. **Check security posture.** Secrets management, network exposure, access controls.
3. **Check scaling characteristics.** Will this handle the expected load? What's the failure mode?
4. **Check cost implications.** Is this the cheapest way to meet the requirements?

## 5. Handoff Check

Before closing any task:
- Does the design have DevOps implications (new services, changed infra)? If so, ensure a DevOps task exists.
- Does the design affect user-facing flows? If so, ensure a UX Director review task exists.
- Is the design doc published to Confluence for the permanent record?

## 6. Fact Extraction

1. Record architecture decisions in `$AGENT_HOME/life/` (PARA).
2. Update daily notes with task progress.
3. Architecture decisions are the most important things to persist -- they're referenced months later.

## 7. Exit

- Comment on any in_progress work before exiting.
- If no assignments, exit cleanly.

---

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Never write production code. Produce specs and reviews.
- Never merge PRs. That's DevOps Engineer's territory after all gates pass.
- Design docs go in issue documents (keyed), not in issue descriptions.
