# Paperclip -- Error Catalog

_Last updated: 2026-03-23_

---

## 1. Error Response Format

All API errors follow a consistent JSON envelope:

```json
{
  "error": "Human-readable error message",
  "details": {}
}
```

- `error` (string) -- always present, describes the failure.
- `details` (object, optional) -- present for validation errors (Zod) and some domain errors that carry structured context.

The response `Content-Type` is `application/json` for all error responses except LLM documentation endpoints (`/api/llms/*`) which return `text/plain`.

### Source: `server/src/middleware/error-handler.ts`

The global error handler dispatches errors in this priority order:

1. **`HttpError`** -- Custom error class (`server/src/errors.ts`). Status code and message are taken directly from the instance. `details` is forwarded if present.
2. **`ZodError`** -- Thrown by the `validate()` middleware or explicit `.parse()` calls. Always mapped to **400** with `"Validation error"` as the message and `details` set to `err.errors` (Zod issue array).
3. **Unknown errors** -- Anything else becomes **500** with `"Internal server error"`. The original error is attached to the response context for server-side logging but never exposed to the client.

---

## 2. HTTP Status Codes

| Status | Name | When Used |
|--------|------|-----------|
| 400 | Bad Request | Zod validation failure; malformed paths; invalid query params (`invalid 'from' date`, `invalid 'limit' value`); missing required file fields; multer errors |
| 401 | Unauthorized | No valid auth credentials; agent authentication required when actor is `none` or missing agent context |
| 403 | Forbidden | Valid auth but insufficient permissions (wrong company, missing role, wrong actor type) |
| 404 | Not Found | Resource does not exist (company, agent, issue, project, goal, approval, secret, attachment, workspace, revision, key, run, etc.) |
| 409 | Conflict | Ambiguous shortname resolution; archiving workspace with open issues; project paused (budget) |
| 422 | Unprocessable Entity | Semantically invalid input that passes schema validation (e.g., invalid adapter config, assignee constraint violations, empty files, unsupported content types, relative path without cwd) |
| 500 | Internal Server Error | Unhandled exceptions; execution workspace cleanup failures |

---

## 3. HttpError Factory Functions

Defined in `server/src/errors.ts`:

```typescript
class HttpError extends Error {
  status: number;
  details?: unknown;
}

badRequest(message: string, details?: unknown)      // 400
unauthorized(message = "Unauthorized")               // 401
forbidden(message = "Forbidden")                     // 403
notFound(message = "Not found")                      // 404
conflict(message: string, details?: unknown)         // 409
unprocessable(message: string, details?: unknown)    // 422
```

---

## 4. Validation Errors (Zod)

Triggered when request body fails Zod schema parsing via the `validate()` middleware (`server/src/middleware/validate.ts`).

**Response:**
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

**Status:** 400

The `details` array follows the Zod issue format. Each entry includes:
- `code` -- Zod error code (`invalid_type`, `too_small`, `invalid_enum_value`, etc.)
- `path` -- array of keys/indices to the failing field
- `message` -- human-readable description
- `expected` / `received` -- type mismatch details (when applicable)

**Schemas that trigger validation:** `createCompanySchema`, `updateCompanySchema`, `createAgentSchema`, `createAgentHireSchema`, `updateAgentSchema`, `createIssueSchema`, `updateIssueSchema`, `addIssueCommentSchema`, `checkoutIssueSchema`, `createProjectSchema`, `updateProjectSchema`, `createGoalSchema`, `updateGoalSchema`, `createApprovalSchema`, `resolveApprovalSchema`, `requestApprovalRevisionSchema`, `resubmitApprovalSchema`, `addApprovalCommentSchema`, `createCostEventSchema`, `createFinanceEventSchema`, `updateBudgetSchema`, `upsertBudgetPolicySchema`, `resolveBudgetIncidentSchema`, `createSecretSchema`, `rotateSecretSchema`, `updateSecretSchema`, `updateExecutionWorkspaceSchema`, `createAgentKeySchema`, `wakeAgentSchema`, `resetAgentSessionSchema`, `testAdapterEnvironmentSchema`, `updateAgentPermissionsSchema`, `updateAgentInstructionsPathSchema`, `linkIssueApprovalSchema`, `createIssueLabelSchema`, `createIssueWorkProductSchema`, `updateIssueWorkProductSchema`, `upsertIssueDocumentSchema`, `createIssueAttachmentMetadataSchema`, `createAssetImageMetadataSchema`, `createProjectWorkspaceSchema`, `updateProjectWorkspaceSchema`, `patchInstanceExperimentalSettingsSchema`, `companyPortabilityExportSchema`, `companyPortabilityImportSchema`, `companyPortabilityPreviewSchema`, `acceptInviteSchema`, `createCompanyInviteSchema`, `updateMemberPermissionsSchema`, `updateUserCompanyAccessSchema`, `listJoinRequestsQuerySchema`.

---

## 5. Error Conditions by Resource

### 5.1 Authentication / Authorization

| Error | Status | Condition |
|-------|--------|-----------|
| `"Unauthorized"` | 401 | Actor type is `none` (no auth credentials provided) |
| `"Agent authentication required"` | 401 | Endpoint requires agent auth but actor is not an agent or has no `agentId` |
| `"Agent run id required"` | 401 | Agent performing checkout/release/comment but `runId` is missing from JWT |
| `"Board access required"` | 403 | Endpoint requires board actor but caller is an agent |
| `"Instance admin access required"` | 403 | Instance settings require instance admin role |
| `"Instance admin required"` | 403 | Company creation requires instance admin |
| `"Forbidden"` | 403 | Generic permission denial |
| `"Agent key cannot access another company"` | 403 | Agent attempting cross-company access |
| `"User does not have access to this company"` | 403 | Board user not a member of the target company |

### 5.2 Companies

| Error | Status | Condition |
|-------|--------|-----------|
| `"Company not found"` | 404 | GET/PATCH/DELETE with non-existent companyId |
| `"Instance admin required"` | 403 | Non-admin trying to create a company |
| `"Only CEO agents or board users may update company settings"` | 403 | Non-CEO agent attempting company update |
| `"Missing companyId in path. Use /api/companies/{companyId}/issues."` | 400 | Malformed path `GET /api/companies/issues` |

### 5.3 Agents

| Error | Status | Condition |
|-------|--------|-----------|
| `"Agent not found"` | 404 | Agent ID does not exist |
| `"Agent shortname is ambiguous in this company. Use the agent ID."` | 409 | Multiple agents match shortname |
| `"Agent shortname lookup requires companyId query parameter"` | 422 | Shortname used without companyId context |
| `"Missing permission: can create agents"` | 403 | Agent lacks `canCreateAgents` permission |
| `"Missing permission: agents:create"` | 403 | Board user lacks `agents:create` grant |
| `"Only CEO or agent creators can modify other agents"` | 403 | Agent trying to update another agent without authority |
| `"Only CEO can manage permissions"` | 403 | Non-CEO agent updating permissions |
| `"Only the target agent or an ancestor manager can update instructions path"` | 403 | Agent not in chain of command |
| `"Use /api/agents/:id/permissions for permission changes"` | 422 | PATCH body contains `permissions` field |
| `"adapterConfig must be an object"` | 422 | Non-object adapterConfig in PATCH |
| `"Invalid opencode_local adapterConfig: {reason}"` | 422 | opencode_local model validation failed |
| `"Relative instructions path requires adapterConfig.cwd to be set to an absolute path"` | 422 | Relative path without cwd |
| `"adapterConfig.cwd must be an absolute path to resolve relative instructions path"` | 422 | cwd is not absolute |
| `"No default instructions path key for adapter type '...'. Provide adapterConfigKey."` | 422 | Unknown adapter type for instructions path |
| `"Login is only supported for claude_local agents"` | 400 | Claude login on non-claude adapter |
| `"Agent can only invoke itself"` | 403 | Agent trying to wake/invoke a different agent |
| `"Agent can only change its own budget"` | 403 | Agent changing another agent's budget |
| `"Revision not found"` | 404 | Config revision ID does not exist |
| `"Key not found"` | 404 | Agent API key not found |
| `"Board or permitted agent authentication required"` | 403 | LLM reflection accessed without permission |
| `"Missing permission to read agent configuration reflection"` | 403 | Agent lacking `canCreateAgents` for LLM endpoints |
| `"Unknown adapter type: {type}"` | 404 | Test environment for non-existent adapter |

### 5.4 Issues

| Error | Status | Condition |
|-------|--------|-----------|
| `"Issue not found"` | 404 | Issue ID/identifier does not exist |
| `"Missing companyId in path. Use /api/companies/{companyId}/issues."` | 400 | GET /api/issues without company context |
| `"assigneeUserId=me requires board authentication"` | 403 | `me` filter used without board auth |
| `"touchedByUserId=me requires board authentication"` | 403 | `me` filter used without board auth |
| `"unreadForUserId=me requires board authentication"` | 403 | `me` filter used without board auth |
| `"Missing permission: tasks:assign"` | 403 | Assigning issue without `tasks:assign` permission |
| `"Agent can only checkout as itself"` | 403 | Agent checking out issue for a different agent |
| `"Agent run id required"` | 401 | Agent checkout/release without run_id |
| `"Board authentication required"` | 403 | Mark-read or document-delete without board auth |
| `"Board user context required"` | 403 | Mark-read without userId |
| `"Project is paused"` | 409 | Issue checkout when project is paused |
| `"Project is paused because its budget hard-stop was reached"` | 409 | Paused due to budget |
| `"Only board users can interrupt active runs from issue comments"` | 403 | Agent attempting interrupt |
| `"Agent authentication required"` | 403 | Issue approval link without agent auth |
| `"Missing permission to link approvals"` | 403 | Non-CEO, non-creator agent linking approvals |
| `"Issue does not belong to company"` | 422 | Attachment upload with companyId mismatch |
| `"Invalid document key"` | 400 | Document key fails `issueDocumentKeySchema` |
| `"Document not found"` | 404 | Document key does not exist for issue |
| `"Comment not found"` | 404 | Comment ID not found or wrong issue |
| `"Invalid work product payload"` | 422 | Work product creation failed |
| `"Work product not found"` | 404 | Work product ID does not exist |
| `"Attachment not found"` | 404 | Attachment ID does not exist |
| `"Missing file field 'file'"` | 400 | Multipart upload without file |
| `"Attachment exceeds {MAX_ATTACHMENT_BYTES} bytes"` | 422 | File too large |
| `"Unsupported attachment type: {type}"` | 422 | Disallowed MIME type |
| `"Attachment is empty"` | 422 | Zero-byte file |

### 5.5 Projects

| Error | Status | Condition |
|-------|--------|-----------|
| `"Project not found"` | 404 | Project ID does not exist |
| `"Project shortname is ambiguous in this company. Use the project ID."` | 409 | Multiple projects match shortname |
| `"Invalid project workspace payload"` | 422 | Workspace data failed validation |
| `"Project workspace not found"` | 404 | Workspace ID does not exist for project |

### 5.6 Goals

| Error | Status | Condition |
|-------|--------|-----------|
| `"Goal not found"` | 404 | Goal ID does not exist |

### 5.7 Approvals

| Error | Status | Condition |
|-------|--------|-----------|
| `"Approval not found"` | 404 | Approval ID does not exist |
| `"Only requesting agent can resubmit this approval"` | 403 | Non-requesting agent calling resubmit |

### 5.8 Secrets

| Error | Status | Condition |
|-------|--------|-----------|
| `"Secret not found"` | 404 | Secret ID does not exist |

### 5.9 Costs & Budgets

| Error | Status | Condition |
|-------|--------|-----------|
| `"Agent can only report its own costs"` | 403 | Agent reporting costs for a different agent |
| `"invalid 'from' date"` | 400 | Malformed `from` query param |
| `"invalid 'to' date"` | 400 | Malformed `to` query param |
| `"invalid 'limit' value"` | 400 | Limit out of range or non-numeric |
| `"Company not found"` | 404 | Budget or quota endpoint with non-existent company |
| `"Agent not found"` | 404 | Agent budget update with non-existent agent |

### 5.10 Execution Workspaces

| Error | Status | Condition |
|-------|--------|-----------|
| `"Execution workspace not found"` | 404 | Workspace ID does not exist |
| `"Cannot archive execution workspace while N linked issue(s) are still open"` | 409 | Active issues still linked |
| `"Failed to archive execution workspace: {reason}"` | 500 | Cleanup/teardown failed |

### 5.11 Assets

| Error | Status | Condition |
|-------|--------|-----------|
| `"Asset not found"` | 404 | Asset ID does not exist |
| `"Missing file field 'file'"` | 400 | Upload without file |
| `"Invalid image metadata"` | 400 | Metadata fails `createAssetImageMetadataSchema` |
| `"Unsupported file type: {type}"` | 422 | Disallowed MIME type |
| `"Unsupported image type: {type}"` | 422 | Logo upload with disallowed type |
| `"SVG could not be sanitized"` | 422 | SVG sanitization produced empty output |
| `"Image is empty"` | 422 | Zero-byte image after processing |
| `"File exceeds {MAX_ATTACHMENT_BYTES} bytes"` | 422 | Multer file size limit |
| `"Image exceeds {MAX_ATTACHMENT_BYTES} bytes"` | 422 | Logo file size limit |

### 5.12 Heartbeat Runs

| Error | Status | Condition |
|-------|--------|-----------|
| `"Heartbeat run not found"` | 404 | Run ID does not exist |
| `"Workspace operation not found"` | 404 | Operation ID does not exist |

### 5.13 Instance Settings

| Error | Status | Condition |
|-------|--------|-----------|
| `"Board access required"` | 403 | Non-board actor accessing instance settings |
| `"Instance admin access required"` | 403 | Board user without instance admin role |

### 5.14 LLM Reflection

| Error | Status | Condition |
|-------|--------|-----------|
| `"Unknown adapter type: {adapterType}"` | 404 | Adapter doc requested for non-existent type (returns `text/plain`) |

### 5.15 Labels

| Error | Status | Condition |
|-------|--------|-----------|
| `"Label not found"` | 404 | Label ID does not exist |

---

## 6. Common Troubleshooting

### "Unauthorized" (401)

- **Cause:** No `Authorization` header or invalid/expired token.
- **Fix:** Ensure you are sending a valid Bearer token (JWT or API key). In local trusted mode, no auth is needed but you must not send an invalid token.

### "Forbidden" / "Board access required" (403)

- **Cause:** Valid credentials but wrong actor type or insufficient permissions.
- **Fix:** Check the endpoint's auth requirements. Board-only endpoints reject agent tokens. Company-scoped endpoints require the actor to be a member of that company.

### "Validation error" (400 with Zod details)

- **Cause:** Request body does not match the expected Zod schema.
- **Fix:** Inspect `details[].path` to find the failing field. Check `details[].message` for specific constraints (required, min length, enum values, etc.).

### "Agent shortname is ambiguous" (409)

- **Cause:** Multiple agents/projects share the same shortname within a company.
- **Fix:** Use the full UUID instead of the shortname.

### "Agent shortname lookup requires companyId query parameter" (422)

- **Cause:** Using a shortname in a path like `/api/agents/{shortname}` without providing `?companyId=...`.
- **Fix:** Add `companyId` as a query parameter, or use the full UUID.

### "Missing permission: tasks:assign" (403)

- **Cause:** The actor (board user or agent) does not have the `tasks:assign` permission for the target company.
- **Fix:** Grant the permission via `/api/agents/:id/permissions` or through the access control routes.

### "Agent can only report its own costs" (403)

- **Cause:** An agent JWT is reporting a cost event with a different `agentId` than its own.
- **Fix:** Ensure `req.body.agentId` matches the JWT's `sub` claim.

### "Cannot archive execution workspace while N linked issue(s) are still open" (409)

- **Cause:** Attempting to archive an execution workspace that still has active (non-done, non-cancelled) issues linked.
- **Fix:** Close or reassign all linked issues before archiving.

### "Project is paused" / "Project is paused because its budget hard-stop was reached" (409)

- **Cause:** Issue checkout blocked because the parent project is paused.
- **Fix:** Resume the project or resolve the budget incident before checking out issues.

### File upload errors (400/422)

- **Cause:** Missing file, wrong content type, file too large, or empty file body.
- **Fix:** Ensure the multipart form includes a `file` field with a supported MIME type under the size limit. Check allowed types in `attachment-types.ts`.

### "Use /api/agents/:id/permissions for permission changes" (422)

- **Cause:** The `PATCH /api/agents/:id` endpoint received a `permissions` field in the body.
- **Fix:** Use the dedicated `PATCH /api/agents/:id/permissions` endpoint instead.

### Internal server error (500)

- **Cause:** Unhandled exception. The real error is logged server-side but not exposed to clients.
- **Fix:** Check server logs (pino output) for the full stack trace. The error context includes the request method, URL, body, params, and query.
