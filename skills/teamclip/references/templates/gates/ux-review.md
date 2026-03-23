# Quality Gate: UX Review

## Gate Metadata

| Field | Value |
|---|---|
| Gate Name | UX Review |
| Assigned To | UX Director |
| Trigger | Any issue tagged `user-facing` reaches status `done` |
| Blocks | Parent issue's `shipped` status — feature cannot go to production until this gate passes |

## When This Gate Is Created

The Chief of Staff auto-creates this gate issue during its heartbeat when it detects an issue with the `user-facing` tag has moved to `done`. This covers any work that users will directly interact with: product features, landing pages, onboarding flows, help center pages, settings screens.

Common triggers:
- Feature implementation complete (Full-Stack Engineer)
- Landing page created or updated (Content & Growth Lead)
- Onboarding flow created or updated (CS Lead)
- Help center page with interactive elements (CS Lead)
- Settings or configuration UI (Full-Stack Engineer)

## API Call to Create

```
POST /api/companies/{companyId}/issues
{
  "title": "UX review: {triggeringIssueTitle}",
  "description": "End-to-end UX review of {triggeringIssueTitle}. Take screenshots of all states, verify responsive behavior, and audit accessibility. Linked issue: {triggeringIssueKey}.",
  "status": "backlog",
  "priority": "high",
  "tags": ["gate:ux-review", "review", "user-facing"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{milestoneId}",
  "assigneeAgentId": "{uxDirectorId}"
}
```

## Checklist

The UX Director must verify each item. Uses Gemini's visual capabilities to take and analyze screenshots.

### Visual Consistency
- [ ] **Design spec match:** Implementation matches the design specifications from the Design Lead (if specs exist)
- [ ] **Component consistency:** UI components are consistent with the product's existing design system
- [ ] **Spacing and alignment:** Elements are properly aligned with consistent spacing
- [ ] **Typography:** Correct fonts, sizes, weights, and line heights
- [ ] **Color usage:** Colors match the design system — no off-palette colors

### Responsive Behavior
- [ ] **Mobile (375px):** Layout is usable, no horizontal scroll, tap targets minimum 44x44px
- [ ] **Tablet (768px):** Layout adapts appropriately, no wasted space or cramped elements
- [ ] **Desktop (1440px):** Layout uses available space well, content is readable at arm's length

### User Flows
- [ ] **Happy path:** Primary user flow works end-to-end without confusion or dead ends
- [ ] **Empty state:** First-time users see helpful empty states, not blank screens or error messages
- [ ] **Loading state:** Loading indicators are present, positioned correctly, and non-blocking where possible
- [ ] **Error state:** Errors are clear, actionable, and non-technical ("Something went wrong" is not acceptable)
- [ ] **Success state:** Confirmations are present for destructive or important actions
- [ ] **Edge cases:** Tested with long text, special characters, maximum items, zero items

### Accessibility
- [ ] **Keyboard navigation:** All interactive elements reachable and operable via keyboard alone
- [ ] **Focus indicators:** Visible focus rings on all interactive elements
- [ ] **Screen reader:** Semantic HTML used, ARIA labels where needed, logical reading order
- [ ] **Color contrast:** WCAG 2.1 AA minimum (4.5:1 normal text, 3:1 large text)
- [ ] **Motion:** Animations respect prefers-reduced-motion, no flashing content

### Performance
- [ ] **Perceived speed:** No visible jank, layout shifts, or content jumps during load
- [ ] **Interaction responsiveness:** Buttons, inputs, and navigation respond within 100ms

## Pass Criteria

All checklist items pass. The UX Director posts: "UX review: APPROVED" with screenshots of key states attached to the issue as evidence. Minor non-blocking issues are filed as separate issues tagged `ux-polish` for future sprints.

## Fail Criteria

Any blocking issue found. The UX Director posts: "UX review: CHANGES REQUIRED" with:
- Screenshot showing the issue
- Expected behavior vs. actual behavior
- Severity: `blocking` (must fix before ship) or `non-blocking` (file as follow-up)
- Specific remediation guidance

The gate stays in `in_progress` until all blocking items are resolved and re-reviewed.

## Collaboration with Design Lead

The UX Director validates the **built implementation**. The Design Lead owns the **spec and system**. If the UX Director finds a discrepancy between the spec and implementation:
1. Check with Design Lead: is the spec correct, or should the implementation differ?
2. If spec is correct: implementation must be fixed (assigned back to Full-Stack Engineer)
3. If implementation is a valid improvement: Design Lead updates the spec

## Escalation

If the implementing agent disputes a UX review finding, escalate to the CTO. The CTO arbitrates between engineering effort and UX quality, with input from the Product Manager on user impact.
