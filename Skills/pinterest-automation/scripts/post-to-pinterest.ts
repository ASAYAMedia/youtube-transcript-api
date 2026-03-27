#!/usr/bin/env bun
/**
 * Post pins to Pinterest via API
 * Usage: bun post-to-pinterest.ts --test
 *        bun post-to-pinterest.ts --post-board "Developer Tools" --limit 3
 */

import { parseArgs } from "util";
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    test: { type: "boolean" },
    "post-board": { type: "string" },
    limit: { type: "string", default: "3" },
  },
});

const PINTEREST_API_KEY = process.env.PINTEREST_API_KEY;
const PINTEREST_API_BASE = "https://api.pinterest.com/v5";

async function testConnection() {
  if (!PINTEREST_API_KEY) {
    console.error("❌ PINTEREST_API_KEY not set");
    return;
  }
  
  console.log("Testing Pinterest API connection...\n");
  
  try {
    const resp = await fetch(`${PINTEREST_API_BASE}/user_account`, {
      headers: { "Authorization": `Bearer ${PINTEREST_API_KEY}` }
    });
    
    if (!resp.ok) {
      console.error(`❌ Auth failed: HTTP ${resp.status}`);
      return;
    }
    
    const user = await resp.json();
    console.log(`✅ Connected as: ${user.username || user.id}`);
    
    // Get boards
    const boardsResp = await fetch(`${PINTEREST_API_BASE}/boards`, {
      headers: { "Authorization": `Bearer ${PINTEREST_API_KEY}` }
    });
    
    if (!boardsResp.ok) {
      console.log("No boards found or insufficient permissions");
      return;
    }
    
    const boards = await boardsResp.json();
    console.log(`📌 Boards: ${boards.items?.length || 0}`);
    boards.items?.forEach((b: any) => console.log(`   - ${b.name}`));
    
  } catch (e) {
    console.error("❌ Connection failed:", (e as Error).message);
  }
}

// Main
if (values.test) {
  testConnection();
} else {
  console.log("Pinterest API Tool\n");
  console.log("Usage:");
  console.log("  bun post-to-pinterest.ts --test");
  console.log("\nAPI Key:", PINTEREST_API_KEY ? "✅ Loaded" : "❌ Not set");
}
