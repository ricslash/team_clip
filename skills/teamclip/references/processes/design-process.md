# Design Process (TeamClip)

_Last updated: 2026-03-25_

Complete design lifecycle for any product. Every phase updates the design issue tree via Paperclip.

**Cardinal rule:** Brand consistency is non-negotiable. Every public-facing deliverable passes through the Design Lead brand review gate.

---

## Lifecycle

```
RESEARCH --> EXPLORE --> DEFINE --> BUILD --> REVIEW --> SHIP
                                    ^          |
                                    +----------+ (revisions)
```

| # | Phase | Purpose | Key Output |
|---|-------|---------|------------|
| 1 | **Research** | Competitive UX audit, user research, accessibility baseline | Research report with findings |
| 2 | **Explore** | Sketches, wireframes, mood boards, prototyping | Exploration deck (3+ directions) |
| 3 | **Define** | Design tokens, component specs, interaction patterns | Design specification |
| 4 | **Build** | Production-ready components, responsive testing | Implemented designs |
| 5 | **Review** | Brand consistency, accessibility audit, cross-device testing | Review report with sign-off |
| 6 | **Ship** | Design system publish, engineering handoff | Updated guidelines + handoff docs |

---

## Phase Details

### 1. RESEARCH

**Trigger:** New product, feature, redesign, or quarterly audit.

**Activities:**
1. **Competitive UX audit** — UX Director analyzes 3-5 competitors (DevTools + Firecrawl)
2. **User behavior analysis** — UX Director reviews support tickets, analytics, session recordings
3. **Accessibility baseline** — WCAG 2.1 AA audit on existing product
4. **Trend analysis** — Design Lead surveys relevant design trends

**Agents:** UX Director (primary), Design Lead (trends, brand alignment)

**Storage:** `PUT /api/issues/{id}/documents/{competitive-ux|ux-research|a11y-audit}`

**Exit:** 3+ competitors analyzed, pain points with evidence, accessibility baseline established, reviewed by PM.

### 2. EXPLORE

**Trigger:** Research reviewed and design brief approved.

**Activities:** 3+ concept directions, wireframes (UX Director), mood boards (Design Lead), rapid prototypes for top 1-2 directions.

**Agents:** UX Director (wireframes, prototypes), Design Lead (visual exploration, brand check)

**Exit:** 3+ distinct directions, PM/Architect reviewed feasibility, one direction selected with rationale in issue comment.

### 3. DEFINE

**Trigger:** Direction selected.

**Activities:** Design token definition, component specs (all states/variants/responsive/a11y), interaction patterns (with `prefers-reduced-motion` fallbacks), information architecture.

**Agents:** Design Lead (primary — tokens, components, interactions), UX Director (IA, user flows)

**Storage:** `PUT /api/issues/{id}/documents/{design-tokens|component-spec|interaction-spec|user-flows}`

**Exit:** All tokens defined, component specs include all states/variants/responsive/a11y, no magic numbers.

### 4. BUILD

**Trigger:** Design spec approved.

**Activities:** Production components via Frontend Design Plugin, design system integration, asset creation, responsive testing across breakpoints, accessibility implementation (WCAG 2.1 AA).

**Agent:** Design Lead (primary)

```
FOR each component issue:
  1. Build component using Frontend Design Plugin
  2. Verify against spec (all states, variants, responsive)
  3. Test accessibility (contrast, focus, keyboard, screen reader)
  4. Test across breakpoints
  5. IF passes --> status "done", store: PUT /api/issues/{id}/documents/component-output
```

### 5. REVIEW

**Trigger:** Build complete. Chief of Staff auto-creates blocking gate issues.

**Gates:**
- Brand review (Design Lead self-review against guidelines) — **mandatory**
- UX review + accessibility audit (UX Director — Gemini adapter for visual QA)

**Review loop:**
```
FOR each deliverable:
  1. Design Lead: brand review (APPROVED/REJECTED with specific feedback)
  2. UX Director: accessibility audit, cross-device testing, usability validation
  3. ALL pass --> gate issues "done", cleared for SHIP
```

**Exit:** Design Lead signed off, WCAG 2.1 AA verified, cross-device passed, all gate issues "done".

### 6. SHIP

**Trigger:** All review gates resolved.

**Activities:** Design system version bump + changelog, brand guidelines update (append-only), engineering handoff doc (tokens, specs, assets, breakpoints), asset export, Confluence publish.

**Storage:** `PUT /api/issues/{id}/documents/{engineering-handoff|design-tokens-final|brand-updates}`

Chief of Staff auto-creates cross-team handoff issues for Engineering, CS, and CMO.

---

## Brand Review — The Quality Gate

Design Lead is the mandatory gate for all public-facing content. No exceptions.

**Triggers (Chief of Staff auto-creates blocking issues):**
- Marketing content, help center styling, investor decks, engineering UI changes, anything public-facing

**Outcomes:**
- **APPROVED** — gate issue "done", content ships
- **APPROVED WITH CHANGES** — ships after minor fixes, no re-review
- **REJECTED** — specific feedback referencing violated guidelines, must be re-reviewed

**Checks:** Exact hex values, type scale, spacing scale, imagery style, copy voice/tone, messaging alignment, accessibility, consistency with live materials.

---

## Design System

Single source of truth for how the product looks and behaves. Eliminates design ambiguity.

**Principles:** Consistency over novelty. Accessibility first (WCAG 2.1 AA minimum). Mobile-first responsive. Performance-aware. Developer-friendly (exact CSS values). Token-driven (no magic numbers).

**Token hierarchy:** Brand Values --> Design Tokens (CSS custom properties: color, typography, spacing, shadow, border, breakpoint, z-index, transition) --> Component Styles (consume tokens only)

**Component spec standard:** Name/purpose, variants, states (default/hover/active/focus/disabled/loading/error), sizes, responsive behavior, accessibility (ARIA, keyboard, focus), tokens used, code example, do/don't guidelines. Stored as `PUT /api/issues/{id}/documents/component-spec`.

---

## Accessibility Standards

WCAG 2.1 AA minimum. Tested in BUILD and REVIEW phases.

| Category | Standard |
|----------|----------|
| Color contrast | 4.5:1 normal text, 3:1 large text |
| Focus indicators | Visible, minimum 2px outline |
| Touch targets | 44x44px minimum on mobile |
| Screen reader | Meaningful alt text, form labels, ARIA live regions |
| Keyboard | Full functionality, logical tab order, no traps |
| Motion | Respect `prefers-reduced-motion` |
| Font sizes | 16px minimum body, scalable |
| Color independence | Not conveyed by color alone |

**Severity:** Critical (blocks ship), Major (fix before ship), Minor (next cycle), Enhancement (log for future).

---

## Agent Team

| Agent | Role | Primary Phases |
|-------|------|----------------|
| **Design Lead** | Brand identity, tokens, component specs, brand review gate, design system, animation specs, production builds | All phases |
| **UX Director** | Screenshot-based visual QA (Gemini adapter), accessibility audits, cross-product UX, wireframes, prototypes, usability validation | RESEARCH, EXPLORE, REVIEW |

**Ownership:** Design Lead owns spec and system. UX Director validates built implementation. Design Lead has veto on brand. UX Director has veto on usability/accessibility.

---

## Anti-Patterns

- **Designing without research** — Guesses are expensive to fix
- **One direction only** — Always explore 3+ directions
- **Magic numbers** — Every value maps to a token
- **Desktop-first** — Mobile-first is not optional
- **Accessibility as afterthought** — Build it in from the start
- **Skipping the brand gate** — Mandatory for public-facing content
- **"It looks right"** — Test it. Check contrast. Tab through it. Inspect CSS values.
- **Standalone deliverable files** — Issue documents or attachments only
