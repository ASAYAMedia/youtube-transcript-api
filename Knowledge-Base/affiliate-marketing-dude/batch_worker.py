#!/usr/bin/env python3
"""
Parallel Transcript Extraction via Zo Ask API + Browser Sessions
Spawns multiple child agents, each using a browser session to extract transcripts.
"""
import requests, json, os, sys, time
from pathlib import Path

MODEL = "vercel:minimax/minimax-m2.7"
ZO_API = "https://api.zo.computer/zo/ask"
TOKEN = os.environ["ZO_CLIENT_IDENTITY_TOKEN"]

BASE_DIR = Path("/home/workspace/Knowledge-Base/affiliate-marketing-dude")
TRANSCRIPT_DIR = BASE_DIR / "transcripts"
TRANSCRIPT_DIR.mkdir(exist_ok=True)
PROGRESS_FILE = BASE_DIR / "transcripts_progress.json"

def load_done():
    if PROGRESS_FILE.exists():
        return set(json.loads(PROGRESS_FILE.read_text()))
    return set()

def save_done(done):
    PROGRESS_FILE.write_text(json.dumps(list(done)))

def load_all_videos():
    videos = []
    for line in (BASE_DIR / "video_list_full.txt").read_text().strip().split("\n"):
        if "|||" not in line:
            continue
        parts = line.split("|||")
        vid = parts[0].strip()
        title = "|||".join(parts[1:]).strip()
        videos.append({"id": vid, "title": title})
    return videos

def make_worker_prompt(video_batch):
    """Build the system prompt for a child worker."""
    video_list_str = "\n".join([f"{v['id']} | {v['title']}" for v in video_batch])
    return f"""You are extracting YouTube transcripts for videos from the Affiliate Marketing Dude channel.

Your task: Navigate to EACH video below, extract the FULL transcript, and save each one to a file.

IMPORTANT RULES:
- Use the browser: open_webpage -> view_webpage -> use_webpage workflow
- For each video: navigate to https://www.youtube.com/watch?v=VIDEO_ID
- Wait for page to load, then look for "Show transcript" button (usually in the row below the video player, or in the "More" menu)
- Click "Show transcript" to open the transcript panel
- Extract ALL transcript text from the panel (it's in ytd-transcript-segment-list-renderer or similar)
- Save the full transcript to: /home/workspace/Knowledge-Base/affiliate-marketing-dude/transcripts/VIDEO_ID.txt
- Format: just the plain transcript text, one continuous block
- If a video has NO transcript button or no captions available, create an empty file with just "NO_TRANSCRIPT" as content
- Keep going through ALL videos in the list — don't stop at the first failure

Videos to process:
{video_list_str}

After processing ALL videos, also write a summary to /home/workspace/Knowledge-Base/affiliate-marketing-dude/transcripts/BATCH_STATUS.json
containing: {{"processed": ["video_id_1", "video_id_2", ...], "failed": ["video_id_1", ...]}}

Start NOW with the first video. Process ALL videos in the list above."""

def spawn_worker(videos, worker_id):
    """Spawn a child Zo agent to process a batch of videos."""
    payload = {
        "input": make_worker_prompt(videos),
        "model_name": MODEL,
    }
    resp = requests.post(
        ZO_API,
        headers={
            "Authorization": TOKEN,
            "Content-Type": "application/json"
        },
        json=payload,
        timeout=60
    )
    result = resp.json()
    print(f"Worker {worker_id}: Started child session")
    return result

def main():
    all_videos = load_all_videos()
    done = load_done()
    remaining = [v for v in all_videos if v["id"] not in done]
    
    print(f"Total: {len(all_videos)} | Done: {len(done)} | Remaining: {len(remaining)}")
    
    if not remaining:
        print("All done!")
        return
    
    # Split into batches of 20
    BATCH_SIZE = 20
    batches = [remaining[i:i+BATCH_SIZE] for i in range(0, len(remaining), BATCH_SIZE)]
    print(f"Split into {len(batches)} batches of ~{BATCH_SIZE} videos each")
    
    # Spawn first batch of workers (limit concurrency to 5)
    import concurrent.futures
    
    for batch_idx, batch in enumerate(batches):
        print(f"\n--- Spawning batch {batch_idx+1}/{len(batches)} ({len(batch)} videos) ---")
        spawn_worker(batch, batch_idx)
        
        # Rate limit: spawn max 3 at a time
        if (batch_idx + 1) % 3 == 0:
            print(f"Pausing 30s between spawn waves...")
            time.sleep(30)
    
    print(f"\nAll {len(batches)} workers spawned!")
    print(f"Progress will be saved to {PROGRESS_FILE}")

if __name__ == "__main__":
    main()
