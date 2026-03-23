# Quality Gate: Launch Readiness

## Gate Metadata

| Field | Value |
|---|---|
| Gate Name | Launch Readiness |
| Assigned To | Chief of Staff |
| Trigger | Any goal's milestones all complete (all milestones under a goal reach `done` status) |
| Blocks | Launch announcement and public availability |

## When This Gate Is Created

The Chief of Staff auto-creates this gate issue during its heartbeat when it detects that all milestones under a product goal have reached `done` status, indicating that the product or major feature is ready for launch. This is the broadest gate — it verifies cross-team readiness, not just one team's output.

This gate can also be manually created by the CMO when a launch date is approaching and pre-launch coordination is needed.

## API Call to Create

```
POST /api/companies/{companyId}/issues
{
  "title": "Launch readiness: {goalName}",
  "description": "Cross-team launch readiness verification for {goalName}. Every team must confirm their launch prerequisites are met before the launch announcement proceeds. Linked goal: {goalId}.",
  "status": "backlog",
  "priority": "critical",
  "tags": ["gate:launch-readiness", "gate", "public-facing", "user-facing"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{launchMilestoneId}",
  "assigneeAgentId": "{chiefOfStaffId}"
}
```

## Checklist

The Chief of Staff coordinates with every team lead to verify readiness. Each section must be confirmed by the responsible agent.

### Product (confirmed by: Product Manager)
- [ ] Feature complete per PRD scope — all acceptance criteria met
- [ ] No descoped items that break the core value proposition
- [ ] User onboarding flow tested and functional
- [ ] Product positioning and messaging finalized and approved

### Engineering (confirmed by: CTO)
- [ ] All code review gates passed for launch-scope code
- [ ] No P0 or P1 bugs open in the launch scope
- [ ] Deploy gate passed — code is in production or ready to deploy
- [ ] Performance benchmarks met (page load, API response times, concurrent user targets)

### Design (confirmed by: Design Lead)
- [ ] Brand review gate passed for all public-facing assets
- [ ] Design system components used in the product are documented
- [ ] Accessibility audit completed by UX Director — no blocking issues

### Marketing (confirmed by: CMO)
- [ ] Launch content created and approved (blog post, social, email, Product Hunt)
- [ ] Landing page live (or staged and ready to go live)
- [ ] Channel plan executed — posts scheduled, email queued
- [ ] UTM tracking configured on all launch links

### Customer Success (confirmed by: CS Lead)
- [ ] User documentation published and accessible (getting started, features, FAQ)
- [ ] Help center updated with launch-specific content
- [ ] Support team briefed on launch features, known issues, and talking points
- [ ] Feedback collection mechanism active (in-app, email, support channel)

### Legal (confirmed by: Legal Counsel)
- [ ] Legal review gate passed for all public-facing content
- [ ] Terms of service updated if new functionality requires it
- [ ] Privacy policy updated if new data handling introduced
- [ ] All compliance requirements met (GDPR, CCPA, CAN-SPAM, platform policies)

### Finance (confirmed by: Finance Analyst)
- [ ] Pricing implemented correctly (if applicable) — pricing gate passed
- [ ] Billing system tested — subscriptions, upgrades, downgrades, cancellations
- [ ] Financial model updated with launch projections
- [ ] Revenue tracking configured (Stripe webhooks, analytics events)

### DevOps (confirmed by: DevOps Engineer)
- [ ] Deploy gate passed — production deployment complete or ready
- [ ] Scaling plan in place for launch traffic (auto-scaling configured, CDN active)
- [ ] Monitoring and alerting active — dashboards ready for launch-day observation
- [ ] Incident response plan updated — on-call rotation aware of launch timing
- [ ] Rollback procedure documented and tested

## Pass Criteria

All sections confirmed by their respective team leads. The Chief of Staff posts: "Launch readiness: CONFIRMED" with:
- Summary of all team confirmations
- Any caveats or known limitations accepted for launch
- Recommended launch timing
- Discord notification to Eric: "{goalName} is launch-ready. All teams confirmed."

The launch announcement task is unblocked.

## Fail Criteria

Any team cannot confirm readiness. The Chief of Staff posts: "Launch readiness: NOT READY" with:
- Which teams are not ready and why
- Estimated time to readiness per team
- Whether a partial launch is possible (launch with reduced scope)
- Recommendation: wait, reduce scope, or accept risk

The Chief of Staff sends a Discord notification to Eric: "{goalName} launch readiness blocked by: {teamList}. Details: {summary}."

## Launch Day Protocol

After the gate passes and launch announcement goes live:

1. **Hour 0-2:** All hands monitoring. Chief of Staff coordinates via issue comments.
2. **Hour 2-6:** Reduced monitoring. DevOps watches infrastructure. CS watches support channels.
3. **Hour 6-24:** Normal monitoring. Content & Growth Lead responds to social media and forum comments.
4. **Day 1 EOD:** Chief of Staff collects day-1 metrics and posts summary. Discord notification to Eric with results.
5. **Day 7:** CMO triggers gtm-measure milestone for first-week analysis.

## Escalation

The Chief of Staff has authority to delay the launch if any team is not ready. Only Eric (CEO) can override a launch readiness failure — and the override, rationale, and accepted risks are documented on the gate issue.
