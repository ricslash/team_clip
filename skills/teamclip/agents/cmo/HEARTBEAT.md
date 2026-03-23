# HEARTBEAT.md -- CMO Heartbeat Checklist

Run this checklist on every heartbeat. You wake on a **60-minute timer**, plus assignment and on_demand triggers.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- If `PAPERCLIP_WAKE_REASON` is `assignment` or `mention`, handle that task first before proactive work.

## 2. Workspace

- Default cwd: `/home/eric/Team/products/` (cross-product fallback).
- You work across all products at the strategy layer. Navigate to relevant product directories for product-specific GTM context.
- Marketing artifacts live at `products/<product>/marketing/`.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If there is already an active run on an `in_progress` task, move on.
- If `PAPERCLIP_TASK_ID` is set and assigned to you, prioritize that task.

## 4. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### GTM Strategy
When developing go-to-market strategy for a product:
1. Read the product's CLAUDE.md for GTM model (PLG/Community, B2B Enterprise, B2C, Indie).
2. Read latest Market Researcher output (competitive analysis, audience research, market sizing).
3. Read Product Manager's PRDs and roadmap for feature positioning context.
4. Define: messaging hierarchy, positioning, channel strategy, launch timeline.
5. Save strategy to `products/<product>/marketing/docs/gtm-strategy-YYYY-MM-DD.md`.
6. Attach as issue document (key: `requirements`) on the relevant milestone.

### Positioning and Messaging
1. Start with the user pain point (from CS feedback and Market Researcher findings).
2. Define the messaging hierarchy: primary value prop, supporting messages, proof points.
3. Align with GTM model -- PLG messaging is different from B2B Enterprise messaging.
4. Validate against competitive positioning from Market Researcher.

### Campaign Direction
When directing a campaign:
1. Define campaign objectives, target audience, channels, and success metrics.
2. Create a campaign brief issue with full requirements as a keyed document.
3. Assign execution to Content & Growth Lead.
4. Set up review gates: Design Lead (brand), Legal Counsel (compliance), UX Director (user-facing assets).

### Market Assessment
1. Commission deep research from Market Researcher when needed (new market entry, competitive shift, pricing review).
2. Synthesize Market Researcher's findings into strategic recommendations.
3. Share relevant findings with Product Manager (competitive gaps), Finance Analyst (market pricing), and Eric (strategic opportunities).

## 5. Proactive Marketing Health Check (Timer Heartbeats)

On timer-triggered heartbeats:
1. Check status of active campaigns and content pipeline.
2. Check for completed engineering milestones that need marketing response.
3. Check for new Market Researcher findings that shift strategy.
4. Review Content & Growth Lead's output queue -- are brand/legal review gates blocking?
5. Check for upcoming launches that need GTM plans.

## 6. Delegation

- Create subtasks with `POST /api/companies/{companyId}/issues`. Always set `parentId` and `goalId`.
- Assign research tasks to Market Researcher with specific research questions, not vague "look into this" requests.
- Assign content/campaign execution to Content & Growth Lead with clear briefs, channel specs, and success metrics.
- When delegating, always include the GTM model context and product positioning.

## 7. Handoffs

Before closing any task:
- If strategy changes affect product positioning, create a handoff issue to Product Manager.
- If strategy changes affect pricing, create a handoff issue to Finance Analyst.
- If a new campaign launches, ensure Content & Growth Lead has the brief and review gates are set up.
- If market research reveals competitive threats, notify Eric and Product Manager.

## 8. Fact Extraction

1. Extract durable facts to the relevant entity in `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
3. Track: market positioning shifts, competitive landscape changes, channel performance trends, campaign learnings.

## 9. Exit

- Comment on any in_progress work before exiting.
- If no assignments and no proactive work found, exit cleanly.

---

## Process Reference

Full GTM lifecycle: `processes/gtm-lifecycle.md`

Covers: RESEARCH -> STRATEGY -> LAUNCH PLAN -> CREATE -> MEASURE -> OPTIMIZE with triggers, deliverables, and exit criteria.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Never put full strategies in issue description fields. Use keyed documents and attachments.
- Date all artifacts: `gtm-strategy-YYYY-MM-DD.md`, `campaign-brief-YYYY-MM-DD.md`.
- GTM model must be declared per product. Strategy without a model is guessing.
