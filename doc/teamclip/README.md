# TeamClip — Custom Paperclip Fork for RIC

**Created:** 2026-03-20
**Author:** Eric Trimbur (Chairman) + Claude Code
**Repo:** `/home/eric/team_clip/team_clip/`
**Design Plan:** `/home/eric/team_clip/03_20_plan.md` (v3 — final)

---

## What Is This?

TeamClip is a fork of [Paperclip](https://docs.paperclip.ing) — an AI agent orchestration tool — customized for Eric's company RIC. It merges two systems:

1. **@Team/** — Eric's existing organizational system built in Claude Code. 8 teams, ~45 specialized agents, 32 slash commands, 7 quality gates, deep per-team process documentation (~200 pages). Lived in `~/.claude/commands/` and `~/.claude/workflow/`.

2. **Paperclip** — Open-source AI company orchestrator with persistent agent identity, heartbeat scheduling, task management (goal→project→issue hierarchy), cost tracking, and multi-adapter support (Claude, Gemini, Codex, etc.).

**Why merge?** Team had rich processes but no runtime — agents were stateless slash commands. Paperclip has the runtime (heartbeats, sessions, task tracking) but no organizational depth. Neither was complete alone.

## Architecture Decisions (2026-03-20)

### Eric = Chairman (Human Board Operator)

Eric is NOT an agent in Paperclip. He's the board operator — he sees everything, approves hires, sets strategy, and intervenes via the dashboard at `http://192.168.1.8:3100`. In corporate terms: **Chairman of the Board**.

### Chief of Staff = CEO (Agent Tree Root)

Paperclip requires exactly one root agent with `role="ceo"`. The Chief of Staff fills this role. It's the always-on orchestrator (30-min heartbeat) that:
- Cascades goals into department objectives
- Detects completed work and auto-creates cross-team handoff issues
- Creates quality gate blocking issues
- Escalates blockers to Eric via Discord
- Batches assignments by product to preserve session continuity
- Runs daily goal health checks and weekly synthesis

### 15 Shared Agents (Not Product-Pinned)

All agents work across all products. Project workspaces inject the correct working directory per task. Session restarts on product switches are acceptable because issue documentation carries context.

**Scaling trigger:** If 3+ products are in active concurrent development and execution agents restart sessions every heartbeat, spin up product-pinned Full-Stack + QA instances.

### One Company, Multiple Goals (Not Multiple Companies)

Each product (TaskKnife, IHAB, Resy) is a separate company-level goal under one company "RIC". This preserves:
- Single org chart
- Cross-product agent assignment
- Unified cost tracking (`GET /api/companies/{id}/costs/by-project`)
- CoS can cascade across all products in one heartbeat

### Team System Preserved as Fallback

The existing `~/.claude/commands/` and `~/.claude/workflow/` directories are NOT removed. Team continues to work alongside TeamClip. If Paperclip agents show confusion from inheriting global Claude context, address via `claude_local` adapter's `--add-dir` flag — don't delete source files.

## Org Chart

```
Eric (Chairman — Human Board Operator)
│
├── Chief of Staff [role=ceo] ←── always-on orchestrator, 30min heartbeat
│
├── CTO ←── technical strategy, 60min heartbeat
│   ├── Architect ←── system design, code review
│   ├── Full-Stack Engineer ←── frontend + backend implementation
│   ├── QA Engineer ←── testing, quality
│   ├── DevOps Engineer ←── infra, CI/CD, deploys
│   └── UX Director (Gemini) ←── visual QA, UX flows, accessibility
│
├── Product Manager ←── PRDs, roadmap, 60min heartbeat
│   └── Design Lead ←── brand, design system, tokens
│
├── CMO ←── GTM strategy, 60min heartbeat
│   ├── Market Researcher ←── deep web research
│   └── Content & Growth Lead ←── content, SEO, campaigns
│
├── Finance Analyst ←── financial modeling (on-demand only)
├── Legal Counsel ←── compliance, contracts (on-demand only)
└── CS Lead ←── docs, support, onboarding
```

## What Was Modified in the Paperclip Fork

### Paperclip Core Fixes (Pre-TeamClip, Preserved)

These were bug fixes and features added to make Paperclip work. They exist as committed code in the git history and MUST be preserved:

| Fix | Files | Why |
|---|---|---|
| Gemini adapter — skills dir injection | `packages/adapters/gemini-local/src/server/execute.ts` | Original tmpdir approach broke OAuth |
| Gemini adapter — auth detection + turn limits | Multiple gemini-local files | Prevent stuck sessions |
| Gemini adapter — registration in adapter registry | `server/src/adapters/registry.ts` + 40 files | Enable Gemini support |
| Gemini adapter — Docker build entry | `Dockerfile` | Include in container builds |
| Gemini adapter — skills isolation | Multiple gemini-local files | Prevent ~/.gemini pollution |
| PAPERCLIP env injection | `server/src/services/heartbeat.ts` | Auto-inject PAPERCLIP_* env vars |
| PI adapter — skills flag + dropdown | pi-local + AgentConfigForm | Enable PI skill loading |
| PI adapter — tool result parsing | pi-local parse-stdout.ts | Clean tool name display |
| OpenCode HOME resolution | opencode-local models.ts | Fix Docker/Fly.io deployments |
| Adapter notices routing | All 6 local adapters | Separate info from errors |
| Orphaned heartbeat recovery | heartbeat.ts + adapters + migration 0038 | Prevent stuck runs |

### TeamClip Additions (2026-03-20)

| Addition | Location | Purpose |
|---|---|---|
| 15 agent doc sets (60 files) | `skills/teamclip/agents/{name}/` | AGENTS.md, HEARTBEAT.md, SOUL.md, TOOLS.md per agent |
| 8 process SOPs (183KB) | `skills/teamclip/references/processes/` | Adapted from Team's workflow docs |
| 5 issue templates | `skills/teamclip/references/templates/` | Milestone + task trees for SDLC and GTM phases |
| 8 gate templates | `skills/teamclip/references/templates/gates/` | Quality gate checklists |
| 4 Paperclip skills | `skills/discord-notify/`, `issue-templates/`, `web-research/`, `campaign-execute/` | Agent-loadable skills |
| TeamClip coordinator skill | `skills/teamclip/SKILL.md` | Org router — replaces Team's CLAUDE.md |
| Seed script | `packages/db/src/seed-teamclip.ts` | Creates RIC company + 15 agents + goals + projects |
| This documentation | `doc/teamclip/` | You are here |

## File Map

```
team_clip/team_clip/                     ← Paperclip fork root
├── skills/
│   ├── paperclip/                       ← Original Paperclip coordination skill
│   ├── paperclip-create-agent/          ← Original agent hiring skill
│   ├── para-memory-files/               ← Original PARA memory skill
│   ├── teamclip/                        ← NEW: TeamClip org coordinator
│   │   ├── SKILL.md                     ← Org router (index of everything)
│   │   ├── agents/                      ← 15 agent doc sets
│   │   │   ├── chief-of-staff/          ← AGENTS.md, HEARTBEAT.md, SOUL.md, TOOLS.md
│   │   │   ├── cto/
│   │   │   ├── architect/
│   │   │   ├── full-stack-engineer/
│   │   │   ├── qa-engineer/
│   │   │   ├── devops-engineer/
│   │   │   ├── ux-director/
│   │   │   ├── product-manager/
│   │   │   ├── design-lead/
│   │   │   ├── cmo/
│   │   │   ├── market-researcher/
│   │   │   ├── content-growth-lead/
│   │   │   ├── finance-analyst/
│   │   │   ├── legal-counsel/
│   │   │   └── cs-lead/
│   │   └── references/
│   │       ├── processes/               ← 8 adapted workflow SOPs
│   │       │   ├── engineering-sdlc.md
│   │       │   ├── gtm-lifecycle.md
│   │       │   ├── design-process.md
│   │       │   ├── finance-process.md
│   │       │   ├── legal-process.md
│   │       │   ├── cs-process.md
│   │       │   ├── devops-process.md
│   │       │   └── product-process.md
│   │       └── templates/               ← Issue + gate templates
│   │           ├── ideate-milestone.md
│   │           ├── decompose-milestone.md
│   │           ├── build-milestone.md
│   │           ├── gtm-research-milestone.md
│   │           ├── gtm-launch-milestone.md
│   │           └── gates/
│   │               ├── brand-review.md
│   │               ├── ux-review.md
│   │               ├── legal-review.md
│   │               ├── code-review.md
│   │               ├── deploy-gate.md
│   │               ├── launch-readiness.md
│   │               ├── pricing-gate.md
│   │               └── documentation-gate.md
│   ├── discord-notify/                  ← NEW: Discord webhook skill for CoS
│   ├── issue-templates/                 ← NEW: Structured issue tree creation
│   ├── web-research/                    ← NEW: Deep web research for Market Researcher
│   └── campaign-execute/                ← NEW: Campaign execution for Content & Growth
├── packages/db/src/
│   ├── seed.ts                          ← Original Paperclip seed (demo company)
│   └── seed-teamclip.ts                ← NEW: RIC company + 15 agents + goals
├── doc/teamclip/
│   ├── README.md                        ← You are here
│   ├── MIGRATION.md                     ← Migration from existing Paperclip instance
│   └── SETUP.md                         ← Fresh environment setup guide
└── ... (rest of Paperclip source)
```

## How Agents Get Their Docs

When an agent is created (via seed script or API), Paperclip creates a workspace directory at:
```
~/.paperclip/instances/default/workspaces/{agent-id}/
```

The agent's 4-doc set (AGENTS.md, HEARTBEAT.md, SOUL.md, TOOLS.md) from `skills/teamclip/agents/{name}/` gets injected into the agent's context via the `claude_local` adapter's `--add-dir` parameter, which symlinks skill directories into the agent's session.

Process docs and templates are referenced by HEARTBEAT.md (e.g., "See `processes/engineering-sdlc.md`") and loaded on demand through the skill system.

## Key Paperclip Concepts for Reference

| Concept | What It Is |
|---|---|
| **Heartbeat** | An execution window when an agent wakes, checks work, does tasks, goes back to sleep |
| **Adapter** | Runtime connector (claude_local, gemini_local, process, http) |
| **Checkout** | Atomic task claim — `POST /api/issues/{id}/checkout`. 409 if another agent owns it. |
| **Session persistence** | Claude Local preserves conversation context across heartbeats. Resets if cwd changes. |
| **Issue documents** | Keyed text on issues — `PUT /api/issues/{id}/documents/{key}`. Revisioned. Use for specs, PRDs, etc. |
| **Issue attachments** | Binary files on issues — `POST /api/issues/{id}/attachments`. Use for screenshots, Excel, etc. |
| **Activity log** | Append-only audit trail of all mutations — `GET /api/companies/{id}/activity` |

## Products

| Product | Goal | Project(s) | Status |
|---|---|---|---|
| TaskKnife | $10k MRR by Q3 2026 | TaskKnife v2, TaskKnife GTM | Active — v1 complete, v2 in development |
| IHAB | MVP launch by Q2 2026 | IHAB MVP | In development |
| Resy | Beta with 50 users by Q3 2026 | Resy Beta | Early development |

## Paperclip Instance

| Setting | Value |
|---|---|
| API URL | `http://192.168.1.8:3100` |
| Database | Embedded PostgreSQL on port 54329 |
| Storage | Local disk at `~/.paperclip/instances/default/data/storage` |
| Secrets | Local encrypted at `~/.paperclip/instances/default/secrets/master.key` |
| Auth | Better Auth (email/password sessions) |
| Config | `~/.paperclip/instances/default/config.json` |
