#!/usr/bin/env python3
"""
Affiliate Marketing Dude - Knowledge Extraction Pipeline
Pulls from: YouTube API (via yt-dlp), blog posts via RSS, and direct blog pages.
"""

import urllib.request
import json
import re
import html
import time
import os
import xml.etree.ElementTree as ET
from pathlib import Path

BASE_DIR = Path("/home/workspace/Knowledge-Base/affiliate-marketing-dude")
TRANSCRIPTS_DIR = BASE_DIR / "transcripts"
BLOG_CONTENT_DIR = BASE_DIR / "blog_content"
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)
os.makedirs(BLOG_CONTENT_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def fetch(url, timeout=15):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return resp.read().decode('utf-8', errors='replace')
    except Exception as e:
        return None

# ─────────────────────────────────────────────
# 1. BLOG: RSS Feed with full post content
# ─────────────────────────────────────────────
print("=" * 60)
print("STEP 1: Fetching blog posts via RSS feed")
print("=" * 60)

rss_url = "https://affiliatemarketingdude.com/feed/"
rss_xml = fetch(rss_url)
if rss_xml:
    try:
        root = ET.fromstring(rss_xml)
        ns = {'atom': 'http://www.w3.org/2005/Atom', 'content': 'http://purl.org/rss/1.0/modules/content/'}
        items = root.findall('.//item')
        print(f"Found {len(items)} RSS items")
        for item in items:
            title_el = item.find('title')
            link_el = item.find('link')
            desc_el = item.find('description')
            content_el = item.find('content:encoded', ns) if 'content' in ns else item.find('{http://purl.org/rss/1.0/modules/content/}encoded')
            date_el = item.find('pubDate')
            
            title = html.unescape(title_el.text) if title_el is not None else 'No Title'
            link = link_el.text if link_el is not None else ''
            pub_date = date_el.text if date_el is not None else ''
            
            # Get description/content
            content = ''
            if content_el is not None and content_el.text:
                content = html.unescape(content_el.text)
            elif desc_el is not None and desc_el.text:
                content = html.unescape(desc_el.text)
            
            # Make safe filename
            safe_name = re.sub(r'[^\w\s-]', '', title)[:80].strip()
            safe_name = re.sub(r'[\s]+', '-', safe_name)
            
            out_file = BLOG_CONTENT_DIR / f"{safe_name}.md"
            with open(out_file, 'w') as f:
                f.write(f"# {title}\n")
                f.write(f"Source: {link}\n")
                f.write(f"Published: {pub_date}\n\n")
                # Strip HTML tags for clean text
                clean = re.sub(r'<[^>]+>', ' ', content)
                clean = re.sub(r'\s+', ' ', clean).strip()
                f.write(clean)
            print(f"  ✓ {title[:60]}")
        print(f"Saved {len(items)} blog posts")
    except Exception as e:
        print(f"RSS parse error: {e}")
else:
    print("Failed to fetch RSS feed")

# ─────────────────────────────────────────────
# 2. BLOG: Scrape individual post pages
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 2: Scraping individual blog post pages")
print("=" * 60)

blog_urls = [
    "https://affiliatemarketingdude.com/creating-digital-products-from-documents/",
    "https://affiliatemarketingdude.com/ai-skills-for-building-a-business-ai-jobs/",
    "https://affiliatemarketingdude.com/100-a-day-affilaite-plan-using-chatgpt-5-4/",
    "https://affiliatemarketingdude.com/using-claude-till-i-make-1000000/",
    "https://affiliatemarketingdude.com/vibe-code-software-business-with-marcus/",
    "https://affiliatemarketingdude.com/using-manus-till-i-earn-1000000-live/",
    "https://affiliatemarketingdude.com/2026-affiliate-marketing-is-dead/",
    "https://affiliatemarketingdude.com/finding-proven-digital-product-niches-with-ai/",
    "https://affiliatemarketingdude.com/get-easy-traffic-for-high-paying-markets/",
    "https://affiliatemarketingdude.com/target-affiliate-program-the-ultimate-guide-to-becoming-a-target-partner-in-2026/",
    "https://affiliatemarketingdude.com/simple-ai-profit-strategies/",
    "https://affiliatemarketingdude.com/chatgpt-digital-product-niche-prompts/",
    "https://affiliatemarketingdude.com/steal-super-fast-traffic-using-this-turning-point-usa-superbowl-hack/",
    "https://affiliatemarketingdude.com/crypto-affiliate-for-beginners-make-money-online-with-zero-investment/",
    "https://affiliatemarketingdude.com/audible-affiliate-program-stop-promoting-wrong-use-my-system/",
]

for url in blog_urls:
    try:
        page = fetch(url)
        if page:
            # Extract title
            title_m = re.search(r'<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>(.*?)</h1>', page, re.DOTALL)
            if not title_m:
                title_m = re.search(r'<title>(.*?)</title>', page)
            title = html.unescape(title_m.group(1).strip()) if title_m else url.split('/')[-2]
            
            # Extract article content
            content_m = re.search(r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)</div>\s*<footer', page, re.DOTALL)
            if not content_m:
                content_m = re.search(r'<article[^>]*>(.*?)</article>', page, re.DOTALL)
            
            if content_m:
                raw_html = content_m.group(1)
                # Strip scripts and styles
                raw_html = re.sub(r'<script[^>]*>.*?</script>', '', raw_html, flags=re.DOTALL)
                raw_html = re.sub(r'<style[^>]*>.*?</style>', '', raw_html, flags=re.DOTALL)
                clean = re.sub(r'<[^>]+>', ' ', raw_html)
                clean = re.sub(r'&[a-z]+;', ' ', clean)
                clean = re.sub(r'\s+', ' ', clean).strip()
                
                safe_name = re.sub(r'[^\w\s-]', '', title)[:80].strip()
                safe_name = re.sub(r'[\s]+', '-', safe_name)
                out_file = BLOG_CONTENT_DIR / f"post_{safe_name}.md"
                with open(out_file, 'w') as f:
                    f.write(f"# {title}\n")
                    f.write(f"Source: {url}\n\n")
                    f.write(clean)
                print(f"  ✓ {title[:60]}")
            time.sleep(0.5)
    except Exception as e:
        print(f"  ✗ Error with {url}: {e}")

print(f"\nBlog content saved to {BLOG_CONTENT_DIR}")
print(f"Files: {len(list(BLOG_CONTENT_DIR.glob('*.md')))}")
