import { useParams, Link } from "react-router-dom";
import { AGENTS, SUPERVISOR, getAgentStatus } from "@/lib/company";
import { StatusDot, Badge } from "@/components/ui";
import { ArrowLeft, Clock, Zap, Target, FileText, Activity } from "lucide-react";

export default function AgentDetailPage() {
  const { slug } = useParams();
  const agent = slug === "supervisor" ? SUPERVISOR : AGENTS.find(a => a.slug === slug);

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-6xl font-black text-zinc-800">404</div>
        <p className="text-zinc-500">Agent not found</p>
        <Link to="/agents" className="text-cyan-400 hover:text-cyan-300 text-sm">← Back to agents</Link>
      </div>
    );
  }

  const status = getAgentStatus();

  // Mock task history
  const recentTasks = [
    { task: "Scanned for untranslated strings", status: "done", time: "1h ago" },
    { task: "Fixed 2 ARIA label issues", status: "done", time: "4h ago" },
    { task: "Ran full site QA sweep", status: "done", time: "8h ago" },
    { task: "Logged 3 accessibility improvements", status: "done", time: "1d ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          to="/agents"
          className="mt-2 p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white border"
              style={{ background: `${agent.color}20`, borderColor: `${agent.color}40` }}
            >
              {agent.name.split(" ").map(w => w[0]).join("")}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={agent.role === "Supervisor" ? "purple" : "cyan"}>{agent.role}</Badge>
                <StatusDot status={status} />
                <span className="text-xs text-zinc-500">{status === "green" ? "Active recently" : status === "yellow" ? "Active today" : "No recent heartbeat"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <Clock size={14} /> Schedule
          </div>
          <div className="text-sm font-medium text-white">{agent.scheduleHuman}</div>
          <div className="text-xs text-zinc-500 mt-1">{agent.schedule}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <Zap size={14} /> AI Model
          </div>
          <div className="text-sm font-medium text-white">{agent.model}</div>
          <div className="text-xs text-zinc-500 mt-1">{agent.role === "Supervisor" ? "Compilation + reasoning" : "Code generation + analysis"}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <Target size={14} /> Focus Area
          </div>
          <div className="text-sm font-medium text-white leading-relaxed">{agent.focus}</div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="space-y-2">
          {recentTasks.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="flex-1">
                <div className="text-sm text-white">{t.task}</div>
              </div>
              <div className="text-xs text-zinc-500">{t.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Instruction */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Agent Configuration</h3>
        </div>
        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
          <div className="text-xs text-zinc-500 mb-2">Instruction / Role</div>
          <p className="text-sm text-zinc-300 leading-relaxed">{agent.focus}</p>
        </div>
      </div>
    </div>
  );
}
