# Quality Gate: Brand Review

## Gate Metadata

| Field | Value |
|---|---|
| Gate Name | Brand Review |
| Assigned To | Design Lead |
| Trigger | Any issue tagged `public-facing` reaches status `done` |
| Blocks | Parent issue's `shipped` status — content cannot be published until this gate passes |

## When This Gate Is Created

The Chief of Staff auto-creates this gate issue during its heartbeat when it detects an issue with the `public-facing` tag has moved to `done`. This gate is a child of the triggering issue's parent milestone.

Common triggers:
- Launch content created (blog posts, social media, email sequences)
- Landing page created or updated
- Marketing assets produced (ads, graphics, videos)
- User-facing email templates
- Pricing page changes
- Help center content with branded elements

## API Call to Create

```
POST /api/companies/{companyId}/issues
{
  "title": "Brand review: {triggeringIssueTitle}",
  "description": "Review {triggeringIssueTitle} for brand consistency before publication. See checklist in this issue's description. Linked issue: {triggeringIssueKey}.",
  "status": "backlog",
  "priority": "high",
  "tags": ["gate:brand-review", "review", "public-facing"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{milestoneId}",
  "assigneeAgentId": "{designLeadId}"
}
```

## Checklist

The Design Lead must verify each item. All items must pass for the gate to clear.

- [ ] **Visual identity:** Colors, typography, and spacing match the product's brand guidelines
- [ ] **Imagery:** All images, icons, and illustrations are from approved sources or custom-created per brand standards
- [ ] **Logo usage:** Product logo used correctly — correct version, minimum clear space, no distortion
- [ ] **Voice and tone:** Written copy matches the brand voice guidelines (confident but not arrogant, clear but not simplistic, helpful but not condescending)
- [ ] **Messaging hierarchy:** Headlines, subheadlines, and body copy align with the approved messaging hierarchy from GTM strategy
- [ ] **Claims substantiation:** No unapproved superlatives ("best", "fastest", "#1") — all claims are factual and provable
- [ ] **Accessibility:** Color contrast meets WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text), font sizes readable, alt text present on all images
- [ ] **Cross-material consistency:** Content does not contradict other live marketing materials, website copy, or product UI text
- [ ] **Product name formatting:** Product name correctly capitalized and formatted in every occurrence
- [ ] **CTA clarity:** Calls to action are clear, specific, and use approved action language

## Pass Criteria

All checklist items marked complete. The Design Lead posts a comment: "Brand review: APPROVED" with any notes on minor items that were corrected during review.

## Fail Criteria

One or more checklist items fail. The Design Lead posts a comment: "Brand review: CHANGES REQUIRED" with specific feedback for each failing item. The gate issue stays in `in_progress` until the content creator addresses all feedback and the Design Lead re-reviews.

## Escalation

If the content creator disputes a brand review decision, escalate to the Product Manager. The PM makes the final call, documented as a comment on the gate issue.
