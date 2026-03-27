# ASAYA Media Workspace — Agent Memory

## Who I Am
I assist Daniel Lamberth, CEO & Creative Director of ASAYA Media. Website: https://asayamedia.com. Socials: @asayamedia on X, LinkedIn, GitHub, Instagram.

## Active Projects

### TinyToolbox (PRIMARY)
**URL:** https://tinytoolbox.co  
**Repo:** `https://github.com/ASAYAMedia/tinytoolbox`  
**Local Path:** `/home/workspace/tinytoolbox-github`  
**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Lucide React

**What it is:** A free browser-native micro-tool platform with **431** single-purpose utilities (PDF, converters, generators, AI tools, games) across categories: Developer, Text, Security, Color, SEO, Math, Finance, Health, Time, Converter, Utility, Social, Games.

**Site Structure:**
- `/` — Home (Hero → Ticker → Features → **Fresh Additions** → ToolGrid → Footer)
- `/tools` — All tools listing with search/filter
- `/tools/[slug]` — Individual tool pages
- `/blog` — Blog section
- `/categories` — Category listing
- `/embed/[slug]` — Embeddable tool versions

**Key Files:**
- `lib/tools.ts` — Tool definitions (316 tools, array order = addition order)
- `components/` — UI components (navbar, hero, features, tool-grid, ticker, newest-tools, footer, etc.)
- `components/tools/[slug].tsx` — Individual tool React components
- `app/page.tsx` — Home page
- `app/tools/[slug]/page.tsx` — Tool page template (dynamic, uses TOOL_MAP)
- `lib/tool-content.ts` — SEO content (how-to, FAQs) per tool
- `data/subscribers.json` — Newsletter subscriber list
- `globals.css` — Design system (glass panels, mesh gradients, shimmer borders, aurora glow)

**Design System (match exactly):**
- Background: black, mesh-gradient animation, scanlines overlay, noise texture
- Glass panels: `glass-panel` (`bg-white/5 backdrop-blur-xl border border-white/10`) or `glass-panel-thick` (`bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12]`)
- Text: white primary, zinc-400 secondary, cyan-400/purple-400/pink-400 accents
- Gradient text: `gradient-text-vivid` class (cyan→purple→pink animation)
- Cards: `shimmer-border` + `glass-panel-thick` + `TiltCard` wrapper
- Borders: `rounded-[2.5rem]` for big cards, `rounded-3xl` for panels
- Fonts: `font-display` for headings, `font-sans` for body, `font-mono` for labels/counts
- Tool pages: black glass terminal aesthetic, category-colored accents

**Deployment:** Pushes to GitHub auto-deploy to Vercel. After every change → commit → push.

**Tool Addition Process:**
1. Add tool definition to `lib/tools.ts` at END of array with: slug, name, description, category, icon (from lucide-react), accent (tailwind color), metaTitle, h1, targetKeyword
2. Create component at `components/tools/[slug].tsx` with `'use client'` directive
3. Add to `TOOL_MAP` in `app/tools/[slug]/page.tsx`: `'slug-name': dynamic(() => import('@/components/tools/slug-name').then(mod => mod.ComponentName))`
4. Optionally add SEO content to `lib/tool-content.ts`
5. Commit and push

---

## Skills

### `build-tool` — Tool Creation
Location: `/home/workspace/Skills/build-tool/SKILL.md`
Builds a complete TinyToolbox tool end-to-end. Always use this when Daniel asks to create/build/add a new tool.

### `tinytools-newsletter` — Newsletter
Location: `/home/workspace/Skills/tinytools-newsletter/SKILL.md`
Generates and sends weekly HTML newsletters to subscribers.

**Newsletter setup (RESEND API):**
1. Get API key from https://resend.com
2. Add `RESEND_API_KEY` to [Settings > Advanced](/?t=settings&s=advanced) as secret
3. Run: `cd /home/workspace/Skills/tinytools-newsletter/scripts && bun run generate-newsletter.ts && bun send-newsletter.ts`

### `pinterest-automation` — Pinterest Automation
Location: `/home/workspace/Skills/pinterest-automation/SKILL.md`
Automates the creation and posting of AI-generated Pinterest pins for low-competition keywords.

**Setup (PINTEREST_AFFILIATE.md):**
1. Get API key from https://developers.pinterest.com
2. Add `PINTEREST_API_KEY` to [Settings > Advanced](/?t=settings&s=advanced) as secret
3. Run: `cd /home/workspace/Skills/pinterest-automation/scripts && bun run generate-pins.ts && bun post-pins.ts`

---

## Rules (from Daniel's preferences)

1. **ALWAYS commit + push** after every change to tinytoolbox
2. **Before any request**, decide: MiniMax or Kimi? (MiniMax for coding/builds, Kimi for research/deep dives)
3. **Domain**: ONLY tinytoolbox.co — never mention .co.uk or other variants
4. **Environment**: tinytoolbox lives at `/home/workspace/tinytoolbox-github` — NOT zo.space

---

## What's Been Done

- ✅ Home page with Hero, Ticker, Features, Fresh Additions (newest tools), ToolGrid, Footer
- ✅ 316 tools defined in lib/tools.ts
- ✅ Individual tool pages at /tools/[slug] with TOOL_MAP dynamic loading
- ✅ Search/autocomplete in hero
- ✅ Glass-morphism + shimmer + tilt-card design system
- ✅ AdSense ad slots placed throughout the site
- ✅ Newsletter skill (generates + sends via Resend)
- ✅ SOUL.md personality guide
- ✅ AGENTS.md workspace memory
- ✅ CONVENTIONS.md design + tool patterns
- ✅ build-tool skill

## Known Gaps / To-Do

- [ ] **Social sharing**: X/Twitter and LinkedIn not connected for traffic agent — HIGH PRIORITY
- [ ] **Newsletter**: Needs Resend API key to send (1 subscriber currently) — HIGH PRIORITY
- [ ] **Analytics**: Google Analytics or Plausible not yet connected
- [ ] **SEO**: Submit sitemap, configure Google Search Console
- [ ] **404 page**: For /tools/[slug] routes that don't exist
- [ ] **Subscriber growth**: Only 1 newsletter subscriber — needs lead gen
- [ ] **OG tags**: Need verification for blog/tools sharing
- [ ] **Pinterest automation**: Partially done. API key needed, scripts not yet integrated.

---

## Affiliate Marketing Knowledge Base

**Location:** `file '/home/workspace/Knowledge-Base/affiliate-marketing-dude/'`

Marcus Campbell (@affiliatemarketingdude) — 16 years affiliate marketing, 273K YouTube subs, 2K+ blog posts. **ALWAYS reference this knowledge** for monetization, niche research, affiliate strategies.

### Top Money Methods (Ranked by Ease)
1. **AI Content Repurposing** — $100-300/day: Convert client videos → blogs/social/Pinterest
2. **Pinterest Affiliate** — $200-800/day: AI pins for low-competition keywords  
3. **Directory/PPL Sites** — $500-800/lead: Simple 2-3 page sites, charge businesses monthly
4. **Faceless YouTube AI** — $500-5000/day: VEO3/Sora + ElevenLabs for daily content
5. **AI Tool Sites** — $100-5000/day: Simple calculators → AdSense + affiliates

### High-Ticket Affiliate Programs
| Program | Commission | Best For |
|---------|-----------|----------|
| Capital One | $200/lead | Credit cards |
| Target | $50-200/sale | Home/kitchen |
| Walmart | $100-500/sale | General merch |
| PPL Networks | $50-800/lead | Legal, finance, solar |
| Shopify | $200/sale | E-commerce |
| Home Depot | 7% | Home improvement |

### Core AI Tools Marcus Promotes
- **Manus AI** — autonomous site/builder creating full affiliate sites
- **ChatGPT/Claude** — content, coding, automation, prompts
- **Gemini Deep Research** — niche research, competitor analysis
- **Notebook LM** — content repurposing, SEO blogs from any source
- **Bolt AI** — vibe coding, rapid prototyping
- **Perplexity AI** — real-time niche discovery

### Traffic Strategy Priority
1. Pinterest SEO (fastest organic growth, lowest competition)
2. Notebook LM blogs (auto-generate from videos/audio)
3. Google AI Overviews (new opportunity, get content AI-summarized)
4. Faceless YouTube (VEO3 + affiliate links)
5. Cold email outreach (for B2B affiliate leads)

### Key Prompts (Use These)
**Niche Research:** "Find 10 low-competition niches with high-ticket affiliate programs ($100+/sale), search volume 1000-10000/month, clear buyer intent"

**Content Repurposing:** "Take this transcript and create: 1) 1500-word SEO blog post, 2) 5 Twitter/X threads, 3) 10 Pinterest pin descriptions, 4) email newsletter snippet, 5) 5 quote graphics"

**Profit Angle Extraction:** "For this affiliate offer: 1) Who is the buyer? (demographics, pain point) 2) What is the commission? 3) What traffic source converts best? 4) What hook makes buyers click? 5) Write 5 ad headlines that convert"

### Key Frameworks
**VIP Framework (Offer Evaluation):**
- Viability — Is this offer actually profitable?
- Interest — Can you create content around it consistently?
- Proof — Are there case studies and earnings reports?

**AI Skill File Method:**
Train a specialized AI agent (Manus, Claude Projects) to:
1. Monitor a niche daily
2. Generate content on autopilot
3. Post to platforms
4. Track and report earnings
= "Virtual employee" for $20-75/month vs $75K/year human

**7-Day AI Business Setup:**
1. Day 1-2: Pick niche + find affiliate program
2. Day 3-4: Build simple site (Bolt AI or WordPress + AI)
3. Day 5-6: Create 10 pieces of AI content
4. Day 7: Publish + set up analytics + join networks

### When to Reference This Knowledge
- Daniel asks about affiliate marketing strategies
- Niche research or keyword research questions
- AI tool comparisons or prompts
- Traffic generation methods
- Monetization (how to make money online)
- Website building/funnel questions
- Video/content automation with AI
- "How does X make money" questions
- Product review / affiliate program recs

### Knowledge Files Reference
- `QUICK_REFERENCE.md` — 5KB cheat sheet, THE go-to reference
- `KNOWLEDGE_MASTER.md` — 153KB of strategies from 1,273 posts
- `VIDEO_CATALOG.md` — 449 YouTube videos with links
- `TOPICS_INDEX.md` — categorized by topic (AI Tools, Traffic, Niches, etc.)

### 🧰 Your Complete Toolkit (All 11 Methods)

| # | Method | Role | File |
|---|--------|------|------|
| 1 | **Reverse Engineering** | Find what works | `REVERSE_ENGINEERING_SUC` |
| 2 | **AI Content Repurposing** | Convert client videos → blogs/social/Pinterest | `AI_CONTENT_REPURPOSING.md` |
| 3 | **Pinterest Affiliate** | AI pins for low-competition keywords | `PINTEREST_AFFILIATE.md` |
| 4 | **Directory/PPL Sites** | Simple 2-3 page sites, charge businesses monthly | `DIRECTORY_PPL_SITES.md` |
| 5 | **Faceless YouTube AI** | VEO3/Sora + ElevenLabs for daily content | `FACELESS_YOUTUBE_AI.md` |
| 6 | **AI Tool Sites** | Simple calculators → AdSense + affiliates | `AI_TOOL_SITES.md` |
| 7 | **High-Ticket Affiliate Programs** | $200/lead | `HIGH_TICKET_AFFILIATE_PROGRAMS.md` |
| 8 | **Core AI Tools Marcus Promotes** | Manus AI, ChatGPT/Claude, Gemini Deep Research, Notebook LM, Bolt AI, Perplexity AI | `CORE_AI_TOOLS.md` |
| 9 | **Traffic Strategy Priority** | Pinterest SEO, Notebook LM blogs, Google AI Overviews, Faceless YouTube, Cold email outreach | `TRAFFIC_STRATEGY_PRIORITY.md` |
| 10 | **Key Prompts (Use These)** | Niche Research, Content Repurposing, Profit Angle Extraction | `KEY_PROMPTS.md` |
| 11 | **Key Frameworks** | VIP Framework (Offer Evaluation), AI Skill File Method, 7-Day AI Business Setup | `KEY_FRAMEWORKS.md` |

---

## Agent Fleet Architecture

### Overview
TinyToolbox operates a **multi-agent system** where specialized agents run on schedules and report to a **Supervisor Agent** that compiles, learns, and escalates.

### Agent Memory System
**Location:** `/home/workspace/agent-reports/`

```
agent-reports/
├── memory/
│   ├── knowledge-base.md      # Main memory — site profile, issues, patterns, recommended actions
│   ├── issues-tracker.md      # Open/resolved issues with age tracking
│   ├── actions-log.md         # Actions recommended and their outcomes
│   ├── trends.md              # Metrics tracked over time
│   └── daily-summaries/       # Per-day summary snapshots
│       └── YYYY-MM-DD.md
├── compiled/                  # Compiled daily reports (supervisor output)
│   └── YYYY-MM-DD.md
├── {agent-slug}_YYYY-MM-DD.md # Individual agent reports (inputs)
└── supervisor_memory.md       # Supervisor's own working memory
```

### Supervisor Agent: "Compile Daily Agent Reports"
- **Schedule:** Daily at 6:30pm ET
- **Function:** Gathers all agent reports, updates memory system, compiles into one document, emails to skipartai@gmail.com
- **Learning behaviors:**
  - Tracks issue age (escalates after 3+ days stale)
  - Cross-references findings across agents
  - Detects trends before they become problems
  - Logs all actions and outcomes for pattern recognition
  - Auto-deprioritizes actions not completed in 3 cycles
- **ID:** `4974e47a-23ae-4bae-ab2c-be4e7658ef39`

### Operational Agents (10 total)

| Agent | Schedule | Model | Function |
|-------|----------|-------|---------|
| Blog Writer | Daily 9am | Kimi | Creates one blog post daily |
| Tool Creator | Daily 9am | MiniMax | Builds one new tool daily |
| QA Maintenance | Daily 9am & 9pm | Kimi | Scans site, fixes issues |
| Monetization Scout | Daily 9am | MiniMax | Finds affiliate & ad opportunities |
| SEO Agent | Weekly Mon 10am | MiniMax | Analyzes search rankings |
| Competitor Watch | Weekly Wed 2pm | MiniMax | Monitors competitor moves |
| Social Distribution | Daily 11am | MiniMax | Posts to X/LinkedIn |
| User Feedback | Daily 4pm | MiniMax | Monitors brand mentions |
| Performance | Daily 8am & 8pm | MiniMax | Checks Core Web Vitals |
| Translation Audit | Hourly | MiniMax | Finds untranslated text |

### Report Flow
1. Each agent saves report to `/home/workspace/agent-reports/{slug}_{date}.md`
2. Supervisor runs daily at 6:30pm, reads all report files
3. Updates memory system (knowledge-base, issues, actions, trends)
4. Compiles one document and emails to skipartai@gmail.com
5. Saves compiled report to `compiled/{date}.md`

### Notes
- All agents save to FILE (not email) — supervisor handles compilation
- Supervisor can take autonomous action on: typos, broken links, simple config fixes
- Supervisor must NOT: post on social media, spend money, make irreversible code changes
- Newsletter agent (weekly) still emails subscribers directly — customer-facing, not internal report

## Operating System (gstack + Superpowers + Paperclip)

Three frameworks integrated:

### gstack Principles (Foundation)

> Based on Garry Tan's gstack system (https://github.com/garrytan/gstack): 50k stars, MIT. Think bigger. Ship more.

### Core Philosophy

**1. Boil the Lake**
AI makes completeness near-zero cost. When the complete implementation costs minutes more than the shortcut — do the complete thing. Every time.

- If "full version (~150 LOC) vs 90% shortcut (~80 LOC)" — always choose full. The 70-line delta costs seconds with AI.
- "Defer tests to follow-up PR" → Tests are the cheapest lake to boil.
- "This would take 2 weeks" → Say: "2 weeks human / ~1 hour AI-assisted."

**Lakes** are boilable (100% test coverage, full feature, all edge cases). **Oceans** are not (rewriting entire systems). Boil lakes. Flag oceans as out of scope.

**2. Search Before Building**
The 1000x engineer's first instinct is "has someone already solved this?" not "let me design it from scratch."

Three Layers of Knowledge:
- **Layer 1: Tried and true** — Standard patterns, battle-tested. Question them occasionally.
- **Layer 2: New and popular** — Blog posts, trends. Scrutinize — crowds can be wrong.
- **Layer 3: First principles** — Original observations. Most valuable. Prize these above all else.

**The Eureka Moment:** When first-principles reasoning reveals conventional wisdom is wrong — name it, celebrate it, build on it.

**3. Build for Yourself**
The best tools solve your own problem. The specificity of a real problem beats the generality of a hypothetical one every time.

### Compression Ratios (Human vs AI-Assisted)

| Task | Human Team | AI-Assisted | Compression |
|------|-----------|-------------|-------------|
| Boilerplate/scaffolding | 2 days | 15 min | ~100x |
| Test writing | 1 day | 15 min | ~50x |
| Feature implementation | 1 week | 30 min | ~30x |
| Bug fix + regression test | 4 hours | 15 min | ~20x |
| Architecture/design | 2 days | 4 hours | ~5x |
| Research/exploration | 1 day | 3 hours | ~3x |

### How These Principles Apply to Our Work

1. **Do the complete thing** — tests, edge cases, error paths cost seconds with AI. Do them.
2. **Search before building** — has someone solved this? Check tried-and-true (Layer 1) and new-and-popular (Layer 2) before first-principles (Layer 3).
3. **Name eureka moments** — when first-principles reasoning reveals conventional wisdom is wrong, document it.
4. **Tests make vibe coding safe** — 100% coverage goal. Every bug fix should generate a regression test.
5. **Diagrams force hidden assumptions** — use them in planning (sequence, state, component, data-flow).
6. **One person with AI = team of twenty** — act like it. Ship more. Review more. Test more.

### Workflow Patterns to Emulate

- **Full sprint lifecycle:** office-hours → plan → implement → review → QA → ship → retro
- **Parallel sprints:** Multiple features in flight simultaneously, each with structured process
- **Review before shipping:** /review catches bugs that pass CI but blow up in production
- **QA with regression tests:** Every bug fix generates a test that prevents recurrence

### Superpowers Methodology (Workflow Discipline)

> From obra/superpowers (https://github.com/obra/superpowers) — 116k stars, MIT. Jesse Vincent / Prime Radiant. The core insight: agents MUST NOT jump straight into code. They must think first.

#### The Iron Law (Non-Negotiable)
```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```
Write code before tests → delete it and start over with TDD. No exceptions.

#### The Mandatory Skill Sequence (for every creative work)

**BEFORE ANY IMPLEMENTATION — even "simple" stuff:**

1. **brainstorming** — Activates before writing code. Refines rough ideas through questions, explores alternatives, presents design in sections for validation. Saves design document. **MANDATORY — do NOT skip for any request, no matter how simple it seems.**
   - Check project context first (files, docs, recent commits)
   - Ask clarifying questions ONE AT A TIME
   - Propose 2-3 approaches with tradeoffs + recommendation
   - Present design in digestible sections, get approval after each
   - Write design doc to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
   - Spec self-review: placeholder scan, internal consistency, scope check, ambiguity check
   - User reviews spec before proceeding
   - ONLY THEN → invoke writing-plans skill

2. **writing-plans** — Activates with approved design. Breaks work into bite-sized tasks (2-5 minutes each). Every task has exact file paths, complete code, verification steps.
   - Bite-sized = one action per step: write failing test → run it → write minimal code → run test → commit
   - No placeholders ever. No "TBD", no "TODO", no "implement later", no "similar to Task N"
   - File structure mapping before task decomposition
   - Plan document MUST start with agent handoff header

3. **subagent-driven-development** OR **executing-plans** — Dispatches fresh subagent per task with two-stage review (spec compliance, then code quality), or executes in batches with human checkpoints.
   - Two-stage review: (1) Does it match the spec? (2) Is the code quality good?
   - Critical issues block progress

4. **test-driven-development** — Enforces RED-GREEN-REFACTOR cycle:
   - RED: Write failing test. Watch it fail for the RIGHT reason.
   - GREEN: Minimal code to pass. Nothing more.
   - REFACTOR: Clean up, keep tests green.
   - Delete code written before tests. Period.

5. **requesting-code-review** — Activates between tasks. Reviews against plan, reports issues by severity. Critical issues block progress.

6. **finishing-a-development-branch** — Activates when tasks complete. Verifies tests, presents options (merge/PR/keep/discard), cleans up worktree.

#### Anti-Pattern: "This Is Too Simple To Need A Design"
Every project goes through this process. A todo list, a single-function utility, a config change — all of them. "Simple" projects are where unexamined assumptions cause the most wasted work. The design can be short, but you MUST present it and get approval.

#### Key Superpowers Principles to Live By
- **YAGNI ruthlessly** — Remove unnecessary features from all designs
- **Systematic over ad-hoc** — Process over guessing
- **Evidence over claims** — Verify before declaring success
- **Complexity reduction** — Simplicity as primary goal
- **Design for isolation** — Each unit: one clear purpose, well-defined interface, testable independently
- **Smaller files > larger files** — When a file grows large, it's doing too much. Split it.

#### How Superpowers Integrates With gstack
- gstack says: "Boil the lake" — Superpowers says: "Here's the exact procedure to boil it properly"
- gstack says: "Search before building" — Superpowers says: "Check context first in brainstorming"
- gstack says: "Do the complete thing" — Superpowers says: "RED-GREEN-REFACTOR, no shortcuts"
- Together: creative freedom within disciplined process

### Paperclip Methodology (Company Structure)

> From paperclipai/paperclip (https://github.com/paperclipai/paperclip) — 34k stars, MIT. The core insight: model AI agents as real employees with real company structure. The unit of organization is a COMPANY, not a script.

#### The Paperclip Mental Model

Paperclip reimagines autonomous AI work as an actual company:

| Paperclip Concept | What It Means for Us |
|---|---|
| **Company** | A first-order object with goal, budget, org chart, and employees. For us: TinyToolbox IS the company. |
| **Goal hierarchy** | Every task traces back to the company mission via parent chain. For us: every agent task must answer "why does this matter to tinytoolbox.co?" |
| **Org chart** | Agents have bosses, titles, roles. Reporting lines are explicit. For us: Supervisor is CEO, domain agents are departments. |
| **Heartbeats** | Agents wake on schedule, check work, act, report. Delegation flows up/down the org chart. For us: our scheduled agents ARE heartbeats. |
| **Token budgets** | Every agent has a token salary. When exhausted, they stop. For us: monitor token spend, enforce cost discipline. |
| **Approval gates** | Certain actions require board approval before execution. For us: major strategic decisions get Daniel's approval first. |
| **Ticket system** | Every conversation traced. Every decision explained. Full audit log. For us: all agent reports are tickets. |

#### The TinyToolbox Org Chart (Paperclip Model)

```
TinyToolbox Company (tinytoolbox.co)
│
├── CEO (Daniel) — board of one, approval authority, strategic direction
│   │
│   ├── Supervisor Agent (compile + learn + escalate)
│   │   │
│   │   ├── Tool Creator (daily 9am, MiniMax) — builds new tools
│   │   ├── Blog Writer (daily 9am, Kimi) — creates blog content
│   │   ├── QA Maintenance (daily 9am & 9pm, Kimi) — scans + fixes
│   │   ├── Monetization Scout (daily 9am, MiniMax) — finds revenue ops
│   │   ├── SEO Agent (weekly Mon 10am, MiniMax) — search rankings
│   │   ├── Competitor Watch (weekly Wed 2pm, MiniMax) — monitors rivals
│   │   ├── Social Distribution (daily 11am, MiniMax) — posts content
│   │   ├── User Feedback (daily 4pm, MiniMax) — brand mentions
│   │   ├── Performance (daily 8am & 8pm, MiniMax) — Core Web Vitals
│   │   └── Translation Audit (hourly, MiniMax) — i18n completeness
│   │
│   └── Newsletter (weekly, MiniMax) — email campaign
```

#### Paperclip Principles to Live By

1. **Company is the unit** — Everything is scoped to TinyToolbox company. No work exists in isolation.
2. **All work traces to the goal** — "Why am I doing this?" must always answer up to "grow tinytoolbox.co revenue and reach."
3. **Control plane, not execution plane** — Orchestrate. Agents do the work. Report up. Don't micromanage the execution.
4. **Safe autonomy** — Agents can act autonomously within budgets and approval gates. Hidden token burn is not allowed.
5. **Goal ancestry on every task** — Every agent task must carry its parent goal chain. Agents always know WHY.
6. **Output-first** — Work is not done until there is a visible result: file, report, deployed change, metric movement.
7. **Time-to-first-success** — New agent or skill should produce meaningful output in under one cycle.
8. **Atomic task checkout** — One agent per task. No two agents working the same thing. Ever.

#### How Paperclip Integrates With gstack + Superpowers

- **gstack** says "think bigger, ship more" → **Paperclip** says "here's how to organize that thinking into a real company"
- **Superpowers** says "design before code" → **Paperclip** says "that design traces back to the company goal"
- Together: disciplined creative process within a real organizational structure that produces measurable business outcomes

#### Paperclip Rules for Agent Behavior

1. **Every task has goal ancestry** — Before acting, agent states the parent goal chain: "I am doing X because → Y because → [company goal]"
2. **Budget awareness** — Track token spend per agent cycle. Flag when approaching limits.
3. **Approval for major moves** — Strategic pivots, new revenue channels, major site changes require Daniel's sign-off
4. **Output as definition of done** — No "worked on" — only "delivered: [specific result]"
5. **Heartbeat discipline** — Every scheduled agent: wake → check → act → report → sleep. No wandering.
6. **Escalation path** — Blocked → supervisor → CEO (Daniel). Never stay stuck.