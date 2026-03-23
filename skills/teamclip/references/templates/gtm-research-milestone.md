# Issue Template: GTM Research Milestone

## Overview

**Phase:** gtm-research
**Created by:** CMO
**Trigger:** New product approaching launch, new market entry, or quarterly competitive refresh
**Output:** Comprehensive market research report informing GTM strategy

## Issue Tree

```
GTM Research: {productName}                          [Milestone — unassigned]
├── Competitive analysis: {productName}              [Task — Market Researcher]
├── Audience research: {productName}                 [Task — Market Researcher]
├── Channel assessment: {productName}                [Task — Market Researcher]
└── GTM research synthesis: {productName}            [Task — CMO]
```

## Milestone Issue

| Field | Value |
|---|---|
| Title | `GTM Research: {productName}` |
| Description | Conduct deep market research for {productName}. Map the competitive landscape, understand target audience segments, assess distribution channels, and identify market gaps. Output feeds directly into GTM strategy. |
| Status | `backlog` |
| Priority | `high` |
| Tags | `phase:gtm-research`, `milestone`, `research` |
| Goal | Link to the product goal |
| Project | Link to the GTM project for this product |
| Assignee | None |
| Document: `requirements` | Research brief: what questions need answering, what decisions this research will inform, timeline |

## Child Tasks

### 1. Competitive Analysis

| Field | Value |
|---|---|
| Title | `Competitive analysis: {productName}` |
| Description | Map the competitive landscape for {productName}. Identify 5-10 direct competitors and 3-5 indirect competitors. For each: core features and differentiators, pricing model and tiers, positioning and target audience, user sentiment from reviews and forums (with direct quotes), traction signals (user count, funding, team size, growth indicators), strengths we should match and weaknesses we can exploit. Use the web-research skill with Firecrawl. |
| Tags | `phase:gtm-research`, `research`, `competitive` |
| Assignee | Market Researcher |
| Document: `research` | Competitive analysis report with matrix |

**Acceptance criteria:**
- Minimum 5 direct competitors analyzed in depth
- Pricing data current (verified within last 30 days)
- User sentiment includes minimum 5 direct quotes per competitor from independent sources
- Competitive matrix completed with all fields populated
- Differentiation opportunities identified with supporting evidence

### 2. Audience Research

| Field | Value |
|---|---|
| Title | `Audience research: {productName}` |
| Description | Define and validate target audience segments for {productName}. For each segment: demographic and firmographic profile, primary pain points (with evidence from real user discussions), where they discover and evaluate tools (specific subreddits, forums, review sites, communities), language they use to describe their problems (pull exact phrases for marketing copy), willingness to pay and price sensitivity signals, current solutions and satisfaction level. Mine Reddit, G2, Capterra, Product Hunt, HackerNews, and niche forums. |
| Tags | `phase:gtm-research`, `research`, `audience` |
| Assignee | Market Researcher |
| Document: `research` | Audience research report with segment profiles |

**Acceptance criteria:**
- Minimum 3 distinct audience segments defined
- Each segment has at least 5 direct user quotes as evidence
- Pain points are ranked by frequency and severity
- Discovery channels are specific (subreddit names, forum URLs, not just "Reddit")
- Language examples are exact quotes ready for use in marketing copy

### 3. Channel Assessment

| Field | Value |
|---|---|
| Title | `Channel assessment: {productName}` |
| Description | Evaluate distribution and acquisition channels for {productName}. Assess each channel: organic search (keyword opportunity analysis — search volume, difficulty, current ranking landscape), content marketing (what content types perform in this space, what gaps exist), community/Reddit (relevant subreddits, posting norms, engagement levels), Product Hunt (competitor launches, optimal timing, category fit), social media (which platforms, organic reach potential, content format), email marketing (list building opportunities, sequence effectiveness benchmarks), paid ads (CPC benchmarks, platform recommendations, budget thresholds). For each channel, estimate: reach, cost, effort, and timeline to results. Recommend the top 3 channels to invest in first. |
| Tags | `phase:gtm-research`, `research`, `channels` |
| Assignee | Market Researcher |
| Document: `research` | Channel assessment report |

**Acceptance criteria:**
- Minimum 5 channels assessed with data
- Each channel has estimated cost, reach, effort, and timeline
- Keyword opportunity analysis includes specific keywords with volume and difficulty
- Top 3 channel recommendation with justification
- Quick-win opportunities identified (channels with low effort and high potential)

### 4. Strategic Synthesis

| Field | Value |
|---|---|
| Title | `GTM research synthesis: {productName}` |
| Description | Synthesize all research findings into a strategic brief that will drive GTM strategy decisions. Include: total addressable market estimate (with methodology), recommended market positioning (based on competitive gaps and audience needs), prioritized target segments (with rationale for ordering), recommended channel mix (top 3 with budget allocation), key competitive differentiators (defensible, not features-of-the-week), primary risks and mitigation strategies. This synthesis is the input to the GTM Strategy phase. |
| Tags | `phase:gtm-research`, `research`, `strategy` |
| Assignee | CMO |
| Document: `research` | Strategic synthesis report |

**Acceptance criteria:**
- All three research tasks are synthesized (competitive, audience, channels)
- Positioning recommendation is specific and differentiated (not generic)
- Target segments are prioritized with clear rationale
- Channel recommendations include budget ranges and expected ROI timeline
- Risks are specific, not generic ("competitor X may launch similar feature in Q2" not "competitive risk")

## Completion Criteria

The GTM research milestone is complete when:
1. Competitive analysis covers minimum 5 direct competitors with current data
2. Audience research defines minimum 3 segments with evidence
3. Channel assessment evaluates minimum 5 channels with data
4. CMO has synthesized all findings into a strategic brief
5. All findings are stored in `research` documents on their respective issues

## Next Step

When this milestone completes, the CMO creates a **gtm-strategy** milestone to define positioning, messaging, and channel plan based on these research findings.
