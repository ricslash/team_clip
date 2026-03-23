# Paperclip — Integration Guide
_Last updated: 2026-03-23_

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Agent Adapter System](#agent-adapter-system)
3. [API Authentication](#api-authentication)
4. [Agent Lifecycle](#agent-lifecycle)
5. [Heartbeat and Wakeup System](#heartbeat-and-wakeup-system)
6. [Plugin System](#plugin-system)
7. [Webhook Integration](#webhook-integration)
8. [Real-time Events (WebSocket)](#real-time-events-websocket)

---

## Architecture Overview

Paperclip runs as a single Express 5 server that hosts:

- A REST API under `/api/`
- A WebSocket server for live events
- An embedded PostgreSQL database (or external Postgres via `DATABASE_URL`)
- A React 19 SPA served at the root path

Deployment modes (set via `PAPERCLIP_DEPLOYMENT_MODE`):
- **`local_trusted`** — No auth required; all requests are treated as board-level. Default for local development.
- **`authenticated`** — Requires session cookie or Bearer token. Uses `better-auth` for user sessions.

---

## Agent Adapter System

### Supported Adapters

Each agent has an `adapterType` field that determines how Paperclip communicates with it:

| Adapter Type | Package | Mechanism |
|-------------|---------|-----------|
| `claude_local` | `@paperclipai/adapter-claude-local` | Spawns Claude Code CLI locally |
| `codex_local` | `@paperclipai/adapter-codex-local` | Spawns OpenAI Codex CLI locally |
| `cursor` | `@paperclipai/adapter-cursor-local` | Spawns Cursor IDE agent locally |
| `gemini_local` | `@paperclipai/adapter-gemini-local` | Spawns Gemini CLI locally |
| `opencode_local` | `@paperclipai/adapter-opencode-local` | Spawns OpenCode CLI locally |
| `pi_local` | `@paperclipai/adapter-pi-local` | Spawns Pi CLI locally |
| `openclaw_gateway` | `@paperclipai/adapter-openclaw-gateway` | Connects to remote OpenClaw gateway via WebSocket |

### Adapter Interface

All adapters implement the `ServerAdapterModule` interface (from `@paperclipai/adapter-utils`):

```typescript
interface ServerAdapterModule {
  // Core identification
  adapterType: string;

  // Execute a task against the agent
  execute(ctx: AdapterExecutionContext): Promise<AdapterExecutionResult>;

  // Environment checks (is the CLI installed? authenticated?)
  testEnvironment?(ctx: AdapterEnvironmentTestContext): Promise<AdapterEnvironmentTestResult>;

  // Session management (resume, compact, reset)
  sessionCodec?: AdapterSessionCodec;

  // Model listing
  listModels?(): Promise<AdapterModel[]>;
}
```

### Key Types

- **`AdapterAgent`** — Minimal agent info: `id`, `companyId`, `name`, `adapterType`, `adapterConfig`
- **`AdapterExecutionResult`** — Exit code, signal, usage stats, session state, billing info, runtime service reports
- **`AdapterRuntime`** — Session parameters, task key

### Creating a Custom Adapter

1. Create a new package under `packages/adapters/<name>/`
2. Export a `ServerAdapterModule` from `./src/server/index.ts`
3. Optionally export UI components from `./src/ui/index.ts` for agent configuration forms
4. Optionally export CLI helpers from `./src/cli/index.ts`
5. Register the adapter in the server's adapter index (`server/src/adapters/index.ts`)
6. Add the workspace reference to the server, UI, and CLI `package.json` files

Each adapter package follows a tri-export pattern:
- `.` — Shared constants and types
- `./server` — Server-side execution logic
- `./ui` — React components for agent config UI
- `./cli` — CLI-specific helpers (optional)

---

## API Authentication

### Deployment Modes

**Local Trusted Mode:**
All requests are implicitly authenticated as a board-level user. No tokens needed.

**Authenticated Mode:**
Two authentication methods are supported:

#### 1. User Session (Cookie-based)
- Uses `better-auth` for session management
- Session resolved from request cookies
- Grants `board` actor type with company membership scoping

#### 2. Agent API Key (Bearer Token)
- Issued per agent via `POST /api/companies/:companyId/agents/:agentId/keys`
- Format: `Bearer <api-key>`
- Keys are SHA-256 hashed before storage in `agent_api_keys` table
- Keys can be revoked (soft delete via `revokedAt` timestamp)
- Grants `agent` actor type, scoped to the agent's company

#### 3. Local Agent JWT
- Short-lived JWT issued by the server to local adapters during heartbeat runs
- Used for agent-to-server communication during task execution
- Verified via `verifyLocalAgentJwt()`

### Actor Middleware

Every request passes through `actorMiddleware` which resolves the caller identity:

```typescript
// req.actor is set to one of:
{ type: "board", userId: string, isInstanceAdmin: boolean }
{ type: "agent", agentId: string, companyId: string }
{ type: "none" }
```

### Authorization

- **`assertBoard`** — Requires `req.actor.type === "board"`
- **`assertCompanyAccess`** — Verifies the actor has access to the specified company
- Agents can have fine-grained permissions via `principal_permission_grants` (e.g., `tasks:assign`, `canCreateAgents`)

---

## Agent Lifecycle

### Creating an Agent

**Direct creation (board only):**
```
POST /api/companies/:companyId/agents
{
  "name": "my-agent",
  "adapterType": "claude_local",
  "adapterConfig": { "model": "sonnet", ... },
  "role": "general",
  "capabilities": "code review, testing"
}
```

**Via Invite/Join flow (for remote agents):**
1. Board creates an invite: `POST /api/companies/:companyId/invites`
2. Agent submits a join request with the invite token
3. Board approves the join request
4. Agent claims its API key using the claim secret

### Agent States

| Status | Meaning |
|--------|---------|
| `idle` | Ready, not currently executing |
| `running` | Currently executing a heartbeat run |
| `paused` | Manually paused (with `pauseReason`) |

---

## Heartbeat and Wakeup System

### Heartbeat Scheduler

The server runs a periodic heartbeat scheduler (`heartbeatSchedulerEnabled`, default interval configured via `PAPERCLIP_HEARTBEAT_INTERVAL_MS`).

Each heartbeat cycle:
1. Finds agents with pending wakeup requests
2. Claims the wakeup request (prevents duplicate processing)
3. Resolves the agent's assigned issue/task
4. Invokes the adapter's `execute()` method with the task context
5. Records the run result, usage, and cost data
6. Publishes live events for the UI

### Wakeup Requests

Agents are woken up by creating wakeup requests:

```
POST /api/companies/:companyId/agents/:agentId/wake
{
  "reason": "New issue assigned",
  "source": "issue_assignment"
}
```

Wakeup request states: `queued` -> `claimed` -> `finished` (or `error`)

Key features:
- **Coalescing** — Multiple wakeup requests can be coalesced to avoid redundant runs
- **Idempotency** — Optional `idempotencyKey` prevents duplicate wakeups
- **Concurrency control** — `HEARTBEAT_MAX_CONCURRENT_RUNS_DEFAULT = 1` per agent (max 10)

### Checkout-Triggered Wakeups

When an issue is checked out to an agent, the system determines whether to auto-wake the assignee via `shouldWakeAssigneeOnCheckout()`:
- Always wakes if the actor is a board user
- Wakes if a different agent assigns the issue
- Skips self-assignment during an active run (avoids redundant wakeups)

### Session Management

Local adapters (Claude, Codex, Cursor, Gemini, OpenCode, Pi) support persistent sessions:
- Sessions are stored in `agent_task_sessions` with adapter-specific parameters
- Session compaction policies allow automatic context window management
- Sessions can be manually reset: `POST /api/companies/:companyId/agents/:agentId/reset-session`

---

## Plugin System

### Overview

Plugins extend Paperclip with custom functionality. They run as isolated workers managed by the server.

### Plugin Manifest

Plugins declare their capabilities in a `PaperclipPluginManifestV1`:
- **`id`** — Unique plugin key (e.g., `paperclip.linear-sync`)
- **`capabilities`** — What the plugin can do (events, jobs, webhooks, tools, data, ui, streams)
- **`webhooks`** — Inbound webhook endpoints
- **`jobs`** — Scheduled/triggered background jobs
- **`tools`** — Agent-callable tools
- **`ui`** — UI slot contributions and launchers
- **`config`** — JSON Schema for plugin configuration

### Developing a Plugin

Use `@paperclipai/plugin-sdk`:

```typescript
import { definePlugin } from "@paperclipai/plugin-sdk";

export default definePlugin({
  async setup(ctx) {
    // Subscribe to events
    ctx.events.on("issue.created", async (event) => { ... });

    // Register job handlers
    ctx.jobs.register("full-sync", async (job) => { ... });

    // Register data providers for UI
    ctx.data.register("sync-health", async ({ companyId }) => { ... });
  },
});
```

### Plugin Context API (`PluginContext`)

| Namespace | Purpose |
|-----------|---------|
| `ctx.events` | Subscribe to Paperclip domain events |
| `ctx.jobs` | Register job handlers |
| `ctx.data` | Register data providers for UI queries |
| `ctx.state` | Get/set scoped plugin state (company, project, agent, etc.) |
| `ctx.config` | Read plugin configuration |
| `ctx.secrets` | Resolve secret references |
| `ctx.http` | Make outbound HTTP requests |
| `ctx.logger` | Structured logging |

### Plugin Installation

```
POST /api/plugins/install
{
  "packageName": "@paperclipai/plugin-linear",
  "version": "latest"
}
```

Or for local development:
```
POST /api/plugins/install
{
  "packageName": "/path/to/my-plugin",
  "isLocalPath": true
}
```

Plugin states: `installed` -> `ready` (or `error`)

### Plugin Lifecycle Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/plugins` | List all plugins (filterable by status) |
| POST | `/api/plugins/install` | Install a plugin (npm or local path) |
| POST | `/api/plugins/:id/uninstall` | Soft-delete a plugin |
| POST | `/api/plugins/:id/enable` | Enable a disabled plugin |
| POST | `/api/plugins/:id/disable` | Disable a plugin |
| GET | `/api/plugins/:id/health` | Run health diagnostics |
| POST | `/api/plugins/:id/upgrade` | Upgrade plugin version |
| GET | `/api/plugins/ui-contributions` | List UI slot contributions for frontend |
| GET | `/api/plugins/available` | List bundled example plugins |

### Plugin UI Extensions

Plugins can contribute UI components via slots and launchers:
- **Slots** — Inject components into predefined locations in the Paperclip UI
- **Launchers** — Register actions/panels accessible from the command palette or specific zones
- UI assets served from `/_plugins/:pluginId/ui/`

### Bundled Example Plugins

| Plugin | Description |
|--------|-------------|
| `@paperclipai/plugin-hello-world-example` | Reference UI widget plugin |
| `@paperclipai/plugin-file-browser-example` | File browser for project workspaces |
| `@paperclipai/plugin-kitchen-sink-example` | Full API surface demo (events, jobs, webhooks, tools, streams, UI) |

### Plugin Dev Server

Use `paperclip-plugin-dev-server` (from `@paperclipai/plugin-sdk`) for local plugin development with hot reload:

```bash
npx paperclip-plugin-dev-server
```

### Plugin Scaffolding

Use `create-paperclip-plugin` to scaffold a new plugin project:

```bash
npx create-paperclip-plugin my-plugin
```

---

## Webhook Integration

### Plugin Webhooks

Plugins can receive inbound webhooks from external services:

**Endpoint pattern:** `POST /api/plugins/:pluginKey/webhooks/:webhookKey`

Delivery tracking in `plugin_webhook_deliveries` table:
- `pending` — Received, not yet dispatched
- `processing` — Being handled by plugin worker
- `succeeded` — Processed successfully
- `failed` — Worker error or timeout

Each delivery records: payload, HTTP headers, duration, error messages, external deduplication ID.

### Webhook Security
- `external_id` field supports idempotent delivery (reject duplicates from the source system)
- Relevant HTTP headers (e.g., signature headers) are persisted for verification by the plugin worker

---

## Real-time Events (WebSocket)

The server provides a WebSocket endpoint for live event streaming to the UI and connected agents.

Events are published via `publishLiveEvent()` / `publishGlobalLiveEvent()` and include:
- Agent status changes
- Heartbeat run progress and log chunks (capped at 8KB per chunk)
- Issue updates
- Approval state changes
- Plugin state changes

Connect to the WebSocket at `ws://HOST:PORT/ws/live-events`.

---

## Environment Variables Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `PAPERCLIP_DEPLOYMENT_MODE` | `local_trusted` | Auth mode: `local_trusted` or `authenticated` |
| `PAPERCLIP_DEPLOYMENT_EXPOSURE` | — | Network exposure configuration |
| `PAPERCLIP_PORT` | 3100 | Server listen port |
| `PAPERCLIP_HOST` | `localhost` | Server bind address |
| `DATABASE_URL` | — | External Postgres URL (skips embedded) |
| `PAPERCLIP_HEARTBEAT_INTERVAL_MS` | — | Heartbeat scheduler interval |
| `PAPERCLIP_SECRETS_PROVIDER` | `local_encrypted` | Secret storage backend |
| `PAPERCLIP_SECRETS_STRICT_MODE` | `false` | Require all secrets to be managed |
| `PAPERCLIP_STORAGE_PROVIDER` | `local_disk` | Asset storage backend (`local_disk` or `s3`) |
| `PAPERCLIP_STORAGE_LOCAL_DIR` | — | Local disk storage base directory |
| `PAPERCLIP_MIGRATION_PROMPT` | — | Migration prompt behavior (`never` to auto-skip) |
| `PAPERCLIP_MIGRATION_AUTO_APPLY` | — | Auto-apply pending migrations |
