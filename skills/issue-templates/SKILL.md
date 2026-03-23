---
name: issue-templates
description: Create structured issue trees (milestone + child tasks) for each workflow phase. Used by managers (CTO, PM, CMO) to decompose work into assignable, trackable Paperclip issues with documents and tags.
---

# Issue Templates Skill

## When to Use

Managers invoke this skill when transitioning a product goal into executable work. Each template maps to a Team workflow phase and creates a milestone issue with pre-structured child tasks, assignees, tags, and document keys.

## API Patterns

All issues are created via the Paperclip API:

```
POST /api/companies/{companyId}/issues
Content-Type: application/json

{
  "title": "...",
  "description": "...",
  "status": "backlog",
  "priority": "medium",
  "tags": ["..."],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": "{parentIssueId}",          // null for milestones
  "assigneeAgentId": "{agentId}"           // null for milestones (owned by manager)
}
```

After creating an issue, attach structured documents:

```
PUT /api/issues/{issueId}/documents/{key}
Content-Type: application/json

{
  "content": "..."
}
```

Document keys used across templates:
- `requirements` — Full spec, acceptance criteria, scope definition
- `design` — UI/UX specifications, wireframes description, component list
- `test-plan` — Test strategy, test cases, coverage requirements
- `research` — Research findings, evidence, recommendations
- `launch-plan` — Launch timeline, channel plan, success metrics

## Templates

---

### ideate

**Invoked by:** Product Manager
**Purpose:** Transform a raw idea into a validated technical PRD with feasibility assessment.
**Creates:** 1 milestone + 4 child tasks

**Milestone:**
```json
{
  "title": "Ideation: {featureName}",
  "description": "Validate the idea for {featureName}. Produce a technical PRD, assess feasibility, and get architecture sign-off before moving to decomposition.",
  "status": "backlog",
  "priority": "high",
  "tags": ["phase:ideate", "milestone"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": null,
  "assigneeAgentId": null
}
```
Document: `requirements` — "Idea brief: {ideaSummary}. Success criteria: {criteria}. Target users: {users}."

**Child tasks:**

1. **Write PRD**
```json
{
  "title": "Write PRD: {featureName}",
  "description": "Draft a complete Product Requirements Document covering user stories, acceptance criteria, scope boundaries, and success metrics. Store the full PRD in the 'requirements' document key.",
  "tags": ["phase:ideate", "prd"],
  "assigneeAgentId": "{productManagerId}"
}
```
Document key: `requirements`

2. **Technical feasibility assessment**
```json
{
  "title": "Technical feasibility: {featureName}",
  "description": "Assess technical feasibility. Identify: (1) required stack changes, (2) estimated complexity (S/M/L/XL), (3) risks and unknowns, (4) dependencies on existing systems. Write findings to 'requirements' document.",
  "tags": ["phase:ideate", "technical"],
  "assigneeAgentId": "{architectId}"
}
```
Document key: `requirements`

3. **Architecture review**
```json
{
  "title": "Architecture review: {featureName}",
  "description": "Review the PRD and feasibility assessment. Approve, request changes, or flag blockers. Ensure the feature fits the existing system architecture and does not introduce unnecessary complexity.",
  "tags": ["phase:ideate", "review", "code"],
  "assigneeAgentId": "{ctoId}"
}
```

4. **Competitive analysis**
```json
{
  "title": "Competitive analysis: {featureName}",
  "description": "Research how competitors implement similar functionality. Identify differentiation opportunities and table-stakes requirements. Store findings in 'research' document.",
  "tags": ["phase:ideate", "research"],
  "assigneeAgentId": "{marketResearcherId}"
}
```
Document key: `research`

---

### decompose

**Invoked by:** Product Manager (after ideation milestone completes)
**Purpose:** Break an approved PRD into a prioritized backlog of implementable tasks with estimates.
**Creates:** 1 milestone + 3 child tasks

**Milestone:**
```json
{
  "title": "Planning: {featureName}",
  "description": "Decompose the approved PRD for {featureName} into milestones, tasks, and subtasks. Produce a prioritized backlog ready for build.",
  "status": "backlog",
  "priority": "high",
  "tags": ["phase:decompose", "milestone"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": null,
  "assigneeAgentId": null
}
```

**Child tasks:**

1. **Create backlog**
```json
{
  "title": "Create backlog: {featureName}",
  "description": "Break the PRD into implementable tasks. Each task must have: clear title, description with enough context for the assignee to work independently, acceptance criteria, size estimate (S/M/L/XL), and suggested assignee. Group tasks into logical milestones.",
  "tags": ["phase:decompose", "backlog"],
  "assigneeAgentId": "{productManagerId}"
}
```
Document key: `requirements`

2. **Technical task breakdown**
```json
{
  "title": "Technical breakdown: {featureName}",
  "description": "Review the PM's backlog. Add technical subtasks where needed (database migrations, API changes, infrastructure requirements). Flag tasks that need architecture decisions. Assign complexity estimates.",
  "tags": ["phase:decompose", "technical"],
  "assigneeAgentId": "{architectId}"
}
```

3. **Design requirements identification**
```json
{
  "title": "Identify design requirements: {featureName}",
  "description": "Review the backlog and flag tasks that need design work. For each, specify: (1) what design deliverable is needed (mockup, component spec, token update), (2) design constraints, (3) which existing components can be reused.",
  "tags": ["phase:decompose", "design"],
  "assigneeAgentId": "{designLeadId}"
}
```
Document key: `design`

---

### build

**Invoked by:** CTO (after decomposition milestone completes)
**Purpose:** Execute implementation with code, tests, reviews, and UX validation.
**Creates:** 1 milestone + 5 child tasks

**Milestone:**
```json
{
  "title": "Build: {featureName}",
  "description": "Implement {featureName} per the approved backlog. All code reviewed, tests passing, UX validated, deploy-ready.",
  "status": "backlog",
  "priority": "high",
  "tags": ["phase:build", "milestone", "code", "user-facing"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": null,
  "assigneeAgentId": null
}
```

**Child tasks:**

1. **Implementation**
```json
{
  "title": "Implement: {featureName}",
  "description": "Build the feature per the technical breakdown and PRD. Follow the project's CLAUDE.md conventions. Create PR(s) with descriptive titles and linked issue keys. No `any` types. Strict TypeScript.",
  "tags": ["phase:build", "code", "implementation"],
  "assigneeAgentId": "{fullStackEngineerId}"
}
```
Document key: `requirements` (copy from decompose milestone for reference)

2. **Write tests**
```json
{
  "title": "Write tests: {featureName}",
  "description": "Write unit tests, integration tests, and e2e tests per the test plan. Cover happy paths, edge cases, and error states. No skipped or disabled tests. All tests must pass in CI.",
  "tags": ["phase:build", "code", "testing"],
  "assigneeAgentId": "{qaEngineerId}"
}
```
Document key: `test-plan`

3. **Code review**
```json
{
  "title": "Code review: {featureName}",
  "description": "Review all PRs for architecture compliance, code quality, security, and convention adherence. Check for: no `any` types, no skipped tests, proper error handling, clean abstractions.",
  "tags": ["phase:build", "code", "review"],
  "assigneeAgentId": "{architectId}"
}
```

4. **UX review**
```json
{
  "title": "UX review: {featureName}",
  "description": "Review the built feature end-to-end. Take screenshots of all user flows. Verify: visual consistency, responsive behavior, accessibility (contrast, focus states, screen reader), loading states, error states, empty states.",
  "tags": ["phase:build", "user-facing", "review"],
  "assigneeAgentId": "{uxDirectorId}"
}
```

5. **Deploy preparation**
```json
{
  "title": "Deploy preparation: {featureName}",
  "description": "Prepare for production deployment. Verify: environment variables configured, database migrations tested, monitoring in place, rollback procedure documented, staging tested end-to-end.",
  "tags": ["phase:build", "deploy"],
  "assigneeAgentId": "{devOpsEngineerId}"
}
```

---

### gtm-research

**Invoked by:** CMO
**Purpose:** Conduct market research to inform GTM strategy for a product or feature.
**Creates:** 1 milestone + 4 child tasks

**Milestone:**
```json
{
  "title": "GTM Research: {productName}",
  "description": "Deep market research for {productName}. Produce competitive analysis, audience research, channel assessment, and gap identification to inform GTM strategy.",
  "status": "backlog",
  "priority": "high",
  "tags": ["phase:gtm-research", "milestone", "research"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": null,
  "assigneeAgentId": null
}
```

**Child tasks:**

1. **Competitive analysis**
```json
{
  "title": "Competitive analysis: {productName}",
  "description": "Identify top 5-10 competitors. For each: pricing, positioning, strengths, weaknesses, user sentiment (from reviews, Reddit, forums). Identify gaps we can exploit. Use Firecrawl for web research. Store findings in 'research' document.",
  "tags": ["phase:gtm-research", "research", "competitive"],
  "assigneeAgentId": "{marketResearcherId}"
}
```
Document key: `research`

2. **Audience research**
```json
{
  "title": "Audience research: {productName}",
  "description": "Define target audience segments. For each segment: demographics, pain points, where they hang out online, what language they use, willingness to pay. Mine Reddit, forums, review sites for real user quotes. Store in 'research' document.",
  "tags": ["phase:gtm-research", "research", "audience"],
  "assigneeAgentId": "{marketResearcherId}"
}
```
Document key: `research`

3. **Channel assessment**
```json
{
  "title": "Channel assessment: {productName}",
  "description": "Evaluate distribution channels: organic search (keyword opportunity), Reddit/community, Product Hunt, social media, email, paid ads. For each: estimated reach, cost, effort, timeline to results. Recommend top 3 channels.",
  "tags": ["phase:gtm-research", "research", "channels"],
  "assigneeAgentId": "{marketResearcherId}"
}
```
Document key: `research`

4. **Strategic synthesis**
```json
{
  "title": "GTM research synthesis: {productName}",
  "description": "Synthesize all research findings into a strategic brief. Include: market opportunity size, recommended positioning, target segments (prioritized), recommended channels, competitive differentiation, risks and mitigations.",
  "tags": ["phase:gtm-research", "research", "strategy"],
  "assigneeAgentId": "{cmoId}"
}
```
Document key: `research`

---

### gtm-strategy

**Invoked by:** CMO (after research milestone completes)
**Purpose:** Define positioning, messaging, pricing recommendations, and channel strategy.
**Creates:** 1 milestone + 3 child tasks

**Milestone:**
```json
{
  "title": "GTM Strategy: {productName}",
  "description": "Define the go-to-market strategy for {productName} based on research findings. Produce positioning, messaging hierarchy, and channel plan.",
  "status": "backlog",
  "priority": "high",
  "tags": ["phase:gtm-strategy", "milestone"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": null,
  "assigneeAgentId": null
}
```

**Child tasks:**

1. **Positioning and messaging**
```json
{
  "title": "Define positioning: {productName}",
  "description": "Create positioning statement, value propositions (3-5), messaging hierarchy (headline, subhead, body for each segment), and competitive differentiation claims. All claims must be substantiated.",
  "tags": ["phase:gtm-strategy", "messaging", "public-facing"],
  "assigneeAgentId": "{cmoId}"
}
```
Document key: `requirements`

2. **Channel plan**
```json
{
  "title": "Channel plan: {productName}",
  "description": "Define the channel mix with priorities, budgets, timelines, and success metrics per channel. Include content calendar skeleton for first 90 days.",
  "tags": ["phase:gtm-strategy", "channels"],
  "assigneeAgentId": "{cmoId}"
}
```
Document key: `launch-plan`

3. **Pricing recommendation**
```json
{
  "title": "Pricing recommendation: {productName}",
  "description": "Based on competitive analysis and positioning, recommend pricing tiers. Include: tier names, features per tier, price points, free tier limits, annual discount strategy. Flag for Finance Analyst review.",
  "tags": ["phase:gtm-strategy", "pricing"],
  "assigneeAgentId": "{cmoId}"
}
```

---

### gtm-launch

**Invoked by:** CMO (cross-team launch coordination)
**Purpose:** Execute the launch plan with cross-functional tasks.
**Creates:** 1 milestone + 6 child tasks spanning multiple teams

**Milestone:**
```json
{
  "title": "Launch: {productName}",
  "description": "Execute the launch plan for {productName}. Cross-team coordination: content creation, landing page, legal review, documentation, design assets, and launch announcement.",
  "status": "backlog",
  "priority": "critical",
  "tags": ["phase:gtm-launch", "milestone", "public-facing", "user-facing"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": null,
  "assigneeAgentId": null
}
```
Document key: `launch-plan`

**Child tasks:**

1. **Create launch content**
```json
{
  "title": "Create launch content: {productName}",
  "description": "Produce all launch content per the channel plan: blog post, social media posts (Twitter/X, LinkedIn, Reddit), email announcement, Product Hunt listing draft. All content must pass brand review gate before publishing.",
  "tags": ["phase:gtm-launch", "content", "public-facing"],
  "assigneeAgentId": "{contentGrowthLeadId}"
}
```

2. **Create/update landing page**
```json
{
  "title": "Landing page: {productName}",
  "description": "Create or update the product landing page with launch messaging, feature highlights, pricing (if applicable), and CTAs. Must pass brand review and UX review gates.",
  "tags": ["phase:gtm-launch", "content", "public-facing", "user-facing"],
  "assigneeAgentId": "{contentGrowthLeadId}"
}
```

3. **Brand review: launch assets**
```json
{
  "title": "Brand review: {productName} launch assets",
  "description": "Review all launch content and landing page for brand consistency. Check: visual guidelines, tone of voice, messaging hierarchy alignment, accessibility standards.",
  "tags": ["phase:gtm-launch", "review", "public-facing"],
  "assigneeAgentId": "{designLeadId}"
}
```

4. **Legal review: launch content**
```json
{
  "title": "Legal review: {productName} launch content",
  "description": "Review all public-facing launch content for compliance. Check: no misleading claims, required disclaimers present, ToS/privacy alignment, advertising platform policies.",
  "tags": ["phase:gtm-launch", "review", "public-facing", "legal"],
  "assigneeAgentId": "{legalCounselId}"
}
```

5. **Update documentation**
```json
{
  "title": "Update docs for launch: {productName}",
  "description": "Update or create user documentation for the launch. Include: getting started guide, feature documentation, FAQ, changelog entry. Publish to help center.",
  "tags": ["phase:gtm-launch", "documentation", "user-facing"],
  "assigneeAgentId": "{csLeadId}"
}
```

6. **Launch readiness check**
```json
{
  "title": "Launch readiness: {productName}",
  "description": "Final cross-team check before launch. Verify: all content approved, landing page live, docs published, legal signed off, monitoring active, support ready, rollback plan in place.",
  "tags": ["phase:gtm-launch", "gate"],
  "assigneeAgentId": "{chiefOfStaffId}"
}
```

---

### gtm-create

**Invoked by:** Content & Growth Lead
**Purpose:** Produce marketing assets for an ongoing campaign (not just launch).
**Creates:** 1 milestone + 3 child tasks

**Milestone:**
```json
{
  "title": "Content Sprint: {campaignName}",
  "description": "Produce marketing content for {campaignName}. Includes blog content, social posts, and email sequences. All public-facing content requires brand review.",
  "status": "backlog",
  "priority": "medium",
  "tags": ["phase:gtm-create", "milestone", "public-facing"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": null,
  "assigneeAgentId": null
}
```

**Child tasks:**

1. **Create blog content**
```json
{
  "title": "Blog: {contentTopic}",
  "description": "Write SEO-optimized blog post on {contentTopic}. Target keyword: {targetKeyword}. Include: meta title, meta description, H1/H2 structure, internal links, CTA. Minimum 1500 words.",
  "tags": ["phase:gtm-create", "content", "seo", "public-facing"],
  "assigneeAgentId": "{contentGrowthLeadId}"
}
```

2. **Create social content**
```json
{
  "title": "Social: {campaignName}",
  "description": "Create platform-specific social posts to promote {campaignName}. Twitter/X: 3-5 posts. LinkedIn: 1-2 posts. Reddit: 1 post per relevant subreddit. Adapt tone and format per platform.",
  "tags": ["phase:gtm-create", "content", "social", "public-facing"],
  "assigneeAgentId": "{contentGrowthLeadId}"
}
```

3. **Create email sequence**
```json
{
  "title": "Email sequence: {campaignName}",
  "description": "Draft email sequence for {campaignName}. Include: subject lines (A/B variants), preview text, body copy, CTAs. Ensure CAN-SPAM compliance (unsubscribe link, physical address, honest subject lines).",
  "tags": ["phase:gtm-create", "content", "email", "public-facing"],
  "assigneeAgentId": "{contentGrowthLeadId}"
}
```

---

### gtm-measure

**Invoked by:** CMO
**Purpose:** Measure campaign performance and produce actionable analysis.
**Creates:** 1 milestone + 2 child tasks

**Milestone:**
```json
{
  "title": "Measure: {campaignName}",
  "description": "Analyze performance of {campaignName}. Collect metrics, assess channel effectiveness, and produce optimization recommendations.",
  "status": "backlog",
  "priority": "medium",
  "tags": ["phase:gtm-measure", "milestone", "analytics"],
  "goalId": "{goalId}",
  "projectId": "{projectId}",
  "parentId": null,
  "assigneeAgentId": null
}
```

**Child tasks:**

1. **Collect and analyze metrics**
```json
{
  "title": "Metrics analysis: {campaignName}",
  "description": "Collect performance data across all channels. Track: impressions, clicks, conversions, CAC, signup-to-paid rate, content engagement. Compare against targets set in the channel plan.",
  "tags": ["phase:gtm-measure", "analytics"],
  "assigneeAgentId": "{contentGrowthLeadId}"
}
```
Document key: `research`

2. **Optimization recommendations**
```json
{
  "title": "Optimization plan: {campaignName}",
  "description": "Based on metrics analysis, recommend: (1) channels to double down on, (2) channels to cut, (3) messaging adjustments, (4) budget reallocation. Include specific next actions with owners and timelines.",
  "tags": ["phase:gtm-measure", "strategy"],
  "assigneeAgentId": "{cmoId}"
}
```
Document key: `requirements`

## Usage Notes

1. **Variable substitution:** Replace all `{variable}` placeholders with actual values before making API calls. Never create issues with placeholder text.

2. **Agent ID lookup:** Use `GET /api/companies/{companyId}/agents` to resolve agent names to IDs before creating issues. Cache the mapping for the session.

3. **Sequential creation:** Create the milestone first, then use its returned `id` as the `parentId` for all child tasks. This ensures proper hierarchy.

4. **Document attachment:** After creating each issue, immediately attach its documents via `PUT /api/issues/{issueId}/documents/{key}`. Do not defer document creation.

5. **Tag consistency:** Always include the `phase:{phaseName}` tag on every issue. This enables the Chief of Staff to track phase progress across products.
