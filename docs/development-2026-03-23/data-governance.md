# Paperclip — Data Governance
_Last updated: 2026-03-23_

## Applicability

This document is generated because the Paperclip database schema stores personally identifiable information (PII) including user emails, names, passwords, IP addresses, and authentication tokens.

---

## PII Inventory

### `user` Table (`packages/db/src/schema/auth.ts` — `authUsers`)

| Column | PII Type | Sensitivity |
|--------|----------|-------------|
| `name` | Full name | Medium |
| `email` | Email address | High |
| `image` | Profile image URL | Low |

### `account` Table (`packages/db/src/schema/auth.ts` — `authAccounts`)

| Column | PII Type | Sensitivity |
|--------|----------|-------------|
| `access_token` | OAuth token | Critical |
| `refresh_token` | OAuth token | Critical |
| `id_token` | OAuth identity token | Critical |
| `password` | Hashed password | Critical |

### `session` Table (`packages/db/src/schema/auth.ts` — `authSessions`)

| Column | PII Type | Sensitivity |
|--------|----------|-------------|
| `token` | Session token | Critical |
| `ip_address` | Client IP | Medium |
| `user_agent` | Browser fingerprint | Low-Medium |

### `join_requests` Table (`packages/db/src/schema/join_requests.ts`)

| Column | PII Type | Sensitivity |
|--------|----------|-------------|
| `request_ip` | Client IP | Medium |
| `request_email_snapshot` | Email at time of request | High |
| `claim_secret_hash` | Hashed claim secret | High |

### `invites` Table (`packages/db/src/schema/invites.ts`)

| Column | PII Type | Sensitivity |
|--------|----------|-------------|
| `token_hash` | Hashed invite token | High |
| `invited_by_user_id` | User reference | Low |

### `agent_api_keys` Table (`packages/db/src/schema/agent_api_keys.ts`)

| Column | PII Type | Sensitivity |
|--------|----------|-------------|
| `key_hash` | Hashed API key | High |

### `company_secrets` Table (`packages/db/src/schema/company_secrets.ts`)

| Column | PII Type | Sensitivity |
|--------|----------|-------------|
| `external_ref` | External secret reference | Medium |

Note: Actual secret values are stored in `company_secret_versions` with encryption (provider: `local_encrypted`).

---

## Security Controls In Place

### Authentication Tokens
- **API keys** are SHA-256 hashed before storage (`keyHash` column); raw keys are never persisted
- **Invite tokens** are SHA-256 hashed (`tokenHash` column)
- **Claim secrets** are hashed (`claimSecretHash` column) with expiration timestamps
- **Session tokens** are managed by `better-auth` framework

### Passwords
- Stored in the `account` table's `password` column; hashing is handled by `better-auth`
- Password field is nullable (OAuth-only accounts may not have passwords)

### Secrets Management
- Company secrets use a dedicated encrypted storage provider (`local_encrypted` default)
- Secrets can optionally use external providers (configured via `PAPERCLIP_SECRETS_PROVIDER`)
- Strict mode (`PAPERCLIP_SECRETS_STRICT_MODE`) can enforce that all secrets are managed through the secret store
- Master encryption key stored at a configurable file path (`secretsMasterKeyFilePath`)

### IP Address Collection
- Client IP is recorded on sessions (`ip_address`) and join requests (`request_ip`)
- Used for security auditing, not analytics

---

## Data Retention Considerations

### No Explicit PII Retention Policy
- Auth tables use `CASCADE` on delete for sessions and accounts (tied to user lifecycle)
- No automated data expiration for:
  - Session records (accumulate indefinitely)
  - Join request IP addresses and email snapshots
  - Activity log entries that may reference user identifiers
  - Heartbeat run events and logs that may contain user-related content

### Database Backups
- Backups contain all PII in unencrypted form (PostgreSQL dump)
- Backup retention configured via `databaseBackupRetentionDays` but no encryption-at-rest for backup files
- Backup directory is configurable (`databaseBackupDir`)

---

## Recommendations

### Short-Term
1. **Add session expiration cleanup** — Implement a periodic job to purge expired sessions from the `session` table
2. **Encrypt backup files** — Add GPG or AES encryption to `scripts/backup-db.sh` output
3. **Document retention periods** — Define and enforce retention periods for join requests, activity logs, and heartbeat data

### Medium-Term
4. **PII audit logging** — Track access to PII fields for compliance (who accessed what, when)
5. **Data export/deletion** — Implement user data export and right-to-erasure endpoints for GDPR/CCPA compliance
6. **IP address anonymization** — Consider hashing or truncating stored IP addresses after a retention period

### Long-Term
7. **Field-level encryption** — Encrypt email and name fields at rest (not just secrets)
8. **Secret rotation** — Implement automated rotation for the master encryption key and agent API keys
9. **Compliance framework** — If serving EU users, implement full GDPR data processing records
