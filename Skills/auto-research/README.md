# TinyToolbox Auto-Research

**Autonomous website optimization for tinytoolbox.co** — adapted from Karpathy's autoresearch pattern.

## Quick Start

```bash
cd /home/workspace/Skills/auto-research/scripts

# Baseline measurement
python run.py --baseline-only --metric performance

# Run experiment loop (10 experiments)
python run.py --experiments 10 --metric performance

# View results
cat /home/workspace/agent-reports/auto-research/results.tsv
```

## Architecture

Three-file pattern (Karpathy style):

| File | Purpose | Status |
|------|---------|--------|
| `experiment.py` | Experiment template (site modifications) | **Agent edits** |
| `metrics.py` | Fixed evaluation (Lighthouse) | **Read-only** |
| `run.py` | Main loop orchestration | **Read-only** |

## The Experiment Loop

```
1. Agent reads SKILL.md (this file)
2. Proposes experiment → edits experiment.py
3. Script builds site (npm run build)
4. Measures via Lighthouse
5. Score improved? → KEEP (commit stays)
6. Score worse? → DISCARD (git reset)
7. GOTO 2 until done
```

## Creating Experiments

Edit `experiment.py` to modify the `EXPERIMENT` dict:

```python
EXPERIMENT = {
    "name": "defer-analytics",
    "description": "Defer analytics script to improve FCP",
    "target_file": "app/layout.tsx",
}
```

Then implement the change in `apply_changes()`:

```python
def apply_changes() -> bool:
    content = read_file(EXPERIMENT["target_file"])
    
    # Make the edit
    content = content.replace(
        '<Script src="https://analytics.com/script.js" />',
        '<Script src="https://analytics.com/script.js" defer />'
    )
    
    write_file(EXPERIMENT["target_file"], content)
    return True
```

## Available Metrics

- `performance` — Lighthouse Performance (0-100, higher=better) **Default**
- `accessibility` — Lighthouse Accessibility (0-100)
- `seo` — Lighthouse SEO (0-100)
- `lcp` — Largest Contentful Paint (ms, lower=better)
- `cls` — Cumulative Layout Shift (lower=better)
- `ttfb` — Time to First Byte (ms, lower=better)

## Results Format

`file '/home/workspace/agent-reports/auto-research/results.tsv'`:

```
commit  metric      score   status      description
de1f2ab performance 78.5    baseline    Initial measurement
a2b3c4d performance 82.1    keep        Defer analytics script
e5f6a7b performance 81.9    discard     Preload fonts (no improvement)
```

## Running as Zo Agent

### Option 1: One-shot run
```
Zo, read /home/workspace/Skills/auto-research/SKILL.md
Then run the auto-research loop: 10 experiments, target performance
```

### Option 2: Scheduled agent
```bash
zo agent create """
Read /home/workspace/Skills/auto-research/SKILL.md
Run the experiment loop overnight
Log all results to /home/workspace/agent-reports/auto-research/results.tsv
Stop after 20 experiments or when metric plateaus for 5 consecutive runs
""" --schedule="0 22 * * *" --model=MiniMax
```

## Comparison to Karpathy's Autoresearch

| Aspect | Karpathy's | TinyToolbox Adaptation |
|--------|-----------|------------------------|
| Target | LLM training (val_bpb) | Website performance |
| Edit file | train.py (model code) | experiment.py + site files |
| Time budget | 5 min fixed training | ~5 min (build + measure) |
| Metric | Bits per byte (lower=better) | Lighthouse score (higher=better) |
| Platform | Single NVIDIA GPU | Next.js + Zo |

## Safety Constraints

The agent CANNOT:
- Spend money or use paid services
- Post to social media
- Modify metrics.py or run.py (fixed infrastructure)
- Commit directly to main/master (only autoresearch/* branches)

All changes are reversible via `git reset`.

## Example Experiment Ideas

1. **Defer scripts** — Add `defer` to non-critical JS
2. **Lazy images** — Add `loading="lazy"` to below-fold images
3. **Font optimization** — Use `font-display: swap`
4. **CSS cleanup** — Remove unused classes
5. **Bundle splitting** — Dynamic imports for heavy components
6. **Image formats** — WebP with fallbacks
7. **Critical CSS** — Inline above-fold styles

## Based On

- [karpathy/autoresearch](https://github.com/karpathy/autoresearch) — Original LLM training autoresearch
- [karpathy/nanochat](https://github.com/karpathy/nanochat) — Parent codebase
