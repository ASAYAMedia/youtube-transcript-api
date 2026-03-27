#!/usr/bin/env bun

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";

interface GenResult {
  ok: boolean;
  data?: Buffer;
  source?: string;
  err?: string;
}

const RATIOS: Record<string, { w: number; h: number }> = {
  "1:1": { w: 1024, h: 1024 },
  "16:9": { w: 1280, h: 720 },
  "9:16": { w: 720, h: 1280 },
  "4:3": { w: 1024, h: 768 },
  "21:9": { w: 1280, h: 549 },
};

function getArgs() {
  const args = process.argv.slice(2);
  const promptParts: string[] = [];
  let out: string | undefined;
  let ratio = "1:1";
  let provider: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--out" && args[i + 1]) { out = args[i + 1]; i++; }
    else if (args[i] === "--ratio" && args[i + 1]) { ratio = args[i + 1]; i++; }
    else if (args[i] === "--provider" && args[i + 1]) { provider = args[i + 1]; i++; }
    else if (!args[i].startsWith("--")) promptParts.push(args[i]);
  }
  return { prompt: promptParts.join(" ") || "landscape", out, ratio, provider };
}

async function pollinations(prompt: string, ratio: string): Promise<GenResult> {
  try {
    const dim = RATIOS[ratio] || RATIOS["1:1"];
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${dim.w}&height=${dim.h}&seed=${seed}&nologo=true`;
    console.log("  -> pollinations.ai...");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`status ${res.status}`);
    return { ok: true, data: Buffer.from(await res.arrayBuffer()), source: "pollinations" };
  } catch (e) {
    return { ok: false, err: String(e), source: "pollinations" };
  }
}

async function gemini(prompt: string, ratio: string): Promise<GenResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, err: "GEMINI_API_KEY not set", source: "gemini" };
  try {
    console.log("  -> gemini...");
    const ar = ratio === "16:9" ? "16:9" : ratio === "9:16" ? "9:16" : "1:1";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${prompt}. Aspect ratio ${ar}.` }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    for (const part of data.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        return { ok: true, data: Buffer.from(part.inlineData.data, "base64"), source: "gemini" };
      }
    }
    throw new Error("no image in response");
  } catch (e) {
    return { ok: false, err: String(e), source: "gemini" };
  }
}

async function huggingface(prompt: string, ratio: string): Promise<GenResult> {
  const key = process.env.HF_API_KEY;
  if (!key) return { ok: false, err: "HF_API_KEY not set", source: "huggingface" };
  try {
    console.log("  -> huggingface...");
    const dim = RATIOS[ratio] || RATIOS["1:1"];
    const res = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt, parameters: { width: dim.w, height: dim.h } }),
      }
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    return { ok: true, data: Buffer.from(await res.arrayBuffer()), source: "huggingface" };
  } catch (e) {
    return { ok: false, err: String(e), source: "huggingface" };
  }
}

async function main() {
  const { prompt, out, ratio, provider } = getArgs();
  const d = new Date();
  const defaultOut = `/home/workspace/Images/${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}-${Date.now()}.png`;
  const outputPath = out || defaultOut;

  console.log(`Generating: "${prompt}" (${ratio})`);
  
  const providers = provider === "gemini" ? [gemini, pollinations, huggingface]
    : provider === "huggingface" ? [huggingface, pollinations, gemini]
    : [pollinations, gemini, huggingface];

  const errors: string[] = [];
  for (const fn of providers) {
    const result = await fn(prompt, ratio);
    if (result.ok && result.data) {
      const dir = dirname(outputPath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(outputPath, result.data);
      console.log(`✅ Saved to: ${outputPath} (via ${result.source})`);
      process.exit(0);
    }
    errors.push(`${result.source}: ${result.err}`);
  }

  console.error("❌ All providers failed:");
  errors.forEach(e => console.error(`   - ${e}`));
  process.exit(1);
}

main();
