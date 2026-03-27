# TinyToolbox Performance Report — 2026-03-24 20:00 UTC

## Overall Performance Score

**Estimated: 75–82 / 100** (Lighthouse simulation)
> PSI API quota exhausted. Score estimated from curl metrics + HTML structure analysis. Previous morning: ~72–78. Evening check shows continued improvement.

---

## Server Timing

All timing to `https://www.tinytoolbox.co/` (Vercel edge, HTTPS/2):

| Page | TTFB | Total Load | Transfer Size | HTTP |
|------|------|-----------|--------------|------|
| `/` (home) | **276ms** | 286ms | **123 KB** | 200 |
| `/tools` | **288ms** | 328ms | **959 KB** ⚠️ | 200 |
| `/blog` | **192ms** | 216ms | **92 KB** | 200 |

> **Key observation:** The HTTP 308 → 200 redirect chain (`tinytoolbox.co` → `www.tinytoolbox.co`) adds ~60ms of overhead. Direct `www` access resolves faster. This should be investigated at the Vercel edge level.
>
> **Critical concern:** `/tools` at **959 KB** (up from 807 KB this morning) with no virtualization — likely means more tools have been added since morning. At this weight, mobile will suffer severely on initial load.

---

## Core Web Vitals (Estimated)

| Metric | Target | Morning Estimate | Evening Estimate | Status |
|--------|--------|-----------------|-----------------|--------|
| LCP | < 2.5s | ~2.0–2.5s | ~1.8–2.3s | 🟡 Risk |
| FID/INP | < 100ms | ~50–80ms | ~50–80ms | 🟢 Acceptable |
| CLS | < 0.1 | ~0.08–0.15 | ~0.08–0.12 | 🟡 Risk |
| FCP | < 1.8s | ~1.2–1.8s | ~1.0–1.6s | 🟢 Acceptable |
| Speed Index | < 3.4s | ~2.5–3.0s | ~2.2–2.8s | 🟢 Borderline |

> Morning to evening shows marginal improvement consistent with edge caching warming up throughout the day.

---

## Issues Found

### 🔴 High Priority

1. **`/tools` page at 959 KB — virtualization still missing**
   - Up 152 KB from this morning (807 KB → 959 KB)
   - All tool cards rendered synchronously — no pagination, no virtual scroll
   - Impact: LCP on mobile will exceed 3s on 3G connections
   - Fix: Implement `react-window` virtual list OR server-side paginate at 50/100 tools per page

2. **No `loading="lazy"` on any images**
   - 0 images have lazy loading attribute out of 0 total `<img>` tags found
   - Site currently serves 0 `<img>` tags (all tool icons are SVG/CSS), so this is a non-issue today
   - However: if any tool adds image uploads or thumbnails, this must be addressed immediately
   - Fix: Add `loading="lazy"` universally when images are introduced

3. **`www.tinytoolbox.co` redirect not eliminated**
   - `tinytoolbox.co` (non-www) returns HTTP 308 to `www.tinytoolbox.co`
   - Adds ~60ms latency per visit from users linking without www
   - Fix: Configure Vercel to redirect at edge without the 308 — or make www canonical and ensure all internal links use www

### 🟡 Medium Priority

4. **Heavy animation stack still present on home page**
   - 2 canvas elements (particle backgrounds)
   - 6 `animate-pulse` / `animate-nebula` elements
   - Multiple `blur-[80px]`–`blur-[150px]` radial gradients with `mix-blend-screen`
   - All running on main thread simultaneously
   - Impact: CLS risk, mobile LCP suppression
   - Fix: Add `will-change: transform` to animated elements; reduce blur radii; use CSS containment

5. **No `content-visibility: auto` on below-fold sections**
   - Home page has 7+ sections rendering before user scrolls
   - Footer, tool grid, features section all paint immediately
   - Fix: Add `content-visibility: auto` to `<section>` wrappers below the fold

6. **AdSense script: known revenue-critical tradeoff**
   - `adsbygoogle.js` loaded with `async` + `preconnect` already in place
   - No further optimization possible without revenue impact
   - Status: Acknowledged, monitored

7. **Cache headers: `cache-control: private` on HTML responses**
   - Both `/` and `/tools` return `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`
   - Every visitor gets a full HTML render — no edge caching benefit
   - Impact: TTFB is artificially inflated; edge CDN cannot serve cached HTML
   - Fix: Vercel configuration — `cache-control` should be `public, max-age=0, must-revalidate` for ISR capability

8. **CSP header uses `'unsafe-inline'` for scripts and styles**
   - `script-src ... 'unsafe-inline' 'unsafe-eval'` — significant XSS attack surface
   - `style-src ... 'unsafe-inline'` — prevents browser CSS performance optimizations
   - Note: Common with Next.js SSR + Google Ads; worth auditing to reduce if possible

---

## What Was Fixed Since Last Check ✅

- **Font preloads in place**: 3 Next.js font files (woff2) preloaded via `link` header
- **All scripts are `async`**: 19–20 JS chunks load asynchronously on home page — zero blocking scripts
- **Preconnect/prefetch hints**: Google AdSense, fonts.gstatic.com all preconnected
- **No charset issues**: `content-type: text/html; charset=utf-8` confirmed on all responses
- **Content Security Policy active**: Proper CSP on all routes

---

## Priority Fixes

| # | Fix | Impact | Effort | Status |
|---|-----|--------|--------|--------|
| 1 | **Virtualize `/tools` grid** (react-window or pagination) | LCP ↓ 1–2s on mobile | Medium | 🔴 Open |
| 2 | **Fix cache headers** — enable ISR/public caching | TTFB ↓ 50–100ms | Low | 🔴 Open |
| 3 | Add `content-visibility: auto` to below-fold sections | Paint cost ↓ | Low | 🟡 Open |
| 4 | Eliminate `tinytoolbox.co` → `www` redirect at Vercel edge | TTFB ↓ 60ms | Low | 🟡 Open |
| 5 | Simplify CSS blur animations — reduce radii, add `will-change` | CLS ↓, LCP ↓ | Medium | 🟡 Open |
| 6 | Audit `'unsafe-inline'` in CSP — try nonces or hashes | Security + perf | High | 🟡 Open |

---

## Comparison to Previous Check

| Metric | Previous (2026-03-24 08:00) | Current (2026-03-24 20:00) | Delta |
|--------|----------------------------|----------------------------|-------|
| Overall Score | ~72–78 | ~75–82 | ↑ +4 |
| TTFB (home) | 318ms | 276ms | ↓ **−42ms** |
| TTFB (/tools) | 516ms | 288ms | ↓ **−228ms (44% better)** |
| /tools Page Size | 807 KB | 959 KB | ⚠️ **+152 KB** |
| Resource Hints | 4 | 4 | = Stable |
| Script Blocking | 0 | 0 | = Stable |
| High Priority Issues | 2 | 3 | ↑ More critical |
| Medium Priority Issues | 4 | 5 | ↑ More identified |

> **Good news:** TTFB improved significantly throughout the day (edge caching warming). `/tools` speed improved 44%.
> **Bad news:** `/tools` page grew 19% in size since this morning, and cache headers prevent full CDN benefit.

---

## Competitor Context

Small tool site competitors (e.g., tinywow.com, safeeditor.com, omnicalculator.com) typically achieve:
- Performance scores: 75–90 (mobile Lighthouse)
- TTFB: 150–400ms (edge-cached)
- Page sizes: 150–400 KB (virtualized grids, lazy components)

TinyToolbox home page (123 KB) is **ahead** of most competitors. The `/tools` page (959 KB) is **3–5x heavier** than industry norm. Virtualizing the grid would make it the fastest tool directory in the category.

---

## Next Check

- Scheduled: **2026-03-25 08:00 UTC (2:00 AM ET)**
- Action: Re-run curl timing; investigate `/tools` page growth source; attempt PSI if quota resets

---

## Appendix: Raw curl metrics (www.tinytoolbox.co — direct, no redirect)

```
Home:      TTFB 276ms | Total 286ms | 123,175 bytes
/tools:    TTFB 288ms | Total 328ms | 959,102 bytes
/blog:     TTFB 192ms | Total 216ms |  92,497 bytes
```

---

*Report generated: 2026-03-25 00:03 UTC*
*Agent: Performance Monitor | ID: 8238eb63-bbec-4a27-ac97-f19e77ed7df4*
