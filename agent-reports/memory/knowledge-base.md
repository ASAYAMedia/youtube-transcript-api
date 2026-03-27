# TinyToolbox Agent Knowledge Base
*Last updated: 2026-03-24*
*Maintained by: Report Supervisor Agent*

---

## SITE PROFILE

**Platform:** TinyToolbox (tinytoolbox.co)
**Launch Date:** March 22, 2026
**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Lucide React
**Tools:** 336 utilities across 14 categories
**Status:** ~2 days old — extremely early stage

---

## CRITICAL ISSUES (Active)

| Issue | First Seen | Last Seen | Count | Severity | Status |
|-------|-----------|-----------|-------|----------|--------|
| Zero social engagement on launch | 2026-03-23 | 2026-03-24 | 2 | Medium | Open |
| Brand confusion with similar domains (tinytoolbox.app, .co.uk, .org) | 2026-03-23 | 2026-03-24 | 2 | Low | Monitoring |
| No newsletter subscribers (1 total) | 2026-03-22 | 2026-03-24 | 3 | High | Open |
| Social media not connected (X/Twitter, LinkedIn) | 2026-03-22 | 2026-03-24 | 2 | High | Open |
| /tools page delivers 807 KB on load (no virtualization) | 2026-03-24 | 2026-03-24 | 1 | High | Open |
| ~250 tool descriptions untranslated across 4 languages | 2026-03-24 | 2026-03-24 | 1 | High | Open |
| 5 orphan components (css-grid-generator, gpa-calculator, image-compressor, jwt-builder, roman-numeral) | 2026-03-24 | 2026-03-24 | 1 | Medium | Open |

---

## RECURRING PATTERNS

### Performance
- TTFB improved significantly: 838ms → 318ms (62% faster) since yesterday
- Preconnect hints added for Vercel + third parties — was 0, now 4 resource hints
- Blocking scripts eliminated
- /tools page at 807 KB is the biggest remaining performance risk
- Heavy canvas + layered CSS animations still suppressing LCP/CLS on mobile

### Translation
- Tools listing pages at /es/tools, /fr/tools, /de/tools, /pt/tools are ~80% English
- Homepage recent additions section hardcoded with English tool descriptions
- Action links don't respect locale (links to /tools instead of /es/tools, etc.)
- Pattern: newly added tools (JWT Builder, Image Compressor, CSS Grid Generator) all untranslated

### Monetization
- Finance category (27 tools) is highest-opportunity — financial ads pay $15-50+ RPM
- Developer category (41 tools) has zero hosting/cloud affiliates despite highest traffic potential
- Text category (85 tools) has zero writing/grammar affiliates (Grammarly, etc.)
- SEO category (19 tools) has no SEMrush/Ahrefs coverage despite perfect keyword match
- Blog posts have zero affiliate integration currently

### Social
- Zero posts published despite 5 days of scheduled runs
- Integration not connected — not a content problem
- 11 Twitter followers, 0 engagement on launch post

---

## RECOMMENDED ACTIONS (Priority Order)

1. **Connect X/Twitter and LinkedIn** — Social agent cannot run without integrations
2. **Virtualize /tools page** — 807 KB with no lazy loading is crushing mobile performance
3. **Apply to SEMrush Affiliate Program** — $200/sale, perfect match for 19 SEO tools
4. **Apply to Grammarly Affiliate Program** — Text category (85 tools) needs grammar affiliate
5. **Add Vercel/Netlify affiliate** — Developer category (41 tools) zero hosting affiliates
6. **Fix translation locale links** — Tool cards link to /tools instead of /[locale]/tools
7. **Clean up 5 orphan components** — Delete or add tool definitions for css-grid-generator, gpa-calculator, image-compressor, jwt-builder, roman-numeral
8. **Set up Google Search Console** — Need search performance data
9. **Submit to Product Hunt** — Build early traction and reviews
10. **Seed testimonials from early users** — Build trust signals

---

## MEMORY LOG

### 2026-03-24
- **Performance:** TTFB cut 62% (838ms → 318ms), blocking scripts eliminated, preconnect hints added. Score now ~72-78.
- **New tool added:** JSONPath Evaluator (Developer category)
- **Blog post published:** "15 Free Online Tools That Don't Require Signup (2026 Edition)" — targets high-volume keyword (340% YoY growth)
- **QA fixes:** Fixed virtual-metronome and fake-name-generator TOOL_MAP mismatches, removed duplicate fake-name entry
- **Translation audit:** 250+ tool descriptions untranslated across 4 language pages — HIGH priority
- **Social:** Still zero posts published — integration not connected
- **User feedback:** No external mentions, launch post has 3 views, 0 engagement
- **Affiliate gaps identified:** Finance, Developer, Text, SEO categories all severely undermonetized
- **Action completed:** Preconnect/prefetch resource hints added (was open issue ISS-006)
- **Action completed:** Blocking scripts fixed (was open issue)

### 2026-03-23
- Site launched ~March 22-23
- First user feedback report: neutral-to-positive sentiment
- Key value props resonating: "no login required", "privacy-first", "speed"
- No negative feedback found anywhere
- Launch post has 0 engagement — needs boost
- Brand confusion risk from similar domain names
- Independent articles published positively mentioning tinytoolbox.co
- Social engagement is ZERO on official launch post
- Most agents not yet reporting (Day 1 of operations)

---

## ACTION OUTCOMES LOG

| Action | Agent | Date | Outcome |
|--------|-------|------|---------|
| Connect X/Twitter | User Confirmed | 2026-03-23 | ✅ RESOLVED |
| Connect LinkedIn | User Confirmed | 2026-03-23 | ✅ RESOLVED |
| Add Resend API key | User Confirmed | 2026-03-23 | ✅ RESOLVED |
| Add preconnect/prefetch resource hints | Performance Agent | 2026-03-24 | ✅ RESOLVED (ISS-006 closed) |
| Eliminate blocking scripts | Performance Agent | 2026-03-24 | ✅ RESOLVED |
| Fix virtual-metronome TOOL_MAP | QA Agent | 2026-03-24 | ✅ RESOLVED |
| Fix fake-name-generator TOOL_MAP | QA Agent | 2026-03-24 | ✅ RESOLVED |
| Remove duplicate fake-name entry | QA Agent | 2026-03-24 | ✅ RESOLVED |

*Memory updated after each supervisor run*
