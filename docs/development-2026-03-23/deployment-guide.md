# Paperclip — Deployment Guide

_Last updated: 2026-03-23_

---

## 1. Prerequisites

### Local Development

- **Node.js 20+**
- **pnpm 9+**
- No external database required (embedded PGlite handles it)

### Docker Deployment

- **Docker** (with BuildKit support)
- **docker compose** (v2)
- No Node.js or pnpm required on the host

---

## 2. Deployment Modes

Paperclip has two runtime modes and two exposure policies:

| Runtime Mode | Exposure | Auth Required | Binding | Use Case |
|---|---|---|---|---|
| `local_trusted` | N/A | No | Loopback only | Single-operator local dev |
| `authenticated` | `private` | Yes (Better Auth) | `0.0.0.0` | Private network (Tailscale/VPN/LAN) |
| `authenticated` | `public` | Yes (Better Auth) | `0.0.0.0` | Internet-facing deployment |

**Key differences:**

- `local_trusted`: No login, implicit board admin, optimized for fastest startup
- `authenticated/private`: Login required, auto-derived base URL, private hostname guard enforced
- `authenticated/public`: Login required, explicit `PAPERCLIP_PUBLIC_URL` required, stricter doctor checks

---

## 3. Local Development Setup

### Quick Start

```sh
pnpm install
pnpm dev
```

This starts the API server at `http://localhost:3100` with the UI served in dev middleware mode (same origin). The server runs in watch mode and restarts on changes.

### One-Command Run

```sh
pnpm paperclipai run
```

This command:
1. Auto-onboards if config is missing
2. Runs `paperclipai doctor` with repair enabled
3. Starts the server when checks pass

### Tailscale/Private Network Dev

```sh
pnpm dev --tailscale-auth
```

Runs as `authenticated/private` and binds to `0.0.0.0`. Add custom hostnames:

```sh
pnpm paperclipai allowed-hostname <your-tailscale-hostname>
```

### Database in Dev

Leave `DATABASE_URL` unset. The server uses embedded PostgreSQL with data at:

```
~/.paperclip/instances/default/db
```

Override with `PAPERCLIP_HOME` and `PAPERCLIP_INSTANCE_ID`:

```sh
PAPERCLIP_HOME=/custom/path PAPERCLIP_INSTANCE_ID=dev pnpm paperclipai run
```

To reset dev data:

```sh
rm -rf ~/.paperclip/instances/default/db
pnpm dev
```

---

## 4. Docker Setup

### Dockerfile Architecture

The Dockerfile uses a multi-stage build on `node:lts-trixie-slim`:

1. **`base`** — Installs `ca-certificates`, `curl`, `git`; enables corepack
2. **`deps`** — Copies `package.json` files for all workspace packages; runs `pnpm install --frozen-lockfile`
3. **`build`** — Copies full source; builds UI and server; validates `server/dist/index.js` exists
4. **`production`** — Copies built app; installs `claude-code`, `codex`, `opencode-ai` globally; creates `/paperclip` data directory owned by `node` user

**Default container environment:**

| Variable | Default |
|---|---|
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |
| `PORT` | `3100` |
| `SERVE_UI` | `true` |
| `PAPERCLIP_HOME` | `/paperclip` |
| `PAPERCLIP_INSTANCE_ID` | `default` |
| `PAPERCLIP_DEPLOYMENT_MODE` | `authenticated` |
| `PAPERCLIP_DEPLOYMENT_EXPOSURE` | `private` |

**Volume:** `/paperclip` — persists embedded DB data, uploaded assets, secrets master key, agent workspace data

**Port:** `3100`

**Runtime user:** `node` (non-root)

### Docker One-Liner

```sh
docker build -t paperclip-local . && \
docker run --name paperclip \
  -p 3100:3100 \
  -e HOST=0.0.0.0 \
  -e PAPERCLIP_HOME=/paperclip \
  -v "$(pwd)/data/docker-paperclip:/paperclip" \
  paperclip-local
```

### Compose Quickstart (Embedded DB)

```sh
docker compose -f docker-compose.quickstart.yml up --build
```

Uses embedded PostgreSQL inside the container. Configuration:

- Host port: `${PAPERCLIP_PORT:-3100}`
- Data dir: `${PAPERCLIP_DATA_DIR:-./data/docker-paperclip}`
- Required: `BETTER_AUTH_SECRET` (for authenticated mode)

Optional overrides:

```sh
PAPERCLIP_PORT=3200 PAPERCLIP_DATA_DIR=./data/pc docker compose -f docker-compose.quickstart.yml up --build
```

### Compose with External Postgres

```sh
docker compose up --build
```

The main `docker-compose.yml` provisions:

- **`db` service:** `postgres:17-alpine` with healthcheck (`pg_isready`)
  - Default credentials: `paperclip/paperclip/paperclip`
  - Data persisted in `pgdata` named volume
- **`server` service:** Built from Dockerfile
  - `DATABASE_URL=postgres://paperclip:paperclip@db:5432/paperclip`
  - Depends on `db` with `service_healthy` condition
  - Data persisted in `paperclip-data` named volume

**Required environment variables for authenticated compose:**

```sh
BETTER_AUTH_SECRET=<your-secret> docker compose up --build
```

Optional:

```sh
PAPERCLIP_PUBLIC_URL=https://desk.example.com docker compose up --build
```

### Passing API Keys for Local Adapters

The Docker image pre-installs `claude` (Anthropic) and `codex` (OpenAI) CLIs. Pass API keys at runtime:

```sh
docker run ... \
  -e OPENAI_API_KEY=... \
  -e ANTHROPIC_API_KEY=... \
  paperclip-local
```

Without API keys, the app runs normally but adapter environment checks will surface missing prerequisites.

---

## 5. Environment Configuration

### Core Variables

| Variable | Description | Default |
|---|---|---|
| `PAPERCLIP_DEPLOYMENT_MODE` | `local_trusted` or `authenticated` | `local_trusted` |
| `PAPERCLIP_DEPLOYMENT_EXPOSURE` | `private` or `public` | `private` |
| `PAPERCLIP_PUBLIC_URL` | Canonical public URL | `http://localhost:3100` |
| `HOST` | Bind address | `127.0.0.1` (local) / `0.0.0.0` (Docker) |
| `PORT` | Listen port | `3100` |
| `DATABASE_URL` | External Postgres connection string | (embedded PGlite) |
| `SERVE_UI` | Serve built UI from server | `true` |
| `PAPERCLIP_HOME` | Data directory root | `~/.paperclip` |
| `PAPERCLIP_INSTANCE_ID` | Instance identifier | `default` |

### Auth Variables

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Session signing secret (required for authenticated mode) |
| `PAPERCLIP_AGENT_JWT_SECRET` | Agent JWT signing secret |
| `PAPERCLIP_AGENT_JWT_TTL_SECONDS` | JWT lifetime (default: 172800 = 48h) |
| `PAPERCLIP_ALLOWED_HOSTNAMES` | Additional allowed hostnames (comma-separated) |

### Secrets Variables

| Variable | Description |
|---|---|
| `PAPERCLIP_SECRETS_MASTER_KEY` | Master encryption key (hex/base64/raw) |
| `PAPERCLIP_SECRETS_MASTER_KEY_FILE` | Path to master key file |
| `PAPERCLIP_SECRETS_STRICT_MODE` | Require secret refs for sensitive env vars |

### Database Backup Variables

| Variable | Description | Default |
|---|---|---|
| `PAPERCLIP_DB_BACKUP_ENABLED` | Enable auto backups | `true` |
| `PAPERCLIP_DB_BACKUP_INTERVAL_MINUTES` | Backup interval | `60` |
| `PAPERCLIP_DB_BACKUP_RETENTION_DAYS` | Retention period | `30` |
| `PAPERCLIP_DB_BACKUP_DIR` | Backup output directory | `~/.paperclip/instances/default/data/backups` |

### Other Variables

| Variable | Description | Default |
|---|---|---|
| `PAPERCLIP_ENABLE_COMPANY_DELETION` | Enable company deletion API | `true` (local) / `false` (auth) |

---

## 6. Database Setup

### Embedded PostgreSQL (Default for Dev)

No configuration needed. Data is persisted at:

```
~/.paperclip/instances/<instance-id>/db
```

### External PostgreSQL

Set `DATABASE_URL` to a Postgres connection string:

```sh
DATABASE_URL=postgres://user:pass@host:5432/paperclip pnpm dev
```

The Docker Compose setup with external Postgres uses `postgres:17-alpine`.

---

## 7. Backup and Restore

### Automatic Backups

Enabled by default. Runs every 60 minutes with 30-day retention. Backups stored at:

```
~/.paperclip/instances/default/data/backups
```

Configure via CLI:

```sh
pnpm paperclipai configure --section database
```

### Manual Backup

```sh
pnpm paperclipai db:backup
# or
pnpm db:backup
# or
./scripts/backup-db.sh
```

Options:

| Flag | Description |
|---|---|
| `--dir <path>` | Override backup output directory |
| `--retention-days <days>` | Retention window for pruning |
| `--filename-prefix <prefix>` | Backup filename prefix (default: `paperclip`) |
| `--json` | Output backup metadata as JSON |

### Important: Back Up Master Key Separately

The secrets master key (`~/.paperclip/instances/default/secrets/master.key`) must be backed up independently. Without it, encrypted secrets in the database are unrecoverable.

---

## 8. Release Process

**Script:** `scripts/release.sh`

### Versioning Scheme

- **Stable:** `YYYY.MDD.P` (year, month+day, patch slot)
- **Canary:** `YYYY.MDD.P-canary.N` (npm dist-tag: `canary`)

### Release Steps (7-step pipeline)

```sh
./scripts/release.sh <canary|stable> [--date YYYY-MM-DD] [--dry-run] [--skip-verify]
```

1. **Verification gate** — `pnpm -r typecheck`, `pnpm test:run`, `pnpm build`
2. **Build workspace artifacts** — Full build + UI dist prep + skills copy
3. **Rewrite workspace versions** — Updates all public package versions
4. **Build publishable CLI bundle** — `scripts/build-npm.sh`
5. **Publish packages to npm** — Each public package published with `--access public`
6. **Confirm npm availability** — Polls npm registry to verify packages are live
7. **Create git tag** — Tags the source commit (not a release commit)

### Safety Features

- Requires clean worktree
- Requires npm publish auth
- Stable releases require release notes at `releases/vYYYY.MDD.P.md`
- Validates no duplicate tags or npm versions exist
- Restores working tree on exit (cleanup trap)
- Canary requires `master` branch

### Post-Release

```sh
git push <remote> refs/tags/<tag-name>
./scripts/create-github-release.sh <version>   # stable only
```

---

## 9. Rollback

**Script:** `scripts/rollback-latest.sh`

Repoints the `latest` npm dist-tag to a previous stable version. Does not unpublish anything.

```sh
./scripts/rollback-latest.sh <stable-version> [--dry-run]
```

Example:

```sh
./scripts/rollback-latest.sh 2026.318.0 --dry-run   # preview
./scripts/rollback-latest.sh 2026.318.0              # execute
```

This updates the `latest` dist-tag for every public package in the workspace so that `npx paperclipai onboard` pulls the rolled-back version.

---

## 10. CLI Command Reference

The `paperclipai` CLI provides setup, diagnostic, and client-side commands:

### Setup and Operations

| Command | Description |
|---|---|
| `paperclipai onboard` | Interactive first-run setup wizard (`-y` for quickstart) |
| `paperclipai run` | Bootstrap + doctor + start server |
| `paperclipai doctor` | Run diagnostic checks (`--repair` to auto-fix) |
| `paperclipai configure` | Update config sections (`--section server\|database\|llm\|storage\|secrets\|logging`) |
| `paperclipai env` | Print environment variables for deployment |
| `paperclipai db:backup` | Create manual database backup |
| `paperclipai allowed-hostname <host>` | Allow a hostname for private mode |

### Authentication

| Command | Description |
|---|---|
| `paperclipai auth bootstrap-ceo` | Create one-time bootstrap invite for first admin |

### Client Operations

| Command | Description |
|---|---|
| `paperclipai context set` | Set default API base and company ID |
| `paperclipai company ...` | Company management |
| `paperclipai issue list\|create\|update` | Issue management |
| `paperclipai agent ...` | Agent management |
| `paperclipai approval ...` | Approval workflows |
| `paperclipai activity ...` | Activity log |
| `paperclipai dashboard get` | Dashboard view |
| `paperclipai plugin ...` | Plugin management |

### Worktree Management

| Command | Description |
|---|---|
| `paperclipai worktree init` | Create isolated instance for current git worktree |
| `paperclipai worktree:make <name>` | Create git worktree + isolated Paperclip instance |
| `paperclipai worktree env` | Print shell exports for current worktree |

### Heartbeat

| Command | Description |
|---|---|
| `paperclipai heartbeat run` | Run one agent heartbeat with live log streaming |

---

## 11. Worktree-Local Instances

For multi-worktree development, each worktree gets its own isolated Paperclip instance:

```sh
paperclipai worktree init               # in existing worktree
paperclipai worktree:make my-feature    # create worktree + instance
```

This creates:
- Repo-local `.paperclip/config.json` and `.paperclip/.env`
- Isolated instance under `~/.paperclip-worktrees/instances/<worktree-id>/`
- Separate app port and embedded Postgres port

Seed modes: `minimal` (default, keeps core state), `full` (complete clone), `--no-seed` (empty).
