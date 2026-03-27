#!/usr/bin/env python3
"""
YouTube Transcript Extractor - Run this on YOUR LOCAL MACHINE
This script uses your local browser (with your YouTube cookies) to extract
transcripts from all 449 Affiliate Marketing Dude videos.

USAGE:
 1. Save this file to your local computer
 2. Install dependencies: pip install playwright && playwright install chromium
 3. Run: python3 TRANSCRIPT_EXTRACTOR.py

The script will:
 - Create a folder ./transcripts/ 
 - Navigate to each YouTube video
 - Click "Show transcript"
 - Save full transcript to ./transcripts/VIDEO_ID.txt
 - Resume automatically if interrupted (saves progress)
"""
import subprocess, json, sys, time, os, signal
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# === CONFIGURATION ===
CHANNEL_DIR = Path(__file__).parent.resolve()
TRANSCRIPT_DIR = CHANNEL_DIR / "transcripts"
TRANSCRIPT_DIR.mkdir(exist_ok=True)
VIDEO_LIST = CHANNEL_DIR / "video_list_full.txt"
PROGRESS_FILE = CHANNEL_DIR / "transcripts" / "progress.json"
LOG_FILE = CHANNEL_DIR / "transcripts" / "extractor.log"

def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def load_videos():
    videos = []
    for line in VIDEO_LIST.read_text().strip().split("\n"):
        if "|||" not in line: continue
        parts = line.split("|||", 1)
        vid = parts[0].strip()
        title = parts[1].strip() if len(parts) > 1 else ""
        videos.append({"id": vid, "title": title})
    return videos

def load_done():
    if PROGRESS_FILE.exists():
        return set(json.loads(PROGRESS_FILE.read_text()))
    return set()

def save_done(done_ids):
    PROGRESS_FILE.write_text(json.dumps(sorted(done_ids)))

def extract_one(page, video_id, title, max_retries=2):
    """Extract transcript from one video. Returns (transcript_str_or_None, error_type)."""
    url = f"https://www.youtube.com/watch?v={video_id}"
    
    for attempt in range(max_retries):
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
            time.sleep(2)
            
            # Try multiple strategies to find and click transcript button
            clicked = False
            for strategy in range(4):
                if clicked: break
                
                if strategy == 0:
                    # Strategy 1: Direct button with "transcript" text
                    clicked = page.evaluate("""
                        () => {
                            const buttons = document.querySelectorAll('button, tp-yt-paper-button');
                            for (const btn of buttons) {
                                if ((btn.innerText || '').toLowerCase().includes('transcript')) {
                                    btn.click(); return true;
                                }
                            }
                            return false;
                        }
                    """)
                elif strategy == 1:
                    # Strategy 2: Click "more" button then look for transcript
                    page.evaluate("""
                        () => {
                            const buttons = document.querySelectorAll('button[aria-label], tp-yt-paper-button');
                            for (const btn of buttons) {
                                const label = (btn.getAttribute('aria-label') || '').toLowerCase();
                                if (label.includes('more') || label.includes('expand')) {
                                    btn.click(); return;
                                }
                            }
                        }
                    """)
                    time.sleep(1)
                    clicked = page.evaluate("""
                        () => {
                            const menus = document.querySelectorAll('tp-yt-paper-menu-button, ytd-menu-popup-renderer');
                            for (const menu of menus) {
                                const items = menu.querySelectorAll('yt-formatted-string, ytd-menu-service-item-renderer');
                                for (const item of items) {
                                    if ((item.innerText || '').toLowerCase().includes('transcript')) {
                                        item.click(); return true;
                                    }
                                }
                            }
                            return false;
                        }
                    """)
                elif strategy == 2:
                    # Strategy 3: Expand description then find transcript
                    page.evaluate("""
                        () => {
                            const expanders = document.querySelectorAll('#expand, #collapsible, #toggle, [aria-expanded="false"]');
                            for (const exp of expanders) { exp.click(); }
                        }
                    """)
                    time.sleep(1)
                    clicked = page.evaluate("""
                        () => {
                            const el = document.querySelector('#transcript, [href*="transcript"], ytd-transcript-header-renderer');
                            if (el) { el.click(); return true; }
                            const btns = document.querySelectorAll('button, a, tp-yt-paper-button');
                            for (const b of btns) {
                                if ((b.innerText || '').toLowerCase().includes('show transcript')) { b.click(); return true; }
                            }
                            return false;
                        }
                    """)
                elif strategy == 3:
                    # Strategy 4: Keyboard shortcut Shift+T
                    page.keyboard.press("Shift+T")
                    time.sleep(1)
                    clicked = page.evaluate("() => document.querySelector('ytd-transcript-segment-list-renderer, ytd-transcript-dialog') !== null")
            
            if not clicked:
                return None, "NO_BUTTON"
            
            time.sleep(2)
            
            # Scroll to load all transcript segments
            page.evaluate("""
                () => {
                    const panel = document.querySelector('ytd-transcript-segment-list-renderer, ytd-transcript-dialog');
                    if (panel) {
                        const scrollable = panel.querySelector('#scrollable, [id="scrollable"]');
                        if (scrollable) {
                            // Scroll to bottom repeatedly to load all
                            for (let i = 0; i < 50; i++) {
                                scrollable.scrollTop = scrollable.scrollHeight;
                            }
                        }
                        panel.scrollTop = panel.scrollHeight;
                    }
                }
            """)
            time.sleep(1)
            
            # Extract all transcript text
            transcript = page.evaluate("""
                () => {
                    const panel = document.querySelector('ytd-transcript-segment-list-renderer');
                    if (!panel) {
                        // Try alternate selector
                        const alts = document.querySelectorAll('[class*="transcript"], ytd-transcript-dialog');
                        for (const alt of alts) {
                            const segs = alt.querySelectorAll('yt-formatted-string, #content, [class*="segment"]');
                            if (segs.length > 0) {
                                return Array.from(segs).map(s => (s.innerText || s.textContent || '').trim()).join(' ').trim();
                            }
                        }
                        return '';
                    }
                    const segments = panel.querySelectorAll('yt-formatted-string, #content');
                    if (segments.length === 0) {
                        // Fallback: get all text
                        return (panel.innerText || panel.textContent || '').replace(/\\d{1,2}:\\d{2}.*?(?= \\d{1,2}:\\d{2}|$)/g, match => match + ' ').trim();
                    }
                    return Array.from(segments).map(s => (s.innerText || s.textContent || '').trim()).join(' ').trim();
                }
            """)
            
            if transcript and len(transcript) > 50:
                return transcript, None
                
        except PlaywrightTimeout:
            log(f"  Timeout on {video_id}, attempt {attempt+1}")
        except Exception as e:
            log(f"  Error on {video_id}: {e}")
    
    return None, "FAILED"

def main():
    log("=== Transcript Extractor Started ===")
    
    videos = load_videos()
    done = load_done()
    
    log(f"Total videos: {len(videos)} | Already done: {len(done)} | Remaining: {len(videos)-len(done)}")
    
    # Handle Ctrl+C gracefully
    def signal_handler(sig, frame):
        log("Interrupted! Saving progress...")
        sys.exit(0)
    signal.signal(signal.SIGINT, signal_handler)
    
    results = {"success": 0, "failed": 0, "no_transcript": 0}
    start_time = time.time()
    
    with sync_playwright() as p:
        # Use your local Chrome/Chromium (with your YouTube cookies)
        browser = p.chromium.launch(
            headless=False,  # Set True for headless, False to watch
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            # To use your YouTube cookies, either:
            # 1. Open YouTube in a non-headless browser first and log in, OR
            # 2. Export cookies from your browser and load them:
            # context.add_cookies(cookies_list)
        )
        page = context.new_page()
        
        for i, video in enumerate(videos):
            vid = video["id"]
            title = video["title"]
            
            if vid in done:
                continue
            
            elapsed = time.time() - start_time
            rate = (i+1) / (elapsed/60) if elapsed > 0 else 0
            eta = (len(videos) - i) / rate if rate > 0 else 0
            
            log(f"[{i+1}/{len(videos)}] {vid}: {title[:50]} | ETA: {eta:.0f}min")
            
            out_file = TRANSCRIPT_DIR / f"{vid}.txt"
            
            transcript, err = extract_one(page, vid, title)
            
            if transcript:
                # Clean up timestamps like "0:00" from text
                import re
                clean = re.sub(r'\b\d{1,2}:\d{2}(:\d{2})?\s*', '', transcript).strip()
                clean = ' '.join(clean.split())  # normalize whitespace
                out_file.write_text(clean)
                done.add(vid)
                results["success"] += 1
                log(f"  ✓ Saved {len(clean)} chars")
            else:
                out_file.write_text("NO_TRANSCRIPT")
                done.add(vid)
                results["no_transcript"] += 1
                log(f"  ✗ {err}")
            
            # Save progress every 5 videos
            if (i + 1) % 5 == 0:
                save_done(done)
                log(f"  Progress: {len(done)}/{len(videos)} | {results}")
            
            # Rate limit: 3s between videos to avoid IP ban
            time.sleep(3)
        
        save_done(done)
        browser.close()
    
    elapsed_total = time.time() - start_time
    log(f"\n=== DONE in {elapsed_total/60:.1f} min ===")
    log(f"Results: {results}")
    log(f"Total done: {len(done)}/{len(videos)}")

if __name__ == "__main__":
    main()
