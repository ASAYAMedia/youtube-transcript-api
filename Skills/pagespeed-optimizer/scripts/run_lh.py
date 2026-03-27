#!/usr/bin/env python3
"""
Lighthouse runner using Playwright directly — no Chrome install needed.
Uses Playwright's bundled Chromium to run Lighthouse programmatically.
"""

import subprocess
import sys
import json
import os

LH_DIR = "/tmp/lh_runner"
LH_JS = f"""
const {{ chromium }} = require('playwright');
const lighthouse = require('{LH_DIR}/node_modules/lighthouse');

(async () => {{
  const browser = await chromium.launch({{
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage', 
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
      '--no-first-run',
      '--single-process'
    ]
  }});

  const page = await browser.newPage();
  await page.setViewportSize({{ width: 390, height: 844 }});

  const {{ artifacts, report }} = await lighthouse(
    'https://tinytoolbox.co',
    {{
      port: 0,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      settings: {{
        formFactor: 'mobile',
        screenEmulation: {{
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          disabled: false,
        }},
        throttlingMethod: 'simulate',
      }},
    }},
    undefined,
    page
  );

  // Use the artifacts to get more audit details
  const categories = report?.categories || {{}};
  const audits = report?.audits || {{}};

  const scores = {{}};
  for (const [k, v] of Object.entries(categories)) {{
    scores[k] = Math.round((v.score || 0) * 100);
  }}

  const failing = [];
  for (const [k, v] of Object.entries(audits)) {{
    if (v.score !== undefined && v.score < 1 && v.title) {{
      failing.push({{
        id: k,
        title: v.title,
        score: Math.round((v.score || 0) * 100),
        description: (v.description || '').substring(0, 200),
      }});
    }}
  }}

  console.log(JSON.stringify({{ scores, failing }}));
  await browser.close();
}})().catch(e => {{ console.error('ERROR:', e.message); process.exit(1); }});
"""

def run_lh():
    with open("/tmp/lh_inline.js", "w") as f:
        f.write(LH_JS)

    env = {**os.environ, "NODE_PATH": f"{LH_DIR}/node_modules"}
    r = subprocess.run(
        ["node", "/tmp/lh_inline.js"],
        capture_output=True, text=True, timeout=120, env=env
    )
    if r.returncode != 0:
        return {"error": r.stderr[-400:]}
    try:
        return json.loads(r.stdout)
    except:
        return {"error": r.stdout[:400]}


def main():
    print(f"\n{'='*60}")
    print(f"  LIGHTHOUSE AUDIT — https://tinytoolbox.co")
    print(f"{'='*60}")

    all_passed = True

    for strategy, viewport in [("mobile", "390x844"), ("desktop", "1280x720")]:
        print(f"\n--- {strategy.upper()} ({viewport}) ---")
        print("(Running Lighthouse... ~60s)")

        # Build the LH JS for this strategy
        lh_js = LH_JS.replace("'mobile'", f"'{strategy}'")
        lh_js = lh_js.replace("width: 390", f"width: {viewport.split('x')[0]}")
        lh_js = lh_js.replace("height: 844", f"height: {viewport.split('x')[1]}")
        lh_js = lh_js.replace("deviceScaleFactor: 2", "deviceScaleFactor: 1")
        lh_js = lh_js.replace("'mobile'", f"'{strategy}'")

        with open("/tmp/lh_inline.js", "w") as f:
            f.write(lh_js)

        data = run_lh()

        if "error" in data:
            print(f"  ERROR: {data['error']}")
            continue

        scores = data.get("scores", {})
        failing = data.get("failing", [])

        print(f"\n  Scores:")
        for cat, score in scores.items():
            icon = "✅" if score == 100 else "⚠️ "
            print(f"    {icon} {cat:22s}: {score}/100")
            if score < 100:
                all_passed = False

        if failing:
            print(f"\n  Failing audits:")
            for f in sorted(failing, key=lambda x: x["score"])[:8]:
                print(f"    [{f['score']:3d}] {f['title'][:65]}")
            if len(failing) > 8:
                print(f"    ... +{len(failing) - 8} more")

    print(f"\n{'='*60}")
    if all_passed:
        print("  🎉 ALL SCORES AT 100 — DONE!")
    else:
        print("  ⚠️  Still fixing... applying auto-fixes next.")
    print(f"{'='*60}")

    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
