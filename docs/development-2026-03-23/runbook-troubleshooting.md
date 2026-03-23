# Paperclip — Runbook & Troubleshooting Guide

_Last updated: 2026-03-23_

---

## 1. Health Checks

### HTTP Health Endpoint

```sh
curl http://localhost:3100/api/health
```

**Response fields:**

| Field | Description |
|---|---|
| `status` | `"ok"` — server is running |
| `version` | Server version string |
| `deploymentMode` | `local_trusted` or `authenticated` |
| `deploymentExposure` | `private` or `public` |
| `authReady` | Whether auth system is initialized |
| `bootstrapStatus` | `ready` or `bootstrap_pending` (authenticated mode only) |
| `bootstrapInviteActive` | Whether an active bootstrap CEO invite exists |
| `features.companyDeletionEnabled` | Whether company deletion API is active |

**Example healthy response:**

```json
{
  "status": "ok",
  "version": "0.2.7",
  "deploymentMode": "authenticated",
  "deploymentExposure": "private",
  "authReady": true,
  "bootstrapStatus": "ready",
  "bootstrapInviteActive": false,
  "features": { "companyDeletionEnabled": false }
}
```

**Bootstrap pending:** In authenticated mode, `bootstrapStatus: "bootstrap_pending"` means no `instance_admin` user exists yet. Run `paperclipai auth bootstrap-ceo` to create the first admin invite.

### Quick Smoke Test

```sh
curl http://localhost:3100/api/health
curl http://localhost:3100/api/companies
```

- `/api/health` should return `{"status":"ok"}`
- `/api/companies` should return a JSON array

---

## 2. Diagnostic Checks (Doctor)

```sh
pnpm paperclipai doctor
pnpm paperclipai doctor --repair        # auto-fix issues
pnpm paperclipai doctor --repair --yes  # auto-fix without prompts
```

Doctor runs 9 sequential checks:

| # | Check | What It Validates |
|---|---|---|
| 1 | Config file | Config exists and is parseable |
| 2 | Deployment/auth mode | Mode/exposure settings are valid |
| 3 | Agent JWT secret | `PAPERCLIP_AGENT_JWT_SECRET` is set (repairable) |
| 4 | Secrets adapter | Secrets provider is configured, master key exists (repairable) |
| 5 | Storage | Storage provider and directory are valid (repairable) |
| 6 | Database | Database connection or embedded PGlite works (repairable) |
| 7 | LLM | LLM provider configuration |
| 8 | Log directory | Log directory exists and is writable (repairable) |
| 9 | Port | Configured port is available |

**Result statuses:** pass, warn (non-blocking), fail (blocking)

**Repairable checks** (3, 4, 5, 6, 8) can be auto-fixed with `--repair`. After repair, the check reruns to confirm the fix.

---

## 3. Start / Stop / Restart

### Local Development

**Start:**

```sh
pnpm dev                    # watch mode, restarts on changes
pnpm dev:once               # single run, no file watching
pnpm paperclipai run        # full bootstrap: onboard + doctor + start
```

**Stop:** `Ctrl+C` in the terminal

**Start with Tailscale/private auth:**

```sh
pnpm dev --tailscale-auth
```

### Docker

**Start:**

```sh
docker compose up -d                                          # external Postgres
docker compose -f docker-compose.quickstart.yml up -d --build # embedded DB
```

**Stop:**

```sh
docker compose down
docker compose -f docker-compose.quickstart.yml down
```

**Restart:**

```sh
docker compose restart server
```

**View logs:**

```sh
docker compose logs -f server
docker compose logs -f db
```

---

## 4. Log Locations

### Local Development

- Server logs: stdout/stderr in terminal
- Log directory: configurable via `pnpm paperclipai configure --section logging`
- Default log location managed by config; doctor check validates writability

### Docker

- Container stdout/stderr: `docker compose logs -f server`
- Postgres logs: `docker compose logs -f db`

---

## 5. Common Issues and Fixes

### Issue: Server Won't Start — Port In Use

**Symptom:** `Error: listen EADDRINUSE :::3100`

**Fix:**
```sh
# Find what's using the port
lsof -i :3100
# Kill the process or use a different port
PORT=3200 pnpm dev
```

The server also auto-detects a free port if the requested port is busy, logging a warning.

### Issue: 403 "Hostname not allowed"

**Symptom:** Browser shows `Hostname '<hostname>' is not allowed for this Paperclip instance`

**Fix:**
```sh
pnpm paperclipai allowed-hostname <hostname>
# Restart the server
```

This occurs in `authenticated/private` mode when accessing via a hostname not in the allow list (e.g., Tailscale hostnames).

### Issue: 403 "Board mutation requires trusted browser origin"

**Symptom:** POST/PUT/DELETE requests from the UI return 403

**Cause:** The `Origin` or `Referer` header doesn't match a trusted origin. Common when accessing via a proxy or non-standard port.

**Fix:** Ensure `PAPERCLIP_PUBLIC_URL` matches the URL you access the UI from. For Tailscale, also add the hostname via `allowed-hostname`.

### Issue: Bootstrap Pending (Authenticated Mode)

**Symptom:** Health check shows `bootstrapStatus: "bootstrap_pending"`

**Fix:**
```sh
pnpm paperclipai auth bootstrap-ceo
```

This creates a one-time invite URL. Open it in a browser while signed in to claim instance admin.

### Issue: Embedded Database Corruption or Stale State

**Symptom:** Server crashes on startup with PGlite errors

**Fix (destructive — resets all dev data):**
```sh
rm -rf ~/.paperclip/instances/default/db
pnpm dev
```

### Issue: Missing Secrets Master Key

**Symptom:** Secret operations fail with `Invalid secrets master key` errors

**Fix:**
```sh
pnpm paperclipai doctor --repair
```

Or manually create a key:
```sh
openssl rand -base64 32 > ~/.paperclip/instances/default/secrets/master.key
chmod 600 ~/.paperclip/instances/default/secrets/master.key
```

### Issue: Agent JWT Authentication Fails

**Symptom:** Agent requests return as `type: "none"` actor

**Check:**
1. `PAPERCLIP_AGENT_JWT_SECRET` is set and matches the secret used to sign the JWT
2. JWT is not expired (`exp` claim)
3. Agent record exists in DB with valid status (not `terminated` or `pending_approval`)
4. `company_id` in JWT matches the agent's company

Run `pnpm paperclipai doctor` to validate JWT configuration.

### Issue: Agent API Key Not Working

**Symptom:** Bearer token returns unauthenticated

**Check:**
1. Key hash matches: the raw token must SHA-256 hash to the stored `keyHash`
2. Key is not revoked: `revokedAt` must be NULL
3. Agent is not terminated or pending approval
4. Key is associated with the correct company

### Issue: Docker Build Fails

**Symptom:** `ERROR: server build output missing`

**Fix:** Ensure the full source is available in the build context. Check `.dockerignore` isn't excluding necessary files.

---

## 6. Database Operations

### Backup

```sh
# Manual one-off backup
pnpm paperclipai db:backup

# With options
pnpm paperclipai db:backup --dir /tmp/backups --retention-days 7 --json

# Via script
./scripts/backup-db.sh
```

**Auto-backup defaults:** Every 60 minutes, 30-day retention, stored at `~/.paperclip/instances/default/data/backups`

**Configure auto-backups:**
```sh
pnpm paperclipai configure --section database
```

**Environment overrides:**
```sh
PAPERCLIP_DB_BACKUP_ENABLED=true
PAPERCLIP_DB_BACKUP_INTERVAL_MINUTES=30
PAPERCLIP_DB_BACKUP_RETENTION_DAYS=14
PAPERCLIP_DB_BACKUP_DIR=/path/to/backups
```

### Use External Postgres

```sh
DATABASE_URL=postgres://user:pass@host:5432/paperclip pnpm dev
```

When `DATABASE_URL` is set, embedded PGlite is not started.

### Reset Embedded Database

```sh
rm -rf ~/.paperclip/instances/default/db
pnpm dev
```

### Worktree-Isolated Database

Each worktree gets its own embedded database. Reset a worktree's database:

```sh
rm -rf ~/.paperclip-worktrees/instances/<worktree-id>/db
```

---

## 7. Agent Troubleshooting

### Agent Won't Execute Heartbeats

1. **Check agent status:** Must not be `terminated` or `pending_approval`
2. **Check auth:** Agent must have a valid API key or JWT
3. **Run a manual heartbeat:**
   ```sh
   pnpm paperclipai heartbeat run --agent-id <agent-id> --debug
   ```
   The `--debug` flag shows raw adapter stdout/stderr JSON chunks.

### Agent Adapter Missing Prerequisites

The Docker image pre-installs `claude`, `codex`, and `opencode-ai` CLIs. For local dev, ensure these are installed and their API keys are set:

```sh
# Check adapter prerequisites
pnpm paperclipai doctor
```

### Agent Workspace Issues

Default agent workspaces are at:
```
~/.paperclip/instances/default/workspaces/<agent-id>
```

Honors `PAPERCLIP_HOME` and `PAPERCLIP_INSTANCE_ID`.

---

## 8. Emergency Procedures

### Rollback a Bad npm Release

Repoint the `latest` dist-tag to a known-good stable version:

```sh
./scripts/rollback-latest.sh <good-version> --dry-run   # preview
./scripts/rollback-latest.sh <good-version>              # execute
```

This does NOT unpublish packages. It only changes which version `npx paperclipai` resolves to.

### Emergency Database Backup

```sh
pnpm paperclipai db:backup --json
```

The `--json` flag outputs backup metadata (path, size, timestamp) for scripting.

### Lock Down Instance

1. **Revoke compromised API keys:** Set `revokedAt` on the `agent_api_keys` row
2. **Disable sign-up:** Set `config.authDisableSignUp = true` or redeploy
3. **Rotate JWT secret:** Change `PAPERCLIP_AGENT_JWT_SECRET` — all existing agent JWTs immediately become invalid
4. **Rotate Better Auth secret:** Change `BETTER_AUTH_SECRET` — all existing user sessions are invalidated
5. **Rotate master key:** Generate a new master key, re-encrypt all secrets (requires the old key to decrypt first)

### Emergency Kill (Local Dev)

```sh
./scripts/kill-dev.sh
```

### Recover from No Admin (Authenticated Mode)

If no user has `instance_admin` and the board-claim URL has expired:

```sh
pnpm paperclipai auth bootstrap-ceo --force
```

The `--force` flag creates a new invite even if an admin already exists. Set `--expires-hours` to control the invite window.
