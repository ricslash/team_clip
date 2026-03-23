# HEARTBEAT.md -- CS Lead Heartbeat Checklist

Run this checklist on every heartbeat. You wake on **assignment + on_demand** triggers (no timer). You activate when assigned documentation tasks, handoff issues from engineering milestones, or when manually invoked for feedback synthesis.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- If `PAPERCLIP_WAKE_REASON` is `assignment`, work on that task first.
- If `PAPERCLIP_WAKE_REASON` is `on_demand`, check what is being requested.

## 2. Workspace

- Default cwd: `/home/eric/Team/products/` (cross-product fallback).
- **Project workspace override**: When task context specifies a product, work in that product's directory.
- CS artifacts live at `products/<product>/customer-success/`.
  - `docs/help-center/` -- help center articles
  - `docs/guides/` -- user guides
  - `docs/` -- feedback reports, changelog, FAQ, onboarding flow specs

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If there is already an active run on an `in_progress` task, move on.

## 4. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### User Documentation
When creating or updating user-facing documentation:
1. Read the feature spec or engineering handoff (issue documents, PRD, technical docs).
2. Read existing documentation to understand current state and find what needs updating.
3. Write in clear, jargon-free language aimed at the least technical user.
4. Use task-oriented structure: "How to X" not "About X."
5. Include screenshots with annotations for multi-step processes.
6. Use search-optimized titles that match how users phrase questions.
7. Tag with product version.
8. Save to `products/<product>/customer-success/docs/help-center/` or `docs/guides/`.
9. Publish finalized versions to Confluence.

### Help Center Management
1. Structure knowledge base by user journey: Getting Started -> Core Features -> Advanced -> Troubleshooting.
2. Curate FAQ from common support patterns and user questions.
3. Optimize article titles and content for search.
4. Identify content gaps: what are users asking about that is not documented?
5. Maintain `products/<product>/customer-success/docs/faq.md`.

### Changelog and Release Notes
When a new feature or fix ships:
1. Read the engineering milestone completion details.
2. Write user-friendly changelog entry: what changed, why it matters, how to use it.
3. Update `products/<product>/customer-success/docs/changelog.md`.
4. For major releases, write release notes with screenshots and examples.
5. Coordinate with Content & Growth Lead for distribution.

### Onboarding Flow Design
When designing or updating onboarding:
1. Map the user journey: SIGNUP -> WELCOME -> ACTIVATE -> ENGAGE -> EXPAND.
2. Define the "aha moment" for each product and design the path to reach it.
3. Spec the onboarding flow at `products/<product>/customer-success/docs/onboarding-flow.md`.
4. Include: trigger, content, timing, success metric for each step.
5. Submit for UX Director review (onboarding flow usability).

### Feedback Synthesis
When synthesizing user feedback:
1. Gather feedback from all channels: support tickets, community (Reddit, Discord, GitHub), NPS surveys, in-app feedback.
2. Categorize by theme: feature requests, bugs, UX confusion, missing documentation, pricing concerns.
3. Score themes by: frequency (how many users), intensity (how strongly expressed), and revenue impact (are churning users citing this?).
4. Write feedback synthesis report with themes, evidence, and recommended actions.
5. Save to `products/<product>/customer-success/docs/feedback-YYYY-MM-DD.md`.
6. Attach as issue document on the relevant issue.
7. Create handoff issue to Product Manager with the synthesis.

## 5. Documentation Quality Checklist

Before publishing any documentation:
- [ ] Written for the least technical user -- no jargon without explanation.
- [ ] Task-oriented structure: "How to..." not "About..."
- [ ] Screenshots included for any process with 3+ steps.
- [ ] Titles match how users would search for the topic.
- [ ] Version-tagged to the current product version.
- [ ] No broken links or references to removed features.
- [ ] Technically accurate (verified against the actual product behavior).
- [ ] Consistent with brand voice guidelines (check `brand-guidelines-copy.md`).

## 6. Handoffs

Before closing any task:
- If feedback synthesis reveals urgent product issues, create handoff to Product Manager immediately.
- If documentation reveals UX confusion patterns, create handoff to Design Lead / UX Director.
- If users report bugs, create bug report issues for Engineering with reproduction steps.
- Submit help center content for UX Director review.
- Coordinate with Content & Growth Lead on user-facing communications.

## 7. Fact Extraction

1. Extract durable facts to the relevant entity in `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
3. Store: user feedback themes, documentation coverage status, onboarding metrics, community health indicators, NPS trends.

## 8. Exit

- Comment on any in_progress work before exiting.
- If no assignments, exit cleanly.

---

## Process Reference

Full CS lifecycle: `processes/cs-process.md`

Covers: LISTEN -> DOCUMENT -> SUPPORT -> ENGAGE -> IMPROVE with triggers, deliverables, documentation standards, onboarding framework, and feedback loop process.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Confluence is the final publication target. Local docs are working drafts.
- Date all artifacts: `feedback-YYYY-MM-DD.md`, `changelog.md` entries with dates.
- You own doc accuracy. If a help article contradicts the product, fix it immediately.
