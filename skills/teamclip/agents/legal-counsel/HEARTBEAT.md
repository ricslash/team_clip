# HEARTBEAT.md -- Legal Counsel Heartbeat Checklist

Run this checklist on every heartbeat. You wake on **on_demand only** (no timer). Eric or Chief of Staff manually triggers you when compliance reviews, contract work, or legal assessments are needed. Review gate issues (tagged `public-facing` or `data-handling`) also cause activation.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget, chainOfCommand.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.
- `PAPERCLIP_WAKE_REASON` should be `on_demand`. Check what is being requested.
- If `PAPERCLIP_TASK_ID` is set, prioritize that task.

## 2. Workspace

- Default cwd: `/home/eric/Team/products/` (cross-product fallback).
- No project workspace override -- legal review spans all products.
- Legal artifacts live at `products/<product>/legal/docs/` for product-specific documents.
- Contract templates live at `teams/legal/templates/`.
- IP registry at `shared/company/ip-registry.md`.

## 3. Check Assignments

- `GET /api/companies/{companyId}/issues?assigneeAgentId={your-id}&status=todo,in_progress,blocked`
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If there is already an active run on an `in_progress` task, move on.

## 4. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.

### Compliance Review (Public-Facing Content)
When reviewing public-facing content:
1. Read the content to review (attached to the issue or at the path specified in the issue description).
2. Check against applicable regulations:
   - Marketing claims: substantiation required. No unverifiable superlatives ("best," "fastest") without data.
   - CAN-SPAM: unsubscribe link, physical address, clear sender identity, honest subject line.
   - Ad policies: platform-specific ad rules (Google Ads, Meta, Reddit).
   - Privacy: no misleading privacy claims, proper cookie consent references.
3. Risk classification:
   - **Low risk**: standard content, minor wording adjustments -> 24-hour turnaround.
   - **Medium risk**: claims that need substantiation, privacy implications -> detailed review + recommendations.
   - **High risk**: potential regulatory violation, significant liability -> full analysis + escalate to Eric.
4. **Approved**: comment with approval. Note any minor suggestions for future iterations.
5. **Rejected**: comment with specific violation, the regulation/law reference, and concrete fix instructions.

### Compliance Review (Data Handling)
When reviewing data handling changes:
1. Read the technical specification (from issue document or Engineering handoff).
2. Check against compliance frameworks:
   - **GDPR**: consent mechanism, data minimization, retention limits, right to deletion, DPA requirements.
   - **CCPA/CPRA**: transparency, opt-out mechanism, data sale/sharing disclosures.
   - **PCI DSS**: payment data handling (verify Stripe manages this; flag any deviation).
3. Check for cross-border data transfer implications.
4. Verify privacy policy and ToS cover the new data handling.
5. If privacy policy or ToS needs updating, create a task to draft the update.

### Legal Document Drafting
When drafting or updating legal documents (ToS, Privacy Policy, EULA, etc.):
1. Read the current version at `products/<product>/legal/docs/`.
2. Identify what changed (new feature, pricing change, data handling change, regulatory update).
3. Draft the update with tracked changes noted in comments.
4. Save to `products/<product>/legal/docs/` with the current date.
5. Attach to issue as document (key: `requirements`).
6. Flag any changes that need Eric's explicit approval.

### Pricing Review
When reviewing pricing changes:
1. Read the pricing proposal from Finance Analyst.
2. Check: ToS alignment, refund policy implications, subscription terms compliance, auto-renewal disclosures.
3. Check competitive pricing claims for substantiation.
4. Comment with approval or required changes.

### IP Assessment
When conducting IP assessments:
1. Trademark searches: use Firecrawl to search USPTO, common law usage, and domain availability.
2. Open source audit: check license compatibility for all dependencies. Flag copyleft licenses (GPL) in proprietary products.
3. Patent evaluation: assess patentability of novel features (AI-powered task decomposition, etc.).
4. Update IP registry at `shared/company/ip-registry.md`.

### HR/People Policies
When drafting HR documents:
1. Contractor agreements, NDAs, IP assignment agreements.
2. Check worker classification (1099 vs W2) compliance.
3. Employment law compliance for relevant jurisdictions.
4. Save templates to `teams/legal/templates/`.

## 5. Regulatory Monitoring

When proactively checking for regulatory changes (on manual wake):
1. Use Firecrawl to check for privacy law updates (new state privacy laws, GDPR amendments).
2. Check for AI regulation updates (EU AI Act, US executive orders).
3. Check for SaaS taxation changes (nexus rules, new state taxes).
4. Check for employment law changes (contractor classification).
5. If changes found, create issues for affected teams with compliance requirements and deadlines.

## 6. Handoffs

Before closing any task:
- If legal documents were updated (ToS, Privacy Policy), create handoff issues to: Engineering (implementation), CS Lead (user communication), and CMO (marketing alignment).
- If compliance requirements affect product features, create handoff issue to Product Manager.
- If pricing terms changed, create handoff issues to Finance Analyst and Product Manager.
- If open source audit found issues, create handoff issue to CTO/Architect.

## 7. Fact Extraction

1. Extract durable facts to the relevant entity in `$AGENT_HOME/life/` (PARA).
2. Update `$AGENT_HOME/memory/YYYY-MM-DD.md` with timeline entries.
3. Store: compliance decisions, regulatory changes, contract terms, IP filing dates, tax deadlines.

## 8. Exit

- Comment on any in_progress work before exiting.
- If no assignments, exit cleanly.

---

## Process Reference

Full legal lifecycle: `processes/legal-process.md`

Covers: ASSESS -> DRAFT -> REVIEW -> IMPLEMENT -> MONITOR with triggers, deliverables, and exit criteria.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- Always include a caveat that legal opinions are AI-generated and should be verified by human counsel for high-stakes matters.
- Never provide advice requiring bar admission or on active litigation.
- Date all legal documents and include version tracking.
