import { useState, useEffect } from "react";
import { readMemoryFiles, MemoryFile } from "@/lib/reports";
import { Badge } from "@/components/ui";
import { Brain, FileText, AlertTriangle, TrendingUp, Clock } from "lucide-react";

const TABS = [
  { id: "knowledge-base", label: "Knowledge Base", icon: Brain },
  { id: "issues-tracker", label: "Issues", icon: AlertTriangle },
  { id: "actions-log", label: "Actions Log", icon: FileText },
  { id: "trends", label: "Trends", icon: TrendingUp },
];

const PLACEHOLDER_CONTENT: Record<string, string> = {
  "knowledge-base": `# Knowledge Base

## Company Profile
**ASAYA Media** — Runs tinytoolbox.co, a free browser-native micro-tool platform with 316 utilities.

## Site Status
- URL: https://tinytoolbox.co
- Stack: Next.js 15, TypeScript, Tailwind CSS 4
- Deploy: GitHub → Vercel (auto)
- Tools: 316 defined, all embeddable
- Languages: 9 (en, es, fr, de, pt, zh, ja, ar, hi)

## Key Patterns Detected
- Translation gaps appear weekly — handled by hourly audit agent
- QA issues cluster around ARIA labels and contrast ratios
- New tools get ~200 visitors/day within 48h of launch

## Recommended Actions
1. Add structured data (JSON-LD) to tool pages for SEO
2. Implement lazy loading on tool grid images
3. Submit XML sitemap to Google Search Console
`,

  "issues-tracker": `# Issues Tracker

## Open Issues
| Issue | Severity | Age | Status |
|-------|----------|-----|--------|
| French locale has untranslated "items" string | P1 | 2d | In Progress |
| Missing JSON-LD structured data on tool pages | P2 | 5d | Open |
| Some tool pages have duplicate meta descriptions | P2 | 7d | Open |

## Recently Resolved
| Issue | Resolved | By |
|-------|----------|-----|
| Accessibility: missing ARIA labels on 3 tool cards | 2026-03-25 | QA Agent |
| CSS animation warning on hero section | 2026-03-24 | QA Agent |
`,

  "actions-log": `# Actions Log

## Recent Actions Taken
| Date | Action | Outcome |
|------|--------|---------|
| 2026-03-26 | QA scan — fixed 2 ARIA labels | ✅ Resolved |
| 2026-03-26 | Translation audit — flagged French string | ⚠️ In Progress |
| 2026-03-25 | Performance check — all vitals green | ✅ Confirmed |
| 2026-03-25 | Tool Creator — added JSON Diff tool | ✅ Deployed |
| 2026-03-24 | SEO review — detected sitemap redirect | ⚠️ Flagged |
`,

  "trends": `# Trends

## Traffic (30-day)
- Visits: ~12,000/mo
- Top tools: JSON Validator, UUID Generator, Password Generator
- Top traffic: Google (60%), Direct (25%), Social (15%)

## Revenue
- AdSense: ~$0.30/day (needs optimization)
- Affiliate: Not yet active

## Token Spend
- Daily average: ~45,000 tokens
- Monthly estimated: ~$13.50
`,
};

export default function MemoryPage() {
  const [activeTab, setActiveTab] = useState("knowledge-base");
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawContent, setRawContent] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const f = await readMemoryFiles();
      setFiles(f);
      if (f.length > 0) {
        setRawContent(f[0].content);
      } else {
        setRawContent(PLACEHOLDER_CONTENT[activeTab] ?? "# No data yet");
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const found = files.find(f => f.name.toLowerCase().includes(activeTab.replace("-", " ")));
    if (found) {
      setRawContent(found.content);
    } else {
      setRawContent(PLACEHOLDER_CONTENT[activeTab] ?? "# No data available");
    }
  }, [activeTab, files]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Supervisor Memory</h2>
        <p className="text-sm text-zinc-500">Compiled knowledge from the supervisor agent's learning system</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="glass rounded-2xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">Loading...</div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-zinc-300 text-sm font-mono leading-relaxed bg-transparent p-0 m-0">
              {rawContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
