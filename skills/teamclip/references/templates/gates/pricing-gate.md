# Quality Gate: Pricing Gate

## Gate Metadata

| Field | Value |
|---|---|
| Gate Name | Pricing Gate |
| Assigned To | Finance Analyst + Product Manager + Legal Counsel (three-team sign-off) |
| Trigger | Any issue tagged `pricing` reaches status `done` |
| Blocks | Pricing publication — no pricing changes go live without this gate |

## When This Gate Is Created

The Chief of Staff auto-creates this gate issue during its heartbeat when it detects an issue with the `pricing` tag has moved to `done`. This gate requires sign-off from three agents — it is the only gate that requires multi-agent approval.

Common triggers:
- New pricing tiers defined
- Pricing change for existing tiers
- Free tier limit changes
- New product pricing model created
- Discount or promotional pricing approved
- Enterprise pricing structure defined

## API Call to Create

```
POST /api/companies/{companyId}/issues
{
  "title": "Pricing gate: {triggeringIssueTitle}",
  "description": "Three-team pricing review for {triggeringIssueTitle}. Requires sign-off from Finance Analyst (financial model), Product Manager (strategy alignment), and Legal Counsel (terms compliance). All three must approve. Linked issue: {triggeringIssueKey}.",
  "status": "backlog",
  "priority": "critical",
  "tags": ["gate:pricing", "pricing", "review"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{milestoneId}",
  "assigneeAgentId": "{financeAnalystId}"
}
```

Note: The Finance Analyst is the primary assignee and coordinates the review, but all three agents must sign off.

## Checklist

### Finance Analyst Review

- [ ] **Financial model updated:** Revenue projections reflect the new pricing. Unit economics (CAC, LTV, LTV:CAC ratio) recalculated.
- [ ] **Competitive positioning:** Price points are competitive — not leaving money on the table, not pricing out the target market
- [ ] **Margin analysis:** Gross margins by tier are sustainable. Infrastructure costs per tier modeled.
- [ ] **Conversion modeling:** Expected conversion rates between tiers modeled. Free-to-paid funnel projected.
- [ ] **Revenue impact:** For existing products: projected revenue impact (positive or negative) with timeline
- [ ] **Currency and tax:** Multi-currency handling considered (if applicable). Tax implications identified.

### Product Manager Review

- [ ] **Strategy alignment:** Pricing aligns with the product positioning from GTM strategy
- [ ] **Feature-tier mapping:** Features assigned to tiers make strategic sense. Free tier provides enough value to hook, paid tier provides enough to justify the price.
- [ ] **Upgrade triggers:** Clear triggers exist that naturally push users from free to paid (usage limits, feature gates, collaboration needs)
- [ ] **Competitive differentiation:** Pricing structure supports the product's competitive position (cheaper, same price with more value, or premium positioning)
- [ ] **User experience:** Pricing page is clear and honest. No dark patterns. No hidden fees. Comparison between tiers is straightforward.
- [ ] **Grandfathering plan:** For pricing changes: existing users have a clear, fair migration path with adequate notice period

### Legal Counsel Review

- [ ] **Terms alignment:** Pricing changes are consistent with current Terms of Service. If not, ToS update drafted.
- [ ] **Auto-renewal disclosure:** If subscriptions auto-renew, this is clearly disclosed before purchase per applicable regulations
- [ ] **Refund policy:** Refund terms are clear, accessible, and consistent with current policy. Pro-rata refund calculations are correct.
- [ ] **Promotional terms:** If promotional pricing exists, terms are clear: duration, what happens after, eligibility
- [ ] **International compliance:** Pricing display meets requirements for target markets (tax-inclusive pricing where required, currency display)
- [ ] **Grandfathering legality:** Proposed migration for existing users complies with consumer protection regulations in target markets

## Pass Criteria

All three agents must approve. Each posts a comment:
- Finance Analyst: "Pricing gate — Finance: APPROVED" with financial model summary
- Product Manager: "Pricing gate — Product: APPROVED" with strategy alignment confirmation
- Legal Counsel: "Pricing gate — Legal: APPROVED" with compliance confirmation

Only when all three approvals are posted does the Finance Analyst mark the gate as `done`.

## Fail Criteria

Any reviewer rejects. The rejecting agent posts their finding with:
- Specific objection
- Required change to resolve
- Whether the objection is negotiable (can be addressed by adjusting the pricing) or non-negotiable (legal requirement)

The gate stays in `in_progress`. The agent who created the pricing proposal addresses each objection. All three agents must re-review after changes.

## Escalation

If the three reviewers cannot reach agreement (e.g., Finance wants higher prices, Product wants lower prices, Legal flags compliance issues with both), escalate to Eric (CEO) for a final decision. Document the trade-offs and each agent's recommendation on the issue.
