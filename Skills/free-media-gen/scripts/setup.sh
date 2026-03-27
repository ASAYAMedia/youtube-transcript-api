#!/bin/bash
# Setup script for free-image-gen

echo "=== Free Image Generator Setup ==="
echo ""
echo "This generator uses multiple FREE APIs with fallback:"
echo ""
echo "  1. Google Gemini Flash Image (500/day FREE)"
echo "     Get API key: https://aistudio.google.com/app/apikey"
echo ""
echo "  2. Prodia (free trial available)"
echo "     Get API key: https://app.prodia.com/api-keys"
echo ""
echo "  3. Hugging Face (free tier)"
echo "     Get API key: https://huggingface.co/settings/tokens"
echo ""
echo "Add these to your Zo Computer:"
echo "  1. Go to: https://asayaagent1.zo.computer/?t=settings&s=advanced"
echo "  2. Add each key as a secret"
echo ""
echo "---"
echo ""
echo "Quick test (requires GEMINI_API_KEY):"
if [ -z "$GEMINI_API_KEY" ]; then
  echo "   ⚠️ GEMINI_API_KEY not set yet"
else
  echo "   ✅ GEMINI_API_KEY is set"
fi

if [ -z "$PRODIA_API_KEY" ]; then
  echo "   ⚠️ PRODIA_API_KEY not set (optional)"
else
  echo "   ✅ PRODIA_API_KEY is set"
fi

if [ -z "$HF_API_KEY" ]; then
  echo "   ⚠️ HF_API_KEY not set (optional)"
else
  echo "   ✅ HF_API_KEY is set"
fi

echo ""
echo "---"
echo ""
echo "Example usage:"
echo "  python3 generate.py 'cyberpunk city at night' --ratio 16:9"
echo "  python3 generate.py 'portrait of a medieval knight' --out ~/knight.png --ratio 9:16"
echo ""
