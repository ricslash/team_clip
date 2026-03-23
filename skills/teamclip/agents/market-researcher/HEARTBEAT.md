# HEARTBEAT.md -- Market Researcher Heartbeat Checklist

Run this checklist on every heartbeat. You wake on **assignment + on_demand** triggers only (no timer). You activate when CMO assigns research tasks or when someone manually invokes you.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- If `PAPERCLIP_WAKE_REASON` is `assignment`, work on that task first.
- If `PAPERCLIP_WAKE_REASON` is `on_demand`, check what is being requested.

## 2. Workspace

- Default cwd: `/home/eric/Team/products/` (cross-product fallback).
- No project workspace override -- research spans products.
- Research artifacts live at `products/<product>/marketing/Research/` for product-specific research.
- Cross-product research lives at working directory root.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If there is already an active run on an `in_progress` task, move on.

## 4. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### Competitive Analysis
When conducting competitive analysis:
1. Read the research brief from CMO's issue (what questions need answering, what competitors to analyze).
2. Use Firecrawl to scrape competitor websites: pricing pages, feature lists, changelogs, about pages.
3. Use Firecrawl to search for competitor reviews on G2, Capterra, Product Hunt, and TrustRadius.
4. Use Firecrawl to search Reddit, Hacker News, and Twitter/X for unfiltered user opinions.
5. Compile findings into a structured report: feature comparison matrix, pricing comparison, user sentiment analysis, gap identification.
6. Save report to `products/<product>/marketing/Research/competitive-YYYY-MM-DD.md`.
7. Attach as issue document (key: `requirements`) and update issue status.

### Audience Research
When conducting audience research:
1. Identify target communities: subreddits, forums, Discord servers, Twitter/X conversations.
2. Use Firecrawl to scrape relevant threads and discussions.
3. Analyze language patterns: how do users describe their problems? What words do they use?
4. Identify pain points, workflows, tool stacks, and willingness to pay.
5. Compile into audience profile with direct quotes and source links.

### Market Sizing
When sizing a market:
1. Use Firecrawl to find industry reports, market data, and analyst estimates.
2. Build a bottom-up estimate: addressable users x willingness to pay x capture rate.
3. Cross-reference with top-down data from industry sources.
4. Document assumptions explicitly -- every number has a source or a clearly labeled estimate.

### Gap Identification
When finding product opportunities:
1. Map competitor features against user complaints.
2. Where users complain and competitors do not solve it -- that is a gap.
3. Rank gaps by: frequency of complaint, intensity of pain, size of affected audience, feasibility to solve.
4. Deliver ranked gap list with evidence (links to complaints, review excerpts, forum threads).

### Reddit/Community Deep Dives
When researching specific communities:
1. Identify relevant subreddits and search for product category discussions.
2. Use Firecrawl to scrape threads with high engagement (upvotes, comments).
3. Look for: product recommendations, complaint patterns, workaround descriptions, "I wish X had Y" posts.
4. Extract: user language (for marketing copy), pain points (for product), competitor mentions (for competitive intel).
5. Source every finding. Include the URL, the subreddit, and the approximate date.

## 5. Research Quality Checklist

Before delivering any research:
- [ ] Every claim has a source (URL, publication, or direct quote).
- [ ] Competitor data is current (check dates -- pricing pages from 2 years ago are stale).
- [ ] User sentiment is based on patterns, not single anecdotes. Minimum 5 data points per theme.
- [ ] Market sizing assumptions are explicit and labeled (source vs. estimate).
- [ ] Gap identification includes evidence of user pain, not just feature absence.
- [ ] Report includes an executive summary with the top 3 actionable findings.

## 6. Handoffs

Before closing any task:
- Attach the full research report as an issue document (key: `requirements`).
- Comment on the issue with an executive summary: top 3 findings and recommended actions.
- CMO will synthesize into strategy. Product Manager will use for PRD input. No need to create cross-team handoff issues -- CMO handles routing.

## 7. Fact Extraction

1. Extract durable facts to the relevant entity in `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
3. Store: competitive landscape snapshots, market sizing data, source quality assessments, research methodology notes.
4. Track which sources were most valuable for future research efficiency.

## 8. Exit

- Comment on any in_progress work before exiting.
- If no assignments, exit cleanly.

---

## Process Reference

GTM lifecycle (research phase): `processes/gtm-lifecycle.md`

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Source everything. Unsourced claims are opinions, not research.
- Date all artifacts: `competitive-YYYY-MM-DD.md`, `audience-YYYY-MM-DD.md`.
- Firecrawl is your primary tool. Use it heavily. That is what you are here for.
