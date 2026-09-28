# Legal & Compliance Process (TeamClip)

_Last updated: 2026-03-25_

Legal and compliance lifecycle for every product, feature, partnership, and organizational change.

**Cardinal rule:** Legal enables speed by reducing uncertainty. The goal is to surface risk early so decisions are informed and fast. If legal is the bottleneck, the process is broken.

---

## Lifecycle

```
ASSESS --> DRAFT --> REVIEW --> IMPLEMENT --> MONITOR
                       ^    |
                       +----+ (new risk or regulatory change)
```

| # | Phase | Key Output |
|---|-------|------------|
| 1 | **Assess** | Risk assessment, compliance gap analysis |
| 2 | **Draft** | Legal documents, policy proposals |
| 3 | **Review** | Approved/rejected decisions with actionable feedback |
| 4 | **Implement** | Live legal infrastructure, signed contracts |
| 5 | **Monitor** | Compliance monitoring, regulatory alerts |

**Agent:** Legal Counsel (sole agent — absorbs legal-counsel, compliance-analyst, ip-strategist, hr-specialist roles).

---

## Phase Details

### 1. ASSESS

**Trigger:** New product/feature, data handling change, pricing change, partnership, regulatory update, incident, or scheduled audit.

Legal Counsel creates milestone "Legal Assessment: {scope}" with subtasks per assessment area.

**Activities:** Identify scope, map applicable regulations, inventory existing legal infrastructure, classify risk level, produce prioritized findings.

**Storage:** `PUT /api/issues/{id}/documents/{risk-assessment|compliance-gaps|issue-priority-list}`

**Exit:** All regulations identified, every risk classified (Critical/High/Medium/Low), scope of required work defined, CEO informed of Critical/High risks.

### 2. DRAFT

Legal Counsel creates drafting subtasks per document type.

**Document types:** ToS, Privacy Policies, EULAs, Cookie Policies, compliance checklists, DPAs, IP assessments, OSS audit reports, contractor agreements, org policies.

**Storage:** `PUT /api/issues/{id}/documents/{draft|compliance-checklist|contract-draft}`

### 3. REVIEW (Quality Gate)

Chief of Staff auto-creates blocking "Legal review: {content}" issues when work tagged `public-facing`, `data-handling`, or `pricing` reaches "done".

**Outcomes:**
| Outcome | Next Step |
|---------|-----------|
| **Approved** | Gate "done", proceed |
| **Approved with conditions** | Gate "done", conditions tracked as subtasks |
| **Requires changes** | Gate stays open, specific feedback, back to Draft |
| **Rejected** | Gate stays open, escalate to CEO, redesign required |

**Turnaround by risk:** Critical = same day, High = 48h, Medium = 3 days, Low = 5 days.

**Review report (`PUT /api/issues/{gate-id}/documents/review-report`):** Scope, applicable regulations, findings with severity/remediation, required actions with owner/deadline, outcome, next review date.

### 4. IMPLEMENT

Publish approved policies, configure compliance tooling (cookie consent, data deletion, consent management), update product UIs, execute contracts, file IP registrations, publish to Confluence.

Chief of Staff auto-creates handoff issues for affected teams (CTO for UI, CS Lead for user-facing links, DevOps for compliance tooling).

### 5. MONITOR (continuous)

Track regulatory changes, monitor compliance incidents, conduct scheduled audits (quarterly critical, annually standard), review IP landscape, update risk register.

| Area | Frequency |
|------|-----------|
| Regulatory changes (GDPR, CCPA, AI regulation) | Monthly |
| Privacy policy alignment | Quarterly |
| OSS license compliance | Per release |
| Trademark monitoring | Monthly |
| Contract renewals | Monthly |
| Data handling practices | Quarterly |

---

## Risk Classification

| Level | Response Time | Escalation |
|-------|---------------|------------|
| **Critical** | Immediate | CEO + all affected teams via Discord |
| **High** | 48 hours | CEO informed, dedicated remediation plan |
| **Medium** | 1 week | Tracked in Paperclip, scheduled remediation |
| **Low** | Next review | Added to issue tree, normal cycle |

---

## Compliance Frameworks

### GDPR
**When:** Any EU users. **Key:** Lawful basis, data minimization, rights (access/rectification/erasure/portability), DPAs, privacy by design, 72h breach notification, DPIAs. Quarterly audit.

### CCPA/CPRA
**When:** California users meeting thresholds. **Key:** Right to know/delete/opt-out, privacy disclosures, "Do Not Sell" link, retention schedules. Quarterly audit.

### SOC 2
**When:** Enterprise B2B customers. **Status:** Future (when pipeline requires). Trust criteria: security, availability, processing integrity, confidentiality, privacy.

### PCI DSS
**When:** Payment handling. **Status:** Stripe-managed (SAQ-A).

### ADA/WCAG
**When:** All public-facing web products. WCAG 2.1 AA minimum. Design Lead + UX Director implement, Legal Counsel audits.

### CAN-SPAM
**When:** Commercial email. No deceptive subjects, identify as ad, physical address, opt-out mechanism. Content & Growth Lead implements, Legal Counsel audits.

---

## Intellectual Property

### Trademarks
Search (USPTO, state, common law) --> clearance opinion --> file if clear --> monitor monthly for infringement.

### Patents
Engineer identifies innovation --> Legal Counsel evaluates --> provisional application or outside counsel --> track deadlines.

### Open Source
Audit per release. Check license compatibility, verify attribution, flag conflicts.

| License | Proprietary OK? | Copyleft Risk |
|---------|-----------------|---------------|
| MIT, Apache 2.0, BSD, ISC | Yes | No |
| MPL 2.0 | Yes (file-level) | Limited |
| LGPL | Yes (with care) | Moderate |
| GPL v2/v3 | No | High |
| AGPL, SSPL | No | Critical |

### Trade Secrets / Copyright
NDAs for externals, IP assignment in all agreements, access controls, DMCA procedure documented.

---

## HR & People Operations

Legal Counsel owns HR: contractor agreements, SOWs, NDAs, worker classification (1099 vs W-2), IP assignment. Hiring: interview process, offer templates, onboarding legal checklist. Policies: remote work, code of conduct, IP assignment, data handling.

---

## Anti-Patterns

- **Vague legal feedback** — Every finding needs severity, specific issue, remediation, owner, deadline
- **Copying someone else's ToS** — Templates are starting points, not copy-paste
- **Reviewing after launch** — Legal review happens BEFORE shipping
- **Ignoring OSS licenses** — License compatibility must be verified before integration
- **Compliance as one-time event** — Monitoring is continuous
- **Worker misclassification** — Apply actual legal tests
- **Legal review without product context** — Read the project description first
- **Standalone legal files** — Issue documents or attachments only
