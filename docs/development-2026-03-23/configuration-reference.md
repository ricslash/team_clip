# Paperclip -- Configuration Reference
_Last updated: 2026-03-23_

## 1. Configuration Sources

Paperclip loads configuration from multiple sources in the following priority order (highest priority first):

1. **Environment variables** -- Always override file-based config.
2. **Paperclip .env file** -- Located at `$PAPERCLIP_HOME/instances/$PAPERCLIP_INSTANCE_ID/.env` (resolved via `resolvePaperclipEnvPath()`). Loaded via `dotenv` with `override: false`.
3. **CWD .env file** -- `.env` in the current working directory (if different from the Paperclip .env file). Loaded via `dotenv` with `override: false`.
4. **Config file (JSON)** -- Located at `$PAPERCLIP_CONFIG` or auto-resolved. Parsed and validated against `paperclipConfigSchema` (Zod) from `@paperclipai/shared`.

## 2. Environment Variables

### 2.1 Core Server

| Variable | Required | Default | Description |
|---|---|---|---|
| `HOST` | No | `127.0.0.1` | Network interface to bind the HTTP server to. Use `0.0.0.0` for all interfaces. |
| `PORT` | No | `3100` | Port for the HTTP server. If busy, the next free port is used automatically. |
| `SERVE_UI` | No | `true` | Set to `"true"` to serve the React UI as static files. |
| `DATABASE_URL` | No | (embedded) | PostgreSQL connection string. If unset, an embedded PostgreSQL instance is started. |
| `NODE_ENV` | No | `production` | Standard Node.js environment flag. Set in Docker. |

### 2.2 Deployment & Access Control

| Variable | Required | Default | Description |
|---|---|---|---|
| `PAPERCLIP_DEPLOYMENT_MODE` | No | `local_trusted` | Deployment mode: `local_trusted` (loopback, no auth) or `authenticated` (Better Auth). |
| `PAPERCLIP_DEPLOYMENT_EXPOSURE` | No | `private` | Exposure level: `private` or `public`. `local_trusted` forces `private`. |
| `PAPERCLIP_ALLOWED_HOSTNAMES` | No | (none) | Comma-separated list of allowed `Host` header values for private hostname guard. |
| `PAPERCLIP_PUBLIC_URL` | No | (none) | Public-facing URL for the instance (e.g., `https://paperclip.example.com`). Used as auth base URL fallback and added to allowed hostnames. |
| `PAPERCLIP_ENABLE_COMPANY_DELETION` | No | `true` in local_trusted | Set to `"true"` to allow company deletion via the API. |

### 2.3 Authentication (Better Auth)

| Variable | Required | Default | Description |
|---|---|---|---|
| `BETTER_AUTH_SECRET` | Yes (authenticated mode) | (none) | Signing secret for Better Auth sessions. Falls back to `PAPERCLIP_AGENT_JWT_SECRET`. |
| `BETTER_AUTH_URL` | No | (none) | Base URL for Better Auth (alternative to `PAPERCLIP_AUTH_PUBLIC_BASE_URL`). |
| `BETTER_AUTH_BASE_URL` | No | (none) | Another alias for the auth base URL. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | No | (none) | Comma-separated additional trusted origins for CORS. Merged with auto-derived origins. |
| `PAPERCLIP_AUTH_PUBLIC_BASE_URL` | No | (none) | Explicit public base URL for auth redirects. |
| `PAPERCLIP_AUTH_BASE_URL_MODE` | No | `auto` | Auth base URL mode: `auto` (derive from request) or `explicit` (use `PAPERCLIP_AUTH_PUBLIC_BASE_URL`). |
| `PAPERCLIP_AUTH_DISABLE_SIGN_UP` | No | `false` | Set to `"true"` to disable new user registration. |

### 2.4 Agent Authentication

| Variable | Required | Default | Description |
|---|---|---|---|
| `PAPERCLIP_AGENT_JWT_SECRET` | No | (none) | Secret for signing agent JWT tokens. Also used as fallback for `BETTER_AUTH_SECRET`. |
| `PAPERCLIP_AGENT_JWT_TTL_SECONDS` | No | `172800` (48h) | JWT token lifetime in seconds. |
| `PAPERCLIP_AGENT_JWT_ISSUER` | No | `paperclip` | JWT `iss` claim value. |
| `PAPERCLIP_AGENT_JWT_AUDIENCE` | No | `paperclip-api` | JWT `aud` claim value. |

### 2.5 Database

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | No | (embedded PG) | PostgreSQL connection string for external database. |
| `PAPERCLIP_MIGRATION_AUTO_APPLY` | No | `false` | Set to `"true"` to auto-apply pending migrations without prompting. |
| `PAPERCLIP_MIGRATION_PROMPT` | No | (prompt) | Set to `"never"` to skip migration prompts (will fail if migrations are pending and auto-apply is off). |
| `PAPERCLIP_EMBEDDED_POSTGRES_VERBOSE` | No | `false` | Set to `"true"` to log all embedded PostgreSQL output. |

### 2.6 Database Backups

| Variable | Required | Default | Description |
|---|---|---|---|
| `PAPERCLIP_DB_BACKUP_ENABLED` | No | `true` | Set to `"true"` or `"false"` to enable/disable automatic backups. |
| `PAPERCLIP_DB_BACKUP_INTERVAL_MINUTES` | No | `60` | Minutes between automatic backups (minimum 1). |
| `PAPERCLIP_DB_BACKUP_RETENTION_DAYS` | No | `30` | Days to retain backup files before pruning (minimum 1). |
| `PAPERCLIP_DB_BACKUP_DIR` | No | `$PAPERCLIP_HOME/.../backups` | Directory for storing database backup files. |

### 2.7 Secrets Management

| Variable | Required | Default | Description |
|---|---|---|---|
| `PAPERCLIP_SECRETS_PROVIDER` | No | `local_encrypted` | Secrets provider type. Valid values from `SECRET_PROVIDERS` constant. |
| `PAPERCLIP_SECRETS_STRICT_MODE` | No | `false` | Set to `"true"` to fail agent runs when required secrets are missing. |
| `PAPERCLIP_SECRETS_MASTER_KEY_FILE` | No | `$PAPERCLIP_HOME/.../secrets.key` | Path to the master encryption key file for `local_encrypted` provider. |
| `PAPERCLIP_SECRETS_MASTER_KEY` | No | (none) | Inline master key value (alternative to key file). |

### 2.8 Storage

| Variable | Required | Default | Description |
|---|---|---|---|
| `PAPERCLIP_STORAGE_PROVIDER` | No | `local_disk` | Storage provider: `local_disk` or `s3`. |
| `PAPERCLIP_STORAGE_LOCAL_DIR` | No | `$PAPERCLIP_HOME/.../storage` | Base directory for local disk storage. |
| `PAPERCLIP_STORAGE_S3_BUCKET` | No | `paperclip` | S3 bucket name. |
| `PAPERCLIP_STORAGE_S3_REGION` | No | `us-east-1` | S3 region. |
| `PAPERCLIP_STORAGE_S3_ENDPOINT` | No | (none) | Custom S3 endpoint URL (for MinIO, R2, etc.). |
| `PAPERCLIP_STORAGE_S3_PREFIX` | No | `""` | Key prefix for all S3 objects. |
| `PAPERCLIP_STORAGE_S3_FORCE_PATH_STYLE` | No | `false` | Set to `"true"` for path-style S3 URLs (required for MinIO). |

### 2.9 Heartbeat Scheduler

| Variable | Required | Default | Description |
|---|---|---|---|
| `HEARTBEAT_SCHEDULER_ENABLED` | No | `true` | Set to `"false"` to disable the heartbeat scheduler entirely. |
| `HEARTBEAT_SCHEDULER_INTERVAL_MS` | No | `30000` | Heartbeat tick interval in milliseconds (minimum 10000). |

### 2.10 Logging & Paths

| Variable | Required | Default | Description |
|---|---|---|---|
| `PAPERCLIP_LOG_DIR` | No | (auto) | Directory for log files. |
| `PAPERCLIP_HOME` | No | Platform default | Root directory for all Paperclip data (instances, config, secrets, storage, backups). |
| `PAPERCLIP_INSTANCE_ID` | No | `default` | Instance identifier for multi-instance setups. |
| `PAPERCLIP_CONFIG` | No | (auto-resolved) | Explicit path to the JSON config file. |
| `PAPERCLIP_OPEN_ON_LISTEN` | No | `false` | Set to `"true"` to auto-open the browser when the server starts. |
| `PAPERCLIP_UI_DEV_MIDDLEWARE` | No | `false` | Set to `"true"` to enable Vite dev middleware (HMR) instead of static UI serving. |
| `RUN_LOG_BASE_PATH` | No | `$PAPERCLIP_HOME/.../data/run-logs` | Base path for heartbeat run log storage. |
| `WORKSPACE_OPERATION_LOG_BASE_PATH` | No | (auto) | Base path for workspace operation log storage. |

### 2.11 Attachments

| Variable | Required | Default | Description |
|---|---|---|---|
| `PAPERCLIP_ALLOWED_ATTACHMENT_TYPES` | No | (built-in list) | Comma-separated list of allowed MIME types for attachments. |
| `PAPERCLIP_ATTACHMENT_MAX_BYTES` | No | `10485760` (10 MB) | Maximum attachment file size in bytes. |

### 2.12 External API Keys

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | No | (none) | OpenAI API key used by the codex-local adapter for model listing. |

### 2.13 Runtime (Set by Server)

These are set automatically by the server at startup and should not be configured manually:

| Variable | Description |
|---|---|
| `PAPERCLIP_LISTEN_HOST` | Actual bind host after startup. |
| `PAPERCLIP_LISTEN_PORT` | Actual listen port after startup. |
| `PAPERCLIP_API_URL` | Resolved API URL (e.g., `http://localhost:3100`). |

## 3. Configuration File Format

The config file is a JSON file validated by `paperclipConfigSchema` (Zod, from `@paperclipai/shared`). Its path is resolved as:

1. `$PAPERCLIP_CONFIG` environment variable (if set)
2. `$PAPERCLIP_HOME/instances/$PAPERCLIP_INSTANCE_ID/config.json` (auto-resolved)

The file structure (inferred from `loadConfig()` usage):

```json
{
  "server": {
    "host": "127.0.0.1",
    "port": 3100,
    "deploymentMode": "local_trusted",
    "exposure": "private",
    "serveUi": true,
    "allowedHostnames": []
  },
  "database": {
    "mode": "embedded-postgres",
    "connectionString": "postgres://...",
    "embeddedPostgresDataDir": "~/.paperclip/instances/default/postgres-data",
    "embeddedPostgresPort": 54329,
    "backup": {
      "enabled": true,
      "intervalMinutes": 60,
      "retentionDays": 30,
      "dir": "~/.paperclip/instances/default/backups"
    }
  },
  "secrets": {
    "provider": "local_encrypted",
    "strictMode": false,
    "localEncrypted": {
      "keyFilePath": "~/.paperclip/instances/default/secrets.key"
    }
  },
  "storage": {
    "provider": "local_disk",
    "localDisk": {
      "baseDir": "~/.paperclip/instances/default/storage"
    },
    "s3": {
      "bucket": "paperclip",
      "region": "us-east-1",
      "endpoint": null,
      "prefix": "",
      "forcePathStyle": false
    }
  },
  "auth": {
    "baseUrlMode": "auto",
    "publicBaseUrl": null,
    "disableSignUp": false
  }
}
```

All fields are optional in the config file. Environment variables take precedence over file values.

## 4. Per-Environment Configuration

### Local Development

```bash
# Minimal .env for local dev
HOST=127.0.0.1
PORT=3100
SERVE_UI=false                              # UI served via Vite HMR
PAPERCLIP_UI_DEV_MIDDLEWARE=true             # Enable Vite dev middleware
HEARTBEAT_SCHEDULER_ENABLED=true
# No DATABASE_URL needed -- embedded PostgreSQL starts automatically
```

Run with `pnpm dev` which starts the server with Vite HMR and file watching.

### Docker / Production

```bash
# Required
BETTER_AUTH_SECRET=<random-64-char-secret>
DATABASE_URL=postgres://paperclip:paperclip@db:5432/paperclip

# Deployment
PAPERCLIP_DEPLOYMENT_MODE=authenticated
PAPERCLIP_DEPLOYMENT_EXPOSURE=private
PAPERCLIP_PUBLIC_URL=https://paperclip.example.com

# Server
HOST=0.0.0.0
PORT=3100
SERVE_UI=true
NODE_ENV=production

# Storage (optional, defaults to local_disk)
PAPERCLIP_STORAGE_PROVIDER=local_disk

# Agent auth
PAPERCLIP_AGENT_JWT_SECRET=<same-as-better-auth-secret-or-separate>
```

The Docker image (`Dockerfile`) sets these defaults:
- `NODE_ENV=production`
- `HOME=/paperclip`
- `HOST=0.0.0.0`
- `PORT=3100`
- `SERVE_UI=true`
- `PAPERCLIP_HOME=/paperclip`
- `PAPERCLIP_INSTANCE_ID=default`
- `PAPERCLIP_CONFIG=/paperclip/instances/default/config.json`
- `PAPERCLIP_DEPLOYMENT_MODE=authenticated`
- `PAPERCLIP_DEPLOYMENT_EXPOSURE=private`

The `docker-compose.yml` requires `BETTER_AUTH_SECRET` (enforced via `${BETTER_AUTH_SECRET:?...}`) and `PAPERCLIP_PUBLIC_URL` (defaults to `http://localhost:3100`).

### Self-Hosted (Tailscale / LAN)

```bash
PAPERCLIP_DEPLOYMENT_MODE=authenticated
PAPERCLIP_DEPLOYMENT_EXPOSURE=private
PAPERCLIP_PUBLIC_URL=https://paperclip.your-tailnet.ts.net
PAPERCLIP_ALLOWED_HOSTNAMES=paperclip.your-tailnet.ts.net
HOST=0.0.0.0
BETTER_AUTH_SECRET=<secret>
```

### Startup Validation Rules

The server enforces these constraints at boot and will refuse to start if violated:

1. `local_trusted` mode requires the bind host to be a loopback address (`127.0.0.1`, `localhost`, or `::1`).
2. `local_trusted` mode only supports `private` exposure.
3. `authenticated` mode with `explicit` base URL mode requires `PAPERCLIP_AUTH_PUBLIC_BASE_URL` (or equivalent) to be set.
4. `authenticated` mode with `public` exposure requires both `explicit` base URL mode and a `publicBaseUrl`.
5. `authenticated` mode requires `BETTER_AUTH_SECRET` (or `PAPERCLIP_AGENT_JWT_SECRET`).
