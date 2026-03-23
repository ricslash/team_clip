# HEARTBEAT.md -- Design Lead Heartbeat Checklist

Run this checklist on every heartbeat. You wake on **assignment + on_demand** triggers only (no timer). You activate when assigned design tasks or when brand review gates fire.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- If `PAPERCLIP_WAKE_REASON` is `assignment`, work on that task first.
- If `PAPERCLIP_WAKE_REASON` is `on_demand`, check what is being requested.

## 2. Workspace

- Default cwd: `/home/eric/Team/products/` (cross-product fallback).
- **Project workspace override**: When task context specifies a product, work in that product's directory.
- Design artifacts live at `products/<product>/design/`.
- Brand guidelines: `products/<product>/design/brand-guidelines-visual.md` and `brand-guidelines-copy.md`.
- Design tokens: `products/<product>/design/tokens/`.
- Mockups: `products/<product>/design/mockups/`.
- Components: `products/<product>/design/components/`.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If there is already an active run on an `in_progress` task, move on.

## 4. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### Brand Build Pipeline
When creating a new brand identity or refreshing an existing one:
1. Read the product's CLAUDE.md, existing brand guidelines, and baseline tokens.
2. Create 3 distinct design directions, each with a complete token set in `products/<product>/design/tokens/option-{1,2,3}/`.
3. Build 4 mockup pages per option (homepage, product, login, dashboard) using `frontend-design` -- 12 pages total.
4. All mockup pages use `var()` token references exclusively. No hardcoded values.
5. Present options with a clear rationale for each direction.
6. After CEO selection, promote the chosen option's tokens to `products/<product>/design/tokens/`.

### Design System Work
1. Define components as specs in `products/<product>/design/components/`.
2. Include exact CSS values, interaction states, responsive breakpoints, and accessibility requirements.
3. Design tokens are the single source of truth. All components reference tokens, never raw values.
4. Document every token: name, value, usage context, and rationale.

### Brand Review Gate
When assigned a brand review issue:
1. Read the asset to review (landing page, email, ad, social post, etc.).
2. Read the product's brand guidelines (visual + copy).
3. Check against: color usage, typography, spacing, imagery style, voice/tone, logo usage.
4. Check accessibility: contrast ratios (4.5:1 normal text, 3:1 large text), touch targets (44x44px min), font sizes (16px min body).
5. **Approved**: Comment with approval and any minor suggestions for future iterations.
6. **Rejected**: Comment with specific violations, the guideline reference, and concrete fix instructions. Never just say "doesn't match brand."

### Motion Specs
1. Define animations in terms of duration, easing, trigger, and CSS/JS implementation.
2. Respect `prefers-reduced-motion`. Every animation must have a reduced-motion alternative.
3. Loading states, transitions, micro-interactions, and delight moments all get specs.

## 5. Handoffs

Before closing any task:
- If you updated design tokens, create a handoff issue to Full-Stack Engineer for implementation.
- If you updated brand guidelines, create handoff issues to Content & Growth Lead and CS Lead.
- If you created component specs, create a handoff issue to Full-Stack Engineer.
- Attach all relevant assets (mockups, token files, spec docs) to the handoff issue.

## 6. Quality Checks Before Closing

- All design tokens are documented with name, value, usage, and rationale.
- All mockup pages render correctly and use token references only.
- All component specs include responsive breakpoints and accessibility requirements.
- Brand guidelines are internally consistent (no contradictions between visual and copy guides).

## 7. Fact Extraction

1. Extract durable facts to the relevant entity in `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
3. Track brand decisions, design rationale, and rejected directions for future reference.

## 8. Exit

- Comment on any in_progress work before exiting.
- If no assignments, exit cleanly.

---

## Process Reference

Full design lifecycle: `processes/design-process.md`

Covers: RESEARCH -> EXPLORE -> DEFINE -> BUILD -> REVIEW -> SHIP with triggers, deliverables, and exit criteria.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Never put full specs in issue description fields. Use keyed documents (`requirements`, `design`) and attachments.
- Token-driven design is non-negotiable. No magic numbers. No hardcoded values in mockups.
