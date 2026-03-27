#!/usr/bin/env python3
"""
Compiles all blog content and video metadata into a structured knowledge base.
Output:
  - TOPICS_INDEX.md      → master categorized topic index
  - KNOWLEDGE_MASTER.md  → full merged knowledge from all sources
  - video_catalog.json   → all 449 video entries
"""

import re, json, html, os
from pathlib import Path
from collections import defaultdict

BASE = Path("/home/workspace/Knowledge-Base/affiliate-marketing-dude")
BLOG = BASE / "blog_content"
TRANSCRIPTS = BASE / "transcripts"

# ── Load video catalog ──────────────────────────────────────────
video_catalog = []
vl_path = BASE / "video_list_full.txt"
if vl_path.exists():
    with open(vl_path) as f:
        for line in f:
            line = line.strip()
            if "|||" in line:
                parts = line.split("|||", 1)
                video_catalog.append({"id": parts[0], "title": parts[1]})
print(f"Loaded {len(video_catalog)} video entries")

# ── Load blog content ─────────────────────────────────────────
blog_docs = []
for md_file in BLOG.glob("*.md"):
    with open(md_file) as f:
        content = f.read()
    # Extract title (first # heading)
    m = re.search(r'^# (.+)', content)
    title = m.group(1) if m else md_file.stem
    # Extract source URL
    src_m = re.search(r'Source: (https://[^\s]+)', content)
    source = src_m.group(1) if src_m else ""
    blog_docs.append({"title": title, "source": source, "content": content, "file": md_file.name})

print(f"Loaded {len(blog_docs)} blog documents")

# ── Topic Classification ───────────────────────────────────────
# Define topic keywords to categorize content
TOPIC_MAP = {
    "AI Tools & Automation": ["chatgpt", "claude", "manus", "gemini", "deepseek", "notebook lm", "ai tool", "ai automation", "bolt ai", "grok", "perplexity", "copilot", "chatgpt", "openai", "llm", "ai assistant", "ai prompt"],
    "Affiliate Programs & Networks": ["affiliate program", "clickbank", "amazon affiliate", "audible", "walmart affiliate", "ebay affiliate", "target affiliate", "capital one affiliate", "costo", "home depot", "shopify affiliate", "lego affiliate", "ppl affiliate", "cpa marketing", "cpa affiliate", "pay per lead"],
    "Niche Selection & Research": ["niche", "keyword research", "profitable niche", "niche market", "low competition", "long tail keyword", "keyword finder", "keyword tool", "google keyword"],
    "Content Creation & SEO": ["seo", "content", "blog", "rank", "google ranking", "backlink", "traffic", "search engine", "pinterest", "social media", "faceless video", "youtube automation", "youtube channel", "content creation", "article", "blog post"],
    "Website Building & Tech": ["website", "wordpress", "domain", "hosting", "landing page", "funnel", "web design", "web development", "no code", "vibe coding", "saas", "waas"],
    "Traffic Generation": ["traffic", "free traffic", "paid traffic", "google ads", "ppc", "seo traffic", "social traffic", "email marketing", "mailchimp", "list building", "lead generation", "leads"],
    "Monetization & Business Models": ["make money", "monetize", "revenue", "income", "passive income", "side hustle", "digital product", "course", "membership", "subscription", "adsense", "advertising", "earn money", "earn $", "profit", "directory site", "micro saas", "tool website"],
    "AI Video & Content Tools": ["video", "faceless video", "ai video", "veo", "sora", "synthesia", "elevenlabs", "youtube automation", "shorts", "reels", "tiktok"],
    "Platforms & Tools": ["wordpress", "shopify", "gumroad", "clickfunnels", "systeme", "convertkit", "mailchimp", "aws", "cloudflare", "firebase", "github"],
    "Mindset & Success": ["mindset", "success", "motivation", "habit", "discipline", "belief", "commitment", "goal setting", " millionaire", "billionaire"],
    "Email Marketing & List Building": ["email list", "newsletter", "email sequence", "autoresponder", "email marketing", "lead capture", "squeeze page", "landing page", "email campaign"],
}

def classify_doc(text):
    text_lower = text.lower()
    scores = {}
    for topic, keywords in TOPIC_MAP.items():
        score = sum(1 for kw in keywords if kw.lower() in text_lower)
        if score > 0:
            scores[topic] = score
    return scores

# ── Build Topics Index ────────────────────────────────────────
topics_index = defaultdict(list)
for doc in blog_docs:
    scores = classify_doc(doc["content"])
    for topic, score in scores.items():
        topics_index[topic].append({"title": doc["title"], "source": doc["source"], "score": score})

# Sort each topic by relevance
for topic in topics_index:
    topics_index[topic].sort(key=lambda x: x["score"], reverse=True)

# Write TOPICS_INDEX.md
with open(BASE / "TOPICS_INDEX.md", "w") as f:
    f.write("# Affiliate Marketing Dude — Knowledge Topics Index\n\n")
    f.write(f"**Total Blog Posts:** {len(blog_docs)}  \n")
    f.write(f"**Total YouTube Videos:** {len(video_catalog)}  \n")
    f.write(f"**Compiled:** 2026-03-26\n\n")
    f.write("## Topic Categories\n\n")
    for topic, entries in sorted(topics_index.items()):
        f.write(f"### {topic} ({len(entries)} posts)\n")
        seen = set()
        for entry in entries[:20]:  # top 20 per topic
            if entry["title"] not in seen:
                seen.add(entry["title"])
                src = f' [→]({entry["source"]})' if entry["source"] else ""
                f.write(f"- {entry['title']}{src}\n")
        f.write("\n")

print(f"Topics index written: {BASE / 'TOPICS_INDEX.md'}")

# ── Build KNOWLEDGE_MASTER.md ────────────────────────────────
# Merge key insights from all blog posts into one master doc
with open(BASE / "KNOWLEDGE_MASTER.md", "w") as f:
    f.write("# Affiliate Marketing Dude — Master Knowledge Base\n\n")
    f.write("> Compiled from 1,273 blog posts + 449 YouTube videos  \n")
    f.write("> Source: https://affiliatemarketingdude.com  \n")
    f.write("> Compiled: 2026-03-26\n\n")
    f.write("---\n\n")

    for doc in blog_docs:
        f.write(f"\n## {doc['title']}\n")
        if doc['source']:
            f.write(f"*Source: {doc['source']}*\n\n")
        # Clean content - remove markdown headers (# in body)
        body = doc['content']
        # Remove the title line
        body = re.sub(r'^# .+\n', '', body, count=1)
        # Remove source line
        body = re.sub(r'^Source:.*\n?', '', body)
        body = re.sub(r'^Published:.*\n?', '', body)
        body = body.strip()
        if body:
            f.write(body + "\n")
        f.write("\n---\n")

print(f"Knowledge master written: {BASE / 'KNOWLEDGE_MASTER.md'}")

# ── Write video catalog JSON ───────────────────────────────────
with open(BASE / "video_catalog.json", "w") as f:
    json.dump(video_catalog, f, indent=2)
print(f"Video catalog written: {BASE / 'video_catalog.json'}")

# ── Write video catalog markdown ─────────────────────────────
with open(BASE / "VIDEO_CATALOG.md", "w") as f:
    f.write("# YouTube Video Catalog — @affiliatemarketingdude\n\n")
    f.write(f"Total: {len(video_catalog)} videos  \n\n")
    for v in video_catalog:
        f.write(f"- **{v['title']}** — https://www.youtube.com/watch?v={v['id']}\n")

print(f"Video catalog markdown: {BASE / 'VIDEO_CATALOG.md'}")
print("\n✅ All knowledge compiled successfully!")
