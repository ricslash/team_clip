# DevOps Process — Full Lifecycle Reference (TeamClip)

_Last updated: 2026-03-20_
_Adapted from: Team workflow/devops-process.md_

This is the complete DevOps infrastructure lifecycle. It applies to any product's infrastructure, CI/CD, security, and operations. Every phase produces deliverables, updates the DevOps issue tree, and has defined exit criteria before moving forward.

**The cardinal rule:** The issue tree is the heartbeat. Every phase reads it, updates it, and tracks status via Paperclip. If the issue tree isn't current, stop and fix it before doing anything else.

---

## The Full Lifecycle

```
ASSESS --> DESIGN --> IMPLEMENT --> MONITOR --> OPTIMIZE
   ^                                              |
   +----------------------------------------------+ (continuous cycle)
```

| # | Phase | TeamClip Pattern | Purpose | Key Output |
|---|-------|------------------|---------|------------|
| 1 | **Assess** | DevOps Engineer creates milestone "Infrastructure Audit: {product}" via Paperclip API with subtasks per audit scope | Audit infrastructure, security, CI/CD, costs, performance | Assessment reports, findings with severity |
| 2 | **Design** | DevOps Engineer creates design subtasks; Architect reviews via gate issue | Architecture decisions, vendor selection, pipeline design, security policies | Infrastructure design doc, ADRs |
| 3 | **Implement** | CTO creates task tree, assigns to DevOps Engineer. Deploy gate issues auto-created by Chief of Staff. | Build pipelines, configure services, set up monitoring, harden security | Working infrastructure, deploy runbooks |
| 4 | **Monitor** | DevOps Engineer creates monitoring tasks; continuous operation | Uptime tracking, performance metrics, security alerts, cost tracking | Monitoring dashboards, alert configurations |
| 5 | **Optimize** | DevOps Engineer creates optimization tasks with cost/performance targets | Cost reduction, performance tuning, security updates, pipeline improvements | Optimization reports, cost savings |

Emergency protocol:
- **Incident response** — at any time (DETECT --> TRIAGE --> MITIGATE --> RESOLVE --> POSTMORTEM)

---

## Phase 1: ASSESS

**Trigger:** New product onboarding, quarterly review cycle, post-incident review, or pre-launch readiness check.

**TeamClip pattern:** DevOps Engineer creates milestone "Infrastructure Audit: {product}" via `POST /api/companies/{id}/issues` with subtasks for each audit scope (security, infrastructure, CI/CD).

**What happens:**
1. Identify the product and audit scope (security, infrastructure, CI/CD, performance, or full)
2. Read product project description for tech stack, repo structure, existing infrastructure
3. Read existing DevOps issue documents
4. Scan Docker/docker-compose files, CI/CD configs, deployment scripts, environment configs
5. Execute audit based on scope:

**Security audit (DevOps Engineer — absorbs old security-analyst role):**
- Dependency vulnerability scanning (npm audit, pip audit, etc.)
- Hardcoded secrets and API key detection
- Authentication and authorization implementation review
- OWASP Top 10 compliance check (injection, XSS, CSRF, SSRF, etc.)
- CORS, CSP, and security header configuration
- SSL/TLS configuration and certificate status
- Data encryption review (at rest and in transit)
- Error handling audit (no sensitive data in error responses)
- Rate limiting and DDoS protection assessment

**Infrastructure audit (DevOps Engineer — absorbs old infra-engineer role):**
- Cloud architecture and service selection review
- Scaling strategy assessment (horizontal vs vertical, auto-scaling policies)
- Cost analysis with optimization opportunities
- Backup and disaster recovery assessment
- Monitoring and alerting coverage gaps
- Environment parity check (dev/staging/prod drift)
- DNS and CDN configuration review
- Container orchestration health

**CI/CD audit (DevOps Engineer — absorbs old release-manager role):**
- Pipeline coverage (build, test, lint, security scan, deploy stages)
- Branch protection rules and merge policies
- Deployment strategy review (blue/green, canary, rolling)
- Rollback procedure documentation and testing
- Environment variable and secrets management in CI
- Build time and pipeline efficiency
- Artifact management and versioning

**Agent:** **DevOps Engineer** (sole DevOps agent — absorbs old infra-engineer, security-analyst, and release-manager roles). All three are one workflow: build it, secure it, ship it.

**Peer review:** Architect reviews infrastructure design soundness and security posture via gate issues.

**Deliverable storage:**
- Security audit report: `PUT /api/issues/{audit-task-id}/documents/security-audit`
- Infrastructure audit report: `PUT /api/issues/{audit-task-id}/documents/infrastructure-audit`
- CI/CD audit report: `PUT /api/issues/{audit-task-id}/documents/cicd-audit`
- Findings with severity classification: included in audit documents
- Cost optimization recommendations: `PUT /api/issues/{id}/documents/cost-optimization`

**Issue tree update:** Add remediation tasks as subtask issues from audit findings. Each finding becomes an issue with severity-based priority.

**Exit criteria:**
- [ ] Audit report stored as issue document with date
- [ ] All findings have severity classification and remediation steps
- [ ] Critical and High findings have dedicated issues created
- [ ] Issue tree updated with remediation tasks
- [ ] Report published to Confluence

---

## Phase 2: DESIGN

**Trigger:** Assessment reveals gaps, new product needs infrastructure, or significant architecture change required.

**TeamClip pattern:** DevOps Engineer creates design subtasks. Architect gets a blocking review issue (Chief of Staff auto-creates). Finance Analyst gets cost review issue if budget implications exist.

**What happens:**
1. Read assessment findings and remediation priorities
2. Research vendor options, architecture patterns, cost implications
3. Design infrastructure architecture addressing assessment gaps
4. Document architecture decisions as ADRs (Architecture Decision Records)
5. Design CI/CD pipeline topology
6. Define security policies and compliance requirements
7. Design monitoring and alerting strategy
8. Create cost projections for proposed infrastructure

**Agent:** **DevOps Engineer**

**Peer review:** Architect reviews via blocking gate issue — verifies infra design soundness, security posture, and alignment with overall system architecture.

**Deliverable storage:**
- Infrastructure design doc: `PUT /api/issues/{design-milestone-id}/documents/infrastructure-design`
- Architecture Decision Records: `PUT /api/issues/{id}/documents/adr` (per decision subtask)
- CI/CD pipeline design: `PUT /api/issues/{design-milestone-id}/documents/cicd-pipeline`
- Security policy document: `PUT /api/issues/{design-milestone-id}/documents/security-policy`
- Cost projections: `PUT /api/issues/{design-milestone-id}/documents/cost-projections`
- Monitoring design: `PUT /api/issues/{design-milestone-id}/documents/monitoring-design`
- Cost projection workbooks: `POST /api/issues/{id}/attachments` (Excel files)

**Issue tree update:** Create implementation task issues from design deliverables. Each infrastructure component, pipeline stage, and security control becomes an issue.

**Exit criteria:**
- [ ] Infrastructure design doc reviewed and approved (Architect gate issue resolved)
- [ ] ADRs written for all significant decisions (vendor, architecture, strategy)
- [ ] Cost projections reviewed by Finance Analyst (if budget implications)
- [ ] Security policies reviewed by Legal Counsel if compliance implications exist
- [ ] Implementation tasks decomposed in issue tree
- [ ] Dependencies between tasks are explicit (blocking relationships)

---

## Phase 3: IMPLEMENT

**Trigger:** Design is approved and implementation tasks are in the issue tree.

**TeamClip pattern:** CTO assigns implementation tasks to DevOps Engineer. Chief of Staff auto-creates deploy gate issues before any production deployment.

**What happens:**
1. Read design docs (issue documents), issue tree, and product project description
2. Execute implementation tasks in priority order using the agent loop:

```
FOR each task issue (priority order):
  1. Update issue status --> "in_progress" via PATCH /api/issues/{id}
  2. DevOps Engineer implements the infrastructure change
  3. Verify: run tests, check health endpoints, validate configuration
  4. IF fail --> troubleshoot --> re-verify (loop until passing)
  5. IF pass:
     a. Commit configuration changes
     b. Update deploy runbook if pipeline changed
     c. Update issue status --> "done" via PATCH /api/issues/{id}
  6. Move to next task
```

**Implementation areas:**

| Area | Activities |
|------|-----------|
| CI/CD pipelines | GitHub Actions workflows, build/test/deploy stages, branch protection |
| Cloud services | Firebase, Google Cloud, Cloudflare configuration, DNS, CDN |
| Containers | Dockerfile creation, docker-compose, orchestration setup |
| Security hardening | Secrets management, auth config, security headers, rate limiting |
| Monitoring | Uptime checks, performance metrics, error tracking, alerting rules |
| Environments | Dev/staging/prod parity, environment variable management |

**Pre-deployment checklist (mandatory for production — enforced via deploy gate issue):**
- [ ] All code review gates passed (Architect gate issue resolved)
- [ ] All tests pass (unit, integration, e2e)
- [ ] Staging environment tested and verified
- [ ] Database migrations tested (reversible if possible)
- [ ] Environment variables configured for target environment
- [ ] Monitoring and alerting confirmed active
- [ ] Rollback procedure documented and tested
- [ ] No known P0/P1 bugs in deployment scope
- [ ] Legal review passed (if new public-facing features — Legal Counsel gate resolved)
- [ ] CS Lead notified (help center updates, support preparation — via handoff issue)

**Post-deployment:**
- Verify health checks pass
- Confirm core functionality with smoke tests
- Monitor error rates and performance for 30 minutes
- Update deployment log
- Chief of Staff auto-creates notification issues for relevant teams (CS Lead, CMO if user-facing)

**Deliverable storage:**
- Deploy runbook: `PUT /api/issues/{deploy-task-id}/documents/deploy-runbook`
- Deployment log entries: stored as issue comments with timestamps
- Configuration documentation: `PUT /api/issues/{id}/documents/config-doc`

**Exit criteria:**
- [ ] All implementation tasks marked done
- [ ] Deploy runbook is current and tested (stored as issue document)
- [ ] Health checks pass in all environments
- [ ] Monitoring and alerting are active
- [ ] Rollback procedure tested successfully
- [ ] Issue tree reflects current state

---

## Phase 4: MONITOR

**Trigger:** Infrastructure is live. This phase is continuous — it never ends.

**TeamClip pattern:** DevOps Engineer maintains monitoring tasks. Anomalies create new issues automatically. Chief of Staff escalates to Eric via Discord for threshold breaches.

**What happens:**
1. Track uptime, latency, error rates, and resource utilization
2. Monitor security alerts (dependency vulnerabilities, intrusion detection, anomalous access patterns)
3. Track cloud spend against budgets and forecasts
4. Watch CI/CD pipeline health (build times, failure rates, deploy frequency)
5. Respond to incidents per the incident response protocol

**Monitoring domains:**

| Domain | Metrics | Alerting Threshold |
|--------|---------|-------------------|
| **Availability** | Uptime %, response time, health check status | < 99.9% uptime, > 2s p95 response |
| **Performance** | CPU, memory, disk, network, query times | > 80% resource utilization |
| **Security** | Failed auth attempts, dependency CVEs, anomalous traffic | Any Critical CVE, > 10 failed auth/min |
| **Cost** | Daily/monthly spend, spend vs forecast, per-service breakdown | > 110% of forecast |
| **CI/CD** | Build time, failure rate, deploy frequency, rollback frequency | > 10% failure rate, build time regression > 50% |

**Deliverable storage:**
- Monthly cost reports: `PUT /api/issues/{monitor-task-id}/documents/cost-report`
- Incident records: stored as new issues (see Incident Response Protocol)
- Alert configurations: `PUT /api/issues/{id}/documents/alert-config`

**Issue tree update:** Monitoring-discovered issues become new issues in the tree. Cost anomalies become investigation tasks.

**No exit criteria** — this phase runs continuously. Findings feed back into ASSESS or trigger OPTIMIZE.

---

## Phase 5: OPTIMIZE

**Trigger:** Monitoring reveals performance issues, costs exceed targets, quarterly optimization cycle, or post-incident improvements.

**TeamClip pattern:** DevOps Engineer creates optimization milestone with subtasks per optimization area. Finance Analyst gets cost impact review issue.

**What happens:**
1. Analyze monitoring data for optimization opportunities
2. Identify cost reduction candidates (right-sizing, reserved instances, unused resources)
3. Profile performance bottlenecks and propose solutions
4. Review and update security posture based on new threats
5. Improve CI/CD pipeline efficiency (build times, caching, parallelization)
6. Update infrastructure documentation to reflect current state

**Optimization areas:**

| Area | Activities |
|------|-----------|
| **Cost** | Right-sizing, reserved instances, unused resource cleanup, vendor negotiation |
| **Performance** | Caching strategies, query optimization, CDN tuning, auto-scaling policies |
| **Security** | Patch management, policy updates, access review, compliance updates |
| **CI/CD** | Build caching, test parallelization, pipeline consolidation, artifact cleanup |
| **Reliability** | Redundancy improvements, failover testing, backup verification |

**Deliverable storage:**
- Optimization report: `PUT /api/issues/{optimize-milestone-id}/documents/optimization-report`
- Cost savings summary: `PUT /api/issues/{optimize-milestone-id}/documents/cost-savings`
- Performance benchmarks: `POST /api/issues/{id}/attachments` (before/after data)
- Updated infrastructure docs: updated issue documents on relevant design issues
- Updated runbooks: updated issue documents on deploy tasks

**Exit criteria:**
- [ ] All optimization tasks completed or deferred with justification
- [ ] Cost impact quantified and reported to Finance Analyst (via handoff issue)
- [ ] Performance improvements measured and documented
- [ ] Infrastructure docs updated to reflect current state
- [ ] Findings feed back into next ASSESS cycle

---

## Incident Response Protocol

Incidents bypass the normal lifecycle. They follow their own protocol:

```
DETECT --> TRIAGE --> MITIGATE --> RESOLVE --> POSTMORTEM
```

### Severity Levels

| Severity | Definition | Response Time | Notification | Example |
|----------|-----------|--------------|-------------|---------|
| **P0 Critical** | Service down, data loss risk, security breach | Immediate | All teams + CEO via Discord | Production outage, data breach |
| **P1 High** | Major feature broken, severe performance degradation | < 1 hour | CTO + CS Lead + DevOps Engineer | Payment processing down, auth broken |
| **P2 Medium** | Minor feature broken, workaround exists | < 4 hours | CTO | Non-critical feature error, slow queries |
| **P3 Low** | Cosmetic issue, non-blocking | Next sprint | Engineering backlog | UI glitch, minor log noise |

### Incident Lifecycle

**DETECT:** Alert fires, user reports issue, or team discovers problem.
- Create incident issue: `POST /api/companies/{id}/issues` with `P0`/`P1` priority
- Store initial report: `PUT /api/issues/{incident-id}/documents/incident-report`
- Chief of Staff detects new P0/P1 issue and alerts Eric via Discord
- Chief of Staff creates notification issues for CS Lead and affected teams

**TRIAGE:** Assess scope, identify affected systems, form root cause hypothesis.
- Determine blast radius (which users, which features, which services)
- Check recent deploys (most incidents correlate with recent changes)
- Assess rollback viability
- Update incident document with triage findings

**MITIGATE:** Stop the bleeding. Restore service first, fix root cause second.
- Rollback if recent deploy caused the issue
- Apply hotfix if rollback isn't viable
- Enable feature flags to disable broken functionality
- Scale resources if capacity-related
- Block malicious traffic if security-related

**RESOLVE:** Fix the root cause permanently.
- Implement proper fix (not just the band-aid)
- Test in staging before production deployment
- Verify resolution with monitoring (error rates return to baseline)
- Update incident issue with resolution details

**POSTMORTEM:** Learn from it. No blame, just improvement.
- Write postmortem within 48 hours of resolution
- Store as issue document: `PUT /api/issues/{incident-id}/documents/postmortem`
- Include: summary, impact (users affected, duration), timeline, root cause, resolution, prevention actions
- Create subtask issues for all prevention action items
- Publish to Confluence for team reference

### Incident Communication

| Audience | Channel | Frequency |
|----------|---------|-----------|
| Internal teams | Issue updates + Chief of Staff notifications | Every status change |
| CS Lead | Handoff issue with user-facing language | At detection + resolution |
| Users (P0/P1) | Status page update (CS Lead handles) | Every 30 minutes until resolved |
| CEO (P0) | Discord notification via Chief of Staff | At detection + resolution |

---

## Quality Gates (Blocking Issues)

The Chief of Staff auto-creates these as blocking issues for DevOps work:

| Gate | Auto-Created When | Assigned To | Blocks |
|------|-------------------|-------------|--------|
| **Architecture Review** | Any infra design issue reaches "done" | Architect | Implementation tasks |
| **Deploy Gate** | Any milestone reaches 100% tasks done | DevOps Engineer | Production deploy |
| **Security Review** | Any issue tagged `security` reaches "done" | DevOps Engineer (self-review) + Architect | Merge/deploy |
| **Cost Review** | Any infrastructure change with budget implications | Finance Analyst | Implementation approval |

---

## Task Tracking — The Backbone

**This is non-negotiable.** Every phase reads and updates the issue tree. Paperclip is the source of truth.

### Issue status flow
```
backlog --> todo --> in_progress --> done
                                --> blocked (with blocking issue reference)
                                --> cancelled (with reason in comment)
```

### Priority groups
- **P0** — Ship blockers, active incidents, security vulnerabilities with known exploits
- **P1** — Security findings (Critical/High), production stability risks, compliance gaps
- **P2** — Performance optimization, cost reduction, CI/CD improvements
- **P3** — Tech debt, documentation updates, tooling improvements
- **P4** — Nice-to-haves, experimental infrastructure, future-proofing

### When to update issues
| Event | Update |
|-------|--------|
| Audit finding discovered | Create new issue with severity-based priority |
| Starting a task | `PATCH /api/issues/{id}` status --> "in_progress" |
| Task verified and deployed | `PATCH /api/issues/{id}` status --> "done" |
| Task blocked | `PATCH /api/issues/{id}` status --> "blocked", create blocking issue |
| Incident created | Create P0/P1 issue, Chief of Staff auto-escalates |
| Monitoring alert triggers investigation | Create investigation issue |
| Optimization identified | Create issue with estimated impact in description |

---

## Current Infrastructure Stack

| Service | Provider | Used For |
|---------|----------|----------|
| Hosting | Firebase Hosting, Google Cloud | Application serving |
| CDN/DNS | Cloudflare | Performance, security, DNS |
| Containers | Docker / Docker Compose | Local dev, deployment |
| CI/CD | GitHub Actions | Build, test, deploy pipelines |
| Auth | Google OAuth | User authentication |
| Database | PostgreSQL, Supabase, Firebase | Data storage |
| Monitoring | TBD | Uptime, performance, errors |
| Secrets | TBD | Environment variables, API keys |

---

## Interfaces with Other Teams

| Team | DevOps Sends | DevOps Receives |
|------|-------------|----------------|
| **Engineering** | CI/CD pipelines, deploy procedures, security policies, infra constraints | Deploy-ready code, infrastructure requirements |
| **Product** | Uptime SLAs, infrastructure capability constraints, cost implications | Performance requirements, scale expectations |
| **Finance** | Infrastructure cost reports, vendor cost comparisons, optimization savings | Budget constraints, cost targets |
| **CS** | Status page updates (via handoff issues), incident communications, maintenance schedules | User-reported outage reports |
| **Legal** | Security audit results, data residency info, encryption details | Compliance requirements, data handling mandates |
| **Design** | Performance budgets, CDN capabilities | Asset optimization requirements |
| **Marketing** | Uptime guarantees for launch windows, infrastructure readiness | Launch timelines requiring infrastructure preparation |

All cross-team handoffs are mediated by Chief of Staff creating issues with full context in issue documents.

---

## Anti-Patterns

- **"We'll add monitoring later"** — Monitoring is not optional. If it's not monitored, it's not production-ready.
- **Manual deployments** — If a human is SSH-ing into a server to deploy, you've already failed. Automate everything.
- **Secrets in code** — Never. Not even in "private" repos. Not even "temporarily." Use secrets management.
- **No rollback plan** — Every deployment must have a tested rollback procedure before it ships. Documented as issue document.
- **Alert fatigue** — Too many alerts is worse than no alerts. Tune thresholds, eliminate noise, escalate only what matters.
- **Snowflake environments** — Dev, staging, and production must be as close to identical as possible. Environment drift causes production surprises.
- **Skipping postmortems** — Every P0/P1 incident gets a blameless postmortem stored as an issue document. If you skip it, you'll repeat it.
- **Cost ignorance** — Cloud spend grows silently. Review monthly, optimize quarterly, right-size continuously.
- **Undated docs** — If it doesn't have a date, you don't know if it's current. Date everything.
- **Building without an issue tree** — If the issues don't exist, you're freestyling. Stop and create them.
- **Security as afterthought** — Security is a phase-one concern. Baking it in later costs 10x more.
- **Overwriting configs without versioning** — Infrastructure configurations are code. Version them. Review them. Never overwrite. Store config docs as revisioned issue documents.
- **Standalone files instead of issue documents** — All DevOps deliverables belong as issue documents or attachments on their respective issues.
