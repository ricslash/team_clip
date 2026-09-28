---
name: teamclip
description: >
  TeamClip organizational knowledge — org structure, agent roles, process docs,
  templates, and coordination patterns. Use when you need to understand who does
  what, where documentation lives, how work flows between agents, or how the
  multi-product goal hierarchy works. Do NOT use for Paperclip API calls (use
  the paperclip skill) or for domain work itself.
---

# TeamClip — Organization Index

TeamClip is the operating system for RIC, a single Paperclip company running 15 agents across 3 products. This document is the coordination map. Scan it to find where detail lives, then go read that detail.

## Org Structure

```
Eric (Human CEO)
├── Chief of Staff        — always-on orchestrator (30 min heartbeat)
├── CTO                   — technical strategy, architecture oversight
│   ├── Architect         — system design, API design, code review
│   ├── Full-Stack Engineer — cross-project floater, complex integrations
│   ├── TaskKnife Engineer — dedicated TaskKnife/FlowState SaaS development
│   ├── IHAB Engineer     — dedicated IHAB development
│   ├── Resy Engineer     — dedicated Resy development
│   ├── QA Engineer       — QA Lead, milestone-level testing coordination
│   │   ├── TaskKnife QA  — dedicated TaskKnife QA at milestone boundaries
│   │   ├── IHAB QA       — dedicated IHAB QA at milestone boundaries
│   │   └── Resy QA       — dedicated Resy QA at milestone boundaries
│   ├── DevOps Engineer   — infra, CI/CD, security, deploys
│   └── UX Director       — visual QA, UX flows, accessibility (Gemini adapter)
├── Product Manager       — PRDs, roadmap, prioritization
│   └── Design Lead       — brand, design system, design tokens
├── CMO                   — GTM strategy, positioning
│   ├── Market Researcher — deep web research, competitive analysis
│   └── Content & Growth Lead — content, SEO, social, campaigns
├── Finance Analyst       — financial modeling, pricing, reporting
├── Legal Counsel         — compliance, IP, contracts
└── CS Lead               — docs, support, onboarding, feedback
```

Managers (CoS, CTO, PM, CMO) have timed heartbeats. All others wake on assignment or on-demand only.

## Where Documentation Lives

### Agent Docs

Each agent has a 4-doc directory at `skills/teamclip/agents/{name}/`:

| Doc | Contains |
|---|---|
| `AGENTS.md` | Role definition, reporting chain, delegation targets, review responsibilities |
| `HEARTBEAT.md` | Per-wake checklist, phase awareness, handoff checks, process doc references |
| `SOUL.md` | Personality, decision principles, quality bar, communication style |
| `TOOLS.md` | Available MCP tools, adapter config, tool usage patterns |

Agent directory names: `chief-of-staff`, `cto`, `architect`, `full-stack-engineer`, `taskknife-engineer`, `ihab-engineer`, `resy-engineer`, `qa-engineer`, `taskknife-qa`, `ihab-qa`, `resy-qa`, `devops-engineer`, `ux-director`, `product-manager`, `design-lead`, `cmo`, `market-researcher`, `content-growth-lead`, `finance-analyst`, `legal-counsel`, `cs-lead`.

Per-project engineers and QA agents inherit from the shared `full-stack-engineer` and `qa-engineer` doc patterns until they have their own agent doc directories.

### Process Docs

Cross-agent workflow SOPs live at `skills/teamclip/references/processes/`:

- `engineering-sdlc.md` — build lifecycle, code standards, PR flow
- `gtm-lifecycle.md` — research, positioning, launch, growth
- `design-process.md` — design system, tokens, brand guidelines
- `product-process.md` — PRD lifecycle, prioritization framework
- `devops-process.md` — CI/CD, deploy gates, infra standards
- `finance-process.md` — modeling, pricing, reporting cadence
- `legal-process.md` — compliance checks, contract review, IP
- `cs-process.md` — docs, support, onboarding flows

Each agent's HEARTBEAT.md references the relevant process doc(s).

### Templates

- **Issue templates:** `skills/teamclip/references/templates/` — structured issue trees for milestones (ideate, decompose, build, gtm-research, gtm-launch)
- **Gate templates:** `templates/gates/` — checklist templates for the 8 quality gates

### Available Skills

| Skill | Used By | Purpose |
|---|---|---|
| `discord-notify` | Chief of Staff | Async alerts and escalations to Eric |
| `issue-templates` | All managers | Create structured issue trees from templates |
| `web-research` | Market Researcher | Deep web research via Firecrawl |
| `campaign-execute` | Content & Growth Lead | Reddit posts, email drafts, social content |

## Multi-Product Goal Structure

RIC is one company with multiple product goals. Never create separate companies per product.

```
Company: RIC
├── Goal: "TaskKnife — $10k MRR by Q3 2026"
│   ├── Project: "TaskKnife v2 — Projects Feature"
│   └── Project: "TaskKnife GTM — Organic Growth"
├── Goal: "IHAB — MVP launch by Q2 2026"
│   └── Project: "IHAB MVP"
└── Goal: "Resy — Beta with 50 users by Q3 2026"
    └── Project: "Resy Beta"
```

**Hierarchy:** Goal > Project > Milestone (issue) > Task (child issue) > Subtask (grandchild issue). Each level carries documentation proportional to its scope.

## Documentation-on-Issues Pattern

Descriptions are scannable summaries. Full content goes elsewhere:

| Mechanism | Use For | API |
|---|---|---|
| **Issue Documents** | Structured text — PRDs, specs, requirements, test plans. Keyed (`requirements`, `design`, `test-plan`), revisioned. | `PUT /api/issues/{id}/documents/{key}` |
| **Issue Attachments** | Binary files — screenshots, mockups, spreadsheets. | `POST /api/issues/{id}/attachments` |

Never put full specs in the description field. Descriptions summarize; documents and attachments carry the detail.

## Quality Gate System

8 gates, auto-created by Chief of Staff as blocking child issues when trigger conditions are met:

| Gate | Trigger | Reviewer |
|---|---|---|
| Brand Review | Issue tagged `public-facing` done | Design Lead |
| UX Review | Issue tagged `user-facing` done | UX Director |
| Legal Compliance | Issue tagged `public-facing` or `data-handling` done | Legal Counsel |
| Code Review | Issue tagged `code` done | Architect |
| Deploy Gate | Milestone 100% tasks done | DevOps Engineer |
| Launch Readiness | All goal milestones complete | Chief of Staff |
| Pricing Gate | Issue tagged `pricing` | Finance + PM + Legal |
| Documentation Gate | Milestone tagged `user-facing` | CS Lead + Architect |

Gate templates with full checklists are in `templates/gates/`.

## Peer Review Matrix

| Reviewer | Reviews | Checks |
|---|---|---|
| TaskKnife QA | TaskKnife Engineer | Tests, edge cases, regression |
| IHAB QA | IHAB Engineer | Tests, edge cases, regression |
| Resy QA | Resy Engineer | Tests, edge cases, regression |
| QA Engineer | Full-Stack Engineer | Tests, edge cases, regression (cross-project) |
| Architect | DevOps Engineer | Infra design, security posture |
| Architect | Full-Stack Engineer | Architecture compliance, structural quality |
| Architect | TaskKnife Engineer | Architecture compliance, structural quality |
| Architect | IHAB Engineer | Architecture compliance, structural quality |
| Architect | Resy Engineer | Architecture compliance, structural quality |
| UX Director | Full-Stack Engineer | Visual QA, UX flows, accessibility |
| UX Director | Content & Growth Lead | Landing pages, user-facing assets |
| UX Director | CS Lead | Help center UX, onboarding flows |
| Design Lead | Content & Growth Lead | Brand compliance, visual consistency |
| Design Lead | UX Director | Spec interpretation accuracy |
| Legal Counsel | Content & Growth Lead | Public-facing copy compliance |
| Legal Counsel | Finance Analyst | Pricing terms, ToS implications |

## Workspace Configuration

**Universal fallback cwd:** `/home/eric/dev/` — every shared agent lands here by default. No agent should ever land in the Paperclip server directory.

**Per-project engineers and QA** have project-specific cwds baked in. They never need workspace overrides — they always work in their product repo.

| Project | Dedicated Engineer CWD | Dedicated QA CWD |
|---|---|---|
| TaskKnife v2 | `/home/eric/dev/flowstate-saas/` | `/home/eric/dev/flowstate-saas/` |
| IHAB MVP | `/home/eric/dev/ihab/repo/ihab_mvp/` | `/home/eric/dev/ihab/repo/ihab_mvp/` |
| Resy Beta | `/home/eric/dev/resy/repo/resy-tool/` | `/home/eric/dev/resy/repo/resy-tool/` |

**Project workspace overrides** still apply to shared execution agents (Architect, Full-Stack Engineer, DevOps, UX Director, Design Lead, Content & Growth, CS Lead) when working tasks scoped to a specific product project. The task's project workspace injects the correct repo path.

**Cross-product agents** (CoS, CTO, PM, CMO, Market Researcher, Finance, Legal) always use the fallback — they need visibility across all products.

| Project | Shared Agent Workspace cwd |
|---|---|
| TaskKnife v2 | `/home/eric/dev/flowstate-saas/` |
| TaskKnife GTM | `/home/eric/dev/Team/products/flowstate/` |
| IHAB MVP | `/home/eric/dev/ihab/` |
| Resy Beta | `/home/eric/dev/resy/` |

**Session continuity:** When assigning consecutive tasks to execution agents, prefer batching by product to minimize session restarts. Urgent cross-product work takes priority over batching.
