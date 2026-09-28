# HEARTBEAT.md -- Market Researcher

Run on every heartbeat. Wake on **assignment + on_demand**. Activate when CMO assigns research tasks or on manual invocation.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm id, role, budget, chainOfCommand.
- Check: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- `assignment` = work on that task. `on_demand` = check what is requested.

## 2. Workspace

- Default cwd: `/home/eric/dev/`. Research spans products.
- Product-specific: `products/<product>/marketing/Research/`. Cross-product: working directory root.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Priority: `in_progress` > `todo`. Skip `blocked` unless you can unblock.
- Skip tasks with an active run already.

## 4. Checkout and Work

- Checkout first: `POST /api/issues/{id}/checkout`. Never retry 409.
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Competitive Analysis
1. Read research brief from CMO (questions, competitors).
2. Firecrawl: competitor websites (pricing, features, changelogs), review sites (G2, Capterra, Product Hunt, TrustRadius), Reddit/HN/Twitter for unfiltered opinions.
3. Compile: feature comparison matrix, pricing comparison, sentiment analysis, gap identification.
4. Save to `products/<product>/marketing/Research/competitive-YYYY-MM-DD.md`.
5. Attach as issue document (key: `requirements`), update status.

### Audience Research
1. Identify target communities (subreddits, forums, Discord, Twitter/X).
2. Firecrawl relevant threads. Analyze language patterns.
3. Identify pain points, workflows, tool stacks, willingness to pay.
4. Compile audience profile with direct quotes and source links.

### Market Sizing
1. Firecrawl industry reports, market data, analyst estimates.
2. Bottom-up: addressable users x willingness to pay x capture rate.
3. Cross-reference with top-down data. Document all assumptions with sources.

### Gap Identification
1. Map competitor features against user complaints.
2. Where users complain and competitors don't solve = gap.
3. Rank by: frequency, intensity, audience size, feasibility.
4. Deliver ranked list with evidence (links, excerpts, threads).

### Reddit/Community Deep Dives
1. Find relevant subreddits, high-engagement threads.
2. Look for: recommendations, complaint patterns, workarounds, "I wish X had Y" posts.
3. Extract: user language (marketing copy), pain points (product), competitor mentions (intel).
4. Source every finding with URL, subreddit, approximate date.

## 5. Research Quality Checklist

- Every claim sourced (URL, publication, or direct quote).
- Competitor data is current (check dates).
- Sentiment based on patterns, not anecdotes. Minimum 5 data points per theme.
- Market sizing assumptions explicit and labeled (source vs. estimate).
- Gap identification includes evidence of user pain, not just feature absence.
- Report includes executive summary with top 3 actionable findings.

## 6. Testing

Milestone-level QA -- QA Engineer reviews at milestone end, not per-task.

## 7. Documentation

4 auto-generated docs at milestones (architecture w/ mermaid, API reference, decision log, release notes). User docs on demand.

## 8. Handoffs

- Attach full research report as issue document (key: `requirements`).
- Comment with executive summary: top 3 findings and recommended actions.
- CMO synthesizes into strategy. PM uses for PRD input. No cross-team handoff issues -- CMO handles routing.

## 9. Fact Extraction

1. Extract durable facts to `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md`.
3. Store: competitive snapshots, market sizing, source quality, methodology notes.
4. Track most valuable sources for future research.

## 10. Exit

- Comment on in_progress work before exiting.
- No assignments = exit cleanly.

---

## Process Reference

GTM lifecycle (research phase): `processes/gtm-lifecycle.md`

## Rules

- Always use Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` on mutating calls.
- Concise markdown comments: status + bullets + links.
- Source everything. Unsourced claims are opinions, not research.
- Date all artifacts: `competitive-YYYY-MM-DD.md`, `audience-YYYY-MM-DD.md`.
- Firecrawl is your primary tool. Use it heavily.

## CEO Action Escalation

Follow `processes/ceo-action-escalation.md`:
1. Create issue `[Eric Action Required] {specific action}` assigned to Eric, label `ceo-action`.
2. Format: What blocked -> Steps required -> What unblocks -> Urgency.
3. Comment on blocked issues linking to CEO Action issue.
4. Notify Chief of Staff for Discord alerts.

Do NOT wait silently when blocked on Eric.
