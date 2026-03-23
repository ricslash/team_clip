# Paperclip -- Architecture Documentation
_Last updated: 2026-03-23_

---

## 1. System Overview

Paperclip is a self-hosted platform that orchestrates AI agents to run business operations. It is structured as a pnpm monorepo containing an Express 5.1 server, a React 19 single-page application, a CLI, and a collection of shared packages (database schemas, adapter implementations, plugin SDK, and shared types). The system manages a hierarchy of Goals, Projects, and Issues that agents work on autonomously, governed by heartbeat-driven execution cycles, budget policies, and human approval gates.

The server acts as the central coordinator: it schedules agent heartbeats, dispatches work via adapter processes (Claude Code, Codex, Cursor, Gemini, OpenCode, Pi, OpenClaw), manages a plugin system with scheduled jobs and inbound webhooks, and pushes real-time events to connected browser clients over WebSocket. All data is stored in PostgreSQL -- either an external instance or an embedded PostgreSQL server that Paperclip manages automatically for local development.

Multi-tenancy is achieved through company-scoped data isolation. Every core entity (agents, projects, issues, secrets, costs) carries a `company_id` foreign key. Authentication supports two deployment modes: `local_trusted` (implicit loopback access) and `authenticated` (Better Auth with email/password and OAuth, plus agent JWT and API key authentication).

---

## 2. Architecture Diagram

```
 +------------------+       +------------------+       +---------------------+
 |   Browser / UI   |       |   CLI (paperclip) |       | External Webhooks   |
 |  React 19 + Vite |       |   tsx entrypoint  |       | (plugin endpoints)  |
 +--------+---------+       +--------+---------+       +----------+----------+
          |                          |                             |
          | HTTP / WS                | HTTP                        | HTTP POST
          v                          v                             v
 +--------+----------------------------------------------------------+---------+
 |                        Express 5.1 Server (Node.js)                         |
 |                                                                             |
 |  +-- Middleware -------------------------------------------------------+    |
 |  |  httpLogger -> privateHostnameGuard -> actorMiddleware              |    |
 |  |  -> boardMutationGuard -> errorHandler                             |    |
 |  +--------------------------------------------------------------------|    |
 |                                                                             |
 |  +-- API Routes (/api) -----------------------------------------------+    |
 |  |  /health   /companies   /agents   /projects   /issues   /goals      |    |
 |  |  /approvals  /secrets  /costs  /activity  /dashboard  /plugins      |    |
 |  |  /assets  /access  /instance-settings  /sidebar-badges             |    |
 |  |  /execution-workspaces  /llms                                       |    |
 |  +--------------------------------------------------------------------+    |
 |                                                                             |
 |  +-- Auth Routes (/api/auth) -----------------------------------------+    |
 |  |  /api/auth/get-session   /api/auth/* (Better Auth handler)          |    |
 |  +--------------------------------------------------------------------+    |
 |                                                                             |
 |  +-- Plugin System ---------------------------------------------------+    |
 |  |  PluginLoader -> PluginWorkerManager (child_process workers)        |    |
 |  |  PluginJobScheduler (cron) -> PluginJobCoordinator                  |    |
 |  |  PluginToolDispatcher -> PluginEventBus -> PluginHostServices       |    |
 |  |  PluginRegistryService -> PluginLifecycleManager                    |    |
 |  |  PluginDevWatcher (vite-dev mode only)                              |    |
 |  +--------------------------------------------------------------------+    |
 |                                                                             |
 |  +-- Services ---------------------------------------------------------+   |
 |  |  HeartbeatService (timer-driven agent execution)                     |   |
 |  |  StorageService (local_disk | S3)                                    |   |
 |  |  LiveEventsWebSocketServer (ws 8.19, real-time push)                |   |
 |  |  BetterAuth (authenticated mode) | LocalTrusted (loopback mode)     |   |
 |  +---------------------------------------------------------------------+   |
 |                                                                             |
 +------+-----------------------------+----------------------------+-----------+
        |                             |                            |
        v                             v                            v
 +------+--------+          +---------+----------+       +---------+----------+
 |  PostgreSQL    |          |  Adapter Processes |       |  File Storage      |
 |  (external or  |          |  claude-local      |       |  local_disk / S3   |
 |   embedded)    |          |  codex-local       |       +--------------------+
 |                |          |  cursor-local      |
 | Drizzle ORM    |          |  gemini-local      |
 | 54+ tables     |          |  opencode-local    |
 +----------------+          |  pi-local          |
                             |  openclaw-gateway  |
                             +--------------------+
```

---

## 3. Component Inventory

| Component | Technology | Purpose | Port | Source Directory |
|---|---|---|---|---|
| Server | Express 5.1.0, TypeScript 5.7.3 | REST API, WebSocket, heartbeat scheduler, plugin host | 3100 (default) | `server/` |
| UI | React 19, React Router 7, TanStack Query 5, Vite 6, TailwindCSS 4 | SPA dashboard for managing agents, issues, projects | served via server | `ui/` |
| CLI | TypeScript, tsx | Command-line interface for Paperclip operations | n/a | `cli/` |
| Database Package | Drizzle ORM, postgres.js | Schema definitions, migrations, DB client | n/a | `packages/db/` |
| Shared Package | TypeScript, Zod | Types, constants, config schema, validation | n/a | `packages/shared/` |
| Adapter Utils | TypeScript | Shared utilities for adapter implementations | n/a | `packages/adapter-utils/` |
| Claude Local Adapter | TypeScript | Adapter for Claude Code (Anthropic) | n/a | `packages/adapters/claude-local/` |
| Codex Local Adapter | TypeScript | Adapter for OpenAI Codex | n/a | `packages/adapters/codex-local/` |
| Cursor Local Adapter | TypeScript | Adapter for Cursor editor agent | n/a | `packages/adapters/cursor-local/` |
| Gemini Local Adapter | TypeScript | Adapter for Google Gemini | n/a | `packages/adapters/gemini-local/` |
| OpenCode Local Adapter | TypeScript | Adapter for opencode-ai | n/a | `packages/adapters/opencode-local/` |
| Pi Local Adapter | TypeScript | Adapter for Pi agent | n/a | `packages/adapters/pi-local/` |
| OpenClaw Gateway Adapter | TypeScript | Gateway adapter for OpenClaw | n/a | `packages/adapters/openclaw-gateway/` |
| Plugin SDK | TypeScript | SDK for building Paperclip plugins (`@paperclipai/plugin-sdk`) | n/a | (plugin-sdk package) |
| PostgreSQL | PostgreSQL 17 (Alpine, Docker) or embedded-postgres | Persistent data storage | 5432 (Docker) / 54329 (embedded) | n/a |
| WebSocket | ws 8.19 | Real-time live events push to browser clients | shares server port | `server/src/realtime/` |

---

## 4. Data Flows

### Agent Heartbeat Flow

1. The `HeartbeatService` runs on a configurable interval (default 30s, min 10s) via `setInterval`.
2. On each tick, `tickTimers()` evaluates all agents and enqueues heartbeat runs for agents whose timers have elapsed.
3. At startup, `reapOrphanedRuns()` marks stale `running` runs as failed (5-min staleness threshold), then `resumeQueuedRuns()` picks up any persisted queued work.
4. A heartbeat run is created in the `heartbeat_runs` table with status `queued`.
5. The appropriate adapter (based on `agent.adapterType`) spawns a child process to execute the agent's task.
6. The adapter process reports results (usage, exit code, stdout/stderr, session state) back to the server.
7. The run row is updated to `succeeded` or `failed`; `agent_runtime_state` is updated with token/cost totals.
8. `heartbeat_run_events` captures streaming events during the run.
9. Real-time WebSocket events are broadcast to connected UI clients.
10. Periodically, `reapOrphanedRuns()` and `resumeQueuedRuns()` run to ensure forward progress.

### Issue Lifecycle

1. An issue is created (by a user via UI/API, or by an agent) in status `backlog`.
2. The issue may be assigned to an agent (`assignee_agent_id`) and linked to a project.
3. When work begins, the agent's heartbeat picks up the issue; status moves to `in_progress`, `started_at` is set.
4. The agent may create execution workspaces, produce work products (PRs, deployments tracked in `issue_work_products`), and post comments.
5. If approvals are required, `issue_approvals` links the issue to an `approvals` record; the issue blocks until approved.
6. On completion, status moves to `done` and `completed_at` is set.
7. Issues support parent-child relationships (`parent_id` self-reference), labels, attachments, documents, and read states.
8. Cost events are recorded for each LLM call during the agent run, linked to the issue via `cost_events`.

### Approval Flow

1. An agent or system event creates an `approvals` row with status `pending` and a typed payload.
2. The approval is linked to an issue via `issue_approvals` (or stands alone for budget/agent creation approvals).
3. Users or agents can add `approval_comments`.
4. A user decides (approve/reject), setting `decided_by_user_id`, `decided_at`, `decision_note`, and updating status.
5. Budget incidents (`budget_incidents`) can trigger automatic approval requests when spend thresholds are crossed.
6. The agent is notified of the decision on its next heartbeat run.

---

## 5. Technology Stack

### Frontend
- **React 19** with React Router 7 for client-side routing
- **TanStack Query 5** for server state management
- **Vite 6** for dev server (HMR) and production builds
- **TailwindCSS 4** for styling
- UI branding applied at index.html serve time via `applyUiBranding()`
- In dev mode, Vite runs as middleware inside the Express server; HMR uses a separate port (server port + 10,000, via `resolveViteHmrPort()`)

### Backend
- **Express 5.1.0** (ESM, async route handlers) with JSON body parsing and raw body capture for webhook signature verification
- **TypeScript 5.7.3** compiled via tsx/esbuild
- **Drizzle ORM** with postgres.js driver for type-safe SQL
- **ws 8.19** for WebSocket real-time events
- **Better Auth 1.4.18** for user authentication (authenticated mode)
- **Pino** (via httpLogger) for structured JSON logging
- **detect-port** for automatic port conflict resolution
- **Plugin system**: child_process workers with JSON-RPC-style messaging via `@paperclipai/plugin-sdk` (`createHostClientHandlers`), cron-based job scheduling, inbound webhook delivery, scoped state storage

### Infrastructure
- **pnpm 9.15.4** workspaces for monorepo management
- **Docker**: multi-stage Dockerfile (`node:lts-trixie-slim` base -> deps -> build -> production)
- **docker-compose.yml**: PostgreSQL 17 Alpine + server service with health checks
- **Embedded PostgreSQL** (`embedded-postgres` npm) for zero-config local development (default port 54329)
- **Node.js >= 20** required
- Volumes: `/paperclip` for data, `pgdata` for database in Docker
- Production image installs `@anthropic-ai/claude-code`, `@openai/codex`, and `opencode-ai` globally

---

## 6. Security Architecture

### Authentication Layers

1. **Deployment Mode: `local_trusted`** -- Loopback-only binding (127.0.0.1/localhost/::1) enforced at startup. An implicit `local-board` user with `instance_admin` role is automatically provisioned with `owner` membership on all companies. No login required. Private exposure enforced.

2. **Deployment Mode: `authenticated`** -- Full Better Auth stack with email/password credentials. Requires `BETTER_AUTH_SECRET`. Supports trusted origins configuration for CORS/CSRF protection. OAuth providers via `account` table. Derived and explicit trusted origins are merged.

3. **Agent Authentication** -- Agents authenticate via:
   - **API Keys**: SHA-256 hashed keys stored in `agent_api_keys`, scoped to a specific agent and company.
   - **JWT tokens**: Signed with `PAPERCLIP_AGENT_JWT_SECRET`, configurable TTL (default 48h), issuer (`paperclip`), and audience (`paperclip-api`).

4. **Board Claim Challenge** -- When transitioning from `local_trusted` to `authenticated`, a one-time claim URL is generated so a real user can take ownership from the implicit local-board principal.

### Network Security

- **Private Hostname Guard**: When `deploymentMode=authenticated` and `deploymentExposure=private`, requests are filtered by hostname allowlist derived from `PAPERCLIP_ALLOWED_HOSTNAMES`, bind host, and public URL hostname.
- **Board Mutation Guard**: Prevents unauthorized mutations from non-board actors.
- **Actor Middleware**: Resolves the request actor (board user via Better Auth session, agent via JWT/API key, or local implicit) and attaches it to the request context on every request.

### Data Security

- **Secrets Management**: Company secrets are encrypted at rest via the `local_encrypted` provider using a master key file. Strict mode optionally prevents plaintext fallback. Secret versions are tracked with SHA-256 hashes and revocation timestamps.
- **Per-company isolation**: All queries are scoped by `company_id`; cross-company access is prevented at the data layer.
- **Permission Grants**: Fine-grained permissions via `principal_permission_grants` table keyed by (company, principal_type, principal_id, permission_key).
- **Log Redaction**: Agent output is sanitized to remove usernames, home directory paths, and sensitive environment values.

---

## 7. Cross-Cutting Concerns

### Logging
- Structured JSON logging via Pino (`httpLogger` middleware for request/response, `logger` singleton for application events).
- Log directory configurable via `PAPERCLIP_LOG_DIR`.
- Plugin logs are stored in the `plugin_logs` table and exposed via the operator logs panel.
- Heartbeat run events stream structured log entries to `heartbeat_run_events` (with sequence numbers for ordering).
- Run logs are stored to local disk or S3 with optional compression, referenced by `log_store`/`log_ref` in `heartbeat_runs`.
- Log redaction sanitizes usernames, home directory paths, and sensitive tokens from agent output.

### Error Handling
- Express `errorHandler` middleware catches unhandled errors and returns structured JSON error responses.
- API 404 catch-all at `/api` returns `{ error: "API route not found" }`.
- Plugin worker failures are captured in `plugins.last_error` and `plugin_config.last_error`.
- Agent run failures are recorded in `heartbeat_runs.error`, `heartbeat_runs.error_code`, and `heartbeat_runs.stderr_excerpt`.
- Startup validation throws on invalid configuration combinations (e.g., `local_trusted` with non-loopback host, `authenticated` without secret).
- Embedded PostgreSQL failures are logged with buffered startup logs for diagnosis.

### Real-Time Events
- The `LiveEventsWebSocketServer` (built on `ws 8.19`) upgrades HTTP connections on the existing server port via `setupLiveEventsWebSocketServer()`.
- Events are pushed to connected clients for live dashboard updates (agent status changes, run progress, issue transitions, approval notifications).
- In `authenticated` mode, WebSocket connections are validated using `resolveSessionFromHeaders` (Better Auth session resolution from headers).
- The `PluginEventBus` distributes plugin-originated events to the activity log and WebSocket subscribers.

### Database Backups
- Automatic backups run on a configurable interval (default: every 60 minutes) via `runDatabaseBackup()`.
- Configurable retention policy (default: 30 days) with automatic pruning of old backups.
- Backup directory configurable via `PAPERCLIP_DB_BACKUP_DIR`.
- Controlled by `PAPERCLIP_DB_BACKUP_ENABLED` (default `true`).
- Guard against concurrent backup runs (skips if previous backup is still in flight).

### Plugin System
- Plugins are loaded on startup from a local directory via `pluginLoader.loadAll()`.
- Each plugin runs as an isolated worker process managed by `PluginWorkerManager`.
- Communication uses JSON-RPC via `createHostClientHandlers` from `@paperclipai/plugin-sdk`.
- Plugin lifecycle managed by `PluginLifecycleManager`: `installed` -> `ready` -> `active` (or `error`).
- Plugin capabilities: scheduled jobs (cron via `PluginJobScheduler`), tools (exposed to agent runs via `PluginToolDispatcher`), UI slots (static files served via `pluginUiStaticRoutes`), webhooks, scoped state storage.
- `PluginJobCoordinator` coordinates job scheduling with lifecycle state.
- `PluginDevWatcher` watches plugin source directories for hot-reload during `vite-dev` mode.
- Host service cleanup is managed by `PluginHostServiceCleanup` on process exit.
- Plugin log buffers are flushed on `beforeExit`.

### Migration Management
- Drizzle Kit generates SQL migration files in `packages/db/src/migrations/`.
- On startup, the server inspects migration state via `inspectMigrations()` and can auto-apply pending migrations (or prompt interactively).
- A reconciliation system (`reconcilePendingMigrationHistory()`) detects and repairs drifted migration journal entries by matching existing schema state (tables, columns, indexes, constraints) against migration DDL statements.
- First-run embedded PostgreSQL setups auto-apply all migrations without prompting.
