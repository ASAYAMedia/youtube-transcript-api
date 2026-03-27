---
name: pinterest-automation
description: Generates Pinterest pins from TinyToolbox tools and automates pinning to drive organic traffic. Creates multiple pin variations per tool with AI-generated images, titles, and descriptions optimized for Pinterest SEO.
compatibility: Created for Zo Computer
metadata:
  author: asayaagent1.zo.computer
allowed-tools: Bash,Read,Write,WebSearch,GenerateImage
---

# Pinterest Automation Skill

## Overview

Pinterest = lowest competition, fastest organic growth for tool sites. This skill turns 431 TinyToolbox tools into a traffic engine.

## Traffic Strategy

| Method | Daily Earnings | Competition |
|--------|---------------|-------------|
| Pinterest Affiliate | $200-800/day | Very Low |
| Faceless YouTube | $500-5000/day | Medium |
| AI Content Repurposing | $100-300/day | Low |

**Why Pinterest for TinyToolbox:**
- 431 tools = 1000+ pin opportunities (3-5 pins per tool)
- Visual tools rank in Google Images
- Each pin = permanent traffic asset
- Developer/designer audience active on Pinterest

## Pin Format Strategy

### Dimensions
- Standard: 1000x1500px (2:3) — best organic reach
- Story: 1080x1920px (9:16) — Idea Pins

### Title Formulas
- "Free [Tool Name] — [Benefit] in Seconds"
- "[Number] [Category] Tools You Need [Year]"
- "Stop [Pain Point] — Try This Free Tool"
- "The Only [Category] Tool You'll Ever Need"

### Description Template
[Hook] + [Benefit] + [CTA] + [Hashtags 3-5]

## Directory Structure

```
Skills/pinterest-automation/
├── SKILL.md
├── scripts/
│   ├── generate-pins.ts
│   ├── generate-pin-image.ts
│   └── post-to-pinterest.ts
├── assets/
│   └── pin-templates/
├── output/
│   ├── pins/
│   └── scheduled/
└── data/
    └── tool-priority.json
```

## Priority Tool Queue

**Tier 1** (5 pins each): color-tools, gradient-generator, glassmorphism-generator, password-generator, qr-code-generator

**Tier 2** (3 pins each): seo-tools, converters, finance calculators, text generators

**Tier 3** (1-2 pins each): Everything else

## Commands

```bash
# Generate pins
cd /home/workspace/Skills/pinterest-automation/scripts
bun generate-pins.ts --count 10 --priority high

# Generate specific tool
bun generate-pin-image.ts --tool gradient-generator

# Post to Pinterest
bun post-to-pinterest.ts --pin output/pins/gradient-1.png
```

## API Setup

1. Create Pinterest Business Account at business.pinterest.com
2. Apply for API at developers.pinterest.com
3. Or use browser automation via agent-browser

## Success Metrics

- Target: 100 pins posted in first month
- Target: 1000 monthly clicks to tinytoolbox.co by month 3
- Track: Repins, clicks, outbound traffic
