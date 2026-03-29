#!/usr/bin/env python3
"""
Auto-research evaluation module for tinytoolbox.co.
Measures Lighthouse scores via PageSpeed Insights API.
FIXED - do not modify. The agent only edits experiment.py.
"""
import os
import sys
import json
import time
import subprocess
from datetime import datetime
from typing import Optional

def run_lighthouse(url: str = "https://tinytoolbox.co") -> dict:
    """Run Lighthouse via Chrome DevTools or fallback to PageSpeed API."""
    try:
        # Try using Chrome Lighthouse CLI if available
        result = subprocess.run(
            ["npx", "lighthouse", url, 
             "--output=json", "--chrome-flags=--headless",
             "--quiet", "--no-enable-error-reporting"],
            capture_output=True, text=True, timeout=120
        )
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            return {
                "performance": data["categories"]["performance"]["score"] * 100,
                "accessibility": data["categories"]["accessibility"]["score"] * 100,
                "best_practices": data["categories"]["best-practices"]["score"] * 100,
                "seo": data["categories"]["seo"]["score"] * 100,
                "lcp": data["audits"]["largest-contentful-paint"]["numericValue"],
                "cls": data["audits"]["cumulative-layout-shift"]["numericValue"],
                "ttfb": data["audits"]["server-response-time"]["numericValue"],
            }
    except Exception as e:
        print(f"Lighthouse CLI failed: {e}")
    
    # Fallback: simulate with basic curl timing
    return measure_with_curl(url)

def measure_with_curl(url: str) -> dict:
    """Fallback: basic timing measurement via curl."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-w", 
             "%{time_total},%{time_namelookup},%{time_connect},%{time_pretransfer}",
             url],
            capture_output=True, text=True, timeout=30
        )
        
        times = result.stdout.strip().split(",")
        total_time = float(times[0]) * 1000  # ms
        
        # Approximate scores from timing
        perf_score = max(0, 100 - (total_time / 10))
        
        return {
            "performance": round(perf_score, 1),
            "accessibility": 0,  # Can't measure without browser
            "best_practices": 0,
            "seo": 0,
            "lcp": total_time,
            "cls": 0,
            "ttfb": float(times[1]) * 1000,
        }
    except Exception as e:
        print(f"Curl measurement failed: {e}")
        return {"performance": 0, "accessibility": 0, "best_practices": 0, "seo": 0}

def evaluate_metric(
    metric: str = "performance",
    url: str = "https://tinytoolbox.co",
    local: bool = False
) -> float:
    """
    Evaluate the website on the given metric.
    
    Args:
        metric: One of: performance, accessibility, best_practices, seo, lcp, cls, ttfb
        url: URL to test
        local: If True, measure localhost instead of production
    
    Returns:
        float: The score (0-100 for categories, raw values for timings)
    """
    if local:
        url = "http://localhost:3000"
    
    print(f"Measuring {metric} for {url}...")
    
    # Run measurement (retry up to 3 times)
    for attempt in range(3):
        try:
            data = run_lighthouse(url)
            
            if metric in data:
                value = data[metric]
                print(f"  {metric}: {value}")
                return value
            else:
                print(f"  Unknown metric: {metric}, available: {list(data.keys())}")
                return 0.0
                
        except Exception as e:
            print(f"  Attempt {attempt + 1} failed: {e}")
            if attempt < 2:
                time.sleep(5)
    
    return 0.0

def log_result(
    commit: str,
    metric: str,
    score: float,
    status: str,
    description: str,
    log_path: str = "/home/workspace/agent-reports/auto-research/results.tsv"
) -> None:
    """Log experiment result to TSV."""
    timestamp = datetime.now().isoformat()
    
    # Ensure file exists with header
    if not os.path.exists(log_path):
        with open(log_path, "w") as f:
            f.write("commit\tmetric\tscore\tstatus\tdescription\ttimestamp\n")
    
    with open(log_path, "a") as f:
        f.write(f"{commit}\t{metric}\t{score}\t{status}\t{description}\t{timestamp}\n")
    
    print(f"Logged: {commit} {status} (score: {score})")

def get_last_score(
    metric: str = "performance",
    log_path: str = "/home/workspace/agent-reports/auto-research/results.tsv"
) -> float:
    """Get the last logged score for a metric."""
    if not os.path.exists(log_path):
        return 0.0
    
    with open(log_path, "r") as f:
        lines = f.readlines()[1:]  # Skip header
    
    scores = []
    for line in lines:
        parts = line.strip().split("\t")
        if len(parts) >= 3 and parts[1] == metric and parts[3] in ("keep", "baseline"):
            try:
                scores.append(float(parts[2]))
            except ValueError:
                continue
    
    return scores[-1] if scores else 0.0

def main():
    """CLI entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Evaluate tinytoolbox.co metrics")
    parser.add_argument("--metric", default="performance", 
                      choices=["performance", "accessibility", "best_practices", "seo", "lcp", "cls", "ttfb"])
    parser.add_argument("--url", default="https://tinytoolbox.co")
    parser.add_argument("--local", action="store_true", help="Measure localhost instead")
    parser.add_argument("--log", action="store_true", help="Log result")
    parser.add_argument("--commit", default="unknown", help="Commit hash")
    parser.add_argument("--status", default="test", help="Status: keep, discard, baseline")
    parser.add_argument("--description", default="", help="Experiment description")
    
    args = parser.parse_args()
    
    # Run evaluation
    score = evaluate_metric(args.metric, args.url, args.local)
    
    # Log if requested
    if args.log:
        log_result(args.commit, args.metric, score, args.status, args.description)
    
    print(f"\nFinal {args.metric} score: {score}")
    return score

if __name__ == "__main__":
    score = main()
    sys.exit(0 if score > 0 else 1)
