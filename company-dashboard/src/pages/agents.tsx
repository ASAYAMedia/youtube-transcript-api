import { Link } from "react-router-dom";
import { AGENTS, SUPERVISOR, getAgentStatus } from "@/lib/company";
import { StatusDot, Badge } from "@/components/ui";
import { Bot, Clock, ChevronRight, Zap } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">All Agents</h2>
          <p className="text-sm text-zinc-500">{AGENTS.length + 1} active agents + 1 supervisor</p>
        </div>
      </div>

      {/* Supervisor */}
      <div className="glass rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg font-bold text-purple-300">
            SV
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-white text-lg">{SUPERVISOR.name}</span>
              <Badge variant="purple">Supervisor</Badge>
              <StatusDot status={getAgentStatus()} />
            </div>
            <p className="text-sm text-zinc-400">{SUPERVISOR.focus}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><Clock size={12} /> {SUPERVISOR.scheduleHuman}</span>
              <span className="flex items-center gap-1"><Zap size={12} /> {SUPERVISOR.model}</span>
            </div>
          </div>
          <Link
            to={`/agents/${SUPERVISOR.slug}`}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
          >
            Details <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Domain Agents */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Domain Agents</h3>
        {AGENTS.map(agent => (
          <div
            key={agent.id}
            className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white border"
              style={{ background: `${agent.color}20`, borderColor: `${agent.color}40` }}
            >
              {agent.name.split(" ").map(w => w[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-white">{agent.name}</span>
                <Badge variant="cyan">{agent.role}</Badge>
                <StatusDot status={getAgentStatus()} />
              </div>
              <p className="text-sm text-zinc-400 truncate">{agent.focus}</p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><Clock size={12} /> {agent.scheduleHuman}</span>
              <span className="flex items-center gap-1"><Zap size={12} /> {agent.model}</span>
            </div>
            <Link
              to={`/agents/${agent.slug}`}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Details <ChevronRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
