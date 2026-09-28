# Tools -- Legal Counsel

## Core Tools

### Paperclip API
Coordination and issue management.
- Issue CRUD: `GET/POST/PATCH /api/companies/{companyId}/issues`
- Issue checkout: `POST /api/issues/{id}/checkout`
- Issue documents: `PUT /api/issues/{id}/documents/{key}` (use keys: `requirements`, `legal-review`, `compliance-assessment`)
- Issue attachments: `POST /api/issues/{id}/attachments` (legal documents, contracts, audit reports)
- Always include `X-Paperclip-Run-Id` header on mutating calls.

### Firecrawl
Legal and regulatory research.
- Regulatory updates: search for new privacy laws, AI regulations, tax law changes.
- Trademark searches: search USPTO database, common law trademark usage, domain availability.
- Competitor legal analysis: review competitor ToS, privacy policies, and compliance approaches.
- Open source license research: check license terms and compatibility requirements.
- Industry-specific compliance research: per-product regulatory landscape.

### Confluence (Atlassian MCP)
- Publish finalized legal documents (ToS, Privacy Policy, compliance reports).
- Read existing legal documentation and compliance records.
- Maintain legal knowledge base for cross-team reference.
- Use `createConfluencePage` for new legal publications.
- Use `updateConfluencePage` for document revisions (with version tracking).

### Google Sheets
- Compliance tracking matrices (regulation x product x status).
- Open source dependency audit logs.
- Tax deadline tracking.
- Contractor/vendor agreement tracking.

### Gmail (Gmail MCP)
- Legal correspondence when formal email is required.
- Regulatory inquiry responses.
- Partnership and vendor contract communications.

## Workspace

- Default cwd: `/home/eric/dev/`
- Legal artifacts: `products/<product>/legal/docs/`
  - `terms-of-service.md`
  - `privacy-policy.md`
  - `cookie-policy.md`
  - `gdpr-checklist.md`
  - `oss-audit-YYYY-MM-DD.md`
  - `compliance-log-YYYY.md`
- Contract templates: `teams/legal/templates/`
- IP registry: `shared/company/ip-registry.md`
- HR policies: `teams/legal/playbooks/hr/`
- No project workspace override -- legal review spans products.

## Skills

### para-memory-files
Memory operations: storing compliance decisions, regulatory updates, contract terms, IP filings, legal precedents.

### paperclip (core)
All Paperclip API interactions.
