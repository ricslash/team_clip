# Customer Success Process (TeamClip)

_Last updated: 2026-03-25_

Customer success lifecycle for any product post-launch. Continuous cycle updating the CS issue tree.

**Cardinal rule:** Close the feedback loop. Never gather feedback without acting on it. If users take the time to tell you something, they must see it mattered.

---

## Lifecycle

```
LISTEN --> DOCUMENT --> SUPPORT --> ENGAGE --> IMPROVE
   ^                                             |
   +---------------------------------------------+ (continuous)
```

| # | Phase | Purpose | Key Output |
|---|-------|---------|------------|
| 1 | **Listen** | Gather, categorize, synthesize user feedback | Feedback synthesis, theme rankings |
| 2 | **Document** | Write/update user-facing documentation | Help articles, user guides, changelogs |
| 3 | **Support** | Triage issues, resolve tickets, escalate bugs | Resolved tickets, FAQ updates |
| 4 | **Engage** | Community building, onboarding optimization | Community health metrics, onboarding flows |
| 5 | **Improve** | Churn analysis, recommend product changes | Improvement recommendations |

**Agent:** CS Lead (sole agent — absorbs cs-lead, docs-writer, help-center-manager, onboarding-designer, community-manager roles).

---

## Phase Details

### 1. LISTEN

Always running. Intensifies after releases, incidents, pricing changes, or churn spikes.

CS Lead creates milestone "Feedback Cycle: {product} {date}" with subtasks per feedback source.

**Sources:** Firebase analytics, support tickets (GitHub/Jira), community (Discord, Reddit, GitHub Discussions), app store reviews, NPS/CSAT surveys, in-app feedback, direct communications.

**Activities:** Monitor channels, extract themes (feature requests, bugs, UX confusion, pricing concerns, onboarding friction, competitive mentions), score by frequency/impact/churn risk, generate synthesis report.

**Storage:** `PUT /api/issues/{id}/documents/{feedback-synthesis|nps-report|theme-rankings}`

**Cross-team handoffs (Chief of Staff auto-creates):** PM (feature rankings, churn signals), CTO (bug reports), CMO (user language, testimonials), Design Lead/UX Director (UX pain points).

**Exit:** All sources reviewed, themes with frequency counts and user quotes, each scored for impact/churn risk.

### 2. DOCUMENT

**Trigger:** Feature shipped (Chief of Staff auto-creates doc task), docs found inaccurate, content gap from LISTEN/SUPPORT.

**Activities:** Read product context, identify content gaps, create/update docs (getting started, feature guides, FAQ, troubleshooting, changelog, API docs), optimize for search.

**Quality gates:** Architect (technical accuracy), Design Lead (brand consistency), UX Director (help center UX).

**Storage:** `PUT /api/issues/{id}/documents/{help-article|user-guide|faq|troubleshooting|changelog|release-notes}`

Publish to Confluence.

**Exit:** Every shipped feature has a help article, articles follow standards, gate issues resolved.

### 3. SUPPORT

Always active. CS Lead triages incoming issues.

**Flow:** Categorize (question/bug/feature request/account), prioritize (P0-P3), route (self-serve/CS resolve/engineering escalation). Bugs get full reproduction steps, Chief of Staff creates issues for QA/engineering. Feature requests logged for next LISTEN cycle. FAQ updated with new common questions.

**Storage:** `PUT /api/issues/{id}/documents/{reproduction-steps|support-patterns}`

### 4. ENGAGE

**Trigger:** Product launch, community milestone, onboarding metrics decline.

**Activities:**
1. Review activation funnel (drop-off points, time to "aha moment", A/B test flows)
2. Manage community (Discord, Reddit, GitHub Discussions, ProductHunt)
3. Identify advocacy (power users, testimonial candidates, beta testers)
4. Run engagement programs (welcome sequences, contributor recognition, early access)

**Storage:** `PUT /api/issues/{id}/documents/{onboarding-flow|community-health|advocacy-pipeline}`

### 5. IMPROVE

**Trigger:** Monthly cadence, churn spike, NPS drop, or competitive threat.

**Activities:** Analyze retention/churn by cohort, identify UX gaps, generate prioritized improvement recommendations backed by data. Chief of Staff creates handoff to PM.

**Storage:** `PUT /api/issues/{id}/documents/{churn-analysis|ux-gaps|competitive-comparison|recommendations}`

**Exit:** Churn analyzed with root causes, recommendations prioritized by retention impact, each backed by user data, handoff to PM created.

---

## Documentation Standards

1. **Jargon-free** — write for the least technical user
2. **Task-oriented** — titles are "How to X" not "About X"
3. **Step-by-step** — numbered instructions with expected outcomes
4. **Screenshots** — visual guides for multi-step processes (as issue attachments)
5. **Search-optimized** — match how users phrase questions
6. **Version-tagged** — tied to product version, updated per release
7. **Confluence-first** — drafts in issue documents, finals in Confluence

---

## Onboarding Framework

```
SIGNUP --> WELCOME --> ACTIVATE --> ENGAGE --> EXPAND
```

| Stage | Goal | Key Tactic |
|-------|------|-----------|
| Signup | Zero friction | Minimal fields, no CC for free tier |
| Welcome | Show value immediately | Welcome email <60s, pre-populated example |
| Activate | "Aha moment" in first session | Guide to single retention-correlated action |
| Engage | Build habit (days 1-7) | Progressive feature disclosure, timed emails |
| Expand | Advanced features, upsell | Contextual upsell at tier limits |

---

## Feedback Loop

```
User feedback --> CS gathers/categorizes --> Themes with frequency + impact
  --> Monthly report (issue document) --> Handoff to PM (Chief of Staff)
    --> PM prioritizes, decides --> CS communicates back to users (loop closed)
```

### Theme scoring
- **Frequency** (1-5): How many users mention this?
- **Impact** (1-5): Effect on retention/revenue?
- **Priority** = Frequency x Impact. 15+ = urgent, 10-14 = important, <10 = backlog.

### Closing the loop (non-negotiable)
For acted-on themes: changelog entry, community announcement, direct notification to requesting users, in-app message. For NOT addressed themes: explain why, suggest alternatives, thank users.

---

## Community Strategy

| Platform | Purpose | Response Time |
|----------|---------|--------------|
| Discord | Real-time support, feature discussion | < 4 hours |
| Reddit | Awareness, authentic engagement | < 24 hours |
| GitHub Discussions | Technical Q&A, feature requests | < 24 hours |
| ProductHunt | Launch engagement | < 12 hours (launch day: < 1h) |

**Health metrics (monthly):** Growth (net members), activity (messages/week, DAU/WAU), engagement (response rate, user-to-user help), sentiment, support deflection.

**Rules:** Respond to every post. Never be defensive. Credit users by name. No corporate speak. Share roadmap context.

---

## Cross-Team Interfaces

| Team | CS Sends | CS Receives |
|------|---------|------------|
| **Product** | Feedback reports, feature rankings, churn analysis | Feature priorities, roadmap, release timelines |
| **Engineering** | Bug reports with repro steps | Bug fixes, feature docs, API docs |
| **Design** | UX pain points, accessibility issues | Help center styling, onboarding designs |
| **Marketing** | Testimonials, community insights, user language | Launch comms, update announcements |
| **DevOps** | User-reported outages | Status page updates, incident comms |
| **Legal** | User data requests (GDPR), complaint escalations | Data handling procedures, required disclosures |

All handoffs mediated by Chief of Staff creating issues with context in documents.

---

## Anti-Patterns

- **Gathering feedback and doing nothing** — Fastest way to kill user trust
- **Writing docs nobody reads** — Zero search hits = unfindable or unnecessary
- **Corporate speak in community** — "We appreciate your patience" makes people cringe
- **Treating all feedback equally** — 1 loud user is not a trend; use frequency counts
- **Docs without version tags** — Always version-tag
- **Onboarding that shows everything** — Progressive disclosure, "aha moment" first
- **One-way communication** — "We shipped X because you asked" closes the loop
- **Standalone doc files** — Issue documents or Confluence only
