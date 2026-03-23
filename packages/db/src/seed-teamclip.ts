import { eq } from "drizzle-orm";
import { createDb } from "./client.js";
import {
  companies,
  agents,
  goals,
  projects,
  projectGoals,
  projectWorkspaces,
} from "./schema/index.js";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const db = createDb(url);

console.log("Seeding TeamClip (RIC) database...");

// ---------------------------------------------------------------------------
// 1. Company — find existing or create
// ---------------------------------------------------------------------------

let [company] = await db
  .select()
  .from(companies)
  .where(eq(companies.issuePrefix, "RIC"))
  .limit(1);

if (company) {
  console.log(`Found existing company: ${company.name} (${company.id})`);
  // Update description
  await db
    .update(companies)
    .set({
      name: "RIC",
      description:
        "Eric's AI company — 15 agents organized as a full product org. Products: TaskKnife, IHAB, Resy.",
    })
    .where(eq(companies.id, company.id));
} else {
  [company] = await db
    .insert(companies)
    .values({
      name: "RIC",
      description:
        "Eric's AI company — 15 agents organized as a full product org. Products: TaskKnife, IHAB, Resy.",
      status: "active",
      issuePrefix: "RIC",
      budgetMonthlyCents: 0,
    })
    .returning();
  console.log(`Created company: ${company!.name} (${company!.id})`);
}

const companyId = company!.id;

// ---------------------------------------------------------------------------
// 2. Goals
// ---------------------------------------------------------------------------

const [goalTaskKnife] = await db
  .insert(goals)
  .values({
    companyId,
    title: "TaskKnife — $10k MRR by Q3 2026",
    description:
      "Grow TaskKnife to $10k monthly recurring revenue by end of Q3 2026. Includes v2 feature expansion and organic GTM.",
    level: "company",
    status: "active",
  })
  .returning();

const [goalIHAB] = await db
  .insert(goals)
  .values({
    companyId,
    title: "IHAB — MVP launch by Q2 2026",
    description:
      "Ship IHAB minimum viable product by end of Q2 2026. Core functionality, onboarding flow, and initial user testing.",
    level: "company",
    status: "active",
  })
  .returning();

const [goalResy] = await db
  .insert(goals)
  .values({
    companyId,
    title: "Resy — Beta with 50 users by Q3 2026",
    description:
      "Launch Resy beta and acquire 50 active users by end of Q3 2026. Includes core product build and beta outreach.",
    level: "company",
    status: "active",
  })
  .returning();

// ---------------------------------------------------------------------------
// 3. Projects (linked to goals)
// ---------------------------------------------------------------------------

const [projTaskKnifeV2] = await db
  .insert(projects)
  .values({
    companyId,
    goalId: goalTaskKnife!.id,
    name: "TaskKnife v2",
    description:
      "TaskKnife v2 feature expansion — Projects feature, enhanced UI, API improvements.",
    status: "in_progress",
  })
  .returning();

const [projTaskKnifeGTM] = await db
  .insert(projects)
  .values({
    companyId,
    goalId: goalTaskKnife!.id,
    name: "TaskKnife GTM",
    description:
      "TaskKnife go-to-market — organic growth campaign, content strategy, SEO, community.",
    status: "backlog",
  })
  .returning();

const [projIHABMVP] = await db
  .insert(projects)
  .values({
    companyId,
    goalId: goalIHAB!.id,
    name: "IHAB MVP",
    description:
      "IHAB minimum viable product — core features, onboarding, initial user testing.",
    status: "backlog",
  })
  .returning();

const [projResyBeta] = await db
  .insert(projects)
  .values({
    companyId,
    goalId: goalResy!.id,
    name: "Resy Beta",
    description:
      "Resy beta launch — core product, beta onboarding, 50-user acquisition target.",
    status: "backlog",
  })
  .returning();

// Also populate the project_goals join table for many-to-many support
await db.insert(projectGoals).values([
  { projectId: projTaskKnifeV2!.id, goalId: goalTaskKnife!.id, companyId },
  { projectId: projTaskKnifeGTM!.id, goalId: goalTaskKnife!.id, companyId },
  { projectId: projIHABMVP!.id, goalId: goalIHAB!.id, companyId },
  { projectId: projResyBeta!.id, goalId: goalResy!.id, companyId },
]);

// ---------------------------------------------------------------------------
// 4. Agents (15 total)
// ---------------------------------------------------------------------------

const defaultCwd = "/home/eric/Team/products/";
const repoRoot = "/home/eric/team_clip/team_clip";
const agentDocsBase = `${repoRoot}/skills/teamclip/agents`;

// Helper to build adapterConfig with cwd, instructions, and permissions
function claudeConfig(agentSlug: string): Record<string, unknown> {
  return {
    cwd: defaultCwd,
    instructionsFilePath: `${agentDocsBase}/${agentSlug}/AGENTS.md`,
    dangerouslySkipPermissions: true,
    maxTurnsPerRun: 200,
  };
}

function geminiConfig(agentSlug: string): Record<string, unknown> {
  return {
    cwd: defaultCwd,
    instructionsFilePath: `${agentDocsBase}/${agentSlug}/AGENTS.md`,
    sandbox: false,
  };
}

// Helper to build runtimeConfig with heartbeat settings
function heartbeatEnabled(intervalSec: number): Record<string, unknown> {
  return { heartbeat: { enabled: true, intervalSec, wakeOnDemand: true } };
}

function heartbeatDisabled(): Record<string, unknown> {
  return { heartbeat: { enabled: false } };
}

// --- Chief of Staff (root of tree, role=ceo) ---

const [chiefOfStaff] = await db
  .insert(agents)
  .values({
    companyId,
    name: "Chief of Staff",
    role: "ceo",
    title: "Chief of Staff",
    status: "active",
    adapterType: "claude_local",
    adapterConfig: claudeConfig("chief-of-staff"),
    runtimeConfig: heartbeatEnabled(1800),
    capabilities:
      "Goal cascading, cross-team coordination, status synthesis, Discord alerts, continuous orchestration",
  })
  .returning();

const cosId = chiefOfStaff!.id;

// --- Direct reports to Chief of Staff ---

const [cto] = await db
  .insert(agents)
  .values({
    companyId,
    name: "CTO",
    role: "cto",
    title: "Chief Technology Officer",
    status: "active",
    reportsTo: cosId,
    adapterType: "claude_local",
    adapterConfig: claudeConfig("cto"),
    runtimeConfig: heartbeatEnabled(3600),
    capabilities:
      "Technical strategy, architecture oversight, engineering management, delegation",
  })
  .returning();

const ctoId = cto!.id;

const [pm] = await db
  .insert(agents)
  .values({
    companyId,
    name: "Product Manager",
    role: "product_manager",
    title: "Product Manager",
    status: "active",
    reportsTo: cosId,
    adapterType: "claude_local",
    adapterConfig: claudeConfig("product-manager"),
    runtimeConfig: heartbeatEnabled(3600),
    capabilities:
      "PRDs, roadmap, prioritization, user research, product lifecycle management",
  })
  .returning();

const pmId = pm!.id;

const [cmo] = await db
  .insert(agents)
  .values({
    companyId,
    name: "CMO",
    role: "cmo",
    title: "Chief Marketing Officer",
    status: "active",
    reportsTo: cosId,
    adapterType: "claude_local",
    adapterConfig: claudeConfig("cmo"),
    runtimeConfig: heartbeatEnabled(3600),
    capabilities:
      "GTM strategy, positioning, market assessment, marketing direction, campaign oversight",
  })
  .returning();

const cmoId = cmo!.id;

await db.insert(agents).values({
  companyId,
  name: "Finance Analyst",
  role: "finance",
  title: "Finance Analyst",
  status: "active",
  reportsTo: cosId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("finance-analyst"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Financial modeling, pricing strategy, reporting, tax, cost analysis, bookkeeping",
});

await db.insert(agents).values({
  companyId,
  name: "Legal Counsel",
  role: "legal",
  title: "Legal Counsel",
  status: "active",
  reportsTo: cosId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("legal-counsel"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Compliance, IP strategy, contracts, HR policies, regulatory analysis",
});

await db.insert(agents).values({
  companyId,
  name: "CS Lead",
  role: "cs_lead",
  title: "Customer Success Lead",
  status: "active",
  reportsTo: cosId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("cs-lead"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Documentation, support, onboarding design, feedback synthesis, help center management",
});

// --- Reports to CTO ---

await db.insert(agents).values({
  companyId,
  name: "Architect",
  role: "architect",
  title: "Architect",
  status: "active",
  reportsTo: ctoId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("architect"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "System design, API design, architecture reviews, data schema design, code review (structural)",
});

await db.insert(agents).values({
  companyId,
  name: "Full-Stack Engineer",
  role: "engineer",
  title: "Full-Stack Engineer",
  status: "active",
  reportsTo: ctoId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("full-stack-engineer"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Frontend and backend implementation, full-stack development, feature building",
});

await db.insert(agents).values({
  companyId,
  name: "QA Engineer",
  role: "qa",
  title: "QA Engineer",
  status: "active",
  reportsTo: ctoId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("qa-engineer"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Testing, quality assurance, bug reproduction, test automation, regression testing",
});

await db.insert(agents).values({
  companyId,
  name: "DevOps Engineer",
  role: "devops",
  title: "DevOps Engineer",
  status: "active",
  reportsTo: ctoId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("devops-engineer"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Infrastructure, CI/CD, security, deployments, release management",
});

await db.insert(agents).values({
  companyId,
  name: "UX Director",
  role: "ux_director",
  title: "UX Director",
  status: "active",
  reportsTo: ctoId,
  adapterType: "gemini_local",
  adapterConfig: geminiConfig("ux-director"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Visual QA, end-to-end flow review, accessibility audits, cross-product UX consistency, screenshot analysis",
});

// --- Reports to PM ---

await db.insert(agents).values({
  companyId,
  name: "Design Lead",
  role: "design_lead",
  title: "Design Lead",
  status: "active",
  reportsTo: pmId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("design-lead"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Brand guidelines, design system, design tokens, motion design, component specs, brand review gate",
});

// --- Reports to CMO ---

await db.insert(agents).values({
  companyId,
  name: "Market Researcher",
  role: "market_researcher",
  title: "Market Researcher",
  status: "active",
  reportsTo: cmoId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("market-researcher"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Deep web research, Reddit/Google/review site analysis, competitor analysis, user feedback, gap identification",
});

await db.insert(agents).values({
  companyId,
  name: "Content & Growth Lead",
  role: "content_growth",
  title: "Content & Growth Lead",
  status: "active",
  reportsTo: cmoId,
  adapterType: "claude_local",
  adapterConfig: claudeConfig("content-growth-lead"),
  runtimeConfig: heartbeatDisabled(),
  capabilities:
    "Content creation, SEO, social media, email campaigns, community management, growth hacking",
});

// ---------------------------------------------------------------------------
// 5. Project Workspaces
// ---------------------------------------------------------------------------

await db.insert(projectWorkspaces).values([
  {
    companyId,
    projectId: projTaskKnifeV2!.id,
    name: "TaskKnife v2 Repo",
    sourceType: "local_path",
    cwd: "/home/eric/Team/products/flowstate/repo/",
    isPrimary: true,
  },
  {
    companyId,
    projectId: projTaskKnifeGTM!.id,
    name: "TaskKnife GTM Workspace",
    sourceType: "local_path",
    cwd: "/home/eric/Team/products/flowstate/",
    isPrimary: true,
  },
  {
    companyId,
    projectId: projIHABMVP!.id,
    name: "IHAB MVP Repo",
    sourceType: "local_path",
    cwd: "/home/eric/Team/products/ihab/repo/",
    isPrimary: true,
  },
  {
    companyId,
    projectId: projResyBeta!.id,
    name: "Resy Beta Repo",
    sourceType: "local_path",
    cwd: "/home/eric/Team/products/resy/repo/",
    isPrimary: true,
  },
]);

// ---------------------------------------------------------------------------

console.log("TeamClip (RIC) seed complete");
console.log(`  Company: ${company!.name} (${companyId})`);
console.log(`  Goals: 3 (TaskKnife, IHAB, Resy)`);
console.log(`  Projects: 4 (TaskKnife v2, TaskKnife GTM, IHAB MVP, Resy Beta)`);
console.log(`  Agents: 15`);
console.log(`  Project Workspaces: 4`);
process.exit(0);
