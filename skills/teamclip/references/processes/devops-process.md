# DevOps Process (TeamClip)

_Last updated: 2026-03-25_

Infrastructure, CI/CD, security, and operations lifecycle. Every phase updates the DevOps issue tree via Paperclip.

**Cardinal rule:** The issue tree is the heartbeat. If it isn't current, stop and fix it.

---

## Lifecycle

```
ASSESS --> DESIGN --> IMPLEMENT --> MONITOR --> OPTIMIZE
   ^                                              |
   +----------------------------------------------+ (continuous)
```

| # | Phase | Purpose | Key Output |
|---|-------|---------|------------|
| 1 | **Assess** | Audit infrastructure, security, CI/CD, costs | Assessment reports with severity |
| 2 | **Design** | Architecture decisions, pipeline design, security policies | Infrastructure design doc, ADRs |
| 3 | **Implement** | Build pipelines, configure services, harden security | Working infrastructure, deploy runbooks |
| 4 | **Monitor** | Uptime, performance, security alerts, cost tracking | Dashboards, alert configs |
| 5 | **Optimize** | Cost reduction, performance tuning, pipeline improvements | Optimization reports, cost savings |

Emergency: **Incident response** at any time (DETECT --> TRIAGE --> MITIGATE --> RESOLVE --> POSTMORTEM)

---

## Phase Details

### 1. ASSESS

**Trigger:** New product, quarterly review, post-incident, or pre-launch check.

DevOps Engineer creates milestone "Infrastructure Audit: {product}" with subtasks per scope.

**Audit scopes:**
- **Security:** Dependency vulnerabilities, secrets detection, OWASP Top 10, auth/authz, CORS/CSP, SSL/TLS, encryption, rate limiting
- **Infrastructure:** Cloud architecture, scaling strategy, cost analysis, backup/DR, monitoring gaps, environment parity, DNS/CDN, containers
- **CI/CD:** Pipeline coverage, branch protection, deployment strategy, rollback procedures, secrets management, build efficiency

**Agent:** DevOps Engineer (sole agent — absorbs infra-engineer, security-analyst, release-manager roles).

**Peer review:** Architect reviews via gate issues.

**Storage:** `PUT /api/issues/{id}/documents/{security-audit|infrastructure-audit|cicd-audit|cost-optimization}`

**Exit:** Report with date, all findings have severity + remediation, critical/high findings have dedicated issues.

### 2. DESIGN

**Trigger:** Assessment reveals gaps or new product needs infrastructure.

DevOps Engineer creates design subtasks. Architect gets blocking review issue. Finance Analyst gets cost review if budget implications.

**Activities:** Research vendors/patterns, design architecture, write ADRs, design CI/CD topology, define security policies, design monitoring, create cost projections.

**Storage:** `PUT /api/issues/{id}/documents/{infrastructure-design|adr|cicd-pipeline|security-policy|cost-projections|monitoring-design}`

**Exit:** Architect gate resolved, ADRs written, cost projections reviewed, implementation tasks decomposed with blocking relationships.

### 3. IMPLEMENT

**Trigger:** Design approved, tasks in issue tree.

CTO assigns tasks. Chief of Staff auto-creates deploy gate issues before production.

```
FOR each task (priority order):
  1. PATCH status --> "in_progress"
  2. Implement infrastructure change
  3. Verify: tests, health endpoints, configuration
  4. IF pass --> commit, update runbook, PATCH status --> "done"
```

**Implementation areas:** CI/CD (GitHub Actions), cloud services (Firebase, GCP, Cloudflare), containers (Docker), security hardening, monitoring, environments.

**Pre-deployment checklist (mandatory, enforced via deploy gate):**
- [ ] Code review gates passed (Architect gate resolved)
- [ ] All tests pass
- [ ] Staging verified
- [ ] DB migrations tested (reversible if possible)
- [ ] Env vars configured
- [ ] Monitoring/alerting active
- [ ] Rollback documented and tested
- [ ] No known P0/P1 bugs in scope

**Post-deployment:** Health checks, smoke tests, monitor error rates 30 min, update deployment log.

### 4. MONITOR (continuous)

Track uptime, latency, error rates, resource utilization. Monitor security alerts. Track cloud spend. Watch CI/CD health.

| Domain | Alert Threshold |
|--------|----------------|
| Availability | < 99.9% uptime, > 2s p95 response |
| Performance | > 80% resource utilization |
| Security | Any Critical CVE, > 10 failed auth/min |
| Cost | > 110% of forecast |
| CI/CD | > 10% failure rate, build time regression > 50% |

Findings feed into ASSESS or trigger OPTIMIZE.

### 5. OPTIMIZE

**Trigger:** Monitoring reveals issues, costs exceed targets, quarterly cycle, or post-incident.

**Areas:** Cost (right-sizing, reserved instances, cleanup), performance (caching, CDN tuning), security (patches, policy updates), CI/CD (caching, parallelization), reliability (redundancy, failover).

**Storage:** `PUT /api/issues/{id}/documents/{optimization-report|cost-savings}`

**Exit:** Tasks completed, cost impact quantified, performance improvements measured, docs updated.

---

## Incident Response Protocol

```
DETECT --> TRIAGE --> MITIGATE --> RESOLVE --> POSTMORTEM
```

### Severity

| Level | Definition | Response Time |
|-------|-----------|--------------|
| **P0** | Service down, data loss, security breach | Immediate |
| **P1** | Major feature broken, severe degradation | < 1 hour |
| **P2** | Minor feature broken, workaround exists | < 4 hours |
| **P3** | Cosmetic, non-blocking | Next sprint |

### Protocol

1. **DETECT:** Create incident issue (`POST /api/companies/{id}/issues`), store report (`PUT /api/issues/{id}/documents/incident-report`). Chief of Staff alerts CEO (P0) and CS Lead.
2. **TRIAGE:** Assess blast radius, check recent deploys, assess rollback viability. Update incident document.
3. **MITIGATE:** Restore service first (rollback, hotfix, feature flags, scale, block traffic).
4. **RESOLVE:** Proper root cause fix, test in staging, verify with monitoring.
5. **POSTMORTEM:** Within 48h. Store as `PUT /api/issues/{id}/documents/postmortem`. Include: summary, impact, timeline, root cause, resolution, prevention actions. Create subtask issues for all prevention items.

---

## Quality Gates (Blocking Issues)

| Gate | Trigger | Assigned To |
|------|---------|-------------|
| **Architecture Review** | Infra design issue reaches "done" | Architect |
| **Deploy Gate** | Milestone at 100% tasks done | DevOps Engineer |
| **Security Review** | Issue tagged `security` reaches "done" | DevOps Engineer + Architect |
| **Cost Review** | Infra change with budget implications | Finance Analyst |

---

## Task Tracking

### Issue status flow
```
backlog --> todo --> in_progress --> done
                                --> blocked (with blocking issue ref)
                                --> cancelled (with reason)
```

### Priority groups
- **P0** — Ship blockers, active incidents, exploited vulnerabilities
- **P1** — Critical/High security findings, stability risks, compliance gaps
- **P2** — Performance, cost reduction, CI/CD improvements
- **P3** — Tech debt, documentation, tooling
- **P4** — Nice-to-haves, experimental, future-proofing

---

## Current Stack

| Service | Provider | Used For |
|---------|----------|----------|
| Hosting | Firebase, Google Cloud | Application serving |
| CDN/DNS | Cloudflare | Performance, security |
| Containers | Docker / Compose | Local dev, deployment |
| CI/CD | GitHub Actions | Build, test, deploy |
| Auth | Google OAuth | Authentication |
| Database | PostgreSQL, Supabase, Firebase | Data storage |

---

## Anti-Patterns

- **"We'll add monitoring later"** — Not monitored = not production-ready
- **Manual deployments** — Automate everything
- **Secrets in code** — Never. Use secrets management.
- **No rollback plan** — Every deployment needs a tested rollback procedure
- **Alert fatigue** — Tune thresholds, eliminate noise
- **Snowflake environments** — Dev/staging/prod must match
- **Skipping postmortems** — Every P0/P1 gets a blameless postmortem
- **Building without an issue tree** — If issues don't exist, you're freestyling
- **Standalone files** — Deliverables belong as issue documents or attachments
