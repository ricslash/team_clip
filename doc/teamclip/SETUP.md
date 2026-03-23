# TeamClip — Fresh Environment Setup

**Last updated:** 2026-03-20

---

## Prerequisites

- Node.js 22+ and pnpm installed
- Claude Code CLI installed and authenticated (`claude --version`)
- Gemini CLI installed and authenticated (for UX Director agent)
- Git access to the team_clip repo

## Step 1: Install Dependencies

```bash
cd /home/eric/team_clip/team_clip
pnpm install
```

## Step 2: Configure Paperclip Instance

If no instance exists yet:

```bash
pnpm paperclipai onboard --yes
```

This creates `~/.paperclip/instances/default/` with:
- Embedded PostgreSQL database
- Config file (`config.json`)
- JWT secret (`.env`)
- Storage and secrets directories

If you need to reconfigure:

```bash
pnpm paperclipai configure
```

Ensure the config has:
```json
{
  "server": {
    "deploymentMode": "authenticated",
    "exposure": "private",
    "host": "0.0.0.0",
    "port": 3100,
    "allowedHostnames": ["192.168.1.8"],
    "serveUi": true
  }
}
```

## Step 3: Start the Server

```bash
pnpm dev
```

Verify:
```bash
curl http://192.168.1.8:3100/api/health
```

Should return `{"status":"ok",...}`.

## Step 4: Create Board User

On first run, create an admin account. Either:

**Option A — Bootstrap (first time only):**
```bash
pnpm paperclipai auth-bootstrap-ceo
```
Follow the generated invite URL to create your account.

**Option B — Sign up via API:**
```bash
curl -X POST http://192.168.1.8:3100/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your-password","name":"Eric"}'
```

## Step 5: Seed TeamClip Data

Run the TeamClip seed script to create the RIC company, 15 agents, goals, and projects:

```bash
pnpm seed:teamclip
```

This creates:
- Company "RIC"
- 3 product goals (TaskKnife, IHAB, Resy)
- 4 projects linked to goals (with workspace cwd configuration)
- 15 agents with correct org hierarchy, adapter configs, and heartbeat intervals

## Step 6: Verify Setup

Open the dashboard at `http://192.168.1.8:3100` and check:

1. **Company "RIC"** exists
2. **15 agents** visible in the Agents page with correct org tree:
   - Chief of Staff (CEO role) at root
   - CTO, PM, CMO, Finance, Legal, CS reporting to CoS
   - Architect, Full-Stack, QA, DevOps, UX Director under CTO
   - Design Lead under PM
   - Market Researcher, Content & Growth under CMO
3. **3 goals** visible in Goals page
4. **4 projects** with workspaces configured

## Step 7: Test an Agent

Manually invoke the Chief of Staff to test:

```bash
curl -X POST http://192.168.1.8:3100/api/agents/{chief-of-staff-id}/heartbeat/invoke \
  -b ~/.paperclip/cookies.txt
```

Or use the "Run" button in the dashboard UI.

The CoS should:
1. Wake up and identify itself via `GET /api/agents/me`
2. Check for assigned issues
3. Scan for completed work and blocked issues
4. Exit cleanly if no work to do

## Step 8: Configure Discord (Optional)

Set the Discord webhook URL in the Chief of Staff's adapter environment:

1. Go to the CoS agent config in the dashboard
2. Add to adapter config environment:
   ```json
   {
     "env": {
       "DISCORD_WEBHOOK_URL": "https://discord.com/api/webhooks/..."
     }
   }
   ```
3. The CoS will use the `discord-notify` skill to send alerts

## Troubleshooting

### Server won't start
```bash
pnpm paperclipai doctor
```

### Database issues
```bash
# Check embedded postgres
ls ~/.paperclip/instances/default/db/

# Backup before destructive operations
pnpm paperclipai db:backup
```

### Agent won't wake
- Check agent status in dashboard (must be "active", not "paused")
- Check adapter config — cwd must exist on disk
- For claude_local: verify `claude --version` works
- For gemini_local: verify Gemini CLI is authenticated (`gemini --version`)
- Check logs: `~/.paperclip/instances/default/logs/`

### Gemini adapter auth fails
The Gemini adapter needs OAuth credentials in `~/.config/gemini/`. If auth fails:
1. Run `gemini` manually to re-authenticate
2. Verify GOOGLE_GENAI_USE_GCA is not set (or set correctly)
3. Check the adapter's environment test in the dashboard

### Session resets unexpectedly
Session persistence is cwd-aware. If an agent's working directory changes between heartbeats (e.g., switching products), the session resets. This is by design. Ensure issue documentation is thorough enough for agents to pick up context from docs, not session memory.
