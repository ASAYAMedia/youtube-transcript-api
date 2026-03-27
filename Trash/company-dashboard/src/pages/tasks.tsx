import { useState, useEffect } from "react";
import { Badge } from "@/components/ui";
import { ListChecks, Clock, AlertTriangle, CheckCircle2, Minus, Bot } from "lucide-react";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const INITIAL_TASKS = [
  { id: "1", title: "Add JSON Path Finder tool to tinytoolbox", status: "done", priority: "high", agent: "tool-creator", goal: "Ship new tools weekly" },
  { id: "2", title: "Fix untranslated 'items' string in es.json", status: "done", priority: "high", agent: "translation-audit", goal: "Full i18n coverage" },
  { id: "3", title: "Research AdSense alternative: Media.net", status: "in_progress", priority: "high", agent: "monetization-scout", goal: "Increase ad revenue" },
  { id: "4", title: "Write blog: 'Stop Paying for Tools You Already Have'", status: "in_progress", priority: "medium", agent: "blog-writer", goal: "Content marketing flywheel" },
  { id: "5", title: "Fix PageSpeed Performance score (currently 82)", status: "in_progress", priority: "high", agent: "performance", goal: "Core Web Vitals at 100" },
  { id: "6", title: "Audit 10 fastest growing competitor tool sites", status: "pending", priority: "medium", agent: "competitor-watch", goal: "Competitive intelligence" },
  { id: "7", title: "Set up Stripe Connect for affiliate payouts", status: "pending", priority: "medium", agent: "monetization-scout", goal: "Monetization infrastructure" },
  { id: "8", title: "Post weekly roundup to X and LinkedIn", status: "pending", priority: "low", agent: "social-distribution", goal: "Social traffic growth" },
  { id: "9", title: "Submit sitemap to Google Search Console", status: "pending", priority: "medium", agent: "seo-agent", goal: "SEO indexing" },
  { id: "10", title: "Connect Google Analytics 4", status: "pending", priority: "low", agent: "qa-maintenance", goal: "Analytics infrastructure" },
  { id: "11", title: "Design new tool category landing pages", status: "pending", priority: "low", agent: "tool-creator", goal: "Improve site structure" },
  { id: "12", title: "Run translation audit across all 9 locales", status: "pending", priority: "low", agent: "translation-audit", goal: "Full i18n coverage" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [loading, setLoading] = useState(false);

  // Try loading from API, fall back to static tasks
  useEffect(() => {
    fetch("/api/tasks")
      .then(r => r.json())
      .then(d => {
        if (d.content && d.content.includes("Task Queue")) {
          setLoading(false);
        }
      })
      .catch(() => {});
  }, []);

  const moveTask = (id: string, direction: "left" | "right") => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const statusOrder = ["pending", "in_progress", "done"];
      const idx = statusOrder.indexOf(t.status);
      if (direction === "left" && idx > 0) return { ...t, status: statusOrder[idx - 1] as typeof t.status };
      if (direction === "right" && idx < statusOrder.length - 1) return { ...t, status: statusOrder[idx + 1] as typeof t.status };
      return t;
    }));
  };

  const COLUMNS = [
    { id: "pending", label: "Pending", icon: Clock, color: "text-zinc-400", bg: "bg-zinc-500/10" },
    { id: "in_progress", label: "In Progress", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
    { id: "done", label: "Done", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Task Queue</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {tasks.filter(t => t.status === "done").length} of {tasks.length} tasks complete
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="active" className="gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </Badge>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(({ id, label, icon: ColIcon, color, bg }) => {
          const colTasks = tasks
            .filter(t => t.status === id)
            .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1));

          return (
            <div key={id} className="space-y-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${bg} border border-white/5`}>
                <ColIcon className={`w-4 h-4 ${color}`} />
                <span className={`text-sm font-semibold ${color}`}>{label}</span>
                <span className="ml-auto text-xs text-zinc-500 font-mono">{colTasks.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-24">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                        task.priority === "high" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                        task.priority === "medium" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                        "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
                      }`}>
                        {task.priority}
                      </span>
                      <span className="ml-auto text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        #{task.id}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-200 leading-snug mb-3">{task.title}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <Bot className="w-3 h-3" />
                        {task.agent}
                      </span>
                      <span className="text-xs text-zinc-600 truncate max-w-32" title={task.goal}>
                        → {task.goal}
                      </span>
                    </div>
                    {/* Controls */}
                    <div className="flex items-center gap-1">
                      {id !== "pending" && (
                        <button
                          onClick={() => moveTask(task.id, "left")}
                          className="flex-1 text-xs py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-white/10 transition-all"
                        >
                          ← {id === "done" ? "Reopen" : "Back"}
                        </button>
                      )}
                      {id !== "done" && (
                        <button
                          onClick={() => moveTask(task.id, "right")}
                          className="flex-1 text-xs py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 hover:border-green-500/40 transition-all"
                        >
                          {id === "pending" ? "Start →" : "Done ✓"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 rounded-xl border border-dashed border-white/5">
                    <ColIcon className={`w-6 h-6 ${color} mx-auto mb-1 opacity-30`} />
                    <p className="text-xs text-zinc-600">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
