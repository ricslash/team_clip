# Quality Gate: Deploy Gate

## Gate Metadata

| Field | Value |
|---|---|
| Gate Name | Deploy Gate |
| Assigned To | DevOps Engineer |
| Trigger | Any milestone reaches 100% tasks done (all child issues in `done` status) |
| Blocks | Production deployment |

## When This Gate Is Created

The Chief of Staff auto-creates this gate issue during its heartbeat when it detects a milestone where all child tasks have reached `done` status. This is the final technical gate before code reaches production.

Common triggers:
- Build milestone completes (all implementation, tests, and code review done)
- Hotfix milestone completes
- Infrastructure change milestone completes

## API Call to Create

```
POST /api/companies/{companyId}/issues
{
  "title": "Deploy gate: {milestoneName}",
  "description": "Production deployment gate for {milestoneName}. Verify all prerequisites before deploying to production. Linked milestone: {milestoneIssueKey}.",
  "status": "backlog",
  "priority": "critical",
  "tags": ["gate:deploy", "deploy"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{milestoneId}",
  "assigneeAgentId": "{devOpsEngineerId}"
}
```

## Checklist

### Pre-Deploy Verification
- [ ] **Code review gates passed:** All code review gate issues for this milestone are in `done` status
- [ ] **Tests pass in CI:** Full test suite passes on the branch being deployed. No flaky test failures accepted — investigate and fix or document.
- [ ] **No P0/P1 bugs:** No known critical or high-severity bugs exist in the deployment scope. Check issue tracker for open bugs tagged with this milestone.
- [ ] **Staging tested:** The exact build being deployed has been tested in staging by the QA Engineer. Staging sign-off documented.

### Environment Readiness
- [ ] **Environment variables:** All required environment variables are configured in production. New variables added with correct values. No placeholder or staging values.
- [ ] **Database migrations:** Migrations tested against production-like data volume. Reversible where possible. Migration order is correct. No data loss scenarios.
- [ ] **Infrastructure scaling:** If the deployment introduces new services, endpoints, or expected traffic patterns — scaling configuration is updated (auto-scaling rules, connection pool sizes, rate limits).
- [ ] **Secrets management:** No secrets in code, environment files, or CI logs. All secrets managed through the designated secrets manager.

### Monitoring and Observability
- [ ] **Monitoring dashboards:** Dashboards updated to include new endpoints, features, or services. Key metrics visible: response time, error rate, throughput.
- [ ] **Alerting rules:** Alerts configured for new error conditions. Existing alerts still valid (no false positives from new code paths).
- [ ] **Logging:** New code paths have appropriate log levels. No sensitive data in logs (PII, tokens, passwords).
- [ ] **Health checks:** Health check endpoints updated if new services are added.

### Rollback Plan
- [ ] **Rollback procedure documented:** Step-by-step rollback instructions written, covering: how to revert the code deployment, how to reverse database migrations (if applicable), how to restore previous environment variable values, who to notify if rollback is triggered.
- [ ] **Rollback tested:** Rollback procedure has been tested in staging. Time-to-rollback estimated and documented.
- [ ] **Feature flags (if applicable):** If the feature uses feature flags, the kill switch is tested and documented.

### Communication
- [ ] **Deploy window:** Deploy scheduled during a low-traffic window if this is a high-risk change. Standard deploys can go anytime.
- [ ] **Team notification:** Relevant teams notified of the upcoming deploy: Engineering (in case of issues), CS (in case of user reports), Marketing (if the deploy enables a launch).

## Pass Criteria

All checklist items pass. The DevOps Engineer posts: "Deploy gate: APPROVED — cleared for production deployment" with:
- Staging test evidence (link to test results or QA sign-off)
- Rollback procedure document location
- Deploy window (if scheduled) or "Deploy at will"

The DevOps Engineer then executes the production deployment.

## Fail Criteria

Any item fails. The DevOps Engineer posts: "Deploy gate: NOT READY" with:
- Which items failed
- What needs to happen before re-evaluation
- Estimated time to resolve
- Whether a partial deploy is possible (deploy non-affected services)

The gate stays in `in_progress`. The DevOps Engineer re-evaluates when the blocking items are addressed.

## Post-Deploy Verification

After deployment (not part of the gate, but the DevOps Engineer's follow-up):
1. Verify health checks pass in production
2. Monitor error rates for 30 minutes post-deploy
3. Verify key user flows work in production
4. If issues detected: execute rollback procedure, file P0 bug, notify via Discord
5. Post "Deploy complete — monitoring clean" or "Deploy rolled back — see {bugIssueKey}" on the gate issue

## Escalation

The DevOps Engineer has authority to block any deploy. If urgency requires overriding the gate (e.g., security hotfix), the CTO can authorize a deploy with documented risk acceptance. The override and rationale are recorded on the gate issue.
