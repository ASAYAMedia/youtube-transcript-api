#!/usr/bin/env python3
"""
PageSpeed Optimizer — main loop
Runs scan → fix → commit → push → wait → rescan until all scores hit 100.
Max 10 rounds before giving up.
"""

import subprocess
import time
import sys
import json
import os
import urllib.request
import urllib.error

BASE = "/home/workspace/tinytoolbox-github"
URL = "https://tinytoolbox.co"
API_KEY = "AIzaSyDQTp0O_9UZT2lnUTFZY0qFQ_P_rGqZTXs"
FIELDS = "loadingExperience,categories,lighthouseResult/audits"
MAX_ROUNDS = 10


def run(cmd: str) -> str:
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=BASE)
    return r.stdout + r.stderr


def fetch_pagespeed(strategy: str) -> dict:
    url = (
        f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
        f"?url={URL}&strategy={strategy}&key={API_KEY}&fields={FIELDS}"
    )
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except Exception as e:
        return {"error": str(e)}


def get_scores(data: dict) -> dict:
    cats = data.get("lighthouseResult", {}).get("categories", {})
    scores = {}
    for cat_name, cat_data in cats.items():
        score = cat_data.get("score", 0)
        scores[cat_name] = int(score * 100) if score is not None else 0
    return scores


def get_failing_audits(data: dict) -> list[dict]:
    audits = data.get("lighthouseResult", {}).get("audits", {})
    failing = []
    for aid, audit in audits.items():
        score = audit.get("score")
        if score is not None and score < 1:
            failing.append({
                "id": aid,
                "title": audit.get("title", aid),
                "description": audit.get("description", "")[:200],
            })
    return failing


def print_report(strategy: str, scores: dict, failing: list[dict]):
    print(f"\n{'='*60}")
    print(f"  {strategy.upper()} RESULTS")
    print(f"{'='*60}")
    for cat, score in scores.items():
        icon = "✅" if score == 100 else "⚠️ "
        print(f"  {icon} {cat:22s}: {score}/100")
    if failing:
        print(f"\n  FAILED AUDITS ({len(failing)}):")
        for f in failing[:8]:
            print(f"    • [{f['id']}] {f['title'][:60]}")
        if len(failing) > 8:
            print(f"    ... and {len(failing) - 8} more")


def apply_auto_fixes():
    """Run the fix.py script to apply known fixes."""
    fix_script = os.path.join(os.path.dirname(__file__), "fix.py")
    r = subprocess.run(["python3", fix_script], capture_output=True, text=True, cwd=BASE)
    return r.stdout + r.stderr


def all_scores_100(scores: dict) -> bool:
    return all(v == 100 for v in scores.values())


def git_commit_push(msg: str) -> bool:
    diff = subprocess.run(["git", "diff", "--stat"], capture_output=True, text=True, cwd=BASE)
    if not diff.stdout.strip():
        return False
    subprocess.run(["git", "add", "-A"], cwd=BASE)
    subprocess.run(["git", "commit", "-m", msg], cwd=BASE)
    r = subprocess.run(["git", "push"], capture_output=True, text=True, cwd=BASE)
    return r.returncode == 0


def main():
    print("🚀 PageSpeed Optimizer — tinytoolbox.co")
    print("="*60)

    for round_num in range(1, MAX_ROUNDS + 1):
        print(f"\n{'='*60}")
        print(f"  ROUND {round_num}/{MAX_ROUNDS}")
        print(f"{'='*60}")

        # ── Scan ───────────────────────────────────────────────
        all_scores = {}
        all_failing = []
        for strategy in ["mobile", "desktop"]:
            data = fetch_pagespeed(strategy)
            if "error" in data:
                print(f"  ❌ {strategy} scan error: {data['error']}")
                continue
            scores = get_scores(data)
            failing = get_failing_audits(data)
            all_scores[strategy] = scores
            all_failing.extend(failing)
            print_report(strategy, scores, failing)

        if not all_scores:
            print("  ❌ No scan data — retrying in 30s...")
            time.sleep(30)
            continue

        # Check if all scores are 100
        all_passed = True
        for strategy, scores in all_scores.items():
            if not all_scores_100(scores):
                all_passed = False
                break

        if all_passed:
            print(f"\n🎉 ALL SCORES AT 100 after {round_num} rounds!")
            sys.exit(0)

        # ── Apply fixes ────────────────────────────────────────
        print("\n" + "="*60)
        print("  APPLYING AUTO-FIXES")
        print("="*60)
        fix_output = apply_auto_fixes()
        print(fix_output)

        # ── Build check ────────────────────────────────────────
        print("\n⏳ Running build check...")
        build_r = subprocess.run(
            ["bun", "run", "build"],
            capture_output=True, text=True, cwd=BASE, timeout=180
        )
        if build_r.returncode != 0:
            print(f"  ❌ Build FAILED — rolling back")
            subprocess.run(["git", "checkout", "."], cwd=BASE)
            print("  Rolled back to last clean state.")
            # Still try next round in case it was a false positive
        else:
            print("  ✅ Build passed")

            # ── Commit + Push ──────────────────────────────────
            print("\n📤 Committing and pushing...")
            if git_commit_push(f"perf: pagespeed auto-fix round {round_num}"):
                print("  ✅ Pushed to GitHub")
                print("  ⏳ Waiting 120s for Vercel to redeploy...")
                time.sleep(120)  # Wait for Vercel rebuild
            else:
                print("  ⚠️  No changes to commit (or push failed)")
                print("  ⏳ Waiting 30s then rescan...")
                time.sleep(30)

    print(f"\n❌ Max rounds ({MAX_ROUNDS}) reached — manual intervention needed.")
    sys.exit(1)


if __name__ == "__main__":
    main()
