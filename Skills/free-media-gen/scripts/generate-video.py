#!/usr/bin/env python3
"""
Free Video Generator - Using available free APIs
Note: Free video generation is much more limited. 
Current options:
- Hugging Face (very slow, queued)
- Replicate free tier (some models)
"""

import os
import sys
import json
import time
from datetime import datetime
from pathlib import Path
from urllib import request

def parse_args():
    args = sys.argv[1:]
    prompt_parts = []
    out = None
    
    i = 0
    while i < len(args):
        if args[i] == "--out" and i + 1 < len(args):
            out = args[i + 1]
            i += 2
        else:
            prompt_parts.append(args[i])
            i += 1
    
    return {
        "prompt": " ".join(prompt_parts) or "a beautiful landscape",
        "out": out
    }

def huggingface_video(prompt: str):
    """
    Use Hugging Face for video generation.
    Note: Video models are slow and often queued.
    Model: AnimateDiff or similar light video models
    """
    key = os.environ.get("HF_API_KEY")
    if not key:
        return {"ok": False, "err": "HF_API_KEY not set", "source": "huggingface"}
    
    try:
        print("  -> huggingface video (this may take several minutes)...")
        print("     (Video generation is slow on free tier - expect 2-5 min)")
        
        # Using a lighter video model like damo-vilab/text-to-video-ms-1.7b
        data = json.dumps({"inputs": prompt}).encode()
        
        req = request.Request(
            "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",
            data=data,
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            method="POST"
        )
        
        # Video models are slow - longer timeout
        with request.urlopen(req, timeout=300) as res:
            return {"ok": True, "data": res.read(), "source": "huggingface"}
            
    except Exception as e:
        return {"ok": False, "err": str(e), "source": "huggingface"}

def main():
    args = parse_args()
    prompt = args["prompt"]
    
    d = datetime.now()
    default_out = f"/home/workspace/Videos/{d.strftime('%Y-%m-%d')}-{int(time.time()*1000)}.mp4"
    output_path = args["out"] or default_out
    
    print(f'Generating video: "{prompt}"')
    print("Warning: Free video generation is very limited and slow...")
    print("")
    
    result = hugginggingface_video(prompt)
    
    if result.get("ok") and result.get("data"):
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(result["data"])
        print(f"✅ Saved: {output_path} ({len(result['data'])} bytes via {result['source']})")
        return 0
    
    print(f"\n❌ Failed: {result.get('err')}")
    print("\nNote: Free video generation APIs are very limited.")
    print("Consider these alternatives:")
    print("  - Runway ML (paid but high quality)")
    print("  - Pika Labs (paid)")
    print("  - Stable Video Diffusion (self-hosted)")
    return 1

if __name__ == "__main__":
    sys.exit(main())
