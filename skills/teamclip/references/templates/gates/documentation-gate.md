# Quality Gate: Documentation Gate

## Gate Metadata

| Field | Value |
|---|---|
| Gate Name | Documentation Gate |
| Assigned To | CS Lead + Architect (dual review) |
| Trigger | Any milestone with the `user-facing` tag reaches `done` status |
| Blocks | Release notes publication and launch announcement |

## When This Gate Is Created

The Chief of Staff auto-creates this gate issue during its heartbeat when it detects a milestone tagged `user-facing` has moved to `done`. This ensures that no user-facing change ships without corresponding documentation.

Common triggers:
- Feature build milestone complete
- Major bug fix that changes user-visible behavior
- UI redesign or flow change
- New product launch milestone complete
- Pricing or packaging change that users need to understand

## API Call to Create

```
POST /api/companies/{companyId}/issues
{
  "title": "Documentation gate: {milestoneName}",
  "description": "Documentation review for {milestoneName}. CS Lead verifies user-facing documentation is complete and clear. Architect verifies technical accuracy. Both must approve. Linked milestone: {milestoneIssueKey}.",
  "status": "backlog",
  "priority": "high",
  "tags": ["gate:documentation", "documentation", "user-facing"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{milestoneId}",
  "assigneeAgentId": "{csLeadId}"
}
```

Note: The CS Lead is the primary assignee and owns the documentation. The Architect provides a technical accuracy review.

## Checklist

### CS Lead Review (content quality and completeness)

- [ ] **Getting started coverage:** New users can discover and use the new feature through documentation alone — no tribal knowledge required
- [ ] **Feature documentation:** Every user-visible feature or change is documented with: what it does, how to use it (step by step), when to use it, any limitations or known issues
- [ ] **Screenshots current:** All screenshots reflect the current UI — no outdated screenshots showing old designs or missing features
- [ ] **Screenshots annotated:** Complex screens have annotations (numbered callouts, highlighted areas) to guide the reader
- [ ] **FAQ updated:** Common questions about the new feature are anticipated and answered. Check support channels for early user questions if in beta.
- [ ] **Changelog entry:** Release notes entry written with: user-facing summary (not technical jargon), what's new, what's changed, what's fixed
- [ ] **Search optimization:** Page titles are descriptive and searchable. Users searching for their problem should find the right doc.
- [ ] **Clear language:** Documentation is jargon-free, uses active voice, and assumes no prior technical knowledge (unless targeting developers)
- [ ] **Navigation:** New docs are linked from the appropriate parent pages. Users can discover the docs through the help center navigation structure.
- [ ] **Version tagging:** Documentation is tagged with the version it applies to, so users on older versions are not confused

### Architect Review (technical accuracy)

- [ ] **Technical accuracy:** All technical claims, API examples, configuration instructions, and integration guides are correct and tested
- [ ] **API documentation:** If the feature includes API changes: endpoints, parameters, response schemas, error codes, and authentication requirements are documented and accurate
- [ ] **Code examples:** Code snippets compile, run correctly, and follow current conventions. No deprecated APIs or outdated patterns.
- [ ] **Edge cases disclosed:** Known limitations, unsupported configurations, and edge case behaviors are documented (not hidden)
- [ ] **Security guidance:** If the feature involves authentication, permissions, or data handling: security best practices are documented

## Pass Criteria

Both reviewers must approve:
- CS Lead posts: "Documentation gate — Content: APPROVED" with a link to the published documentation
- Architect posts: "Documentation gate — Technical: APPROVED" with confirmation of accuracy

Only when both approvals are posted does the CS Lead mark the gate as `done`.

## Fail Criteria

Either reviewer finds issues. They post: "Documentation gate: CHANGES REQUIRED" with:
- Specific issue (missing page, inaccurate statement, outdated screenshot)
- Location in the docs (page URL or section heading)
- Suggested correction or what needs to be added

The CS Lead makes corrections and requests re-review. Minor technical inaccuracies are corrected immediately. Missing documentation sections require a new writing pass.

## Documentation Deliverables

For each milestone, the documentation gate verifies these deliverables exist:

| Deliverable | Owner | Location |
|---|---|---|
| Feature documentation (how-to guides) | CS Lead | Help center / Confluence |
| API documentation (if applicable) | CS Lead + Architect | Help center / API docs |
| Changelog / release notes | CS Lead | Product changelog |
| Internal knowledge base update | CS Lead | Confluence |
| Updated FAQ entries | CS Lead | Help center FAQ |

## Escalation

If the Architect and CS Lead disagree on whether a technical detail needs to be exposed in user-facing docs (e.g., Architect wants to document an internal implementation detail, CS Lead thinks it confuses users), the Product Manager arbitrates based on the target audience's needs.
