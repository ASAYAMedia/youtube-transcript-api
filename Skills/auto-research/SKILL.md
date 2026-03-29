---
name: auto-research
description: Autonomous AI-driven experimentation for tinytoolbox.co. Agents modify code, measure results via Lighthouse/PageSpeed, and keep/disc improvements. Based on Karpathy's autoresearch pattern.
compatibility: Zo Computer (uses Zo agents, git, and Lighthouse)
metadata:
  author: asayaagent1.zo.computer
  based_on: https://github.com/karpathy/autoresearch
  model: MiniMax
---

# TinyToolbox Auto-Research

Autonomous experimentation for tinytoolbox.co. The idea: give an AI agent a website to optimize and let it experiment autonomously. It modifies code, deploys, measures via Lighthouse, and keeps/discards based on results.

## Overview

This skill implements Karpathy's autoresearch pattern adapted for web optimization:
- **Fixed metric**: Lighthouse Performance score (or chosen metric)
- **Fixed time budget**: Each experiment runs quickly (~5 min to deploy + measure)
- **Simple loop**: modify → commit → measure → keep if better → repeat

## Architecture

Three files:
- **`experiment.py`** — The script the agent edits. Contains experiment logic (UI changes, CSS, content, etc.)
- **`metrics.py`** — Fixed evaluation (Lighthouse/Playwright). Read-only. Do not modify.
- **`program.md`** — This file. Instructions for the agent.

## The Experiment Loop

```
1. Read current git state
2. Propose experiment → edit experiment.py → commit
3. Deploy to preview (or measure localhost)
4. Run: python metrics.py → get metric
5. Log to results.tsv
6. If improved: keep commit, advance branch
7. If worse: git reset --hard, discard
8. GOTO 1
```

## Available Modifications

The agent can modify:
- `experiment.py` — Main experiment file (tool UI components, CSS tweaks, layout changes)
- `lib/tools.ts` — Tool definitions (descriptions, SEO meta)
- Any file in `components/` — UI components
- `app/globals.css` — Styling changes
- `app/page.tsx` — Home page layout

**CANNOT modify:**
- `metrics.py` — Fixed evaluation
- `prepare.py` / `constants.py` — Data/setup constants

## Metric Definition

Default: **Lighthouse Performance score** (0-100)
- Higher is better
- Measures: loading speed, interactivity, visual stability
- Alternative metrics available (choose one per experiment):
  - `accessibility` — Lighthouse Accessibility score
  - `best-practices` — Lighthouse Best Practices
  - `seo` — Lighthouse SEO score
  - `ttfb` — Time to First Byte (ms, lower better)
  - `cls` — Cumulative Layout Shift (lower better)

## Setup (One-time)

```bash
# 1. Create experiment branch
cd /home/workspace/tinytoolbox-github
git checkout -b autoresearch/baseline

# 2. Run baseline measurement
python /home/workspace/Skills/auto-research/scripts/metrics.py

# 3. Verify baseline logged
head /home/workspace/agent-reports/auto-research/results.tsv
```

## Running the Agent

As a Zo agent (recommended):
```bash
cd /home/workspace/Skills/auto-research
zo agent create """
Read /home/workspace/Skills/auto-research/program.md
Run the experiment loop on branch autoresearch/${DATE}
Start with baseline measurement, then iterate
Log all results to /home/workspace/agent-reports/auto-research/results.tsv
Stop after 20 experiments or when metric plateaus
""" --schedule="0 */4 * * *" --model=MiniMax
```

Or manual start:
```bash
# Have Zo read this program.md
# Then prompt: "Run the auto-research experiment loop on tinytoolbox.co"
```

## Experiment Guidelines

**Good experiments:**
- Single variable changes (change one thing, measure, keep/disc)
- CSS/layout tweaks that affect perceived performance
- Image optimization strategies
- Lazy loading variations
- Font loading strategies
- Script loading order changes

**Bad experiments:**
- Multi-variable changes (can't attribute improvement)
- Large refactoring without clear hypothesis
- Changes that break functionality
- Changes that dramatically increase complexity for marginal gains

**Simplicity criterion:**
All else being equal, simpler is better. A small improvement that adds ugly complexity → discard. Removing code and getting equal/better → keep.

## Output Format

results.tsv (tab-separated):
```
commit	metric	score	status	description
timestamp
a1b2c3d	performance	78.5	keep	baseline
b2c3d4e	performance	82.1	keep	defer all non-critical scripts
c3d4e5f	performance	81.9	discard	preload web fonts
d4e5f6g	performance	0.0	crash	removed React imports
```

## Never Stop Rule

Once the experiment loop begins, do NOT pause to ask if you should continue. Run until:
- 20 experiments completed, OR
- Metric has not improved for 5 consecutive experiments, OR
- Manually stopped by human

## Safety Constraints

The agent must NOT:
- Spend money (no paid services)
- Post to social media
- Make irreversible changes to main branch
- Delete user data
- modify system files outside tinytoolbox repo

The agent CAN:
- Make commits on the experiment branch
- Run Lighthouse scans
- Edit code files
- Reset/revert its own changes
- Report findings
