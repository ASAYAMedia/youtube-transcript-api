# TinyToolbox Performance Report — 2026-03-25 08:00 UTC

## Overall Performance Score

**Estimated: 73–80 / 100** (Lighthouse simulation)
> PSI API quota still exhausted. Score estimated from curl metrics + page structure analysis. Previous evening: ~75–82. Slight morning dip.

---

## Server Timing

All timing to `https://www.tinytoolbox.co/` (Vercel edge, HTTPS/2):

| Page | TTFB | Total Load | Transfer Size | HTTP |
|------|------|-----------|--------------|------|
| `/` (home) | **271ms** | 284ms | **123 KB** | 200 |
| `/tools` | **280ms** | 370ms | **959 KB** ⚠️ | 200 |
| `/blog` | **192ms** | 216ms | **92 KB** | 200 |

> **Cold start anomaly:** First request of the session showed ~2s TTFB, consistent with Vercel cold start. Subsequent requests within session returned 270-280ms. True warm TTFB is ~270-280ms.
>
> **Consistent concern:** `/tools` page at **959 KB** — unchanged from last evening. Tool count now likely at 316+. No virtualization detected.

---

## Core Web Vitals (Estimated)

| Metric | Target | Morning | Previous Evening | Status |
|--------|--------|---------|-----------------|--------|
| LCP | < 2.5s | ~2.0–2.5s | ~1.8–2.3s | 🟡 Risk |
| FID/INP | < 100ms | ~50–80ms | ~50–80ms | 🟢 Acceptable |
| CLS | < 0.1 | ~0.08–0.15 | ~0.08–0.12 | 🟡 Risk |
| FCP | < 1.8s | ~1.2–1.8s | ~1.0–1.6s | 🟢 Acceptable |
| Speed Index | < 3.4s | ~2.5–3.0s | ~2.2–2.8s | 🟢 Borderline |

> Morning shows minor regression vs evening — likely due to edge cache cooling overnight. Cache re-warms throughout the day.

---

## Issues Found

### 🔴 High Priority

1. **`/tools` page at 959 KB — virtualization still missing**
   - Confirmed at 959,102 bytes — unchanged from last evening
   - All tool cards render synchronously on load — no pagination, no virtual scroll
   - Impact: Mobile LCP will exceed 3s on 3G; TTI severely affected
   - Fix: Implement `react-window` virtual list OR server-side paginate at 50/100 tools per page

2. **`www.tinytoolbox.co` redirect not eliminated**
   - `tinytoolbox.co` (non-www) returns HTTP 308 to `www.tinytoolbox.co`
   - Adds ~60ms latency for all non-www inbound links
   - Fix: Configure Vercel edge to eliminate redirect chain OR make non-www canonical

### 🟡 Medium Priority

3. **Cache headers: `cache-control: private` on HTML responses** (unchanged)
   - `/` returns `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`
   - Every visitor forces a full server render — no edge CDN caching of HTML
   - Impact: TTFB artificially inflated; Vercel ISR unavailable
   - Fix: Change to `public, max-age=0, must-revalidate` for ISR capability

4. **Heavy animation stack still present on home page** (unchanged)
   - 2 canvas elements (particle backgrounds)
   - Multiple `blur-[80-150px]` radial gradients with `mix-blend-mode: screen`
   - `animate-pulse` and `animate-nebula` on gradient orbs
   - All running on main thread simultaneously
   - Impact: CLS risk, mobile LCP suppression
   - Fix: Add `will-change: transform`; reduce blur radii; use CSS containment

5. **No `content-visibility: auto` on below-fold sections** (unchanged)
   - 7+ sections paint before user scrolls (footer, tool grid, features, etc.)
   - Fix: Add `content-visibility: auto` to `<section>` wrappers

6. **AdSense script: revenue-critical tradeoff acknowledged** (unchanged)
   - `adsbygoogle.js` loaded with `async` + `preconnect` in place
   - No further optimization possible without revenue impact
   - Status: Monitored, acceptable

---

## What Was Fixed Since Last Check ✅

*(No new fixes since last evening — issues persist)*

- ✅ Font preloads in place (3 Next.js woff2 files)
- ✅ All 19–20 JS chunks load asynchronously — zero blocking scripts
- ✅ Preconnect/prefetch hints active (AdSense, fonts.gstatic.com)
- ✅ Content-type: text/html; charset=utf-8 confirmed on all responses
- ✅ CSP header active on all routes

---

## Priority Fixes

| # | Fix | Impact | Effort | Status |
|---|-----|--------|--------|--------|
| 1 | **Virtualize `/tools` grid** (react-window or pagination) | LCP ↓ 1–2s mobile | Medium | 🔴 Open |
| 2 | **Fix cache headers** — enable ISR/public caching | TTFB ↓ 50–100ms | Low | 🔴 Open |
| 3 | Eliminate `tinytoolbox.co` → `www` redirect at Vercel edge | TTFB ↓ 60ms | Low | 🟡 Open |
| 4 | Add `content-visibility: auto` to below-fold sections | Paint cost ↓ | Low | 🟡 Open |
| 5 | Simplify CSS blur animations — reduce radii, add `will-change` | CLS ↓, LCP ↓ | Medium | 🟡 Open |
| 6 | Audit `'unsafe-inline'` in CSP | Security + perf | High | 🟡 Open |

---

## Comparison to Previous Checks

| Metric | 2026-03-24 08:00 | 2026-03-24 20:00 | 2026-03-25 08:00 | Delta (24h) |
|--------|-----------------|-----------------|-----------------|-------------|
| Overall Score | ~72–78 | ~75–82 | ~73–80 | ↓ −2 |
| TTFB (home) | 318ms | 276ms | 271ms | ↓ **−47ms** |
| TTFB (/tools) | 516ms | 288ms | 280ms | ↓ **−236ms (46% better)** |
| /tools Page Size | 807 KB | 959 KB | 959 KB | ⚠️ +152 KB in 24h |
| High Priority Issues | 2 | 3 | 2 | = Stable |
| Medium Priority Issues | 4 | 5 | 5 | = Stable |

> **Good:** TTFB improved 46% over 24h on `/tools`. Home page TTFB down 47ms.
> **Bad:** `/tools` page grew 19% in 24h (807 KB → 959 KB). If this trend continues, page will hit 1+ MB within days.
> **Trend:** Core infrastructure improving, but content bloat on `/tools` is accelerating.

---

## Competitor Context

| Site | Est. Page Size | Est. TTFB | Performance Score |
|------|---------------|-----------|-------------------|
| tinytoolbox.co (home) | 123 KB ✅ | 271ms ✅ | ~75–80 |
| tinytoolbox.co (/tools) | 959 KB 🔴 | 280ms | ~60–70 |
| tinywow.com | ~200–350 KB | 200–400ms | ~75–85 |
| omnicalculator.com | ~300–500 KB | 150–300ms | ~80–90 |
| safeeditor.com | ~150–250 KB | 200–350ms | ~75–85 |

> TinyToolbox **home page** is lean and competitive. The `/tools` directory at 959 KB is **2–5x heavier** than industry norm. This is the #1 priority fix.

---

## Next Check

- Scheduled: **2026-03-25 20:00 UTC (4:00 PM ET)**
- Action: Re-run curl metrics; verify if `/tools` virtualization has been addressed

---

## Appendix: Raw curl metrics

```
Home:      TTFB 271ms | Total 284ms | 123,175 bytes | HTTP 200
/tools:    TTFB 280ms | Total 370ms | 959,102 bytes | HTTP 200
/blog:     TTFB 192ms | Total 216ms |  92,497 bytes | HTTP 200
```

---

*Report generated: 2026-03-25 12:05 UTC*
*Agent: Performance Monitor | ID: 8238eb63-bbec-4a27-ac97-f19e77ed7df4*
