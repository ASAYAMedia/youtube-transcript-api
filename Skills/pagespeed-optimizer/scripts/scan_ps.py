#!/usr/bin/env python3
"""
PageSpeed Insights scanner using Playwright Python.
Navigates to pagespeed.web.dev, waits for results, extracts scores.
"""

import subprocess
import sys
import json
import re
import time

def run_scan(url: str, strategy: str = "mobile") -> dict:
    from playwright.sync_api import sync_playwright

    form_factor = "mobile" if strategy == "mobile" else "desktop"
    psi_url = f"https://pagespeed.web.dev/analysis?url={url}&hl=en&form_factor={form_factor}"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--disable-extensions",
                "--disable-background-networking",
            ]
        )

        if strategy == "mobile":
            browser_viewport = {"width": 390, "height": 844}
        else:
            browser_viewport = {"width": 1280, "height": 720}

        page = browser.new_page(viewport=browser_viewport)
        page.goto(psi_url, wait_until="domcontentloaded", timeout=30000)

        # Dismiss cookie consent if present
        try:
            page.click("text='Ok, Got it'", timeout=3000)
            page.wait_for_timeout(1000)
        except:
            pass

        page.wait_for_timeout(30000)  # Wait for JS to render scores

        # Extract scores using page.evaluate (tree walker approach)
        scores = page.evaluate("""() => {
            const result = {};
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent?.trim();
                if (text && /^\\d{1,3}$/.test(text)) {
                    const parent = node.parentElement;
                    const grandparent = parent?.parentElement;
                    const gp_text = grandparent?.innerText || '';
                    if (gp_text.includes('Performance')) result.performance = parseInt(text);
                    else if (gp_text.includes('Accessibility')) result.accessibility = parseInt(text);
                    else if (gp_text.includes('Best Practices')) result['best-practices'] = parseInt(text);
                    else if (gp_text.includes('SEO')) result.seo = parseInt(text);
                }
            }
            return result;
        }""")

        page.close()
        browser.close()

        return {
            "url": url,
            "strategy": strategy,
            "scores": scores,
        }


def main():
    url = sys.argv[1] if len(sys.argv) > 1 else "https://tinytoolbox.co"

    print(f"\n{'='*60}")
    print(f"  PAGE SPEED SCAN — {url}")
    print(f"{'='*60}")

    all_passed = True

    for strategy in ["mobile", "desktop"]:
        print(f"\n--- {strategy.upper()} ---")
        data = run_scan(url, strategy)
        scores = data.get("scores", {})

        if scores:
            print(f"\n  Scores:")
            for cat, score in scores.items():
                icon = "✅" if score == 100 else "⚠️ "
                print(f"    {icon} {cat:22s}: {score}/100")
                if score < 100:
                    all_passed = False
        else:
            print(f"\n  Could not parse scores from DOM.")

    print(f"\n{'='*60}")
    if all_passed:
        print("  🎉 ALL SCORES AT 100 — DONE!")
    else:
        print("  ⚠️  Still fixing...")
    print(f"{'='*60}")

    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
