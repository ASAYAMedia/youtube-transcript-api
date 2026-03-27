import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Users,
  ListChecks,
  Zap,
  Activity,
  TrendingUp,
  AlertCircle,
  Clock,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui";

interface Agent {
  slug: string;
  name: string;
  role: string;
  model: string;
  schedule: string;
  status: string;
  focus: string;
  enabled: boolean;
  lastRun: string | null;
}

interface CompanyData {
  name: string;
  website: string;
  ceo: string;
  goal: string;
  goalProgress: number;
  agents: Agent[];
}

export default function MissionControl() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/company")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
              <div className="h-8 bg-white/10 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-zinc-400">Failed to load company data</p>
          <p className="text-xs text-zinc-600">Is the API server running?</p>
        </div>
      </div>
    );
  }

  const activeAgents = data.agents.filter(a => a.enabled).length;
  const onlineAgents = data.agents.filter(a => a.enabled && a.lastRun).length;

  const recentActivity = [
    { time: "6:30pm", agent: "supervisor", action: "Compiled daily reports", status: "done" },
    { time: "9:00am", agent: "blog-writer", action: "Published: 5 AI Tools That Will 10x Your Productivity", status: "done" },
    { time: "9:00am", agent: "tool-creator", action: "Shipped: JSON Path Finder tool", status: "done" },
    { time: "9:00am", agent: "monetization-scout", action: "Found 3 new affiliate programs", status: "done" },
    { time: "9:00am", agent: "qa-maintenance", action: "Fixed 4 accessibility warnings", status: "done" },
    { time: "11:00am", agent: "social-distribution", action: "Posted to X & LinkedIn", status: "done" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mission Control</h1>
          <p className="text-zinc-400 text-sm mt-1">{data.website} · Powered by ASAYA Media AI</p>
        </div>
        <Badge variant="active" className="gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          All systems nominal
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/org" className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Company Goal</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-zinc-200 leading-snug line-clamp-3">{data.goal}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${data.goalProgress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-cyan-400">{data.goalProgress}%</span>
            </div>
          </div>
        </Link>

        <Link to="/org" className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Agent Fleet</span>
          </div>
          <p className="text-3xl font-bold text-white font-mono">{activeAgents}</p>
          <p className="text-xs text-zinc-400 mt-1">
            <span className="text-green-400">{onlineAgents} active</span> · {data.agents.length} total agents
          </p>
        </Link>

        <Link to="/tasks" className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-pink-400" />
            </div>
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Task Queue</span>
          </div>
          <p className="text-3xl font-bold text-white font-mono">12</p>
          <p className="text-xs text-zinc-400 mt-1">4 in progress · 8 pending</p>
        </Link>

        <Link to="/budget" className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Monthly Budget</span>
          </div>
          <p className="text-3xl font-bold text-white font-mono">$200</p>
          <p className="text-xs text-zinc-400 mt-1">$143.20 used · 72% utilized</p>
        </Link>
      </div>

      {/* Org Chart Preview + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Org Chart Preview */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-zinc-400" />
              Org Chart
            </h2>
            <Link to="/org" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View full <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {/* CEO */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                DL
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{data.ceo}</p>
                <p className="text-xs text-amber-400">CEO & Founder</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4 bg-white/10" />
            </div>
            {/* Supervisor */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Supervisor</p>
                <p className="text-xs text-zinc-400">Compiles reports · 6:30pm daily</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4 bg-white/10" />
            </div>
            {/* Agents row */}
            <div className="grid grid-cols-3 gap-2">
              {data.agents.slice(1, 7).map(agent => (
                <Link
                  key={agent.slug}
                  to={`/agents/${agent.slug}`}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-center"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <p className="text-xs text-zinc-300 truncate leading-tight">{agent.name.split(" ")[0]}</p>
                </Link>
              ))}
            </div>
            <p className="text-center">
              <Link to="/org" className="text-xs text-zinc-500 hover:text-zinc-300">
                +{data.agents.length - 7} more agents →
              </Link>
            </p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-3 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" />
              Today's Activity
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>

          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                      {item.time}
                    </span>
                    <span className="text-xs text-zinc-400 capitalize">{item.agent.replace(/-/g, " ")}</span>
                  </div>
                  <p className="text-sm text-zinc-200 mt-0.5 leading-snug">{item.action}</p>
                </div>
                <Badge variant="done" className="flex-shrink-0 text-xs">done</Badge>
              </div>
            ))}
          </div>

          <Link
            to="/reports"
            className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/10 hover:border-cyan-500/30 hover:bg-white/5 transition-all text-sm text-zinc-400 hover:text-cyan-400"
          >
            View all reports
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* System Health Strip */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-6 flex-wrap">
          {[
            { label: "API", value: "Operational", ok: true },
            { label: "Agent Fleet", value: `${activeAgents}/${data.agents.length} active`, ok: true },
            { label: "Memory", value: "Connected", ok: true },
            { label: "Reports", value: "3 compiled today", ok: true },
            { label: "Budget", value: "$143.20 / $200", ok: true },
            { label: "Zo API", value: "Authenticated", ok: true },
          ].map(({ label, value, ok }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-xs text-zinc-500">{label}:</span>
              <span className={`text-xs font-medium ${ok ? "text-zinc-300" : "text-red-400"}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
