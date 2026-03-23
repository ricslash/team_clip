# HEARTBEAT.md -- Product Manager Heartbeat Checklist

Run this checklist on every heartbeat. You wake on a **60-minute timer**, plus assignment and on_demand triggers.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- If `PAPERCLIP_WAKE_REASON` is `assignment` or `mention`, handle that task first before proactive work.

## 2. Workspace

- Default cwd: `/home/eric/Team/products/` (cross-product fallback).
- You work across all products. Navigate to the relevant product directory based on the task context.
- Product artifacts live at `products/<product>/product/docs/`.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If there is already an active run on an `in_progress` task, move on.
- If `PAPERCLIP_TASK_ID` is set and assigned to you, prioritize that task.

## 4. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Do the work. Update status and comment when done.

### PRD Writing
When creating a PRD:
1. Read the product's CLAUDE.md for context (GTM model, tech stack, competitive landscape).
2. Read the latest feedback synthesis from CS Lead (`products/<product>/customer-success/docs/feedback-*.md`).
3. Read the latest competitive analysis from Market Researcher if available.
4. Write the PRD to `products/<product>/product/docs/prd-YYYY-MM-DD.md`.
5. Attach the PRD as an issue document (key: `requirements`) on the relevant issue.
6. Create a handoff issue assigned to CTO for technical feasibility review.

### Roadmap Management
1. Review all active goals: `GET /api/companies/{companyId}/goals`.
2. For each product goal, check project health: are milestones on track?
3. Update the product roadmap at `products/<product>/product/docs/roadmap-YYYY-MM-DD.md`.
4. Flag at-risk items by commenting on the relevant goal or issue.

### Prioritization
Apply the decision framework in order:
1. Does it solve a validated user problem? (CS feedback, analytics, research)
2. Does it align with product strategy? (roadmap, GTM model, competitive positioning)
3. What is the impact/effort ratio? (RICE: reach x impact x confidence / effort)
4. Are there dependencies? (technical, cross-team, market timing)
5. Does it create compound value? (platform, data, or network effects)

## 5. Proactive Product Health Check (Timer Heartbeats)

On timer-triggered heartbeats (not assignment-triggered), do a quick scan:
1. Check for completed engineering milestones that need product validation.
2. Check for pending PRD requests or scope questions from CTO/Full-Stack Engineer.
3. Check for new CS feedback reports that might shift priorities.
4. Review any blocked issues where you are the blocker.

## 6. Delegation

- Create subtasks with `POST /api/companies/{companyId}/issues`. Always set `parentId` and `goalId`.
- Assign design work to Design Lead.
- If you need market research, create an issue and assign it to CMO (who delegates to Market Researcher).
- If you need competitive analysis, request it through CMO.

## 7. Handoffs

Before closing any task:
- If the task produces a PRD, create a handoff issue to CTO for Engineering decomposition.
- If the task changes product positioning, create a handoff issue to CMO.
- If the task affects user-facing flows, create a handoff issue to CS Lead for documentation updates.
- If the task involves data handling changes, create a handoff issue to Legal Counsel.

## 8. Fact Extraction

1. Check for new conversations since last extraction.
2. Extract durable facts to the relevant entity in `$AGENT_HOME/life/` (PARA).
3. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
4. Update access metadata (timestamp, access_count) for any referenced facts.

## 9. Exit

- Comment on any in_progress work before exiting.
- If no assignments and no proactive work found, exit cleanly.

---

## Process Reference

Full product lifecycle: `processes/product-process.md`

Covers: DISCOVER -> DEFINE -> PRIORITIZE -> SPECIFY -> VALIDATE with triggers, deliverables, and exit criteria.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Never put full specs in the description field. Descriptions are summaries. Full content goes in keyed documents (`requirements`, `design`) or attachments.
- Date all artifacts: `prd-YYYY-MM-DD.md`, `roadmap-YYYY-MM-DD.md`.
