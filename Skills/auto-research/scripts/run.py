#!/usr/bin/env python3
"""
Auto-research runner - orchestrates the full experiment loop.
Usage: python run.py [--experiments 20] [--metric performance]
"""
import os
import sys
import subprocess
import argparse
from datetime import datetime
from typing import Optional

REPO = "/home/workspace/tinytoolbox-github"
SCRIPTS = "/home/workspace/Skills/auto-research/scripts"
REPORTS = "/home/workspace/agent-reports/auto-research"

def run_cmd(cmd: list, cwd: str = REPO, timeout: int = 300) -> tuple:
    """Run a command and return (success, stdout, stderr)."""
    result = subprocess.run(
        cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout
    )
    return result.returncode == 0, result.stdout, result.stderr

def get_commit_hash() -> str:
    """Get current commit hash."""
    _, stdout, _ = run_cmd(["git", "rev-parse", "--short", "HEAD"])
    return stdout.strip()

def run_experiment(metric: str = "performance") -> dict:
    """Run a single experiment: apply changes, measure, report."""
    print("\n" + "=" * 60)
    print("Running experiment...")
    print("=" * 60)
    
    # Apply changes via experiment.py
    print("\n[1/3] Applying changes...")
    sys.path.insert(0, SCRIPTS)
    import experiment
    commit = experiment.main()
    sys.path.pop(0)
    
    if not commit:
        return {"success": False, "commit": None, "score": 0, "status": "crash"}
    
    # Build
    print("\n[2/3] Building...")
    success, stdout, stderr = run_cmd(["npm", "run", "build"], timeout=300)
    if not success:
        print(f"Build failed: {stderr}")
        return {"success": False, "commit": commit, "score": 0, "status": "crash"}
    
    # Measure
    print(f"\n[3/3] Measuring {metric}...")
    sys.path.insert(0, SCRIPTS)
    import metrics
    score = metrics.evaluate_metric(metric, "https://tinytoolbox.co", local=False)
    sys.path.pop(0)
    
    print(f"  Score: {score}")
    
    # Decide status
    prev_score = metrics.get_last_score(metric, os.path.join(REPORTS, "results.tsv"))
    if score > prev_score:
        status = "keep"
    elif abs(score - prev_score) < 0.5:
        status = "neutral"
    else:
        status = "discard"
    
    # Log result
    metrics.log_result(
        commit=commit, metric=metric, score=score, status=status,
        description=experiment.EXPERIMENT.get("description", ""),
        log_path=os.path.join(REPORTS, "results.tsv")
    )
    
    return {"success": True, "commit": commit, "score": score, "status": status}

def run_loop(num_experiments: int = 20, metric: str = "performance"):
    """Run the full auto-research loop."""
    print("=" * 60)
    print("TINYTOOLBOX AUTO-RESEARCH")
    print("=" * 60)
    print(f"Target: {metric}")
    print(f"Experiments: {num_experiments}")
    print("=" * 60)
    
    os.makedirs(REPORTS, exist_ok=True)
    
    # Baseline
    print("\n" + "=" * 60)
    print("BASELINE MEASUREMENT")
    print("=" * 60)
    baseline = run_experiment(metric=metric)
    
    if not baseline["success"]:
        print("⚠️  Baseline failed. Check setup.")
        return
    
    print(f"\n✓ Baseline: {baseline['score']} {metric}")
    
    # Loop
    no_improvement = 0
    for i in range(num_experiments):
        print(f"\n{'='*60}")
        print(f"EXPERIMENT {i+1}/{num_experiments}")
        print('='*60)
        
        if no_improvement >= 5:
            print("\n⚠️  Metric plateaued (5 consecutive no-improvements)")
            break
        
        result = run_experiment(metric=metric)
        
        if not result["success"]:
            print("⚠️  Experiment crashed")
            no_improvement += 1
            continue
        
        if result["status"] == "keep":
            print(f"✓ IMPROVED: {baseline['score']} -> {result['score']}")
            no_improvement = 0
        elif result["status"] == "discard":
            print(f"✗ WORSE: {result['score']} < {baseline['score']}")
            no_improvement += 1
        else:
            print(f"- Neutral: {result['score']}")
            no_improvement += 1
        
        print(f"\nResults: {result['status']} | {result['score']:.1f} | {result['commit']}")
    
    print("\n" + "=" * 60)
    print("AUTO-RESEARCH COMPLETE")
    print("=" * 60)
    print(f"Results: {REPORTS}/results.tsv")

def main():
    parser = argparse.ArgumentParser(description="Auto-research for tinytoolbox.co")
    parser.add_argument("--experiments", type=int, default=20, help="Number of experiments")
    parser.add_argument("--metric", default="performance", choices=["performance", "accessibility", "seo"])
    parser.add_argument("--baseline-only", action="store_true", help="Run baseline only")
    args = parser.parse_args()
    
    if args.baseline_only:
        os.makedirs(REPORTS, exist_ok=True)
        run_experiment(metric=args.metric)
    else:
        run_loop(num_experiments=args.experiments, metric=args.metric)

if __name__ == "__main__":
    main()
