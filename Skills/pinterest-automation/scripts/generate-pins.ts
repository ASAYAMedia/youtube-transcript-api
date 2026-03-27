#!/usr/bin/env bun
/**
 * Generate Pinterest pins from TinyToolbox tools
 * Usage: bun generate-pins.ts --count 10 --priority high
 */

import { parseArgs } from "util";

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
}

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    count: { type: "string", default: "10" },
    priority: { type: "string", default: "auto" },
    category: { type: "string" },
    tool: { type: "string" },
  },
});

const PIN_TITLES: Record<string, string[]> = {
  "Color": ["Free {name} — Perfect Palettes in Seconds", "{name} — Design Like a Pro", "Beautiful Gradients in 10 Seconds"],
  "Developer": ["Free {name} — Stop Debugging Manually", "{name} — Coded in 10 Seconds", "The Only {category} Tool You'll Ever Need"],
  "Text": ["Free {name} — Copy & Paste Magic", "Stand Out on Social With This Free Tool", "Make Your Text Fancy — Free Generator"],
  "Finance": ["Free {name} — Know Your Numbers", "This Free Tool Could Save You $1000s", "Plan Your Future — Free {category} Tool"],
  "SEO": ["Rank #1 With This Free {name}", "{name} — Dominate Search Results", "SEO Pros Use This Free {category} Tool"],
  "Converter": ["Free {name} — Instant Conversion", "Convert Anything to Anything — Free", "Fastest {category} Converter Online"],
  "default": ["Free {name} — Try It Now", "Stop [Problem] — Try Free {category}", "Best Free {category} Tool Online"]
};

const HASHTAGS: Record<string, string[]> = {
  "Color": ["#design", "#webdesign", "#colorpalette", "#css", "#gradients"],
  "Developer": ["#developer", "#coding", "#webdev", "#javascript", "#programming"],
  "Text": ["#text", "#socialmedia", "#fonts", "#textgenerator", "#social"],
  "Finance": ["#finance", "#money", "#budget", "#savings", "#calculator"],
  "SEO": ["#seo", "#marketing", "#google", "#digitalmarketing", "#ranking"],
  "default": ["#tools", "#free", "#productivity", "#online", "#browser"]
};

// Extract tools from lib/tools.ts
async function loadTools(): Promise<Tool[]> {
  const fs = await import("fs");
  const path = "/home/workspace/tinytoolbox-github/lib/tools.ts";
  
  if (!fs.existsSync(path)) {
    console.error("Error: lib/tools.ts not found at " + path);
    process.exit(1);
  }
  
  const content = fs.readFileSync(path, "utf-8");
  
  // Parse TOOLS array entries
  const tools: Tool[] = [];
  const entryMatches = content.matchAll(/\{\s*slug:\s*['"]([^'"]+)['"][^}]*name:\s*['"]([^'"]+)['"][^}]*description:\s*['"]([^'"]+)['"][^}]*category:\s*['"]([^'"]+)['"]/g);
  
  for (const match of entryMatches) {
    tools.push({
      slug: match[1],
      name: match[2],
      description: match[3],
      category: match[4]
    });
  }
  
  return tools;
}

function generatePinData(tool: Tool, variant: number): { title: string; description: string; imagePrompt: string } {
  const category = tool.category || "default";
  const titles = PIN_TITLES[category] || PIN_TITLES["default"];
  const hashtags = HASHTAGS[category] || HASHTAGS["default"];
  
  const titleTemplate = titles[variant % titles.length];
  const title = titleTemplate.replace(/{name}/g, tool.name).replace(/{category}/g, category);
  
  const description = `${tool.description} Try this free online tool — fast, no signup required. Perfect for ${category.toLowerCase()} tasks. ${hashtags.slice(0, 3).join(" ")}`;
  
  const imagePrompt = `Pinterest pin for "${tool.name}" ${category} tool. Dark modern aesthetic with gradient accents. Clean typography "${title.substring(0, 50)}" on black background. Glass morphism card style. Minimalist tech design. No text in image itself, just UI mockup. Category color: ${category === "Color" ? "rainbow gradient" : category === "Developer" ? "green/cyan" : "purple/blue"}.`;
  
  return { title, description, imagePrompt };
}

async function generatePins() {
  const tools = await loadTools();
  console.log(`Loaded ${tools.length} tools`);
  
  const count = parseInt(values.count || "10");
  const filterCategory = values.category;
  const singleTool = values.tool;
  
  let filteredTools = tools;
  if (singleTool) {
    filteredTools = tools.filter(t => t.slug === singleTool || t.name.toLowerCase().includes(singleTool.toLowerCase()));
  } else if (filterCategory) {
    filteredTools = tools.filter(t => t.category.toLowerCase() === filterCategory.toLowerCase());
  }
  
  const selectedTools = filteredTools.slice(0, count);
  console.log(`\nGenerating pins for ${selectedTools.length} tools:\n`);
  
  const fs = await import("fs");
  const { join } = await import("path");
  
  const outputDir = "/home/workspace/Skills/pinterest-automation/output/pins";
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  const metadata: any[] = [];
  
  for (const tool of selectedTools) {
    const variants = values.priority === "high" ? 5 : values.priority === "medium" ? 3 : 1;
    
    for (let v = 0; v < variants; v++) {
      const pinData = generatePinData(tool, v);
      const pinId = `${tool.slug}-${v + 1}`;
      
      // Save metadata JSON
      const metaPath = join(outputDir, `${pinId}.json`);
      fs.writeFileSync(metaPath, JSON.stringify({
        id: pinId,
        toolSlug: tool.slug,
        toolName: tool.name,
        category: tool.category,
        ...pinData,
        createdAt: new Date().toISOString(),
        status: "ready",
        board: tool.category,
        link: `https://www.tinytoolbox.co/tools/${tool.slug}`
      }, null, 2));
      
      console.log(`  Generated: ${pinId}.json`);
      console.log(`    Title: ${pinData.title.substring(0, 60)}...`);
      metadata.push({ id: pinId, title: pinData.title, category: tool.category });
    }
  }
  
  // Save batch metadata
  fs.writeFileSync(
    join(outputDir, "_batch-metadata.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), count: metadata.length, pins: metadata }, null, 2)
  );
  
  console.log(`\n✅ Generated ${metadata.length} pin metadata files in ${outputDir}/`);
  console.log(`\nNext steps:`);
  console.log(`1. Generate images: bun run generate-pin-image.ts`);
  console.log(`2. Review pins in: ${outputDir}/`);
  console.log(`3. Schedule posting: bun run schedule-pins.ts`);
}

generatePins().catch(console.error);
