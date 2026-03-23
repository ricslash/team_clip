# Paperclip — UAT Test Scripts

_Last updated: 2026-03-23_

---

## How to Use This Document

Each test case includes an ID, feature area, preconditions, step-by-step instructions, expected results, and a pass/fail column. Execute each test in order within its section. Mark the result column as you go.

---

## 1. Onboarding Flow

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| ONB-01 | First-time onboarding | Clean Paperclip instance with no companies | 1. Open the app root URL `/`. 2. Observe the landing page. | The "Create your first company" prompt appears with a "New Company" button. | |
| ONB-02 | Step 1 — Name company | ONB-01 completed, wizard is open | 1. Click "New Company" (or confirm wizard opens automatically). 2. Verify the heading "Name your company" is visible. 3. Enter "UAT Test Corp" in the company name field (placeholder: "Acme Corp"). 4. Click "Next". | The wizard advances to Step 2. | |
| ONB-03 | Step 2 — Create agent | ONB-02 completed | 1. Verify the heading "Create your first agent" is visible. 2. Confirm the agent name field defaults to "CEO". 3. Verify Claude Code and Codex are shown as recommended adapters. 4. Click "More Agent Adapter Types" to expand the list. 5. Select "Process" adapter. 6. Enter "echo" in the command field. 7. Enter "hello" in the args field. 8. Click "Next". | The wizard advances to Step 3. | |
| ONB-04 | Step 3 — Create task | ONB-03 completed | 1. Verify the heading "Give it something to do" is visible. 2. Clear the task title field and enter "UAT test task". 3. Click "Next". | The wizard advances to Step 4. | |
| ONB-05 | Step 4 — Launch | ONB-04 completed | 1. Verify the heading "Ready to launch" is visible. 2. Confirm "UAT Test Corp", "CEO", and "UAT test task" are displayed in the summary. 3. Click "Create & Open Issue". | The browser navigates to an issue detail URL matching `/issues/`. The company, agent, and issue are created in the database. | |
| ONB-06 | API verification | ONB-05 completed | 1. Call `GET /api/companies` and verify "UAT Test Corp" exists. 2. Call `GET /api/companies/{companyId}/agents` and verify an agent named "CEO" with role "ceo" and adapterType "process" exists. 3. Call `GET /api/companies/{companyId}/issues` and verify an issue titled "UAT test task" exists and is assigned to the CEO agent. | All three API calls return the expected records. | |
| ONB-07 | Re-run onboarding | At least one company exists | 1. Navigate to `/onboarding`. 2. Verify the page says "Create another company". 3. Click "Start Onboarding" and verify the wizard opens. | The wizard opens for a second company creation. | |

---

## 2. Company CRUD

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| CMP-01 | View companies | At least one company exists | 1. Navigate to `/companies`. 2. Verify all companies are listed with agent count, issue count, spend, and creation date. | Company list renders correctly with stats. | |
| CMP-02 | Create company | User is on the Companies page | 1. Click "New Company". 2. Complete the onboarding wizard with company name "Second Corp". 3. Return to `/companies`. | "Second Corp" appears in the company list. | |
| CMP-03 | Rename company | At least one company exists | 1. On the Companies page, click the menu icon (three dots) on a company card. 2. Select rename. 3. Change the name to "Renamed Corp". 4. Confirm the edit. | The company name updates to "Renamed Corp" immediately. | |
| CMP-04 | Delete company | At least two companies exist | 1. Click the menu icon on a company card. 2. Select delete. 3. Confirm the deletion. | The company is removed from the list. | |
| CMP-05 | Switch company | At least two companies exist | 1. Click on a different company in the sidebar or Companies page. | The dashboard, agents, issues, and all pages update to reflect the selected company. | |
| CMP-06 | Company settings | A company is selected | 1. Navigate to Company Settings. 2. Update the company name, description, and brand color. 3. Upload a logo image. 4. Save changes. | All fields persist after page refresh. Logo displays in the sidebar. | |

---

## 3. Agent Lifecycle

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| AGT-01 | View agents list | A company with at least one agent is selected | 1. Navigate to `/agents/all`. 2. Verify agents are listed with name, role, adapter type, last heartbeat, and status. | Agent list renders correctly. | |
| AGT-02 | Toggle list/org view | AGT-01 preconditions met (desktop viewport) | 1. Click the org chart toggle button. 2. Verify agents display in a tree hierarchy. 3. Click the list toggle button. 4. Verify agents display as a flat list. | Both views render correctly and switch without errors. | |
| AGT-03 | Filter agents | At least one active and one paused agent exist | 1. Click the "Active" tab. 2. Verify only active/running/idle agents are shown. 3. Click the "Paused" tab. 4. Verify only paused agents are shown. 5. Click "All" tab. | Each tab filters correctly. Count label matches visible agents. | |
| AGT-04 | Show terminated | At least one terminated agent exists | 1. Click "Filters". 2. Check "Show terminated". 3. Verify terminated agents appear in the list. 4. Uncheck "Show terminated". | Terminated agents appear and disappear based on the filter toggle. | |
| AGT-05 | Create agent | A company is selected | 1. Click "New Agent". 2. Enter name "Test Engineer". 3. Set role to "Engineer". 4. Select "Claude Code" adapter. 5. Fill in required adapter settings. 6. Save/create the agent. | The new agent appears in the agents list with status "active". | |
| AGT-06 | View agent detail | At least one agent exists | 1. Click on an agent name. 2. Verify the detail page loads with overview, configuration, runs, and budget tabs. | All tabs render without errors. Agent name, role, and status are displayed. | |
| AGT-07 | Pause agent | An active agent exists | 1. Open the agent detail page. 2. Click the Pause action. | Agent status changes to "paused". Status badge updates. | |
| AGT-08 | Resume agent | A paused agent exists | 1. Open the paused agent's detail page. 2. Click the Resume action. | Agent status changes to "active". Status badge updates. | |
| AGT-09 | Terminate agent | An active or paused agent exists | 1. Open the agent detail page. 2. Click the Terminate action. 3. Confirm the action. | Agent status changes to "terminated". | |
| AGT-10 | Manual wakeup | An active agent with heartbeat enabled | 1. Open the agent detail page. 2. Click "Wake up" or "Invoke heartbeat". | A new heartbeat run is created and appears in the runs tab. | |
| AGT-11 | Edit agent config | An agent exists | 1. Open agent detail, go to Configuration tab. 2. Change the agent's title or model. 3. Save. 4. Refresh the page. | Changes persist after refresh. | |
| AGT-12 | Delete agent | An agent exists | 1. Open the agent detail page. 2. Click delete from the actions menu. 3. Confirm deletion. | The agent is removed. Navigating to `/agents` no longer shows it. | |

---

## 4. Issue Lifecycle

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| ISS-01 | View issues list | A company with issues is selected | 1. Navigate to `/issues`. 2. Verify issues are listed with status, priority, identifier, assignee, and time since last update. | Issues render correctly. | |
| ISS-02 | Search issues | At least 3 issues with different titles exist | 1. Type a keyword from one issue title into the search bar. 2. Wait for the debounce (300ms). | Only matching issues are shown. The URL updates with `?q=keyword`. | |
| ISS-03 | Filter by assignee | Issues assigned to different agents exist | 1. Apply the assignee filter for a specific agent. | Only issues assigned to that agent are displayed. | |
| ISS-04 | Create issue | A company with at least one agent is selected | 1. Open the new issue dialog. 2. Enter title "UAT Issue Test". 3. Select an assignee agent. 4. Set priority. 5. Optionally link to a project. 6. Submit. | The issue appears in the issues list with the correct title, assignee, and priority. | |
| ISS-05 | View issue detail | At least one issue exists | 1. Click on an issue in the list. 2. Verify the detail page shows title, description, status, priority, assignee, and comments. | All fields render correctly. | |
| ISS-06 | Change issue status | An issue in "open" status exists | 1. Open the issue detail. 2. Change status to "in_progress". 3. Verify the status badge updates. 4. Change status to "done". | Status updates are reflected immediately and persist on refresh. | |
| ISS-07 | Add comment | An issue exists | 1. Open the issue detail. 2. Write a comment in the comment box. 3. Submit. | The comment appears in the thread with timestamp. | |
| ISS-08 | Edit issue title | An issue exists | 1. Open the issue detail. 2. Edit the title. 3. Save. | The new title persists on refresh and in the issues list. | |
| ISS-09 | Assign/reassign | An issue exists, multiple agents exist | 1. Open the issue detail. 2. Change the assignee to a different agent. 3. Save. | The assignee updates. The new agent can see the issue in their workload. | |
| ISS-10 | Live run indicator | An agent is actively running on an issue | 1. Navigate to `/issues`. 2. Find the issue with a live run. | A pulsing blue "Live" badge appears on the issue row. | |
| ISS-11 | Issue documents | An issue exists | 1. Open the issue detail. 2. Attach a document or file. 3. Verify the attachment appears. 4. Download the attachment. | Upload, display, and download work correctly. | |

---

## 5. Project and Goal Management

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| PRJ-01 | View projects | A company is selected | 1. Navigate to `/projects`. 2. Verify projects are listed with name, description, target date, and status. | Projects render correctly. | |
| PRJ-02 | Create project | A company is selected | 1. Click "Add Project". 2. Enter name "UAT Project". 3. Add a description and target date. 4. Save. | The project appears in the projects list. | |
| PRJ-03 | Project detail tabs | A project with issues exists | 1. Click on a project. 2. Navigate through Overview, Issues, Configuration, and Budget tabs. | Each tab loads without errors and shows relevant data. | |
| PRJ-04 | Archive project | A project exists | 1. Open the project detail. 2. Click archive. 3. Confirm. | The project no longer appears in the default projects list. A toast notification confirms archival. The user is redirected to the dashboard. | |
| PRJ-05 | View goals | A company is selected | 1. Navigate to `/goals`. | Goals are displayed as a tree. An "Add Goal" button is available. | |
| PRJ-06 | Create goal | A company is selected | 1. Click "New Goal". 2. Enter a goal title and description. 3. Save. | The goal appears in the goal tree. | |
| PRJ-07 | Goal detail | A goal exists | 1. Click on a goal. 2. Verify the detail page shows the goal information and linked projects/issues. | Detail page renders correctly. | |
| PRJ-08 | Goal hierarchy | Multiple goals exist | 1. Create a sub-goal under an existing goal. 2. Navigate to `/goals`. | The sub-goal appears nested under its parent in the tree view. | |

---

## 6. Approval Workflow

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| APR-01 | View pending approvals | At least one pending approval exists | 1. Navigate to `/approvals/pending`. | Pending approvals are listed with requester, description, and submission time. The badge count matches. | |
| APR-02 | View all approvals | Approvals in various statuses exist | 1. Click the "All" tab. | All approvals are shown regardless of status, sorted by most recent first. | |
| APR-03 | Approve request | A pending approval exists | 1. Click "Approve" on an approval card. | The approval moves to approved status. The page navigates to the approval detail with `?resolved=approved`. The agent can proceed with the approved action. | |
| APR-04 | Reject request | A pending approval exists | 1. Click "Reject" on an approval card. | The approval moves to rejected status. The approval list refreshes. | |
| APR-05 | Approval detail | An approval exists | 1. Click on an approval to open its detail page. 2. Verify comments, linked issues, and full approval context are shown. | Detail page renders all approval information. | |
| APR-06 | Resubmit approval | A rejected or revision-requested approval exists | 1. Open the approval detail. 2. Click "Resubmit" with updated information. | The approval returns to pending status and appears in the pending queue. | |
| APR-07 | Approval comments | An approval exists | 1. Open approval detail. 2. Add a comment. 3. Verify it appears in the thread. | Comment is persisted and visible. | |
| APR-08 | Idempotent approval | A pending approval exists | 1. Click "Approve" twice in rapid succession. | Only one approval record is created. No duplicate errors. | |

---

## 7. Cost Tracking

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| CST-01 | View costs page | A company with cost data exists | 1. Navigate to `/costs`. 2. Verify spend metrics, provider breakdown, and agent breakdown are displayed. | All cost sections render with correct formatting (dollar amounts, token counts). | |
| CST-02 | Date range filter | Cost data spans multiple weeks | 1. Change the date range preset (e.g., current week, current month). 2. Verify the displayed costs update accordingly. | Costs filter correctly to the selected date range. | |
| CST-03 | Provider breakdown | Costs from multiple providers exist | 1. View the provider tabs on the costs page. 2. Click each provider tab. | Each tab shows the correct token counts and dollar amounts for that provider. | |
| CST-04 | Budget policy view | At least one budget policy is configured | 1. Locate the budget policies section. 2. Verify policies show spending limits. | Budget policies display correctly. | |
| CST-05 | Budget incident | An agent has exceeded its budget | 1. Navigate to `/costs`. 2. Verify the budget incident banner appears on the dashboard. 3. Verify the incident card shows which agents/projects are paused. | Incident details are accurate. The dashboard banner links to the costs page. | |
| CST-06 | Budget override approval | An agent triggers a budget override | 1. Navigate to `/approvals`. 2. Verify a budget approval request exists. 3. Approve it. | The agent resumes after approval. The budget incident resolves. | |

---

## 8. Plugin Management

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| PLG-01 | View plugin manager | User has instance admin access | 1. Navigate to Instance Settings > Plugins. 2. Verify installed plugins are listed with name, version, status, and category. | Plugin list renders correctly. | |
| PLG-02 | Install plugin | An npm-published Paperclip plugin exists | 1. Click the install button. 2. Enter the plugin's npm package name. 3. Click install. | The plugin appears in the list with "enabled" status. | |
| PLG-03 | Disable plugin | An enabled plugin is installed | 1. Click the disable toggle on a plugin. | The plugin status changes to disabled. Its features are no longer active. | |
| PLG-04 | Enable plugin | A disabled plugin is installed | 1. Click the enable toggle on a plugin. | The plugin status changes to enabled. Its features become active. | |
| PLG-05 | Plugin settings | A plugin with configurable settings is installed | 1. Click the settings icon on a plugin. 2. Verify the plugin settings page loads. 3. Change a setting and save. | Settings persist after navigation away and back. | |
| PLG-06 | Uninstall plugin | A plugin is installed | 1. Click uninstall on a plugin. 2. Confirm the two-step confirmation. | The plugin is removed from the list. | |
| PLG-07 | Plugin error state | A plugin in error state exists | 1. View the plugin in the manager. 2. Verify the error message is displayed. | The error summary is visible and human-readable. | |

---

## 9. Instance Settings

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| SET-01 | Heartbeat settings | At least one agent with heartbeat configured exists | 1. Navigate to Instance Settings > Heartbeats. 2. Verify agents are listed with heartbeat status, last run, and next scheduled run. | All heartbeat-enabled agents are displayed across all companies. | |
| SET-02 | Toggle heartbeat | An agent with heartbeat enabled exists | 1. Toggle heartbeat off for an agent. 2. Verify the agent's heartbeat status updates. 3. Toggle it back on. | Heartbeat enable/disable works and persists. | |
| SET-03 | Experimental settings | User has instance admin access | 1. Navigate to Instance Settings > Experimental. 2. View available experimental features. | The experimental settings page loads without errors. | |

---

## 10. Cross-Cutting Concerns

| ID | Feature Area | Preconditions | Steps | Expected Results | Pass/Fail |
|----|-------------|---------------|-------|-----------------|-----------|
| XCT-01 | Inbox unread | An agent has performed actions on issues | 1. Navigate to `/inbox/unread`. 2. Verify unread items are listed. 3. Click on an item. 4. Return to inbox. | The item is no longer marked as unread. The browser tab blue dot updates. | |
| XCT-02 | Activity feed | Actions have been performed in the company | 1. Navigate to `/activity`. 2. Verify events are listed chronologically. | Activity events show correct timestamps and descriptions. | |
| XCT-03 | Responsive layout | Any populated page | 1. Resize the browser to a mobile viewport width. 2. Navigate between pages. | The layout adapts. Sidebar collapses. Tables and cards reflow appropriately. Org chart switches to list view on mobile. | |
| XCT-04 | PWA install | App is served over HTTPS or localhost | 1. Look for the browser's PWA install prompt. 2. Install the app. 3. Open it from the home screen. | The app opens in standalone mode with correct icon and title. | |
| XCT-05 | Auth flow | Instance is in authenticated deployment mode | 1. Open the app without a session. 2. Verify redirect to `/auth`. 3. Log in. 4. Verify redirect back to the original page. | Authentication works correctly with proper redirect. | |
| XCT-06 | Bootstrap admin | Fresh authenticated instance with no admin | 1. Open the app. 2. Verify the "Instance setup required" page appears. 3. Run `pnpm paperclipai auth bootstrap-ceo`. 4. Follow the invite URL. | The first admin account is created and the app becomes usable. | |
