import { useState, useEffect } from "react";
import { Badge } from "@/components/ui";
import { Brain, AlertTriangle, TrendingUp, FileText, Clock } from "lucide-react";

interface MemoryData {
  "knowledge-base": string | null;
  "issues-tracker": string | null;
  "actions-log": string | null;
  trends: string | null;
  "supervisor-memory": string | null;
}

function MarkdownView({ content }: { content: string | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!content) {
    return (
      <div className="text-center py-12">
        <FileText className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">No data yet</p>
        <p className="text-zinc-600 text-xs mt-1">Run some agents to populate this section</p>
      </div>
    );
  }

  const lines = content.split("\n");
  const preview = lines.slice(0, 30).join("\n");
  const isLong = lines.length > 30;

  return (
    <div className="relative">
      <pre className={`text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono ${!expanded && isLong ? "max-h-48 overflow-hidden" : ""}`}>
        {expanded ? content : preview}
      </pre>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {expanded ? "Show less" : `Show all ${lines.length} lines`}
        </button>
      )}
    </div>
  );
}

const TABS = [
  { id: "knowledge-base", label: "Knowledge Base", icon: Brain },
  { id: "issues-tracker", label: "Issues", icon: AlertTriangle },
  { id: "actions-log", label: "Actions Log", icon: Clock },
  { id: "trends", label: "Trends", icon: TrendingUp },
  { id: "supervisor-memory", label: "Supervisor Memory", icon: FileText },
] as const;

export default function MemoryPage() {
  const [data, setData] = useState<MemoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("knowledge-base");

  useEffect(() => {
    fetch("/api/memory")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Company Memory</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Persistent memory from the Supervisor agent — goals, issues, and learned patterns
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {data?.[id as keyof MemoryData] && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass rounded-2xl p-6">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-white/10 rounded" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        ) : (
          <MarkdownView content={data?.[activeTab as keyof MemoryData] ?? null} />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {TABS.map(({ id, label }) => {
          const hasData = !!data?.[id as keyof MemoryData];
          return (
            <div key={id} className="glass rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white font-mono">
                {hasData ? "✓" : "—"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
