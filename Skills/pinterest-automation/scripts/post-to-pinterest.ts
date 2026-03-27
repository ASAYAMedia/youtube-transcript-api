#!/usr/bin/env bun
/**
 * Post pins to Pinterest via API or browser automation
 * Usage: bun post-to-pinterest.ts --schedule --limit 10
 */

import { parseArgs } from "util";
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    schedule: { type: "boolean" },
    limit: { type: "string", default: "10" },
    info: { type: "string" },
  },
});

const PINS_DIR = "/home/workspace/Skills/pinterest-automation/output/pins";
const SCHEDULED_DIR = "/home/workspace/Skills/pinterest-automation/output/scheduled";

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
  "default": "TinyToolbox Tools"
};

async function schedulePins(limit: number) {
  const fs = await import("fs");
  
  if (!existsSync(SCHEDULED_DIR)) mkdirSync(SCHEDULED_DIR, { recursive: true });
  
  const files = readdirSync(PINS_DIR).filter(f => f.endsWith(".json") && !f.startsWith("_"));
  let scheduled = 0;
  
  for (const file of files.slice(0, limit)) {
    const pinId = file.replace(".json", "");
    const scheduledPath = join(SCHEDULED_DIR, file);
    
    if (existsSync(scheduledPath)) continue;
    
    const metadata = JSON.parse(readFileSync(join(PINS_DIR, file), "utf-8"));
    metadata.board = BOARD_MAP[metadata.category] || BOARD_MAP["default"];
    metadata.scheduledAt = new Date().toISOString();
    metadata.status = "scheduled";
    
    writeFileSync(scheduledPath, JSON.stringify(metadata, null, 2));
    scheduled++;
    console.log(`Scheduled: ${pinId} → ${metadata.board}`);
  }
  
  console.log(`\nScheduled ${scheduled} pins to ${SCHEDULED_DIR}/`);
}

async function showPinInfo(pinId: string) {
  const pinPath = join(PINS_DIR, `${pinId}.json`);
  if (!existsSync(pinPath)) {
    console.error(`Pin not found: ${pinId}`);
    return;
  }
  
  const meta = JSON.parse(readFileSync(pinPath, "utf-8"));
  console.log(`\n=== ${pinId} ===\n`);
  console.log(`Title: ${meta.title}`);
  console.log(`Board: ${BOARD_MAP[meta.category] || BOARD_MAP["default"]}`);
  console.log(`Link: ${meta.link}`);
  console.log(`\nDescription:\n${meta.description}\n`);
}

// Main
if (values.schedule) {
  schedulePins(parseInt(values.limit || "10"));
} else if (values.info) {
  showPinInfo(values.info);
} else {
  console.log("Pinterest Posting Tool\n");
  console.log("Usage:");
  console.log("  bun post-to-pinterest.ts --schedule --limit 10");
  console.log("  bun post-to-pinterest.ts --info gradient-generator-1");
}
