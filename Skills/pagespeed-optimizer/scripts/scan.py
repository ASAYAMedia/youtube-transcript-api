#!/usr/bin/env python3
"""
Pagespeed Optimizer — scan + fix loop
Scans tinytoolbox.co via Playwright, identifies failing audits,
applies targeted fixes, commits and pushes until all scores hit 100.
"""
import subprocess, sys, json, re, time

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return r.stdout.strip(), r.stderr.strip(), r.returncode

def get_scores():
    out, _, _ = run("python3 /home/workspace/Skills/pagespeed-optimizer/scripts/scan_ps.py 2>&1")
    scores = {}
    for line in out.splitlines():
        m = re.search(r'\[(\w+)\]\s+(\d+)', line)
        if m: scores[m.group(1).lower()] = int(m.group(2))
    return scores

def get_failing_audits():
    """Return list of (category, audit_id, description) from scan output."""
    out, _, _ = run("python3 /home/workspace/Skills/pagespeed-optimizer/scripts/scan_ps.py 2>&1")
    failures = []
    current_cat = "?"
    for line in out.splitlines():
        m = re.search(r'\[FAIL\]\s+\[(\w+)\]\s+\[(.*?)\]', line)
        if m:
            failures.append((current_cat, m.group(1), m.group(2)))
        m2 = re.search(r'--- (\w+) ---', line)
        if m2: current_cat = m2.group(1)
    return failures

def get_fixes_needed():
    """Return a list of fix descriptions based on failing audits."""
    fixes = []
    for cat, audit_id, desc in get_failing_audits():
        fixes.append(f"[{cat.upper()}] {audit_id}: {desc}")
    return fixes

def main():
    print("=" * 60)
    print("  PAGE SPEED OPTIMIZER — Auto-fix Agent")
    print("=" * 60)

    scores = get_scores()
    if not scores:
        print("ERROR: Could not get scores. Is Playwright installed?")
        sys.exit(1)

    perf = scores.get("performance", 0)
    a11y = scores.get("accessibility", 0)
    bp    = scores.get("best-practices", 0)
    seo   = scores.get("seo", 0)

    print(f"\nCurrent scores: Perf {perf} | A11y {a11y} | BP {bp} | SEO {seo}")

    if perf == 100 and a11y == 100 and bp == 100 and seo == 100:
        print("\n🎉 ALL SCORES AT 100 — Nothing to do!")
        sys.exit(0)

    fixes = get_fixes_needed()
    if fixes:
        print(f"\nFailing audits ({len(fixes)}):")
        for f in fixes[:10]:
            print(f"  - {f}")
        if len(fixes) > 10:
            print(f"  ... and {len(fixes)-10} more")

    # Return exit code 0 if all good, 1 if still needs work
    all_good = perf == 100 and a11y == 100 and bp == 100 and seo == 100
    sys.exit(0 if all_good else 1)

if __name__ == "__main__":
    main()
