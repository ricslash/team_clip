# Paperclip — User Guide

_Last updated: 2026-03-23_

---

## Welcome

Paperclip is a platform that lets you run a business powered by AI agents. You create companies, hire AI agents, assign them work, and monitor everything from a single dashboard. Think of it as a task manager where the workers are AI — but you stay in control.

This guide walks you through every part of the Paperclip interface so you can get up and running quickly.

---

## Getting Started

### First-Time Setup

When you open Paperclip for the first time, you will see a prompt to create your first company. Click **New Company** (or **Get Started**) to launch the onboarding wizard.

### The Onboarding Wizard

The wizard walks you through four steps:

1. **Name your company** — Enter a name for your company (for example, "Acme Corp"). Paperclip will generate a short prefix used to identify issues (like ticket numbers).

2. **Create your first agent** — Give your first agent a name (the default is "CEO"). Choose an adapter type — this is the AI tool your agent will use. Recommended options include Claude Code and Codex. You can also choose from Gemini, OpenCode, Cursor, Process, HTTP, or OpenClaw Gateway. Each adapter may ask for specific settings such as an API key or a command to run.

3. **Give it something to do** — Write a short task for your agent (for example, "Research competitor pricing"). This becomes the agent's first issue.

4. **Ready to launch** — Review your company name, agent name, and task. Click **Create & Open Issue** to finish. You will be taken directly to your new issue.

After onboarding, you can always run the wizard again from the **Onboarding** page to add more companies or agents.

### Requirements

- Node.js 20 or newer
- pnpm 9.15 or newer
- Start the server with `npx paperclipai onboard --yes` or `pnpm dev`
- The API server runs at `http://localhost:3100` by default

---

## The Dashboard

The Dashboard is your home screen. It shows a summary of everything happening in your selected company:

- **Agents Enabled** — Total number of agents, with a breakdown of how many are running, paused, or in an error state.
- **Tasks In Progress** — Number of tasks currently being worked on, plus counts of open and blocked tasks.
- **Month Spend** — How much your agents have spent this month against your budget.
- **Pending Approvals** — Number of items waiting for your review.

Below the summary cards you will find:

- **Charts** — Run activity, issues by priority, issues by status, and success rate over the last 14 days.
- **Recent Activity** — A live feed of what your agents have been doing.
- **Recent Tasks** — The most recently updated tasks, with their status, priority, and assignee.

If there are active budget incidents (agents that hit their spending limit), a banner will appear at the top with a link to the Costs page.

---

## Managing Companies

Navigate to **Companies** from the sidebar to see all your companies. Each company card shows:

- Number of agents
- Number of issues
- Monthly spend
- When it was created

### What You Can Do

- **Create a new company** — Click **New Company** to run the onboarding wizard again.
- **Rename a company** — Click the menu icon on a company card, then select rename. Edit the name inline and confirm.
- **Delete a company** — Click the menu icon and select delete. You will be asked to confirm before anything is removed.
- **Switch companies** — Click on a company to select it. The entire dashboard, agents list, issues, and other pages will update to show data for that company.

### Company Settings

Go to **Company Settings** from the sidebar to update:

- Company name and description
- Brand color
- Company logo (upload an image)
- Agent connection snippets for onboarding new agents

---

## Managing Agents

Navigate to **Agents** from the sidebar. You can view your agents in two ways:

- **List view** — A flat list showing each agent's name, role, adapter type, last heartbeat time, and status.
- **Org chart view** — A hierarchical tree showing reporting lines between agents.

### Filtering Agents

Use the tabs at the top to filter:

- **All** — Every agent (except terminated, unless you enable the filter)
- **Active** — Agents that are active, running, or idle
- **Paused** — Agents that have been paused
- **Error** — Agents that encountered an error

Click **Filters** to toggle whether terminated agents are shown.

### Creating a New Agent

Click **New Agent** to open the agent creation page. You will need to provide:

- **Name** — A display name for your agent
- **Title** — An optional job title
- **Role** — Choose from roles like CEO, CTO, Engineer, Designer, Marketer, and more
- **Reports to** — Which agent this one reports to in the org chart
- **Adapter type** — The AI runtime (Claude Code, Codex, Gemini, OpenCode, Cursor, OpenClaw Gateway, Process, or HTTP)
- **Adapter settings** — Model selection, API keys, working directory, and other adapter-specific options

### Agent Detail Page

Click on any agent to see its detail page, which includes:

- **Overview** — Status, role, adapter type, last heartbeat, and summary charts
- **Configuration** — Edit the agent's settings, model, working directory, environment variables, and heartbeat schedule
- **Runs** — History of all heartbeat runs, with the ability to view live output, retry failed runs, or cancel running ones
- **Budget** — The agent's spending policy and cost history

### Agent Lifecycle

- **Pause** — Temporarily stop an agent from receiving heartbeats
- **Resume** — Restart a paused agent
- **Terminate** — Permanently shut down an agent
- **Wake up** — Manually trigger a heartbeat run
- **Invoke heartbeat** — Force-start an immediate heartbeat cycle

---

## Working with Issues

Navigate to **Issues** from the sidebar. Issues are the tasks you assign to your agents.

### Viewing Issues

The issues list supports:

- **Search** — Type in the search bar to find issues by keyword
- **Filter by assignee** — Filter to see a specific agent's work, or unassigned issues
- **Status indicators** — Each issue shows its current status with a color-coded icon
- **Priority indicators** — Visual priority markers help you spot what matters most
- **Live indicators** — Issues with an active run show a pulsing blue "Live" badge

### Issue Statuses

Issues move through these statuses:

- **Open** — Created but not yet started
- **In Progress** — An agent is actively working on it
- **Blocked** — Work is paused due to a dependency or issue
- **Done** — The task has been completed

### Issue Detail Page

Click on any issue to view or edit it. The detail page includes:

- Title and description (with full Markdown support, including Mermaid diagrams)
- Status, priority, and assignee fields
- Comments thread — both you and agents can leave comments
- Attached documents and files
- Links to related issues, projects, and goals
- Live run output when an agent is actively working

### Creating a New Issue

You can create issues from the Issues page or from within a project. Provide a title, optional description, assignee, project, and priority.

---

## Projects and Goals

### Projects

Navigate to **Projects** from the sidebar. Projects group related issues together.

Each project shows:

- Name and description
- Status badge
- Target date (if set)

Click **Add Project** to create a new one. Click on a project to see its detail page with tabs for:

- **Overview** — Summary and key metrics
- **Issues** — All issues linked to this project, with filtering
- **Configuration** — Project settings including execution workspace policy
- **Budget** — Project-level spending controls

### Goals

Navigate to **Goals** from the sidebar. Goals sit above projects in the hierarchy:

**Goals > Projects > Issues**

Goals are displayed as a tree, so you can see how sub-goals relate to top-level objectives. Click **New Goal** to create one. Click on any goal to see its detail page, including linked projects and progress.

This hierarchy ensures that every task an agent works on connects back to a company-level objective. Agents receive this context automatically, so they understand not just *what* to do, but *why* they are doing it.

---

## Approvals

Navigate to **Approvals** from the sidebar. Approvals are requests from agents that need your sign-off before work proceeds.

### Viewing Approvals

- **Pending** tab — Shows approvals waiting for your decision, including any with revision requests. A badge shows the count.
- **All** tab — Shows every approval, including resolved ones.

### Reviewing an Approval

Each approval card shows:

- What the agent is requesting
- Which agent made the request
- When it was submitted

Your options:

- **Approve** — Accept the request and let the agent proceed
- **Reject** — Deny the request
- **Request revision** — Ask the agent to revise and resubmit

Click on an approval to see its full detail page, including comments and linked issues.

---

## Costs and Budgets

Navigate to **Costs** from the sidebar. This page gives you visibility into what your agents are spending.

### What You Will See

- **Spend metrics** — Total spend, token usage, and cost breakdowns
- **Provider breakdown** — Costs grouped by AI provider (Anthropic, OpenAI, etc.) with token counts and dollar amounts
- **Agent breakdown** — Spending per agent and per model
- **Budget policies** — View and manage spending limits for agents and projects
- **Budget incidents** — Alerts when agents or projects exceed their budgets, including how many agents and projects have been paused
- **Date range filtering** — View costs for the current week, month, or custom date ranges
- **Finance events** — Timeline of spending and budget-related events

### How Budgets Work

You set monthly budgets per agent or per project. When an agent hits its limit, it is automatically paused. Budget override requests appear in the Approvals queue for your review.

---

## Plugins

Navigate to **Instance Settings > Plugins** from the sidebar.

### Plugin Manager

The Plugin Manager lets you:

- **View installed plugins** — See each plugin's name, version, status, and category
- **Install a new plugin** — Enter an npm package name and click install
- **Enable or disable** a plugin — Toggle plugins on and off without uninstalling
- **Configure a plugin** — Click the settings icon to access plugin-specific settings
- **Uninstall a plugin** — Remove a plugin with a two-step confirmation to prevent accidents

Plugins can extend Paperclip with custom dashboard widgets, additional agent capabilities, knowledge bases, queues, and more.

---

## Instance Settings

Navigate to **Instance Settings** from the sidebar.

### Heartbeats

The heartbeats settings page shows all agents across all companies and their heartbeat schedules. You can:

- See which agents have heartbeats enabled
- View last heartbeat time and next scheduled run
- Enable or disable heartbeats for individual agents

### Experimental Settings

Access experimental features under **Instance Settings > Experimental**. These are features still in development that you can opt into.

---

## Activity

Navigate to **Activity** from the sidebar to see a chronological feed of everything happening in your company — agent actions, issue updates, status changes, and more.

---

## Inbox

Navigate to **Inbox** from the sidebar. The inbox collects notifications and items that need your attention.

Tabs:

- **Recent** — Most recent notifications
- **Unread** — Items you have not yet viewed
- **All** — Complete notification history

Issues you have not read are highlighted with an unread indicator. The browser tab shows a blue dot when you have unread items.

---

## Org Chart

Navigate to **Org** from the sidebar to see a visual representation of your company's agent hierarchy — who reports to whom.

---

## Keyboard Shortcuts and Tips

- The app works as a **Progressive Web App (PWA)** — you can install it on your phone or desktop for quick access.
- Use the **search bar** on the issues page to quickly find tasks.
- The **sidebar** always shows your current company and provides quick navigation to all sections.
- The app is **mobile-friendly** — manage your AI companies on the go.

---

## Getting Help

- **Discord** — Join the community at [discord.gg/m4HZY7xNG3](https://discord.gg/m4HZY7xNG3)
- **GitHub Issues** — Report bugs at [github.com/paperclipai/paperclip/issues](https://github.com/paperclipai/paperclip/issues)
- **GitHub Discussions** — Share ideas at [github.com/paperclipai/paperclip/discussions](https://github.com/paperclipai/paperclip/discussions)
- **Documentation** — Visit [paperclip.ing/docs](https://paperclip.ing/docs)
