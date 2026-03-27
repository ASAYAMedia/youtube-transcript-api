#!/usr/bin/env python3
"""
Lighthouse runner using Playwright + local Chromium.
Runs Lighthouse audits without API key or Chrome install complexity.
"""

import subprocess
import sys
import json
import os

def run_lighthouse(url: str, strategy: str = "mobile") -> dict:
    """Run Lighthouse via Playwright/Chromium."""
    script = f"""
const {{ chromium }} = require('playwright');
const {{ lighthouse }} = require('lighthouse');
const {{ fullscreens }} = require('lighthouse/fullscreens');

(async () => {{
  const browser = await chromium.launch({{
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-software-rasterizer', '--disable-extensions']
  }});
  const page = await browser.newPage();

  const config = {{
    extends: 'lighthouse:default',
    settings: {{
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      throttlingMethod: 'simulate',
      formFactor: '{strategy}',
      screenEmulation: {{
        mobile: {strategy == 'mobile'},
        width: {strategy == 'mobile' and 390 or 1280},
        height: {strategy == 'mobile' and 844 or 720},
        deviceScaleFactor: 3,
        disabled: false,
      }},
    }},
  }};

  const report = await lighthouse('{url}', {{
    port: 0,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  }}, config);

  console.log(JSON.stringify(report));
  await browser.close();
}})();
"""

    with open("/tmp/lh_run.js", "w") as f:
        f.write(script)

    result = subprocess.run(
        ["node", "/tmp/lh_run.js"],
        capture_output=True, text=True, timeout=120,
        env={**os.environ, "CHROME_PATH": "/usr/bin/chromium-browser"}
    )
    if result.returncode != 0:
        return {"error": result.stderr[-500:]}

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return {"error": f"JSON parse error: {result.stdout[:200]}"}


def main():
    url = sys.argv[1] if len(sys.argv) > 1 else "https://tinytoolbox.co"

    print(f"\n{'='*60}")
    print(f"  LIGHTHOUSE AUDIT — {url}")
    print(f"{'='*60}")

    all_passed = True

    for strategy in ["mobile", "desktop"]:
        print(f"\n--- {strategy.upper()} ---")
        print("(Running Lighthouse... this takes ~30s)")
        data = run_lighthouse(url, strategy)

        if "error" in data:
            print(f"ERROR: {data['error']}")
            continue

        cats = data.get("categories", {})
        for cat_name, cat_data in cats.items():
            score = cat_data.get("score", 0)
            score_pct = int(score * 100) if score is not None else 0
            icon = "✅" if score_pct == 100 else "⚠️ "
            print(f"  {icon} {cat_name:22s}: {score_pct}/100")
            if score_pct < 100:
                all_passed = False

        # Print top failing audits
        audits = data.get("audits", {})
        failing = [
            (aid, a) for aid, a in audits.items()
            if a.get("score") is not None and a.get("score") < 1
            and a.get("title")
        ]
        if failing:
            print(f"\n  Top failures:")
            for aid, a in failing[:6]:
                score = int((a.get("score") or 0) * 100)
                print(f"    [{score:3d}] {a['title'][:70]}")

    print(f"\n{'='*60}")
    print(f"  {'🎉 ALL 100!' if all_passed else '⚠️  Still fixing...'}")
    print(f"{'='*60}")
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
