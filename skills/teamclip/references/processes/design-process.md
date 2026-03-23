# Design Process — Full Lifecycle Reference (TeamClip)

_Last updated: 2026-03-20_
_Adapted from: Team workflow/design-process.md_

This is the complete design lifecycle. It applies to any product. Every phase produces deliverables, updates the design issue tree, and has defined exit criteria before moving forward.

**The cardinal rule:** Brand consistency is non-negotiable. Every deliverable — from a button color to a landing page — must pass through the brand review gate. If it's public-facing, it doesn't ship without Design Lead sign-off.

---

## The Full Lifecycle

```
RESEARCH --> EXPLORE --> DEFINE --> BUILD --> REVIEW --> SHIP
                                    ^          |
                                    +----------+ (revisions from review)
```

| # | Phase | TeamClip Pattern | Purpose | Key Output |
|---|-------|------------------|---------|------------|
| 1 | **Research** | Product Manager or Design Lead creates milestone "Design Research: {feature}" via Paperclip API | Competitive UX audit, user research, accessibility baseline, trend analysis | Research report with findings and opportunities |
| 2 | **Explore** | Design Lead creates subtasks for concept directions | Sketches, wireframes, mood boards, concept directions, rapid prototyping | Exploration deck (3+ directions) |
| 3 | **Define** | Design Lead creates subtasks for tokens, components, interactions | Selected direction refinement, design tokens, component specs, interaction patterns | Design specification |
| 4 | **Build** | Design Lead creates build tasks, assigns to self | Production-ready components, design system updates, asset creation, responsive testing | Implemented designs |
| 5 | **Review** | Chief of Staff auto-creates gate issues: brand review (Design Lead), UX review (UX Director), accessibility review | Brand consistency, accessibility audit, cross-device testing, usability validation | Review report with sign-off |
| 6 | **Ship** | Design Lead creates handoff tasks, Chief of Staff creates cross-team issues for Engineering | Design system publish, guidelines update, engineering handoff, asset export | Updated guidelines + handoff docs |

---

## Phase 1: RESEARCH

**Trigger:** New product, new feature, redesign initiative, or scheduled quarterly audit.

**TeamClip pattern:** Product Manager or Design Lead creates milestone "Design Research: {feature}" with subtasks for competitive audit, user research, and accessibility baseline.

**What happens:**
1. **Competitive UX audit** — UX Director analyzes 3-5 competitor products using Chrome DevTools and Firecrawl. Documents interaction patterns, information architecture, visual design language, onboarding flows, and accessibility posture.
2. **User behavior analysis** — UX Director reviews support tickets (from CS Lead), analytics data, and session recordings to identify UX pain points and drop-off patterns.
3. **Accessibility baseline** — UX Director runs WCAG 2.1 AA audit on existing product (or competitor products for greenfield). Documents current compliance state.
4. **Trend analysis** — Design Lead surveys current design trends relevant to the product category. Documents what's emerging, what's plateauing, what's declining.

**Agents:**
- **UX Director** (primary — Gemini adapter for visual analysis) — competitive UX audit, user behavior analysis, accessibility baseline
- **Design Lead** — trend analysis, brand alignment assessment

**Deliverable storage:**
- Competitive UX analysis: `PUT /api/issues/{research-milestone-id}/documents/competitive-ux`
- UX research report: `PUT /api/issues/{research-milestone-id}/documents/ux-research`
- Accessibility audit: `PUT /api/issues/{research-milestone-id}/documents/a11y-audit`
- Screenshots and visual references: `POST /api/issues/{id}/attachments`

**Exit criteria:**
- [ ] 3+ competitors analyzed with specific UX/UI findings
- [ ] User pain points documented with evidence (not assumptions)
- [ ] Accessibility baseline established
- [ ] Opportunities prioritized by impact and feasibility
- [ ] Research report reviewed by Product Manager
- [ ] All deliverables stored as issue documents

---

## Phase 2: EXPLORE

**Trigger:** Research complete and reviewed. Product Manager has approved the design brief.

**TeamClip pattern:** Design Lead creates subtasks under the design milestone for each concept direction (minimum 3). UX Director gets prototype subtasks.

**What happens:**
1. **Concept development** — Design Lead creates 3+ distinct directions. Each direction takes a different approach to solving the identified problems. Directions can vary in layout, interaction model, information density, or visual tone.
2. **Wireframes** — UX Director builds low-fidelity wireframes for each direction. Focus on structure, flow, and information hierarchy. No visual design yet.
3. **Mood boards** — Design Lead creates visual mood boards for each direction. Collects reference imagery, color palettes, typography samples, and interaction inspiration.
4. **Rapid prototyping** — UX Director builds clickable prototypes for the strongest 1-2 directions. Just enough to test the concept, not production-ready.

**Agents:**
- **UX Director** (wireframes, prototypes — Gemini visual capabilities for evaluating output)
- **Design Lead** (visual exploration, brand alignment check, mood boards)

**Deliverable storage:**
- Exploration deck: `PUT /api/issues/{explore-milestone-id}/documents/exploration-deck`
- Wireframes per direction: `POST /api/issues/{id}/attachments` (per subtask)
- Mood boards: `POST /api/issues/{id}/attachments`
- Prototype links/files: `POST /api/issues/{id}/attachments`

**Exit criteria:**
- [ ] Minimum 3 distinct directions explored (not variations of one idea)
- [ ] Each direction addresses the core user problems from research
- [ ] Design Lead confirms all directions are within brand parameters
- [ ] Product Manager and Architect have reviewed feasibility
- [ ] One direction selected for refinement (with documented rationale in issue comment)

---

## Phase 3: DEFINE

**Trigger:** Direction selected from exploration phase.

**TeamClip pattern:** Design Lead creates subtasks for token definition, component specs, interaction patterns, and information architecture.

**What happens:**
1. **Design token definition** — Design Lead defines or updates tokens for the selected direction. Colors, typography, spacing, shadows, borders, breakpoints, transitions. All values derive from brand guidelines — no magic numbers.
2. **Component specification** — Design Lead specs each component needed. Every spec includes: variants, states (default, hover, active, focus, disabled, loading, error), responsive behavior, accessibility requirements, and exact CSS values.
3. **Interaction patterns** — Design Lead defines animations, transitions, micro-interactions, loading states. Every animation includes: trigger, duration, easing, property, and `prefers-reduced-motion` fallback.
4. **Information architecture** — UX Director finalizes navigation structure, content hierarchy, and user flow maps.

**Agents:**
- **Design Lead** (primary — tokens, components, interaction specs, visual design. Absorbs old design-system-lead, ui-designer, and motion-designer roles)
- **UX Director** (information architecture, user flows, validates spec-to-build accuracy)

**Deliverable storage:**
- Design tokens: `PUT /api/issues/{define-milestone-id}/documents/design-tokens`
- Component specs: `PUT /api/issues/{id}/documents/component-spec` (per component subtask)
- Interaction specs: `PUT /api/issues/{define-milestone-id}/documents/interaction-spec`
- User flow maps: `PUT /api/issues/{define-milestone-id}/documents/user-flows`

**Exit criteria:**
- [ ] All design tokens defined and documented
- [ ] Component specs include all states, variants, responsive behavior, and accessibility
- [ ] Interaction specs include durations, easing, and reduced-motion fallbacks
- [ ] Information architecture approved by Product Manager
- [ ] No magic numbers — every value traces to a design token
- [ ] All specs stored as issue documents

---

## Phase 4: BUILD

**Trigger:** Design specification is complete and approved.

**TeamClip pattern:** Design Lead creates build subtasks for each component. Full-Stack Engineer may get parallel implementation tasks for code components.

**What happens:**
1. **Production component build** — Design Lead uses the Frontend Design Plugin to generate production-ready components. Each component follows the spec exactly — tokens, states, variants, responsive behavior.
2. **Design system update** — Design Lead integrates new components into the design system. Updates the component library documentation and ensures consistency with existing components.
3. **Asset creation** — Design Lead creates or exports any required assets: icons, illustrations, imagery. All assets follow brand guidelines and are optimized for web (SVG where possible, compressed rasters).
4. **Responsive testing** — Design Lead tests every component across breakpoints using Chrome DevTools. Documents behavior at each breakpoint.
5. **Accessibility implementation** — All components tested against WCAG 2.1 AA: contrast ratios, focus indicators, keyboard navigation, screen reader labels, touch targets.

**Agents:**
- **Design Lead** (primary — system integration, components, responsive testing, asset creation, animation implementation. Absorbs old design-system-lead, ui-designer, brand-designer asset, and motion-designer roles)

**Execution loop:**
```
FOR each component issue in spec:
  1. Build component using Frontend Design Plugin
  2. Verify against spec (all states, variants, responsive)
  3. Test accessibility (contrast, focus, keyboard, screen reader)
  4. Test across breakpoints (mobile, tablet, desktop)
  5. IF fails any check --> revise and re-verify
  6. IF passes --> update issue status to "done", store in design system
     Store component output: PUT /api/issues/{id}/documents/component-output
     Store assets: POST /api/issues/{id}/attachments
```

**Exit criteria:**
- [ ] All components match their specs exactly
- [ ] All components pass WCAG 2.1 AA
- [ ] Responsive behavior verified at all breakpoints
- [ ] Assets exported and optimized
- [ ] Design system documentation updated (stored as issue documents)

---

## Phase 5: REVIEW

**Trigger:** Build complete. Components are production-ready.

**TeamClip pattern:** Chief of Staff auto-creates blocking gate issues:
- "Brand review: {design milestone}" assigned to Design Lead (self-review against brand guidelines — the mandatory gate)
- "UX review: {design milestone}" assigned to UX Director
- "Accessibility audit: {design milestone}" assigned to UX Director

**What happens:**
1. **Brand consistency check** — Design Lead reviews every component, page, and asset against brand guidelines. This is the mandatory quality gate. Verdict: APPROVED or REJECTED with specific, actionable feedback stored as issue comments.
2. **Accessibility audit** — UX Director conducts full WCAG 2.1 AA audit. Documents every finding with severity, location, and remediation guidance.
3. **Cross-device testing** — UX Director tests on actual device sizes (screenshot-based visual QA via Gemini adapter). Verifies touch targets, readability, and interaction patterns on mobile.
4. **Usability validation** — UX Director walks through core user flows. Checks for cognitive load, error handling, edge cases, and consistency with established interaction patterns.
5. **Motion review** — Design Lead verifies animations respect `prefers-reduced-motion`, durations feel appropriate, and transitions don't cause disorientation.

**Agents:**
- **Design Lead** (brand gate — mandatory, motion review)
- **UX Director** (accessibility audit, cross-device testing, usability validation — Gemini adapter for visual QA)

**Review loop:**
```
FOR each deliverable:
  1. Design Lead reviews against brand guidelines
  2. IF REJECTED --> specific feedback as issue comment --> return to BUILD --> re-review
  3. IF APPROVED --> proceed to remaining checks
  4. UX Director: accessibility audit (pass/fail with findings)
  5. UX Director: cross-device testing (pass/fail with findings)
  6. UX Director: usability validation (pass/fail with findings)
  7. ALL checks pass --> update gate issues to "done", cleared for SHIP
```

**Deliverable storage:**
- Brand review report: `PUT /api/issues/{brand-gate-id}/documents/review-report`
- Accessibility audit: `PUT /api/issues/{a11y-gate-id}/documents/audit-report`
- Design review report: `PUT /api/issues/{ux-gate-id}/documents/review-report`
- Screenshots of findings: `POST /api/issues/{id}/attachments`

**Exit criteria:**
- [ ] Design Lead has signed off (APPROVED verdict on brand gate issue)
- [ ] WCAG 2.1 AA compliance verified — no critical or major violations
- [ ] Cross-device testing passed at all target breakpoints
- [ ] Usability validation passed — no critical flow blockers
- [ ] All REJECTED items have been revised and re-approved
- [ ] All gate issues marked "done"

---

## Phase 6: SHIP

**Trigger:** Review phase complete. All quality gate issues resolved.

**TeamClip pattern:** Design Lead creates ship subtasks. Chief of Staff auto-creates cross-team handoff issues for Engineering (via CTO), CS Lead (documentation), and CMO (marketing asset updates).

**What happens:**
1. **Design system publish** — Design Lead publishes updated design system. Version bump, changelog entry, migration notes for breaking changes.
2. **Brand guidelines update** — Design Lead updates brand guidelines if the project introduced new patterns, colors, or typography usage. Guidelines are append-only — existing rules are not removed without explicit CEO approval.
3. **Engineering handoff** — Design Lead creates handoff documentation as an issue document with: design tokens (CSS variables or JSON), component specs with exact values, interaction specs with timing and easing, asset manifest, and responsive breakpoint behavior.
4. **Asset export** — Design Lead exports final assets in all required formats and sizes, stored as issue attachments.
5. **Confluence publish** — All finalized documentation pushed to Confluence for cross-team access.
6. **Handoff trigger** — Chief of Staff auto-creates engineering implementation issues with full design context.

**Agents:**
- **Design Lead** (publish, handoff, guidelines, assets — absorbs old design-system-lead and brand-designer ship roles)
- **Chief of Staff** (auto-creates cross-team handoff issues)

**Deliverable storage:**
- Engineering handoff doc: `PUT /api/issues/{ship-milestone-id}/documents/engineering-handoff`
- Updated design tokens: `PUT /api/issues/{ship-milestone-id}/documents/design-tokens-final`
- Brand guidelines changes: `PUT /api/issues/{ship-milestone-id}/documents/brand-updates`
- Exported assets: `POST /api/issues/{ship-milestone-id}/attachments`

**Exit criteria:**
- [ ] Design system version bumped and changelog updated
- [ ] Brand guidelines reflect any new patterns
- [ ] Engineering handoff doc is complete and self-contained (stored as issue document)
- [ ] All assets exported in correct formats (stored as issue attachments)
- [ ] Documentation published to Confluence
- [ ] Cross-team handoff issues created by Chief of Staff

---

## Brand Management Process

Design owns brand identity across all products. This is the most critical responsibility — brand inconsistency erodes user trust faster than any bug.

### Brand Artifacts

| Artifact | Storage | Owner |
|----------|---------|-------|
| Brand guidelines (visual) | Issue document on brand milestone | Design Lead |
| Brand guidelines (copy) | Issue document on brand milestone | Design Lead |
| Design tokens | Issue document, updated per design system release | Design Lead |
| Component library | Issue documents per component | Design Lead |
| Asset library | Issue attachments, organized by milestone | Design Lead |

### Brand Review — The Quality Gate

The Design Lead is the mandatory gate for all public-facing content, regardless of which team produced it. No exceptions.

**What triggers brand review (Chief of Staff auto-creates blocking issues):**
- Marketing content (landing pages, emails, ads, social posts)
- Help center articles and documentation styling
- Investor decks and external presentations
- Engineering UI changes to public-facing screens
- Any content that users, prospects, or the public will see

**Review process:**
1. Creator completes their task issue
2. Chief of Staff detects `public-facing` tag and auto-creates blocking issue: "Brand review: {content}" assigned to Design Lead
3. Design Lead reviews against both visual and copy guidelines
4. **APPROVED** — gate issue marked "done". Content can ship.
5. **APPROVED WITH CHANGES** — minor issues noted in gate issue comment. Can ship after fixes. No re-review needed.
6. **REJECTED** — specific feedback in gate issue comment with references to violated guidelines. Content returns to creator. Must be re-reviewed after revision.

**What the Design Lead checks:**
- Colors match the approved palette (exact hex values, not "close enough")
- Typography follows the type scale (font family, sizes, weights, line heights)
- Spacing follows the spacing scale (no magic numbers)
- Imagery style matches brand guidelines (photography style, illustration style)
- Copy voice and tone match brand guidelines
- Messaging aligns with the approved messaging hierarchy
- No unapproved claims, superlatives, or competitor mentions
- Accessibility standards met (contrast, font size, alt text)
- Consistency with other live materials

**Review log:** Every review verdict is recorded as a comment on the gate issue with: date, reviewer, content reviewed, verdict, and findings.

---

## Design System Philosophy

The design system is the single source of truth for how the product looks and behaves. It exists to eliminate design ambiguity and ensure that any developer can implement any design without guessing.

### Core Principles

1. **Consistency over novelty** — every component serves the system. A flashy one-off that breaks the pattern is a bug, not a feature.
2. **Accessibility first** — WCAG 2.1 AA is the minimum. AAA where feasible. Accessibility is not a feature — it's a requirement.
3. **Mobile-first responsive** — design for the smallest screen first, enhance up. Not "desktop that shrinks."
4. **Performance-aware** — design choices consider load time and rendering cost. Heavy animations, large images, and complex layouts have a performance tax.
5. **Developer-friendly** — specs include exact CSS values, not "medium blue" or "some padding." Every value maps to a token.
6. **Token-driven** — all values derive from design tokens. No magic numbers in any component. If a value doesn't have a token, create one.

### Token Hierarchy

```
Brand Values (guidelines)
  +-- Design Tokens (CSS custom properties)
       |-- Color tokens (--color-primary-600, --color-neutral-100)
       |-- Typography tokens (--font-size-lg, --font-weight-bold)
       |-- Spacing tokens (--space-4, --space-8)
       |-- Shadow tokens (--shadow-sm, --shadow-lg)
       |-- Border tokens (--border-radius-md, --border-width-1)
       |-- Breakpoint tokens (--breakpoint-sm, --breakpoint-lg)
       |-- Z-index tokens (--z-dropdown, --z-modal)
       +-- Transition tokens (--transition-fast, --ease-in-out)
            +-- Component Styles (consume tokens only)
```

### Component Specification Standard

Every component in the design system must include:

| Section | Required Content |
|---------|-----------------|
| **Name & Purpose** | What it is, when to use it, when NOT to use it |
| **Variants** | All visual variants (primary, secondary, ghost, destructive, etc.) |
| **States** | default, hover, active, focus, disabled, loading, error |
| **Sizes** | If applicable (sm, md, lg) with exact dimensions |
| **Responsive** | Behavior at each breakpoint |
| **Accessibility** | ARIA attributes, keyboard interaction, focus management |
| **Tokens Used** | Every token the component consumes |
| **Code Example** | HTML structure with CSS classes/custom properties |
| **Do / Don't** | Usage guidelines with visual examples |

All stored as issue documents: `PUT /api/issues/{component-id}/documents/component-spec`

---

## Accessibility Standards

Every design deliverable must meet WCAG 2.1 AA. This is tested in both the BUILD and REVIEW phases.

### Required Checks

| Category | Standard | Measurement |
|----------|----------|-------------|
| **Color contrast** | 4.5:1 minimum for normal text, 3:1 for large text (18px+ or 14px+ bold) | Use contrast checker tool |
| **Focus indicators** | Visible on all interactive elements, minimum 2px outline | Visual inspection + keyboard testing |
| **Touch targets** | Minimum 44x44px on mobile | Measure in Chrome DevTools |
| **Screen reader** | All images have meaningful alt text, all form fields have labels, dynamic content has ARIA live regions | Screen reader testing |
| **Keyboard navigation** | Full functionality without mouse, logical tab order, no keyboard traps | Tab through entire flow |
| **Motion** | Respect `prefers-reduced-motion`, no auto-playing animations longer than 5 seconds | Media query check |
| **Font sizes** | Minimum 16px body text, scalable with user preferences, no text in images | Inspect computed styles |
| **Color independence** | Information not conveyed by color alone (use icons, patterns, labels) | Grayscale test |
| **Error identification** | Errors identified by text, not just color. Error messages are descriptive. | Form validation testing |
| **Heading hierarchy** | Logical heading order (h1 > h2 > h3), no skipped levels | DOM inspection |

### Severity Levels

| Level | Definition | Action Required |
|-------|-----------|-----------------|
| **Critical** | Users cannot complete a core task | Block ship. Fix immediately. |
| **Major** | Significant barrier for assistive technology users | Fix before ship. |
| **Minor** | Suboptimal but functional | Track in issue tree, fix in next cycle. |
| **Enhancement** | Beyond AA, toward AAA | Nice to have. Log for future. |

---

## Agent Team

| Agent | Role | Primary Phase(s) |
|-------|------|-------------------|
| **Design Lead** | Brand identity systems, brand guidelines enforcement, design tokens, component specs, visual asset creation, brand review quality gate, design system management, animation specs, production component builds. (Absorbs old brand-designer, design-system-lead, ui-designer, and motion-designer roles) | All phases — owns the spec and system |
| **UX Director** | Screenshot-based visual QA (Gemini adapter), end-to-end UX flow review, accessibility audits, cross-product UX consistency, wireframes, prototypes, information architecture, usability validation. Evaluates the built product from a human user's perspective. Reports to CTO, collaborates with Design Lead. | RESEARCH, EXPLORE (wireframes), REVIEW (visual QA, accessibility, usability) |

### Agent Interaction Model

The two design agents have clear ownership boundaries:

- **Design Lead** owns the **spec and system** — brand guidelines, design tokens, component specs, brand review gate. What it should look like, how it should be built.
- **UX Director** validates the **built implementation** — does it actually work for users? Visual QA via screenshots, accessibility, usability, cross-device testing.

**Design Lead has veto power on brand.** If Design Lead rejects a deliverable on brand grounds, it does not ship, regardless of other approvals. This is the quality gate.

**UX Director has veto power on usability and accessibility.** If UX Director finds critical usability or accessibility issues, they create blocking issues that must be resolved before ship.

---

## Interfaces with Other Teams

| Team | Design Sends | Design Receives |
|------|-------------|----------------|
| **Engineering** | Component specs (issue documents), design tokens (CSS/JSON), interaction specs, asset exports (issue attachments), engineering handoff doc | Technical constraints, implementation questions, browser/device limitations, performance budgets |
| **Marketing** | Brand review feedback (via gate issues), brand guidelines, approved assets | Content for brand review (via gate issues), campaign concepts, asset requests |
| **Product** | Wireframes, prototypes (issue attachments), UX research findings, usability reports, competitive UX analysis | User personas, feature requirements, competitive benchmarks, product briefs |
| **CS** | Help center styling, documentation templates, onboarding flow designs | User confusion reports, UX pain points from support tickets |
| **Legal** | Accessible design patterns, compliant form designs | Accessibility legal requirements, disclaimer placement needs |
| **DevOps** | Performance budgets for assets, CDN requirements for static assets | Hosting constraints, build pipeline requirements |

All cross-team handoffs are mediated by Chief of Staff creating issues with full context in issue documents.

---

## Anti-Patterns

- **"Make it pop"** — Every design decision needs a rationale tied to user needs or brand guidelines. Aesthetic preference without justification is not design.
- **Designing without research** — Skipping the RESEARCH phase means you're guessing. Guesses are expensive to fix.
- **One direction, take it or leave it** — Always explore 3+ directions. The first idea is rarely the best idea.
- **Magic numbers** — If a value doesn't map to a design token, it's a magic number. Magic numbers create inconsistency. Create a token or use an existing one.
- **"It's just internal"** — Internal tools deserve the same design rigor. Internal users are still users. (Brand review is still optional for internal tools, but design system compliance is not.)
- **Designing for desktop, then cramming mobile** — Mobile-first is not optional. Start at 320px and work up.
- **Accessibility as afterthought** — Bolting on accessibility at the end is 10x harder than building it in from the start. It's checked at BUILD and REVIEW, not just REVIEW.
- **Skipping the brand gate** — The brand review is mandatory for public-facing content. "We're in a hurry" is not an exemption. Brand damage takes months to repair.
- **"It looks right" as verification** — Test it. Check the contrast ratio. Tab through it. Try it with a screen reader. Inspect the actual CSS values.
- **Overwriting guidelines** — Brand guidelines are versioned and append-only. If something changes, document what changed and why in the issue. Never silently overwrite.
- **Standalone deliverable files** — All design deliverables belong as issue documents or attachments. Not orphaned files.
- **Undated deliverables** — If it doesn't have a date, you don't know if it's current. Date everything.
