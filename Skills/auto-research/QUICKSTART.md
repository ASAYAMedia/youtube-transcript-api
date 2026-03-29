# TinyToolbox Auto-Research - Quick Start

## What is this?

Autonomous experimentation for tinytoolbox.co, adapted from [Karpathy's autoresearch](https://github.com/karpathy/autoresearch).

**The idea:** Let an AI agent run experiments overnight to improve your website metrics.

## Architecture (Karpathy Style)

| File | Purpose | Who Edits |
|------|---------|-----------|
| `experiment.py` | Modify website code for experiments | **Agent** |
| `metrics.py` | Measure Lighthouse scores (fixed) | **Read-only** |
| `run.py` | Orchestrate the loop (fixed) | **Read-only** |
| `program.md` | Instructions for agents | **You** (SKILL.md) |

## Quick Start

### 1. Check Baseline
```bash
cd /home/workspace/Skills/auto-research/scripts
python run.py --baseline-only --metric performance
```

### 2. Run Experiments
```bash
python run.py --experiments 10 --metric performance
```

### 3. View Results
```bash
cat /home/workspace/agent-reports/auto-research/results.tsv
```

## Creating New Experiments

Edit `experiment.py` and modify the `EXPERIMENT` dict:

```python
EXPERIMENT = {
    "name": "defer-scripts",
    "description": "Defer non-critical scripts to improve FCP",
    "target_file": "app/layout.tsx",
}
```

Then implement changes in `apply_changes()`:

```python
def apply_changes() -> bool:
    content = read_file(EXPERIMENT["target_file"])
    
    # Make your edit
    content = content.replace(
        '<Script src="https://analytics.com/script.js" />',
        '<Script src="https://analytics.com/script.js" defer />'
    )
    
    write_file(EXPERIMENT["target_file"], content)
    return True
```

## Metrics

- `performance` — Lighthouse Performance (0-100)
- `accessibility` — Lighthouse Accessibility (0-100)
- `seo` — Lighthouse SEO (0-100)
- `lcp` — Largest Contentful Paint (ms)
- `cls` — Cumulative Layout Shift
- `ttfb` — Time to First Byte (ms)

## Results Format

`/home/workspace/agent-reports/auto-research/results.tsv`:

```
commit  metric      score   status      description
de1f2ab performance 78.5    baseline    Initial measurement
a2b3c4d performance 82.1    keep        Defer analytics script
e5f6a7b performance 81.9      discard     Preload web fonts (no improvement)
```

## How The Loop Works

1. Agent edits `experiment.py` with a new idea
2. Script builds the site (`npm run build`)
3. Lighthouse measures the metric
4. If score improved: **keep** (commit stays)
5. If score worse: **discard** (`git reset --hard HEAD~1`)
6. Repeat

## Running as Zo Agent

Create a scheduled agent:
```bash
cd /home/workspace/Skills/auto-research
cat scripts/agent_prompt.txt | zo agent create --schedule="0 */4 * * *"
```

Or run manually:
```bash
# Enter the experiment mode
zo "Read /home/workspace/Skills/auto-research/program.md and run the experiment loop"
```

## Safety

The agent CANNOT:
- Spend money
- Post to social media
- Delete data
- Commit to main/master (only experiment branches)

All changes are in `autoresearch/*` branches and can be reset.
