import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui";
import {
  Bot, ArrowLeft, Calendar, Cpu, Clock,
  FileText, ChevronRight, ToggleLeft, ToggleRight,
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  Engineering: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Content: "text-green-400 bg-green-500/10 border-green-500/20",
  Marketing: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Revenue: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Intelligence: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  QA: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Supervisor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

export default function AgentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<{
    agent: {
      slug: string; name: string; role: string; model: string;
      schedule: string; status: string; focus: string;
      enabled: boolean; lastRun: string | null;
      reports: { file: string; date: string; summary: string }[];
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [focus, setFocus] = useState("");
  const [savingFocus, setSavingFocus] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/agents/${slug}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setFocus(d.agent?.lastFocus ?? d.agent?.focus ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleToggle = async () => {
    if (!slug || !data) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/agents/${slug}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !data.agent.enabled }),
      });
      const result = await res.json();
      setData(d => d ? { ...d, agent: { ...d.agent, enabled: result.enabled } } : d);
    } finally {
      setToggling(false);
    }
  };

  const handleSaveFocus = async () => {
    if (!slug || !focus.trim()) return;
    setSavingFocus(true);
    try {
      await fetch(`/api/agents/${slug}/focus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focus }),
      });
    } finally {
      setSavingFocus(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/3" />
        <div className="glass rounded-2xl p-6 h-40" />
      </div>
    );
  }

  if (!data?.agent) {
    return (
      <div className="text-center py-20">
        <Bot className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-400">Agent not found</p>
        <Link to="/agents" className="text-cyan-400 text-sm hover:underline mt-2 inline-block">Back to Agents</Link>
      </div>
    );
  }

  const { agent } = data;
  const roleColor = ROLE_COLORS[agent.role] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";

  return (
    <div className="space-y-6">
      <Link to="/agents" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Agents
      </Link>

      {/* Agent Header */}
      <div className="glass rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-start gap-4 flex-wrap">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${agent.enabled ? "bg-cyan-500/20" : "bg-zinc-500/20"}`}>
            <Bot className={`w-8 h-8 ${agent.enabled ? "text-cyan-400" : "text-zinc-500"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
              <Badge className={`border ${roleColor}`}>{agent.role}</Badge>
              {agent.enabled
                ? <Badge variant="active" className="gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active</Badge>
                : <Badge variant="inactive">Paused</Badge>}
            </div>
            <p className="text-zinc-400 text-sm">{agent.focus}</p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              agent.enabled
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-green-500/30 text-green-400 hover:bg-green-500/10"
            }`}
          >
            {agent.enabled
              ? <><ToggleRight className="w-5 h-5" /> Pause Agent</>
              : <><ToggleLeft className="w-5 h-5" /> Resume Agent</>}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          {([
            { icon: Calendar, label: "Schedule", value: agent.schedule },
            { icon: Cpu, label: "Model", value: agent.model },
            { icon: Clock, label: "Last Run", value: agent.lastRun ? new Date(agent.lastRun).toLocaleString() : "Never" },
            { icon: FileText, label: "Reports", value: `${agent.reports?.length ?? 0} recent` },
          ] as const).map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="text-sm text-zinc-200">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Override Focus */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Override Current Focus</h2>
        <p className="text-xs text-zinc-500 mb-3">Temporarily redirect this agent. Resets on next scheduled run.</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={focus}
            onChange={e => setFocus(e.target.value)}
            placeholder="e.g. Focus on fixing the JSON validator tool..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={handleSaveFocus}
            disabled={savingFocus}
            className="px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-all disabled:opacity-50"
          >
            {savingFocus ? "Saving..." : "Redirect"}
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Recent Reports</h2>
        {agent.reports && agent.reports.length > 0 ? (
          <div className="space-y-2">
            {agent.reports.map((report) => (
              <Link
                key={report.file}
                to={`/reports?file=${report.file}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
              >
                <FileText className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-cyan-400">{report.date}</span>
                  <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mt-0.5">{report.summary}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">No reports yet</p>
          </div>
        )}
        <Link
          to={`/reports?agent=${agent.slug}`}
          className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/10 hover:border-cyan-500/30 hover:bg-white/5 transition-all text-sm text-zinc-500 hover:text-cyan-400"
        >
          View all {agent.name} reports <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
