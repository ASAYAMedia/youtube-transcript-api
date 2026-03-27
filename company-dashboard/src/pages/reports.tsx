import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui";
import {
  FileText, ChevronRight, Calendar, Bot, Clock,
  ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";

interface ReportEntry {
  file: string;
  date: string;
  slug?: string;
  title?: string;
  summary?: string;
  content?: string;
}

interface ReportsData {
  compiled: ReportEntry[];
  agentReports: ReportEntry[];
}

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [view, setView] = useState<"compiled" | "agents">("compiled");

  useEffect(() => {
    fetch("/api/reports")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Auto-expand if ?file= or ?agent= param
  useEffect(() => {
    const file = searchParams.get("file");
    const agent = searchParams.get("agent");
    if (file) {
      setView("compiled");
      loadReport(file);
    } else if (agent) {
      setView("agents");
    }
  }, [searchParams]);

  const loadReport = async (file: string) => {
    if (expandedFile === file) {
      setExpandedFile(null);
      setExpandedContent(null);
      return;
    }
    try {
      const isCompiled = file.includes("compiled");
      const url = isCompiled
        ? `/api/reports/compiled/${file.replace(".md", "")}`
        : `/api/reports/agent/${file.replace(/_[0-9-]+.md$/, "").replace(/_.*/, "")}`;
      const res = await fetch(url);
      const result = await res.json();
      const content = result.content ?? result.reports?.[0]?.content ?? "No content found.";
      setExpandedFile(file);
      setExpandedContent(content);
    } catch {
      setExpandedContent("Failed to load report.");
    }
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const AgentBadge = ({ slug }: { slug: string }) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
      <Bot className="w-3 h-3" />
      {slug}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reports</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Compiled supervisor reports and individual agent outputs
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-1 bg-black/30 rounded-xl p-1">
          {(["compiled", "agents"] as const).map(v => (
            <button
              key={v}
              onClick={() => { setView(v); setExpandedFile(null); setExpandedContent(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === v ? "bg-cyan-500/20 text-cyan-300" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {v === "compiled" ? "Compiled Reports" : "Agent Reports"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Compiled Reports */}
          {view === "compiled" && (
            <>
              {data?.compiled && data.compiled.length > 0 ? (
                data.compiled.map(report => (
                  <div key={report.file} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => loadReport(report.file)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{report.title ?? `Report ${report.date}`}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(report.date)}
                          </span>
                        </div>
                      </div>
                      {expandedFile === report.file ? (
                        <ChevronUp className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFile === report.file && expandedContent && (
                      <div className="px-4 pb-4 border-t border-white/5">
                        <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono mt-4 max-h-96 overflow-y-auto">
                          {expandedContent}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 glass rounded-2xl">
                  <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">No compiled reports yet</p>
                  <p className="text-zinc-600 text-sm mt-1">Supervisor runs daily at 6:30pm ET</p>
                </div>
              )}
            </>
          )}

          {/* Agent Reports */}
          {view === "agents" && (
            <>
              {data?.agentReports && data.agentReports.length > 0 ? (
                data.agentReports.map(report => (
                  <div key={report.file} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => loadReport(report.file)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {report.slug && <AgentBadge slug={report.slug} />}
                          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(report.date)}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2">
                          {report.summary ?? "No summary available"}
                        </p>
                      </div>
                      {expandedFile === report.file ? (
                        <ChevronUp className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFile === report.file && expandedContent && (
                      <div className="px-4 pb-4 border-t border-white/5">
                        <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono mt-4 max-h-96 overflow-y-auto">
                          {expandedContent}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 glass rounded-2xl">
                  <Bot className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">No agent reports yet</p>
                  <p className="text-zinc-600 text-sm mt-1">Agents run on their scheduled times</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
