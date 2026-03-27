// File reading utilities for workspace reports and memory
// These read from /home/workspace/agent-reports/

export interface AgentReport {
  agentSlug: string;
  agentName: string;
  date: string;
  content: string;
  summary: string;
  tasksDone: string[];
  issuesFound: string[];
  tokensUsed?: number;
  status: "success" | "warning" | "error" | "unknown";
}

export interface CompiledReport {
  date: string;
  content: string;
  summary: string;
  agentCount: number;
  issueCount: number;
  taskCount: number;
}

export interface MemoryFile {
  name: string;
  path: string;
  content: string;
  lastModified?: string;
}

// Try to fetch a workspace file via the Zo API
async function fetchWorkspaceFile(path: string): Promise<string | null> {
  try {
    const response = await fetch(`/zo/files/read?path=${encodeURIComponent(path)}`, {
      headers: { Authorization: `Bearer ${process.env.ZO_CLIENT_IDENTITY_TOKEN ?? ""}` },
    });
    if (response.ok) {
      return await response.text();
    }
  } catch {
    // fall through
  }
  return null;
}

// Read memory file contents
export async function readMemoryFiles(): Promise<MemoryFile[]> {
  const memoryDir = "/home/workspace/agent-reports/memory";
  const files = [
    { name: "Knowledge Base", path: `${memoryDir}/knowledge-base.md` },
    { name: "Issues Tracker", path: `${memoryDir}/issues-tracker.md` },
    { name: "Actions Log", path: `${memoryDir}/actions-log.md` },
    { name: "Trends", path: `${memoryDir}/trends.md` },
  ];

  const results: MemoryFile[] = [];
  for (const file of files) {
    const content = await fetchWorkspaceFile(file.path);
    if (content) {
      results.push({ name: file.name, path: file.path, content });
    }
  }
  return results;
}

// Read compiled supervisor reports
export async function readCompiledReports(): Promise<CompiledReport[]> {
  const content = await fetchWorkspaceFile("/home/workspace/agent-reports/compiled/");
  if (!content) return [];

  // Parse directory listing or try direct file approach
  // For now, return recent dates with placeholders
  const today = new Date();
  const reports: CompiledReport[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const fileContent = await fetchWorkspaceFile(`/home/workspace/agent-reports/compiled/${dateStr}.md`);

    if (fileContent) {
      const summary = fileContent.split("\n").find(l => l.startsWith("## Summary")) ?? "";
      reports.push({
        date: dateStr,
        content: fileContent,
        summary: summary.replace("## Summary", "").trim(),
        agentCount: (fileContent.match(/## Agent:/g) || []).length,
        issueCount: (fileContent.match(/issues?:/gi) || []).length,
        taskCount: (fileContent.match(/- \[x\]/g) || []).length,
      });
    }
  }

  return reports;
}

// Parse an individual agent report
export function parseAgentReport(filename: string, content: string): AgentReport {
  const match = filename.match(/^(.+?)_(\d{4}-\d{2}-\d{2})\.md$/);
  const slug = match?.[1] ?? "unknown";
  const date = match?.[2] ?? "";

  const agentNames: Record<string, string> = {
    "blog-writer": "Blog Writer",
    "tool-creator": "Tool Creator",
    "qa-maintenance": "QA Maintenance",
    "monetization-scout": "Monetization Scout",
    "seo-agent": "SEO Agent",
    "competitor-watch": "Competitor Watch",
    "social-distribution": "Social Distribution",
    "user-feedback": "User Feedback",
    "performance": "Performance",
    "translation-audit": "Translation Audit",
    "supervisor": "Supervisor",
  };

  const lines = content.split("\n");
  const summary = lines.find(l => l.startsWith("## Summary"))?.replace("## Summary", "").trim() ?? "";

  return {
    agentSlug: slug,
    agentName: agentNames[slug] ?? slug,
    date,
    content,
    summary,
    tasksDone: lines.filter(l => l.includes("[x]") || l.includes("✅")).slice(0, 5),
    issuesFound: lines.filter(l => l.includes("[ ]") || l.includes("❗") || l.toLowerCase().includes("issue")).slice(0, 5),
    status: content.includes("error") || content.includes("failed") ? "error" : "success",
  };
}

// Get recent activity from agent reports directory
export async function getRecentActivity(): Promise<AgentReport[]> {
  const reports: AgentReport[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    for (const slug of [
      "blog-writer", "tool-creator", "qa-maintenance", "monetization-scout",
      "seo-agent", "competitor-watch", "social-distribution", "user-feedback",
      "performance", "translation-audit",
    ]) {
      const content = await fetchWorkspaceFile(`/home/workspace/agent-reports/${slug}_${dateStr}.md`);
      if (content) {
        reports.push(parseAgentReport(`${slug}_${dateStr}.md`, content));
      }
    }
  }

  return reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get trends data for budget/charts
export async function getTrends(): Promise<{ dailyTokens: number[]; dates: string[]; totalSpend: number }> {
  const content = await fetchWorkspaceFile("/home/workspace/agent-reports/memory/trends.md");
  if (!content) {
    // Return placeholder data
    const dates: string[] = [];
    const tokens: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
      tokens.push(Math.floor(Math.random() * 50000) + 10000);
    }
    return { dailyTokens: tokens, dates, totalSpend: tokens.reduce((a, b) => a + b, 0) };
  }

  // Try to parse token usage from trends
  const lines = content.split("\n");
  const dates: string[] = [];
  const tokens: number[] = [];
  let totalSpend = 0;

  for (const line of lines) {
    const dateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
    const tokenMatch = line.match(/(\d+[\d,]*)\s*tokens?/i);
    if (dateMatch && tokenMatch) {
      dates.push(dateMatch[1]);
      const val = parseInt(tokenMatch[1].replace(",", ""));
      tokens.push(val);
      totalSpend += val;
    }
  }

  if (dates.length === 0) {
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
      tokens.push(Math.floor(Math.random() * 50000) + 10000);
    }
    totalSpend = tokens.reduce((a, b) => a + b, 0);
  }

  return { dailyTokens: tokens, dates, totalSpend };
}
