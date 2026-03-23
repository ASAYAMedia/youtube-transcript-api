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