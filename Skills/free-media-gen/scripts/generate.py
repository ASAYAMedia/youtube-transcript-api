#!/usr/bin/env python3
"""
Free Image Generator - Multiple fallback APIs
Usage: python3 generate.py "prompt" [--out path] [--ratio 1:1|16:9|9:16] [--provider gemini|prodia|huggingface]
"""

import os
import sys
import json
import base64
import time
from datetime import datetime
from pathlib import Path
from urllib import request, parse
import urllib.request
import urllib.error
import time

RATIOS = {
    "1:1": (1024, 1024),
    "16:9": (1280, 720),
    "9:16": (720, 1280),
    "4:3": (1024, 768),
    "21:9": (1280, 549),
}

def parse_args():
    args = sys.argv[1:]
    prompt_parts = []
    out = None
    ratio = "1:1"
    provider = None
    
    i = 0
    while i < len(args):
        if args[i] == "--out" and i + 1 < len(args):
            out = args[i + 1]
            i += 2
        elif args[i] == "--ratio" and i + 1 < len(args):
            ratio = args[i + 1]
            i += 2
        elif args[i] == "--provider" and i + 1 < len(args):
            provider = args[i + 1]
            i += 2
        elif not args[i].startswith("--"):
            prompt_parts.append(args[i])
            i += 1
        else:
            i += 1
    
    return {
        "prompt": " ".join(prompt_parts) or "beautiful landscape",
        "out": out,
        "ratio": ratio,
        "provider": provider
    }

def call_gemini(prompt: str, width: int, height: int, api_key: str) -> bytes:
    """Call Gemini API with rate limit retry."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={api_key}"
    
    body = {
        "contents": [{
            "role": "user",
            "parts": [{"text": f"Generate an image: {prompt}"}]
        }],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "temperature": 1.0
        }
    }
    
    req = urllib.request.Request(url, method="POST")
    req.add_header("Content-Type", "application/json")
    
    # Retry loop for rate limits
    for attempt in range(3):
        try:
            data = json.dumps(body).encode()
            with urllib.request.urlopen(req, data=data, timeout=60) as resp:
                result = json.loads(resp.read().decode())
                
                # Extract image from parts
                if "candidates" in result and result["candidates"]:
                    for part in result["candidates"][0].get("content", {}).get("parts", []):
                        if "inlineData" in part:
                            return base64.b64decode(part["inlineData"]["data"])
                        if "image" in str(part):
                            # Check for image data
                            for key, val in part.items():
                                if isinstance(val, str) and len(val) > 1000:
                                    try:
                                        return base64.b64decode(val)
                                    except:
                                        pass
                
                return json.dumps(result, indent=2).encode()
                
        except urllib.error.HTTPError as e:
            if e.code == 429:
                # Rate limited - extract retry delay
                try:
                    err_body = json.loads(e.read().decode())
                    retry_delay = 60
                    for detail in err_body.get("error", {}).get("details", []):
                        if "@type" in detail and "Help" in detail["@type"]:
                            for link in detail.get("links", []):
                                pass
                        if "retryDelay" in str(detail):
                            delay_str = detail.get("retryDelay", "60s")
                            if "s" in delay_str:
                                retry_delay = int(delay_str.replace("s", "")) + 1
                    
                    print(f"    Rate limited. Waiting {retry_delay}s...")
                    time.sleep(min(retry_delay, 120))
                    continue
                except:
                    time.sleep(60)
                    continue
            else:
                raise
    
    raise Exception("Max retries exceeded")


def call_huggingface(prompt: str, width: int, height: int, api_key: str) -> bytes:
    """Call Hugging Face Inference API - FREE no key required for many models."""
    # Using a popular free model
    model = "stabilityai/stable-diffusion-xl-base-1.0"
    url = f"https://api-inference.huggingface.co/models/{model}"
    
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    
    body = {"inputs": prompt}
    
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        if e.code == 503:
            print(f"    Model loading on Hugging Face, waiting...")
            time.sleep(10)
            # Retry once
            with urllib.request.urlopen(req, timeout=120) as resp:
                return resp.read()
        raise

def gemini(prompt: str, ratio: str):
    """Gemini Flash Image - 500/day free"""
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        return {"ok": False, "err": "GEMINI_API_KEY not set. Get free key at https://aistudio.google.com/app/apikey", "source": "gemini"}
    
    try:
        print("  -> gemini (Google AI Studio)...")
        ar = "16:9" if ratio == "16:9" else "9:16" if ratio == "9:16" else "1:1"
        
        data = json.dumps({
            "contents": [{"role": "user", "parts": [{"text": f"Generate an image: {prompt}. Aspect ratio: {ar}."}]}],
            "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
        }).encode()
        
        req = request.Request(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key={key}",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with request.urlopen(req, timeout=60) as res:
            data = json.loads(res.read().decode())
            
        for part in data.get("candidates", [{}])[0].get("content", {}).get("parts", []):
            if part.get("inlineData", {}).get("data"):
                img_data = base64.b64decode(part["inlineData"]["data"])
                return {"ok": True, "data": img_data, "source": "gemini"}
        
        return {"ok": False, "err": "No image in response", "source": "gemini"}
    except Exception as e:
        return {"ok": False, "err": str(e), "source": "gemini"}

def prodia(prompt: str, ratio: str):
    """Prodia - fast SDXL Lightning"""
    key = os.environ.get("PRODIA_API_KEY")
    if not key:
        return {"ok": False, "err": "PRODIA_API_KEY not set", "source": "prodia"}
    
    try:
        print("  -> prodia...")
        w, h = RATIOS.get(ratio, RATIOS["1:1"])
        
        data = json.dumps({
            "prompt": prompt,
            "width": w,
            "height": h,
            "model": "sdxl-lightning",
            "seed": int(time.time() * 1000) % 1000000
        }).encode()
        
        req = request.Request(
            "https://api.prodia.com/v1/generate",
            data=data,
            headers={"X-API-Key": key, "Content-Type": "application/json"},
            method="POST"
        )
        
        with request.urlopen(req, timeout=60) as res:
            result = json.loads(res.read().decode())
        
        if not result.get("url"):
            return {"ok": False, "err": "No URL in response", "source": "prodia"}
        
        # Fetch the image
        with request.urlopen(result["url"], timeout=60) as img_res:
            return {"ok": True, "data": img_res.read(), "source": "prodia"}
            
    except Exception as e:
        return {"ok": False, "err": str(e), "source": "prodia"}

def huggingface(prompt: str, ratio: str):
    """Hugging Face Inference"""
    key = os.environ.get("HF_API_KEY")
    if not key:
        return {"ok": False, "err": "HF_API_KEY not set", "source": "huggingface"}
    
    try:
        print("  -> huggingface (SDXL)...")
        w, h = RATIOS.get(ratio, RATIOS["1:1"])
        
        data = json.dumps({
            "inputs": prompt,
            "parameters": {"width": w, "height": h}
        }).encode()
        
        req = request.Request(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            data=data,
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            method="POST"
        )
        
        with request.urlopen(req, timeout=120) as res:
            return {"ok": True, "data": res.read(), "source": "huggingface"}
            
    except Exception as e:
        return {"ok": False, "err": str(e), "source": "huggingface"}

def local_diffusion(prompt: str, ratio: str):
    """Local Latent Consistency Model - fastest, truly free"""
    try:
        from diffusers import StableDiffusionPipeline
        import torch
        
        width, height = RATIOS[ratio]
        
        # Use CPU-optimized model - LCM is super fast iterative generation
        model_id = "SimianLuo/LCM_Dreamshaper_v7"
        
        print(f"    -> Loading local LCM model (first run downloads ~2GB)...")
        
        pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float32,
            safety_checker=None,
        )
        pipe = pipe.to("cpu")
        
        # LCM uses very few steps for fast generation
        result = pipe(
            prompt,
            num_inference_steps=4,
            guidance_scale=8.0,
            width=width,
            height=height,
        )
        
        img = result.images[0]
        from io import BytesIO
        buf = BytesIO()
        img.save(buf, format="PNG")
        
        return {"ok": True, "data": buf.getvalue(), "source": "local-lcm"}
        
    except Exception as e:
        return {"ok": False, "source": "local-lcm", "err": str(e)}

def main():
    args = parse_args()
    prompt = args["prompt"]
    ratio = args["ratio"]
    provider = args["provider"]
    
    d = datetime.now()
    default_out = f"/home/workspace/Images/{d.strftime('%Y-%m-%d')}-{int(time.time()*1000)}.png"
    output_path = args["out"] or default_out
    
    print(f'Generating: "{prompt}" ({ratio})')
    
    # Provider order based on preference
    providers = {
        "gemini": [gemini, prodia, huggingface],
        "prodia": [prodia, gemini, huggingface],
        "huggingface": [huggingface, gemini, prodia]
    }.get(provider, [gemini, prodia, huggingface])
    
    errors = []
    for fn in providers:
        result = fn(prompt, ratio)
        if result.get("ok") and result.get("data"):
            Path(output_path).parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(result["data"])
            print(f"✅ Saved: {output_path} ({len(result['data'])} bytes via {result['source']})")
            return 0
        errors.append(f"{result.get('source')}: {result.get('err')}")
    
    print("\n❌ All providers failed:")
    print("\n".join(f"   - {e}" for e in errors))
    return 1

if __name__ == "__main__":
    sys.exit(main())
