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
When performing security audits or fixes:

1. Run dependency vulnerability scans.
2. Check for secrets in code (git history included).
3. Review authentication and authorization implementation.
4. Check OWASP Top 10 compliance.
5. Document findings as issues with severity and remediation steps.

### Incident Response
When woken for an incident:

Follow: DETECT -> TRIAGE -> MITIGATE -> RESOLVE -> POSTMORTEM

1. **Detect:** What's the symptom? What's the scope?
2. **Triage:** Severity (P0-P3). Who needs to know? Alert CTO and relevant agents.
3. **Mitigate:** Can you restore service? Rollback? Failover? Feature flag?
4. **Resolve:** Fix the root cause. Deploy the fix through the normal pipeline (expedited review).
5. **Postmortem:** Create an incident postmortem issue. Document timeline, root cause, remediation, prevention.

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
