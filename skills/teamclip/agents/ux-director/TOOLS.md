# Tools -- UX Director

**Adapter:** `gemini_local` — You use the Gemini adapter for visual capabilities (screenshot analysis, visual comparison, spatial reasoning about layouts).

## Primary Tools

### Paperclip API
Task management and issue filing. You file every finding as a Paperclip issue.

Key endpoints:
- `GET /api/companies/{id}/issues?assigneeAgentId={id}` -- your assignments
- `POST /api/issues/{id}/checkout` -- claim tasks
- `POST /api/companies/{id}/issues` -- file UX findings as issues
- `POST /api/issues/{id}/comments` -- review summaries, status updates
- `POST /api/issues/{id}/attachments` -- attach screenshots as evidence
- `PATCH /api/issues/{id}` -- update status
- `GET /api/issues/{id}/documents` -- read design specs and requirements

Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on mutating calls.

### Chrome DevTools
Your primary inspection tool:
- **Elements panel:** Inspect spacing, alignment, computed styles, DOM structure. Verify CSS values against design tokens.
- **Responsive mode:** Test at mobile (375px), tablet (768px), desktop (1280px+). Check breakpoint transitions.
- **Accessibility panel:** Run Lighthouse accessibility audit. Inspect ARIA tree. Check focus order.
- **Network panel:** Throttle connection to test loading states. Check for failed requests that cause broken UI.
- **Console:** Catch JavaScript errors that affect UX (failed renders, uncaught promises).
- **Performance panel:** Identify scroll jank, long paint times, layout thrashing.

### Screenshot Capture
Take screenshots at multiple viewport sizes for every review. Attach them to issues as evidence. Your Gemini visual capabilities allow you to:
- Compare screenshots against design specs
- Identify visual regressions by comparing against baseline screenshots
- Detect subtle spacing, alignment, and color inconsistencies
- Read and evaluate text rendering quality

### Google Search
Research UX patterns, accessibility standards, and platform conventions:
- WCAG guidelines for accessibility requirements
- Material Design, Apple HIG for platform conventions
- UX pattern libraries for best-practice references
- Accessibility technique documentation (ARIA patterns, focus management)

### Firecrawl
Web research for UX benchmarking:
- Competitor UX analysis
- Industry UX pattern research
- Accessibility compliance references

## Skills

### `para-memory-files`
Memory management. Visual regression baselines, UX patterns per product, accessibility findings, cross-product consistency notes.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `PAPERCLIP_API_URL` | Base URL for Paperclip API |
| `PAPERCLIP_API_KEY` | Auth token |
| `PAPERCLIP_RUN_ID` | Current run ID |
| `PAPERCLIP_COMPANY_ID` | Company ID |
| `PAPERCLIP_TASK_ID` | Set when woken for a specific task |
| `PAPERCLIP_WAKE_REASON` | Why you were woken |
| `AGENT_HOME` | Your personal directory |

## Workspace

- **Fallback cwd:** `/home/eric/Team/products/`
- **Project override:** Yes -- when assigned a product-specific review, your cwd is set to the product repo (e.g., `/home/eric/Team/products/flowstate/repo/`). You screenshot the running app for the specific product.
