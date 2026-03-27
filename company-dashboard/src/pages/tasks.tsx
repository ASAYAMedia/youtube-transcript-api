import { useState } from "react";
import { Badge } from "@/components/ui";
import { CheckSquare, Clock, AlertTriangle, ArrowRight, Filter } from "lucide-react";

const TASKS = [
  { id: 1, task: "Add JSON Validator tool with syntax highlighting", agent: "Tool Creator", priority: "P0", status: "in-progress", goal: "Grow tool catalog → 1M users", estimate: "45 min" },
  { id: 2, task: "Fix untranslated 'items' string in French locale", agent: "Translation Audit", priority: "P1", status: "pending", goal: "Improve i18n → Global reach", estimate: "10 min" },
  { id: 3, task: "Submit sitemap to Google Search Console", agent: "SEO Agent", priority: "P1", status: "pending", goal: "Improve SEO → Organic traffic", estimate: "15 min" },
  { id: 4, task: "Write blog post: '10 Time-Saving Dev Tools'", agent: "Blog Writer", priority: "P1", status: "done", goal: "Content marketing → Traffic", estimate: "30 min" },
  { id: 5, task: "Scan for broken internal links sitewide", agent: "QA Maintenance", priority: "P2", status: "pending", goal: "Site quality → User experience", estimate: "20 min" },
  { id: 6, task: "Research Cloudflare affiliate program details", agent: "Monetization Scout", priority: "P2", status: "done", goal: "Revenue → Sustainability", estimate: "25 min" },
  { id: 7, task: "Post new tool to X and LinkedIn", agent: "Social Distribution", priority: "P2", status: "in-progress", goal: "Social growth → Awareness", estimate: "10 min" },
  { id: 8, task: "Monitor user feedback for UI/UX complaints", agent: "User Feedback", priority: "P1", status: "pending", goal: "User satisfaction → Retention", estimate: "15 min" },
  { id: 9, task: "Verify Core Web Vitals all green", agent: "Performance", priority: "P0", status: "done", goal: "Site performance → SEO", estimate: "10 min" },
  { id: 10, task: "Check competitor tool launch frequency", agent: "Competitor Watch", priority: "P2", status: "pending", goal: "Market intelligence → Strategy", estimate: "20 min" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  "done": { label: "Done", color: "text-green-400", bg: "bg-green-500/20", icon: CheckSquare },
  "in-progress": { label: "In Progress", color: "text-cyan-400", bg: "bg-cyan-500/20", icon: Clock },
  "pending": { label: "Pending", color: "text-zinc-400", bg: "bg-zinc-500/20", icon: Clock },
  "blocked": { label: "Blocked", color: "text-red-400", bg: "bg-red-500/20", icon: AlertTriangle },
};

export default function TasksPage() {
  const [filter, setFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filtered = TASKS.filter(t => {
    if (filter !== "all" && t.status !== filter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  const grouped = {
    "in-progress": filtered.filter(t => t.status === "in-progress"),
    pending: filtered.filter(t => t.status === "pending"),
    done: filtered.filter(t => t.status === "done"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Task Queue</h2>
          <p className="text-sm text-zinc-500">{TASKS.length} tasks · {TASKS.filter(t => t.status === "done").length} done today</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {["all", "in-progress", "pending", "done"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f === "all" ? "All" : STATUS_CONFIG[f]?.label}
              </button>
            ))}
          </div>
          {/* Priority filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {["all", "P0", "P1", "P2"].map(f => (
              <button
                key={f}
                onClick={() => setPriorityFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  priorityFilter === f ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f === "all" ? "All P" : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(["in-progress", "pending", "done"] as const).map(status => (
          <div key={status} className="space-y-3">
            <div className="flex items-center gap-2">
              {(() => { const cfg = STATUS_CONFIG[status]; const Icon = cfg.icon; return <><Icon size={14} className={cfg.color} /><span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span></>; })()}
              <span className="text-xs text-zinc-600">({grouped[status].length})</span>
            </div>
            <div className="space-y-2">
              {grouped[status].length === 0 ? (
                <div className="glass rounded-xl p-6 text-center text-xs text-zinc-600">No tasks</div>
              ) : (
                grouped[status].map(task => (
                  <div
                    key={task.id}
                    className={`glass rounded-xl p-4 priority-${task.priority.toLowerCase()} hover:border-white/20 transition-all`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`text-sm font-medium text-white leading-tight`}>{task.task}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={task.priority === "P0" ? "red" : task.priority === "P1" ? "yellow" : "cyan"}>{task.priority}</Badge>
                      <span className="text-xs text-zinc-500">{task.agent}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <ArrowRight size={10} className="text-zinc-600" />
                      <span className="text-xs text-zinc-600 truncate">{task.goal}</span>
                    </div>
                    <div className="text-xs text-zinc-600 mt-1">~{task.estimate}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
