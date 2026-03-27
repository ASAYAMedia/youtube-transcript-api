---
name: pinterest-automation
description: Generates Pinterest pins from TinyToolbox tools and automates pinning to drive organic traffic. Creates multiple pin variations per tool with AI-generated images, titles, and descriptions optimized for Pinterest SEO.
compatibility: Created for Zo Computer
metadata:
  author: asayaagent1.zo.computer
allowed-tools: Bash,Read,Write,WebSearch,GenerateImage
---

# Pinterest Automation Skill

## Quick Start (5 Minutes)

```bash
cd /home/workspace/Skills/pinterest-automation/scripts

# Step 1: Generate pin metadata
bun generate-pins.ts --count 10

# Step 2: List pins ready to post
bun browser-poster.ts --list

# Step 3: Get posting details for a pin
bun browser-poster.ts --pin gradient-generator-1

# Step 4: Open Pinterest and post (manual)
# Follow the printed guide or run saved script
bash output/logs/post-gradient-generator-1.sh
```

## Browser Automation Mode

Since Pinterest API requires a refreshed token (current one expired 401), use browser mode:

**Manual Posting (Fastest):**
```bash
# Get all details for a pin
bun browser-poster.ts --pin gradient-generator-1

# Output shows:
#   - Title (optimized)
#   - Description (with hashtags)
#   - Link (to tool)
#   - Board recommendation

# Then manually:
# 1. Visit https://www.pinterest.com/pin-builder/
# 2. Copy/paste from output above
# 3. Add image from OG tags or upload
# 4. Publish
```

**Batch Mode:**
```bash
# Generate 50 pins for top tools
for tool in gradient-generator glassmorphism-generator color-palette password-generator qr-code-generator; do
  bun generate-pins.ts --tool $tool --count 3
done
```

## API Mode (When Token Refreshed)

```bash
# Test connection
PINTEREST_API_KEY="your_token" bun post-to-pinterest.ts --test

# Post to specific board
bun post-to-pinterest.ts --post-board "Developer Tools" --limit 3

# Auto-post scheduled pins
bun post-to-pinterest.ts --scheduled --limit 10
```

## Why Pinterest for TinyToolbox

| Factor | Pinterest | Instagram | Twitter |
|--------|-----------|-----------|----------|
| Organic Reach | **High** | Low | Low |
| Tool Discovery | **Excellent** | Poor | Poor |
| Click-through | **Strong** | Weak | Medium |
| Competition | **Low** for dev tools | High | High |
| Content Lifespan | **Years** | Hours | Minutes |

## Pin Strategy

**Top Performing Tool Categories:**
1. **Color/Design** — gradient, palette, glassmorphism
2. **SEO** — meta tags, sitemap, OG preview
3. **Converters** — image, PDF, color
4. **Generators** — passwords, QR codes, logos
5. **Finance** — calculators, mortgage, crypto

**Pin Titles That Convert:**
- "Free [Tool] — [Result] in Seconds"
- "[Number] Best [Category] Tools [Year]"
- "Stop [Pain Point] — Free Tool Inside"
- "UX Designers: This Changes Everything"

## Current Status

| Metric | Value |
|--------|-------|
| Tools Registered | 431 |
| Pins Generated | ~100+ |
| Boards Needed | ~10-14 |
| API Status | 401 (needs refresh) |
| Browser Mode | ✅ Ready |

## Next Steps

1. **Generate 50 pins** for Tier 1 tools
2. **Create Pinterest account** if not exists
3. **Set up boards** matching tool categories
4. **Post 3-5 pins daily** for 30 days

Track results in `/home/workspace/pinterest-traffic.md`
