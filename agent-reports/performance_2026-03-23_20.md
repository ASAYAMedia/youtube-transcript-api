# TinyToolbox Performance Report — 2026-03-23 20:00 UTC

## Overall Performance Score
**Estimated: 65–75 / 100** (pending Lighthouse verification)
> ⚠️ Could not retrieve live Lighthouse/PageSpeed API scores. PageSpeed API returned N/A. Fallback to curl-based timing and static HTML analysis.

---

## Server Timing (curl-based)

| Page | TTFB | Total Load | Size |
|------|------|------------|------|
| `/` (home) | 838ms | 1.02s | 103 KB |
| `/tools` | 792ms | 921ms | — |

**TTFB Assessment:** 🟡 Acceptable — sub-1s TTFB is decent for Vercel edge. However, server response is the dominant latency factor.

---

## Core Web Vitals (Estimated)

| Metric | Target | Estimated | Status |
|--------|--------|-----------|--------|
| LCP | < 2.5s | ~2.5–3.5s | 🟡 Risk |
| FID/INP | < 100ms | ~50–100ms | 🟢 Acceptable |
| CLS | < 0.1 | ~0.05–0.15 | 🟡 Risk |
| FCP | < 1.8s | ~1.5–2s | 🟢 Acceptable |
| Speed Index | < 3.4s | ~3–4s | 🟡 Risk |

> **Note:** Estimates based on TTFB + page structure analysis. Real field data requires CrUX or Lighthouse run in browser.

---

## Issues Found

### 🔴 High Priority

1. **No preconnect/prefetch resource hints**
   - 0 preconnect, 0 prefetch, 0 preload hints found
   - Browser must resolve all origins on-demand
   - Fix: Add `<link rel="preconnect">` for Vercel edge, Google Fonts (if any), and any third-party origins

2. **Heavy canvas + CSS animation stack on home page**
   - Canvas particle background with blur effects
   - Multiple layered `mix-blend-screen` divs with `animate-pulse-slow`
   - Mesh gradient overlay + noise texture overlay
   - All run simultaneously on main thread
   - Impact: Likely suppresses LCP and increases CLS on mobile

### 🟡 Medium Priority

3. **No charset meta in `<head>` — relying on server header**
   - `charSet="utf-8"` present in Next.js root but check full cascade
   - Low risk since Vercel sends `content-type: text/html; charset=utf-8` header

4. **16 render-blocking script operations detected**
   - 1 sync (blocking) external script
   - 15 inline scripts executing on load
   - 18 async scripts (good)
   - Mitigation: Ensure all non-critical scripts use `async` or `defer` — currently 0 scripts use `defer`

5. **6 Next.js CSS chunks loaded per page**
   - CSS chunks are normal for Next.js but worth auditing for unused styles
   - Duplicate CSS chunk references found in HTML (each listed twice — likely Next.js hot-reload artifact)

### 🟢 Observations (Not Issues)

- Google Fonts: **NOT in use** — good for performance (no font fetch overhead)
- jQuery: **Not detected** — good
- React: **Detected** (Next.js default) — expected
- Page size (103 KB uncompressed): **Lightweight** for a full-featured Next.js site

---

## Priority Fixes

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Add `rel="preconnect"` for `vercel.com` and any third-party origins | LCP ↓ | Low |
| 2 | Move the blocking sync script to `async` or `defer` | FID ↓ | Low |
| 3 | Simplify or lazy-load canvas animation | LCP ↓, CLS ↓ | Medium |
| 4 | Audit 15 inline scripts — defer any non-critical ones | TTI ↓ | Medium |
| 5 | Lazy-load below-fold images (tool cards, category grid) | LCP ↓ | Low |
| 6 | Add `loading="lazy"` to all `<img>` tags below the fold | LCP ↓ | Low |
| 7 | Consider `content-visibility: auto` for off-screen sections | Paint ↓ | Low |

---

## Comparison to Previous Check

| Metric | Previous (2026-03-23 08:00) | Current (2026-03-23 20:00) | Delta |
|--------|------------------------------|-----------------------------|-------|
| Overall Score | Not recorded | ~65–75 | — |
| TTFB (home) | — | 838ms | — |
| TTFB (/tools) | — | 792ms | — |
| Issues Found | — | 5 (2 high, 3 medium) | — |

> No prior performance data available. This is the first logged check. Future reports will show deltas.

---

## Next Check

- Scheduled: **2026-03-24 08:00 UTC (2:00 AM ET)**
- Action: Attempt live Lighthouse run via local browser or find alternative PSI access method

---

*Report generated: 2026-03-23 20:20 UTC*
*Agent: Performance Monitor | ID: 8238eb63-bbec-4a27-ac97-f19e77ed7df4*
