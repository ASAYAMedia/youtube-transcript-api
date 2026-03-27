#!/usr/bin/env python3
"""
Batch YouTube Transcript Extractor
Tries multiple sources in order:
1. youtube-transcript.io API (if token provided via YTT_API_TOKEN env)
2. yt-dlp --write-auto-subs (YouTube's own captions, best quality)
3. Fallback: yt-dlp --write-subs (any subtitle)
4. youtube-transcript-api (last resort)
"""

import subprocess
import time
import json
import os
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import urllib.request
import urllib.error

BASE_DIR = Path("/home/workspace/Knowledge-Base/affiliate-marketing-dude")
TRANSCRIPTS_DIR = BASE_DIR / "transcripts"
VIDEO_LIST = BASE_DIR / "video_list_full.txt"
API_TOKEN = os.environ.get("YTT_API_TOKEN", "")
PROGRESS_FILE = BASE_DIR / "transcript_progress.json"
MAX_RETRIES = 3
YT_DLP_TIMEOUT = 60  # seconds per video

def load_progress():
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text())
    return {}

def save_progress(progress):
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2))

def load_video_list():
    videos = []
    for line in VIDEO_LIST.read_text().strip().split("\n"):
        if "|||" in line:
            parts = line.split("|||")
            if len(parts) >= 2:
                vid = parts[0].strip()
                title = "|||".join(parts[1:]).strip()
                videos.append((vid, title))
    return videos

def get_transcript_youtubetranscript_io(video_id):
    """Use youtube-transcript.io API if token provided."""
    if not API_TOKEN:
        return None
    try:
        req = urllib.request.Request(
            "https://www.youtube-transcript.io/api/transcripts",
            data=json.dumps({"ids": [video_id]}).encode(),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {API_TOKEN}"
            },
            method="POST"
        )
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read().decode())
        if data.get("transcripts") and video_id in data["transcripts"]:
            return data["transcripts"][video_id].get("text", "")
    except Exception as e:
        pass
    return None

def get_transcript_ytdlp(video_id, title=""):
    """Use yt-dlp to get subtitles from YouTube directly."""
    out_template = str(TRANSCRIPTS_DIR / f"{video_id}.%(ext)s")
    
    # Try auto-generated subs first (YouTube's ASR captions)
    for sub_type in ["--write-auto-subs", "--write-subs"]:
        for fmt in ["srv1", "srv2", "srv3", "vtt", "ttml", "json3"]:
            result = _try_ytdlp_format(video_id, out_template, sub_type, fmt)
            if result:
                return result
    return None

def _try_ytdlp_format(video_id, out_template, sub_type, fmt):
    """Try one yt-dlp format combination."""
    output_dir = TRANSCRIPTS_DIR
    output_dir.mkdir(exist_ok=True)
    
    args = [
        "yt-dlp",
        sub_type,
        "--sub-langs", "en",
        "--sub-format", fmt,
        "--skip-download",
        "--no-playlist",
        "--sleep-requests", "1",
        "--no-warnings",
        "-o", out_template,
        f"https://www.youtube.com/watch?v={video_id}"
    ]
    
    try:
        result = subprocess.run(
            args,
            capture_output=True,
            text=True,
            timeout=YT_DLP_TIMEOUT,
            env={**os.environ, "HOME": "/root"}
        )
        
        # Look for the output file
        for ext in ["vtt", "srv1", "srv2", "srv3", "ttml", "json3"]:
            potential = TRANSCRIPTS_DIR / f"{video_id}.{ext}"
            if potential.exists():
                content = potential.read_text(encoding="utf-8")
                if len(content) > 100:
                    # Parse to plain text
                    text = parse_subtitle_to_text(content, ext)
                    if text:
                        return text
    except Exception:
        pass
    return None

def parse_subtitle_to_text(content, ext):
    """Convert subtitle formats to plain text."""
    if ext == "json3":
        try:
            data = json.loads(content)
            if isinstance(data, list):
                return " ".join(item.get("text", "") for item in data if item.get("text"))
        except:
            pass
    elif ext == "vtt":
        import re
        # Remove WEBVTT header and timestamps, keep text
        lines = content.split("\n")
        text_lines = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith("WEBVTT") and not line.startswith("NOTE") and not re.match(r"^\d{2}:\d{2}", line) and "-->" not in line:
                text_lines.append(line)
        return " ".join(text_lines)
    else:
        # For srv/ttml, try simple tag stripping
        import re
        text = re.sub(r"<[^>]+>", "", content)
        text = re.sub(r"\s+", " ", text).strip()
        return text
    return content if len(content) > 50 else ""

def process_video(vid_title, progress, index, total):
    video_id, title = vid_title
    if video_id in progress and progress[video_id].get("done"):
        return video_id, None, "skipped"
    
    print(f"[{index}/{total}] {video_id}: {title[:50]}...")
    
    # Try sources in order
    sources = [
        ("ytt_api", lambda: get_transcript_youtubetranscript_io(video_id)),
        ("ytdlp", lambda: get_transcript_ytdlp(video_id, title)),
    ]
    
    for source_name, getter in sources:
        try:
            text = getter()
            if text and len(text) > 100:
                progress[video_id] = {"done": True, "source": source_name, "chars": len(text)}
                save_progress(progress)
                print(f"  ✓ Got {len(text)} chars from {source_name}")
                return video_id, text, "success"
        except Exception as e:
            print(f"  ✗ {source_name}: {e}")
    
    progress[video_id] = {"done": False, "error": "no source worked"}
    save_progress(progress)
    return video_id, None, "failed"

def main():
    TRANSCRIPTS_DIR.mkdir(exist_ok=True)
    videos = load_video_list()
    total = len(videos)
    print(f"Total videos: {total}")
    
    progress = load_progress()
    done = sum(1 for v in progress.values() if v.get("done"))
    print(f"Already done: {done}/{total}")
    
    for i, vid_title in enumerate(videos, 1):
        video_id, title = vid_title
        result = process_video(vid_title, progress, i, total)
        
        # Rate limit between requests
        time.sleep(2)
    
    # Final stats
    final_progress = load_progress()
    success = sum(1 for v in final_progress.values() if v.get("done"))
    print(f"\n=== Final: {success}/{total} transcripts obtained ===")

if __name__ == "__main__":
    main()
