#!/usr/bin/env bun
/**
 * Pinterest Browser Poster
 * Creates automation scripts for manual pin posting
 * 
 * Usage: bun browser-poster.ts --pin gradient-generator-1
 *        bun browser-poster.ts --dry-run
 */

import { parseArgs } from "util";
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    pin: { type: "string" },
    "dry-run": { type: "boolean" },
    list: { type: "boolean" },
  },
});

const PINS_DIR = "/home/workspace/Skills/pinterest-automation/output/pins";
const SCHEDULED_DIR = "/home/workspace/Skills/pinterest-automation/output/scheduled";
const LOGS_DIR = "/home/workspace/Skills/pinterest-automation/output/logs";

interface PinData {
  id: string;
  title: string;
  description: string;
  link: string;
  board: string;
}

const BOARD_MAP: Record<string, string> = {
  "Developer": "Developer Tools",
  "Color": "Design Resources", 
  "SEO": "SEO & Marketing",
  "Finance": "Finance Calculators",
  "Health": "Health Tools",
  "Converter": "Unit Converters",
  "Text": "Text Generators",
  "Security": "Security Tools",
  "Utility": "Productivity Hacks",
  "Social": "Social Media Tools",
  "Games": "Free Online Games",
  "Math": "Math Calculators",
  "Time": "Time Tools",
  "default": "TinyToolbox Free Tools"
};

function getPinData(pinId: string): PinData | null {
  const paths = [
    join(SCHEDULED_DIR, `${pinId}.json`),
    join(PINS_DIR, `${pinId}.json`)
  ];
  
  for (const path of paths) {
    if (existsSync(path)) {
      const data = JSON.parse(readFileSync(path, "utf-8"));
      const category = data.category || "default";
      return {
        id: pinId,
        title: data.title || data.name,
        description: data.description,
        link: data.link || `https://tinytoolbox.co/tools/${data.toolSlug || data.slug}`,
        board: data.board || BOARD_MAP[category] || BOARD_MAP["default"]
      };
    }
  }
  return null;
}

function createScript(pin: PinData): string {
  return `#!/bin/bash
# Pinterest Post Script: ${pin.id}
# Generated: ${new Date().toISOString()}

echo "Opening Pinterest pin builder..."

# Create pin via agent-browser (requires login first)
agent-browser open "https://www.pinterest.com/pin-builder/"

sleep 2
echo "Pin ready to create:"
echo "  Title: ${pin.title.replace(/"/g, '\\"')}"
echo "  Board: ${pin.board}"
echo "  Link: ${pin.link}"

echo ""
echo "Copy to clipboard:"
echo "  Title: ${pin.title}"
echo "  Description: ${pin.description}"
`;
}

// List available pins
async function listPins() {
  const dirs = [SCHEDULED_DIR, PINS_DIR];
  const pins: PinData[] = [];
  
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"));
    for (const file of files) {
      const pin = getPinData(file.replace(".json", ""));
      if (pin) pins.push(pin);
    }
  }
  
  console.log(`\n📌 ${pins.length} Pins Ready\n`);
  pins.slice(0, 10).forEach(p => {
    console.log(`  ${p.id}`);
    console.log(`    → ${p.board}`);
  });
  if (pins.length > 10) console.log(`  ... and ${pins.length - 10} more`);
  console.log("");
}

// Show single pin details and script
async function showPin(pinId: string, dryRun: boolean = false) {
  const pin = getPinData(pinId);
  if (!pin) {
    console.error(`❌ Pin not found: ${pinId}`);
    return;
  }
  
  console.log(`\n📌 ${pin.id}\n`);
  console.log(`Title:       ${pin.title}`);
  console.log(`Board:       ${pin.board}`);
  console.log(`Link:        ${pin.link}`);
  console.log(`\nDescription:`);
  console.log(pin.description);
  
  if (dryRun) {
    console.log(`\n[DRY RUN - showing script]`);
    console.log(createScript(pin));
    return;
  }
  
  // Save script
  if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });
  const scriptPath = join(LOGS_DIR, `post-${pin.id}.sh`);
  writeFileSync(scriptPath, createScript(pin), { mode: 0o755 });
  console.log(`\n✅ Script saved: ${scriptPath}`);
  
  console.log(`\n📋 QUICK POST GUIDE:`);
  console.log(`  1. Open: https://www.pinterest.com/pin-builder/`);
  console.log(`  2. Title: ${pin.title.slice(0, 60)}...`);
  console.log(`  3. Description: ${pin.description.slice(0, 80)}...`);
  console.log(`  4. Link: ${pin.link}`);
  console.log(`  5. Board: ${pin.board}`);
  console.log(`  6. Add image (upload or let Pinterest fetch OG)`);
}

// Main
if (values.list) {
  listPins();
} else if (values.pin) {
  showPin(values.pin, values["dry-run"] ?? false);
} else {
  console.log("Pinterest Browser Poster\n");
  console.log("Usage:");
  console.log("  bun browser-poster.ts --list");
  console.log("  bun browser-poster.ts --pin gradient-generator-1");
  console.log("  bun browser-poster.ts --pin gradient-generator-1 --dry-run");
}
