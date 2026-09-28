# Tools -- DevOps Engineer

## Primary Tools

### Paperclip API
Task management, deploy gate tracking, incident issue creation.

Key endpoints:
- `GET /api/companies/{id}/issues?assigneeAgentId={id}` -- your assignments
- `POST /api/issues/{id}/checkout` -- claim tasks
- `POST /api/companies/{id}/issues` -- create incident issues, security findings
- `POST /api/issues/{id}/comments` -- deploy logs, status updates
- `PATCH /api/issues/{id}` -- update status
- `GET /api/issues/{id}/documents` -- read design docs and requirements

Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on mutating calls.

### GitHub CLI (`gh`)
CI/CD management and deployment:
- `gh run list` / `gh run view` -- check CI pipeline status
- `gh pr list` / `gh pr view` -- check PRs awaiting deploy
- `gh pr merge` -- merge PRs after all gates pass
- `gh release create` -- create versioned releases
- `gh workflow list` / `gh workflow view` -- manage GitHub Actions workflows
- `gh api` -- interact with GitHub API for branch protection, webhooks, etc.

### GitHub Actions
CI/CD pipeline configuration:
- Build workflows, test workflows, deploy workflows
- Environment-specific deploy configurations (staging, production)
- Automated security scans and dependency checks

### Docker
Container management:
- Dockerfile creation and optimization
- Docker Compose for local development environments
- Container image building and registry management
- Multi-stage builds for production optimization

### Firebase
Application hosting and services:
- Firebase Hosting configuration and deployment
- Cloud Functions management
- Firebase Auth configuration
- Firestore/Realtime Database rules

### Cloudflare
CDN, DNS, and edge security:
- DNS record management
- CDN configuration and cache policies
- SSL/TLS certificate management
- Web Application Firewall rules
- DDoS protection configuration

### Chrome DevTools
Production debugging:
- Network panel: verify API responses, check for errors
- Performance panel: identify bottlenecks
- Security panel: check certificate status, mixed content

### Firecrawl
Security research:
- CVE lookups for dependency vulnerabilities
- Security advisory monitoring
- Vendor security documentation

## Installed CLIs

These are globally installed and authenticated on the host. Use them directly via Bash.

### GitHub CLI (`gh`)
Repository and CI/CD management. Authenticated as `ricslash`.
- `gh repo list` / `gh repo view` — repo overview
- `gh pr create` / `gh pr merge` / `gh pr list` — PR management
- `gh run list` / `gh run view` / `gh run rerun` — CI/CD pipeline status
- `gh secret set` / `gh variable set` — configure GitHub Actions secrets and variables
- `gh release create` — create releases
- `gh api` — direct GitHub API access for anything not covered by subcommands

### Cloudflare CLI (`wrangler`)
DNS, CDN, Workers, Pages, and domain management. Authenticated as `epciesielski@gmail.com`.
- `wrangler pages` — manage Pages projects and deployments
- `wrangler d1` — manage D1 databases
- `wrangler r2` — manage R2 storage
- `wrangler secret` — manage Worker secrets
- `wrangler dns` — manage DNS records (use `wrangler dns list` / `wrangler dns create`)
- `wrangler deploy` — deploy Workers

### Google Cloud CLI (`gcloud`)
GCP project management, IAM, Cloud Run, Firestore, etc. Authenticated as `epciesielski@gmail.com`.
- `gcloud projects list` / `gcloud projects create` — project management
- `gcloud services enable` — enable APIs
- `gcloud iam service-accounts create` — service account management
- `gcloud run deploy` — Cloud Run deployments
- `gcloud firestore databases create` — Firestore setup
- `gcloud auth configure-docker` — configure Docker for GCR/Artifact Registry

### Firebase CLI (`firebase`)
Firebase project management, hosting, Firestore rules, functions. Authenticated as `epciesielski@gmail.com`.
- `firebase projects:list` — list projects
- `firebase deploy` — deploy hosting, functions, rules, indexes
- `firebase hosting:channel:deploy` — preview channel deployments
- `firebase firestore:indexes` — manage Firestore indexes
- `firebase emulators:start` — local emulator suite

### Stripe CLI (`stripe`)
Payment infrastructure management. Authenticated for account `acct_1TEV7fJn2cEY0lly`.
- `stripe listen --forward-to` — forward webhook events to local/dev endpoints
- `stripe trigger` — trigger test webhook events
- `stripe products list` / `stripe prices list` — inspect catalog
- `stripe customers list` — inspect customers
- `stripe logs tail` — real-time API log streaming

## Skills

### `para-memory-files`
Memory management. Infrastructure decisions, incident postmortems, deploy runbooks, security findings.

## Infrastructure Stack Reference

| Service | Provider | Used For |
|---------|----------|----------|
| Hosting | Firebase Hosting, Google Cloud | Application serving |
| CDN/DNS | Cloudflare | Performance, security, DNS |
| Containers | Docker / Docker Compose | Local dev, deployment |
| CI/CD | GitHub Actions | Build, test, deploy pipelines |
| Auth | Google OAuth | User authentication |
| Database | PostgreSQL, Supabase, Firebase | Data storage |

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

- **Fallback cwd:** `/home/eric/dev/`
- **Project override:** Yes -- when assigned a product-specific task, your cwd is set to the product repo (e.g., `/home/eric/dev/flowstate-saas/`). CI/CD configs and infra configs live in the product repo.
