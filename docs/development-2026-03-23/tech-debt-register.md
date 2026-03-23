# Paperclip — Tech Debt Register

_Last updated: 2026-03-23_

## Overview

This register tracks technical debt items identified through code analysis. Items are categorized by severity and type.

**Severity scale:** Critical > High > Medium > Low
**Effort scale:** XS (< 1h) | S (1-4h) | M (4-16h) | L (2-5d) | XL (> 5d)

---

## TD-001: Disabled Skills UI (Commented-Out Code)

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Category** | Dead code |
| **Location** | `ui/src/pages/AgentDetail.tsx` (lines 711, 872, 969) |
| **Description** | The Skills tab, view routing, and panel are commented out with `// TODO: bring back later`. Three separate blocks of disabled UI code remain in the component. |
| **Impact** | Increases component complexity, confuses new contributors, creates merge conflict risk. |
| **Proposed Fix** | Either re-enable the feature or extract the code to a feature-flagged branch/component. Remove inline comments if the timeline is not imminent. |
| **Effort** | S |

---

## TD-002: Disabled Worktree UI

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Category** | Dead code |
| **Location** | `ui/src/adapters/runtime-json-fields.tsx` (line 5) |
| **Description** | `TODO(issue-worktree-support)` — entire UI for issue-level worktree configuration is disabled pending workflow finalization. |
| **Impact** | Feature gap; users cannot configure worktree settings through the UI. |
| **Proposed Fix** | Complete the worktree workflow and re-enable, or remove if the approach has been abandoned. |
| **Effort** | M |

---

## TD-003: Widespread `eslint-disable react-hooks/exhaustive-deps`

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Category** | Code quality / potential bugs |
| **Location** | 7 files across the UI: `AgentConfigForm.tsx:205`, `NewAgent.tsx:109`, `GoalDetail.tsx:111`, `IssueDetail.tsx:586,595`, `useDateRange.ts:104`, `launchers.tsx:625`, `bridge.ts:297` |
| **Description** | React hooks dependency arrays are manually overridden to suppress exhaustive-deps warnings. This commonly causes stale closure bugs where effects or memos reference outdated state. |
| **Impact** | Risk of subtle UI bugs (stale data, missed re-renders, infinite loops). Difficult to debug. |
| **Proposed Fix** | Audit each suppression: either add the missing dependencies (with appropriate guards) or restructure to use refs/callbacks. Extract complex effects into custom hooks with proper dependency tracking. |
| **Effort** | M |

---

## TD-004: `as any` Type Assertions (76 occurrences across 24 files)

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Category** | Type safety |
| **Location** | 24 files across `server/src/`, `ui/src/`, `packages/plugins/sdk/` (76 total occurrences) |
| **Description** | Widespread use of `as any` type assertions bypasses TypeScript's type checking. Highest concentration in test files and plugin infrastructure (`server/src/__tests__/`, `server/src/services/plugin-*`, `server/src/index.ts`). |
| **Impact** | Type errors silently pass compilation. Runtime crashes from type mismatches are possible. Reduces confidence in refactors. |
| **Proposed Fix** | Replace with proper typing, `unknown` + type guards, or `satisfies` where applicable. Prioritize non-test production code (server/src/index.ts has 7, plugin infrastructure has ~20). Tests can be lower priority. |
| **Effort** | L |

---

## TD-005: `eslint-disable` Annotations in Plugin Infrastructure

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Category** | Code quality |
| **Location** | `server/src/services/plugin-runtime-sandbox.ts:161`, `server/src/services/plugin-config-validator.ts:31`, `packages/plugins/sdk/src/dev-cli.ts:34,51`, `packages/plugins/create-paperclip-plugin/src/index.ts:470,490` |
| **Description** | Plugin-related code uses `eslint-disable` for `no-dynamic-delete`, `no-explicit-any`, and `no-console`. The sandbox's dynamic delete and validator's explicit any are concerning in security-sensitive code. |
| **Impact** | Dynamic delete in sandbox code could introduce prototype pollution vectors. Explicit any in config validation weakens input validation guarantees. |
| **Proposed Fix** | Replace dynamic delete with `Map` or `Reflect.deleteProperty` with validation. Type the config validator properly. Console usage in CLI tools is acceptable. |
| **Effort** | S |

---

## TD-006: Beta Database Dependency (`embedded-postgres`)

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Category** | Dependency risk |
| **Location** | `server/package.json`, `cli/package.json`, `packages/db/package.json` |
| **Description** | `embedded-postgres@18.1.0-beta.16` is used across 3 packages. Beta releases may have data integrity issues, platform compatibility problems, or breaking changes without warning. |
| **Impact** | Potential data loss, startup failures on certain platforms, blocked upgrades. |
| **Proposed Fix** | Monitor for stable release. Document external PostgreSQL setup as a production alternative. Add integration tests for embedded-postgres startup/shutdown paths. |
| **Effort** | M |

---

## TD-007: Pinned External Adapter (`hermes-paperclip-adapter`)

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Category** | Dependency risk |
| **Location** | `server/package.json` — `hermes-paperclip-adapter: 0.1.1` |
| **Description** | External adapter pinned at v0.1.1. Unlike workspace adapters, this is an npm dependency with no direct control over its release cadence or breaking changes. |
| **Impact** | Could fall behind on security patches or API compatibility. No visibility into its maintenance status. |
| **Proposed Fix** | Evaluate whether this should be brought into the workspace as a first-party adapter, or establish a monitoring/update cadence. |
| **Effort** | M |

---

## TD-008: Pinned Auth Library (`better-auth`)

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Category** | Dependency risk / security |
| **Location** | `server/package.json` — `better-auth: 1.4.18` (exact version, not range) |
| **Description** | Authentication library is pinned to an exact version rather than a semver range. This prevents automatic minor/patch updates including security fixes. |
| **Impact** | Security vulnerabilities in the auth layer will not be picked up by automated dependency updates. |
| **Proposed Fix** | Evaluate whether the pin is intentional (breaking change avoidance) and if so, set up a reminder/bot to check for security-relevant updates. Consider moving to `^1.4.18`. |
| **Effort** | XS |

---

## TD-009: No Test Files for Core UI Pages

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Category** | Test coverage |
| **Location** | `ui/src/pages/`, `ui/src/components/` |
| **Description** | No test files were found alongside core UI pages (AgentDetail, IssueDetail, GoalDetail, NewAgent). Server has test files in `__tests__/` but the UI has no corresponding test directory. |
| **Impact** | UI regressions go undetected. Refactoring is high-risk. |
| **Proposed Fix** | Add component tests using vitest + React Testing Library for critical pages. Start with AgentDetail and IssueDetail as they are the most complex. |
| **Effort** | L |

---

## TD-010: Silent Adapter Fallback

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Category** | Error handling |
| **Location** | `server/src/adapters/registry.ts:179` |
| **Description** | `getServerAdapter()` falls back to the generic `processAdapter` for unknown adapter types rather than throwing an error. Comment: "Fall back to process adapter for unknown types". |
| **Impact** | Misconfigured agents silently use the wrong adapter, leading to confusing runtime behavior. |
| **Proposed Fix** | Log a warning when falling back, or throw if the adapter type looks intentional (not `process` or `http`). |
| **Effort** | XS |

---

## TD-011: `eslint-disable no-var` in Plugin Bridge

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Category** | Code quality |
| **Location** | `ui/src/plugins/bridge-init.ts:40` |
| **Description** | Uses `var` declaration (suppressing lint) likely for global scope attachment in the plugin bridge initialization. |
| **Impact** | Minor; `var` hoisting can cause subtle scope issues, but in initialization code the risk is low. |
| **Proposed Fix** | Refactor to use a module-scoped `let`/`const` with explicit `globalThis` attachment if global access is needed. |
| **Effort** | XS |

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 3 (TD-003, TD-004, TD-006) |
| Medium | 5 (TD-001, TD-005, TD-007, TD-008, TD-009) |
| Low | 3 (TD-002, TD-010, TD-011) |

**Recommended priority order:** TD-003 (hooks deps) > TD-004 (`as any`) > TD-006 (embedded-postgres risk) > TD-009 (UI tests) > TD-008 (auth pin) > TD-005 (plugin eslint) > TD-001 (dead code) > TD-007 (hermes) > TD-010 (fallback) > TD-002 (worktree) > TD-011 (no-var)
