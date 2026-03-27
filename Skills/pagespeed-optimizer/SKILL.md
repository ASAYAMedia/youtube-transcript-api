---
name: pagespeed-optimizer
description: Auto-scans tinytoolbox.co via Playwright + pagespeed.web.dev, applies targeted code fixes, loops until all four Lighthouse scores hit 100 (Performance, Accessibility, Best Practices, SEO).
compatibility: Created for Zo Computer
metadata:
  author: asayaagent1.zo.computer
allowed-tools: Bash,Read,Write,Edit
---

# PageSpeed Optimizer Skill

Runs PageSpeed Insights audits on tinytoolbox.co, auto-fixes failing audits, and loops until all scores reach 100.

## Files

- `scripts/scan_ps.py` — Playwright-based scanner (navigates pagespeed.web.dev, extracts scores + failures)
- `scripts/fix.py` — Applies targeted code patches for accessibility, SEO, and performance issues
- `scripts/run.py` — Main loop: scan → fix → commit → push → wait → rescan (up to 5 iterations)

## Usage

```bash
# One-shot scan (returns scores)
python3 /home/workspace/Skills/pagespeed-optimizer/scripts/scan_ps.py

# Run fixes + build test
python3 /home/workspace/Skills/pagespeed-optimizer/scripts/fix.py

# Full optimization loop
python3 /home/workspace/Skills/pagespeed-optimizer/scripts/run.py
```

## What gets fixed

### Accessibility (A11y)
- Buttons/links missing `aria-label` (navbar search, share buttons, hamburger)
- Low-contrast text (zinc-600 on dark bg → zinc-400/500)
- Invalid HTML (button nested inside Link)
- Missing skip-to-content link for keyboard/screen reader users
- Heading hierarchy gaps

### SEO
- Canonical URL mismatch (site redirects to www; canonical must match)
- Sitemap + robots.txt canonical URLs
- OG/Twitter card URL consistency

### Performance
- `content-visibility: auto` on off-screen sections
- `loading="lazy"` on static images
- `prefers-reduced-motion` support
- ISR revalidation hints on tool pages
- Font preconnect hints

## Agent

A scheduled agent runs this every 4 hours automatically. Target: `https://www.tinytoolbox.co`
