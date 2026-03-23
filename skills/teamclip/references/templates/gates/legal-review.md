# Quality Gate: Legal Compliance Review

## Gate Metadata

| Field | Value |
|---|---|
| Gate Name | Legal Compliance |
| Assigned To | Legal Counsel |
| Trigger | Any issue tagged `public-facing` or `data-handling` reaches status `done` |
| Blocks | Parent issue's `shipped` status — content cannot be published or feature deployed until this gate passes |

## When This Gate Is Created

The Chief of Staff auto-creates this gate issue during its heartbeat when it detects an issue tagged `public-facing` or `data-handling` has moved to `done`.

Common triggers:
- Marketing content ready for publication (blog posts, ads, emails, landing pages)
- Feature that collects, stores, or processes user data
- Pricing changes or new pricing tiers
- Terms of service or privacy policy updates needed
- Product launch content
- Competitive comparison content
- User-facing email templates

## API Call to Create

```
POST /api/companies/{companyId}/issues
{
  "title": "Legal review: {triggeringIssueTitle}",
  "description": "Legal compliance review of {triggeringIssueTitle}. Verify regulatory compliance, claims accuracy, and policy alignment. Linked issue: {triggeringIssueKey}.",
  "status": "backlog",
  "priority": "high",
  "tags": ["gate:legal-review", "review", "legal"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{milestoneId}",
  "assigneeAgentId": "{legalCounselId}"
}
```

## Checklist

### For Public-Facing Content

- [ ] **Claims accuracy:** No misleading, deceptive, or unsubstantiated claims. "Best" and "#1" require third-party evidence.
- [ ] **Disclaimers:** Required disclaimers present where applicable (results not typical, beta status, platform limitations)
- [ ] **Competitive claims:** Any comparison to competitors is factual, current, and fair. No disparagement.
- [ ] **Testimonials:** User quotes are real, attributed with permission, and not misleadingly edited
- [ ] **CAN-SPAM compliance (email):** Unsubscribe mechanism functional, physical mailing address present, subject line not deceptive, sender clearly identified
- [ ] **Advertising policies:** Content meets platform-specific advertising policies (Google Ads, Meta Ads, LinkedIn Ads, Reddit Ads) if used for paid promotion
- [ ] **Copyright:** No unauthorized use of third-party content, images, or trademarks

### For Data-Handling Changes

- [ ] **Privacy policy coverage:** New data collection, storage, or processing is covered by the current privacy policy. If not, draft an update.
- [ ] **Terms of service coverage:** New functionality is covered by current ToS. If not, draft an update.
- [ ] **GDPR compliance:** Lawful basis for processing identified, data minimization applied, user consent obtained where required, data retention period defined
- [ ] **CCPA compliance:** Right to know, right to delete, and right to opt-out supported for California users
- [ ] **Data security:** Personal data encrypted in transit and at rest, access controls in place, no unnecessary data exposure in logs or error messages
- [ ] **Third-party data sharing:** If data is shared with third parties (analytics, payment processors), this is disclosed in privacy policy and necessary DPAs are in place
- [ ] **Cookie consent:** If new cookies or tracking are introduced, consent mechanism updated

### For Pricing Changes

- [ ] **Terms alignment:** Pricing changes are consistent with current ToS and do not violate existing user agreements
- [ ] **Grandfathering:** Existing users on affected plans have a clear migration path. Changes communicated with adequate notice.
- [ ] **Auto-renewal disclosure:** If subscriptions auto-renew, this is clearly disclosed before purchase
- [ ] **Refund policy:** Refund terms are clear and consistent with the current policy
- [ ] **Tax implications:** Sales tax, VAT, and other tax obligations considered for new tiers or pricing models

## Pass Criteria

All applicable checklist items pass. Legal Counsel posts: "Legal review: APPROVED" with notes on any items that were corrected during review and any policy updates that need to be published before or alongside the content.

## Fail Criteria

Any compliance issue found. Legal Counsel posts: "Legal review: CHANGES REQUIRED" with:
- Specific issue description
- Regulatory or legal risk level: `high` (potential legal liability), `medium` (policy violation), `low` (best practice)
- Required remediation with specific language or action
- Whether a policy update (ToS, privacy policy) is needed

The gate stays in `in_progress` until all issues are resolved. High-risk items must be resolved before any other gate can pass.

## Escalation

Legal review decisions are not overridable by other agents. If a team disagrees with a legal finding, escalate to Eric (CEO) for a risk-acceptance decision. The Legal Counsel documents the risk and Eric's decision on the issue.
