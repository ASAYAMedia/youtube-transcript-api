import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AGENTS, SUPERVISOR, COMPANY } from "@/lib/company";
import { Badge } from "@/components/ui";
import {
  Bot, Zap, ChevronRight, Building2,
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  Engineering: "text-blue-400",
  Content: "text-green-400",
  Marketing: "text-purple-400",
  Revenue: "text-amber-400",
  Intelligence: "text-cyan-400",
  QA: "text-pink-400",
  Supervisor: "text-orange-400",
};

export default function OrgPage() {
  const [agents, setAgents] = useState<Array<{
    slug: string; name: string; role: string; model: string;
    schedule: string; status: string; focus: string; enabled: boolean; lastRun: string | null;
  }>>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then(r => r.json())
      .then(d => { setAgents(d.agents ?? []); })
      .catch(() => setAgents([]));
  }, []);

  const activeAgents = agents.filter(a => a.enabled);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Org Chart</h1>
          <p className="text-zinc-400 text-sm mt-1">{COMPANY.name} · {activeAgents.length} of {agents.length} agents operational</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Building2 className="w-4 h-4" />
          {activeAgents.length} active
        </div>
      </div>

      {/* CEO */}
      <div className="glass rounded-2xl p-6 border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
            DL
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{COMPANY.ceo}</h2>
            <p className="text-amber-400 text-sm">CEO & Founder · {COMPANY.website}</p>
            <p className="text-zinc-400 text-xs mt-1">{COMPANY.goal}</p>
          </div>
          <Badge variant="active" className="gap-1.5 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Online
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-px h-8 bg-gradient-to-b from-amber-500/50 to-purple-500/50" />
          <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-black flex items-center justify-center">
            <Zap className="w-1.5 h-1.5 text-white" />
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-purple-500/50 to-white/10" />
        </div>
      </div>

      {/* Supervisor */}
      <Link
        to="/agents/supervisor"
        className="glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/5 transition-all border border-orange-500/20 hover:border-orange-500/40 group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-white font-semibold group-hover:text-orange-300 transition-colors">{SUPERVISOR.name}</h3>
            <Badge className="border-orange-500/30 text-orange-400 bg-orange-500/10 text-xs">Supervisor</Badge>
          </div>
          <p className="text-xs text-zinc-400">{SUPERVISOR.schedule} · {SUPERVISOR.model}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-orange-400 transition-colors flex-shrink-0" />
      </Link>

      <div className="flex items-center justify-center">
        <div className="w-px h-8 bg-gradient-to-b from-purple-500/50 to-white/10" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-zinc-600 uppercase tracking-widest">{activeAgents.length} Agents</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {agents.map((agent) => {
          const color = ROLE_COLORS[agent.role] ?? "text-zinc-400";
          return (
            <Link
              key={agent.slug}
              to={`/agents/${agent.slug}`}
              className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${agent.enabled ? "bg-cyan-500/20" : "bg-zinc-500/20"}`}>
                <Bot className={`w-5 h-5 ${agent.enabled ? "text-cyan-400" : "text-zinc-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors truncate">{agent.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs ${color}`}>{agent.role}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs text-zinc-500">{agent.schedule.split(" ")[0]}</span>
                </div>
              </div>
              {agent.enabled
                ? <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                : <div className="w-2 h-2 rounded-full bg-zinc-600 flex-shrink-0" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
