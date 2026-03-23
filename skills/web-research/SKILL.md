---
name: web-research
description: Deep web research skill for Market Researcher. Uses Firecrawl for web scraping and search to conduct competitor analysis, mine user feedback, and identify market gaps. Produces structured research reports stored as issue documents.
---

# Web Research Skill

## When to Use

The Market Researcher invokes this skill when assigned research tasks by the CMO. It covers three research methodologies:

1. **Competitor analysis** — Map the competitive landscape, pricing, features, positioning
2. **User feedback mining** — Find real user opinions on Reddit, forums, review sites, social media
3. **Gap identification** — Identify underserved needs and differentiation opportunities

## Tools

### Firecrawl

Firecrawl is the primary tool for web research. It provides two key capabilities:

**Web Search** — Find relevant pages across the internet:
```
Use Firecrawl search to find pages matching a query.
Query: "{searchQuery}"
Limit: 10-20 results per query
```

**Web Scraping** — Extract content from specific URLs:
```
Use Firecrawl to scrape the content of a URL.
URL: "{targetUrl}"
Extract: main content, removing navigation and ads
```

### WebSearch and WebFetch

As fallback tools when Firecrawl is unavailable:
- **WebSearch** — General web search for finding relevant pages
- **WebFetch** — Fetch and extract content from specific URLs

## Research Methodology

### 1. Competitor Analysis

**Goal:** Produce a comprehensive competitive landscape map.

**Step 1: Identify competitors**
- Search for: "{productCategory} tools", "{productCategory} alternatives", "best {productCategory} software {currentYear}"
- Check: G2, Capterra, Product Hunt, AlternativeTo
- Target: 5-10 direct competitors, 3-5 indirect competitors

**Step 2: For each competitor, collect:**
- **Product:** Core features, unique selling points, tech stack (if visible), integrations
- **Pricing:** Tier structure, price points, free tier limits, enterprise pricing signals
- **Positioning:** Tagline, homepage messaging, who they say they're for
- **Traction:** User count (if public), funding, team size, growth signals
- **Sentiment:** What users love, what users hate (from reviews and forums)

**Step 3: Search queries to run:**
```
"{competitorName} review"
"{competitorName} vs" (autocomplete reveals key comparisons)
"{competitorName} pricing {currentYear}"
"{competitorName} alternative"
"site:reddit.com {competitorName}"
"site:g2.com {competitorName}"
```

**Step 4: Synthesize into competitive matrix:**
| Competitor | Positioning | Key Strength | Key Weakness | Pricing | Our Advantage |
|---|---|---|---|---|---|

### 2. User Feedback Mining

**Goal:** Understand real user pain points, language, and unmet needs.

**Step 1: Identify sources**
- Reddit: relevant subreddits (search for the product category)
- Review sites: G2, Capterra, TrustRadius, Product Hunt
- Forums: Hacker News, Stack Overflow, niche community forums
- Social: Twitter/X searches, LinkedIn posts

**Step 2: Search queries to run:**
```
"site:reddit.com {productCategory} recommendation"
"site:reddit.com {productCategory} frustrating OR annoying OR hate OR wish"
"site:reddit.com looking for {productCategory}"
"{productCategory} review honest"
"{productCategory} switched from"
"{productCategory} pain points"
```

**Step 3: For each source, extract:**
- **Direct quotes** — Copy exact user language (valuable for marketing copy)
- **Pain points** — What problems are users trying to solve?
- **Feature requests** — What do users wish existed?
- **Switching triggers** — What makes users leave one tool for another?
- **Willingness to pay** — Any signals about price sensitivity?

**Step 4: Categorize findings:**
| Theme | Frequency | User Quotes | Implication |
|---|---|---|---|

### 3. Gap Identification

**Goal:** Find underserved needs that represent product opportunities.

**Step 1: Cross-reference competitor weaknesses with user pain points**
- Where are competitors weak AND users are vocal about the problem?
- What do users ask for that no competitor provides?
- What workarounds are users building (signals unmet need)?

**Step 2: Validate gaps:**
- Search for: "{gap} solution", "{gap} tool", "{gap} workaround"
- If many results: gap is known but solution is poor (positioning opportunity)
- If few results: gap may be too niche or the language is wrong (test alternative terms)

**Step 3: Score each gap:**
| Gap | User Demand (H/M/L) | Competitor Coverage (None/Weak/Strong) | Implementation Effort (S/M/L/XL) | Strategic Fit (H/M/L) |
|---|---|---|---|---|

## Output Format

All research output is stored as a structured report in the issue's `research` document key.

```markdown
# Research Report: {researchTopic}

**Date:** {YYYY-MM-DD}
**Researcher:** Market Researcher
**Product:** {productName}
**Research Type:** {Competitor Analysis | User Feedback Mining | Gap Identification | Full Market Assessment}

## Executive Summary
{3-5 sentences: key findings, biggest opportunity, primary risk}

## Methodology
- Sources searched: {list of sources}
- Queries run: {count}
- Pages analyzed: {count}
- Time period of data: {date range of sources}

## Findings

### Competitive Landscape
{competitive matrix table}

### User Sentiment
{categorized findings table with direct quotes}

### Market Gaps
{scored gap table}

## Evidence
{For each key finding, link to source URL and relevant quote}

### Finding 1: {finding title}
- **Source:** {URL}
- **Quote:** "{exact quote}"
- **Implication:** {what this means for our product}

### Finding 2: {finding title}
...

## Recommendations

### Immediate Actions (this sprint)
1. {specific, actionable recommendation with owner}
2. {specific, actionable recommendation with owner}

### Strategic Considerations (next quarter)
1. {strategic recommendation}
2. {strategic recommendation}

### Risks
1. {risk}: {mitigation}
2. {risk}: {mitigation}
```

## Storage

After completing research, store the report:

```
PUT /api/issues/{issueId}/documents/research
Content-Type: application/json

{
  "content": "{full research report in markdown}"
}
```

If the report includes screenshots or visual evidence, attach them:

```
POST /api/issues/{issueId}/attachments
Content-Type: multipart/form-data

file: {screenshot or exported page}
```

## Quality Standards

1. **Evidence-based:** Every finding must cite a specific source URL. No unsourced claims.
2. **Recency:** Prioritize sources from the last 12 months. Flag anything older with a date warning.
3. **Direct quotes:** Include at least 5 direct user quotes per research report. These are gold for marketing copy.
4. **Actionable:** Every recommendation must specify who should act and what they should do. "Consider exploring X" is not actionable. "PM should add {feature} to the Q2 roadmap because {evidence}" is actionable.
5. **Quantified where possible:** User counts, review ratings, pricing numbers, community sizes. Qualitative insights are valuable but quantitative signals are stronger.
6. **Bias awareness:** Note when a source may be biased (e.g., a competitor's own blog, a paid review, an affiliate site). Weight findings accordingly.
