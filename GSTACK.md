# gstack — Garry Tan's AI Engineering Team

> "I don't think I've typed like a line of code probably since December, basically, which is an extremely large change." — Andrej Karpathy, March 2026

**gstack** transforms Claude Code into a virtual engineering team. Created by Garry Tan (President & CEO of Y Combinator), who shipped **600,000+ lines of production code in 60 days** while running YC full-time.

---

## Core Philosophy

### 1. Boil the Lake
AI makes completeness near-zero cost. When the complete implementation costs minutes more than the shortcut — do the complete thing. Every time.

- "Choose A (full, ~150 LOC) vs B (90%, ~80 LOC)" → always A. The 70-line delta costs seconds with AI.
- "Defer tests to follow-up PR" → Tests are the cheapest lake to boil.
- "This would take 2 weeks" → Say: "2 weeks human / ~1 hour AI-assisted."

**Lakes** are boilable (100% test coverage, full feature, all edge cases). **Oceans** are not (rewriting entire systems). Boil lakes. Flag oceans as out of scope.

### 2. Search Before Building
The 1000x engineer's first instinct is "has someone already solved this?" not "let me design it from scratch."

**Three Layers of Knowledge:**
- **Layer 1: Tried and true** — Standard patterns, battle-tested approaches. Question them occasionally.
- **Layer 2: New and popular** — Blog posts, ecosystem trends. Scrutinize — crowds can be wrong.
- **Layer 3: First principles** — Original observations. Most valuable. Prize these above all else.

**The Eureka Moment:** When first-principles reasoning reveals conventional wisdom is wrong — name it, celebrate it, build on it.

### 3. Build for Yourself
The best tools solve your own problem. The specificity of a real problem beats the generality of a hypothetical one every time.

---

## Compression Ratios (Human Team vs AI-Assisted)

| Task | Human Team | AI-Assisted | Compression |
|------|-----------|-------------|-------------|
| Boilerplate/scaffolding | 2 days | 15 min | ~100x |
| Test writing | 1 day | 15 min | ~50x |
| Feature implementation | 1 week | 30 min | ~30x |
| Bug fix + regression test | 4 hours | 15 min | ~20x |
| Architecture/design | 2 days | 4 hours | ~5x |
| Research/exploration | 1 day | 3 hours | ~3x |

---

## The 15 Skills (Roles)

| Skill | Role | What it does |
|-------|------|--------------|
| `/office-hours` | YC Office Hours | Six forcing questions that reframe product before code. Design doc feeds all downstream skills. |
| `/plan-ceo-review` | CEO/Founder | Rethink the problem. Find the 10-star product hiding inside the request. Brian Chesky mode. |
| `/plan-eng-review` | Eng Manager | Lock architecture, data flow, diagrams, edge cases, tests. Forces hidden assumptions into the open. |
| `/plan-design-review` | Senior Designer | Interactive plan-mode design review. Rates each dimension 0-10. |
| `/design-consultation` | Design Partner | Build complete design system from scratch. Researches landscape, proposes risks, generates mockups. |
| `/review` | Staff Engineer | Find bugs that pass CI but blow up in production. Auto-fixes obvious ones. |
| `/investigate` | Debugger | Systematic root-cause debugging. Iron Law: no fixes without investigation. |
| `/design-review` | Designer Who Codes | Live-site visual audit + fix loop. 80-item audit, atomic commits, before/after screenshots. |
| `/qa` | QA Lead | Test app, find bugs, fix with atomic commits, auto-generate regression tests. |
| `/qa-only` | QA Reporter | Same methodology, report only. |
| `/cso` | Chief Security Officer | OWASP Top 10 + STRIDE threat modeling. Zero-noise findings. |
| `/ship` | Release Engineer | Sync main, run tests, audit coverage, push, open PR. Bootstraps test frameworks if missing. |
| `/land-and-deploy` | Release Engineer | Merge PR, wait for CI, verify production health. One command from "approved" to "verified." |
| `/canary` | SRE | Post-deploy monitoring loop. Watches for console errors, perf regressions, page failures. |
| `/benchmark` | Performance Engineer | Baseline page load, Core Web Vitals, resource sizes. Compare before/after on every PR. |
| `/document-release` | Technical Writer | Update all project docs to match what you shipped. Catches stale READMEs automatically. |
| `/retro` | Eng Manager | Team-aware weekly retro. Per-person breakdowns, shipping streaks, test health trends. |
| `/browse` | QA Engineer | Real Chromium browser, ~100ms per command. `$B connect` launches headed window — watch every action live. |
| `/autoplan` | Review Pipeline | CEO → design → eng review automatically. Surfaces only taste decisions for your approval. |

### Power Tools

| Tool | What it does |
|------|--------------|
| `/codex` | Second Opinion — independent review from OpenAI Codex CLI. Cross-model analysis with `/review`. |
| `/careful` | Safety Guardrails — warns before destructive commands (rm -rf, DROP TABLE, force-push). |
| `/freeze` | Edit Lock — restrict file edits to one directory. |
| `/guard` | Full Safety — `/careful` + `/freeze` in one command. |
| `/gstack-upgrade` | Self-Updater — upgrade gstack, detects global vs vendored install. |

---

## Key Workflow Patterns

### The Full Sprint Lifecycle
```
office-hours → plan-ceo-review → plan-eng-review → implement → review → qa → ship → land-and-deploy → retro
```

### Parallel Sprints
- Run 10-15 sprints in parallel via Conductor
- Each sprint has a structured process — agents know exactly what to do and when to stop
- `/qa` was a massive unlock — "I SEE THE ISSUE" + fix + regression test + verify = game changer

### Review Readiness Dashboard
Every review (CEO, Eng, Design) logs its result. Tells you what's ready to ship and what needs more work before you even start.

---

## Architecture Highlights

- **Persistent Chromium daemon** — sub-second latency (~100-200ms per command), cookies/tabs persist across commands
- **Ref system (`@e1`, `@e2`)** — address elements via accessibility tree, no DOM mutation needed (CSP-safe, framework-safe)
- **Bun** — compiled ~58MB binary, native SQLite for cookie decryption, no node_modules at runtime
- **SKILL.md template system** — docs auto-generated from code at build time, never drifts
- **Three test tiers**: static validation (free, <5s) → E2E via claude -p (~$3.85, ~20min) → LLM-as-judge (~$0.15, ~30s)

---

## Key Principles for Our Work

1. **Do the complete thing** — tests, edge cases, error paths cost seconds with AI. Do them.
2. **Search before building** — has someone solved this? Check Layer 1 (tried-and-true) and Layer 2 (new-and-popular) before Layer 3 (first-principles).
3. **Name eureka moments** — when first-principles reasoning reveals conventional wisdom is wrong, document it.
4. **Tests make vibe coding safe** — 100% coverage goal. Every `/qa` bug fix generates a regression test.
5. **Diagrams force hidden assumptions** — use them in planning. Sequence, state, component, data-flow.
6. **Boil lakes, flag oceans** — 100% coverage for a module is a lake. Rewriting from scratch is an ocean.
7. **Completeness is cheap** — if the 100% solution costs 70 more lines and takes seconds, choose it.
8. **One person with AI = team of twenty** — act like it. Ship more. Review more. Test more.

---

**Source**: https://github.com/garrytan/gstack (50k+ stars, MIT license)
