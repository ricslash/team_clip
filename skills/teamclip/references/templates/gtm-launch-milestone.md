# Issue Template: GTM Launch Milestone

## Overview

**Phase:** gtm-launch
**Created by:** CMO
**Trigger:** GTM strategy complete and product is nearing launch readiness
**Output:** Launched product with all content published, documentation live, legal approved, and launch announced

## Issue Tree

```
Launch: {productName}                                    [Milestone — unassigned]
├── Create launch content: {productName}                 [Task — Content & Growth Lead]
├── Landing page: {productName}                          [Task — Content & Growth Lead]
├── Brand review: {productName} launch assets            [Task — Design Lead]
├── Legal review: {productName} launch content           [Task — Legal Counsel]
├── Update docs for launch: {productName}                [Task — CS Lead]
├── Pricing implementation review: {productName}         [Task — Finance Analyst]
├── Launch readiness: {productName}                      [Task — Chief of Staff]
└── Launch announcement: {productName}                   [Task — Content & Growth Lead]
```

## Milestone Issue

| Field | Value |
|---|---|
| Title | `Launch: {productName}` |
| Description | Execute the launch plan for {productName}. This is a cross-team milestone requiring coordination between Marketing, Design, Legal, CS, Finance, and Engineering. All public-facing content must pass brand and legal review gates before publication. |
| Status | `backlog` |
| Priority | `critical` |
| Tags | `phase:gtm-launch`, `milestone`, `public-facing`, `user-facing` |
| Goal | Link to the product goal |
| Project | Link to the GTM project for this product |
| Assignee | None |
| Document: `launch-plan` | Full launch plan: timeline, channel plan, asset list, team responsibilities, success metrics |
| Document: `requirements` | Launch criteria: what must be true before announcing |

## Child Tasks

### 1. Create Launch Content

| Field | Value |
|---|---|
| Title | `Create launch content: {productName}` |
| Description | Produce all launch content per the channel plan in the `launch-plan` document. Deliverables: (1) Launch blog post — product announcement with positioning, key features, and CTA. Minimum 1500 words, SEO-optimized for primary launch keyword. (2) Social media posts — Twitter/X thread (5-7 tweets), LinkedIn post, Reddit posts for 2-3 relevant subreddits (adapted to each subreddit's norms). (3) Email announcement — to existing users and waitlist. Subject line A/B variants. (4) Product Hunt listing draft — tagline, description, first comment, maker comment. Use the campaign-execute skill for formatting and quality checks. All content blocked on brand review and legal review gates. |
| Tags | `phase:gtm-launch`, `content`, `public-facing` |
| Assignee | Content & Growth Lead |

**Acceptance criteria:**
- Blog post written, SEO-optimized, minimum 1500 words
- Social posts created for all planned platforms, adapted to platform norms
- Email announcement drafted with A/B subject lines
- Product Hunt listing complete (if applicable)
- All content self-reviewed against campaign-execute quality checklist
- Content submitted for brand review and legal review

### 2. Landing Page

| Field | Value |
|---|---|
| Title | `Landing page: {productName}` |
| Description | Create or update the product landing page with launch messaging. Structure: hero section (headline, subheadline, CTA, social proof), problem section (3 pain points in user language from research), solution section (3-4 feature highlights with benefit-oriented headers), social proof section (testimonials, logos, metrics), pricing section (if applicable — must pass pricing gate), FAQ section (5-8 objection-handling questions), final CTA with risk reversal. Must pass brand review and UX review gates. |
| Tags | `phase:gtm-launch`, `content`, `public-facing`, `user-facing` |
| Assignee | Content & Growth Lead |

**Acceptance criteria:**
- All landing page sections complete per structure
- Messaging aligns with approved positioning from GTM strategy
- Mobile responsive (verified at 3 breakpoints)
- Page load time under 3 seconds
- All CTAs link to correct signup/purchase flows
- SEO meta tags in place (title, description, OG tags)
- Submitted for brand review and UX review

### 3. Brand Review: Launch Assets

| Field | Value |
|---|---|
| Title | `Brand review: {productName} launch assets` |
| Description | Review all launch content and landing page for brand consistency. Checklist: visual elements match brand guidelines (colors, typography, spacing, imagery), copy matches brand voice and tone, messaging aligns with approved messaging hierarchy from GTM strategy, no unapproved claims or superlatives, accessibility standards met (contrast ratios, font sizes, alt text), consistent with other live materials across products. |
| Tags | `phase:gtm-launch`, `review`, `public-facing` |
| Assignee | Design Lead |

**Acceptance criteria:**
- Every launch asset reviewed against brand checklist
- Written verdict per asset: approved, approved with changes, or rejected with specifics
- If changes requested: specific feedback provided (not "make it better")
- Final approval documented on the issue after revisions

### 4. Legal Review: Launch Content

| Field | Value |
|---|---|
| Title | `Legal review: {productName} launch content` |
| Description | Review all public-facing launch content for legal compliance. Checklist: no misleading claims or unsubstantiated superlatives, required disclaimers present where applicable, privacy policy covers any data collection implied by marketing (signup forms, analytics, cookies), terms of service covers product functionality as described, CAN-SPAM compliance for email content (unsubscribe mechanism, physical address, honest subject lines), advertising platform policies followed for any paid promotion, competitive claims are factual and substantiated. |
| Tags | `phase:gtm-launch`, `review`, `public-facing`, `legal` |
| Assignee | Legal Counsel |

**Acceptance criteria:**
- Every public-facing asset reviewed against legal checklist
- Compliance issues flagged with specific remediation
- ToS and privacy policy updates drafted if needed
- Final approval documented on the issue

### 5. Update Documentation

| Field | Value |
|---|---|
| Title | `Update docs for launch: {productName}` |
| Description | Create or update all user-facing documentation for launch. Deliverables: (1) Getting started guide for new users, (2) Feature documentation for all launch features, (3) FAQ covering expected user questions (coordinate with CS for common questions), (4) Changelog entry for the release, (5) API documentation if applicable. Publish to help center and Confluence. Must pass documentation gate (technical accuracy review by Architect). |
| Tags | `phase:gtm-launch`, `documentation`, `user-facing` |
| Assignee | CS Lead |

**Acceptance criteria:**
- Getting started guide covers signup through first value moment
- All launch features documented with screenshots
- FAQ addresses minimum 10 anticipated questions
- Changelog entry published
- Technical accuracy verified by Architect
- Published to help center before launch announcement

### 6. Pricing Implementation Review

| Field | Value |
|---|---|
| Title | `Pricing review: {productName}` |
| Description | If the launch includes pricing (new product launch or pricing change): verify pricing implementation matches the approved pricing model. Check: tier names and descriptions match marketing materials, price points match financial model, free tier limits are correctly enforced, upgrade/downgrade flows work correctly, Stripe products/prices are correctly configured, billing edge cases tested (proration, cancellation, refund). Coordinate with Full-Stack Engineer and Finance Analyst. |
| Tags | `phase:gtm-launch`, `pricing` |
| Assignee | Finance Analyst |

**Acceptance criteria:**
- Pricing implementation matches approved financial model
- All tiers functional in production (or staging for pre-launch)
- Billing edge cases tested and documented
- Pricing page matches landing page pricing section exactly
- If no pricing component in this launch: mark as N/A and close

### 7. Launch Readiness Check

| Field | Value |
|---|---|
| Title | `Launch readiness: {productName}` |
| Description | Final cross-team verification before the launch announcement goes live. This is the last gate. Verify: (1) All content assets approved by brand review and legal review, (2) Landing page live and tested, (3) Documentation published and accessible, (4) Legal sign-offs complete — ToS and privacy policy updated if needed, (5) Pricing verified and billing tested (if applicable), (6) Monitoring and alerting active for increased traffic, (7) Support team briefed on launch talking points and known issues, (8) Rollback plan in place (how to pull the launch announcement if critical issues emerge), (9) All team leads have confirmed readiness on their respective issues. |
| Tags | `phase:gtm-launch`, `gate` |
| Assignee | Chief of Staff |

**Acceptance criteria:**
- Every item on the readiness checklist verified with evidence (link to approved issue, screenshot, confirmation comment)
- All blocking quality gates have passed
- Discord notification sent to Eric: "Launch readiness confirmed for {productName}"
- Green light given for launch announcement

### 8. Launch Announcement

| Field | Value |
|---|---|
| Title | `Launch announcement: {productName}` |
| Description | Execute the launch announcement per the timeline in the `launch-plan` document. Sequence: (1) Publish blog post, (2) Send email announcement, (3) Post to social media (Twitter/X first, then LinkedIn, then Reddit), (4) Submit to Product Hunt (if applicable — coordinate timing with PH best practices), (5) Monitor all channels for the first 24 hours and respond to every comment/question. This task is only unblocked after launch readiness passes. |
| Tags | `phase:gtm-launch`, `content`, `public-facing` |
| Assignee | Content & Growth Lead |

**Acceptance criteria:**
- All launch content published per the timeline
- UTM tracking parameters on all links
- Comments monitored and responded to within 2 hours for first 24 hours
- Launch metrics tracked: page views, signups, social engagement, email open/click rates
- Day-1 metrics report posted as a comment on this issue

## Quality Gates Triggered

When this milestone is in progress, the Chief of Staff ensures these gates exist:

| Gate | Assigned To | Blocks |
|---|---|---|
| Brand review gate | Design Lead | Content publication |
| Legal review gate | Legal Counsel | Content publication |
| UX review gate | UX Director | Landing page publication |
| Pricing gate | Finance + PM + Legal | Pricing page publication (if applicable) |
| Documentation gate | CS Lead + Architect | Launch announcement |
| Launch readiness gate | Chief of Staff | Launch announcement |

## Completion Criteria

The launch milestone is complete when:
1. All content published on all planned channels
2. Documentation live and accessible
3. All quality gates passed
4. Day-1 metrics collected and reported
5. Post-launch monitoring active

## Next Step

After launch, the CMO creates a **gtm-measure** milestone to track performance and optimize. The Chief of Staff sends a milestone-complete Discord notification to Eric with day-1 metrics.
