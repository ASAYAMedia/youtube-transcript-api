---
name: tinytools-newsletter
description: Generates a weekly HTML newsletter for TinyToolbox.co and emails it to all subscribers. Reads new tools, blog posts, and site data to compile the email.
compatibility: Created for Zo Computer
metadata:
  author: asayaagent1.zo.computer
allowed-tools: Bash,Read,Write
---

# TinyTools Weekly Newsletter Agent

Weekly newsletter generation and delivery for **tinytoolbox.co**. Emails HTML newsletters to all subscribers.

## ⚠️ Setup Required (One-Time)

1. **Get Resend API Key**: Sign up at [https://resend.com](https://resend.com) → API Keys → Create Key
2. **Add to Zo**: [Settings > Advanced](/?t=settings&s=advanced) → Secrets → Add `RESEND_API_KEY` = your key
3. **Verify Sending Domain** (Resend free tier): Add and verify your domain, OR use their test mode to send to your own email first

## How It Works

1. Reads subscriber list from `/home/workspace/tinytoolbox-github/data/subscribers.json`
2. Reads tools and blog data from the tinytoolbox repo
3. Compiles latest tools, recent blog posts, and tips into an HTML email
4. Sends to all subscribers via Resend API in batches of 10

## CLI Commands

```bash
# Generate newsletter HTML (dry run - saves to newsletter-preview.html)
cd /home/workspace/Skills/tinytools-newsletter/scripts
bun run generate-newsletter.ts --dry-run

# Generate for actual sending (saves to latest-newsletter.html)
bun run generate-newsletter.ts

# Test send to a specific email
bun send-newsletter.ts --to you@example.com

# Send to ALL subscribers
bun send-newsletter.ts

# Dry run with subscriber count
bun send-newsletter.ts --dry-run
```

## Content Structure

- **Header**: TinyTools branding + week date
- **Intro**: Brief welcome + tool count
- **Tools This Week**: 6 featured tools from key categories
- **Blog Highlights**: Latest 3 blog posts
- **Quick Tips**: 3 actionable dev tips
- **CTA**: Browse all tools button
- **Footer**: Links + unsubscribe

## Subscriber Data

Location: `/home/workspace/tinytoolbox-github/data/subscribers.json`

Current count: **1 subscriber** (needs growth)

## Send Log

After each send, logs are saved to `Skills/tinytools-newsletter/send-log.json`
