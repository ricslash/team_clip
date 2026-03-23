# Legal & Compliance Process — Full Lifecycle Reference (TeamClip)

_Last updated: 2026-03-20_
_Adapted from: Team workflow/legal-process.md_

This is the complete legal and compliance lifecycle. It applies to every product, feature launch, partnership, and organizational change. Every phase produces deliverables, tracks risk, and has defined exit criteria before moving forward.

**The cardinal rule:** Legal enables speed by reducing uncertainty. The goal is never to block — it's to surface risk early so decisions are informed and fast. If legal is the bottleneck, the process is broken. Fix it.

---

## The Full Lifecycle

```
ASSESS --> DRAFT --> REVIEW --> IMPLEMENT --> MONITOR
                       ^    |
                       +----+ (new risk, regulatory change, or incident --> re-assess)
```

| # | Phase | TeamClip Pattern | Key Output |
|---|-------|------------------|------------|
| 1 | **Assess** | Legal Counsel creates milestone "Legal Assessment: {scope}" via Paperclip API | Risk assessment report, compliance gap analysis |
| 2 | **Draft** | Legal Counsel creates drafting subtasks | Draft documents, policy proposals |
| 3 | **Review** | Chief of Staff auto-creates blocking "Legal review" issues when work is tagged `public-facing` or `data-handling` | Review feedback, approved/rejected decisions |
| 4 | **Implement** | Legal Counsel creates implementation tasks, Chief of Staff creates cross-team handoff issues | Live legal infrastructure, signed contracts |
| 5 | **Monitor** | Legal Counsel creates monitoring tasks on quarterly/annual cadence. Eric manually triggers for compliance reviews. | Compliance monitoring report, regulatory alerts |

---

## Phase 1: ASSESS

**Trigger:** New product, new feature, data handling change, pricing change, partnership, regulatory update, incident, or scheduled compliance audit.

**TeamClip pattern:** Legal Counsel creates milestone "Legal Assessment: {scope}" via `POST /api/companies/{id}/issues` with subtasks for each assessment area.

**What happens:**
1. Identify the scope — what triggered the assessment and what's affected
2. Map applicable regulations and compliance frameworks (see Compliance Frameworks below)
3. Inventory existing legal infrastructure — what's already in place, what's missing
4. Classify risk level for each identified issue (see Risk Classification below)
5. Produce a risk assessment report with prioritized findings

**Agent:** **Legal Counsel** (sole legal agent — absorbs old legal-counsel, compliance-analyst, ip-strategist, and hr-specialist roles). One legal generalist. Specialist roles emerge only when regulatory complexity demands it.

**Deliverable storage:**
- Risk assessment report: `PUT /api/issues/{assess-milestone-id}/documents/risk-assessment`
- Compliance gap analysis: `PUT /api/issues/{assess-milestone-id}/documents/compliance-gaps`
- Prioritized issue list: `PUT /api/issues/{assess-milestone-id}/documents/issue-priority-list`

**Exit criteria (before moving to Phase 2):**
- [ ] All applicable regulations identified
- [ ] Every risk item classified (Critical/High/Medium/Low)
- [ ] Existing legal infrastructure inventoried
- [ ] Scope of required drafting/updates defined
- [ ] CEO informed of any Critical or High risks (Chief of Staff escalates via Discord)

---

## Phase 2: DRAFT

**Trigger:** Assessment complete. Gaps or new requirements identified.

**TeamClip pattern:** Legal Counsel creates drafting subtasks under the legal milestone. Each document type gets its own subtask issue.

**What happens:**
1. Draft or update legal documents based on assessment findings
2. Customize for the specific product, jurisdiction, and use case
3. Cross-reference with applicable compliance frameworks
4. Internal review before cross-team review

**Document types Legal Counsel drafts:**
- Terms of Service, Privacy Policies, EULAs, Cookie Policies
- Compliance checklists, DPAs, audit reports
- IP assessments, OSS audit reports, trademark filing research
- Contractor agreements, org policies, hiring playbooks
- Data Processing Agreements

**Deliverable storage:**
- Draft documents: `PUT /api/issues/{draft-task-id}/documents/draft`
- Compliance checklists: `PUT /api/issues/{draft-task-id}/documents/compliance-checklist`
- Contract drafts: `PUT /api/issues/{draft-task-id}/documents/contract-draft`
- Internal review notes: stored as issue comments

**Exit criteria (before moving to Phase 3):**
- [ ] All identified gaps addressed in draft documents
- [ ] Documents follow formatting conventions
- [ ] Legal Counsel internal review complete
- [ ] Compliance checklists complete with pass/fail for each item
- [ ] Documents stored as issue documents with dates

---

## Phase 3: REVIEW

**Trigger:** Drafts complete. Also triggered when other teams submit work for legal review (the quality gate).

**TeamClip pattern:** Chief of Staff auto-creates blocking "Legal review: {content}" issues assigned to Legal Counsel when any issue tagged `public-facing`, `data-handling`, or `pricing` reaches "done". Legal Counsel can also be manually assigned review tasks.

**What happens:**
1. Scope the review — what type (see Legal Review Quality Gate below)
2. Assess risk level to determine turnaround time
3. Review against applicable regulations and company standards
4. Flag issues with severity classification and specific remediation steps
5. Provide actionable feedback — never vague objections
6. Approve, approve with conditions, or reject with required changes

**Review outcomes (recorded as comments on the gate issue):**
| Outcome | Meaning | Next Step |
|---------|---------|-----------|
| **Approved** | No issues found | Gate issue marked "done". Proceed to Implement. |
| **Approved with conditions** | Minor issues, can proceed while fixing | Gate issue marked "done" with conditions tracked as subtask issues |
| **Requires changes** | Issues must be resolved before proceeding | Gate issue remains open. Specific feedback in comments. Back to Draft. |
| **Rejected** | Fundamental legal risk, cannot proceed as designed | Gate issue remains open. Escalate to CEO via Chief of Staff Discord alert. Redesign required. |

**Deliverable storage:**
- Review report: `PUT /api/issues/{gate-issue-id}/documents/review-report`
- Required actions checklist: `PUT /api/issues/{gate-issue-id}/documents/required-actions` (every finding gets a checkbox, owner, and deadline)
- Compliance log update: `PUT /api/issues/{gate-issue-id}/documents/compliance-log`

**Exit criteria (before moving to Phase 4):**
- [ ] All submitted items reviewed
- [ ] Every finding has severity, remediation, owner, and deadline
- [ ] Outcome decision recorded on gate issue (approved/conditions/changes/rejected)
- [ ] Submitting team notified via issue status update
- [ ] Compliance log updated

---

## Phase 4: IMPLEMENT

**Trigger:** Documents approved (or approved with conditions). Changes ready to go live.

**TeamClip pattern:** Legal Counsel creates implementation subtasks. Chief of Staff auto-creates cross-team handoff issues for teams that need to act (e.g., CTO for product UI updates, CS Lead for user-facing policy links, DevOps Engineer for compliance tooling).

**What happens:**
1. Publish approved policies to product legal pages
2. Configure compliance tooling (cookie consent, data deletion workflows, consent management)
3. Update product UIs with required legal elements (consent checkboxes, policy links, disclaimers)
4. Execute contract signatures
5. File IP registrations (trademarks, patents)
6. Publish to Confluence for organizational knowledge base
7. Chief of Staff auto-creates handoff issues for affected teams

**Deliverable storage:**
- Published policy links: stored as issue comments
- Compliance tool configurations: `PUT /api/issues/{impl-task-id}/documents/compliance-config`
- Signed contracts: `POST /api/issues/{id}/attachments` (PDF)
- IP filing records: `PUT /api/issues/{impl-task-id}/documents/ip-filing`
- Confluence pages: linked in issue comments

**Exit criteria (before moving to Phase 5):**
- [ ] All approved documents published/executed
- [ ] Technical compliance controls verified (cookie consent works, deletion workflow works, etc.)
- [ ] Affected teams notified via Chief of Staff handoff issues
- [ ] Confluence updated
- [ ] Any conditions from "approved with conditions" tracked as open subtask issues with deadlines

---

## Phase 5: MONITOR

**Trigger:** Implementation complete. Runs continuously.

**TeamClip pattern:** Legal Counsel creates monitoring tasks on quarterly/annual cadence. Eric manually triggers Legal Counsel via on-demand wake for compliance reviews. Chief of Staff may assign monitoring tasks when regulatory changes are detected.

**What happens:**
1. Track regulatory changes across all applicable frameworks
2. Monitor for compliance incidents (data breaches, user complaints, regulatory inquiries)
3. Conduct scheduled audits (quarterly for critical, annually for standard)
4. Review IP landscape (trademark monitoring, OSS license changes, patent filings)
5. Update risk register based on new information
6. Trigger re-assessment when material changes detected

**Monitoring cadence:**
| Area | Frequency |
|------|-----------|
| Regulatory changes (GDPR, CCPA, AI regulation) | Monthly scan |
| Privacy policy alignment with actual practices | Quarterly audit |
| Open source license compliance | Per release (triggered by DevOps Engineer deploy gate) |
| Trademark monitoring | Monthly |
| Employment law changes | Quarterly |
| Contract renewals and expirations | Monthly |
| Data handling practices vs. stated policies | Quarterly |
| Incident review and lessons learned | Per incident |

**Deliverable storage:**
- Compliance monitoring report: `PUT /api/issues/{monitor-task-id}/documents/monitoring-report`
- Regulatory alerts: stored as new issues created by Legal Counsel
- Audit findings: `PUT /api/issues/{audit-task-id}/documents/audit-findings`
- Updated risk register: `PUT /api/issues/{id}/documents/risk-register`

**Trigger for re-assessment (Legal Counsel creates new ASSESS milestone):**
- Material regulatory change affecting the product
- Data breach or security incident
- New product feature collecting new data types
- Expansion to new jurisdiction
- User complaint escalation
- Scheduled annual review

---

## Legal Review Quality Gate

Legal is a **mandatory review gate**. No work ships without legal sign-off when it involves:

| Trigger | What Gets Reviewed | Turnaround |
|---------|-------------------|------------|
| Public-facing copy | ToS, privacy policy, marketing claims, ad copy, landing pages | Per risk level |
| Data handling changes | New data collection, third-party sharing, retention changes, new processors | Per risk level |
| Pricing changes | Terms compliance, refund policy alignment, billing terms | Per risk level |
| New product launches | Full legal checklist (ToS, privacy, cookies, EULA, disclaimers) | 5 business days minimum |
| Partnership agreements | Contract review, liability, IP provisions, data sharing | Per risk level |
| Open source usage | License compatibility before integration | 24-48 hours |
| Marketing campaigns | Claim substantiation, required disclaimers, regulatory compliance | 24-48 hours |
| Employment/contractor | Agreements, classifications, policy changes | Per risk level |

### Review Process Flow (Paperclip pattern)
```
Team completes issue tagged public-facing/data-handling/pricing
  --> Chief of Staff heartbeat detects tag + done status
    --> Auto-creates blocking issue: "Legal review: {content}" assigned to Legal Counsel
      --> Legal Counsel assesses scope and risk level
        --> Critical: Immediate response, CEO notification via Discord
        --> High: 48-hour turnaround, detailed analysis
        --> Medium: 3-day turnaround, review + recommendations
        --> Low: 5-day turnaround, standard review
      --> Feedback stored as issue document: PUT /api/issues/{gate-id}/documents/review-report
        - Specific required changes (not vague objections)
        - Severity per finding
        - Owner and deadline per action item
      --> If approved: gate issue marked "done", unblocks parent
      --> If changes needed: gate issue stays open, creator revises, re-review
```

### Review Report Format (stored as issue document)
Every review produces a document with:
1. **Scope** — what was reviewed and why
2. **Applicable regulations** — which frameworks apply
3. **Findings** — each issue with severity, description, remediation
4. **Required actions** — checkbox list with owner and deadline
5. **Outcome** — approved / approved with conditions / requires changes / rejected
6. **Next review date** — when this should be reviewed again

---

## Risk Classification

| Level | Definition | Response Time | Escalation |
|-------|-----------|---------------|------------|
| **Critical** | Active legal violation, data breach, regulatory enforcement action, immediate liability exposure | Immediate (same day) | CEO via Discord + all affected teams immediately |
| **High** | Significant compliance gap, contractual risk, potential regulatory scrutiny, IP threat | 48 hours | CEO informed via Discord, dedicated remediation plan |
| **Medium** | Non-urgent compliance improvement, policy update needed, minor contractual issue | 1 week | Tracked as issue in Paperclip, scheduled remediation |
| **Low** | Best practice improvement, future-proofing, minor policy clarification | Next scheduled review | Added to issue tree, addressed in normal cycle |

### Risk Response Protocol
- **Critical:** Stop the activity causing the risk. Chief of Staff alerts CEO via Discord. Begin remediation immediately. Document everything as issue documents.
- **High:** Do not launch/ship until resolved. Create remediation plan as issue document with deadline. CEO decides on risk acceptance if needed.
- **Medium:** Can proceed with documented risk acceptance. Schedule remediation. Track in issue tree.
- **Low:** Note for next review cycle. No immediate action required.

---

## Compliance Frameworks

### GDPR (General Data Protection Regulation)
**Applicability:** Any EU users or data subjects
**Key requirements:**
- Lawful basis for processing (consent, legitimate interest, contract)
- Data minimization — collect only what's necessary
- Right to access, rectification, erasure, portability
- Data Processing Agreements with all processors
- Privacy by design and default
- 72-hour breach notification
- Data Protection Impact Assessments for high-risk processing
- Records of processing activities

**Audit frequency:** Quarterly
**Owner:** Legal Counsel
**Audit results stored as:** `PUT /api/issues/{audit-task-id}/documents/gdpr-audit`

### CCPA/CPRA (California Consumer Privacy Act / California Privacy Rights Act)
**Applicability:** California users, businesses meeting revenue/data thresholds
**Key requirements:**
- Right to know what personal information is collected
- Right to delete personal information
- Right to opt-out of sale/sharing of personal information
- Right to non-discrimination for exercising rights
- Privacy policy disclosures (categories collected, purposes, third parties)
- "Do Not Sell or Share" link required
- Data retention schedules

**Audit frequency:** Quarterly
**Owner:** Legal Counsel

### SOC 2 (Service Organization Control 2)
**Applicability:** Enterprise customers, trust signal for B2B
**Key requirements (Trust Service Criteria):**
- Security — protection against unauthorized access
- Availability — system available for operation as committed
- Processing integrity — system processing is complete, valid, accurate, timely
- Confidentiality — information designated as confidential is protected
- Privacy — personal information is collected, used, retained, disclosed, disposed per notice

**Status:** Future (when B2B pipeline requires)
**Owner:** Legal Counsel + DevOps Engineer

### PCI DSS (Payment Card Industry Data Security Standard)
**Applicability:** Payment handling
**Status:** Stripe-managed (SAQ-A for most SaaS — Stripe handles PCI compliance)
**Owner:** Legal Counsel verifies Stripe configuration

### ADA/WCAG (Americans with Disabilities Act / Web Content Accessibility Guidelines)
**Applicability:** All public-facing web products
**Key requirements:**
- WCAG 2.1 AA compliance minimum
- Perceivable, operable, understandable, robust (POUR principles)
- Keyboard navigation, screen reader compatibility, color contrast, alt text

**Owner:** Design Lead + UX Director implement, Legal Counsel audits
**Handoff:** Legal Counsel flags requirements --> Design Lead implements --> UX Director validates --> Legal Counsel verifies

### CAN-SPAM (Controlling the Assault of Non-Solicited Pornography and Marketing Act)
**Applicability:** All commercial email
**Key requirements:**
- No deceptive subject lines
- Identify message as advertisement
- Include physical postal address
- Provide opt-out mechanism (honor within 10 business days)
- Monitor what third parties do on your behalf

**Owner:** Content & Growth Lead implements, Legal Counsel audits

### COPPA (Children's Online Privacy Protection Act)
**Applicability:** Services directed at or knowingly collecting data from children under 13
**Status:** Assess per product (most products not directed at children)
**Owner:** Legal Counsel

---

## Intellectual Property Management

### Trademarks
**Process:**
1. Legal Counsel conducts name/mark search (USPTO, state DBs, common law)
2. Clearance opinion provided (clear / risk / blocked)
3. If clear, file application (or recommend filing strategy)
4. Monitor for infringement after registration

**Key activities:**
- Name searches before product naming decisions
- Filing research and application preparation
- Brand protection monitoring (monthly)
- Cease-and-desist drafting when infringement detected
- Trademark portfolio management

### Patents
**Process:**
1. Architect or Full-Stack Engineer identifies potentially patentable innovation
2. Legal Counsel evaluates novelty and patentability
3. If viable, prepare provisional application or recommend outside counsel
4. Track filing deadlines and prosecution

### Open Source
**Process:**
1. Legal Counsel audits OSS dependencies per release (or per new dependency)
2. Check license compatibility (permissive vs. copyleft vs. proprietary)
3. Verify attribution requirements met
4. Flag any license conflicts or contamination risks

**License compatibility quick reference:**
| License | Can use in proprietary? | Attribution required? | Copyleft risk? |
|---------|----------------------|---------------------|---------------|
| MIT | Yes | Yes (minimal) | No |
| Apache 2.0 | Yes | Yes | No |
| BSD 2/3-Clause | Yes | Yes | No |
| ISC | Yes | Yes (minimal) | No |
| MPL 2.0 | Yes (file-level copyleft) | Yes | Limited |
| LGPL | Yes (with care) | Yes | Moderate |
| GPL v2/v3 | No (unless product is GPL) | Yes | High |
| AGPL | No (network use triggers) | Yes | Critical |
| SSPL | No | Yes | Critical |
| Unlicense / CC0 | Yes | No | No |

**OSS audit results stored as:** `PUT /api/issues/{audit-task-id}/documents/oss-audit`

### Trade Secrets
**Protection measures:**
- NDA templates for all external parties
- Employee/contractor IP assignment agreements
- Access controls for proprietary algorithms and data
- Documentation of what constitutes trade secrets

### Copyright
**Key policies:**
- Company owns all work product (per employment/contractor agreements)
- User-generated content: license grant in ToS, user retains ownership
- Content attribution requirements documented per source
- DMCA takedown procedure documented

---

## HR & People Operations

Legal Counsel owns the HR function for contractor and team management.

### Contractor Management
- Independent contractor agreements
- Statements of Work (SOW) for each engagement
- NDAs executed before any proprietary access
- Worker classification compliance (1099 vs. W-2 analysis)
- IP assignment clauses in all agreements

### Hiring
- Interview process design and evaluation criteria
- Offer letter templates
- Background check requirements (if applicable)
- Onboarding legal checklist (agreements, policies, access)

### Organization Policies
- Remote work policy
- Code of conduct
- IP assignment policy
- PTO / leave policy
- Data handling and security policy for team members
- Acceptable use policy for company resources

### Compensation
- Market research for salary bands
- Equity structures and vesting schedules (if applicable)
- Contractor rate benchmarking
- Benefits analysis (when team scales)

### Employment Compliance
- Worker classification analysis (1099 vs. W-2)
- State/jurisdiction employment law compliance
- Tax withholding and reporting requirements
- International contractor considerations

---

## Cross-Team Interfaces

| Team | Legal Sends | Legal Receives |
|------|------------|----------------|
| **Product** | Compliance constraints, regulatory requirements, feature legal implications | Data handling requirements, new feature compliance needs, product briefs |
| **Engineering** | Data retention policies, encryption requirements, compliance specs | Data handling implementation details, security architecture, OSS dependency lists |
| **DevOps** | Data residency requirements, security compliance mandates | Security audit results, infrastructure compliance data, incident reports |
| **Design** | Accessibility requirements, disclaimer placement, consent UX requirements | Brand guidelines, UI patterns for legal elements |
| **Marketing** | Ad policy constraints, required disclaimers, claim substantiation rules | Public-facing copy for review (via gate issues), campaign concepts, landing pages |
| **Finance** | Regulatory filing requirements, compliance costs, entity structure advice | Financial data for filings, tax compliance questions, pricing proposals |
| **CS** | Data handling procedures, required disclosures, GDPR response templates | User data requests, complaint escalations, support ticket patterns |

### Handoff Protocol (Paperclip pattern)
When legal work affects another team:
1. Chief of Staff auto-creates handoff issue assigned to the receiving team's lead
2. Issue document `requirements` contains: what changed, why, what the receiving team must do, deadline
3. Blocking relationship ensures the receiving team's work is tracked
4. Chief of Staff tracks completion via heartbeat

---

## Anti-Patterns

- **"Legal will slow us down"** — If legal is a bottleneck, the process is broken. Legal should surface risk early so decisions are fast, not block decisions at the last minute.
- **Vague legal feedback** — "This has legal concerns" is not actionable. Every finding must have severity, specific issue, remediation, owner, and deadline. Stored as a structured issue document, not a vague comment.
- **Copying someone else's ToS** — Every product has unique data handling, features, and risk profile. Templates are starting points, not copy-paste solutions.
- **Reviewing after launch** — Legal review happens BEFORE shipping. Retrofitting compliance is 10x more expensive and risky than building it in.
- **Ignoring OSS licenses** — "It's open source so we can do anything" is false. License compatibility must be verified before integration.
- **Treating compliance as a one-time event** — Regulations change. Data practices change. Products change. Monitoring is continuous, not a checkbox.
- **Undated legal documents** — If it doesn't have a date and version, you don't know if it's current. Date everything.
- **Skipping the DPA for B2B** — Every B2B customer relationship involving data processing needs a Data Processing Agreement. No exceptions.
- **Worker misclassification** — Calling someone a contractor doesn't make them one. Apply the actual legal tests (IRS, state-specific).
- **Legal review without product context** — Always read the product project description first. Legal review without understanding the product is theater.
- **Standalone legal files** — All legal deliverables belong as issue documents or attachments. Not orphaned files.

---

## Conventions

1. **Date everything.** Legal documents include dates in the issue and document metadata.
2. **Version legal documents.** Never overwrite — create new versions as updated issue documents. Previous versions are the audit trail (Paperclip revisions handle this automatically).
3. **Issue tree tracks legal work.** All legal tasks are issues in Paperclip with status and timestamps.
4. **Confluence for published docs.** Issue documents are working drafts. Confluence is the published version.
5. **Every finding is actionable.** Severity + description + remediation + owner + deadline. No vague concerns.
6. **Quality gate is non-negotiable.** If it needs legal review per the gate table, it gets legal review. Chief of Staff enforces this automatically via blocking issues. Period.
