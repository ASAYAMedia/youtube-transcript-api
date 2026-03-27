#!/usr/bin/env python3
"""
Pagespeed Optimizer — main loop
scan → fix → commit → push → wait → rescan
Loops until Perf 100, A11y 100, BP 100, SEO 100.
Max 5 iterations per run to avoid runaway.
"""
import subprocess, sys, time, json, re, os

REPO = "/home/workspace/tinytoolbox-github"
SCAN_SCRIPT = "/home/workspace/Skills/pagespeed-optimizer/scripts/scan_ps.py"
FIX_SCRIPT  = "/home/workspace/Skills/pagespeed-optimizer/scripts/fix.py"
MAX_ITERS = 5
WAIT_SEC  = 45   # wait for Vercel deploy

def run(cmd, cwd=REPO):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd)
    return r.stdout, r.stderr, r.returncode

def get_scores():
    out, err, _ = run(f"python3 {SCAN_SCRIPT} 2>&1")
    scores = {}
    for line in out.splitlines():
        m = re.search(r'\[(\w+)\]\s+(\d+)', line)
        if m:
            scores[m.group(1).lower()] = int(m.group(2))
    return scores

def get_failing():
    out, _, _ = run(f"python3 {SCAN_SCRIPT} 2>&1")
    failures = []
    for line in out.splitlines():
        if "[FAIL]" in line:
            m = re.search(r'\[FAIL\]\s+\[(\w+)\]\s+\[(.*?)\]', line)
            if m:
                failures.append(f"{m.group(1)}: {m.group(2)}")
    return failures

def main():
    print("=" * 60)
    print("  PAGE SPEED OPTIMIZER — Auto-fix Loop")
    print("=" * 60)
    print(f"  Target: https://www.tinytoolbox.co")
    print(f"  Max iterations per run: {MAX_ITERS}")
    print()

    for i in range(1, MAX_ITERS + 1):
        print(f"\n{'─' * 60}")
        print(f"  Iteration {i}/{MAX_ITERS}")
        print(f"{'─' * 60}")

        scores = get_scores()
        if not scores:
            print("  ⚠ Could not get scores (is Playwright working?)")
            break

        perf = scores.get("performance",        0)
        a11y = scores.get("accessibility",       0)
        bp   = scores.get("best-practices",     0)
        seo  = scores.get("seo",                0)

        print(f"\n  Scores: Perf {perf} | A11y {a11y} | BP {bp} | SEO {seo}")

        if perf == 100 and a11y == 100 and bp == 100 and seo == 100:
            print("\n  🎉 ALL SCORES AT 100 — DONE!")
            sys.exit(0)

        failures = get_failing()
        if failures:
            print(f"\n  Failing audits ({len(failures)}):")
            for f in failures[:8]:
                print(f"    • {f}")
            if len(failures) > 8:
                print(f"    ... and {len(failures)-8} more")

        print("\n  Running fixer...")
        out, err, code = run(f"python3 {FIX_SCRIPT} 2>&1")
        print(out)
        if code != 0:
            print(f"  Fixer error: {err[:200]}")
            break

        # Check if anything was actually committed
        if "Pushed:" in out or "committed and pushed" in out:
            print(f"\n  Waiting {WAIT_SEC}s for Vercel deploy...")
            time.sleep(WAIT_SEC)
        else:
            print("\n  No changes to push — running fixer again.")
    else:
        print("\n  ⚠ Max iterations reached. Will retry next scheduled run.")

    print()

if __name__ == "__main__":
    main()
