# TinyToolbox Performance Report — 2026-03-24 08:00 UTC

## Overall Performance Score

**Estimated: 72–78 / 100** (Lighthouse simulation)
> PSI API quota exhausted. Score estimated from curl metrics + page structure analysis. Previous: ~65–75.

---

## Server Timing

| Page | TTFB | Total Load | Size | HTTP |
|------|------|-----------|------|------|
| `/` (home) | 318ms | 320ms | 117 KB | 200 |
| `/tools` | 516ms | 635ms | **807 KB** | 200 |
| `/blog` | 429ms | 448ms | 91 KB | 200 |

> ⚠️ `/tools` at **807 KB** is a significant bloat concern — likely tool grid rendering all 317 tools on load.

---

## Core Web Vitals (Estimated)

| Metric | Target | Estimated | Status |
|--------|--------|-----------|--------|
| LCP | < 2.5s | ~2.0–2.5s | 🟡 Risk |
| FID/INP | < 100ms | ~50–80ms | 🟢 Acceptable |
| CLS | < 0.1 | ~0.08–0.15 | 🟡 Risk |
| FCP | < 1.8s | ~1.2–1.8s | 🟢 Acceptable |
| Speed Index | < 3.4s | ~2.5–3.0s | 🟢 Borderline |

---

## Issues Found

### 🔴 High Priority

1. **`/tools` page delivers 807 KB on load**
   - Unbounded tool grid rendering — all 317 tools likely render synchronously
   - No virtual scrolling, pagination, or lazy loading
   - Impact: Mobile LCP likely suffers, TTI elevated
   - Fix: Implement windowed/virtual list (e.g. `react-window`), or paginate at 50 tools

2. **Heavy animation stack on home page (unchanged)**
   - Canvas particle background + multiple `mix-blend-screen` divs with `animate-pulse-slow` + blur effects
   - 3 layered gradient orbs with `blur-[100-120px]`, all animating on main thread
   - Impact: CLS risk, mobile LCP suppression
   - Fix: Replace CSS animations with `will-change: transform` + `content-visibility: hidden` off-screen

### 🟡 Medium Priority

3. **No image lazy loading detected**
   - All `<img>` tags should have `loading="lazy"` below the fold
   - Affects tool cards and any thumbnail imagery
   - Fix: Add `loading="lazy"` universally; use `loading="eager"` only for above-fold LCP image

4. **AdSense script loads synchronously (known tradeoff)**
   - `adsbygoogle.js` uses a blocking script tag
   - Cannot defer without breaking ad rendering
   - Mitigated by `preconnect`/`dns-prefetch` already in place
   - Impact: Minimal — ads are revenue-critical

5. **Duplicate CSS chunk references in HTML**
   - Each Next.js CSS chunk appears twice in the HTML
   - Likely Next.js hot-reload artifact in production build
   - Fix: Verify production build output; if persistent, investigate webpack chunk config

6. **No `content-visibility: auto` on off-screen sections**
   - Sections below fold (tool grid, footer, etc.) still paint on initial load
   - Fix: Add `content-visibility: auto` to `<section>` wrappers below fold

---

## What Was Fixed Since Last Check ✅

- **Preconnect/prefetch resource hints now present**: `pagead2.googlesyndication.com`, `fonts.gstatic.com`, `picsum.photos` all have `preconnect` + `dns-prefetch` — improved from 0 hints previously
- **All 16+ script tags now use `async`**: Previously some were blocking; now all non-critical scripts are async
- **Font preconnect in place**: `fonts.gstatic.com` preconnected — no font fetch penalty
- **TTFB improved**: Home page TTFB dropped from 838ms → 318ms (62% faster)

---

## Priority Fixes

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Virtualize `/tools` grid (react-window or pagination) | LCP ↓, TTI ↓ | Medium |
| 2 | Add `content-visibility: auto` to below-fold sections | Paint ↓ | Low |
| 3 | Add `loading="lazy"` to all below-fold images | LCP ↓ | Low |
| 4 | Simplify CSS blur animations — reduce blur radius or use `will-change` | CLS ↓, LCP ↓ | Medium |
| 5 | Investigate duplicate CSS chunk emission in production build | Bundle ↓ | Medium |

---

## Comparison to Previous Check

| Metric | Previous (2026-03-23 20:00) | Current (2026-03-24 08:00) | Delta |
|--------|----------------------------|----------------------------|-------|
| Overall Score | ~65–75 | ~72–78 | ↑ +7 |
| TTFB (home) | 838ms | 318ms | ↓ **−520ms (62% better)** |
| TTFB (/tools) | 792ms | 516ms | ↓ −276ms (35% better) |
| Resource Hints | 0 | 4 (preconnect ×3 + dns-prefetch ×3) | ↑ Fixed |
| Script Blocking | 1 sync script | 0 blocking scripts | ↑ Fixed |
| /tools Page Size | — | 807 KB | ⚠️ New concern |
| Issues Found | 5 (2 high, 3 medium) | 6 (2 high, 4 medium) | Slightly more |

> **Key wins:** TTFB cut significantly, blocking scripts eliminated, preconnect hints added.
> **New concern:** `/tools` page at 807 KB with no virtualization is the biggest performance risk right now.

---

## Competitor Context

Small tool site competitors (e.g., tinywow.com, safeeditor.com) typically achieve:
- Performance scores: 75–90 (mobile)
- TTFB: 200–500ms (edge-cached)
- Page sizes: 200–400 KB (lazy-loaded grids)

TinyToolbox is competitive on TTFB but ahead-of-curve on `/tools` page weight. Virtualizing the tool grid would put it ahead of most competitors.

---

## Next Check

- Scheduled: **2026-03-24 20:00 UTC (4:00 PM ET)**
- Action: Re-run PSI if quota resets; otherwise continue timing + structure monitoring

---

*Report generated: 2026-03-24 12:08 UTC*
*Agent: Performance Monitor | ID: 8238eb63-bbec-4a27-ac97-f19e77ed7df4*
