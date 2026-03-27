import { serveStatic } from "hono/bun";
import type { ViteDevServer } from "vite";
import { createServer as createViteServer } from "vite";
import config from "./zosite.json";
import { Hono } from "hono";

// AI agents: read README.md for navigation and contribution guidance.
type Mode = "development" | "production";
const app = new Hono();

const mode: Mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

/**
 * API Routes — Company Dashboard
 *
 * Serves data from the Zo workspace at /home/workspace/
 * All routes return JSON or appropriate error codes.
 */

// ── Company Data ─────────────────────────────────────────────────────────────

const COMPANY = {
  name: "ASAYA Media",
  website: "https://tinytoolbox.co",
  ceo: "Daniel Lamberth",
  goal: "Maintain and grow tinytoolbox.co — maximize traffic, revenue, and tool utility. Ship new tools, fix what's broken, monetize aggressively, and build a loyal user base.",
  goalProgress: 62,
  agents: [
    { slug: "supervisor", name: "Compile Daily Agent Reports", role: "Supervisor", schedule: "Daily 6:30pm ET", model: "MiniMax", status: "active", focus: "Compiles all agent reports, updates memory, emails Daniel" },
    { slug: "blog-writer", name: "Blog Writer", role: "Content", schedule: "Daily 9am ET", model: "Kimi", status: "active", focus: "Writes one SEO blog post daily about AI tools and productivity" },
    { slug: "tool-creator", name: "Tool Creator", role: "Engineering", schedule: "Daily 9am ET", model: "MiniMax", status: "active", focus: "Builds and ships one new TinyToolbox tool daily" },
    { slug: "qa-maintenance", name: "QA Maintenance", role: "QA", schedule: "Daily 9am & 9pm ET", model: "Kimi", status: "active", focus: "Scans site, fixes typos, broken links, accessibility, performance" },
    { slug: "monetization-scout", name: "Monetization Scout", role: "Revenue", schedule: "Daily 9am ET", model: "MiniMax", status: "active", focus: "Finds affiliate programs, ad placements, and monetization angles" },
    { slug: "seo-agent", name: "SEO Agent", role: "Marketing", schedule: "Weekly Mon 10am ET", model: "MiniMax", status: "active", focus: "Analyzes search rankings, keywords, and SEO opportunities" },
    { slug: "competitor-watch", name: "Competitor Watch", role: "Intelligence", schedule: "Weekly Wed 2pm ET", model: "MiniMax", status: "active", focus: "Monitors competitor moves, new tools, and market shifts" },
    { slug: "social-distribution", name: "Social Distribution", role: "Marketing", schedule: "Daily 11am ET", model: "MiniMax", status: "active", focus: "Posts to X and LinkedIn, grows social traffic" },
    { slug: "user-feedback", name: "User Feedback", role: "Intelligence", schedule: "Daily 4pm ET", model: "MiniMax", status: "active", focus: "Monitors brand mentions, user reviews, and feedback signals" },
    { slug: "performance", name: "Performance", role: "Engineering", schedule: "Daily 8am & 8pm ET", model: "MiniMax", status: "active", focus: "Monitors Core Web Vitals, uptime, and PageSpeed metrics" },
    { slug: "translation-audit", name: "Translation Audit", role: "QA", schedule: "Hourly", model: "MiniMax", status: "active", focus: "Finds untranslated UI strings across all 9 supported languages" },
  ],
};

// ── Agent State ─────────────────────────────────────────────────────────────
// Simple in-memory state — in production this would persist to a file

const agentState: Record<string, { enabled: boolean; lastRun?: string; lastFocus?: string }> = {};
for (const agent of COMPANY.agents) {
  agentState[agent.slug] = { enabled: true, lastRun: undefined, lastFocus: agent.focus };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function readText(path: string): string | null {
  try {
    const file = Bun.file(path);
    if (file.exists()) return file.text();
    return null;
  } catch {
    return null;
  }
}

function readJson<T = unknown>(path: string): T | null {
  try {
    const file = Bun.file(path);
    if (file.exists()) return file.json() as T;
    return null;
  } catch {
    return null;
  }
}

function listFiles(dir: string, ext?: string): string[] {
  try {
    const { readdirSync } = require("node:fs") as typeof import("node:fs");
    const files = readdirSync(dir, { withFileTypes: true });
    return files
      .filter(f => f.isFile() && (!ext || f.name.endsWith(ext)))
      .map(f => f.name)
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

const WORKSPACE = "/home/workspace";
const AGENT_REPORTS = `${WORKSPACE}/agent-reports`;
const TASKS_FILE = `${WORKSPACE}/agent-reports/memory/tasks.md`;
const TRENDS_FILE = `${WORKSPACE}/agent-reports/memory/trends.md`;
const ISSUES_FILE = `${WORKSPACE}/agent-reports/memory/issues-tracker.md`;
const KB_FILE = `${WORKSPACE}/agent-reports/memory/knowledge-base.md`;
const SUPERVISOR_MEM = `${WORKSPACE}/agent-reports/supervisor_memory.md`;

// ── Routes ────────────────────────────────────────────────────────────────────

app.get("/api/company", (c) => {
  const memoryFiles = {
    tasks: readText(TASKS_FILE),
    trends: readText(TRENDS_FILE),
    issues: readText(ISSUES_FILE),
    knowledgeBase: readText(KB_FILE),
    supervisorMemory: readText(SUPERVISOR_MEM),
  };
  return c.json({ ...COMPANY, memoryFiles });
});

app.get("/api/agents", (c) => {
  const agents = COMPANY.agents.map(a => ({
    ...a,
    enabled: agentState[a.slug]?.enabled ?? true,
    lastRun: agentState[a.slug]?.lastRun ?? null,
    lastFocus: agentState[a.slug]?.lastFocus ?? a.focus,
  }));
  return c.json({ agents });
});

app.get("/api/agents/:slug", (c) => {
  const slug = c.req.param("slug");
  const agent = COMPANY.agents.find(a => a.slug === slug);
  if (!agent) return c.json({ error: "Agent not found" }, 404);
  const state = agentState[slug] ?? { enabled: true };

  // Find recent reports for this agent
  const reports = listFiles(AGENT_REPORTS, `.md`)
    .filter(f => f.startsWith(`${slug}_`))
    .slice(0, 5)
    .map(f => {
      const content = readText(`${AGENT_REPORTS}/${f}`);
      const date = f.replace(`${slug}_`, "").replace(".md", "");
      const summary = content?.slice(0, 300).replace(/[#*_`]/g, "").trim() ?? "";
      return { file: f, date, summary };
    });

  return c.json({ agent: { ...agent, ...state, reports } });
});

app.post("/api/agents/:slug/toggle", async (c) => {
  const slug = c.req.param("slug");
  const agent = COMPANY.agents.find(a => a.slug === slug);
  if (!agent) return c.json({ error: "Agent not found" }, 404);
  const { enabled } = await c.req.json().catch(() => ({}));
  if (agentState[slug]) agentState[slug].enabled = enabled;
  return c.json({ ok: true, enabled: agentState[slug].enabled });
});

app.post("/api/agents/:slug/focus", async (c) => {
  const slug = c.req.param("slug");
  if (!COMPANY.agents.find(a => a.slug === slug)) return c.json({ error: "Agent not found" }, 404);
  const { focus } = await c.req.json().catch(() => ({}));
  if (agentState[slug]) agentState[slug].lastFocus = focus;
  return c.json({ ok: true, focus });
});

app.get("/api/memory", (c) => {
  const type = c.req.query("type");
  const files: Record<string, string | null> = {
    "knowledge-base": readText(KB_FILE),
    "issues-tracker": readText(ISSUES_FILE),
    "actions-log": readText(`${WORKSPACE}/agent-reports/memory/actions-log.md`),
    "trends": readText(TRENDS_FILE),
    "supervisor-memory": readText(SUPERVISOR_MEM),
  };
  if (type && files[type] !== undefined) return c.json({ [type]: files[type] });
  return c.json(files);
});

app.get("/api/reports", (c) => {
  const compiled = listFiles(`${AGENT_REPORTS}/compiled`, ".md").map(f => {
    const content = readText(`${AGENT_REPORTS}/compiled/${f}`);
    const date = f.replace(".md", "");
    const titleMatch = content?.match(/^# (.+)/m);
    return { file: f, date, title: titleMatch?.[1] ?? `Report ${date}` };
  });

  const agentReports = listFiles(AGENT_REPORTS, ".md")
    .filter(f => !f.startsWith("supervisor") && !f.startsWith("compiled"))
    .slice(0, 20)
    .map(f => {
      const content = readText(`${AGENT_REPORTS}/${f}`);
      const date = f.replace(/^[a-z-]+_/, "").replace(".md", "");
      const slug = f.replace(/_[0-9-]+.md$/, "");
      const summary = content?.slice(0, 200).replace(/[#*_`]/g, "").trim() ?? "";
      return { file: f, date, slug, summary };
    });

  return c.json({ compiled, agentReports });
});

app.get("/api/reports/compiled/:date", (c) => {
  const date = c.req.param("date");
  const content = readText(`${AGENT_REPORTS}/compiled/${date}.md`);
  if (!content) return c.json({ error: "Report not found" }, 404);
  return c.json({ date, content });
});

app.get("/api/reports/agent/:slug", (c) => {
  const slug = c.req.param("slug");
  const reports = listFiles(AGENT_REPORTS, ".md")
    .filter(f => f.startsWith(`${slug}_`))
    .map(f => {
      const content = readText(`${AGENT_REPORTS}/${f}`);
      const date = f.replace(`${slug}_`, "").replace(".md", "");
      return { file: f, date, content };
    });
  return c.json({ slug, reports });
});

app.get("/api/tasks", (c) => {
  const content = readText(TASKS_FILE);
  return c.json({ content: content ?? "# Task Queue\n\nNo tasks currently defined." });
});

app.get("/api/trends", (c) => {
  const content = readText(TRENDS_FILE);
  return c.json({ content: content ?? "# Trends\n\nNo trend data yet." });
});

app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

// Fallback: serve workspace files for development
app.get("/workspace/*", (c) => {
  const path = c.req.path.replace("/workspace", WORKSPACE);
  const file = Bun.file(path);
  if (file.exists()) {
    const ext = path.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      md: "text/markdown", json: "application/json", txt: "text/plain",
      png: "image/png", jpg: "image/jpeg", svg: "image/svg+xml",
    };
    return new Response(file, { headers: { "Content-Type": mimeTypes[ext ?? ""] ?? "text/plain" } });
  }
  return c.json({ error: "File not found" }, 404);
});

if (mode === "production") {
  configureProduction(app);
} else {
  await configureDevelopment(app);
}

/**
 * Determine port based on mode. In production, use the published_port if available.
 * In development, always use the local_port.
 * Ports are managed by the system and injected via the PORT environment variable.
 */
const port = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : mode === "production"
    ? (config.publish?.published_port ?? config.local_port)
    : config.local_port;

export default { fetch: app.fetch, port, idleTimeout: 255 };

/**
 * Configure routing for production builds.
 *
 * - Streams prebuilt assets from `dist`.
 * - Static files from `public/` are copied to `dist/` by Vite and served at root paths.
 * - Falls back to `index.html` for any other GET so the SPA router can resolve the request.
 */
function configureProduction(app: Hono) {
  app.use("/assets/*", serveStatic({ root: "./dist" }));
  app.get("/favicon.ico", (c) => c.redirect("/favicon.svg", 302));
  app.use(async (c, next) => {
    if (c.req.method !== "GET") return next();

    const path = c.req.path;
    if (path.startsWith("/api/") || path.startsWith("/assets/")) return next();

    const file = Bun.file(`./dist${path}`);
    if (await file.exists()) {
      const stat = await file.stat();
      if (stat && !stat.isDirectory()) {
        return new Response(file);
      }
    }

    return serveStatic({ path: "./dist/index.html" })(c, next);
  });
}

/**
 * Configure routing for development builds.
 *
 * - Boots Vite in middleware mode for transforms.
 * - Static files from `public/` are served at root paths (matching Vite convention).
 * - Mirrors production routing semantics so SPA routes behave consistently.
 */
async function configureDevelopment(app: Hono): Promise<ViteDevServer> {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });

  app.use("*", async (c, next) => {
    if (c.req.path.startsWith("/api/")) return next();
    if (c.req.path === "/favicon.ico") return c.redirect("/favicon.svg", 302);

    const url = c.req.path;
    try {
      if (url === "/" || url === "/index.html") {
        let template = await Bun.file("./index.html").text();
        template = await vite.transformIndexHtml(url, template);
        return c.html(template, {
          headers: { "Cache-Control": "no-store, must-revalidate" },
        });
      }

      const publicFile = Bun.file(`./public${url}`);
      if (await publicFile.exists()) {
        const stat = await publicFile.stat();
        if (stat && !stat.isDirectory()) {
          return new Response(publicFile, {
            headers: { "Cache-Control": "no-store, must-revalidate" },
          });
        }
      }

      let result;
      try {
        result = await vite.transformRequest(url);
      } catch {
        result = null;
      }

      if (result) {
        return new Response(result.code, {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-store, must-revalidate",
          },
        });
      }

      let template = await Bun.file("./index.html").text();
      template = await vite.transformIndexHtml("/", template);
      return c.html(template, {
        headers: { "Cache-Control": "no-store, must-revalidate" },
      });
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error(error);
      return c.text("Internal Server Error", 500);
    }
  });

  return vite;
}
