# Paperclip — Known Limitations
_Last updated: 2026-03-23_

## Runtime and Infrastructure

### Embedded PostgreSQL is Beta
- `embedded-postgres` is at version `18.1.0-beta.16`
- Platform-specific binary availability may vary
- Not recommended for production workloads with high write volume; use an external PostgreSQL instance via `DATABASE_URL`

### Single-Server Architecture
- The server runs as a single Node.js process; no built-in horizontal scaling or clustering
- Heartbeat scheduler runs in-process; only one instance should run at a time to avoid duplicate agent executions
- WebSocket live events are in-memory only; multiple server instances would not share event state

### Agent Concurrency Limits
- Default max concurrent heartbeat runs per agent: **1** (hard max: **10**)
- No global concurrency limit across all agents; a large fleet could saturate local CPU/memory
- `startLocksByAgent` is an in-memory map; restart clears all locks

### Git Clone Timeout
- Managed workspace git clone operations have a hard timeout of **10 minutes** (`MANAGED_WORKSPACE_GIT_CLONE_TIMEOUT_MS`)
- Large repositories may fail to clone within this window

---

## Agent Adapters

### Local-Only Execution
- All local adapters (`claude_local`, `codex_local`, `cursor`, `gemini_local`, `opencode_local`, `pi_local`) require the corresponding CLI tool to be installed on the same machine as the Paperclip server
- No remote execution support except via the `openclaw_gateway` adapter
- Environment checks (`testEnvironment`) verify CLI availability but cannot auto-install missing tools

### Session Management
- Session state is adapter-specific and stored as opaque JSONB; there is no cross-adapter session format
- Session compaction thresholds are adapter-dependent; not all adapters support compaction

### Skills Feature Temporarily Disabled
- The "Skills" tab/view in the Agent Detail UI is commented out with `// TODO: bring back later` in multiple locations (`ui/src/pages/AgentDetail.tsx` lines ~711, ~872, ~969)
- Skills-related UI code exists but is not accessible to users

### Issue Worktree Support Not Shipped
- Issue-specific worktree UI is disabled with `// TODO(issue-worktree-support)` in `ui/src/adapters/runtime-json-fields.tsx`
- The backend infrastructure for execution workspaces exists but the UI workflow is incomplete

---

## Plugin System

### Plugin Worker Isolation
- Plugins run as worker threads within the same Node.js process
- No true sandboxing — plugins have access to the Node.js runtime (mitigated by `plugin-runtime-sandbox.ts` but not a security boundary)
- One misbehaving plugin can affect server stability

### Plugin UI Loading
- Plugin UI assets are loaded dynamically via `/_plugins/:pluginId/ui/`
- No Content Security Policy enforcement specific to plugin scripts
- Plugin UI code runs in the same browsing context as the main Paperclip UI

---

## UI and Browser Support

### Browser Requirements
- React 19 + modern ES module features; requires a modern evergreen browser (Chrome/Edge 90+, Firefox 90+, Safari 15+)
- No explicit polyfills for older browsers
- Mermaid diagram rendering (`mermaid ^11.12.0`) has its own browser compatibility requirements

### No Offline / PWA Support
- The UI is a standard SPA with no service worker, offline caching, or PWA manifest
- All data fetched live from the server via `@tanstack/react-query`

### MDX Editor Bundle Size
- `@mdxeditor/editor ^3.52.4` is a large dependency that impacts initial page load for document editing views

---

## Authentication and Access Control

### Local Trusted Mode Has No Auth
- In `local_trusted` mode (the default), every request is treated as an instance admin with full board access
- Suitable only for single-user local development; not appropriate for shared or production deployments

### No Rate Limiting
- No built-in request rate limiting on API endpoints
- Agent API keys have no request quota; a compromised key can make unlimited requests

### No MFA / 2FA
- `better-auth` is used for session management but no multi-factor authentication is configured

---

## Data and Storage

### Asset Storage
- `local_disk` storage stores files on the server filesystem; no replication or redundancy
- S3 storage (`@aws-sdk/client-s3`) is available but requires explicit configuration
- No automatic cleanup of orphaned assets

### Database Backups
- Backup is available via `scripts/backup-db.sh` but must be manually configured for scheduling
- Backup retention controlled by `databaseBackupRetentionDays` but no offsite replication

### Budget Tracking
- Monthly budget/spend tracking uses integer cents (`budget_monthly_cents`, `spent_monthly_cents`)
- No automatic budget reset mechanism visible in schema; requires manual or scheduled reset

---

## Developer Experience

### ESLint Exceptions
- Multiple `eslint-disable` comments throughout the codebase (12+ instances):
  - `react-hooks/exhaustive-deps` suppressed in 7 UI files
  - `@typescript-eslint/no-explicit-any` and `no-dynamic-delete` in plugin services
  - `no-console` in CLI and dev tools
  - `no-var` in plugin bridge init

### Type Safety Gaps
- `as any` type assertions appear 76 times across 24 files (concentrated in test files and `plugin-host-services.ts`)
- No visible test coverage reporting configuration

### Express 5 Ecosystem
- Express 5 is used (`^5.1.0`) which is still relatively new; some middleware ecosystem packages may not fully support v5 yet
