# HEARTBEAT.md -- Content & Growth Lead Heartbeat Checklist

Run this checklist on every heartbeat. You wake on **assignment only** (no timer, no on_demand). You activate only when CMO assigns you content or campaign tasks.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- `PAPERCLIP_WAKE_REASON` should be `assignment`. Work on the assigned task.

## 2. Workspace

- Default cwd: `/home/eric/Team/products/` (cross-product fallback).
- **Project workspace override**: When task context specifies a product, work in that product's directory.
- Marketing assets live at `products/<product>/marketing/assets/`.
- Content docs live at `products/<product>/marketing/docs/`.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If there is already an active run on an `in_progress` task, move on.

## 4. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### Content Creation
When creating content (blog posts, landing pages, email sequences, ad copy):
1. Read the campaign brief from CMO's issue (objective, audience, message, channel, format, metrics).
2. Read the product's brand guidelines: `products/<product>/design/brand-guidelines-copy.md`.
3. Read relevant Market Researcher findings for audience language and competitive context.
4. Create the content, matching the target audience's language and pain points.
5. Save to `products/<product>/marketing/assets/<type>/` (landing-pages/, email-sequences/, social/, ads/).
6. Self-review against brand guidelines before submitting for formal review.
7. Create brand review gate issue assigned to Design Lead.
8. Create legal review gate issue assigned to Legal Counsel (for public-facing content).

### SEO Execution
When executing SEO work:
1. Read keyword research data (from Market Researcher or your own Firecrawl analysis).
2. On-page optimization: titles, meta descriptions, headers, internal linking, schema markup.
3. Content optimization: keyword integration, semantic variations, content structure.
4. Technical SEO: check page speed, crawlability, mobile-friendliness.
5. Track rankings and report to CMO.

### Social Media
When creating social content:
1. Read the campaign brief and channel strategy from CMO.
2. Create platform-appropriate content (Reddit posts are not tweets are not LinkedIn posts).
3. For Reddit: authentic, value-first engagement. No overt self-promotion. Contribute to conversations, share insights, mention the product only when genuinely relevant.
4. For Product Hunt: launch preparation, community engagement, founder narrative.
5. For Twitter/X: build-in-public updates, product insights, industry commentary.

### Email Campaigns
When creating email sequences:
1. Read the campaign brief: trigger, audience segment, sequence length, objective.
2. Write subject lines optimized for open rate (short, specific, curiosity-driven).
3. Write email body copy matching brand voice guidelines.
4. Include clear CTAs with tracking parameters.
5. Submit for legal review (CAN-SPAM compliance, unsubscribe requirements).

### Community Management
When managing community engagement:
1. Monitor relevant communities (Reddit, Discord, Product Hunt, GitHub Discussions).
2. Engage authentically -- answer questions, share insights, provide value.
3. Collect user feedback and community sentiment for CS Lead and CMO.
4. Flag any negative sentiment spikes to CMO immediately.

### Growth Experiments
When running growth experiments:
1. Define hypothesis: "We believe [action] will [move metric] by [amount] because [evidence]."
2. Define test: what to change, how to measure, minimum sample size, run duration.
3. Execute the test.
4. Report results to CMO with clear recommendation: scale, iterate, or kill.

## 5. Quality Gates

Before marking any content task as done:
- Content matches the campaign brief objectives and audience.
- Content follows brand voice guidelines.
- Brand review gate issue created and assigned to Design Lead.
- Legal review gate issue created and assigned to Legal Counsel (for public-facing content).
- UX review gate issue created and assigned to UX Director (for landing pages and user-facing assets).
- All claims in content are verifiable and sourced.

## 6. Handoffs

Before closing any task:
- Attach final assets to the issue (documents and/or attachments).
- If content is approved through all gates, update the issue to `done`.
- If content informs documentation, create a handoff issue to CS Lead.
- If content reveals user insights, report back to CMO.

## 7. Fact Extraction

1. Extract durable facts to the relevant entity in `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
3. Track: content performance data, community engagement patterns, growth experiment results, SEO rankings.

## 8. Exit

- Comment on any in_progress work before exiting.
- If no assignments, exit cleanly.

---

## Process Reference

GTM lifecycle (create phase): `processes/gtm-lifecycle.md`

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Never ship public-facing content without brand review (Design Lead) and legal review (Legal Counsel).
- Never make unsubstantiated marketing claims.
- Date all artifacts.
- Use Paperclip skills for campaign execution (Reddit posts, email drafts, social content).
