// Company goal and org structure for ASAYA Media / TinyToolbox
// These are static definitions matching the Paperclip model

export const COMPANY = {
  name: "ASAYA Media",
  website: "tinytoolbox.co",
  mission: "Maintain, grow, and further monetize tinytoolbox.co — the #1 free browser-native micro-tool platform",
  northStar: "Reach 1,000,000 monthly users",
  ceo: "Daniel Lamberth",
};

export interface Agent {
  id: string;
  name: string;
  slug: string;
  role: string;
  model: "MiniMax" | "Kimi";
  schedule: string;
  scheduleHuman: string;
  parent: string; // parent agent id
  focus: string;
  color: string; // tailwind accent color
}

export const SUPERVISOR: Agent = {
  id: "supervisor",
  name: "Compile & Learn",
  slug: "supervisor",
  role: "Supervisor",
  model: "MiniMax",
  schedule: "daily 18:30 ET",
  scheduleHuman: "Daily at 6:30 PM ET",
  parent: "ceo",
  focus: "Compiles all agent reports, updates memory, learns patterns, escalates to CEO",
  color: "#a855f7",
};

export const AGENTS: Agent[] = [
  {
    id: "blog-writer",
    name: "Blog Writer",
    slug: "blog-writer",
    role: "Content",
    model: "Kimi",
    schedule: "daily 09:00 ET",
    scheduleHuman: "Daily at 9:00 AM ET",
    parent: "supervisor",
    focus: "Creates one in-depth blog post daily about tool topics, SEO, and productivity",
    color: "#06b6d4",
  },
  {
    id: "tool-creator",
    name: "Tool Creator",
    slug: "tool-creator",
    role: "Engineering",
    model: "MiniMax",
    schedule: "daily 09:00 ET",
    scheduleHuman: "Daily at 9:00 AM ET",
    parent: "supervisor",
    focus: "Builds one new TinyToolbox tool daily — full implementation, tests, commit, push",
    color: "#22c55e",
  },
  {
    id: "qa-maintenance",
    name: "QA Maintenance",
    slug: "qa-maintenance",
    role: "QA",
    model: "Kimi",
    schedule: "daily 09:00 & 21:00 ET",
    scheduleHuman: "Daily at 9:00 AM & 9:00 PM ET",
    parent: "supervisor",
    focus: "Scans tinytoolbox.co, finds issues, fixes what it can, logs the rest",
    color: "#f59e0b",
  },
  {
    id: "monetization-scout",
    name: "Monetization Scout",
    slug: "monetization-scout",
    role: "Revenue",
    model: "MiniMax",
    schedule: "daily 09:00 ET",
    scheduleHuman: "Daily at 9:00 AM ET",
    parent: "supervisor",
    focus: "Finds new affiliate programs, ad placements, and monetization opportunities",
    color: "#ec4899",
  },
  {
    id: "seo-agent",
    name: "SEO Agent",
    slug: "seo-agent",
    role: "SEO",
    model: "MiniMax",
    schedule: "weekly Mon 10:00 ET",
    scheduleHuman: "Monday at 10:00 AM ET",
    parent: "supervisor",
    focus: "Analyzes search rankings, keyword opportunities, and technical SEO health",
    color: "#8b5cf6",
  },
  {
    id: "competitor-watch",
    name: "Competitor Watch",
    slug: "competitor-watch",
    role: "Strategy",
    model: "MiniMax",
    schedule: "weekly Wed 14:00 ET",
    scheduleHuman: "Wednesday at 2:00 PM ET",
    parent: "supervisor",
    focus: "Monitors competitor moves, new tool launches, and market trends",
    color: "#06b6d4",
  },
  {
    id: "social-distribution",
    name: "Social Distribution",
    slug: "social-distribution",
    role: "Marketing",
    model: "MiniMax",
    schedule: "daily 11:00 ET",
    scheduleHuman: "Daily at 11:00 AM ET",
    parent: "supervisor",
    focus: "Posts to X and LinkedIn — new tools, blog posts, and tool tips",
    color: "#14b8a6",
  },
  {
    id: "user-feedback",
    name: "User Feedback",
    slug: "user-feedback",
    role: "Growth",
    model: "MiniMax",
    schedule: "daily 16:00 ET",
    scheduleHuman: "Daily at 4:00 PM ET",
    parent: "supervisor",
    focus: "Monitors brand mentions, user reviews, and feedback signals",
    color: "#f97316",
  },
  {
    id: "performance",
    name: "Performance",
    slug: "performance",
    role: "Engineering",
    model: "MiniMax",
    schedule: "daily 08:00 & 20:00 ET",
    scheduleHuman: "Daily at 8:00 AM & 8:00 PM ET",
    parent: "supervisor",
    focus: "Monitors Core Web Vitals, PageSpeed scores, and uptime",
    color: "#22d3ee",
  },
  {
    id: "translation-audit",
    name: "Translation Audit",
    slug: "translation-audit",
    role: "i18n",
    model: "MiniMax",
    schedule: "hourly",
    scheduleHuman: "Every hour",
    parent: "supervisor",
    focus: "Scans for untranslated text strings across all 9 supported languages",
    color: "#a78bfa",
  },
];

export const ALL_AGENTS = [SUPERVISOR, ...AGENTS];

export function getAgentById(id: string): Agent | undefined {
  if (id === "ceo") return { id: "ceo", name: "Daniel Lamberth", slug: "ceo", role: "CEO", model: "MiniMax", schedule: "always-on", scheduleHuman: "Always on", parent: "none", focus: "Strategic direction, approvals, vision", color: "#ffffff" };
  return ALL_AGENTS.find(a => a.id === id);
}

export function getChildrenOf(parentId: string): Agent[] {
  return ALL_AGENTS.filter(a => a.parent === parentId);
}

// Status logic based on last heartbeat
export function getAgentStatus(lastHeartbeat?: string): "green" | "yellow" | "red" {
  if (!lastHeartbeat) return "red";
  const diff = Date.now() - new Date(lastHeartbeat).getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 2) return "green";
  if (hours < 12) return "yellow";
  return "red";
}

export const PRIORITY_COLORS: Record<string, string> = {
  P0: "bg-red-500/20 text-red-400 border border-red-500/30",
  P1: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  P2: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
};

export const STATUS_COLORS: Record<string, string> = {
  done: "bg-green-500/20 text-green-400",
  "in-progress": "bg-cyan-500/20 text-cyan-400",
  pending: "bg-zinc-500/20 text-zinc-400",
  blocked: "bg-red-500/20 text-red-400",
};
