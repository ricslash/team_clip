---
name: discord-notify
description: Send structured Discord notifications to Eric (CEO) via webhook. Uses two channels — #general for status/wins/synthesis, #blockers for items requiring Eric's action.
---

# Discord Notify Skill

## When to Use

This skill is invoked by the Chief of Staff agent. Messages are routed to the appropriate channel based on category:

### → `#blockers` channel (`DISCORD_BLOCKERS_WEBHOOK_URL`)
Messages that require Eric to **take action or make a decision**:

1. **Blocker requiring Eric** — Any issue blocked on something only Eric can resolve (external dependency, budget decision, strategic call, account access).
2. **Proposal requiring decision** — Strategic proposals (new goals, budget changes, org changes) that need Eric's approval.
3. **Escalation** — Issues the CoS has tried to resolve autonomously but cannot.

### → General channel (`DISCORD_WEBHOOK_URL`)
Informational messages that keep Eric aware but don't require action:

4. **Goal at risk** — A product goal's KRs are trending below target or milestones are slipping.
5. **Milestone complete** — A milestone reaches `done` with all gates passed.
6. **Weekly synthesis** — Monday rollup: tasks completed, blocked, overdue, KR scores, priority recommendations.
7. **Monthly OKR report** — Monthly KR scoring and resource review.
8. **Quarterly planning proposal** — New quarter objectives for review (also sent to #blockers since it needs approval).

## Configuration

Two webhook URLs, one per channel:

```bash
# General channel — status updates, wins, synthesis
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."

# Blockers channel — items requiring Eric's action
DISCORD_BLOCKERS_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

Both must be set in the agent's adapter configuration or shell environment.

```bash
# Verify webhooks are configured
if [ -z "$DISCORD_WEBHOOK_URL" ]; then
  echo "ERROR: DISCORD_WEBHOOK_URL is not set."
  exit 1
fi
if [ -z "$DISCORD_BLOCKERS_WEBHOOK_URL" ]; then
  echo "WARNING: DISCORD_BLOCKERS_WEBHOOK_URL is not set. Blocker alerts will fall back to general channel."
  DISCORD_BLOCKERS_WEBHOOK_URL="$DISCORD_WEBHOOK_URL"
fi
```

### Webhook Selection Logic

```
if message requires Eric's action or decision:
    use $DISCORD_BLOCKERS_WEBHOOK_URL
else:
    use $DISCORD_WEBHOOK_URL
```

## Message Format

All messages follow a consistent structure:

```
[CATEGORY] Short summary (one line)

Details (2-3 lines max)

Dashboard: http://192.168.1.8:3101/{issuePrefix}/issues
```

The category tag enables Eric to scan notifications quickly. Details provide just enough context to decide whether to act now or later.

**Dashboard URL format:** `http://192.168.1.8:3101/{issuePrefix}/...` where `{issuePrefix}` is the company's issue prefix (e.g., `RIC`). Get it from the company object (`GET /api/companies/{companyId}` → `issuePrefix` field) or from any issue's `identifier` (e.g., `RIC-42` → prefix is `RIC`).

## Message Templates

### Blocker Requiring Eric → `#blockers`

```bash
curl -s -X POST "$DISCORD_BLOCKERS_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🔴 **[BLOCKER — ACTION NEEDED]** {issueKey}: {issueTitle}\n\n**Blocked since:** {blockedSince}\n**What I\u0027ve tried:** {whatCoSTried}\n**What Eric needs to do:** {actionNeeded}\n**Impact:** Blocking {blockedDownstreamCount} downstream tasks under {goalName}\n\n**Issue:** http://192.168.1.8:3101/{issuePrefix}/issues/{issueId}"
  }'
```

**Field definitions:**
- `issueKey` — The issue identifier (e.g., "RIC-42")
- `issueTitle` — The issue title
- `blockedSince` — ISO date when the issue entered blocked status
- `whatCoSTried` — What the CoS already did to try to unblock (reassign, provide context, etc.)
- `actionNeeded` — Specific action Eric must take (e.g., "Approve budget increase", "Provide API credentials for Stripe", "Make call on feature scope")
- `blockedDownstreamCount` — How many other issues depend on this one
- `goalName` — Which goal this affects

### Proposal Requiring Decision → `#blockers`

```bash
curl -s -X POST "$DISCORD_BLOCKERS_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🟡 **[PROPOSAL — DECISION NEEDED]** {title}\n\n**Decision needed:** {decisionOneLiner}\n**Recommendation:** {recommendation}\n**Why:** {reasoning}\n**Risk if delayed:** {delayRisk}\n\n**Details:** http://192.168.1.8:3101/{issuePrefix}/goals/{goalId}"
  }'
```

### Escalation → `#blockers`

```bash
curl -s -X POST "$DISCORD_BLOCKERS_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🟠 **[ESCALATION]** {summary}\n\n**Context:** {context}\n**What I\u0027ve tried:** {attemptedResolutions}\n**Options:**\n{options}\n**My recommendation:** {recommendation}\n\n**Issue:** http://192.168.1.8:3101/{issuePrefix}/issues/{issueId}"
  }'
```

### Goal at Risk → General

```bash
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "**[GOAL AT RISK]** {goalName}\n\n**Why:** {riskReason}\n**KR scores:** {krScoreSummary}\n**Blocked items:** {blockedCount} issues, longest blocked: {longestBlockedDays} days\n**Action taken:** {whatCoSDid}\n\n**Dashboard:** http://192.168.1.8:3101/{issuePrefix}/goals/{goalId}"
  }'
```

**Field definitions:**
- `goalName` — The goal title (e.g., "TaskKnife — $10k MRR by Q3 2026")
- `riskReason` — Specific cause: missed deadline, blocked dependency, resource contention
- `krScoreSummary` — Current KR scores (e.g., "KR1: 0.3, KR2: 0.7, KR3: 0.1")
- `blockedCount` — Number of issues currently blocked under this goal
- `longestBlockedDays` — Days since the oldest blocked issue was last updated
- `whatCoSDid` — What the CoS has already done to address (reassigned, reprioritized, etc.)

### Milestone Complete → General

```bash
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "✅ **[MILESTONE COMPLETE]** {milestoneName}\n\n**Product:** {productName}\n**Tasks completed:** {completedCount}/{totalCount}\n**Quality gates passed:** {gatesList}\n**KR impact:** {krImpact}\n**Next up:** {nextMilestoneOrAction}\n\n**Dashboard:** http://192.168.1.8:3101/{issuePrefix}/issues/{milestoneId}"
  }'
```

**Field definitions:**
- `milestoneName` — The milestone issue title
- `productName` — Which product this milestone belongs to
- `completedCount/totalCount` — Task completion ratio
- `gatesList` — Comma-separated list of quality gates that passed
- `krImpact` — Which KR this advances and new score (e.g., "KR1: 0.3 → 0.5")
- `nextMilestoneOrAction` — What follows: next milestone name, or "Handoffs created for Marketing, CS, Legal"

### Weekly Synthesis → General

```bash
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "**[WEEKLY SYNTHESIS]** Week of {weekStartDate}\n\n**Objectives:**\n{objectiveScores}\n\n**Completed:** {completedCount} tasks across {productCount} products\n**In progress:** {inProgressCount} tasks\n**Blocked:** {blockedCount} tasks ({criticalBlockers} critical)\n**Overdue:** {overdueCount} tasks\n\n**Priority recommendations:**\n{priorityRecommendations}\n\n**Dashboard:** http://192.168.1.8:3101/{issuePrefix}/goals"
  }'
```

**Field definitions:**
- `weekStartDate` — Monday of the reporting week (YYYY-MM-DD)
- `objectiveScores` — One line per objective with KR trend: "- Obj1: KR1 0.5↑ KR2 0.3→ KR3 0.1↓"
- `completedCount` — Total tasks moved to done this week
- `inProgressCount` — Tasks currently in progress
- `blockedCount` — Tasks currently blocked
- `criticalBlockers` — Number of blockers that affect goal timelines
- `overdueCount` — Tasks past their estimated completion
- `priorityRecommendations` — 1-3 bullet points: what to focus on, reprioritize, or unblock

### Monthly OKR Report → General

```bash
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "**[MONTHLY REPORT]** {monthYear}\n\n**Objectives:** {onTrackCount} on track | {atRiskCount} at risk | {behindCount} behind\n**Top win:** {topWin}\n**Top risk:** {topRisk}\n**Resource note:** {resourceNote}\n\n**Full report:** http://192.168.1.8:3101/{issuePrefix}/goals"
  }'
```

## Implementation Notes

1. **Rate limiting:** Discord webhooks allow 30 requests per 60 seconds. The CoS heartbeat runs every 30 minutes, so rate limits are never an issue under normal operation. If batching multiple notifications in one heartbeat, add a 1-second delay between calls.

2. **Message length:** Discord messages have a 2000-character limit. If the weekly synthesis exceeds this, split into two messages: summary first, then per-product detail.

3. **Error handling:** If a webhook returns a non-200 status, log the error to the issue as a comment and retry on the next heartbeat. Do not retry immediately.

4. **No sensitive data:** Never include API keys, tokens, passwords, or internal infrastructure details in Discord messages. Stick to issue keys, titles, counts, and dashboard links.

5. **Timezone:** All dates and times use the company's configured timezone. Default to America/New_York if not set.

6. **Fallback:** If `DISCORD_BLOCKERS_WEBHOOK_URL` is not set, all messages fall back to `DISCORD_WEBHOOK_URL`. The skill should still work with a single webhook — two channels is preferred but not required.

7. **Channel discipline:** Never send informational messages to #blockers. That channel is Eric's action queue — if it has a notification, Eric needs to do something. This keeps the signal-to-noise ratio high.
