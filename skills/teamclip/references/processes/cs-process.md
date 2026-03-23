# Customer Success Process — Full Lifecycle Reference (TeamClip)

_Last updated: 2026-03-20_
_Adapted from: Team workflow/cs-process.md_

This is the complete customer success lifecycle. It applies to any product post-launch. Every phase produces deliverables, updates the CS issue tree, and has defined exit criteria before moving forward.

**The cardinal rule:** Close the feedback loop. Never gather feedback without acting on it. If users take the time to tell you something, they must see that it mattered — or they stop talking.

---

## The Full Lifecycle

```
LISTEN --> DOCUMENT --> SUPPORT --> ENGAGE --> IMPROVE
   ^                                             |
   +---------------------------------------------+ (continuous)
```

| # | Phase | TeamClip Pattern | Purpose | Key Output |
|---|-------|------------------|---------|------------|
| 1 | **Listen** | CS Lead creates milestone "Feedback Cycle: {product} {date}" via Paperclip API with subtasks for each feedback source | Gather, categorize, and synthesize user feedback | Feedback synthesis report, theme rankings |
| 2 | **Document** | CS Lead creates documentation tasks, assigned to self | Write/update user-facing documentation | Help center articles, user guides, changelogs |
| 3 | **Support** | CS Lead triages incoming issues, creates escalation issues for other teams | Triage issues, resolve tickets, escalate bugs | Resolved tickets, escalation reports, FAQ updates |
| 4 | **Engage** | CS Lead creates engagement milestone with community and onboarding subtasks | Community building, onboarding optimization, advocacy | Community health metrics, onboarding flows |
| 5 | **Improve** | CS Lead creates improvement recommendation issues with cross-team handoffs | Analyze churn, identify gaps, recommend product changes | Improvement recommendations, churn analysis |

The cycle is continuous. LISTEN feeds DOCUMENT (new features need docs). SUPPORT reveals gaps in DOCUMENT. ENGAGE surfaces what LISTEN should track. IMPROVE drives changes that restart the whole cycle.

---

## Phase 1: LISTEN

**Trigger:** Always running. Intensifies after releases, incidents, pricing changes, or when churn spikes.

**TeamClip pattern:** CS Lead creates milestone "Feedback Cycle: {product} {date}" via `POST /api/companies/{id}/issues` with subtasks for each feedback source and channel.

**What happens:**
1. CS Lead identifies all feedback sources for the product:
   - Firebase analytics and user behavior data
   - Support tickets (GitHub Issues, Jira)
   - Community channels (Discord, Reddit, GitHub Discussions)
   - App store / marketplace reviews
   - NPS/CSAT survey responses
   - In-app feedback widgets
   - Direct user communications (email, calls)
2. CS Lead monitors real-time channels (Discord, Reddit, forums — absorbs old community-manager role)
3. CS Lead extracts themes from raw feedback:
   - Feature requests (with frequency counts)
   - Bug reports (with reproduction steps)
   - UX confusion points (with user quotes)
   - Pricing/value concerns
   - Onboarding friction
   - Competitive mentions (what alternatives users reference)
4. CS Lead scores each theme by frequency, impact, and churn risk
5. CS Lead generates the feedback synthesis report

**Agent:** **CS Lead** (sole CS agent — absorbs old cs-lead, docs-writer, help-center-manager, onboarding-designer, and community-manager roles). Docs + support + onboarding are one lifecycle.

**Deliverable storage:**
- Feedback synthesis report: `PUT /api/issues/{feedback-milestone-id}/documents/feedback-synthesis`
- NPS/CSAT report: `PUT /api/issues/{feedback-milestone-id}/documents/nps-report`
- Theme rankings with verbatim user quotes: `PUT /api/issues/{feedback-milestone-id}/documents/theme-rankings`
- Raw data exports: `POST /api/issues/{id}/attachments` (spreadsheets)

**Cross-team handoffs triggered (Chief of Staff auto-creates issues):**
- Product Manager: feature request rankings, churn signals, priority recommendations
- CTO / Full-Stack Engineer: bug reports with reproduction steps, performance complaints
- CMO / Content & Growth Lead: user language for messaging, testimonial candidates, competitive intel
- Design Lead / UX Director: UX pain points, accessibility issues, user confusion patterns

**Exit criteria:**
- [ ] All feedback sources reviewed (not just the easy ones)
- [ ] Themes extracted with frequency counts and user quotes
- [ ] Each theme scored for impact and churn risk
- [ ] Report stored as issue document with date
- [ ] Handoff issues created by Chief of Staff for the right teams
- [ ] Previous cycle's open items addressed or carried forward

---

## Phase 2: DOCUMENT

**Trigger:** New feature shipped (Chief of Staff creates documentation issue from engineering milestone completion), existing docs found to be inaccurate, content gap identified in LISTEN or SUPPORT, user confusion pattern detected.

**TeamClip pattern:** CS Lead creates documentation subtasks. For feature-shipped triggers, Chief of Staff auto-creates "Write {feature} documentation" issue assigned to CS Lead with the engineering milestone's requirements document linked.

**What happens:**
1. CS Lead reads product context (project description, source code, engineering issue documents)
2. CS Lead identifies content gaps:
   - New features without documentation
   - Existing articles with outdated information
   - Common support questions without matching articles
   - Search queries with no results (content gaps)
3. CS Lead creates or updates documentation:
   - Getting started guides for new users
   - Feature guides for specific functionality
   - FAQ entries for common questions
   - Troubleshooting guides for known issues
   - Changelog entries for recent releases
   - API documentation for developers
4. CS Lead optimizes for search:
   - Titles match how users phrase questions
   - Keywords included naturally
   - Cross-links between related articles
   - Category structure makes browsing intuitive
5. Quality gate: Chief of Staff auto-creates blocking issues for:
   - Architect (technical accuracy review)
   - Design Lead (brand consistency review)
   - UX Director (help center UX review)
6. Publish to Confluence

**Deliverable storage:**
- Help center articles: `PUT /api/issues/{doc-task-id}/documents/help-article`
- User guides: `PUT /api/issues/{doc-task-id}/documents/user-guide`
- FAQ: `PUT /api/issues/{doc-task-id}/documents/faq`
- Troubleshooting: `PUT /api/issues/{doc-task-id}/documents/troubleshooting`
- Changelog: `PUT /api/issues/{doc-task-id}/documents/changelog`
- Release notes: `PUT /api/issues/{doc-task-id}/documents/release-notes`

**Exit criteria:**
- [ ] Every shipped feature has a corresponding help article
- [ ] All articles follow documentation standards (jargon-free, task-oriented, search-optimized, version-tagged)
- [ ] Technical accuracy confirmed by Architect (gate issue resolved)
- [ ] Brand consistency confirmed by Design Lead (gate issue resolved)
- [ ] Published to Confluence
- [ ] Search optimization verified (titles match user query patterns)

---

## Phase 3: SUPPORT

**Trigger:** Always active. Users have questions, hit bugs, or need help.

**TeamClip pattern:** CS Lead triages incoming support issues. Bug reports become new issues assigned to QA Engineer or Full-Stack Engineer via Chief of Staff. Feature requests are logged as issue comments on the feedback milestone.

**What happens:**
1. CS Lead triages incoming issues:
   - Categorize: question, bug, feature request, account issue
   - Priority: P0 (user blocked), P1 (degraded experience), P2 (inconvenience), P3 (nice to know)
   - Route: self-serve (point to docs), CS resolve, Engineering escalation
2. For questions: point to existing documentation. If no doc exists, answer and create the doc.
3. For bugs: reproduce, document steps, Chief of Staff creates issue assigned to QA Engineer with full context.
4. For feature requests: log in feedback system, acknowledge to user, add to next LISTEN cycle.
5. CS Lead updates FAQ with any new common question.
6. CS Lead tracks support patterns to identify content gaps.

**Deliverable storage:**
- Bug escalation reports: `PUT /api/issues/{bug-issue-id}/documents/reproduction-steps`
- FAQ updates: added to the documentation milestone's FAQ document
- Support pattern analysis: `PUT /api/issues/{id}/documents/support-patterns`

**Exit criteria:**
- [ ] Every ticket resolved or escalated with clear owner (issue assigned in Paperclip)
- [ ] Bug reports include reproduction steps, environment, and expected vs actual behavior
- [ ] New common questions added to FAQ
- [ ] Support patterns logged for next LISTEN cycle
- [ ] Users received a response (never leave users hanging)

---

## Phase 4: ENGAGE

**Trigger:** Product launch, community milestone, onboarding metrics decline, expansion opportunity identified.

**TeamClip pattern:** CS Lead creates engagement milestone with subtasks for onboarding optimization and community health.

**What happens:**
1. CS Lead reviews activation funnel:
   - Where do users drop off?
   - How long to "aha moment"?
   - Which onboarding steps have lowest completion?
   - A/B test welcome flows and tutorial sequences
2. CS Lead builds and manages community (absorbs old community-manager role):
   - Discord: real-time support, feature discussions, power user recognition
   - Reddit: authentic engagement, product awareness, feedback collection
   - GitHub Discussions: technical Q&A, feature requests, bug triage
   - Product Hunt: launch engagement, ongoing community
3. CS Lead identifies advocacy opportunities:
   - Power users who could become ambassadors
   - Testimonial candidates
   - Case study subjects
   - Beta testers for new features
4. CS Lead runs engagement programs:
   - Welcome sequences for new community members
   - Recognition for top contributors
   - Early access programs for engaged users
   - Feedback sessions (AMAs, surveys, interviews)

**Deliverable storage:**
- Onboarding flow spec: `PUT /api/issues/{engage-milestone-id}/documents/onboarding-flow`
- Community health report: `PUT /api/issues/{engage-milestone-id}/documents/community-health`
- Advocacy pipeline: `PUT /api/issues/{engage-milestone-id}/documents/advocacy-pipeline`
- A/B test results: `PUT /api/issues/{id}/documents/ab-test-results` (per experiment subtask)

**Exit criteria:**
- [ ] Activation funnel measured with drop-off points identified
- [ ] Community channels active with response time targets met
- [ ] Onboarding flow documented and optimized
- [ ] Community health metrics tracked (members, active users, response time, sentiment)
- [ ] Advocacy candidates identified and contacted

---

## Phase 5: IMPROVE

**Trigger:** Monthly cadence, or triggered by churn spike, NPS drop, or competitive threat.

**TeamClip pattern:** CS Lead creates improvement recommendation issues. Chief of Staff auto-creates handoff issues to Product Manager with full context.

**What happens:**
1. CS Lead analyzes retention and churn:
   - Churn rate by cohort, plan, feature usage
   - Churn reasons (from exit surveys, support tickets, cancellation flows)
   - At-risk accounts (declining usage, support complaints, competitive mentions)
2. CS Lead identifies UX gaps:
   - Features users ask for that competitors have
   - Workflows that generate disproportionate support volume
   - Onboarding steps with high abandonment
3. CS Lead generates improvement recommendations:
   - Prioritized by impact on retention and expansion
   - Backed by data (user quotes, frequency, churn correlation)
   - Mapped to product roadmap where applicable
4. Chief of Staff auto-creates handoff issue to Product Manager with full context in issue documents

**Deliverable storage:**
- Churn analysis: `PUT /api/issues/{improve-milestone-id}/documents/churn-analysis`
- UX gap report: `PUT /api/issues/{improve-milestone-id}/documents/ux-gaps`
- Competitive feature comparison: `PUT /api/issues/{improve-milestone-id}/documents/competitive-comparison`
- Improvement recommendations: `PUT /api/issues/{improve-milestone-id}/documents/recommendations`

**Exit criteria:**
- [ ] Churn analyzed with actionable root causes (not just "users left")
- [ ] Recommendations prioritized by retention impact
- [ ] Each recommendation backed by user data (quotes, frequency, correlation)
- [ ] Handoff issue to Product Manager created with full context
- [ ] Previous cycle's recommendations tracked (were they acted on?)

---

## Documentation Standards

All user-facing documentation follows these rules. No exceptions.

### Writing rules
1. **Jargon-free language** — write for the least technical user. If you must use a technical term, define it inline.
2. **Task-oriented structure** — titles are "How to X" not "About X". Users come to DO something.
3. **Step-by-step numbered instructions** — every multi-step process gets numbered steps with expected outcomes.
4. **Screenshots with annotations** — visual guides for every process with more than 2 steps. Stored as issue attachments.
5. **Search-optimized titles** — match how users actually phrase questions. Use their language, not internal jargon.
6. **Version-tagged** — every article tied to product version. Updated with every release.
7. **Confluence-first** — working drafts stored as issue documents, finals published to Confluence.

### Article structure
```
# How to [Task] (version X.Y)

Brief description of what this achieves (1-2 sentences).

## Before you start
- Prerequisites listed
- Required permissions or plan tier

## Steps
1. Step one -- what to do and what you should see
2. Step two -- ...
3. Step three -- ...

## What happens next
Expected outcome after completing the steps.

## Troubleshooting
Common issues and their solutions.

## Related articles
Links to related documentation.
```

### Documentation types

| Type | Purpose | Update Trigger |
|------|---------|----------------|
| Getting started guide | First-time user onboarding | Major UX change |
| Feature guides | Deep dive on each feature | Feature release |
| FAQ | Common questions and answers | Ongoing (from support patterns) |
| Troubleshooting | Known issues and solutions | Bug discovery / resolution |
| API documentation | Developer integration guide | API change |
| Changelog | What shipped and when | Every release |
| Release notes | User-friendly summary | Every release |

---

## Onboarding Framework

```
SIGNUP --> WELCOME --> ACTIVATE --> ENGAGE --> EXPAND
```

### Stage 1: SIGNUP
**Goal:** Reduce friction to zero.
**Tactics:**
- Minimize form fields (email + password or SSO only)
- No credit card required for free tier
- Instant account creation (no email verification gate before first use)
**Metrics:** Signup completion rate, time to complete signup

### Stage 2: WELCOME
**Goal:** Set expectations, show value immediately.
**Tactics:**
- Welcome email within 60 seconds of signup
- In-app welcome screen with personalized path (role-based)
- Show what the product does with a pre-populated example or demo data
- Set clear expectation: "In the next 5 minutes, you'll [achieve X]"
**Metrics:** Welcome email open rate, in-app welcome completion rate

### Stage 3: ACTIVATE
**Goal:** Get user to "aha moment" within first session.
**Tactics:**
- Identify the single action that correlates with retention (the "aha moment")
- Guide user to that action with minimal steps
- Celebrate completion (confetti, success message, "you're set up!")
- Remove all distractions until activation is complete
**Metrics:** Activation rate (feature X used within 24h), time to activate

### Stage 4: ENGAGE
**Goal:** Build habit through first 7 days.
**Tactics:**
- Day 1: follow-up email with "what you can do next"
- Day 3: tip email based on what they haven't tried
- Day 7: check-in email, invite to community
- In-app: progressive feature disclosure (don't overwhelm, reveal as they're ready)
- Push notifications / emails for relevant triggers (not spam)
**Metrics:** D1/D7 retention, session frequency, feature breadth

### Stage 5: EXPAND
**Goal:** Introduce advanced features, upsell where appropriate.
**Tactics:**
- Contextual upsell (show premium feature when user hits free tier limit)
- "Did you know?" in-app tips for advanced features
- Power user community invitation
- Case studies from similar users who upgraded
**Metrics:** Feature adoption rate, upgrade rate, expansion revenue

---

## Feedback Loop Process

CS is the bridge between users and product decisions. The loop must be closed — every time.

```
User feedback (support, community, NPS, in-app)
  --> CS Lead gathers and categorizes
    --> CS Lead synthesizes into themes with frequency + impact scores
      --> Monthly feedback report stored as issue document
        --> Chief of Staff creates handoff issue to Product Manager
          --> Product Manager prioritizes and responds with decisions
            --> CS Lead communicates decisions back to users
              --> Users see their feedback mattered (loop closed)
```

### Feedback sources

| Source | Collection Method | Frequency |
|--------|-------------------|-----------|
| Support tickets | Jira / GitHub Issues | Continuous |
| Community (Discord, Reddit) | Manual monitoring + Firecrawl | Daily |
| NPS/CSAT surveys | Scheduled surveys | Monthly/Quarterly |
| In-app feedback | Feedback widget triggers | Continuous |
| App store reviews | Firecrawl scraping | Weekly |
| User interviews | Scheduled calls | Monthly (select users) |
| Churn exit surveys | Cancellation flow | On cancellation |

### Theme scoring

Each feedback theme gets scored on two axes:

| Dimension | Scale | How to Assess |
|-----------|-------|---------------|
| **Frequency** | 1-5 | How many users mention this? (1 = rare, 5 = everyone) |
| **Impact** | 1-5 | Effect on retention/revenue? (1 = cosmetic, 5 = churn driver) |

Priority = Frequency x Impact. Themes scoring 15+ are urgent. Themes scoring 10-14 are important. Below 10 is backlog.

### Closing the loop

This is non-negotiable. For every feedback theme that gets acted on:
1. **Changelog entry** — document what changed and why
2. **Community announcement** — post in relevant channels
3. **Direct notification** — email users who specifically requested the feature
4. **In-app notification** — contextual "We heard you" message
5. **Update the feedback report** — mark theme as "Addressed" with date and link in issue document

If a theme is NOT going to be addressed, still close the loop:
- Explain why (technical limitation, strategic misalignment, low demand)
- Suggest alternatives or workarounds
- Thank users for the feedback

---

## Community Strategy

### Platform purposes

| Platform | Purpose | Tone | Response Time Target |
|----------|---------|------|---------------------|
| **Discord** | Real-time support, feature discussion, power user community | Casual, helpful, fast | < 4 hours |
| **Reddit** | Product awareness, authentic engagement, long-form feedback | Authentic (never corporate), value-adding | < 24 hours |
| **GitHub Discussions** | Technical Q&A, feature requests, bug reports | Technical, precise, grateful | < 24 hours |
| **Product Hunt** | Launch engagement, ongoing community updates | Enthusiastic, transparent | < 12 hours (launch day: < 1 hour) |
| **In-app feedback** | Contextual feedback at point of friction | Concise, action-oriented | Async (batched weekly) |

### Community health metrics

Track monthly:
- **Growth:** New members, net growth rate
- **Activity:** Messages/posts per week, active users (DAU/WAU/MAU)
- **Engagement:** Response rate, average thread depth, user-to-user help ratio
- **Sentiment:** Positive/negative/neutral ratio, trending topics
- **Support deflection:** Questions answered by community vs. CS team

### Community rules (universal)

1. Respond to every post (even if just to acknowledge)
2. Never be defensive about product limitations — own them
3. Credit users by name when their feedback leads to changes
4. No corporate speak. Write like a human.
5. Share roadmap context when possible (builds trust)
6. Elevate community contributors (badges, early access, shoutouts)

---

## Interfaces with Other Teams

| Team | CS Sends | CS Receives |
|------|---------|------------|
| **Product** | Feedback reports (via handoff issues), feature request rankings, churn analysis, NPS data | Feature priorities, roadmap updates, release timelines |
| **Engineering** | Bug reports with reproduction steps (via escalation issues), user-reported issues | Bug fixes, feature documentation (via engineering milestone docs), API docs, technical answers |
| **Design** | UX pain points, accessibility issues, user confusion reports | Help center styling, documentation templates, onboarding flow designs |
| **Marketing** | Testimonials, case study candidates, community insights, user language | Launch communications, update announcements, content for users |
| **DevOps** | User-reported outages, performance complaints | Status page updates, incident communications, maintenance schedules |
| **Legal** | User data requests (GDPR), complaint escalations | Data handling procedures, required disclosures |

All cross-team handoffs are mediated by Chief of Staff creating issues with full context in issue documents.

---

## Anti-Patterns

- **Gathering feedback and doing nothing with it** — The fastest way to kill user trust. If you ask, you must act (or explain why you won't).
- **Writing docs nobody reads** — If your search analytics show zero hits, the article is either unfindable or unnecessary. Fix or delete.
- **Corporate speak in community channels** — "We appreciate your patience as we work to enhance your experience" makes people cringe. Say "We're fixing this, here's the timeline."
- **Treating all feedback equally** — 1 loud user is not a trend. 50 quiet users mentioning the same thing is. Use frequency counts, not volume.
- **Docs without version tags** — If users can't tell whether an article applies to their version, the article is harmful. Always version-tag.
- **Ignoring competitor help centers** — Your competitors' docs are a free benchmark. Read them. Learn from what they do well.
- **Onboarding that shows everything at once** — Progressive disclosure. Get to the "aha moment" first. Everything else can wait.
- **Waiting for scheduled reports to flag urgent issues** — Churn spikes and outage complaints don't wait for monthly cycles. Escalate immediately via Chief of Staff.
- **One-way communication** — "We shipped X" without "because you asked for it" misses the point. Credit the users who drove the change.
- **Measuring community by member count alone** — 10,000 silent members is worse than 200 active ones. Track engagement, not headcount.
- **Writing docs after launch day** — Documentation should ship WITH the feature, not after. Chief of Staff creates doc tasks from engineering milestone completion.
- **Standalone doc files** — All documentation deliverables belong as issue documents or published to Confluence. Not orphaned files.
- **Undated deliverables** — If it doesn't have a date, you don't know if it's current. Date everything.
