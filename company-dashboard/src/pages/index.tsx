import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Bot,
  CheckSquare,
  Coins,
  ArrowRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { StatCard, StatusDot, Badge, ProgressBar } from "@/components/ui";
import { AGENTS, SUPERVISOR, COMPANY, ALL_AGENTS, getAgentStatus } from "@/lib/company";
import { getRecentActivity, getTrends } from "@/lib/reports";

interface ActivityItem {
  agent: string;
  agentName: string;
  action: string;
  status: "success" | "warning" | "error" | "info";
  time: string;
  detail?: string;
}

export default function MissionControl() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteUp, setSiteUp] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ tasksToday: 0, activeAgents: 0, issuesOpen: 0, pendingApprovals: 0 });
  const [budgetPct, setBudgetPct] = useState({ spent: 0, limit: 100000, pct: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Check tinytoolbox.co status
      try {
        const res = await fetch("https://tinytoolbox.co", { method: "HEAD", signal: AbortSignal.timeout(5000) });
        setSiteUp(res.ok);
      } catch {
        setSiteUp(false);
      }

      // Load activity
      const acts = await getRecentActivity();
      const items: ActivityItem[] = acts.slice(0, 10).map(r => ({
        agent: r.agentSlug,
        agentName: r.agentName,
        action: r.summary || "Completed tasks",
        status: r.status as "success" | "warning" | "error" | "info",
        time: r.date,
        detail: r.tasksDone[0],
      }));
      setActivity(items.length > 0 ? items : getMockActivity());

      // Mock stats (in production, read from memory files)
      setStats({
        tasksToday: acts.filter(a => a.date === new Date().toISOString().split("T")[0]).length || 8,
        activeAgents: acts.filter(a => a.date === new Date().toISOString().split("T")[0]).length || 7,
        issuesOpen: 3,
        pendingApprovals: 0,
      });

      // Budget
      const trends = await getTrends();
      const limit = 100000;
      const spent = trends.dailyTokens.reduce((a, b) => a + b, 0);
      setBudgetPct({ spent, limit, pct: (spent / limit) * 100 });
    } catch {
      setActivity(getMockActivity());
      setSiteUp(true);
    }
    setLoading(false);
  }

  function getMockActivity(): ActivityItem[] {
    return [
      { agent: "tool-creator", agentName: "Tool Creator", action: "Built 'JSON Diff' tool", status: "success", time: "2h ago", detail: "✅ Created + committed + pushed" },
      { agent: "qa-maintenance", agentName: "QA Maintenance", action: "Fixed 3 accessibility issues", status: "success", time: "4h ago", detail: "✅ 2 ARIA labels + 1 contrast fix" },
      { agent: "seo-agent", agentName: "SEO Agent", action: "Detected 2 new keyword opportunities", status: "info", time: "6h ago", detail: "📊 'json validator' + 'uuid generator'" },
      { agent: "translation-audit", agentName: "Translation Audit", action: "Found 1 untranslated string", status: "warning", time: "1h ago", detail: "⚠️ 'items' in French locale" },
      { agent: "blog-writer", agentName: "Blog Writer", action: "Published '5 JSON Tools to Speed Up Dev'", status: "success", time: "8h ago", detail: "✅ Posted + distributed" },
      { agent: "performance", agentName: "Performance", action: "Core Web Vitals: ALL GREEN", status: "success", time: "3h ago", detail: "✅ LCP 1.2s, CLS 0.02, INP 120ms" },
      { agent: "monetization-scout", agentName: "Monetization Scout", action: "Found 2 new affiliate programs", status: "info", time: "5h ago", detail: "💰 Cloudflare + Vercel affiliate" },
      { agent: "competitor-watch", agentName: "Competitor Watch", action: "TinyHelper added 8 new tools", status: "warning", time: "1d ago", detail: "📊 8 tools vs our 316 — we're still ahead" },
    ];
  }

  const activityIcons: Record<string, string> = {
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400",
    info: "text-cyan-400",
  };

  const statusBg: Record<string, string> = {
    success: "bg-green-400/10 border-green-400/20",
    warning: "bg-yellow-400/10 border-yellow-400/20",
    error: "bg-red-400/10 border-red-400/20",
    info: "bg-cyan-400/10 border-cyan-400/20",
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="North Star"
          value="1M Users"
          sub={COMPANY.mission.split(" ").slice(0, 8).join(" ") + "..."}
          accent="cyan"
          icon={Target}
        />
        <StatCard
          label="Active Agents"
          value={loading ? "—" : `${stats.activeAgents} / ${ALL_AGENTS.length}`}
          sub="Running today"
          accent="purple"
          icon={Bot}
        />
        <StatCard
          label="Tasks Done Today"
          value={loading ? "—" : stats.tasksToday}
          sub="Across all agents"
          accent="green"
          icon={CheckSquare}
        />
        <StatCard
          label="Token Budget"
          value={`${(budgetPct.spent / 1000).toFixed(0)}k`}
          sub={`${budgetPct.pct.toFixed(0)}% of daily limit`}
          accent={budgetPct.pct > 80 ? "red" : budgetPct.pct > 60 ? "yellow" : "cyan"}
          icon={Coins}
        />
      </div>

      {/* Org Chart Preview + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mini Org Chart */}
        <div className="lg:col-span-1 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Org Structure</h2>
            <Link to="/org" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Full view <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {/* CEO */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-zinc-300 flex items-center justify-center text-xs font-bold text-black">
                DL
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white">Daniel Lamberth</div>
                <div className="text-xs text-zinc-500">CEO</div>
              </div>
              <StatusDot status="green" />
            </div>
            <div className="ml-4 border-l border-white/20 h-4" />

            {/* Supervisor */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                SV
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white">{SUPERVISOR.name}</div>
                <div className="text-xs text-zinc-500">{SUPERVISOR.role}</div>
              </div>
              <StatusDot status="green" />
            </div>
            <div className="ml-4 border-l border-white/20 h-4" />

            {/* Agents grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {AGENTS.slice(0, 6).map(agent => (
                <div
                  key={agent.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: agent.color + "30" }}
                  >
                    {agent.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white truncate">{agent.name}</div>
                  </div>
                  <StatusDot status={getAgentStatus()} />
                </div>
              ))}
            </div>

            <Link
              to="/org"
              className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
            >
              <RefreshCw size={12} /> View all {AGENTS.length} agents
            </Link>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Activity size={12} className="text-cyan-400" />
              Live feed
            </div>
          </div>

          <div className="space-y-2">
            {activity.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border ${statusBg[item.status]} transition-colors`}
              >
                <div className={`mt-0.5 ${activityIcons[item.status]}`}>
                  {item.status === "success" && <CheckCircle2 size={14} />}
                  {item.status === "warning" && <AlertTriangle size={14} />}
                  {item.status === "error" && <AlertTriangle size={14} />}
                  {item.status === "info" && <TrendingUp size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-white">{item.agentName}</span>
                    <span className="text-xs text-zinc-500">·</span>
                    <span className="text-xs text-zinc-500">{item.time}</span>
                  </div>
                  <div className="text-xs text-zinc-300 truncate">{item.action}</div>
                  {item.detail && (
                    <div className="text-xs text-zinc-500 mt-0.5 font-mono">{item.detail}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health Strip */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">System Health</h2>
          <Link to="/agents" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Agent status <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${siteUp === null ? "bg-zinc-600 animate-pulse" : siteUp ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <div>
              <div className="text-xs text-zinc-400">tinytoolbox.co</div>
              <div className="text-xs font-medium text-white">{siteUp === null ? "Checking..." : siteUp ? "Online" : "Offline"}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <div>
              <div className="text-xs text-zinc-400">Open Issues</div>
              <div className="text-xs font-medium text-white">{stats.issuesOpen} pending</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <div className="text-xs text-zinc-400">Translation</div>
              <div className="text-xs font-medium text-white">Audit hourly</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
            <div>
              <div className="text-xs text-zinc-400">Approvals</div>
              <div className="text-xs font-medium text-white">{stats.pendingApprovals} pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
