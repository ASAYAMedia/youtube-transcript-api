import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SUPERVISOR } from "@/lib/company";
import { Badge } from "@/components/ui";
import {
  Bot, Clock, Cpu, Calendar, ChevronRight,
} from "lucide-react";

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

const ROLE_COLORS: Record<string, string> = {
  Engineering: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Content: "text-green-400 bg-green-500/10 border-green-500/20",
  Marketing: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Revenue: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Intelligence: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  QA: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Supervisor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

const MODEL_BADGES: Record<string, { label: string; class: string }> = {
  MiniMax: { label: "MiniMax", class: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  Kimi: { label: "Kimi", class: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then(r => r.json())
      .then(d => { setAgents(d.agents ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Agent Fleet</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {agents.filter(a => a.enabled).length} of {agents.length} agents active
          </p>
        </div>
      </div>

      {/* Supervisor */}
      <div className="glass rounded-2xl p-6 border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-amber-500/5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-lg font-bold text-white">{SUPERVISOR.name}</h2>
              <Badge className="border-orange-500/30 text-orange-400 bg-orange-500/10">Supervisor</Badge>
              <Badge variant="active" className="gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Active
              </Badge>
            </div>
            <p className="text-sm text-zinc-400 mb-3">{SUPERVISOR.schedule}</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{SUPERVISOR.description}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Cpu className="w-3.5 h-3.5" />
                {SUPERVISOR.model}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
              <div className="h-3 bg-white/10 rounded w-2/3 mb-4" />
              <div className="h-3 bg-white/10 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map(agent => {
            const roleColor = ROLE_COLORS[agent.role] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
            const modelBadge = MODEL_BADGES[agent.model] ?? { label: agent.model, class: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" };

            return (
              <Link
                key={agent.slug}
                to={`/agents/${agent.slug}`}
                className="glass rounded-2xl p-5 hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${agent.enabled ? "bg-cyan-500/20" : "bg-zinc-500/20"}`}>
                      <Bot className={`w-5 h-5 ${agent.enabled ? "text-cyan-400" : "text-zinc-500"}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{agent.name}</h3>
                      <p className="text-xs text-zinc-500">{agent.role}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">{agent.focus}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`border text-xs ${roleColor}`}>{agent.role}</Badge>
                  <Badge className={`border text-xs ${modelBadge.class}`}>{modelBadge.label}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    {agent.schedule}
                  </div>
                  {agent.lastRun && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" />
                      {new Date(agent.lastRun).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
