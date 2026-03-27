#!/usr/bin/env python3
"""
Run PageSpeed Insights via Playwright browser automation.
Navigates to pagespeed.web.dev, enters URL, runs audit, extracts scores.
"""

import subprocess
import sys
import json
import time
import re

def run_pagespeed(url: str, strategy: str = "mobile") -> dict:
    """
    Use Playwright to run PageSpeed Insights in browser.
    Returns dict with scores and failing audits.
    """
    script = f"""
const {{ chromium }} = require('playwright');

(async () => {{
  const browser = await chromium.launch({{
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  }});

  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to PageSpeed Insights
  const psi_url = 'https://pagespeed.web.dev/analysis?url={url}&hl=en&form_factor={strategy}';
  await page.goto(psi_url, {{ waitUntil: 'domcontentloaded', timeout: 30000 }});

  // Wait for results to load (the page loads scores dynamically)
  await page.waitForTimeout(10000);

  // Extract scores from the page
  const scores = await page.evaluate(() => {{
    const result = {{}};
    const scoreEls = document.querySelectorAll('[data-testid="score"]');
    scoreEls.forEach(el => {{
      const text = el.textContent?.trim() || '';
      const num = parseInt(text);
      if (!isNaN(num)) result['score'] = num;
    }});

    // Also look for gauge/filled-circle elements
    const gauges = document.querySelectorAll('circle[stroke-dasharray]');
    gauges.forEach(c => {{
      const parent = c.closest('[data-testid]');
      const testId = parent?.getAttribute('data-testid') || '';
    }});

    // Try to get specific scores from the DOM
    const perfEl = document.querySelector('[data-testid="performance-score"]');
    const a11yEl = document.querySelector('[data-testid="accessibility-score"]');

    // Get all text content that looks like a score (0-100)
    const bodyText = document.body.innerText;
    const scoreMatches = bodyText.match(/(?:Performance|Accessibility|Best Practices|SEO)[:\\s]+(\\d{{1,3}})/gi);

    return {{
      url: window.location.href,
      bodySnippet: bodyText.substring(0, 2000),
      rawScores: scoreMatches || [],
    }};
  }});

  console.log(JSON.stringify(scores));
  await browser.close();
}})().catch(e => {{ console.error('ERROR:', e.message); process.exit(1); }});
"""

    with open("/tmp/psi_browser.js", "w") as f:
        f.write(script)

    result = subprocess.run(
        ["node", "/tmp/psi_browser.js"],
        capture_output=True, text=True, timeout=60
    )

    if result.returncode != 0:
        return {"error": result.stderr[-300:]}

    try:
        return json.loads(result.stdout)
    except:
        return {"error": result.stdout[:500]}


def parse_scores_from_snippet(snippet: str) -> dict:
    """Parse scores from page text snippet."""
    scores = {}
    patterns = {
        "performance": r"Performance[:\\s]+(\\d+)",
        "accessibility": r"Accessibility[:\\s]+(\\d+)",
        "best-practices": r"Best Practices[:\\s]+(\\d+)",
        "seo": r"SEO[:\\s]+(\\d+)",
    }
    for cat, pat in patterns.items():
        m = re.search(pat, snippet, re.IGNORECASE)
        if m:
            scores[cat] = int(m.group(1))
    return scores


def main():
    url = sys.argv[1] if len(sys.argv) > 1 else "https://tinytoolbox.co"
    strategy = sys.argv[2] if len(sys.argv) > 2 else "mobile"

    print(f"Running PageSpeed for {url} ({strategy})...")
    result = run_pagespeed(url, strategy)

    if "error" in result:
        print(f"Error: {result['error']}")
        sys.exit(1)

    snippet = result.get("bodySnippet", "")
    scores = parse_scores_from_snippet(snippet)

    print(f"\nScores from {strategy}:")
    for cat, score in scores.items():
        icon = "✅" if score == 100 else "⚠️ "
        print(f"  {icon} {cat:22s}: {score}/100")

    if not scores:
        print(f"\nRaw snippet (first 1000 chars):")
        print(snippet[:1000])

    all_passed = all(v == 100 for v in scores.values()) if scores else False
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
