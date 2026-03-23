# Paperclip -- Database & Data Schemas
_Last updated: 2026-03-23_

## 1. Database Overview

| Property | Value |
|---|---|
| Engine | PostgreSQL 17 (external) or embedded PostgreSQL (dev) |
| ORM | Drizzle ORM with `postgres-js` driver |
| Schema Definitions | `packages/db/src/schema/*.ts` (TypeScript, Drizzle `pgTable`) |
| Compiled Schema | `packages/db/dist/schema/*.js` (referenced by `drizzle.config.ts`) |
| Migration Output Dir | `packages/db/src/migrations/` |
| Migration Tool | Drizzle Kit (`drizzle-kit generate`) + custom `applyPendingMigrations` |
| Migration Journal | `packages/db/src/migrations/meta/_journal.json` |
| Migration Table | `drizzle.__drizzle_migrations` (schema `drizzle`, not `public`) |
| Connection | `postgres-js` (`postgres()`) -- pooled for app, `max: 1` for utility/migration ops |
| DB Type Export | `Db = ReturnType<typeof createDb>` (Drizzle instance with all schema) |

## 2. Entity Relationship Diagram

```
+-------------------+       +---------------------+       +----------------+
|      user         |       |   instance_settings  |       | instance_user_ |
| (Better Auth)     |       | singleton_key (UQ)   |       |    roles       |
| id (PK, text)     |       +---------------------+       | userId + role  |
| name, email       |                                      |   (UQ)         |
+--------+----------+                                      +----------------+
         |
         | userId
         v
+--------+----------+       +---------------------+
|    session         |       |   verification       |
| (Better Auth)     |       | (Better Auth)        |
| userId FK -> user  |       +---------------------+
+-------------------+
         |
+--------+----------+
|    account         |
| (Better Auth)     |
| userId FK -> user  |
+-------------------+

+-------------------+
|    companies      |<--------------------------------------------------+
| id (PK, uuid)    |                                                    |
| name, status      |                                                    |
| issuePrefix (UQ)  |                                                    |
| budgetMonthlyCents |                                                   |
+--------+----------+                                                    |
         |                                                               |
         | companyId                                                     |
         +------------------+------------------+                         |
         |                  |                  |                         |
         v                  v                  v                         |
+--------+------+  +--------+------+  +--------+-----------+            |
|    agents     |  |    goals      |  | company_memberships |            |
| id (PK, uuid)|  | id (PK, uuid)|  | principalType/Id    |            |
| name, role   |  | title, level |  | membershipRole      |            |
| adapterType  |  | status       |  | (UQ: company+       |            |
| reportsTo    |  | parentId     |  |  principal)          |            |
| (self-ref)   |  | ownerAgentId |  +---------------------+            |
+-+---+--------+  +------+-------+                                      |
  |   |                  |                                               |
  |   |    +-------------+                                               |
  |   |    |  goalId                                                     |
  |   |    v                                                             |
  |   |  +-+------------+     +-----------------+                        |
  |   |  |   projects   |<--->|  project_goals  |                        |
  |   |  | id (PK)      |     | (PK: project+   |                        |
  |   |  | name, status |     |       goal)     |                        |
  |   |  | leadAgentId  |     +-----------------+                        |
  |   |  | goalId       |                                                |
  |   |  +------+-------+                                                |
  |   |         |                                                        |
  |   |         | projectId                                              |
  |   |         v                                                        |
  |   |  +------+-------------------+     +---------------------------+  |
  |   |  |  project_workspaces     |     | execution_workspaces      |  |
  |   |  |  id (PK), sourceType    |     | id (PK), mode, strategy   |  |
  |   |  |  cwd, repoUrl, repoRef |     | branchName, providerType  |  |
  |   |  +-------------------------+     +---------------------------+  |
  |   |                                                                  |
  |   |  +------+-------+                                               |
  |   +->|   issues     |                                               |
  |      | id (PK, uuid)|                                               |
  |      | title, status|                                               |
  |      | priority     |                                               |
  |      | assigneeAgent|                                               |
  |      | projectId    |                                               |
  |      | parentId     |                                               |
  |      | identifier   |                                               |
  |      |   (UQ)       |                                               |
  |      +--+-----------+                                               |
  |         |                                                            |
  |         +-----+------+------+------+                                 |
  |         |     |      |      |      |                                 |
  |         v     v      v      v      v                                 |
  |    comments labels approvals docs  work_products                     |
  |                                                                      |
  |  +------------------+    +-------------------+                       |
  +->| heartbeat_runs   |    |   cost_events     |                       |
     | id (PK), agentId |    | provider, model   |                       |
     | status, exitCode |    | inputTokens, cost |                       |
     | logStore, logRef |    | occurredAt        |                       |
     +------------------+    +-------------------+                       |
                                                                         |
     +------------------+    +-------------------+                       |
     |   approvals      |    |  activity_log     |                       |
     | id (PK), type    |    | actorType, action |                       |
     | status, payload  |    | entityType/Id     |                       |
     +------------------+    +-------------------+                       |
                                                                         |
     +------------------+    +-------------------+                       |
     |    plugins       |    | company_secrets   |---companyId-----------+
     | pluginKey (UQ)   |    | name (UQ/company) |
     | manifestJson     |    | provider          |
     | status           |    +-------------------+
     +--------+---------+
              |
    +---------+---------+---------+---------+
    |         |         |         |         |
    v         v         v         v         v
 config    state    entities    jobs    webhooks
                                 |
                                 v
                             job_runs
```

## 3. Table Definitions

### 3.1 Authentication & Identity

#### `user` (Better Auth)
| Column | Type | Constraints |
|---|---|---|
| id | text | PK |
| name | text | NOT NULL |
| email | text | NOT NULL |
| email_verified | boolean | NOT NULL, default `false` |
| image | text | nullable |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

#### `session` (Better Auth)
| Column | Type | Constraints |
|---|---|---|
| id | text | PK |
| expires_at | timestamptz | NOT NULL |
| token | text | NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |
| ip_address | text | nullable |
| user_agent | text | nullable |
| user_id | text | NOT NULL, FK -> user(id) ON DELETE CASCADE |

#### `account` (Better Auth)
| Column | Type | Constraints |
|---|---|---|
| id | text | PK |
| account_id | text | NOT NULL |
| provider_id | text | NOT NULL |
| user_id | text | NOT NULL, FK -> user(id) ON DELETE CASCADE |
| access_token | text | nullable |
| refresh_token | text | nullable |
| id_token | text | nullable |
| access_token_expires_at | timestamptz | nullable |
| refresh_token_expires_at | timestamptz | nullable |
| scope | text | nullable |
| password | text | nullable |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

#### `verification` (Better Auth)
| Column | Type | Constraints |
|---|---|---|
| id | text | PK |
| identifier | text | NOT NULL |
| value | text | NOT NULL |
| expires_at | timestamptz | NOT NULL |
| created_at | timestamptz | nullable |
| updated_at | timestamptz | nullable |

#### `instance_settings`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| singleton_key | text | NOT NULL, default `"default"` |
| experimental | jsonb | NOT NULL, default `{}` |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `instance_settings_singleton_key_idx` UNIQUE on (singleton_key)

#### `instance_user_roles`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| user_id | text | NOT NULL |
| role | text | NOT NULL, default `"instance_admin"` |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `instance_user_roles_user_role_unique_idx` UNIQUE on (user_id, role); `instance_user_roles_role_idx` on (role)

### 3.2 Company & Membership

#### `companies`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| name | text | NOT NULL |
| description | text | nullable |
| status | text | NOT NULL, default `"active"` |
| pause_reason | text | nullable |
| paused_at | timestamptz | nullable |
| issue_prefix | text | NOT NULL, default `"PAP"` |
| issue_counter | integer | NOT NULL, default `0` |
| budget_monthly_cents | integer | NOT NULL, default `0` |
| spent_monthly_cents | integer | NOT NULL, default `0` |
| require_board_approval_for_new_agents | boolean | NOT NULL, default `true` |
| brand_color | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `companies_issue_prefix_idx` UNIQUE on (issue_prefix)

#### `company_logos`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) ON DELETE CASCADE |
| asset_id | uuid | NOT NULL, FK -> assets(id) ON DELETE CASCADE |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `company_logos_company_uq` UNIQUE on (company_id); `company_logos_asset_uq` UNIQUE on (asset_id)

#### `company_memberships`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| principal_type | text | NOT NULL |
| principal_id | text | NOT NULL |
| status | text | NOT NULL, default `"active"` |
| membership_role | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `company_memberships_company_principal_unique_idx` UNIQUE on (company_id, principal_type, principal_id); `company_memberships_principal_status_idx` on (principal_type, principal_id, status); `company_memberships_company_status_idx` on (company_id, status)

#### `principal_permission_grants`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| principal_type | text | NOT NULL |
| principal_id | text | NOT NULL |
| permission_key | text | NOT NULL |
| scope | jsonb | nullable |
| granted_by_user_id | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `principal_permission_grants_unique_idx` UNIQUE on (company_id, principal_type, principal_id, permission_key); `principal_permission_grants_company_permission_idx` on (company_id, permission_key)

#### `invites`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | FK -> companies(id) |
| invite_type | text | NOT NULL, default `"company_join"` |
| token_hash | text | NOT NULL |
| allowed_join_types | text | NOT NULL, default `"both"` |
| defaults_payload | jsonb | nullable |
| expires_at | timestamptz | NOT NULL |
| invited_by_user_id | text | nullable |
| revoked_at | timestamptz | nullable |
| accepted_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `invites_token_hash_unique_idx` UNIQUE on (token_hash); `invites_company_invite_state_idx` on (company_id, invite_type, revoked_at, expires_at)

#### `join_requests`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| invite_id | uuid | NOT NULL, FK -> invites(id) |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| request_type | text | NOT NULL |
| status | text | NOT NULL, default `"pending_approval"` |
| request_ip | text | NOT NULL |
| requesting_user_id | text | nullable |
| request_email_snapshot | text | nullable |
| agent_name | text | nullable |
| adapter_type | text | nullable |
| capabilities | text | nullable |
| agent_defaults_payload | jsonb | nullable |
| claim_secret_hash | text | nullable |
| claim_secret_expires_at | timestamptz | nullable |
| claim_secret_consumed_at | timestamptz | nullable |
| created_agent_id | uuid | FK -> agents(id) |
| approved_by_user_id | text | nullable |
| approved_at | timestamptz | nullable |
| rejected_by_user_id | text | nullable |
| rejected_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `join_requests_invite_unique_idx` UNIQUE on (invite_id); `join_requests_company_status_type_created_idx` on (company_id, status, request_type, created_at)

### 3.3 Agents

#### `agents`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| name | text | NOT NULL |
| role | text | NOT NULL, default `"general"` |
| title | text | nullable |
| icon | text | nullable |
| status | text | NOT NULL, default `"idle"` |
| reports_to | uuid | FK -> agents(id) (self-referencing) |
| capabilities | text | nullable |
| adapter_type | text | NOT NULL, default `"process"` |
| adapter_config | jsonb | NOT NULL, default `{}` |
| runtime_config | jsonb | NOT NULL, default `{}` |
| budget_monthly_cents | integer | NOT NULL, default `0` |
| spent_monthly_cents | integer | NOT NULL, default `0` |
| pause_reason | text | nullable |
| paused_at | timestamptz | nullable |
| permissions | jsonb | NOT NULL, default `{}` |
| last_heartbeat_at | timestamptz | nullable |
| metadata | jsonb | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `agents_company_status_idx` on (company_id, status); `agents_company_reports_to_idx` on (company_id, reports_to)

#### `agent_config_revisions`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| agent_id | uuid | NOT NULL, FK -> agents(id) ON DELETE CASCADE |
| created_by_agent_id | uuid | FK -> agents(id) ON DELETE SET NULL |
| created_by_user_id | text | nullable |
| source | text | NOT NULL, default `"patch"` |
| rolled_back_from_revision_id | uuid | nullable |
| changed_keys | jsonb (string[]) | NOT NULL, default `[]` |
| before_config | jsonb | NOT NULL |
| after_config | jsonb | NOT NULL |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `agent_config_revisions_company_agent_created_idx` on (company_id, agent_id, created_at); `agent_config_revisions_agent_created_idx` on (agent_id, created_at)

#### `agent_api_keys`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| agent_id | uuid | NOT NULL, FK -> agents(id) |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| name | text | NOT NULL |
| key_hash | text | NOT NULL |
| last_used_at | timestamptz | nullable |
| revoked_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `agent_api_keys_key_hash_idx` on (key_hash); `agent_api_keys_company_agent_idx` on (company_id, agent_id)

#### `agent_runtime_state`
| Column | Type | Constraints |
|---|---|---|
| agent_id | uuid | PK, FK -> agents(id) |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| adapter_type | text | NOT NULL |
| session_id | text | nullable |
| state_json | jsonb | NOT NULL, default `{}` |
| last_run_id | uuid | nullable |
| last_run_status | text | nullable |
| total_input_tokens | bigint | NOT NULL, default `0` |
| total_output_tokens | bigint | NOT NULL, default `0` |
| total_cached_input_tokens | bigint | NOT NULL, default `0` |
| total_cost_cents | bigint | NOT NULL, default `0` |
| last_error | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `agent_runtime_state_company_agent_idx` on (company_id, agent_id); `agent_runtime_state_company_updated_idx` on (company_id, updated_at)

#### `agent_task_sessions`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| agent_id | uuid | NOT NULL, FK -> agents(id) |
| adapter_type | text | NOT NULL |
| task_key | text | NOT NULL |
| session_params_json | jsonb | nullable |
| session_display_id | text | nullable |
| last_run_id | uuid | FK -> heartbeat_runs(id) |
| last_error | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `agent_task_sessions_company_agent_adapter_task_uniq` UNIQUE on (company_id, agent_id, adapter_type, task_key); `agent_task_sessions_company_agent_updated_idx` on (company_id, agent_id, updated_at); `agent_task_sessions_company_task_updated_idx` on (company_id, task_key, updated_at)

#### `agent_wakeup_requests`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| agent_id | uuid | NOT NULL, FK -> agents(id) |
| source | text | NOT NULL |
| trigger_detail | text | nullable |
| reason | text | nullable |
| payload | jsonb | nullable |
| status | text | NOT NULL, default `"queued"` |
| coalesced_count | integer | NOT NULL, default `0` |
| requested_by_actor_type | text | nullable |
| requested_by_actor_id | text | nullable |
| idempotency_key | text | nullable |
| run_id | uuid | nullable |
| requested_at | timestamptz | NOT NULL, default now |
| claimed_at | timestamptz | nullable |
| finished_at | timestamptz | nullable |
| error | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `agent_wakeup_requests_company_agent_status_idx` on (company_id, agent_id, status); `agent_wakeup_requests_company_requested_idx` on (company_id, requested_at); `agent_wakeup_requests_agent_requested_idx` on (agent_id, requested_at)

### 3.4 Goals, Projects & Issues

#### `goals`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| title | text | NOT NULL |
| description | text | nullable |
| level | text | NOT NULL, default `"task"` |
| status | text | NOT NULL, default `"planned"` |
| parent_id | uuid | FK -> goals(id) (self-referencing) |
| owner_agent_id | uuid | FK -> agents(id) |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `goals_company_idx` on (company_id)

#### `projects`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| goal_id | uuid | FK -> goals(id) |
| name | text | NOT NULL |
| description | text | nullable |
| status | text | NOT NULL, default `"backlog"` |
| lead_agent_id | uuid | FK -> agents(id) |
| target_date | date | nullable |
| color | text | nullable |
| pause_reason | text | nullable |
| paused_at | timestamptz | nullable |
| execution_workspace_policy | jsonb | nullable |
| archived_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `projects_company_idx` on (company_id)

#### `project_goals` (join table)
| Column | Type | Constraints |
|---|---|---|
| project_id | uuid | NOT NULL, FK -> projects(id) ON DELETE CASCADE |
| goal_id | uuid | NOT NULL, FK -> goals(id) ON DELETE CASCADE |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**PK:** (project_id, goal_id)
**Indexes:** `project_goals_project_idx` on (project_id); `project_goals_goal_idx` on (goal_id); `project_goals_company_idx` on (company_id)

#### `issues`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| project_id | uuid | FK -> projects(id) |
| project_workspace_id | uuid | FK -> project_workspaces(id) ON DELETE SET NULL |
| goal_id | uuid | FK -> goals(id) |
| parent_id | uuid | FK -> issues(id) (self-referencing) |
| title | text | NOT NULL |
| description | text | nullable |
| status | text | NOT NULL, default `"backlog"` |
| priority | text | NOT NULL, default `"medium"` |
| assignee_agent_id | uuid | FK -> agents(id) |
| assignee_user_id | text | nullable |
| checkout_run_id | uuid | FK -> heartbeat_runs(id) ON DELETE SET NULL |
| execution_run_id | uuid | FK -> heartbeat_runs(id) ON DELETE SET NULL |
| execution_agent_name_key | text | nullable |
| execution_locked_at | timestamptz | nullable |
| created_by_agent_id | uuid | FK -> agents(id) |
| created_by_user_id | text | nullable |
| issue_number | integer | nullable |
| identifier | text | nullable |
| request_depth | integer | NOT NULL, default `0` |
| billing_code | text | nullable |
| assignee_adapter_overrides | jsonb | nullable |
| execution_workspace_id | uuid | FK -> execution_workspaces(id) ON DELETE SET NULL |
| execution_workspace_preference | text | nullable |
| execution_workspace_settings | jsonb | nullable |
| started_at | timestamptz | nullable |
| completed_at | timestamptz | nullable |
| cancelled_at | timestamptz | nullable |
| hidden_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `issues_company_status_idx` on (company_id, status); `issues_company_assignee_status_idx` on (company_id, assignee_agent_id, status); `issues_company_assignee_user_status_idx` on (company_id, assignee_user_id, status); `issues_company_parent_idx` on (company_id, parent_id); `issues_company_project_idx` on (company_id, project_id); `issues_company_project_workspace_idx` on (company_id, project_workspace_id); `issues_company_execution_workspace_idx` on (company_id, execution_workspace_id); `issues_identifier_idx` UNIQUE on (identifier)

### 3.5 Issue Relations

#### `issue_comments`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| issue_id | uuid | NOT NULL, FK -> issues(id) |
| author_agent_id | uuid | FK -> agents(id) |
| author_user_id | text | nullable |
| body | text | NOT NULL |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `issue_comments_issue_idx` on (issue_id); `issue_comments_company_idx` on (company_id); `issue_comments_company_issue_created_at_idx` on (company_id, issue_id, created_at); `issue_comments_company_author_issue_created_at_idx` on (company_id, author_user_id, issue_id, created_at)

#### `labels`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) ON DELETE CASCADE |
| name | text | NOT NULL |
| color | text | NOT NULL |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `labels_company_idx` on (company_id); `labels_company_name_idx` UNIQUE on (company_id, name)

#### `issue_labels` (join table)
| Column | Type | Constraints |
|---|---|---|
| issue_id | uuid | NOT NULL, FK -> issues(id) ON DELETE CASCADE |
| label_id | uuid | NOT NULL, FK -> labels(id) ON DELETE CASCADE |
| company_id | uuid | NOT NULL, FK -> companies(id) ON DELETE CASCADE |
| created_at | timestamptz | NOT NULL, default now |

**PK:** (issue_id, label_id)
**Indexes:** `issue_labels_issue_idx` on (issue_id); `issue_labels_label_idx` on (label_id); `issue_labels_company_idx` on (company_id)

#### `issue_approvals` (join table)
| Column | Type | Constraints |
|---|---|---|
| company_id | uuid | NOT NULL, FK -> companies(id) |
| issue_id | uuid | NOT NULL, FK -> issues(id) ON DELETE CASCADE |
| approval_id | uuid | NOT NULL, FK -> approvals(id) ON DELETE CASCADE |
| linked_by_agent_id | uuid | FK -> agents(id) ON DELETE SET NULL |
| linked_by_user_id | text | nullable |
| created_at | timestamptz | NOT NULL, default now |

**PK:** (issue_id, approval_id)
**Indexes:** `issue_approvals_issue_idx` on (issue_id); `issue_approvals_approval_idx` on (approval_id); `issue_approvals_company_idx` on (company_id)

#### `issue_read_states`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| issue_id | uuid | NOT NULL, FK -> issues(id) |
| user_id | text | NOT NULL |
| last_read_at | timestamptz | NOT NULL, default now |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `issue_read_states_company_issue_idx` on (company_id, issue_id); `issue_read_states_company_user_idx` on (company_id, user_id); `issue_read_states_company_issue_user_idx` UNIQUE on (company_id, issue_id, user_id)

#### `issue_work_products`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| project_id | uuid | FK -> projects(id) ON DELETE SET NULL |
| issue_id | uuid | NOT NULL, FK -> issues(id) ON DELETE CASCADE |
| execution_workspace_id | uuid | FK -> execution_workspaces(id) ON DELETE SET NULL |
| runtime_service_id | uuid | FK -> workspace_runtime_services(id) ON DELETE SET NULL |
| type | text | NOT NULL |
| provider | text | NOT NULL |
| external_id | text | nullable |
| title | text | NOT NULL |
| url | text | nullable |
| status | text | NOT NULL |
| review_state | text | NOT NULL, default `"none"` |
| is_primary | boolean | NOT NULL, default `false` |
| health_status | text | NOT NULL, default `"unknown"` |
| summary | text | nullable |
| metadata | jsonb | nullable |
| created_by_run_id | uuid | FK -> heartbeat_runs(id) ON DELETE SET NULL |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `issue_work_products_company_issue_type_idx` on (company_id, issue_id, type); `issue_work_products_company_execution_workspace_type_idx` on (company_id, execution_workspace_id, type); `issue_work_products_company_provider_external_id_idx` on (company_id, provider, external_id); `issue_work_products_company_updated_idx` on (company_id, updated_at)

### 3.6 Documents & Attachments

#### `documents`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| title | text | nullable |
| format | text | NOT NULL, default `"markdown"` |
| latest_body | text | NOT NULL |
| latest_revision_id | uuid | nullable |
| latest_revision_number | integer | NOT NULL, default `1` |
| created_by_agent_id | uuid | FK -> agents(id) ON DELETE SET NULL |
| created_by_user_id | text | nullable |
| updated_by_agent_id | uuid | FK -> agents(id) ON DELETE SET NULL |
| updated_by_user_id | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `documents_company_updated_idx` on (company_id, updated_at); `documents_company_created_idx` on (company_id, created_at)

#### `document_revisions`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| document_id | uuid | NOT NULL, FK -> documents(id) ON DELETE CASCADE |
| revision_number | integer | NOT NULL |
| body | text | NOT NULL |
| change_summary | text | nullable |
| created_by_agent_id | uuid | FK -> agents(id) ON DELETE SET NULL |
| created_by_user_id | text | nullable |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `document_revisions_document_revision_uq` UNIQUE on (document_id, revision_number); `document_revisions_company_document_created_idx` on (company_id, document_id, created_at)

#### `issue_documents` (join table)
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| issue_id | uuid | NOT NULL, FK -> issues(id) ON DELETE CASCADE |
| document_id | uuid | NOT NULL, FK -> documents(id) ON DELETE CASCADE |
| key | text | NOT NULL |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `issue_documents_company_issue_key_uq` UNIQUE on (company_id, issue_id, key); `issue_documents_document_uq` UNIQUE on (document_id); `issue_documents_company_issue_updated_idx` on (company_id, issue_id, updated_at)

#### `assets`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| provider | text | NOT NULL |
| object_key | text | NOT NULL |
| content_type | text | NOT NULL |
| byte_size | integer | NOT NULL |
| sha256 | text | NOT NULL |
| original_filename | text | nullable |
| created_by_agent_id | uuid | FK -> agents(id) |
| created_by_user_id | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `assets_company_created_idx` on (company_id, created_at); `assets_company_provider_idx` on (company_id, provider); `assets_company_object_key_uq` UNIQUE on (company_id, object_key)

#### `issue_attachments`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| issue_id | uuid | NOT NULL, FK -> issues(id) ON DELETE CASCADE |
| asset_id | uuid | NOT NULL, FK -> assets(id) ON DELETE CASCADE |
| issue_comment_id | uuid | FK -> issue_comments(id) ON DELETE SET NULL |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `issue_attachments_company_issue_idx` on (company_id, issue_id); `issue_attachments_issue_comment_idx` on (issue_comment_id); `issue_attachments_asset_uq` UNIQUE on (asset_id)

### 3.7 Workspaces

#### `project_workspaces`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| project_id | uuid | NOT NULL, FK -> projects(id) ON DELETE CASCADE |
| name | text | NOT NULL |
| source_type | text | NOT NULL, default `"local_path"` |
| cwd | text | nullable |
| repo_url | text | nullable |
| repo_ref | text | nullable |
| default_ref | text | nullable |
| visibility | text | NOT NULL, default `"default"` |
| setup_command | text | nullable |
| cleanup_command | text | nullable |
| remote_provider | text | nullable |
| remote_workspace_ref | text | nullable |
| shared_workspace_key | text | nullable |
| metadata | jsonb | nullable |
| is_primary | boolean | NOT NULL, default `false` |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `project_workspaces_company_project_idx` on (company_id, project_id); `project_workspaces_project_primary_idx` on (project_id, is_primary); `project_workspaces_project_source_type_idx` on (project_id, source_type); `project_workspaces_company_shared_key_idx` on (company_id, shared_workspace_key); `project_workspaces_project_remote_ref_idx` UNIQUE on (project_id, remote_provider, remote_workspace_ref)

#### `execution_workspaces`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| project_id | uuid | NOT NULL, FK -> projects(id) ON DELETE CASCADE |
| project_workspace_id | uuid | FK -> project_workspaces(id) ON DELETE SET NULL |
| source_issue_id | uuid | FK -> issues(id) ON DELETE SET NULL |
| mode | text | NOT NULL |
| strategy_type | text | NOT NULL |
| name | text | NOT NULL |
| status | text | NOT NULL, default `"active"` |
| cwd | text | nullable |
| repo_url | text | nullable |
| base_ref | text | nullable |
| branch_name | text | nullable |
| provider_type | text | NOT NULL, default `"local_fs"` |
| provider_ref | text | nullable |
| derived_from_execution_workspace_id | uuid | FK -> execution_workspaces(id) ON DELETE SET NULL |
| last_used_at | timestamptz | NOT NULL, default now |
| opened_at | timestamptz | NOT NULL, default now |
| closed_at | timestamptz | nullable |
| cleanup_eligible_at | timestamptz | nullable |
| cleanup_reason | text | nullable |
| metadata | jsonb | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `execution_workspaces_company_project_status_idx` on (company_id, project_id, status); `execution_workspaces_company_project_workspace_status_idx` on (company_id, project_workspace_id, status); `execution_workspaces_company_source_issue_idx` on (company_id, source_issue_id); `execution_workspaces_company_last_used_idx` on (company_id, last_used_at); `execution_workspaces_company_branch_idx` on (company_id, branch_name)

#### `workspace_operations`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| execution_workspace_id | uuid | FK -> execution_workspaces(id) ON DELETE SET NULL |
| heartbeat_run_id | uuid | FK -> heartbeat_runs(id) ON DELETE SET NULL |
| phase | text | NOT NULL |
| command | text | nullable |
| cwd | text | nullable |
| status | text | NOT NULL, default `"running"` |
| exit_code | integer | nullable |
| log_store | text | nullable |
| log_ref | text | nullable |
| log_bytes | bigint | nullable |
| log_sha256 | text | nullable |
| log_compressed | boolean | NOT NULL, default `false` |
| stdout_excerpt | text | nullable |
| stderr_excerpt | text | nullable |
| metadata | jsonb | nullable |
| started_at | timestamptz | NOT NULL, default now |
| finished_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `workspace_operations_company_run_started_idx` on (company_id, heartbeat_run_id, started_at); `workspace_operations_company_workspace_started_idx` on (company_id, execution_workspace_id, started_at)

#### `workspace_runtime_services`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK (not auto-generated) |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| project_id | uuid | FK -> projects(id) ON DELETE SET NULL |
| project_workspace_id | uuid | FK -> project_workspaces(id) ON DELETE SET NULL |
| execution_workspace_id | uuid | FK -> execution_workspaces(id) ON DELETE SET NULL |
| issue_id | uuid | FK -> issues(id) ON DELETE SET NULL |
| scope_type | text | NOT NULL |
| scope_id | text | nullable |
| service_name | text | NOT NULL |
| status | text | NOT NULL |
| lifecycle | text | NOT NULL |
| reuse_key | text | nullable |
| command | text | nullable |
| cwd | text | nullable |
| port | integer | nullable |
| url | text | nullable |
| provider | text | NOT NULL |
| provider_ref | text | nullable |
| owner_agent_id | uuid | FK -> agents(id) ON DELETE SET NULL |
| started_by_run_id | uuid | FK -> heartbeat_runs(id) ON DELETE SET NULL |
| last_used_at | timestamptz | NOT NULL, default now |
| started_at | timestamptz | NOT NULL, default now |
| stopped_at | timestamptz | nullable |
| stop_policy | jsonb | nullable |
| health_status | text | NOT NULL, default `"unknown"` |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `workspace_runtime_services_company_workspace_status_idx` on (company_id, project_workspace_id, status); `workspace_runtime_services_company_execution_workspace_status_idx` on (company_id, execution_workspace_id, status); `workspace_runtime_services_company_project_status_idx` on (company_id, project_id, status); `workspace_runtime_services_run_idx` on (started_by_run_id); `workspace_runtime_services_company_updated_idx` on (company_id, updated_at)

### 3.8 Heartbeat & Execution

#### `heartbeat_runs`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| agent_id | uuid | NOT NULL, FK -> agents(id) |
| invocation_source | text | NOT NULL, default `"on_demand"` |
| trigger_detail | text | nullable |
| status | text | NOT NULL, default `"queued"` |
| started_at | timestamptz | nullable |
| finished_at | timestamptz | nullable |
| error | text | nullable |
| wakeup_request_id | uuid | FK -> agent_wakeup_requests(id) |
| exit_code | integer | nullable |
| signal | text | nullable |
| usage_json | jsonb | nullable |
| result_json | jsonb | nullable |
| session_id_before | text | nullable |
| session_id_after | text | nullable |
| log_store | text | nullable |
| log_ref | text | nullable |
| log_bytes | bigint | nullable |
| log_sha256 | text | nullable |
| log_compressed | boolean | NOT NULL, default `false` |
| stdout_excerpt | text | nullable |
| stderr_excerpt | text | nullable |
| error_code | text | nullable |
| external_run_id | text | nullable |
| process_pid | integer | nullable |
| process_started_at | timestamptz | nullable |
| retry_of_run_id | uuid | FK -> heartbeat_runs(id) ON DELETE SET NULL |
| process_loss_retry_count | integer | NOT NULL, default `0` |
| context_snapshot | jsonb | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `heartbeat_runs_company_agent_started_idx` on (company_id, agent_id, started_at)

#### `heartbeat_run_events`
| Column | Type | Constraints |
|---|---|---|
| id | bigserial | PK (auto-increment) |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| run_id | uuid | NOT NULL, FK -> heartbeat_runs(id) |
| agent_id | uuid | NOT NULL, FK -> agents(id) |
| seq | integer | NOT NULL |
| event_type | text | NOT NULL |
| stream | text | nullable |
| level | text | nullable |
| color | text | nullable |
| message | text | nullable |
| payload | jsonb | nullable |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `heartbeat_run_events_run_seq_idx` on (run_id, seq); `heartbeat_run_events_company_run_idx` on (company_id, run_id); `heartbeat_run_events_company_created_idx` on (company_id, created_at)

### 3.9 Cost & Finance

#### `cost_events`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| agent_id | uuid | NOT NULL, FK -> agents(id) |
| issue_id | uuid | FK -> issues(id) |
| project_id | uuid | FK -> projects(id) |
| goal_id | uuid | FK -> goals(id) |
| heartbeat_run_id | uuid | FK -> heartbeat_runs(id) |
| billing_code | text | nullable |
| provider | text | NOT NULL |
| biller | text | NOT NULL, default `"unknown"` |
| billing_type | text | NOT NULL, default `"unknown"` |
| model | text | NOT NULL |
| input_tokens | integer | NOT NULL, default `0` |
| cached_input_tokens | integer | NOT NULL, default `0` |
| output_tokens | integer | NOT NULL, default `0` |
| cost_cents | integer | NOT NULL |
| occurred_at | timestamptz | NOT NULL |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `cost_events_company_occurred_idx` on (company_id, occurred_at); `cost_events_company_agent_occurred_idx` on (company_id, agent_id, occurred_at); `cost_events_company_provider_occurred_idx` on (company_id, provider, occurred_at); `cost_events_company_biller_occurred_idx` on (company_id, biller, occurred_at); `cost_events_company_heartbeat_run_idx` on (company_id, heartbeat_run_id)

#### `finance_events`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| agent_id | uuid | FK -> agents(id) |
| issue_id | uuid | FK -> issues(id) |
| project_id | uuid | FK -> projects(id) |
| goal_id | uuid | FK -> goals(id) |
| heartbeat_run_id | uuid | FK -> heartbeat_runs(id) |
| cost_event_id | uuid | FK -> cost_events(id) |
| billing_code | text | nullable |
| description | text | nullable |
| event_kind | text | NOT NULL |
| direction | text | NOT NULL, default `"debit"` |
| biller | text | NOT NULL |
| provider | text | nullable |
| execution_adapter_type | text | nullable |
| pricing_tier | text | nullable |
| region | text | nullable |
| model | text | nullable |
| quantity | integer | nullable |
| unit | text | nullable |
| amount_cents | integer | NOT NULL |
| currency | text | NOT NULL, default `"USD"` |
| estimated | boolean | NOT NULL, default `false` |
| external_invoice_id | text | nullable |
| metadata_json | jsonb | nullable |
| occurred_at | timestamptz | NOT NULL |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `finance_events_company_occurred_idx` on (company_id, occurred_at); `finance_events_company_biller_occurred_idx` on (company_id, biller, occurred_at); `finance_events_company_kind_occurred_idx` on (company_id, event_kind, occurred_at); `finance_events_company_direction_occurred_idx` on (company_id, direction, occurred_at); `finance_events_company_heartbeat_run_idx` on (company_id, heartbeat_run_id); `finance_events_company_cost_event_idx` on (company_id, cost_event_id)

### 3.10 Budget

#### `budget_policies`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| scope_type | text | NOT NULL |
| scope_id | uuid | NOT NULL |
| metric | text | NOT NULL, default `"billed_cents"` |
| window_kind | text | NOT NULL |
| amount | integer | NOT NULL, default `0` |
| warn_percent | integer | NOT NULL, default `80` |
| hard_stop_enabled | boolean | NOT NULL, default `true` |
| notify_enabled | boolean | NOT NULL, default `true` |
| is_active | boolean | NOT NULL, default `true` |
| created_by_user_id | text | nullable |
| updated_by_user_id | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `budget_policies_company_scope_active_idx` on (company_id, scope_type, scope_id, is_active); `budget_policies_company_window_idx` on (company_id, window_kind, metric); `budget_policies_company_scope_metric_unique_idx` UNIQUE on (company_id, scope_type, scope_id, metric, window_kind)

#### `budget_incidents`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| policy_id | uuid | NOT NULL, FK -> budget_policies(id) |
| scope_type | text | NOT NULL |
| scope_id | uuid | NOT NULL |
| metric | text | NOT NULL |
| window_kind | text | NOT NULL |
| window_start | timestamptz | NOT NULL |
| window_end | timestamptz | NOT NULL |
| threshold_type | text | NOT NULL |
| amount_limit | integer | NOT NULL |
| amount_observed | integer | NOT NULL |
| status | text | NOT NULL, default `"open"` |
| approval_id | uuid | FK -> approvals(id) |
| resolved_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `budget_incidents_company_status_idx` on (company_id, status); `budget_incidents_company_scope_idx` on (company_id, scope_type, scope_id, status); `budget_incidents_policy_window_threshold_idx` UNIQUE on (policy_id, window_start, threshold_type) WHERE status <> 'dismissed'

### 3.11 Approvals

#### `approvals`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| type | text | NOT NULL |
| requested_by_agent_id | uuid | FK -> agents(id) |
| requested_by_user_id | text | nullable |
| status | text | NOT NULL, default `"pending"` |
| payload | jsonb | NOT NULL |
| decision_note | text | nullable |
| decided_by_user_id | text | nullable |
| decided_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `approvals_company_status_type_idx` on (company_id, status, type)

#### `approval_comments`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| approval_id | uuid | NOT NULL, FK -> approvals(id) |
| author_agent_id | uuid | FK -> agents(id) |
| author_user_id | text | nullable |
| body | text | NOT NULL |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `approval_comments_company_idx` on (company_id); `approval_comments_approval_idx` on (approval_id); `approval_comments_approval_created_idx` on (approval_id, created_at)

### 3.12 Activity Log

#### `activity_log`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| actor_type | text | NOT NULL, default `"system"` |
| actor_id | text | NOT NULL |
| action | text | NOT NULL |
| entity_type | text | NOT NULL |
| entity_id | text | NOT NULL |
| agent_id | uuid | FK -> agents(id) |
| run_id | uuid | FK -> heartbeat_runs(id) |
| details | jsonb | nullable |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `activity_log_company_created_idx` on (company_id, created_at); `activity_log_run_id_idx` on (run_id); `activity_log_entity_type_id_idx` on (entity_type, entity_id)

### 3.13 Secrets

#### `company_secrets`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) |
| name | text | NOT NULL |
| provider | text | NOT NULL, default `"local_encrypted"` |
| external_ref | text | nullable |
| latest_version | integer | NOT NULL, default `1` |
| description | text | nullable |
| created_by_agent_id | uuid | FK -> agents(id) ON DELETE SET NULL |
| created_by_user_id | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `company_secrets_company_idx` on (company_id); `company_secrets_company_provider_idx` on (company_id, provider); `company_secrets_company_name_uq` UNIQUE on (company_id, name)

#### `company_secret_versions`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| secret_id | uuid | NOT NULL, FK -> company_secrets(id) ON DELETE CASCADE |
| version | integer | NOT NULL |
| material | jsonb | NOT NULL |
| value_sha256 | text | NOT NULL |
| created_by_agent_id | uuid | FK -> agents(id) ON DELETE SET NULL |
| created_by_user_id | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| revoked_at | timestamptz | nullable |

**Indexes:** `company_secret_versions_secret_idx` on (secret_id, created_at); `company_secret_versions_value_sha256_idx` on (value_sha256); `company_secret_versions_secret_version_uq` UNIQUE on (secret_id, version)

### 3.14 Plugins

#### `plugins`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| plugin_key | text | NOT NULL |
| package_name | text | NOT NULL |
| version | text | NOT NULL |
| api_version | integer | NOT NULL, default `1` |
| categories | jsonb (PluginCategory[]) | NOT NULL, default `[]` |
| manifest_json | jsonb (PaperclipPluginManifestV1) | NOT NULL |
| status | text (PluginStatus) | NOT NULL, default `"installed"` |
| install_order | integer | nullable |
| package_path | text | nullable |
| last_error | text | nullable |
| installed_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugins_plugin_key_idx` UNIQUE on (plugin_key); `plugins_status_idx` on (status)

#### `plugin_config`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| plugin_id | uuid | NOT NULL, FK -> plugins(id) ON DELETE CASCADE |
| config_json | jsonb | NOT NULL, default `{}` |
| last_error | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugin_config_plugin_id_idx` UNIQUE on (plugin_id)

#### `plugin_company_settings`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| company_id | uuid | NOT NULL, FK -> companies(id) ON DELETE CASCADE |
| plugin_id | uuid | NOT NULL, FK -> plugins(id) ON DELETE CASCADE |
| enabled | boolean | NOT NULL, default `true` |
| settings_json | jsonb | NOT NULL, default `{}` |
| last_error | text | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugin_company_settings_company_idx` on (company_id); `plugin_company_settings_plugin_idx` on (plugin_id); `plugin_company_settings_company_plugin_uq` UNIQUE on (company_id, plugin_id)

#### `plugin_state`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| plugin_id | uuid | NOT NULL, FK -> plugins(id) ON DELETE CASCADE |
| scope_kind | text (PluginStateScopeKind) | NOT NULL |
| scope_id | text | nullable (NULL for instance scope) |
| namespace | text | NOT NULL, default `"default"` |
| state_key | text | NOT NULL |
| value_json | jsonb | NOT NULL |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugin_state_unique_entry_idx` UNIQUE NULLS NOT DISTINCT on (plugin_id, scope_kind, scope_id, namespace, state_key); `plugin_state_plugin_scope_idx` on (plugin_id, scope_kind)

#### `plugin_entities`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| plugin_id | uuid | NOT NULL, FK -> plugins(id) ON DELETE CASCADE |
| entity_type | text | NOT NULL |
| scope_kind | text (PluginStateScopeKind) | NOT NULL |
| scope_id | text | nullable |
| external_id | text | nullable |
| title | text | nullable |
| status | text | nullable |
| data | jsonb | NOT NULL, default `{}` |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugin_entities_plugin_idx` on (plugin_id); `plugin_entities_type_idx` on (entity_type); `plugin_entities_scope_idx` on (scope_kind, scope_id); `plugin_entities_external_idx` UNIQUE on (plugin_id, entity_type, external_id)

#### `plugin_jobs`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| plugin_id | uuid | NOT NULL, FK -> plugins(id) ON DELETE CASCADE |
| job_key | text | NOT NULL |
| schedule | text | NOT NULL |
| status | text (PluginJobStatus) | NOT NULL, default `"active"` |
| last_run_at | timestamptz | nullable |
| next_run_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |
| updated_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugin_jobs_plugin_idx` on (plugin_id); `plugin_jobs_next_run_idx` on (next_run_at); `plugin_jobs_unique_idx` UNIQUE on (plugin_id, job_key)

#### `plugin_job_runs`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| job_id | uuid | NOT NULL, FK -> plugin_jobs(id) ON DELETE CASCADE |
| plugin_id | uuid | NOT NULL, FK -> plugins(id) ON DELETE CASCADE |
| trigger | text (PluginJobRunTrigger) | NOT NULL |
| status | text (PluginJobRunStatus) | NOT NULL, default `"pending"` |
| duration_ms | integer | nullable |
| error | text | nullable |
| logs | jsonb (string[]) | NOT NULL, default `[]` |
| started_at | timestamptz | nullable |
| finished_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugin_job_runs_job_idx` on (job_id); `plugin_job_runs_plugin_idx` on (plugin_id); `plugin_job_runs_status_idx` on (status)

#### `plugin_webhook_deliveries`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| plugin_id | uuid | NOT NULL, FK -> plugins(id) ON DELETE CASCADE |
| webhook_key | text | NOT NULL |
| external_id | text | nullable |
| status | text (PluginWebhookDeliveryStatus) | NOT NULL, default `"pending"` |
| duration_ms | integer | nullable |
| error | text | nullable |
| payload | jsonb | NOT NULL |
| headers | jsonb (Record<string, string>) | NOT NULL, default `{}` |
| started_at | timestamptz | nullable |
| finished_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugin_webhook_deliveries_plugin_idx` on (plugin_id); `plugin_webhook_deliveries_status_idx` on (status); `plugin_webhook_deliveries_key_idx` on (webhook_key)

#### `plugin_logs`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| plugin_id | uuid | NOT NULL, FK -> plugins(id) ON DELETE CASCADE |
| level | text | NOT NULL, default `"info"` |
| message | text | NOT NULL |
| meta | jsonb | nullable |
| created_at | timestamptz | NOT NULL, default now |

**Indexes:** `plugin_logs_plugin_time_idx` on (plugin_id, created_at); `plugin_logs_level_idx` on (level)

## 4. Migration Workflow

### Generating Migrations

```bash
pnpm db:generate     # runs drizzle-kit generate against dist/schema/*.js
```

Drizzle Kit reads `packages/db/drizzle.config.ts`:
- Schema source: `./dist/schema/*.js` (compiled TypeScript)
- Output directory: `./src/migrations/`
- Dialect: `postgresql`
- Requires `DATABASE_URL` environment variable

### Applying Migrations

```bash
pnpm db:migrate      # runs the migration apply script
```

At server startup, migrations are handled automatically:
1. `inspectMigrations()` compares available migration files against the `drizzle.__drizzle_migrations` journal table.
2. If the database is empty (no tables, no journal), `migratePg()` from `drizzle-orm/postgres-js/migrator` applies all migrations.
3. If the journal exists with pending migrations, `applyPendingMigrationsManually()` applies each migration file in journal order, wrapping each in a transaction.
4. `reconcilePendingMigrationHistory()` handles drift where schema changes were applied but the journal was not updated -- it detects already-applied DDL statements (CREATE TABLE, ADD COLUMN, CREATE INDEX, ADD CONSTRAINT) and records them in the journal.
5. For embedded PostgreSQL first-run scenarios, migrations are auto-applied without prompting.
6. For interactive terminals, the user is prompted before applying (controllable via `PAPERCLIP_MIGRATION_AUTO_APPLY=true` or `PAPERCLIP_MIGRATION_PROMPT=never`).

### Backup

```bash
pnpm db:backup       # runs scripts/backup-db.sh
```

Automatic backups are also scheduled at runtime (default: every 60 minutes, 30-day retention), configurable via `PAPERCLIP_DB_BACKUP_*` environment variables.
