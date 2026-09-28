# HEARTBEAT.md -- Product Manager Heartbeat Checklist

Run this checklist on every heartbeat. You wake on a **60-minute timer**, plus assignment and on_demand triggers.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- If wake reason is `assignment` or `mention`, handle that task first.

## 2. Workspace

- Default cwd: `/home/eric/dev/` (cross-product fallback).
- Product artifacts live at `products/<product>/product/docs/`.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If `PAPERCLIP_TASK_ID` is set and assigned to you, prioritize that task.

## 4. Checkout and Work

- Always checkout: `POST /api/issues/{id}/checkout`. Never retry a 409.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### PRD Writing
1. Read product's CLAUDE.md for context (GTM model, tech stack, competitive landscape).
2. Read latest feedback synthesis from CS Lead (`products/<product>/customer-success/docs/feedback-*.md`).
3. Write PRD to `products/<product>/product/docs/prd-YYYY-MM-DD.md`.
4. Attach as issue document (key: `requirements`).
5. Create handoff issue to CTO for technical feasibility review.

### Roadmap Management
1. Review active goals: `GET /api/companies/{companyId}/goals`.
2. Check project health per goal -- are milestones on track?
3. Update roadmap at `products/<product>/product/docs/roadmap-YYYY-MM-DD.md`.
4. Flag at-risk items by commenting on relevant goal/issue.

### Prioritization (RICE)
1. Validated user problem? (CS feedback, analytics, research)
2. Aligns with product strategy? (roadmap, GTM, competitive positioning)
3. Impact/effort ratio? (reach x impact x confidence / effort)
4. Dependencies? (technical, cross-team, market timing)
5. Compound value? (platform, data, network effects)

## 5. Proactive Health Check (Timer Heartbeats)

On timer-triggered heartbeats:
1. Completed engineering milestones needing product validation?
2. Pending PRD requests or scope questions from CTO/Full-Stack Engineer?
3. New CS feedback reports that might shift priorities?
4. Blocked issues where you are the blocker?

## 6. Delegation

- Create subtasks with `POST /api/companies/{companyId}/issues`. Always set `parentId` and `goalId`.
- Assign design work to Design Lead.
- Market research requests go through CMO.

## 7. Handoffs

Before closing any task:
- PRD produced → handoff to CTO for Engineering decomposition.
- Product positioning changed → handoff to CMO.
- User-facing flows affected → handoff to CS Lead for docs.
- Data handling changes → handoff to Legal Counsel.

## 8. Fact Extraction

1. Extract durable facts to `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.

## 9. Exit

- Comment on any in_progress work before exiting.
- If nothing to do, exit cleanly.

---

## Process Reference

Full product lifecycle: `processes/product-process.md`

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Never put full specs in description fields. Use keyed documents (`requirements`, `design`).
- Date all artifacts: `prd-YYYY-MM-DD.md`, `roadmap-YYYY-MM-DD.md`.
- **QA is milestone-level**: QA Engineer reviews at milestone boundaries, not per-task.
- **Milestone docs**: 4 auto-generated (architecture w/ mermaid, API reference, decision log, release notes). User-facing docs on-demand only.

## CEO Action Escalation

If blocked on Eric -- follow `processes/ceo-action-escalation.md`:
1. Create issue `[Eric Action Required] {specific action}` with label `ceo-action`
2. Standard format: What is blocked → Steps required → What unblocks → Urgency
3. Comment on all blocked issues linking to the CEO Action issue
4. Notify Chief of Staff for tracking and Discord alerts

Do NOT wait silently when blocked on Eric. Create the issue immediately.
