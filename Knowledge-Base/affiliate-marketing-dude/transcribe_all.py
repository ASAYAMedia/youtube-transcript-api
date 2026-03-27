#!/usr/bin/env python3
"""
Background YouTube Transcript Extractor using Playwright
Uses the Steel browser session to extract transcripts from all 449 videos.
Processes in batches, saves progress, resumes on restart.
"""
import subprocess, json, sys, time, re, os, signal
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

BASE_DIR = Path("/home/workspace/Knowledge-Base/affiliate-marketing-dude")
TRANSCRIPT_DIR = BASE_DIR / "transcripts"
TRANSCRIPT_DIR.mkdir(exist_ok=True)
PROGRESS_FILE = BASE_DIR / "transcripts_progress.json"
LOG_FILE = BASE_DIR / "transcripts.log"

VIDEO_LIST = BASE_DIR / "video_list_full.txt"

def load_videos():
    videos = []
    for line in VIDEO_LIST.read_text().strip().split("\n"):
        if "|||" not in line:
            continue
        parts = line.split("|||")
        vid = parts[0].strip()
        title = "|||".join(parts[1:]).strip()
        videos.append({"id": vid, "title": title})
    return videos

def load_progress():
    if PROGRESS_FILE.exists():
        return set(json.loads(PROGRESS_FILE.read_text()))
    return set()

def save_progress(done_ids):
    PROGRESS_FILE.write_text(json.dumps(list(done_ids)))

def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def extract_transcript(page, video_id, title, max_retries=2):
    """Navigate to YouTube video, click transcript, extract text. Returns transcript str or None."""
    url = f"https://www.youtube.com/watch?v={video_id}"
    
    for attempt in range(max_retries):
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=20000)
            time.sleep(3)  # Wait for YouTube JS to fully render
            
            # Try clicking "Show transcript" button via JS
            clicked = page.evaluate("""
                () => {
                    // Strategy 1: Find button with "transcript" text
                    const buttons = Array.from(document.querySelectorAll('button, tp-yt-paper-button, ytd-button-renderer'));
                    for (const btn of buttons) {
                        const txt = (btn.innerText || '').toLowerCase();
                        if (txt.includes('transcript')) {
                            btn.click();
                            return 'clicked_strateg