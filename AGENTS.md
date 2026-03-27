# ASAYA Media Workspace — Agent Memory

## Who I Am
I assist Daniel Lamberth, CEO & Creative Director of ASAYA Media. Website: https://asayamedia.com. Socials: @asayamedia on X, LinkedIn, GitHub, Instagram.

## Active Projects

### TinyToolbox (PRIMARY)
**URL:** https://tinytoolbox.co  
**Repo:** `https://github.com/ASAYAMedia/tinytoolbox`  
**Local Path:** `/home/workspace/tinytoolbox-github`  
**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Lucide React

**What it is:** A free browser-native micro-tool platform with 316 single-purpose utilities (PDF, converters, generators, AI tools, games) across categories: Developer, Text, Security, Color, SEO, Math, Finance, Health, Time, Converter, Utility, Social, Games.

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

## gstack Principles

> Based on Garry Tan's gstack system (https://github.com/garrytan/gstack) — 50k stars, MIT license. Study these. Live them.

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