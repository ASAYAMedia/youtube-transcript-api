# ASAYA Media Company Dashboard — SPEC

## 1. Concept & Vision

A real-time **command center** for Daniel's autonomous company. Think SpaceX mission control meets Bloomberg terminal — dense with information but instantly readable. Every metric, agent, task, and decision traces back to the company goal. This isn't a status page. It's the dashboard of a CEO who runs a zero-human company and needs to see everything that matters at a glance.

**Feel:** Dark, glass-morphism to match tinytoolbox.co aesthetic. Information-dense but scannable. Confident. Professional. The kind of dashboard that makes you feel in control of something complex.

## 2. Design Language

**Aesthetic:** Matches tinytoolbox.co — black background, glass panels, neon accents
- Background: `#000` with subtle mesh-gradient
- Glass panels: `bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl`
- Accent colors: Cyan `#06b6d4`, Purple `#a855f7`, Pink `#ec4899`
- Text: White `#fff` primary, zinc-400 `#a1a1aa` secondary
- Font: `font-mono` for numbers/metrics, `font-sans` for text

**Layout:** Fixed sidebar navigation (left), scrollable main content area (right)

## 3. Pages & Features

### 3.1 `/` — Mission Control (Overview)

**Hero Stats Row (4 cards):**
- 🏢 Company Goal: "Build the #1 free micro-tool platform → reach 1M users"
- 🤖 Active Agents: count + list of currently running
- 📊 Tasks Today: completed / in-progress / pending
- 💰 Token Budget: spent today / limit / percentage bar

**Org Chart Section:**
- Visual tree: Daniel (CEO) → Supervisor → 10 domain agents
- Each node shows: agent name, role, last heartbeat time, status dot (green/yellow/red)
- Click node → navigates to agent detail

**Recent Activity Feed:**
- Last 10 events: agent completions, task assignments, approvals, issues found
- Each entry: timestamp, agent, action, outcome
- Color-coded by type: success (green), warning (yellow), error (red), info (blue)

**System Health Strip:**
- tinytoolbox.co uptime indicator
- Last agent run status
- Open issues count
- Pending approvals count

### 3.2 `/org` — Org Chart (Full Page)

Full-screen interactive org chart:
- Daniel (CEO) at top
- Supervisor below CEO
- 10 domain agents in row below supervisor
- Each card: avatar placeholder (initials), name, role, status, last heartbeat
- Connecting lines between nodes
- Hover: expand to show task summary for that agent
- Click: go to agent detail

### 3.3 `/tasks` — Task Queue

**Two panels:**
- Left: Pending tasks (not started, waiting for agent)
- Right: In-progress / completed today

Each task card:
- Task name
- Assigned agent
- Parent goal chain (truncated: "Improve SEO → Grow traffic → 1M users")
- Priority badge (P0/P1/P2)
- Time estimate
- Status: pending | in-progress | done | blocked
- "Deliverable" tag if output exists

**Filters:** by agent, by priority, by status
**Actions:** Manual trigger button for each agent

### 3.4 `/agents/[slug]` — Agent Detail

For each of the 10 agents + supervisor:

**Header:** Agent name, role, schedule, model, status
**Stats:** Tasks completed today, tokens spent, uptime
**Current task:** What it's working on right now
**Recent history:** Last 5 tasks with outcomes
**Next scheduled run:** countdown timer
**Manual trigger:** Button to fire agent now
**Agent config:** View the instruction/rrule in collapsed panel

### 3.5 `/budget` — Token Budget Tracker

**Budget Overview:**
- Total monthly budget: $XX
- Spent this month: $XX
- Remaining: $XX
- Visual: progress bar (green → yellow → red as approaching limit)

**Per-Agent Breakdown:**
- Table: Agent | Tokens Today | Tasks Done | Cost | Limit | Status
- Sortable by any column
- Color-coded status: under (green), warning (yellow >75%), over (red)

**Daily Spend Chart:**
- Bar chart of token spend per day for current month
- Line overlay for trend

### 3.6 `/memory` — Supervisor Memory

Read-only view of the supervisor's knowledge base:

**Tabs:**
- `knowledge-base.md` — Company profile, site status, patterns
- `issues-tracker.md` — Open issues with age, severity
- `actions-log.md` — What was recommended + what happened
- `trends.md` — Metrics tracked over time

Each tab rendered as readable markdown with styling

### 3.7 `/reports` — Daily Reports

**Compiled reports:** List of compiled supervisor reports by date
- Each entry: date, summary sentence, full report link
- Most recent first
- Click → expand inline to show full compiled report

**Individual agent reports:** Filterable list
- By agent, by date range
- Shows report excerpt + full content expandable

### 3.8 `/approvals` — Pending Approvals

When agents request approval for major moves:
- List of pending approval requests
- Each: requesting agent, action proposed, rationale, token cost estimate
- Approve / Reject buttons
- Approved/rejected history

## 4. Technical Approach

**Stack:** Zo Site (Vite + Bun + TypeScript React + Tailwind)

**Data Sources:**
- Agent configs and schedules: read from `/home/workspace/AGENTS.md` (parsed)
- Agent reports: read from `/home/workspace/agent-reports/{slug}_{date}.md`
- Compiled reports: read from `/home/workspace/agent-reports/compiled/{date}.md`
- Memory files: read from `/home/workspace/agent-reports/memory/*.md`
- Token usage: read from `/home/workspace/agent-reports/memory/trends.md`
- tinytoolbox.co status: fetched from tinytoolbox.co

**Architecture:**
```
agent-dashboard/
├── zosite.json              # Zo Site config
├── src/
│   ├── App.tsx              # Main app with sidebar layout
│   ├── pages/
│   │   ├── index.tsx        # Mission Control
│   │   ├── org.tsx          # Org Chart
│   │   ├── tasks.tsx        # Task Queue
│   │   ├── agents.tsx       # Agent list (redirects to /agents/[slug])
│   │   ├── agents_[slug].tsx # Agent detail (dynamic)
│   │   ├── budget.tsx       # Budget tracker
│   │   ├── memory.tsx       # Supervisor memory viewer
│   │   ├── reports.tsx      # Daily reports
│   │   └── approvals.tsx    # Pending approvals
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── OrgChart.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── TaskCard.tsx
│   │   ├── AgentCard.tsx
│   │   ├── BudgetChart.tsx
│   │   ├── MemoryViewer.tsx
│   │   └── ApprovalCard.tsx
│   ├── lib/
│   │   ├── agents.ts        # Agent data + report parsing
│   │   ├── reports.ts       # Report file reading
│   │   ├── memory.ts        # Memory file reading
│   │   └── tinytoolbox.ts   # Site status fetching
│   └── styles/
│       └── globals.css
├── public/
│   └── favicon.svg
└── package.json
```

**Agent Status Logic:**
- Green: heartbeat within last 2 hours
- Yellow: heartbeat within last 12 hours
- Red: no heartbeat in 12+ hours

**File Paths (absolute for reading):**
- AGENTS.md: `/home/workspace/AGENTS.md`
- Reports: `/home/workspace/agent-reports/`
- Memory: `/home/workspace/agent-reports/memory/`
- Trends: `/home/workspace/agent-reports/memory/trends.md`

## 5. Implementation Order

1. **Shell + sidebar + layout** — Establish navigation framework
2. **Mission Control page** — Stats, org chart preview, activity feed
3. **Org Chart page** — Full interactive org visualization
4. **Agent list + detail pages** — Agent data from AGENTS.md + report parsing
5. **Task Queue page** — Task status from reports
6. **Budget page** — Token tracking from trends.md
7. **Memory viewer** — Render memory/*.md files as styled markdown
8. **Reports page** — List + inline expand for compiled reports
9. **Approvals page** — Placeholder (agent approval requests future feature)

## 6. Out of Scope (v1)

- Real-time WebSocket updates (polling is fine for v1)
- Agent triggering from dashboard (manual agent runs)
- Writing/editing agent configs
- Notification system
