# Paperclip — Release Notes

_Last updated: 2026-03-23_

---

## Current Version

The Paperclip monorepo does not declare a single top-level version in `package.json`. The most recent tagged release is **v2026.318.0** (released 2026-03-18). Previous releases: v0.3.1 (2026-03-12), v0.3.0 (2026-03-09), v0.2.7 (2026-03-04).

---

## v2026.318.0 — 2026-03-18

### Highlights

- **Plugin framework and SDK** — Full plugin system with runtime lifecycle management, CLI tooling, settings UI, breadcrumb and slot extensibility, domain event bridge, and a Plugin SDK with document CRUD methods and a testing harness.
- **Upgraded costs and budgeting** — Improved cost tracking and budget management surfaces with provider/agent breakdowns, budget policies, incident tracking, and date range filtering.
- **Issue documents and attachments** — Issues now support inline document editing, file staging before creation, deep-linked documents, copy and download actions, and live-event refresh.
- **Hermes agent adapter** — New `hermes_local` adapter for the Hermes CLI as an agent backend.
- **Execution workspaces (experimental)** — Isolated execution workspaces for agent runs with workspace operation tracking, reusable workspace deduplication, and work product management. Project-level workspace policies are configurable.
- **Heartbeat token optimization** — Heartbeat cycles now skip redundant token usage.

### Improvements

- Session compaction is adapter-aware, respecting per-adapter context limits.
- Company logos — Upload and display company logos with SVG sanitization.
- App version label in the sidebar.
- Project tab caching — Active tab is remembered per-project.
- Copy-to-clipboard on issue detail headers.
- Me and Unassigned quick-filter options in the assignee picker.
- New issue dialog skips pre-filled fields in tab order.
- Worktree cleanup command and auto-prefix for worktree branches.
- Automated canary and stable release workflows with npm trusted publishing and provenance.
- Sidebar documentation link points to docs.paperclip.ing.
- Onboarding starter task delay — tasks are not created until launch.

### Fixes

- Embedded PostgreSQL hardening for startup, data-dir verification, and UTF-8 encoding.
- `os.userInfo()` guard for containers with UID-only users.
- `dotenv` loads from `cwd` when `.paperclip/.env` is missing.
- Plugin event subscription cleanup and filter nullability.
- Plugin slot registration and rendering corrections.
- Archive project navigates to dashboard with toast confirmation.
- Markdown editor image spacing and header margins.
- Legacy migration reconciliation for existing installations.
- Agent HOME env var set correctly for child processes.
- Various UI fixes: sidebar scrollbar, sticky save bar, empty goals display, runs page padding.

### Database Migrations

Migrations 0028-0037 run automatically on startup. All additive (new tables and columns) — no existing data is modified.

---

## v0.3.1 — 2026-03-12

### Highlights

- **Gemini CLI adapter** — Full local adapter support for Google's Gemini CLI with API-key detection, turn-limit handling, sandbox and approval modes, skill injection, and yolo-mode default.
- **Run transcript polish** — Markdown rendering, stdout folding, home path redaction, user identity redaction, and humanized event labels.
- **Inbox refinements** — Improved tab behavior, badge counts aligned with visible unread items, better mobile layout.
- **Improved onboarding wizard** — Claude Code and Codex shown as recommended adapters, other types collapsed, animated step transitions with clickable tabs, animated environment checks.

### Improvements

- Instance heartbeat settings sidebar with grouped run lists.
- Project and agent configuration tabs with execution workspace policy settings.
- Agent runs tab on detail pages.
- Configurable attachment content types via `PAPERCLIP_ALLOWED_ATTACHMENT_TYPES`.
- Default max turns raised to 300.
- Issue creator shown in the properties sidebar.
- Company-aware 404 handling.
- Worktree workflow tools: `paperclipai worktree:make` with database isolation, secrets, favicon branding, and git hooks.

### Fixes

- Gemini adapter included in Docker build.
- Approval retries made idempotent (no duplicate records).
- Heartbeat costs routed through `costService` for correct attribution.
- Claude Code env var leak fixed for child adapter processes.
- `parentId` query filter applied correctly on issues list endpoint.
- Removed `Cmd+1..9` shortcut that conflicted with browser tab switching.
- IME composition Enter no longer causes premature focus change.
- Restart hint after hostname change in CLI.
- Default `dangerouslySkipPermissions` for unattended agents.
- Issue description overflow, worktree JWT persistence, dev migration prompt, markdown link dialog positioning, and pretty logger metadata fixes.

### Database Migrations

Migrations 0026-0027 run automatically. Adds `workspace_runtime_services` table and `execution_workspace_settings`/`execution_workspace_policy` columns.

---

## v0.3.0 — 2026-03-09

### Highlights

- **New adapters: Cursor, OpenCode, and Pi** — Three additional local coding agents with model discovery, run-log streaming, and skill injection.
- **OpenClaw gateway adapter** — Gateway-only flow with strict SSE streaming, device-key pairing, and invite-based onboarding.
- **Inbox and unread semantics** — Per-user read state, unread indicators in inbox/dashboard/browser tab, alert-focused inbox ordering.
- **PWA support** — Installable Progressive Web App with network-first service worker.
- **Agent creation wizard** — New choice modal and full-page configuration flow with sidebar quick-add button.

### Improvements

- Mermaid diagram rendering in markdown.
- Live run output streaming over WebSocket.
- Copy comment as Markdown.
- Retry button for failed and timed-out runs.
- Clickable project status chip.
- Scroll-to-bottom button on issue detail and run pages.
- Database backup CLI (`paperclipai db:backup`).
- Disable sign-up option (`AUTH_DISABLE_SIGNUP`).
- Deduplicated shortnames on create/update.
- Human-readable role labels.
- Assignee picker sorted by recent then alphabetical.
- Mobile layout polish with unified issue rows.
- Invite UX improvements with auto-copy, 10-minute TTL, network-host guidance.
- Permalink anchors on comments.
- Docker deployment hardening: authenticated mode default, named data volume, health-check DB wait, Node 24 base image.
- Updated model lists: claude-sonnet-4-6, claude-haiku-4-6, gpt-5.4.
- Playwright end-to-end test suite for onboarding.

### Fixes

- Secret redaction in run logs by provenance.
- SPA catch-all no longer returns 500 errors.
- Unmatched API routes return 404 JSON.
- Agent wake logic: skip self-wake, skip backlog-status wakeups, exclude pending-approval agents from heartbeat timers.
- Run log file-descriptor leak fixed.
- Boolean env parsing corrected.
- Windows path compatibility for migrations.
- Secure cookies disabled for plain HTTP deployments.
- URL encoding fix for query parameters.
- Auth trusted origins applied correctly.
- UI stability: blank screen on empty templates, search re-renders, inbox title overflow, sidebar badge counts.

---

## v0.2.7 — 2026-03-04

### Improvements

- Onboarding resilience — Setup wizard continues after failed environment tests instead of getting stuck.
- Docker onboarding flow — Cleaner defaults for Docker smoke tests and improved console guidance.
- Issue search in skills — `q=` parameter documented for finding issues by keyword.

### Fixes

- Markdown list rendering fixed for `-` and `*` markers.
- Archived companies hidden from the new issue dialog.
- Embedded Postgres dependency correctly required in embedded DB mode.

---

## Feature Summary (as of v2026.318.0)

### Core Platform

| Feature | Description |
|---------|-------------|
| Multi-company | One deployment runs unlimited companies with complete data isolation |
| Org chart | Hierarchical agent structure with roles, titles, and reporting lines |
| Goal alignment | Goals cascade to projects, then to issues — agents always know the "why" |
| Heartbeat scheduling | Agents wake on schedule, check for work, and act autonomously |
| Atomic execution | Task checkout and budget enforcement are atomic — no double-work |
| Persistent agent state | Agents resume task context across heartbeats instead of restarting |
| Governance | Approval gates, config revision history, rollback support |
| Cost control | Monthly budgets per agent/project, automatic pause on overspend |
| Audit trail | Full tool-call tracing, immutable event log, comment permalinks |

### Agent Adapters

| Adapter | Type |
|---------|------|
| Claude Code | Local CLI |
| Codex | Local CLI |
| Gemini | Local CLI |
| OpenCode | Local CLI |
| Cursor | Local IDE |
| Hermes | Local CLI |
| Pi | Local RPC |
| OpenClaw Gateway | SSE gateway |
| Process | Generic process |
| HTTP | HTTP endpoint |

### UI and UX

| Feature | Description |
|---------|-------------|
| Dashboard | Summary metrics, charts, recent activity, recent tasks |
| Issues | List/board views, search, assignee filter, live run indicators, documents/attachments |
| Projects | Overview, issues, configuration, budget tabs |
| Goals | Tree view, nested hierarchy, linked projects |
| Approvals | Pending/all tabs, approve/reject/resubmit, comments |
| Costs | Provider/agent breakdowns, budget policies, incidents, date range filtering |
| Inbox | Unread tracking, recent/unread/all tabs, browser tab badge |
| Activity | Chronological event feed |
| Org chart | Visual agent hierarchy |
| Agent detail | Overview, configuration, runs, budget tabs, live run streaming |
| Plugin manager | Install/uninstall/enable/disable, settings, two-step uninstall confirmation |
| Instance settings | Heartbeat management, experimental features |
| PWA | Installable on mobile and desktop |
| Responsive design | Full mobile support |

### CLI

| Command | Description |
|---------|-------------|
| `npx paperclipai onboard` | Quick-start setup |
| `paperclipai auth bootstrap-ceo` | Create first admin account |
| `paperclipai db:backup` | Snapshot the database |
| `paperclipai worktree:make` | Provision isolated dev instances |
| `paperclipai worktree:cleanup` | Clean up worktree instances |

### Integrations

| Integration | Description |
|------------|-------------|
| Plugin SDK | Document CRUD, event bridge, UI slots, settings, testing harness |
| WebSocket | Live run output streaming |
| Execution workspaces | Isolated agent run environments (experimental) |
