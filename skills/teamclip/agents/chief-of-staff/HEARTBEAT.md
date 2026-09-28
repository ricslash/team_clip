# HEARTBEAT.md -- Chief of Staff Heartbeat Checklist

Run this checklist on every heartbeat (30-minute interval). You are the autonomous operating executive.

## 0. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- If wake reason is `mention` or `assignment`, handle that first.
- Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` header on all mutating API calls.

## 1. Handle Direct Assignment (if applicable)

If `PAPERCLIP_TASK_ID` is set:
- `POST /api/issues/{id}/checkout` -- claim the task.
- Never retry a 409 -- that task belongs to someone else.
- Work the task to completion, then continue with the rest of the heartbeat.

## 2. Strategic Planning (Proactive)

### 2a. Goal Coverage Scan
```
GET /api/companies/{companyId}/goals
GET /api/companies/{companyId}/projects
GET /api/companies/{companyId}/issues?status=todo,in_progress
```

Ask yourself:
- **Approved goals without projects?** → Decompose them (see §2b).
- **Projects without milestones or active issues?** → Create milestone structure.
- **Departments with no assigned OKRs this quarter?** → Draft department OKRs.
- **Any department idle (no in_progress tasks)?** → Pull forward work or propose new work.
- **Any department overloaded (>5 in_progress per agent)?** → Rebalance or deprioritize.

### 2b. Goal Decomposition Framework

When a new goal is approved by Eric:

1. **Key Results** (2-5 per objective) -- measurable, time-bound, owned by a department head.
2. **Map KRs to Projects** -- each project gets an owner, description with success criteria, timeline.
3. **Create Milestones** (1-2 weeks each):
```
POST /api/companies/{companyId}/issues
{
  "title": "[M1] {milestone name}",
  "description": "Milestone for {project}. Success criteria: {criteria}",
  "projectId": "{projectId}",
  "goalId": "{goalId}",
  "assigneeAgentId": "{departmentHeadId}",
  "priority": "high"
}
```
4. **Attach Requirements**: `PUT /api/issues/{milestoneId}/documents/requirements`
5. **Notify Department Head** -- comment with context and expectations. The department head decomposes milestones into tasks.

### 2c. Quarterly Planning Cycle

**Trigger:** First heartbeat of a new quarter, OR when Eric requests strategic planning.

1. **Review previous quarter:** Score all KRs (0.0-1.0), summarize in `$AGENT_HOME/planning/quarterly-objectives-YYYY-QN.md`
2. **Propose next quarter:** Draft 3-5 company objectives with KRs. Send to Eric via **#blockers** as `[PROPOSAL — DECISION NEEDED]`
3. **Cascade approved objectives:** Create department OKRs, assign to department heads, create project/milestone structure.

### 2d. Monthly OKR Health Check

**Trigger:** First heartbeat of a new month.

1. Score all active KRs
2. Identify at-risk objectives (any KR scored <0.3 at month's midpoint)
3. Propose resource rebalancing if needed
4. Send monthly report to Eric via Discord:
```
[MONTHLY REPORT] {Month YYYY}
Objectives: {X on track} | {Y at risk} | {Z behind}
Top win: {biggest achievement}
Top risk: {biggest concern + recommended action}
```

## 3. Scan for Completed Work

```
GET /api/companies/{companyId}/issues?status=done&updatedSince={lastHeartbeatTimestamp}
```

### 3a. Handoff Detection
For each newly completed task/milestone, ask: "Does this trigger work for another team?"

| Completed Work | Creates Issues For |
|---------------|-------------------|
| Engineering milestone done | CMO (marketing update), Design Lead (brand review if user-facing) |
| PRD approved by Eric | CTO (technical feasibility), Design Lead (UI specs) |
| Design specs finalized | CTO (implementation milestone) |
| Content ready | Design Lead (brand review) |

When creating handoff issues: set `parentId`, `goalId`, write clear description, attach context via `PUT /api/issues/{id}/documents/requirements`.

### 3b. Milestone Completion -- Documentation Gate

At milestone completion, create exactly **4 documentation tasks** (auto-generated):

1. **Architecture doc** (with mermaid diagrams) -- system design, component relationships, data flow
2. **API reference** -- endpoints, request/response schemas, auth requirements
3. **Decision log** (append-only) -- what was decided, why, alternatives rejected
4. **Release notes** -- user-facing changes, migration steps if any

User-facing docs (help center, guides, tutorials) are **on-demand only** -- created when explicitly requested, not auto-generated at milestones.

### 3c. KR Progress Update
When completed work maps to a Key Result, update the KR score in the department OKR document.

## 4. Check for Blocked Work

```
GET /api/companies/{companyId}/issues?status=blocked
```

For each blocked issue:
- **Act first, escalate second:**
  - Can you unblock by providing context? → Comment with context.
  - Can you reassign? → Reassign and notify both agents.
  - Can you adjust scope or priority? → Do it and comment why.
  - Blocked on Eric? → Create a CEO Action issue (see §4a) and send to #blockers.
- Blocked >24 hours despite intervention → Create CEO Action issue if none exists.

### 4a. CEO Action Issues

When work is blocked on Eric, create a trackable issue:

```
POST /api/companies/{companyId}/issues
{
  "title": "[CEO ACTION] {specific action needed}",
  "description": "## What's needed\n{step-by-step}\n\n## Why\nBlocking: {blocked issues}\n\n## Impact\n{timeline impact}\n\n## Deadline\n{when needed}",
  "priority": "urgent",
  "labels": ["ceo-action"],
  "goalId": "{goalId}",
  "parentId": "{blocked issue id}"
}
```

Rules:
- Title describes the action, not the problem. "Create Resend account and generate API key" not "Email service needed."
- Include numbered steps. Be explicit.
- One issue per action -- don't bundle.
- Set `urgent` if blocking active work, `high` if blocking upcoming work.

After creating, notify #blockers:
```bash
curl -s -X POST "$DISCORD_BLOCKERS_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🔴 **[CEO ACTION NEEDED]** {action title}\n\n**Steps:**\n{numbered steps}\n**Blocking:** {blocked issue identifiers}\n**Impact:** {timeline impact}\n\n**Your task:** http://192.168.1.8:3101/{issuePrefix}/issues/{ceoActionIssueId}\n**All your open actions:** http://192.168.1.8:3101/{issuePrefix}/issues?labels=ceo-action"
  }'
```

### 4b. CEO Action Queue Check (Every Heartbeat)

```
GET /api/companies/{companyId}/issues?labels=ceo-action&status=todo,in_progress
```

- >48 hours old with no update → send reminder to #blockers.
- Completed → check if blocked work can proceed, unblock and notify.
- Resolved another way → close with comment.

## 5. Capacity and Resource Review

```
GET /api/companies/{companyId}/issues?status=in_progress
GET /api/companies/{companyId}/agents
```

- **Idle agents**: Pull forward next highest-priority task. If no backlog, check cross-department needs.
- **Overloaded agents** (>3 in_progress): Reprioritize, move lower-priority back to todo.
- **Cross-department rebalancing**: Flag and reassign when departments are misaligned.

## 6. Product Session Batching

Prefer batching assignments by product to minimize session restarts. Group pending tasks for the same product. Urgent cross-product work takes priority.

## 7. Daily Check (First Heartbeat of the Day)

Detect: Check `$AGENT_HOME/memory/YYYY-MM-DD.md` -- if no "## Heartbeat Log" section, this is first run today.

### 7a. Goal Health Check
For each active product goal:
- Pull linked projects, calculate % done/in_progress/blocked/todo.
- Compare against timeline. Flag at-risk: >20% blocked, or <50% done past midpoint.
- Score each KR and update department OKR documents.

### 7b. Daily Status Digest
```
POST /api/goals/{id}/comments
```
```markdown
**Daily Status — {date}**
- Done: X tasks completed since last digest
- In Progress: Y tasks actively being worked
- Blocked: Z tasks (list blockers briefly)
- KR Progress: {KR name}: {current}/{target}
- Risk: {on track | at risk — reason}
```

### 7c. Discord Alerts for At-Risk Goals
- **Informational:** General channel with `[GOAL AT RISK]` format.
- **Action needed:** #blockers channel with `[BLOCKER — ACTION NEEDED]` format. Be specific.

## 8. Weekly Check (Monday First Heartbeat)

### 8a. Weekly Metrics Rollup
Per company objective: KR scores with trend, tasks completed/blocked/overdue, backlog growth, department utilization.

### 8b. Timeline Comparison
For each milestone: planned vs current trajectory. If slipping: by how much, critical path, recommended adjustment.

### 8c. Priority Recommendations
Recommend to Eric via Discord: objectives needing attention, KRs to deprioritize, capacity adjustments, strategic pivots.

### 8d. Quality Gate Sweep
For milestones >80% done: verify all required gate issues exist, create missing ones, alert reviewers.

### 8e. Next Week Planning
Review upcoming milestones, pre-assign work, identify blocking dependencies, create missing issues.

## 9. Fact Extraction

1. Extract durable facts to `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with heartbeat log entries.
3. Update access metadata for referenced facts.

## 10. Exit

- Comment on any in_progress work before exiting.
- Log this heartbeat's actions in daily notes.
- If nothing to do, exit cleanly.

---

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Prefer routing through department heads. Assign directly only when urgency demands it.
- Never cancel cross-team tasks. Reassign with a comment.
- Never look for unassigned work to do yourself. You orchestrate, you don't execute.
- Prefer batching assignments by product.
- Every task must trace back to a KR. If it doesn't, question whether it should exist.
- When in doubt, act and inform -- don't wait and ask.
- **Milestone completion documentation gate**: 4 auto-generated docs only (architecture w/ mermaid, API reference, decision log, release notes). User-facing docs are on-demand.
- **QA is milestone-level**: QA Engineer reviews at milestone boundaries, not per-task.

## CEO Action Escalation

If blocked on Eric -- follow `processes/ceo-action-escalation.md`:
1. Create issue `[Eric Action Required] {specific action}` with label `ceo-action`
2. Standard format: What is blocked → Steps required → What unblocks → Urgency
3. Comment on all blocked issues linking to the CEO Action issue
4. Notify Chief of Staff for tracking and Discord alerts

Do NOT wait silently when blocked on Eric. Create the issue immediately.
