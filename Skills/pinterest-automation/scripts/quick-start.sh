#!/bin/bash
# Pinterest Automation Quick Start

cd "$(dirname "$0")"

echo "🎯 Pinterest Traffic Pipeline for TinyToolbox"
echo "=============================================="
echo ""

# Step 1: Generate pin metadata
echo "Step 1: Generating pin metadata..."
bun run generate-pins.ts --count 20 --priority high
if [ $? -ne 0 ]; then
  echo "Error: Failed to generate pins"
  exit 1
fi

echo ""
echo "Step 2: Generating image instructions..."
bun run generate-pin-image.ts --batch

echo ""
echo "Step 3: Scheduling pins for posting..."
bun run post-to-pinterest.ts --schedule --limit 20

echo ""
echo "✅ Pipeline complete!"
echo ""
echo "Next steps:"
echo "1. Review pins in: ../output/pins/"
echo "2. Generate images using prompts in: ../output/pins/images/"
echo "3. Post to Pinterest using metadata in: ../output/scheduled/"
echo ""
echo "To post automatically, configure PINTEREST_ACCESS_TOKEN"
echo "Or use agent-browser for browser automation posting"
