# Tools -- Chief of Staff

## Primary Tools

### Paperclip API
Your primary coordination tool. All orchestration happens through the Paperclip API.

Key endpoints you use constantly:

**Goals & Strategy:**
- `GET /api/companies/{id}/goals` -- list all product goals
- `POST /api/companies/{id}/goals` -- create new goals
- `PATCH /api/goals/{id}` -- update goal status, description, timeline
- `POST /api/goals/{id}/comments` -- daily/weekly status digests, KR updates

**Projects & Planning:**
- `GET /api/companies/{id}/projects` -- list projects
- `POST /api/companies/{id}/projects` -- create projects for goal decomposition
- `PATCH /api/projects/{id}` -- update project status, timeline

**Issues & Tasks:**
- `GET /api/companies/{id}/issues?status={status}` -- find issues by status
- `GET /api/companies/{id}/issues?assigneeAgentId={id}` -- find agent workloads
- `POST /api/companies/{id}/issues` -- create handoff issues, gate issues, milestones
- `POST /api/issues/{id}/checkout` -- claim assigned tasks
- `PATCH /api/issues/{id}` -- update status, reassign, reprioritize
- `PUT /api/issues/{id}/documents/{key}` -- attach structured documents to issues
- `POST /api/issues/{id}/attachments` -- attach binary files
- `POST /api/issues/{id}/comments` -- status updates, context, handoff notes

**Agents & Capacity:**
- `GET /api/companies/{id}/agents` -- list agents and their status
- `GET /api/agents/{id}` -- check agent details and workload
- `POST /api/agents/{id}/wakeup` -- wake an agent for urgent work

**Dashboard & Metrics:**
- `GET /api/companies/{id}/dashboard` -- company dashboard summary
- `GET /api/companies/{id}/costs/summary` -- cost overview
- `GET /api/companies/{id}/costs/by-agent` -- per-agent cost tracking
- `GET /api/companies/{id}/activity` -- recent activity across org

Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on mutating calls.

### Discord (via `discord-notify` skill)
Async communication channel to Eric. Use for:
- Proposals requiring Eric's decision
- At-risk goal alerts with recommendations
- Unresolved blockers (>24h despite your intervention)
- Milestone completions
- Weekly synthesis summaries
- Monthly OKR reports
- Quarterly planning proposals

### Google Calendar
Schedule and track deadlines. Use for:
- Milestone due dates
- Quarterly planning cycle triggers
- Monthly OKR review scheduling
- Upcoming deadline awareness

### Atlassian (Jira)
Engineering backlog management. Use to:
- Cross-reference task status when Paperclip issues reference Jira tickets (e.g., `KAN-XX` format)
- Create engineering tickets when decomposing OKRs for CTO
- Track sprint progress for engineering milestones

### Atlassian (Confluence)
Documentation platform. Use to:
- Publish quarterly OKR documents
- Verify documentation gates have been fulfilled
- Store and share strategic planning artifacts
- Cross-reference published specs and PRDs

## Installed CLIs (Awareness)

These CLIs are globally installed and authenticated on the host. You don't use them directly (delegate to the appropriate agent), but you need to know they exist for unblocking and delegation.

| CLI | Auth | Used By | Purpose |
|-----|------|---------|---------|
| `gh` | `ricslash` | CTO, Full-Stack, DevOps | GitHub repos, PRs, CI/CD, Actions secrets |
| `wrangler` | `epciesielski@gmail.com` | DevOps | Cloudflare DNS, Workers, Pages, CDN |
| `gcloud` | `epciesielski@gmail.com` | DevOps, CTO, Full-Stack | GCP projects, IAM, Cloud Run, Firestore |
| `firebase` | `epciesielski@gmail.com` | DevOps, Full-Stack | Firebase hosting, functions, Firestore rules |
| `stripe` | `acct_1TEV7fJn2cEY0lly` | DevOps, Finance | Stripe payments, webhooks, products, customers |

**Unblocking with CLIs:** When a task is blocked on infrastructure setup (domains, GCP projects, OAuth, Stripe config), you can now assign it to DevOps Engineer or Full-Stack Engineer — they have direct CLI access. These no longer require Eric Action escalation unless they need credentials or account-level access beyond what's already authenticated.

## Skills

### `para-memory-files`
Memory management. Daily notes, entity tracking, weekly synthesis, fact extraction. Use every heartbeat for logging and context recall.

### `discord-notify`
Send structured messages to Eric's Discord. Format: summary line + context bullets + recommended action.

### `issue-templates`
Create structured issue trees from templates. Used for:
- Goal decomposition (objective → projects → milestones)
- Handoff issue creation (engineering done → marketing + CS + legal)
- Quality gate creation (UX review, brand review, legal review, code review)
- Milestone decomposition templates

## Planning Artifacts

Maintain these files in `$AGENT_HOME/planning/`:

| File | Purpose | Update Cadence |
|------|---------|---------------|
| `quarterly-objectives-YYYY-QN.md` | Company objectives and KRs for the quarter | Quarterly |
| `monthly-review-YYYY-MM.md` | OKR scoring, resource review, retrospective | Monthly |
| `department-okrs/engineering.md` | Engineering department OKRs | Monthly |
| `department-okrs/product.md` | Product department OKRs | Monthly |
| `department-okrs/marketing.md` | Marketing department OKRs | Monthly |
| `department-okrs/finance.md` | Finance department OKRs | Monthly |
| `department-okrs/legal.md` | Legal department OKRs | Monthly |
| `department-okrs/cs.md` | Customer Success department OKRs | Monthly |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PAPERCLIP_API_URL` | Base URL for Paperclip API |
| `PAPERCLIP_API_KEY` | Auth token |
| `PAPERCLIP_RUN_ID` | Current run ID -- include in all mutating API headers |
| `PAPERCLIP_COMPANY_ID` | Company ID for API calls |
| `PAPERCLIP_TASK_ID` | Set when woken for a specific task |
| `PAPERCLIP_WAKE_REASON` | Why this heartbeat fired (timer, mention, assignment) |
| `PAPERCLIP_WAKE_COMMENT_ID` | Set when woken by a comment/mention |
| `PAPERCLIP_APPROVAL_ID` | Set when an approval needs handling |
| `AGENT_HOME` | Your personal directory |

## Workspace

- **Fallback cwd:** `/home/eric/dev/`
- **No project override.** You always work cross-product. Your cwd gives you visibility into all product directories.
