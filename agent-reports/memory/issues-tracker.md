# Issues Tracker
*Tracks recurring and new issues across all agent reports*

---

## OPEN ISSUES

| ID | Issue | Source Report | Opened | Priority | Notes |
|----|-------|--------------|--------|----------|-------|
| ISS-003 | Zero social engagement | User Feedback | 2026-03-23 | MEDIUM | Launch post has 0 likes/retweets. Needs boost via community outreach (HN, Reddit, Product Hunt). Now Day 3 with no traction. |
| ISS-004 | Brand confusion risk | User Feedback | 2026-03-23 | LOW | tinytoolbox.app, .co.uk, .org are unrelated sites. Monitor for brand confusion. |
| ISS-005 | Only 1 newsletter subscriber | Supervisor | 2026-03-23 | HIGH | Newsletter cannot grow without subscribers. Lead gen needed. |
| ISS-006 | No preconnect/prefetch resource hints | Performance | 2026-03-23 | HIGH | ✅ RESOLVED 2026-03-24 — Resource hints now present for Vercel + third parties. |
| ISS-007 | Heavy canvas + layered CSS animations on home | Performance | 2026-03-23 | HIGH | Canvas particle bg, blur effects, mesh gradient, noise overlay all run on main thread. Suppresses LCP and increases CLS on mobile. Still open — not yet addressed. |
| ISS-008 | /tools page delivers 807 KB with no virtualization | Performance | 2026-03-24 | HIGH | Unbounded tool grid rendering all 317 tools synchronously. No virtual scrolling or pagination. Crushes mobile LCP. |
| ISS-009 | ~250 tool descriptions untranslated across 4 languages | Translation Audit | 2026-03-24 | HIGH | /es/tools, /fr/tools, /de/tools, /pt/tools all ~80% English. Homepage recent additions section hardcoded with English. |
| ISS-010 | Action links don't respect locale | Translation Audit | 2026-03-24 | MEDIUM | Tool cards link to /tools/ instead of /[locale]/tools/ |
| ISS-011 | 5 orphan components not linked to tools | QA | 2026-03-24 | MEDIUM | css-grid-generator, gpa-calculator, image-compressor, jwt-builder, roman-numeral have components but no tool definitions. Return 404. |
| ISS-012 | Duplicate/near-duplicate tools need consolidation | QA | 2026-03-24 | LOW | fake-name vs fake-name-generator, metronome vs virtual-metronome need cleanup |

---

## RESOLVED ISSUES

| ID | Issue | Source Report | Opened | Priority | Notes |
|----|-------|--------------|--------|----------|-------|
| ISS-001 | Social accounts not connected | Multiple | 2026-03-22 | HIGH | RESOLVED 2026-03-23 — User confirmed fixed |
| ISS-002 | Newsletter cannot send (Resend API key) | Supervisor | 2026-03-23 | HIGH | RESOLVED 2026-03-23 — User confirmed fixed |
| ISS-006 | No preconnect/prefetch resource hints | Performance | 2026-03-23 | HIGH | RESOLVED 2026-03-24 — Resource hints added for Vercel + third parties |

---

## ESCALATION LOG

| Date | Issue | Action Taken | Outcome |
|------|-------|-------------|---------|
| 2026-03-24 | ISS-003 Zero social engagement | Day 3 — escalating priority | Still no traction. Recommend paid boost or community outreach. |
| 2026-03-24 | ISS-007 Heavy canvas animations | Day 2 — still open | Not addressed yet. Recommend simplifying animations or using will-change/content-visibility. |

---

*Updated by Supervisor Agent after each compile cycle*
