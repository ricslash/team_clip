# CEO Action Escalation Process

All agents follow this process when work is blocked on something only Eric (Human CEO) can resolve.

## When to Create a CEO Action Issue

Create one when you are blocked on:
- **Account/credential access** — API keys, service accounts, hosting credentials, DNS access
- **Budget or spending approval** — purchases, subscriptions, service upgrades
- **Strategic decisions** — scope changes, feature direction, prioritization calls
- **External commitments** — vendor agreements, partnerships, legal sign-offs
- **Infrastructure access** — VPS credentials, domain registrar, cloud console access

Do NOT create one for:
- Technical decisions you or your department head can make
- Blockers another agent can resolve
- Questions that can wait for the next CoS status cycle

## How to Create the Issue

```
POST /api/companies/{companyId}/issues
{
  "title": "[Eric Action Required] {specific action — verb phrase}",
  "assigneeUserId": "{ericUserId}",
  "priority": "urgent",
  "labels": ["ceo-action"],
  "goalId": "{goalId of blocked work}",
  "projectId": "{projectId if applicable}"
}
```

### Description Format

Use this exact structure. Be specific and explicit — Eric has ADHD and context-switches constantly. Don't assume he remembers prior conversations.

```markdown
## What is blocked
{1-2 sentences: what work is stopped and how many downstream tasks are affected.}

## Steps required (Eric only)
{Numbered list of exactly what Eric needs to do. Include URLs, account names, specific settings.
If there are options, present them as Option A / Option B with trade-offs.}

1. {Step with specific detail — "Create a Hetzner CX22 (2 vCPU, 4GB RAM, Ubuntu 24.04) at hetzner.com"}
2. {Step — "Share SSH credentials via Paperclip secret named `VPS_SSH_KEY`"}
3. {Step — "Confirm in this issue's comments when done"}

## What unblocks
{List every blocked issue identifier and title. Show the dependency chain.}
- {RIC-XX} ({title}) → {RIC-YY} ({title})
- {RIC-ZZ} ({title})

## Urgency
{One sentence: what's the timeline impact. "Blocking the entire Resy production deployment" not "would be nice to have soon."}
```

### After Creating the Issue

1. **Comment on all blocked issues** linking to the CEO Action issue:
   ```
   Blocked on Eric action: {issuePrefix}-{issueNumber} — {title}
   ```

2. **Notify the Chief of Staff** by commenting on the CEO Action issue:
   ```
   @chief-of-staff Created CEO action item. Blocking: {list of blocked issue identifiers}.
   ```
   The CoS will handle Discord notification to #blockers and follow-up reminders.

3. If the CoS is unavailable or not responding, send directly to #blockers:
   ```bash
   curl -s -X POST "$DISCORD_BLOCKERS_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{
       "content": "🔴 **[CEO ACTION NEEDED]** {title}\n\n**Steps:**\n{numbered steps}\n**Blocking:** {blocked identifiers}\n**Urgency:** {impact}\n\n**Your task:** http://192.168.1.8:3101/{issuePrefix}/issues/{issueId}\n**All open actions:** http://192.168.1.8:3101/{issuePrefix}/issues?labels=ceo-action"
     }'
   ```

## Rules

- **Title starts with `[Eric Action Required]`** — this is the standard prefix. All agents use it.
- **One issue per action.** "Create Hetzner VPS" and "Configure DNS" are two separate issues, even if related. Eric can complete them independently.
- **Assign to Eric** using `assigneeUserId`. Do not leave unassigned.
- **Always label `ceo-action`** so the CoS can track Eric's action queue.
- **Include the dependency chain.** Eric needs to see the blast radius of inaction.
- **Include urgency.** "Blocking 5 tasks" is more motivating than "needed eventually."
- **Present options when possible.** "Choose Hetzner or DigitalOcean" is better than "we need a VPS." Eric decides, you execute.
- **Don't duplicate.** Check if a CEO Action issue already exists for this blocker before creating a new one. Comment on the existing one instead.
- **Close when resolved.** When Eric completes the action, close the issue with a comment confirming what was done. Then unblock the downstream work.
