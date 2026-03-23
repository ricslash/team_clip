# Paperclip — Dependency Inventory
_Last updated: 2026-03-23_

## Overview

Paperclip is a pnpm monorepo (pnpm 9.15.4, Node >= 20) with the following workspace packages:

| Package | Role |
|---------|------|
| `paperclip` (root) | Monorepo orchestration, dev scripts, e2e tests |
| `@paperclipai/server` | Express API server, heartbeat scheduler, adapter host |
| `@paperclipai/ui` | React 19 SPA (Vite + Tailwind) |
| `@paperclipai/db` | Drizzle ORM schema, migrations, seed scripts |
| `@paperclipai/shared` | Shared types and Zod schemas |
| `@paperclipai/adapter-utils` | Adapter interface types, billing, session compaction |
| `@paperclipai/adapter-claude-local` | Claude Code local adapter |
| `@paperclipai/adapter-codex-local` | OpenAI Codex local adapter |
| `@paperclipai/adapter-cursor-local` | Cursor IDE local adapter |
| `@paperclipai/adapter-gemini-local` | Gemini CLI local adapter |
| `@paperclipai/adapter-opencode-local` | OpenCode local adapter |
| `@paperclipai/adapter-pi-local` | Pi local adapter |
| `@paperclipai/adapter-openclaw-gateway` | OpenClaw remote gateway adapter (WebSocket) |
| `paperclipai` (cli) | CLI entry point (`paperclipai` command) |
| `@paperclipai/plugin-sdk` | Plugin SDK for worker-side + UI bridge |

---

## Root (`paperclip`)

### Dev Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| cross-env | ^10.1.0 | MIT | Cross-platform env vars in scripts | Low |
| @playwright/test | ^1.58.2 | Apache-2.0 | E2E / release smoke tests | Low — pin playwright browser versions |
| esbuild | ^0.27.3 | MIT | Fast JS/TS bundler (CLI build) | Low |
| typescript | ^5.7.3 | Apache-2.0 | Type checking | Low |
| vitest | ^3.0.5 | MIT | Unit/integration test runner | Low |

---

## Server (`@paperclipai/server`)

### Runtime Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| @aws-sdk/client-s3 | ^3.888.0 | Apache-2.0 | S3-compatible asset/storage uploads | Medium — large dep tree, API surface changes |
| ajv | ^8.18.0 | MIT | JSON Schema validation (plugin configs) | Low |
| ajv-formats | ^3.0.1 | MIT | Format validators for ajv | Low |
| better-auth | 1.4.18 | MIT | Authentication framework (session, OAuth) | Medium — pinned exact version, review changelogs |
| chokidar | ^4.0.3 | MIT | File system watcher (workspace changes) | Low |
| detect-port | ^2.1.0 | MIT | Find available ports (embedded-postgres, dev) | Low |
| dompurify | ^3.3.2 | Apache-2.0/MPL-2.0 | HTML sanitization | Low |
| dotenv | ^17.0.1 | BSD-2-Clause | .env file loading | Low |
| drizzle-orm | ^0.38.4 | Apache-2.0 | SQL ORM / query builder | Medium — active development, migration needed |
| embedded-postgres | ^18.1.0-beta.16 | MIT | Bundled PostgreSQL for local mode | High — beta, platform-specific binaries |
| express | ^5.1.0 | MIT | HTTP framework | Medium — Express 5 is relatively new |
| jsdom | ^28.1.0 | MIT | Server-side DOM (HTML processing) | Low |
| multer | ^2.0.2 | MIT | Multipart file upload middleware | Low |
| open | ^11.0.0 | MIT | Open URLs in default browser | Low |
| pino | ^9.6.0 | MIT | Structured JSON logger | Low |
| pino-http | ^10.4.0 | MIT | HTTP request logging middleware | Low |
| pino-pretty | ^13.1.3 | MIT | Dev-friendly log formatting | Low |
| ws | ^8.19.0 | MIT | WebSocket server (live events, OpenClaw) | Low |
| zod | ^3.24.2 | MIT | Runtime schema validation | Low |
| hermes-paperclip-adapter | 0.1.1 | Unknown | Hermes integration adapter | Medium — external, pinned |

### Dev Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| @types/express | ^5.0.0 | MIT | Express type defs | Low |
| @types/express-serve-static-core | ^5.0.0 | MIT | Express core types | Low |
| @types/jsdom | ^28.0.0 | MIT | jsdom type defs | Low |
| @types/multer | ^2.0.0 | MIT | multer type defs | Low |
| @types/node | ^24.6.0 | MIT | Node.js type defs | Low |
| @types/supertest | ^6.0.2 | MIT | supertest type defs | Low |
| @types/ws | ^8.18.1 | MIT | ws type defs | Low |
| cross-env | ^10.1.0 | MIT | Cross-platform env vars | Low |
| supertest | ^7.0.0 | MIT | HTTP assertion testing | Low |
| tsx | ^4.19.2 | MIT | TypeScript execution (dev mode) | Low |
| typescript | ^5.7.3 | Apache-2.0 | Type checking | Low |
| vite | ^6.1.0 | MIT | Dev middleware for UI | Low |
| vitest | ^3.0.5 | MIT | Test runner | Low |

---

## UI (`@paperclipai/ui`)

### Runtime Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| @dnd-kit/core | ^6.3.1 | MIT | Drag-and-drop primitives | Low |
| @dnd-kit/sortable | ^10.0.0 | MIT | Sortable lists (board columns, etc.) | Low |
| @dnd-kit/utilities | ^3.2.2 | MIT | DnD helper utilities | Low |
| @mdxeditor/editor | ^3.52.4 | MIT | Rich MDX/Markdown editor | Medium — large, frequent updates |
| @radix-ui/react-slot | ^1.2.4 | MIT | Slot composition primitive | Low |
| @tailwindcss/typography | ^0.5.19 | MIT | Prose typography styles | Low |
| @tanstack/react-query | ^5.90.21 | MIT | Server state / data fetching | Low |
| class-variance-authority | ^0.7.1 | Apache-2.0 | Variant-driven component styling | Low |
| clsx | ^2.1.1 | MIT | Conditional className builder | Low |
| cmdk | ^1.1.1 | MIT | Command palette component | Low |
| lucide-react | ^0.574.0 | ISC | Icon library | Low |
| mermaid | ^11.12.0 | MIT | Diagram/chart rendering | Medium — large bundle |
| radix-ui | ^1.4.3 | MIT | Accessible UI primitives | Low |
| react | ^19.0.0 | MIT | UI framework | Medium — React 19, verify ecosystem compat |
| react-dom | ^19.0.0 | MIT | React DOM renderer | Medium — paired with React 19 |
| react-markdown | ^10.1.0 | MIT | Markdown rendering | Low |
| react-router-dom | ^7.1.5 | MIT | Client-side routing | Low |
| remark-gfm | ^4.0.1 | MIT | GitHub-flavored Markdown support | Low |
| tailwind-merge | ^3.4.1 | MIT | Tailwind class conflict resolution | Low |

### Dev Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| @tailwindcss/vite | ^4.0.7 | MIT | Tailwind Vite integration | Low |
| @types/node | ^25.2.3 | MIT | Node.js type defs | Low |
| @types/react | ^19.0.8 | MIT | React type defs | Low |
| @types/react-dom | ^19.0.3 | MIT | ReactDOM type defs | Low |
| @vitejs/plugin-react | ^4.3.4 | MIT | Vite React plugin (JSX, Fast Refresh) | Low |
| tailwindcss | ^4.0.7 | MIT | Utility-first CSS framework | Low |
| typescript | ^5.7.3 | Apache-2.0 | Type checking | Low |
| vite | ^6.1.0 | MIT | Dev server / bundler | Low |
| vitest | ^3.0.5 | MIT | Test runner | Low |

---

## Database (`@paperclipai/db`)

### Runtime Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| drizzle-orm | ^0.38.4 | Apache-2.0 | ORM / query builder | Medium |
| embedded-postgres | ^18.1.0-beta.16 | MIT | Bundled PostgreSQL | High — beta |
| postgres | ^3.4.5 | Unlicense | PostgreSQL client driver (postgres.js) | Low |

### Dev Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| drizzle-kit | ^0.31.9 | MIT | Migration generator | Medium — keep in sync with drizzle-orm |
| tsx | ^4.19.2 | MIT | TS execution for seed/migrate scripts | Low |
| typescript | ^5.7.3 | Apache-2.0 | Type checking | Low |
| vitest | ^3.0.5 | MIT | Test runner | Low |

---

## Shared (`@paperclipai/shared`)

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| zod | ^3.24.2 | MIT | Schema validation, shared types | Low |

---

## Adapter Utils (`@paperclipai/adapter-utils`)

No runtime dependencies. Dev-only: `@types/node`, `typescript`.

---

## Adapter Packages (claude-local, codex-local, cursor-local, gemini-local, opencode-local, pi-local)

All local adapters share the same dependency pattern:

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| @paperclipai/adapter-utils | workspace:* | MIT | Shared adapter types | N/A (internal) |
| picocolors | ^1.1.1 | ISC | Terminal color output | Low |

## OpenClaw Gateway Adapter

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| @paperclipai/adapter-utils | workspace:* | MIT | Shared adapter types | N/A (internal) |
| picocolors | ^1.1.1 | ISC | Terminal color output | Low |
| ws | ^8.19.0 | MIT | WebSocket client for gateway | Low |

---

## CLI (`paperclipai`)

### Runtime Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| @clack/prompts | ^0.10.0 | MIT | Interactive CLI prompts | Low |
| commander | ^13.1.0 | MIT | CLI argument parsing | Low |
| dotenv | ^17.0.1 | BSD-2-Clause | .env file loading | Low |
| drizzle-orm | 0.38.4 | Apache-2.0 | Database access (pinned) | Medium — keep synced with db package |
| embedded-postgres | ^18.1.0-beta.16 | MIT | Bundled PostgreSQL | High — beta |
| picocolors | ^1.1.1 | ISC | Terminal colors | Low |

---

## Plugin SDK (`@paperclipai/plugin-sdk`)

### Runtime Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| @paperclipai/shared | workspace:* | MIT | Shared types | N/A (internal) |
| zod | ^3.24.2 | MIT | Schema validation | Low |

### Peer Dependencies

| Package | Version | License | Purpose | Upgrade Risk |
|---------|---------|---------|---------|-------------|
| react | >=18 | MIT | Optional — UI bridge hooks | Low |

---

## High-Risk Dependencies Summary

| Package | Risk | Reason |
|---------|------|--------|
| embedded-postgres ^18.1.0-beta.16 | **High** | Beta release; platform-specific native binaries; used in 3 packages (server, db, cli) |
| express ^5.1.0 | **Medium** | Express 5 is relatively new; middleware compat may differ from v4 |
| better-auth 1.4.18 | **Medium** | Pinned exact version; authentication is security-critical; review before bumping |
| drizzle-orm ^0.38.4 | **Medium** | Active development with potential breaking migration schema changes |
| react ^19.0.0 | **Medium** | React 19 is relatively new; verify all UI library peers support it |
| hermes-paperclip-adapter 0.1.1 | **Medium** | External package at 0.x; pinned; unknown license |
| @aws-sdk/client-s3 ^3.888.0 | **Medium** | Very large dependency tree; frequent AWS SDK releases |
