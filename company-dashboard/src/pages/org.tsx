import { Link } from "react-router-dom";
import { useState } from "react";
import { AGENTS, SUPERVISOR, COMPANY, getAgentStatus, ALL_AGENTS } from "@/lib/company";
import { StatusDot, Badge } from "@/components/ui";
import { Bot, ArrowRight } from "lucide-react";

export default function OrgChartPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Organization Chart</h2>
          <p className="text-sm text-zinc-500 mt-1">{COMPANY.name} — {ALL_AGENTS.length + 1} members</p>
        </div>
        <Link to="/agents" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-all">
          <Bot size={14} /> Manage Agents
        </Link>
      </div>

      {/* CEO Row */}
      <div className="glass rounded-2xl p-8">
        <div className="flex flex-col items-center gap-4">
          {/* CEO Node */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white via-zinc-200 to-zinc-400 flex items-center justify-center text-xl font-black text-black shadow-lg shadow-black/50">
              DL
            </div>
            <div className="text-center">
              <div className="font-bold text-white">Daniel Lamberth</div>
              <div className="text-xs text-zinc-500">CEO & Founder</div>
            </div>
            <StatusDot status="green" />
          </div>

          {/* Connector line down */}
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-white/10" />

          {/* Supervisor Node */}
          <Link to={`/agents/${SUPERVISOR.slug}`} className="group">
            <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-purple-300 border border-purple-500/30"
                style={{ background: "rgba(168,85,247,0.15)" }}
              >
                SV
              </div>
              <div className="text-center">
                <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">{SUPERVISOR.name}</div>
                <div className="text-xs text-zinc-500">{SUPERVISOR.role}</div>
              </div>
              <StatusDot status="green" />
              <div className="text-xs text-purple-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                View details <ArrowRight size={10} />
              </div>
            </div>
          </Link>

          {/* Horizontal connector */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

          {/* Agents Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
            {AGENTS.map(agent => (
              <Link
                key={agent.id}
                to={`/agents/${agent.slug}`}
                className="group relative flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                onMouseEnter={() => setHoveredId(agent.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white border"
                  style={{ background: `${agent.color}20`, borderColor: `${agent.color}40` }}
                >
                  {agent.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-white group-hover:text-cyan-300 transition-colors leading-tight">
                    {agent.name}
                  </div>
                  <div className="text-xs text-zinc-500">{agent.role}</div>
                </div>
                <StatusDot status={getAgentStatus()} />
                {hoveredId === agent.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 text-xs text-zinc-400 bg-black/90 rounded-lg p-3 border border-white/10 z-50 pointer-events-none">
                    <div className="font-medium text-white mb-1">{agent.scheduleHuman}</div>
                    <div className="text-zinc-400 leading-relaxed">{agent.focus}</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-zinc-500 flex-wrap">
        <div className="flex items-center gap-2">
          <StatusDot status="green" /> Active &lt; 2h
        </div>
        <div className="flex items-center gap-2">
          <StatusDot status="yellow" /> Active &lt; 12h
        </div>
        <div className="flex items-center gap-2">
          <StatusDot status="red" /> No recent heartbeat
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="purple">Supervisor</Badge> Compiles + learns
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cyan">Domain</Badge> Executes tasks
        </div>
      </div>
    </div>
  );
}
