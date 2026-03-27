#!/usr/bin/env bun
/**
 * Generate Pinterest pin images using AI
 * Usage: bun generate-pin-image.ts --pin gradient-generator-1
 *        bun generate-pin-image.ts --batch
 */

import { parseArgs } from "util";
import { readFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    pin: { type: "string" },
    batch: { type: "boolean" },
    all: { type: "boolean" },
  },
});

const PINS_DIR = "/home/workspace/Skills/pinterest-automation/output/pins";
const IMAGES_DIR = "/home/workspace/Skills/pinterest-automation/output/pins/images";

async function generateImageForPin(pinId: string, metadata: any): Promise<string> {
  // Ensure directory exists
  const fs = await import("fs");
  const { join, dirname } = await import("path");
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  
  const imagePath = join(IMAGES_DIR, `${pinId}.png`);
  
  // Prompt focused on visual appeal for Pinterest
  const prompt = metadata.imagePrompt || `Pinterest pin design for "${metadata.toolName}" tool. Modern dark tech aesthetic with glass morphism card on deep black background. Clean minimalist design. Vibrant ${metadata.category === 'Color' ? 'rainbow' : metadata.category === 'Developer' ? 'emerald' : 'purple'} gradient glow accents. Typography placeholder area. Professional tool branding. Aspect ratio 2:3 portrait.`;
  
  console.log(`  Generating: ${pinId}.png`);
  console.log(`  Prompt: ${prompt.substring(0, 100)}...`);
  
  // Save instruction file
  const instructionPath = join(IMAGES_DIR, `${pinId}-prompt.txt`);
  const content = `# Pin Image Generation Instructions
Pin ID: ${pinId}
Tool: ${metadata.toolName}
Category: ${metadata.category}

PROMPT:
${prompt}

DESIGN NOTES:
- Dimensions: 1000x1500px (2:3 ratio)
- Style: Dark modern, glass morphism
- Background: Deep black with subtle gradient
- Text overlay area: Center 40%
- Brand: tinytoolbox.co (watermark corner)
- Colors: Match ${metadata.category} category
`;
  
  fs.writeFileSync(instructionPath, content);
  
  // Call generate_image tool here in actual implementation
  // For now, mark as needing manual generation
  console.log(`  ⏳ Image instructions saved to: ${instructionPath}`);
  return instructionPath;
}

async function generateBatchImages() {
  const fs = await import("fs");
  
  if (!existsSync(PINS_DIR)) {
    console.error("Error: No pins directory found. Run generate-pins.ts first.");
    process.exit(1);
  }
  
  if (!existsSync(IMAGES_DIR)) {
    mkdirSync(IMAGES_DIR, { recursive: true });
  }
  
  const files = readdirSync(PINS_DIR).filter(f => f.endsWith(".json") && !f.startsWith("_"));
  console.log(`Found ${files.length} pin metadata files\n`);
  
  let generated = 0;
  let skipped = 0;
  
  for (const file of files) {
    const pinId = file.replace(".json", "");
    const metadata = JSON.parse(readFileSync(join(PINS_DIR, file), "utf-8"));
    
    // Skip if image already requested/generated
    const instructionPath = join(IMAGES_DIR, `${pinId}-prompt.txt`);
    if (existsSync(instructionPath)) {
      skipped++;
      continue;
    }
    
    await generateImageForPin(pinId, metadata);
    generated++;
    
    // Rate limiting consideration
    if (generated >= 20) {
      console.log("\n⚠️ Batch limit reached (20). Run again for more.");
      break;
    }
  }
  
  console.log(`\n✅ Generated ${generated} image instructions, skipped ${skipped} existing`);
  console.log(`\nView prompts in: ${IMAGES_DIR}/`);
  console.log("\nTo generate actual images:");
  console.log("  Option 1: Use generate_image tool with prompts above");
  console.log("  Option 2: Open prompts in Canva/Figma and design manually");
}

async function generateSingleImage() {
  if (!values.pin) {
    console.error("Error: --pin required for single image generation");
    process.exit(1);
  }
  
  const pinPath = join(PINS_DIR, `${values.pin}.json`);
  if (!existsSync(pinPath)) {
    console.error(`Error: Pin metadata not found: ${pinPath}`);
    process.exit(1);
  }
  
  const metadata = JSON.parse(readFileSync(pinPath, "utf-8"));
  const instructionPath = await generateImageForPin(values.pin!, metadata);
  console.log(`\n✅ Image instructions saved: ${instructionPath}`);
}

// Main
if (values.batch || values.all) {
  generateBatchImages();
} else if (values.pin) {
  generateSingleImage();
} else {
  console.log("Usage:");
  console.log("  bun generate-pin-image.ts --pin <pin-id>      # Single pin");
  console.log("  bun generate-pin-image.ts --batch             # Generate up to 20");
  console.log("  bun generate-pin-image.ts --all               # All (respects limits)");
  console.log("\nExample pin IDs:");
  
  // Show some example IDs
  try {
    const fs = await import("fs");
    const files = fs.readdirSync(PINS_DIR).filter(f => f.endsWith(".json") && !f.startsWith("_"));
    files.slice(0, 5).forEach(f => console.log(`  - ${f.replace(".json", "")}`));
    if (files.length > 5) console.log(`  ... and ${files.length - 5} more`);
  } catch {}
}
