---
name: discord-notify
description: Send structured Discord notifications to Eric (CEO) via webhook. Used by Chief of Staff for async alerts — goal risks, blockers, milestone completions, and weekly synthesis.
---

# Discord Notify Skill

## When to Use

This skill is invoked by the Chief of Staff agent in four scenarios:

1. **Goal at risk** — A product goal's milestones are falling behind projected timeline by >20%, or a critical dependency is unresolved.
2. **Blocker unresolved >24h** — Any issue with status `blocked` has not changed in over 24 hours and no resolution path exists.
3. **Milestone complete** — A milestone issue reaches status `done` with all child tasks completed and quality gates passed.
4. **Weekly synthesis** — Monday's first heartbeat rolls up the full week: tasks completed, blocked, overdue, and priority recommendations.

## Configuration

The webhook URL is read from the environment variable `DISCORD_WEBHOOK_URL`. This must be set in the agent's adapter configuration or shell environment before invoking this skill.

```bash
# Verify the webhook is configured
if [ -z "$DISCORD_WEBHOOK_URL" ]; then
  echo "ERROR: DISCORD_WEBHOOK_URL is not set. Cannot send Discord notification."
  exit 1
fi
```

## Message Format

All messages follow a consistent structure:

```
[CATEGORY] Short summary (one line)

Details (2-3 lines max)

Dashboard: http://192.168.1.8:3100/companies/{companyId}/issues
```

The category tag enables Eric to scan notifications quickly. Details provide just enough context to decide whether to act now or later.

## Message Templates

### Goal at Risk

```bash
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "**[GOAL AT RISK]** {goalName}\n\n**Why:** {riskReason}\n**Blocked items:** {blockedCount} issues, longest blocked: {longestBlockedDays} days\n**Recommendation:** {recommendedAction}\n\n**Dashboard:** http://192.168.1.8:3100/companies/{companyId}/goals/{goalId}"
  }'
```

**Field definitions:**
- `goalName` — The goal title (e.g., "TaskKnife — $10k MRR by Q3 2026")
- `riskReason` — Specific cause: missed deadline, blocked dependency, resource contention
- `blockedCount` — Number of issues currently blocked under this goal
- `longestBlockedDays` — Days since the oldest blocked issue was last updated
- `recommendedAction` — What the CoS recommends Eric do (reprioritize, unblock, reassign)

### Blocker Unresolved >24h

```bash
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "**[BLOCKER]** {issueKey}: {issueTitle}\n\n**Blocked since:** {blockedSince}\n**Assigned to:** {assigneeName}\n**Blocking:** {blockedDownstreamCount} downstream tasks\n**What is needed:** {whatIsNeeded}\n\n**Issue:** http://192.168.1.8:3100/companies/{companyId}/issues/{issueId}"
  }'
```

**Field definitions:**
- `issueKey` — The issue identifier (e.g., "RIC-42")
- `issueTitle` — The issue title
- `blockedSince` — ISO date when the issue entered blocked status
- `assigneeName` — Who currently owns the blocked issue
- `blockedDownstreamCount` — How many other issues depend on this one
- `whatIsNeeded` — Specific action required to unblock (decision, external dependency, resource)

### Milestone Complete

```bash
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "**[MILESTONE COMPLETE]** {milestoneName}\n\n**Product:** {productName}\n**Tasks completed:** {completedCount}/{totalCount}\n**Quality gates passed:** {gatesList}\n**Next up:** {nextMilestoneOrAction}\n\n**Dashboard:** http://192.168.1.8:3100/companies/{companyId}/issues/{milestoneId}"
  }'
```

**Field definitions:**
- `milestoneName` — The milestone issue title
- `productName` — Which product this milestone belongs to
- `completedCount/totalCount` — Task completion ratio
- `gatesList` — Comma-separated list of quality gates that passed (e.g., "Code Review, UX Review, Deploy Gate")
- `nextMilestoneOrAction` — What follows: next milestone name, or "Handoffs created for Marketing, CS, Legal"

### Weekly Synthesis

```bash
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "**[WEEKLY SYNTHESIS]** Week of {weekStartDate}\n\n**Completed:** {completedCount} tasks across {productCount} products\n**In progress:** {inProgressCount} tasks\n**Blocked:** {blockedCount} tasks ({criticalBlockers} critical)\n**Overdue:** {overdueCount} tasks\n\n**Per product:**\n{perProductSummary}\n\n**Priority recommendations:**\n{priorityRecommendations}\n\n**Dashboard:** http://192.168.1.8:3100/companies/{companyId}/goals"
  }'
```

**Field definitions:**
- `weekStartDate` — Monday of the reporting week (YYYY-MM-DD)
- `completedCount` — Total tasks moved to done this week
- `inProgressCount` — Tasks currently in progress
- `blockedCount` — Tasks currently blocked
- `criticalBlockers` — Number of blockers that affect goal timelines
- `overdueCount` — Tasks past their estimated completion
- `perProductSummary` — One line per product: "- TaskKnife: 12 done, 3 blocked, on track" etc.
- `priorityRecommendations` — 1-3 bullet points: what Eric should focus on, reprioritize, or unblock

## Implementation Notes

1. **Rate limiting:** Discord webhooks allow 30 requests per 60 seconds. The CoS heartbeat runs every 30 minutes, so rate limits are never an issue under normal operation. If batching multiple notifications in one heartbeat, add a 1-second delay between calls.

2. **Message length:** Discord messages have a 2000-character limit. If the weekly synthesis exceeds this, split into two messages: summary first, then per-product detail.

3. **Error handling:** If the webhook returns a non-200 status, log the error to the issue as a comment and retry on the next heartbeat. Do not retry immediately.

4. **No sensitive data:** Never include API keys, tokens, passwords, or internal infrastructure details in Discord messages. Stick to issue keys, titles, counts, and dashboard links.

5. **Timezone:** All dates and times use the company's configured timezone. Default to America/New_York if not set.
