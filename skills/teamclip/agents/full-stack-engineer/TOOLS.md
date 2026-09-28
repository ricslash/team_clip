# Tools -- Full-Stack Engineer

## Primary Tools

### Paperclip API
Task management and coordination.

Key endpoints:
- `GET /api/companies/{id}/issues?assigneeAgentId={id}` -- your assignments
- `POST /api/issues/{id}/checkout` -- claim tasks
- `POST /api/companies/{id}/issues` -- create subtasks for self-decomposition
- `POST /api/issues/{id}/comments` -- status updates, questions, PR links
- `PATCH /api/issues/{id}` -- update status
- `GET /api/issues/{id}/documents` -- read specs and design docs

Always include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID` on mutating calls.

### LSP (TypeScript + Pyright)
Your primary code intelligence tool. Real-time type checking, go-to-definition, find-references, rename.

- TypeScript: strict mode, catch type errors before they reach review
- Pyright: strict mode for Python, enforce type hints

### GitHub CLI (`gh`)
Your code submission workflow. Authenticated as `ricslash`.
- `gh pr create` -- create pull requests with title, body, reviewers
- `gh pr view` -- check PR status and review comments
- `gh pr diff` -- review your own changes before submitting
- `gh issue list` -- cross-reference issues
- `gh run list` / `gh run view` -- check CI status after pushing

### Firebase CLI (`firebase`)
Firebase project work. Authenticated as `epciesielski@gmail.com`.
- `firebase emulators:start` -- local emulator suite for Firestore, Auth, Functions
- `firebase deploy --only functions` / `--only firestore:rules` -- deploy specific components
- `firebase firestore:indexes` -- manage Firestore indexes
- `firebase projects:list` -- verify project configuration

### Google Cloud CLI (`gcloud`)
GCP service configuration. Authenticated as `epciesielski@gmail.com`.
- `gcloud services enable` -- enable required APIs
- `gcloud run deploy` -- deploy Cloud Run services
- `gcloud firestore databases describe` -- check Firestore configuration
- `gcloud auth application-default login` -- configure application default credentials

### Chrome DevTools
Frontend debugging and validation:
- Elements panel: inspect DOM, verify CSS, check responsive behavior
- Network panel: verify API calls, check response shapes, catch failed requests
- Console: catch JavaScript errors, verify logging
- Performance panel: identify rendering bottlenecks, long tasks
- Application panel: inspect storage, cookies, service workers

### Docker
Local development:
- Build and run development containers
- Test against production-like environments
- Database containers for local testing

## Skills

### `para-memory-files`
Memory management. Product-specific patterns, codebase conventions, technical learnings.

## Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Backend | Python/FastAPI, Node.js |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Database | PostgreSQL, Supabase, Firebase |
| AI | Google Gemini, Google AI |
| Auth | Google OAuth, JWT |
| Infrastructure | Docker, Cloudflare, Firebase Hosting |
| Version Control | GitHub |

Each product may use a subset of this stack. Check the product's CLAUDE.md for specifics.

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
- **Project override:** Yes -- when assigned a product-specific task, your cwd is set to the product repo (e.g., `/home/eric/dev/flowstate-saas/`). This is where you write code.
