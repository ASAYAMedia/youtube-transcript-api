---
name: free-media-gen
description: Free AI image generation with multiple fallback APIs (Gemini 500/day free, Prodia, Hugging Face). No paid credits required.
compatibility: Created for Zo Computer
metadata:
  author: asayaagent1.zo.computer
---

# Free Media Generation Skill

Generate images for free using multiple fallback APIs.

## Supported Generators

| Service | Cost | Rate Limit | Quality | Best For |
|---------|------|------------|---------|----------|
| **Gemini Flash Image** | **500/day FREE** | 500/day | Excellent | Default, highest quality |
| Prodia | Free trial | Varies | Good | Fallback |
| Hugging Face | Free tier | 30 req/day | Good | Open source models |

## API Key Setup

### 1. Gemini (RECOMMENDED - 500 images/day free)

1. Go to: https://aistudio.google.com/app/apikey
2. Create a free API key
3. Add to Zo: [Settings > Advanced](/?t=settings&s=advanced)
   - Secret name: `GEMINI_API_KEY`
   - Value: your key

### 2. Prodia (Optional fallback)

1. Sign up: https://app.prodia.com/
2. Get API key from dashboard
3. Add to Zo: [Settings > Advanced](/?t=settings&s=advanced)
   - Secret name: `PRODIA_API_KEY`

### 3. Hugging Face (Optional fallback)

1. Sign up: https://huggingface.co/join
2. Get token: https://huggingface.co/settings/tokens
3. Add to Zo: [Settings > Advanced](/?t=settings&s=advanced)
   - Secret name: `HF_API_KEY`

## Usage

### Generate an Image

```bash
cd /home/workspace/Skills/free-media-gen/scripts

# Gemini is primary (best free tier)
python3 generate.py "futuristic AI robot, cyberpunk style"

# Specify aspect ratio
python3 generate.py "portrait of a medieval knight" --ratio 9:16

# Custom output path
python3 generate.py "space station" --out ~/Downloads/station.png --ratio 16:9

# Force specific provider
python3 generate.py "sunset over mountains" --provider gemini
```

### Generate Video (Experimental)

```bash
# Video generation is limited on free tiers
python3 generate-video.py "ocean waves crashing on beach"
```

## Aspect Ratios

| Ratio | Dimensions | Use Case |
|-------|------------|----------|
| `1:1` | 1024×1024 | Social posts, icons |
| `16:9` | 1280×720 | Wallpapers, presentations |
| `9:16` | 720×1280 | Mobile/stories |
| `4:3` | 1024×768 | Classic displays |
| `21:9` | 1280×549 | Ultrawide |

## Script Files

- `generate.py` — Image generation with provider fallback
- `generate-video.py` — Experimental video generation
- `setup.sh` — Check configuration status

## Example Output

```
$ python3 generate.py "futuristic city at night" --ratio 16:9
Generating: "futuristic city at night" (16:9)
  -> gemini (Google AI Studio)...
✅ Saved: /home/workspace/Images/2025-03-27-1756321.png (28473 bytes via gemini)
```

## Troubleshooting

**"GEMINI_API_KEY not set"**
→ Get free key at https://aistudio.google.com/app/apikey

**"All providers failed"**
→ Check your API keys are set correctly in Settings > Advanced

**Slow generation**
→ Gemini is fastest. Hugging Face free tier can be slow (30-60s).
