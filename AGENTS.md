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

- [ ] **Newsletter**: Needs Resend API key to send (1 subscriber currently)
- [ ] **Analytics**: Google Analytics or Plausible not yet connected
- [ ] **Social sharing**: X/Twitter and LinkedIn not connected for traffic agent
- [ ] **Blog content**: "AI Insider" needs regular posts
- [ ] **SEO**: Submit sitemap, configure Google Search Console
- [ ] **404 page**: For /tools/[slug] routes that don't exist
- [ ] **Subscriber growth**: Only 1 newsletter subscriber — needs lead gen
- [ ] OG tags: Need verification for blog/tools sharing
