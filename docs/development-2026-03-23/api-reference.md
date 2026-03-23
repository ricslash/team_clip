# Paperclip -- API Reference

_Last updated: 2026-03-23_

Base URL: `http://localhost:3100`
API prefix: `/api`

---

## Authentication

Four authentication methods are supported:

| Method | Mechanism | Actor Type |
|--------|-----------|------------|
| Local Trusted Mode | No auth header; implicit board actor | `board` (source: `local_implicit`) |
| Agent JWT | `Authorization: Bearer <HS256 JWT>` with `sub`, `company_id`, `adapter_type`, `run_id` | `agent` |
| Agent API Key | `Authorization: Bearer <raw-token>` (SHA-256 hashed server-side) | `agent` |
| Session-Based | Better Auth cookies or bearer token | `board` |

---

## Error Response Format

All errors follow this shape:

```json
{
  "error": "Human-readable message",
  "details": {}
}
```

`details` is optional and present for validation errors or when extra context is available.

---

## Health

### `GET /api/health`

No auth required.

**Response 200:**
```json
{
  "status": "ok",
  "version": "string",
  "deploymentMode": "local_trusted | authenticated",
  "deploymentExposure": "private | public",
  "authReady": true,
  "bootstrapStatus": "ready | bootstrap_pending",
  "bootstrapInviteActive": false,
  "features": {
    "companyDeletionEnabled": true
  }
}
```

---

## Companies

All company routes are mounted at `/api/companies`.

### `GET /api/companies`

List all companies the authenticated actor can access.

- **Auth:** Board
- **Response 200:** `Company[]`

### `GET /api/companies/stats`

Aggregated stats across companies.

- **Auth:** Board
- **Response 200:** `Record<companyId, CompanyStats>`

### `GET /api/companies/:companyId`

Get a single company by ID.

- **Auth:** Board or Agent (CEO agents may read their own company)
- **Response 200:** `Company`
- **Response 404:** `{ "error": "Company not found" }`

### `POST /api/companies`

Create a new company.

- **Auth:** Board (instance admin required)
- **Validation:** `createCompanySchema`
- **Request body:**
  ```json
  {
    "name": "string",
    "issuePrefix": "string",
    "budgetMonthlyCents": 0
  }
  ```
- **Response 201:** `Company`
- **Response 403:** `{ "error": "Instance admin required" }`

### `PATCH /api/companies/:companyId`

Update company settings.

- **Auth:** Board (full update) or Agent (CEO agents, branding fields only via `updateCompanyBrandingSchema`)
- **Validation:** `updateCompanySchema` (board) or `updateCompanyBrandingSchema` (CEO agent)
- **Response 200:** `Company`
- **Response 403:** `{ "error": "Only CEO agents or board users may update company settings" }`
- **Response 404:** `{ "error": "Company not found" }`

### `POST /api/companies/:companyId/archive`

Archive a company (soft delete).

- **Auth:** Board
- **Response 200:** `Company`
- **Response 404:** `{ "error": "Company not found" }`

### `DELETE /api/companies/:companyId`

Permanently delete a company.

- **Auth:** Board
- **Response 200:** `{ "ok": true }`
- **Response 404:** `{ "error": "Company not found" }`

### `POST /api/companies/:companyId/export`

Export a company bundle for portability.

- **Auth:** Company access required
- **Validation:** `companyPortabilityExportSchema`
- **Response 200:** Export bundle object

### `POST /api/companies/import/preview`

Preview an import operation before committing.

- **Auth:** Board (new company) or company access (existing company)
- **Validation:** `companyPortabilityPreviewSchema`
- **Response 200:** Import preview object

### `POST /api/companies/import`

Import a company bundle.

- **Auth:** Board (new company) or company access (existing company)
- **Validation:** `companyPortabilityImportSchema`
- **Response 200:** Import result with `{ company, agents, warnings }`

### `GET /api/companies/issues`

Returns 400 -- guard for malformed path when companyId is empty.

- **Response 400:** `{ "error": "Missing companyId in path. Use /api/companies/{companyId}/issues." }`

---

## Agents

### `GET /api/companies/:companyId/agents`

List all agents for a company.

- **Auth:** Company access
- **Response 200:** `Agent[]` (configs redacted if caller lacks `agents:create` permission)

### `GET /api/companies/:companyId/org`

Get the org chart tree for a company.

- **Auth:** Company access
- **Response 200:** Lean org tree `{ id, name, role, status, reports[] }[]`

### `GET /api/companies/:companyId/agent-configurations`

List agents with their (redacted) adapter/runtime configurations.

- **Auth:** Company access + `agents:create` permission
- **Response 200:** `RedactedAgentConfiguration[]`

### `GET /api/companies/:companyId/adapters/:type/models`

List available models for an adapter type.

- **Auth:** Company access
- **Response 200:** Model list

### `POST /api/companies/:companyId/adapters/:type/test-environment`

Test an adapter environment before creating an agent.

- **Auth:** Company access + `agents:create` permission
- **Validation:** `testAdapterEnvironmentSchema`
- **Request body:** `{ "adapterConfig": {} }`
- **Response 200:** Test result
- **Response 404:** `{ "error": "Unknown adapter type: {type}" }`

### `POST /api/companies/:companyId/agents`

Create a new agent directly (board only).

- **Auth:** Board + company access
- **Validation:** `createAgentSchema`
- **Response 201:** `Agent`

### `POST /api/companies/:companyId/agent-hires`

Hire a new agent (may require approval).

- **Auth:** Company access + `agents:create` permission
- **Validation:** `createAgentHireSchema`
- **Response 201:** `{ agent: Agent, approval: Approval | null }`
- **Response 404:** `{ "error": "Company not found" }`

### `GET /api/agents/me`

Get the currently authenticated agent's detail.

- **Auth:** Agent JWT/API key
- **Response 200:** `AgentDetail` (with chainOfCommand, access state)
- **Response 401:** `{ "error": "Agent authentication required" }`
- **Response 404:** `{ "error": "Agent not found" }`

### `GET /api/agents/me/inbox-lite`

Get a lightweight inbox for the current agent (active issues).

- **Auth:** Agent JWT/API key
- **Response 200:** Lightweight issue list
- **Response 401:** `{ "error": "Agent authentication required" }`

### `GET /api/agents/:id`

Get agent detail by ID or shortname.

- **Auth:** Company access (configs redacted for restricted agent viewers)
- **Response 200:** `AgentDetail`
- **Response 404:** `{ "error": "Agent not found" }`
- **Response 409:** `{ "error": "Agent shortname is ambiguous in this company. Use the agent ID." }`
- **Response 422:** `{ "error": "Agent shortname lookup requires companyId query parameter" }`

### `PATCH /api/agents/:id`

Update an agent's configuration.

- **Auth:** Board, or agent (self, CEO, or agent creators)
- **Validation:** `updateAgentSchema`
- **Response 200:** `Agent`
- **Response 404:** `{ "error": "Agent not found" }`
- **Response 422:** `{ "error": "Use /api/agents/:id/permissions for permission changes" }` or `{ "error": "adapterConfig must be an object" }`

### `PATCH /api/agents/:id/permissions`

Update agent permissions.

- **Auth:** Board or CEO agent
- **Validation:** `updateAgentPermissionsSchema`
- **Response 200:** `AgentDetail`
- **Response 403:** `{ "error": "Only CEO can manage permissions" }`
- **Response 404:** `{ "error": "Agent not found" }`

### `PATCH /api/agents/:id/instructions-path`

Update the instructions file path for an agent.

- **Auth:** Board, target agent, or ancestor manager
- **Validation:** `updateAgentInstructionsPathSchema`
- **Response 200:** `{ agentId, adapterType, adapterConfigKey, path }`
- **Response 404:** `{ "error": "Agent not found" }`
- **Response 422:** `{ "error": "No default instructions path key for adapter type '...'. Provide adapterConfigKey." }`

### `GET /api/agents/:id/configuration`

Get agent configuration (redacted).

- **Auth:** Company access + `agents:create` permission
- **Response 200:** `RedactedAgentConfiguration`
- **Response 404:** `{ "error": "Agent not found" }`

### `GET /api/agents/:id/config-revisions`

List configuration revision history.

- **Auth:** Company access + `agents:create` permission
- **Response 200:** `ConfigRevision[]` (redacted)

### `GET /api/agents/:id/config-revisions/:revisionId`

Get a specific config revision.

- **Auth:** Company access + `agents:create` permission
- **Response 200:** `ConfigRevision` (redacted)
- **Response 404:** `{ "error": "Revision not found" }`

### `POST /api/agents/:id/config-revisions/:revisionId/rollback`

Rollback to a previous configuration revision.

- **Auth:** Board or agent (with update permission)
- **Response 200:** `Agent`
- **Response 404:** `{ "error": "Agent not found" }` or `{ "error": "Revision not found" }`

### `GET /api/agents/:id/runtime-state`

Get runtime state for an agent.

- **Auth:** Board
- **Response 200:** Runtime state object

### `GET /api/agents/:id/task-sessions`

List active task sessions for an agent.

- **Auth:** Board
- **Response 200:** `TaskSession[]` (redacted)

### `POST /api/agents/:id/runtime-state/reset-session`

Reset an agent's runtime session.

- **Auth:** Board
- **Validation:** `resetAgentSessionSchema`
- **Request body:** `{ "taskKey": "string | null" }`
- **Response 200:** Runtime state

### `POST /api/agents/:id/pause`

Pause an agent (cancels active runs).

- **Auth:** Board
- **Response 200:** `Agent`
- **Response 404:** `{ "error": "Agent not found" }`

### `POST /api/agents/:id/resume`

Resume a paused agent.

- **Auth:** Board
- **Response 200:** `Agent`
- **Response 404:** `{ "error": "Agent not found" }`

### `POST /api/agents/:id/terminate`

Terminate an agent (cancels active runs).

- **Auth:** Board
- **Response 200:** `Agent`
- **Response 404:** `{ "error": "Agent not found" }`

### `DELETE /api/agents/:id`

Delete an agent permanently.

- **Auth:** Board
- **Response 200:** `{ "ok": true }`
- **Response 404:** `{ "error": "Agent not found" }`

### `GET /api/agents/:id/keys`

List API keys for an agent.

- **Auth:** Board
- **Response 200:** `AgentKey[]`

### `POST /api/agents/:id/keys`

Create a new API key for an agent.

- **Auth:** Board
- **Validation:** `createAgentKeySchema`
- **Request body:** `{ "name": "string" }`
- **Response 201:** `AgentKey` (includes raw token, only returned once)

### `DELETE /api/agents/:id/keys/:keyId`

Revoke an agent API key.

- **Auth:** Board
- **Response 200:** `{ "ok": true }`
- **Response 404:** `{ "error": "Key not found" }`

### `POST /api/agents/:id/wakeup`

Queue a wakeup/heartbeat run for an agent.

- **Auth:** Company access (agent can only invoke itself)
- **Validation:** `wakeAgentSchema`
- **Request body:** `{ "source": "string", "triggerDetail?": "string", "reason?": "string", "payload?": {}, "idempotencyKey?": "string", "forceFreshSession?": boolean }`
- **Response 202:** Heartbeat run object, or `{ "status": "skipped" }`
- **Response 403:** `{ "error": "Agent can only invoke itself" }`

### `POST /api/agents/:id/heartbeat/invoke`

Invoke a heartbeat run directly (legacy).

- **Auth:** Company access (agent can only invoke itself)
- **Response 202:** Heartbeat run object, or `{ "status": "skipped" }`

### `POST /api/agents/:id/claude-login`

Trigger Claude login flow for a `claude_local` agent.

- **Auth:** Board
- **Response 200:** Login result
- **Response 400:** `{ "error": "Login is only supported for claude_local agents" }`

### `PATCH /api/agents/:agentId/budgets`

Update an agent's monthly budget.

- **Auth:** Board or agent (self only)
- **Validation:** `updateBudgetSchema`
- **Response 200:** `Agent`
- **Response 403:** `{ "error": "Agent can only change its own budget" }`
- **Response 404:** `{ "error": "Agent not found" }`

---

## Heartbeat Runs

### `GET /api/companies/:companyId/heartbeat-runs`

List heartbeat runs for a company.

- **Auth:** Company access
- **Query params:** `agentId?`, `limit?` (1-1000, default 200)
- **Response 200:** `HeartbeatRun[]`

### `GET /api/companies/:companyId/live-runs`

List currently active (queued/running) heartbeat runs.

- **Auth:** Company access
- **Query params:** `minCount?` (0-20, backfills recent runs if fewer active)
- **Response 200:** `LiveRun[]`

### `GET /api/heartbeat-runs/:runId`

Get a specific heartbeat run.

- **Auth:** Company access
- **Response 200:** `HeartbeatRun` (redacted)
- **Response 404:** `{ "error": "Heartbeat run not found" }`

### `POST /api/heartbeat-runs/:runId/cancel`

Cancel a heartbeat run.

- **Auth:** Board
- **Response 200:** `HeartbeatRun`

### `GET /api/heartbeat-runs/:runId/events`

List events for a heartbeat run.

- **Auth:** Company access
- **Query params:** `afterSeq?` (default 0), `limit?` (default 200)
- **Response 200:** `HeartbeatRunEvent[]` (redacted)

### `GET /api/heartbeat-runs/:runId/log`

Read raw log output for a heartbeat run.

- **Auth:** Company access
- **Query params:** `offset?` (default 0), `limitBytes?` (default 256000)
- **Response 200:** `{ data, offset, hasMore }`

### `GET /api/heartbeat-runs/:runId/workspace-operations`

List workspace operations performed during a run.

- **Auth:** Company access
- **Response 200:** `WorkspaceOperation[]`

### `GET /api/heartbeat-runs/:runId/issues`

List issues associated with a heartbeat run.

- **Auth:** Any (no explicit auth check beyond actor presence)
- **Response 200:** Issue list

### `GET /api/workspace-operations/:operationId/log`

Read log for a specific workspace operation.

- **Auth:** Company access
- **Query params:** `offset?`, `limitBytes?`
- **Response 200:** `{ data, offset, hasMore }`
- **Response 404:** `{ "error": "Workspace operation not found" }`

---

## Instance

### `GET /api/instance/scheduler-heartbeats`

List agents with scheduler heartbeat configuration across all companies.

- **Auth:** Board
- **Response 200:** `InstanceSchedulerHeartbeatAgent[]`

### `GET /api/instance/settings/experimental`

Get experimental instance settings.

- **Auth:** Board (instance admin)
- **Response 200:** Experimental settings object
- **Response 403:** `{ "error": "Instance admin access required" }`

### `PATCH /api/instance/settings/experimental`

Update experimental instance settings.

- **Auth:** Board (instance admin)
- **Validation:** `patchInstanceExperimentalSettingsSchema`
- **Response 200:** Updated experimental settings

---

## Issues

### `GET /api/issues`

Returns 400 -- guard for missing companyId.

- **Response 400:** `{ "error": "Missing companyId in path. Use /api/companies/{companyId}/issues." }`

### `GET /api/companies/:companyId/issues`

List issues for a company with filtering.

- **Auth:** Company access
- **Query params:** `status?`, `assigneeAgentId?`, `assigneeUserId?` (supports `me`), `touchedByUserId?` (supports `me`), `unreadForUserId?` (supports `me`), `projectId?`, `parentId?`, `labelId?`, `q?`
- **Response 200:** `Issue[]`
- **Response 403:** `{ "error": "assigneeUserId=me requires board authentication" }`

### `GET /api/issues/:id`

Get issue detail (supports UUID or identifier like `PAP-39`).

- **Auth:** Company access
- **Response 200:** Full issue detail with `ancestors`, `project`, `goal`, `mentionedProjects`, `currentExecutionWorkspace`, `workProducts`, document payload
- **Response 404:** `{ "error": "Issue not found" }`

### `POST /api/companies/:companyId/issues`

Create a new issue.

- **Auth:** Company access (+ `tasks:assign` permission if assigning)
- **Validation:** `createIssueSchema`
- **Response 201:** `Issue`

### `PATCH /api/issues/:id`

Update an issue. Supports inline `comment` field to add a comment atomically with the update.

- **Auth:** Company access (+ `tasks:assign` for reassignment; checkout ownership enforced for agents)
- **Validation:** `updateIssueSchema`
- **Request body:** Update fields + optional `comment: string`
- **Response 200:** `{ ...Issue, comment: Comment | null }`
- **Response 404:** `{ "error": "Issue not found" }`
- **Response 422:** Validation failure on assignee constraints

### `DELETE /api/issues/:id`

Delete an issue and its attachments.

- **Auth:** Company access
- **Response 200:** `Issue`
- **Response 404:** `{ "error": "Issue not found" }`

### `POST /api/issues/:id/checkout`

Check out an issue for an agent to work on.

- **Auth:** Company access (agent can only checkout as itself)
- **Validation:** `checkoutIssueSchema`
- **Request body:** `{ "agentId": "uuid", "expectedStatuses": ["todo"] }`
- **Response 200:** Updated issue
- **Response 401:** `{ "error": "Agent run id required" }`
- **Response 403:** `{ "error": "Agent can only checkout as itself" }`
- **Response 409:** `{ "error": "Project is paused" }` or `{ "error": "Project is paused because its budget hard-stop was reached" }`

### `POST /api/issues/:id/release`

Release an issue from active work.

- **Auth:** Company access (checkout ownership enforced)
- **Response 200:** Updated issue
- **Response 404:** `{ "error": "Issue not found" }`

### `POST /api/issues/:id/read`

Mark an issue as read for the current user.

- **Auth:** Board (requires userId)
- **Response 200:** Read state object
- **Response 403:** `{ "error": "Board authentication required" }` or `{ "error": "Board user context required" }`

### `GET /api/issues/:id/heartbeat-context`

Get contextual data for an agent heartbeat on an issue.

- **Auth:** Company access
- **Query params:** `wakeCommentId?`
- **Response 200:** `{ issue, ancestors, project, goal, commentCursor, wakeComment }`

### `GET /api/issues/:id/comments`

List comments on an issue.

- **Auth:** Company access
- **Query params:** `after?` or `afterCommentId?`, `order?` (asc/desc, default desc), `limit?` (max 500)
- **Response 200:** `Comment[]`

### `GET /api/issues/:id/comments/:commentId`

Get a specific comment.

- **Auth:** Company access
- **Response 200:** `Comment`
- **Response 404:** `{ "error": "Comment not found" }`

### `POST /api/issues/:id/comments`

Add a comment to an issue. Supports `reopen` and `interrupt` flags.

- **Auth:** Company access (checkout ownership enforced; `interrupt` requires board)
- **Validation:** `addIssueCommentSchema`
- **Request body:** `{ "body": "string", "reopen?": boolean, "interrupt?": boolean }`
- **Response 201:** `Comment`
- **Response 403:** `{ "error": "Only board users can interrupt active runs from issue comments" }`

### `GET /api/issues/:id/attachments`

List attachments for an issue.

- **Auth:** Company access
- **Response 200:** `Attachment[]` (with `contentPath`)

### `POST /api/companies/:companyId/issues/:issueId/attachments`

Upload a file attachment to an issue (multipart form).

- **Auth:** Company access
- **Request:** multipart/form-data with `file` field
- **Response 201:** `Attachment` (with `contentPath`)
- **Response 400:** `{ "error": "Missing file field 'file'" }`
- **Response 422:** File size, type, or empty errors

### `GET /api/attachments/:attachmentId/content`

Download attachment content (binary stream).

- **Auth:** Company access
- **Response 200:** Binary stream with content-type headers

### `DELETE /api/attachments/:attachmentId`

Delete an attachment.

- **Auth:** Company access
- **Response 200:** `Attachment`
- **Response 404:** `{ "error": "Attachment not found" }`

### `GET /api/issues/:id/work-products`

List work products for an issue.

- **Auth:** Company access
- **Response 200:** `WorkProduct[]`

### `POST /api/issues/:id/work-products`

Create a work product for an issue.

- **Auth:** Company access
- **Validation:** `createIssueWorkProductSchema`
- **Response 201:** `WorkProduct`
- **Response 422:** `{ "error": "Invalid work product payload" }`

### `PATCH /api/work-products/:id`

Update a work product.

- **Auth:** Company access
- **Validation:** `updateIssueWorkProductSchema`
- **Response 200:** `WorkProduct`
- **Response 404:** `{ "error": "Work product not found" }`

### `DELETE /api/work-products/:id`

Delete a work product.

- **Auth:** Company access
- **Response 200:** `WorkProduct`
- **Response 404:** `{ "error": "Work product not found" }`

### `GET /api/issues/:id/documents`

List documents attached to an issue.

- **Auth:** Company access
- **Response 200:** `IssueDocument[]`

### `GET /api/issues/:id/documents/:key`

Get a specific document by key.

- **Auth:** Company access
- **Response 200:** `IssueDocument`
- **Response 400:** `{ "error": "Invalid document key" }`
- **Response 404:** `{ "error": "Document not found" }`

### `PUT /api/issues/:id/documents/:key`

Create or update a document by key.

- **Auth:** Company access
- **Validation:** `upsertIssueDocumentSchema`
- **Request body:** `{ "title?": "string", "format": "string", "body": "string", "changeSummary?": "string", "baseRevisionId?": "string" }`
- **Response 201:** Document (created)
- **Response 200:** Document (updated)

### `GET /api/issues/:id/documents/:key/revisions`

List revisions for a document.

- **Auth:** Company access
- **Response 200:** `DocumentRevision[]`

### `DELETE /api/issues/:id/documents/:key`

Delete a document.

- **Auth:** Board only
- **Response 200:** `{ "ok": true }`
- **Response 403:** `{ "error": "Board authentication required" }`
- **Response 404:** `{ "error": "Document not found" }`

### `GET /api/issues/:id/approvals`

List approvals linked to an issue.

- **Auth:** Company access
- **Response 200:** `Approval[]`

### `POST /api/issues/:id/approvals`

Link an approval to an issue.

- **Auth:** Board, or CEO / agent-creator agents
- **Validation:** `linkIssueApprovalSchema`
- **Request body:** `{ "approvalId": "uuid" }`
- **Response 201:** `Approval[]`

### `DELETE /api/issues/:id/approvals/:approvalId`

Unlink an approval from an issue.

- **Auth:** Board, or CEO / agent-creator agents
- **Response 200:** `{ "ok": true }`

### `GET /api/issues/:issueId/live-runs`

List currently active runs for an issue.

- **Auth:** Company access
- **Response 200:** `LiveRun[]`

### `GET /api/issues/:issueId/active-run`

Get the active heartbeat run for an issue.

- **Auth:** Company access
- **Response 200:** `HeartbeatRun | null`

---

## Labels

### `GET /api/companies/:companyId/labels`

List labels for a company.

- **Auth:** Company access
- **Response 200:** `Label[]`

### `POST /api/companies/:companyId/labels`

Create a new label.

- **Auth:** Company access
- **Validation:** `createIssueLabelSchema`
- **Response 201:** `Label`

### `DELETE /api/labels/:labelId`

Delete a label.

- **Auth:** Company access
- **Response 200:** `Label`
- **Response 404:** `{ "error": "Label not found" }`

---

## Projects

### `GET /api/companies/:companyId/projects`

List projects for a company.

- **Auth:** Company access
- **Response 200:** `Project[]`

### `GET /api/projects/:id`

Get a project by ID or shortname (shortname requires `companyId` query param).

- **Auth:** Company access
- **Response 200:** `Project`
- **Response 404:** `{ "error": "Project not found" }`
- **Response 409:** `{ "error": "Project shortname is ambiguous in this company. Use the project ID." }`

### `POST /api/companies/:companyId/projects`

Create a new project. Optionally create a workspace inline.

- **Auth:** Company access
- **Validation:** `createProjectSchema`
- **Request body:** `{ "name": "string", ..., "workspace?": { ... } }`
- **Response 201:** `Project`
- **Response 422:** `{ "error": "Invalid project workspace payload" }`

### `PATCH /api/projects/:id`

Update a project.

- **Auth:** Company access
- **Validation:** `updateProjectSchema`
- **Response 200:** `Project`
- **Response 404:** `{ "error": "Project not found" }`

### `DELETE /api/projects/:id`

Delete a project.

- **Auth:** Company access
- **Response 200:** `Project`
- **Response 404:** `{ "error": "Project not found" }`

### `GET /api/projects/:id/workspaces`

List workspaces for a project.

- **Auth:** Company access
- **Response 200:** `ProjectWorkspace[]`

### `POST /api/projects/:id/workspaces`

Create a workspace for a project.

- **Auth:** Company access
- **Validation:** `createProjectWorkspaceSchema`
- **Response 201:** `ProjectWorkspace`
- **Response 422:** `{ "error": "Invalid project workspace payload" }`

### `PATCH /api/projects/:id/workspaces/:workspaceId`

Update a project workspace.

- **Auth:** Company access
- **Validation:** `updateProjectWorkspaceSchema`
- **Response 200:** `ProjectWorkspace`
- **Response 404:** `{ "error": "Project workspace not found" }`

### `DELETE /api/projects/:id/workspaces/:workspaceId`

Delete a project workspace.

- **Auth:** Company access
- **Response 200:** `ProjectWorkspace`
- **Response 404:** `{ "error": "Project workspace not found" }`

---

## Goals

### `GET /api/companies/:companyId/goals`

List goals for a company.

- **Auth:** Company access
- **Response 200:** `Goal[]`

### `GET /api/goals/:id`

Get a goal by ID.

- **Auth:** Company access
- **Response 200:** `Goal`
- **Response 404:** `{ "error": "Goal not found" }`

### `POST /api/companies/:companyId/goals`

Create a new goal.

- **Auth:** Company access
- **Validation:** `createGoalSchema`
- **Response 201:** `Goal`

### `PATCH /api/goals/:id`

Update a goal.

- **Auth:** Company access
- **Validation:** `updateGoalSchema`
- **Response 200:** `Goal`
- **Response 404:** `{ "error": "Goal not found" }`

### `DELETE /api/goals/:id`

Delete a goal.

- **Auth:** Company access
- **Response 200:** `Goal`
- **Response 404:** `{ "error": "Goal not found" }`

---

## Approvals

### `GET /api/companies/:companyId/approvals`

List approvals for a company.

- **Auth:** Company access
- **Query params:** `status?` (pending, approved, rejected, revision_requested)
- **Response 200:** `Approval[]` (payload redacted)

### `GET /api/approvals/:id`

Get an approval by ID.

- **Auth:** Company access
- **Response 200:** `Approval` (payload redacted)
- **Response 404:** `{ "error": "Approval not found" }`

### `POST /api/companies/:companyId/approvals`

Create a new approval request.

- **Auth:** Company access
- **Validation:** `createApprovalSchema`
- **Request body:** `{ "type": "string", "payload": {}, "issueIds?": ["uuid"], "requestedByAgentId?": "uuid" }`
- **Response 201:** `Approval`

### `GET /api/approvals/:id/issues`

List issues linked to an approval.

- **Auth:** Company access
- **Response 200:** `Issue[]`

### `POST /api/approvals/:id/approve`

Approve a pending approval (wakes requesting agent).

- **Auth:** Board
- **Validation:** `resolveApprovalSchema`
- **Request body:** `{ "decidedByUserId?": "string", "decisionNote?": "string" }`
- **Response 200:** `Approval`

### `POST /api/approvals/:id/reject`

Reject a pending approval.

- **Auth:** Board
- **Validation:** `resolveApprovalSchema`
- **Response 200:** `Approval`

### `POST /api/approvals/:id/request-revision`

Request revision on a pending approval.

- **Auth:** Board
- **Validation:** `requestApprovalRevisionSchema`
- **Response 200:** `Approval`

### `POST /api/approvals/:id/resubmit`

Resubmit an approval after revision.

- **Auth:** Company access (only the original requesting agent can resubmit)
- **Validation:** `resubmitApprovalSchema`
- **Request body:** `{ "payload?": {} }`
- **Response 200:** `Approval`
- **Response 403:** `{ "error": "Only requesting agent can resubmit this approval" }`

### `GET /api/approvals/:id/comments`

List comments on an approval.

- **Auth:** Company access
- **Response 200:** `ApprovalComment[]`

### `POST /api/approvals/:id/comments`

Add a comment to an approval.

- **Auth:** Company access
- **Validation:** `addApprovalCommentSchema`
- **Request body:** `{ "body": "string" }`
- **Response 201:** `ApprovalComment`

---

## Costs & Budgets

### `POST /api/companies/:companyId/cost-events`

Report a cost event (e.g., LLM API call cost).

- **Auth:** Company access (agent can only report own costs)
- **Validation:** `createCostEventSchema`
- **Response 201:** `CostEvent`
- **Response 403:** `{ "error": "Agent can only report its own costs" }`

### `POST /api/companies/:companyId/finance-events`

Report a finance event (billing, subscription).

- **Auth:** Board + company access
- **Validation:** `createFinanceEventSchema`
- **Response 201:** `FinanceEvent`

### `GET /api/companies/:companyId/costs/summary`

Get cost summary for a company.

- **Auth:** Company access
- **Query params:** `from?`, `to?` (ISO dates)
- **Response 200:** Cost summary object

### `GET /api/companies/:companyId/costs/by-agent`

Costs broken down by agent.

- **Auth:** Company access
- **Query params:** `from?`, `to?`
- **Response 200:** `CostByAgent[]`

### `GET /api/companies/:companyId/costs/by-agent-model`

Costs broken down by agent and model.

- **Auth:** Company access
- **Query params:** `from?`, `to?`
- **Response 200:** `CostByAgentModel[]`

### `GET /api/companies/:companyId/costs/by-provider`

Costs broken down by provider.

- **Auth:** Company access
- **Query params:** `from?`, `to?`
- **Response 200:** `CostByProvider[]`

### `GET /api/companies/:companyId/costs/by-biller`

Costs broken down by biller.

- **Auth:** Company access
- **Query params:** `from?`, `to?`
- **Response 200:** `CostByBiller[]`

### `GET /api/companies/:companyId/costs/by-project`

Costs broken down by project.

- **Auth:** Company access
- **Query params:** `from?`, `to?`
- **Response 200:** `CostByProject[]`

### `GET /api/companies/:companyId/costs/finance-summary`

Finance event summary.

- **Auth:** Company access
- **Query params:** `from?`, `to?`
- **Response 200:** Finance summary

### `GET /api/companies/:companyId/costs/finance-by-biller`

Finance events broken down by biller.

- **Auth:** Company access
- **Query params:** `from?`, `to?`
- **Response 200:** `FinanceByBiller[]`

### `GET /api/companies/:companyId/costs/finance-by-kind`

Finance events broken down by event kind.

- **Auth:** Company access
- **Query params:** `from?`, `to?`
- **Response 200:** `FinanceByKind[]`

### `GET /api/companies/:companyId/costs/finance-events`

List individual finance events.

- **Auth:** Company access
- **Query params:** `from?`, `to?`, `limit?` (1-500, default 100)
- **Response 200:** `FinanceEvent[]`

### `GET /api/companies/:companyId/costs/window-spend`

Current spend within active budget windows.

- **Auth:** Company access
- **Response 200:** Window spend data

### `GET /api/companies/:companyId/costs/quota-windows`

Fetch external quota window data.

- **Auth:** Board + company access
- **Response 200:** Quota window results
- **Response 404:** `{ "error": "Company not found" }`

### `GET /api/companies/:companyId/budgets/overview`

Get budget overview (policies, incidents, spend).

- **Auth:** Company access
- **Response 200:** Budget overview

### `POST /api/companies/:companyId/budgets/policies`

Create or update a budget policy.

- **Auth:** Board
- **Validation:** `upsertBudgetPolicySchema`
- **Response 200:** Budget summary

### `PATCH /api/companies/:companyId/budgets`

Update the company-level monthly budget.

- **Auth:** Board
- **Validation:** `updateBudgetSchema`
- **Request body:** `{ "budgetMonthlyCents": number }`
- **Response 200:** `Company`
- **Response 404:** `{ "error": "Company not found" }`

### `POST /api/companies/:companyId/budget-incidents/:incidentId/resolve`

Resolve a budget incident.

- **Auth:** Board
- **Validation:** `resolveBudgetIncidentSchema`
- **Response 200:** Budget incident

---

## Activity

### `GET /api/companies/:companyId/activity`

List activity log for a company.

- **Auth:** Company access
- **Query params:** `agentId?`, `entityType?`, `entityId?`
- **Response 200:** `ActivityEvent[]`

### `POST /api/companies/:companyId/activity`

Create a manual activity event.

- **Auth:** Board
- **Validation:** inline `createActivitySchema`
- **Request body:** `{ "actorType?": "agent|user|system", "actorId": "string", "action": "string", "entityType": "string", "entityId": "string", "agentId?": "uuid", "details?": {} }`
- **Response 201:** `ActivityEvent`

### `GET /api/issues/:id/activity`

List activity for a specific issue.

- **Auth:** Company access
- **Response 200:** `ActivityEvent[]`
- **Response 404:** `{ "error": "Issue not found" }`

### `GET /api/issues/:id/runs`

List heartbeat runs for a specific issue.

- **Auth:** Company access
- **Response 200:** Run list
- **Response 404:** `{ "error": "Issue not found" }`

---

## Dashboard

### `GET /api/companies/:companyId/dashboard`

Get dashboard summary for a company.

- **Auth:** Company access
- **Response 200:** Dashboard summary object

---

## Sidebar Badges

### `GET /api/companies/:companyId/sidebar-badges`

Get badge counts for the sidebar (approvals, failed runs, alerts, join requests).

- **Auth:** Company access
- **Response 200:** `{ approvals, failedRuns, inbox, ... }`

---

## Secrets

### `GET /api/companies/:companyId/secret-providers`

List available secret providers.

- **Auth:** Board
- **Response 200:** Provider list

### `GET /api/companies/:companyId/secrets`

List secrets for a company (values never returned).

- **Auth:** Board
- **Response 200:** `Secret[]`

### `POST /api/companies/:companyId/secrets`

Create a new secret.

- **Auth:** Board
- **Validation:** `createSecretSchema`
- **Request body:** `{ "name": "string", "value": "string", "provider?": "string", "description?": "string", "externalRef?": "string" }`
- **Response 201:** `Secret`

### `POST /api/secrets/:id/rotate`

Rotate a secret's value.

- **Auth:** Board
- **Validation:** `rotateSecretSchema`
- **Request body:** `{ "value": "string", "externalRef?": "string" }`
- **Response 200:** `Secret`
- **Response 404:** `{ "error": "Secret not found" }`

### `PATCH /api/secrets/:id`

Update secret metadata (not the value).

- **Auth:** Board
- **Validation:** `updateSecretSchema`
- **Response 200:** `Secret`
- **Response 404:** `{ "error": "Secret not found" }`

### `DELETE /api/secrets/:id`

Delete a secret.

- **Auth:** Board
- **Response 200:** `{ "ok": true }`
- **Response 404:** `{ "error": "Secret not found" }`

---

## Execution Workspaces

### `GET /api/companies/:companyId/execution-workspaces`

List execution workspaces for a company.

- **Auth:** Company access
- **Query params:** `projectId?`, `projectWorkspaceId?`, `issueId?`, `status?`, `reuseEligible?` (true/false)
- **Response 200:** `ExecutionWorkspace[]`

### `GET /api/execution-workspaces/:id`

Get an execution workspace by ID.

- **Auth:** Company access
- **Response 200:** `ExecutionWorkspace`
- **Response 404:** `{ "error": "Execution workspace not found" }`

### `PATCH /api/execution-workspaces/:id`

Update an execution workspace. Setting `status: "archived"` triggers cleanup.

- **Auth:** Company access
- **Validation:** `updateExecutionWorkspaceSchema`
- **Response 200:** `ExecutionWorkspace`
- **Response 404:** `{ "error": "Execution workspace not found" }`
- **Response 409:** `{ "error": "Cannot archive execution workspace while N linked issue(s) are still open" }`
- **Response 500:** `{ "error": "Failed to archive execution workspace: {reason}" }`

---

## Assets

### `POST /api/companies/:companyId/assets/images`

Upload an image asset (multipart form).

- **Auth:** Company access
- **Request:** multipart/form-data with `file` field, optional `namespace` in body
- **Response 201:** `{ assetId, companyId, provider, objectKey, contentType, byteSize, sha256, originalFilename, contentPath, ... }`
- **Response 400:** `{ "error": "Missing file field 'file'" }` or invalid metadata
- **Response 422:** File size/type/empty/SVG sanitization errors

### `POST /api/companies/:companyId/logo`

Upload a company logo image (multipart form). Accepts PNG, JPEG, WebP, GIF, SVG.

- **Auth:** Company access
- **Response 201:** Asset object
- **Response 422:** Unsupported image type, SVG sanitization failure, empty image, or file size exceeded

### `GET /api/assets/:assetId/content`

Download asset content (binary stream).

- **Auth:** Company access
- **Response 200:** Binary stream with content-type headers
- **Response 404:** `{ "error": "Asset not found" }`

---

## LLMs / Agent Configuration Reflection

### `GET /api/llms/agent-configuration.txt`

Index of adapter configuration documentation.

- **Auth:** Board or agent with `canCreateAgents`
- **Response 200:** `text/plain` index

### `GET /api/llms/agent-icons.txt`

List of valid agent icon names.

- **Auth:** Board or agent with `canCreateAgents`
- **Response 200:** `text/plain`

### `GET /api/llms/agent-configuration/:adapterType.txt`

Adapter-specific configuration documentation.

- **Auth:** Board or agent with `canCreateAgents`
- **Response 200:** `text/plain`
- **Response 404:** `text/plain` error

---

## Plugins

All plugin routes require **Board** authentication unless noted.

### `GET /api/plugins`

List all installed plugins.

- **Query params:** `status?`
- **Response 200:** `Plugin[]`

### `GET /api/plugins/examples`

List available example plugins.

- **Response 200:** `AvailablePluginExample[]`

### `GET /api/plugins/ui-contributions`

Get UI slot contributions from ready plugins.

- **Response 200:** `PluginUiContribution[]`

### `GET /api/plugins/tools`

List agent tools contributed by plugins.

- **Response 200:** Tool descriptor list

### `POST /api/plugins/tools/execute`

Execute a plugin-contributed agent tool.

- **Response 200:** Tool execution result

### `POST /api/plugins/install`

Install a plugin from npm or local path.

- **Request body:** `{ "packageName": "string", "version?": "string", "isLocalPath?": boolean }`
- **Response 200:** Installation result

### `GET /api/plugins/:pluginId`

Get plugin details.

- **Response 200:** `Plugin`

### `DELETE /api/plugins/:pluginId`

Uninstall a plugin.

- **Response 200:** Deletion result

### `POST /api/plugins/:pluginId/enable`

Enable a disabled plugin.

- **Response 200:** `Plugin`

### `POST /api/plugins/:pluginId/disable`

Disable a plugin.

- **Response 200:** `Plugin`

### `GET /api/plugins/:pluginId/health`

Run health diagnostics for a plugin.

- **Response 200:** `PluginHealthCheckResult`

### `GET /api/plugins/:pluginId/logs`

Get plugin logs.

- **Response 200:** Log entries

### `POST /api/plugins/:pluginId/upgrade`

Upgrade a plugin to a newer version.

- **Response 200:** Upgrade result

### `GET /api/plugins/:pluginId/config`

Get plugin configuration.

- **Response 200:** Config object

### `POST /api/plugins/:pluginId/config`

Update plugin configuration.

- **Response 200:** Updated config

### `POST /api/plugins/:pluginId/config/test`

Test plugin configuration without saving.

- **Response 200:** Test result

### `GET /api/plugins/:pluginId/jobs`

List scheduled jobs for a plugin.

- **Response 200:** Job list

### `GET /api/plugins/:pluginId/jobs/:jobId/runs`

List runs for a plugin job.

- **Response 200:** Job run list

### `POST /api/plugins/:pluginId/jobs/:jobId/trigger`

Manually trigger a plugin job.

- **Response 200:** Job run

### `POST /api/plugins/:pluginId/webhooks/:endpointKey`

Receive a webhook delivery for a plugin.

- **Auth:** Varies (plugin-defined)
- **Response 200:** Webhook response

### `GET /api/plugins/:pluginId/dashboard`

Get plugin dashboard data.

- **Response 200:** Dashboard data

### `POST /api/plugins/:pluginId/bridge/data`

Read data through the plugin bridge.

- **Response 200:** Bridge data response

### `POST /api/plugins/:pluginId/bridge/action`

Execute an action through the plugin bridge.

- **Response 200:** Action result

### `POST /api/plugins/:pluginId/data/:key`

Read keyed plugin data.

- **Response 200:** Data response

### `POST /api/plugins/:pluginId/actions/:key`

Execute a keyed plugin action.

- **Response 200:** Action result

### `GET /api/plugins/:pluginId/bridge/stream/:channel`

SSE stream for real-time plugin data.

- **Response 200:** `text/event-stream`

---

## Access & Invites

### `GET /api/board-claim/:token`

Inspect a board claim challenge.

- **Response 200:** Claim info

### `POST /api/board-claim/:token/claim`

Claim board ownership.

- **Response 200:** Claim result

### `GET /api/skills/available`

List available agent skills.

- **Response 200:** Skill list

### `GET /api/skills/index`

Get the skills index.

- **Response 200:** Skills index

### `GET /api/skills/:skillName`

Get skill documentation markdown.

- **Response 200:** `text/markdown`

### `GET /api/invites/:token`

Get invite details by token.

- **Response 200:** Invite info

### `GET /api/invites/:token/onboarding`

Get onboarding info for an invite.

- **Response 200:** Onboarding payload

### `GET /api/invites/:token/onboarding.txt`

Get onboarding info as plain text.

- **Response 200:** `text/plain`

### `GET /api/invites/:token/test-resolution`

Test invite resolution.

- **Response 200:** Resolution info

### `POST /api/invites/:inviteId/revoke`

Revoke an invite.

- **Response 200:** Revoked invite

### `GET /api/companies/:companyId/join-requests`

List join requests for a company.

- **Auth:** Company access + `joins:approve` permission
- **Response 200:** `JoinRequest[]`

### `GET /api/companies/:companyId/members`

List members of a company.

- **Auth:** Company access
- **Response 200:** Member list

### `GET /api/admin/users/:userId/company-access`

Get company access list for a user.

- **Auth:** Board (instance admin)
- **Response 200:** Company access list

### `PUT /api/admin/users/:userId/company-access`

Update company access for a user.

- **Auth:** Board (instance admin)
- **Validation:** `updateUserCompanyAccessSchema`
- **Response 200:** Updated access
