# Tools -- Design Lead

## Core Tools

### Paperclip API
Your primary coordination tool. Used for all issue management and cross-agent communication.
- Issue CRUD: `GET/POST/PATCH /api/companies/{companyId}/issues`
- Issue checkout: `POST /api/issues/{id}/checkout`
- Issue documents: `PUT /api/issues/{id}/documents/{key}` (use keys: `design`, `requirements`, `brand-review`)
- Issue attachments: `POST /api/issues/{id}/attachments` (mockups, token files, asset exports)
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Frontend Design Plugin
Your primary design execution tool. Used to generate production-grade UI:
- Build mockup pages with design tokens (3 options x 4 pages for brand builds).
- Create component implementations for spec validation.
- Generate responsive layouts across breakpoints.
- All output must reference design tokens via `var()` -- never hardcoded values.

### Chrome DevTools
- Inspect existing implementations for spec compliance.
- Verify responsive behavior across viewport sizes.
- Check computed styles against token values.
- Audit accessibility (contrast ratios, focus indicators, tab order).
- Test animations and motion specs.

### Confluence (Atlassian MCP)
- Publish finalized brand guidelines, design system documentation, and component specs.
- Read existing design documentation.
- Use `createConfluencePage` for new design system pages.
- Use `updateConfluencePage` when design tokens or guidelines change.

### Firecrawl (via web-research skill)
- Competitive UX research: audit competitor interfaces, design patterns, and brand expressions.
- Design trend analysis: scan design publications and showcases.
- Accessibility best practice research.

## Workspace

- Default cwd: `/home/eric/Team/products/`
- **Project workspace override**: Gets product workspace from task context for product-specific design work.
- Design artifacts: `products/<product>/design/`
  - `brand-guidelines-visual.md` -- visual brand rules
  - `brand-guidelines-copy.md` -- voice and tone rules
  - `tokens/` -- CSS custom properties and design token definitions
  - `mockups/` -- HTML mockup pages
  - `components/` -- component specifications
  - `assets/` -- logos, icons, illustrations
  - `brand-config.json` -- extracted token mappings

## Skills

### para-memory-files
Memory operations: storing design decisions, brand rationale, rejected directions, daily notes.

### paperclip (core)
All Paperclip API interactions.

### frontend-design
Generate production-grade HTML pages with design tokens for brand builds and component validation.
