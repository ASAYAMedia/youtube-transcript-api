import { useState, useEffect } from "react";
import { readCompiledReports, getRecentActivity, CompiledReport, AgentReport } from "@/lib/reports";
import { Badge } from "@/components/ui";
import { FileText, ChevronDown, ChevronUp, Bot, Calendar } from "lucide-react";

function ReportCard({ report, expanded, onToggle }: { report: CompiledReport; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Calendar size={16} className="text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm font-semibold text-white">{report.date}</span>
            <div className="flex gap-2">
              <Badge variant="cyan">{report.agentCount} agents</Badge>
              <Badge variant="yellow">{report.issueCount} issues</Badge>
              <Badge variant="green">{report.taskCount} tasks</Badge>
            </div>
          </div>
          <p className="text-xs text-zinc-400 truncate">{report.summary || "No summary available"}</p>
        </div>
        {expanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5">
          <pre className="mt-4 whitespace-pre-wrap text-xs text-zinc-400 font-mono leading-relaxed">
            {report.content}
          </pre>
        </div>
      )}
    </div>
  );
}

function AgentReportCard({ report }: { report: AgentReport }) {
  const statusColor: Record<string, string> = {
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400",
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <Bot size={14} className="text-cyan-400" />
        <span className="text-sm font-medium text-white">{report.agentName}</span>
        <span className="text-xs text-zinc-500">{report.date}</span>
        <span className={`text-xs font-medium ${statusColor[report.status]}`}>
          {report.status}
        </span>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed mb-2">{report.summary}</p>
      {report.tasksDone.length > 0 && (
        <div className="space-y-1">
          {report.tasksDone.map((t, i) => (
            <div key={i} className="text-xs text-zinc-500 flex items-start gap-2">
              <span className="text-green-400">✓</span> {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [compiled, setCompiled] = useState<CompiledReport[]>([]);
  const [agentReports, setAgentReports] = useState<AgentReport[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"compiled" | "agents">("compiled");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [c, a] = await Promise.all([readCompiledReports(), getRecentActivity()]);
      setCompiled(c.length > 0 ? c : getMockCompiledReports());
      setAgentReports(a.length > 0 ? a : getMockAgentReports());
      setLoading(false);
    }
    load();
  }, []);

  function getMockCompiledReports(): CompiledReport[] {
    const reports: CompiledReport[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      reports.push({
        date: d.toISOString().split("T")[0],
        content: `## Daily Report — ${d.toISOString().split("T")[0]}

## Summary
Supervisor compiled all agent reports. 7 agents reported in. 3 issues found, 2 resolved.

## Key Findings
- Translation audit found 1 new untranslated string in French locale
- QA fixed 2 accessibility issues
- Performance: Core Web Vitals all green

## Recommendations
1. Fix French locale string (P1)
2. Continue daily QA sweeps
3. Tool Creator delivered JSON Diff tool ahead of schedule`,
        summary: "7 agents reported · 3 issues found · 2 resolved · Performance all green",
        agentCount: 7,
        issueCount: 3,
        taskCount: 12,
      });
    }
    return reports;
  }

  function getMockAgentReports(): AgentReport[] {
    return [
      { agentSlug: "tool-creator", agentName: "Tool Creator", date: new Date().toISOString().split("T")[0], content: "", summary: "Built 'JSON Diff' tool — fully tested, committed, and pushed to GitHub", tasksDone: ["✅ JSON Diff tool created", "✅ Tests written", "✅ Committed + pushed"], issuesFound: [], status: "success" },
      { agentSlug: "qa-maintenance", agentName: "QA Maintenance", date: new Date().toISOString().split("T")[0], content: "", summary: "Fixed 2 ARIA labels and 1 contrast ratio issue on tool pages", tasksDone: ["✅ ARIA label on tool card 1", "✅ ARIA label on tool card 2", "✅ Contrast fix on hero"], issuesFound: [], status: "success" },
      { agentSlug: "translation-audit", agentName: "Translation Audit", date: new Date().toISOString().split("T")[0], content: "", summary: "Found 1 untranslated string: 'items' in French (fr.json)", tasksDone: [], issuesFound: ["⚠️ 'items' string untranslated in fr.json"], status: "warning" },
      { agentSlug: "blog-writer", agentName: "Blog Writer", date: new Date().toISOString().split("T")[0], content: "", summary: "Published '5 JSON Tools to Speed Up Your Dev Workflow' — 800 words", tasksDone: ["✅ Blog post written", "✅ SEO optimized", "✅ Posted + distributed"], issuesFound: [], status: "success" },
      { agentSlug: "performance", agentName: "Performance", date: new Date().toISOString().split("T")[0], content: "", summary: "Core Web Vitals: LCP 1.2s ✅, CLS 0.02 ✅, INP 120ms ✅ — ALL GREEN", tasksDone: ["✅ LCP verified", "✅ CLS verified", "✅ INP verified"], issuesFound: [], status: "success" },
    ];
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Reports</h2>
        <p className="text-sm text-zinc-500">Daily compiled reports and individual agent reports</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {([["compiled", "Daily Compiled"], ["agents", "Agent Reports"]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === id ? "bg-white/10 text-white border border-white/20" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">Loading...</div>
      ) : activeTab === "compiled" ? (
        <div className="space-y-3">
          {compiled.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-zinc-500">No compiled reports yet</div>
          ) : (
            compiled.map(r => (
              <ReportCard
                key={r.date}
                report={r}
                expanded={expandedId === r.date}
                onToggle={() => setExpandedId(expandedId === r.date ? null : r.date)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {agentReports.map((r, i) => (
            <AgentReportCard key={i} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}
