# HEARTBEAT.md -- Design Lead Heartbeat Checklist

Run this checklist on every heartbeat. You wake on **assignment + on_demand** triggers only (no timer).

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- If wake reason is `assignment`, work that task first.
- If wake reason is `on_demand`, check what is being requested.

## 2. Workspace

- Default cwd: `/home/eric/dev/` (cross-product fallback).
- Design artifacts: `products/<product>/design/`
- Brand guidelines: `products/<product>/design/brand-guidelines-visual.md` and `brand-guidelines-copy.md`
- Design tokens: `products/<product>/design/tokens/`
- Mockups: `products/<product>/design/mockups/`
- Components: `products/<product>/design/components/`

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.

## 4. Checkout and Work

- Always checkout: `POST /api/issues/{id}/checkout`. Never retry a 409.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### Brand Build Pipeline
1. Read product's CLAUDE.md, existing brand guidelines, and baseline tokens.
2. Create 3 design directions, each with a complete token set in `products/<product>/design/tokens/option-{1,2,3}/`.
3. Build 4 mockup pages per option (homepage, product, login, dashboard) using `frontend-design` -- 12 pages total.
4. All mockups use `var()` token references exclusively. No hardcoded values.
5. Present options with rationale. After CEO selection, promote chosen tokens.

### Design System Work
1. Component specs in `products/<product>/design/components/`.
2. Include CSS values, interaction states, responsive breakpoints, accessibility requirements.
3. All components reference tokens, never raw values.

### Brand Review Gate
1. Read the asset and product's brand guidelines (visual + copy).
2. Check: color, typography, spacing, imagery, voice/tone, logo usage.
3. Check accessibility: contrast (4.5:1 normal, 3:1 large), touch targets (44x44px min), font sizes (16px min body).
4. **Approved**: Comment with approval and minor suggestions.
5. **Rejected**: Specific violations, guideline reference, concrete fix instructions.

### Motion Specs
Define animations: duration, easing, trigger, CSS/JS implementation. Respect `prefers-reduced-motion`.

## 5. Handoffs

Before closing any task:
- Updated design tokens → handoff to Full-Stack Engineer.
- Updated brand guidelines → handoff to Content & Growth Lead and CS Lead.
- Created component specs → handoff to Full-Stack Engineer.
- Attach all relevant assets to handoff issues.

## 6. Quality Checks Before Closing

- Tokens documented (name, value, usage, rationale).
- Mockups render correctly with token references only.
- Component specs include responsive breakpoints and accessibility.
- Brand guidelines internally consistent.

## 7. Fact Extraction

1. Extract durable facts to `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
3. Track brand decisions, design rationale, rejected directions.

## 8. Exit

- Comment on any in_progress work before exiting.
- If no assignments, exit cleanly.

---

## Process Reference

Full design lifecycle: `processes/design-process.md`

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Never put full specs in description fields. Use keyed documents (`requirements`, `design`).
- Token-driven design is non-negotiable. No magic numbers. No hardcoded values in mockups.
- **QA is milestone-level**: QA Engineer reviews at milestone boundaries, not per-task.
- **Milestone docs**: 4 auto-generated (architecture w/ mermaid, API reference, decision log, release notes). User-facing docs on-demand only.

## CEO Action Escalation

If blocked on Eric -- follow `processes/ceo-action-escalation.md`:
1. Create issue `[Eric Action Required] {specific action}` with label `ceo-action`
2. Standard format: What is blocked → Steps required → What unblocks → Urgency
3. Comment on all blocked issues linking to the CEO Action issue
4. Notify Chief of Staff for tracking and Discord alerts

Do NOT wait silently when blocked on Eric. Create the issue immediately.
