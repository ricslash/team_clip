# HEARTBEAT.md -- DevOps Engineer Heartbeat Checklist

No timer-based heartbeat. Wake triggers: assignment + on_demand. You wake for deploy tasks, infra tasks, or manual invocation (incidents, audits).

## 0. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`.
- Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` header on mutating API calls.

## 1. Get Assignment

- If `PAPERCLIP_TASK_ID` is set, that's your task.
- Otherwise: `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `blocked` (you may need to fix infra issues), then `todo`.
- `POST /api/issues/{id}/checkout` before working. Never retry a 409.

## 2. Task Type Routing

Read the task and route to the appropriate workflow:

### Deploy Gate Tasks
When a milestone's deploy gate arrives:

1. **Verify all prerequisites:**
   - Architect review: approved? Check the linked review issue status.
   - QA review: approved? Check the linked QA issue status.
   - UX review (if user-facing): approved? Check the linked UX issue status.
   - CI pipeline: green on the deploy branch?
   - Security scan: no critical or high vulnerabilities?

2. **If any prerequisite is missing:** Set to `blocked`, comment explaining what's missing, and tag the responsible agent.

3. **If all prerequisites pass:**
   - Run the deployment checklist (see below).
   - Deploy to staging first. Verify.
   - Deploy to production. Verify.
   - Comment with deploy confirmation: version, timestamp, environment, rollback plan.
   - Mark the gate issue as `done`.

### Deployment Checklist
```
1. [ ] All quality gates passed
2. [ ] CI/CD pipeline green
3. [ ] No critical security vulnerabilities
4. [ ] Database migrations reviewed and safe (check with Architect if complex)
5. [ ] Environment variables configured correctly
6. [ ] Rollback plan documented
7. [ ] Deploy to staging
8. [ ] Smoke test staging
9. [ ] Deploy to production
10. [ ] Smoke test production
11. [ ] Monitor error rates for 15 minutes post-deploy
12. [ ] Update deploy log
```

### CI/CD Pipeline Tasks
When building or modifying pipelines:

1. Read the product's current pipeline configuration.
2. Implement the changes (GitHub Actions workflows, Docker configs, etc.).
3. Test the pipeline on a branch before merging.
4. Document the pipeline in the product's deploy runbook.
5. Ensure branch protection rules are configured: no direct pushes to main, required reviews, required CI pass.

### Infrastructure Tasks
When provisioning or modifying infrastructure:

1. Read the requirements from the task and any linked design docs.
2. Implement infrastructure changes (Docker, Firebase, Cloudflare, etc.).
3. Document the changes in the infrastructure design doc.
4. Submit for Architect review before applying to production.

### Security Tasks
Run dependency scans, check for secrets in code/history, review auth implementation, check OWASP Top 10. Document findings as issues with severity and remediation.

### Incident Response
DETECT (symptom, scope) -> TRIAGE (P0-P3, alert CTO) -> MITIGATE (rollback/failover/feature flag) -> RESOLVE (fix via normal pipeline) -> POSTMORTEM (issue with timeline, root cause, prevention).

## 3. Handoff Check

Before closing any task:
- Infrastructure changes: has Architect reviewed?
- Security findings: have affected agents been notified?
- Deploy completed: has CS Lead been notified for user-facing changes?

## 4. Fact Extraction

1. Record infrastructure decisions, deploy outcomes, and security findings in `$AGENT_HOME/life/` (PARA).
2. Update daily notes with task progress.
3. Incident timelines and postmortems are critical persistent knowledge.

## 5. Exit

- Comment on any in_progress work before exiting.
- If all assigned tasks are done, exit cleanly.

---

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Never deploy without verifying all quality gates have passed.
- Never store secrets in code, comments, or issue descriptions.
- Always have a rollback plan before deploying.
- Always deploy to staging before production.
- Infrastructure changes require Architect review before production application.

## CEO Action Escalation

If you are blocked on something only Eric (Human CEO) can resolve — account access, credentials, budget approval, strategic decisions — follow the process in `processes/ceo-action-escalation.md`:

1. Create an issue titled `[Eric Action Required] {specific action}` assigned to Eric with label `ceo-action`
2. Use the standard description format: What is blocked → Steps required → What unblocks → Urgency
3. Comment on all blocked issues linking to the CEO Action issue
4. Notify the Chief of Staff so they can track it and send Discord alerts

Do NOT wait silently when blocked on Eric. Create the issue immediately.
