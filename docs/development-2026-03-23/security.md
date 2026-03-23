# Paperclip — Security Documentation

_Last updated: 2026-03-23_
_Classification: Internal — do not share externally_

---

## 1. Authentication Mechanisms

Paperclip supports four authentication methods, resolved in the `actorMiddleware` function (`server/src/middleware/auth.ts`). Every request is assigned an `actor` object describing the authenticated principal.

### 1.1 Local Trusted (Implicit Board)

- **Mode:** `local_trusted`
- **Source:** `local_implicit`
- **How it works:** When deployment mode is `local_trusted`, every request is implicitly assigned a board actor with `userId: "local-board"` and `isInstanceAdmin: true`. No credentials are required.
- **Intended use:** Single-operator localhost development. The server binds to loopback only.

### 1.2 Session Authentication (Better Auth)

- **Mode:** `authenticated`
- **Source:** `session`
- **How it works:** When no `Authorization: Bearer` header is present, the middleware calls `resolveSession(req)` which delegates to Better Auth (`server/src/auth/better-auth.ts`). Better Auth uses the `betterAuth` library with a Drizzle/PostgreSQL adapter and email+password sign-up.
- **Session resolution:** Better Auth's `api.getSession()` reads session cookies, validates them against the `session` table, and returns user+session objects.
- **Company scoping:** After session resolution, active `company_memberships` rows for the user are loaded and attached as `companyIds` on the actor.
- **Instance admin:** Checked via the `instance_user_roles` table (role = `instance_admin`).
- **Configuration:**
  - `BETTER_AUTH_SECRET` (required in authenticated mode) — signing secret for session tokens
  - `PAPERCLIP_PUBLIC_URL` — used to derive auth base URL, trusted origins, and callback URLs
  - `BETTER_AUTH_TRUSTED_ORIGINS` — granular override for trusted origins
  - `config.authDisableSignUp` — can disable open sign-up
  - Secure cookies enabled by default; disabled when `PAPERCLIP_PUBLIC_URL` is `http://`

### 1.3 Agent API Key (SHA-256 Hash)

- **Source:** `agent_key`
- **How it works:** Bearer token from the `Authorization` header is SHA-256 hashed (`createHash("sha256")`). The hash is looked up in the `agent_api_keys` table. Only non-revoked keys match (`revokedAt IS NULL`).
- **Agent validation:** The matching agent record must exist, and its status must not be `terminated` or `pending_approval`.
- **Tracking:** `lastUsedAt` is updated on each successful use.
- **Schema (`agent_api_keys` table):**
  - `keyHash` (text) — SHA-256 hex digest of the raw API key
  - `agentId`, `companyId` — scoping
  - `revokedAt` — soft-revocation timestamp
  - Indexed on `keyHash` for fast lookup

### 1.4 Agent JWT (HS256)

- **Source:** `agent_jwt`
- **How it works:** If the bearer token does not match an API key hash, it is parsed as a JWT (`server/src/agent-auth-jwt.ts`). The JWT uses HS256 (HMAC-SHA256) signing.
- **Verification steps:**
  1. Parse three-part base64url-encoded JWT
  2. Validate header `alg` is `HS256`
  3. Recompute HMAC signature and compare using `timingSafeEqual` (constant-time comparison prevents timing attacks)
  4. Parse claims and validate required fields: `sub`, `company_id`, `adapter_type`, `run_id`, `iat`, `exp`
  5. Check expiration (`exp < now` rejects)
  6. Validate `iss` and `aud` if present in claims
  7. Look up agent record in DB and verify status/company match
- **Configuration:**
  - `PAPERCLIP_AGENT_JWT_SECRET` — shared secret (required for JWT auth)
  - `PAPERCLIP_AGENT_JWT_TTL_SECONDS` — token lifetime (default: 48 hours)
  - `PAPERCLIP_AGENT_JWT_ISSUER` — expected issuer (default: `paperclip`)
  - `PAPERCLIP_AGENT_JWT_AUDIENCE` — expected audience (default: `paperclip-api`)
- **JWT claims schema:**
  - `sub` — agent ID
  - `company_id` — company scope
  - `adapter_type` — adapter identifier
  - `run_id` — execution run ID
  - `iat`, `exp` — issued-at and expiration timestamps
  - `iss`, `aud`, `jti` — optional standard claims

---

## 2. Authorization Layers

### 2.1 Actor Types

| Actor Type | Description |
|---|---|
| `board` | Human user accessing via browser (session or local implicit) |
| `agent` | AI agent authenticated via API key or JWT |
| `none` | Unauthenticated request (default in authenticated mode) |

### 2.2 Instance-Level Roles

The `instance_user_roles` table controls instance-wide admin authority:

- **Schema:** `userId` (text), `role` (text, default `instance_admin`)
- **Unique constraint:** One role per user (`userId + role`)
- **Usage:** `isInstanceAdmin` flag on board actors controls access to instance-level operations

### 2.3 Company-Scoped Access

- **`company_memberships` table:** Maps principals (users or agents) to companies with status tracking
  - `principalType` — `user` or other principal types
  - `principalId` — user/agent ID
  - `status` — `active` or other states
  - `membershipRole` — optional role within company
  - Unique constraint on `(companyId, principalType, principalId)`
- Board actors carry a `companyIds` array of active memberships
- Agent actors carry a single `companyId` from their API key or JWT claims

### 2.4 Fine-Grained Permissions

The `principal_permission_grants` table provides granular permission control:

- **Schema:**
  - `companyId` — scope to a specific company
  - `principalType` + `principalId` — who the grant applies to
  - `permissionKey` — permission identifier string
  - `scope` — optional JSONB payload for conditional/scoped permissions
  - `grantedByUserId` — audit trail
- **Unique constraint:** `(companyId, principalType, principalId, permissionKey)` — one grant per permission per principal per company
- **Indexed:** Company + permission key for fast permission lookups

### 2.5 Board Claim Flow (local_trusted to authenticated migration)

When running in `authenticated` mode, if the only instance admin is `local-board`, Paperclip emits a one-time claim URL at startup:

- URL format: `/board-claim/<token>?code=<code>`
- A signed-in user claims board ownership, is promoted to `instance_admin`, and `local-board` admin role is demoted
- Active company memberships are ensured for the claiming user

---

## 3. CSRF Protection — Board Mutation Guard

**File:** `server/src/middleware/board-mutation-guard.ts`

### How It Works

1. **Safe methods bypass:** `GET`, `HEAD`, `OPTIONS` are always allowed
2. **Non-board actors bypass:** Agent-authenticated requests skip CSRF checks
3. **Local implicit bypass:** In `local_trusted` mode, the implicit board actor (`source: "local_implicit"`) skips origin checks to support clients that omit origin headers (e.g., multipart uploads)
4. **Origin/Referer validation:** For `authenticated` board actors, the middleware validates that the request's `Origin` or `Referer` header matches a trusted origin

### Trusted Origin Resolution

Trusted origins are dynamically built per-request:

- Default dev origins: `http://localhost:3100`, `http://127.0.0.1:3100`
- The request's own `Host` header generates both `http://` and `https://` variants
- All comparisons are case-insensitive

### Failure Response

Untrusted board mutations return `403` with:
```json
{ "error": "Board mutation requires trusted browser origin" }
```

---

## 4. Private Hostname Guard

**File:** `server/src/middleware/private-hostname-guard.ts`

### Purpose

Restricts which hostnames can access the Paperclip instance, critical for `authenticated/private` deployments on Tailscale/VPN/LAN.

### How It Works

1. **Disabled path:** When `opts.enabled` is false, the guard is a no-op
2. **Hostname extraction:** Reads `x-forwarded-host` (first value) or `Host` header
3. **Allow set construction:**
   - Always includes `localhost`, `127.0.0.1`, `::1`
   - Adds configured `allowedHostnames` (normalized, deduplicated)
   - Adds the bind host unless it is `0.0.0.0`
4. **Loopback always passes:** `localhost`, `127.0.0.1`, `::1` are hardcoded as safe
5. **Blocked requests:** Return `403` with a message suggesting `pnpm paperclipai allowed-hostname <host>`

### Configuration

- `PAPERCLIP_ALLOWED_HOSTNAMES` — comma-separated list of additional allowed hostnames
- `pnpm paperclipai allowed-hostname <host>` — CLI command to add a hostname to the config

---

## 5. Data Protection — Secret Management

### 5.1 Architecture

Secrets are stored in two tables:

- **`company_secrets`** — metadata: name, provider, company scope, latest version, description
  - Provider default: `local_encrypted`
  - Unique constraint: `(companyId, name)`
  - Supports `externalRef` for external secret providers
- **`company_secret_versions`** — versioned secret material
  - `material` (JSONB) — encrypted payload (provider-specific format)
  - `valueSha256` — hash of plaintext for integrity/dedup
  - `version` (integer) — monotonically increasing per secret
  - `revokedAt` — soft revocation for rotation
  - Unique constraint: `(secretId, version)`

### 5.2 Local Encrypted Provider

**File:** `server/src/secrets/local-encrypted-provider.ts`

- **Algorithm:** AES-256-GCM (authenticated encryption)
- **Key derivation:** 256-bit (32-byte) master key
- **Encrypted material format (`local_encrypted_v1`):**
  - `iv` — 12-byte random initialization vector (base64)
  - `tag` — GCM authentication tag (base64)
  - `ciphertext` — encrypted value (base64)
- **Master key sources (checked in order):**
  1. `PAPERCLIP_SECRETS_MASTER_KEY` environment variable (hex, base64, or raw 32-char)
  2. File at `PAPERCLIP_SECRETS_MASTER_KEY_FILE` or default `data/secrets/master.key`
  3. Auto-generated 32-byte random key, written with `0o600` permissions
- **Strict mode:** `PAPERCLIP_SECRETS_STRICT_MODE=true` — requires all sensitive env keys (`*_API_KEY`, `*_TOKEN`, `*_SECRET`) to use secret references instead of inline values

### 5.3 Secret Rotation

- Secrets support multiple versions via `company_secret_versions`
- Old versions can be revoked via `revokedAt` timestamp
- `latestVersion` on `company_secrets` tracks the current active version
- Migration helper: `pnpm secrets:migrate-inline-env` converts inline env secrets to encrypted references

---

## 6. Invite System

**Table:** `invites`

- `tokenHash` — hashed invite token (unique index)
- `inviteType` — `company_join`, `bootstrap_ceo`, etc.
- `allowedJoinTypes` — controls whether human/agent/both can accept
- `expiresAt` — time-limited invites
- `revokedAt`, `acceptedAt` — lifecycle tracking
- Bootstrap CEO invites are used for first-admin onboarding in authenticated mode

---

## 7. Security Configuration by Deployment Mode

| Feature | `local_trusted` | `authenticated/private` | `authenticated/public` |
|---|---|---|---|
| Human login | Not required | Required (Better Auth) | Required (Better Auth) |
| Host binding | Loopback only | `0.0.0.0` (configurable) | `0.0.0.0` |
| Private hostname guard | Disabled | Enabled | Enabled |
| Board mutation CSRF | Bypassed (local_implicit) | Enforced (origin/referer) | Enforced (origin/referer) |
| Explicit public URL | Not required | Auto-derived | Required |
| Company deletion | Enabled | Disabled by default | Disabled by default |
| `BETTER_AUTH_SECRET` | Not required | Required | Required |
| Secure cookies | N/A | Depends on URL scheme | Yes (HTTPS) |

---

## 8. Security Recommendations

### Production Deployment

1. **Always use `authenticated` mode** for any non-localhost deployment
2. **Set `BETTER_AUTH_SECRET`** to a strong, unique random string (minimum 32 characters)
3. **Set `PAPERCLIP_AGENT_JWT_SECRET`** to a separate strong random string
4. **Use HTTPS** — set `PAPERCLIP_PUBLIC_URL` to an `https://` URL so secure cookies are enabled
5. **Enable strict secrets mode** (`PAPERCLIP_SECRETS_STRICT_MODE=true`) to prevent inline API keys in agent configs
6. **Restrict hostnames** — only add hostnames you control to `PAPERCLIP_ALLOWED_HOSTNAMES`

### Key Management

7. **Protect the master key file** — default at `~/.paperclip/instances/default/secrets/master.key` with `0o600` permissions
8. **Back up the master key** separately from database backups — without it, encrypted secrets are unrecoverable
9. **Rotate agent API keys** periodically — revoke old keys via `revokedAt`
10. **Set JWT TTL appropriately** — default 48 hours; reduce for higher-security environments

### Network Security

11. **Use `private` exposure** with Tailscale/VPN for internal deployments
12. **Never expose `local_trusted` mode** beyond localhost
13. **Review allowed hostnames** — the hostname guard is your first line of defense in private mode

### Operational Security

14. **Audit `instance_user_roles`** — ensure only authorized users hold `instance_admin`
15. **Monitor `agent_api_keys.lastUsedAt`** — detect unused or suspicious keys
16. **Review `principal_permission_grants`** — validate fine-grained permissions periodically
17. **Run `paperclipai doctor`** regularly — validates auth, secrets, database, and deployment configuration
