# TeamClip — Migration from Existing Paperclip Instance

**Last updated:** 2026-03-20

---

## Context

If you have an existing Paperclip instance (the original "RIC" company with 7 agents and issues RIC-1 through RIC-49), this doc covers how to migrate to the TeamClip org structure.

**The fresh seed approach (recommended for clean start):** Run `pnpm seed:teamclip` on a fresh database. This is what SETUP.md describes.

**The migration approach (preserve existing history):** Rename/reconfigure existing agents in place using API calls. This preserves session history, run logs, and issue associations.

## Existing Agent Mapping

From the audit on 2026-03-20, the existing Paperclip instance has:

| Existing Agent | Known ID | Action | New Name |
|---|---|---|---|
| CEO | (root agent) | Reconfigure → Chief of Staff | Chief of Staff |
| CTO | 410d915d-bd22-48c3-8903-acf304114191 | Keep + reconfigure | CTO |
| CMO | 9da16515-4545-4198-8904-3e5da187f0f8 | Keep + reconfigure | CMO |
| Founding Engineer | accc5f83-0982-4206-abf1-bcc94e367ed1 | Rename | Full-Stack Engineer |
| Content Strategist | (check API) | Rename + expand | Content & Growth Lead |
| Growth Hacker | (check API) | Terminate | (absorbed into Content & Growth) |
| UX Test Lead | (check API) | Rename + expand | UX Director |

## Migration Steps

### Prerequisites
- Paperclip server running at `http://192.168.1.8:3100`
- Board session cookie (sign in via UI or API)

### Step 0a: Rename Founding Engineer → Full-Stack Engineer

```bash
curl -X PATCH http://192.168.1.8:3100/api/agents/accc5f83-0982-4206-abf1-bcc94e367ed1 \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Full-Stack Engineer",
    "role": "engineer",
    "title": "Full-Stack Engineer",
    "capabilities": "Frontend and backend implementation. JavaScript/TypeScript, Python, React, Next.js, FastAPI, PostgreSQL."
  }'
```

### Step 0b: Rename Content Strategist → Content & Growth Lead

```bash
curl -X PATCH http://192.168.1.8:3100/api/agents/{content-strategist-id} \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Content & Growth Lead",
    "role": "content_growth",
    "title": "Content & Growth Lead",
    "capabilities": "Content creation, SEO, social media, email campaigns, community management, growth hacking."
  }'
```

### Step 0c: Rename UX Test Lead → UX Director

```bash
curl -X PATCH http://192.168.1.8:3100/api/agents/{ux-test-lead-id} \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "UX Director",
    "role": "ux_director",
    "title": "UX Director",
    "capabilities": "Visual QA via screenshots, end-to-end UX flow review, accessibility audits, cross-product consistency, responsive testing."
  }'
```

**Important:** Preserve the `gemini_local` adapter type. Do NOT change the adapter.

### Step 0d: Reconfigure CEO → Chief of Staff

```bash
curl -X PATCH http://192.168.1.8:3100/api/agents/{ceo-agent-id} \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chief of Staff",
    "role": "ceo",
    "title": "Chief of Staff"
  }'
```

Note: `role` stays "ceo" because Paperclip needs a root agent with this role.

### Step 0e: Reconfigure CTO + CMO

Update heartbeat intervals and capabilities:

```bash
# CTO
curl -X PATCH http://192.168.1.8:3100/api/agents/410d915d-bd22-48c3-8903-acf304114191 \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "capabilities": "Technical strategy, architecture oversight. Delegates all implementation to Architect and Full-Stack Engineer."
  }'

# CMO
curl -X PATCH http://192.168.1.8:3100/api/agents/9da16515-4545-4198-8904-3e5da187f0f8 \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "capabilities": "GTM strategy, positioning, market assessment. Delegates research to Market Researcher, execution to Content & Growth Lead."
  }'
```

### Step 0f: Terminate Growth Hacker

```bash
curl -X POST http://192.168.1.8:3100/api/agents/{growth-hacker-id}/terminate \
  -b ~/.paperclip/cookies.txt
```

### Step 0g: Create Goals

```bash
# Get company ID first
COMPANY_ID=$(curl -s http://192.168.1.8:3100/api/companies \
  -b ~/.paperclip/cookies.txt | jq -r '.[0].id')

# TaskKnife goal
curl -X POST http://192.168.1.8:3100/api/companies/$COMPANY_ID/goals \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "TaskKnife — $10k MRR by Q3 2026",
    "description": "Reach $10,000 monthly recurring revenue for TaskKnife through product improvements and organic growth.",
    "level": "company",
    "status": "active"
  }'

# IHAB goal
curl -X POST http://192.168.1.8:3100/api/companies/$COMPANY_ID/goals \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "IHAB — MVP launch by Q2 2026",
    "description": "Launch IHAB minimum viable product with core functionality.",
    "level": "company",
    "status": "active"
  }'

# Resy goal
curl -X POST http://192.168.1.8:3100/api/companies/$COMPANY_ID/goals \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Resy — Beta with 50 users by Q3 2026",
    "description": "Launch Resy beta and onboard 50 active users.",
    "level": "company",
    "status": "active"
  }'
```

### Step 0h: Link Existing Projects to Goals

```bash
# Get goal IDs
curl -s http://192.168.1.8:3100/api/companies/$COMPANY_ID/goals \
  -b ~/.paperclip/cookies.txt | jq '.[] | {id, title}'

# Patch existing TaskKnife project to link to its goal
curl -X PATCH http://192.168.1.8:3100/api/projects/{taskknife-project-id} \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"goalIds": ["{taskknife-goal-id}"]}'

# Same for Resy
curl -X PATCH http://192.168.1.8:3100/api/projects/{resy-project-id} \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"goalIds": ["{resy-goal-id}"]}'

# Create IHAB project (didn't exist before)
curl -X POST http://192.168.1.8:3100/api/companies/$COMPANY_ID/projects \
  -b ~/.paperclip/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IHAB MVP",
    "description": "IHAB minimum viable product development",
    "goalIds": ["{ihab-goal-id}"],
    "status": "active"
  }'
```

### Steps 9-10: Create New Agents

After migration steps 0a-0h, create the 10 new agents that don't exist yet:

- Architect
- QA Engineer
- DevOps Engineer
- Product Manager
- Design Lead
- Market Researcher
- Finance Analyst
- Legal Counsel
- CS Lead
- (Chief of Staff — only if CEO agent wasn't reconfigured)

Use `POST /api/companies/{companyId}/agents` for each. See the seed script (`packages/db/src/seed-teamclip.ts`) for the exact payload structure.

## Verification

After migration, check:

1. `GET /api/companies/{id}/org` — org tree should show 15 agents (14 if Growth Hacker terminated)
2. `GET /api/companies/{id}/goals` — 3 goals visible
3. `GET /api/companies/{id}/projects` — 4 projects, each linked to a goal
4. `GET /api/companies/{id}/issues` — existing issues RIC-1 through RIC-49 preserved
5. Dashboard UI shows correct agent names and hierarchy

## Rollback

If migration goes wrong:
1. Paperclip has database backups at `~/.paperclip/instances/default/data/backups/`
2. Restore with: copy backup file over the database directory and restart
3. Agent config revisions are tracked — use `POST /api/agents/{id}/config-revisions/{revisionId}/rollback` to undo individual agent changes
