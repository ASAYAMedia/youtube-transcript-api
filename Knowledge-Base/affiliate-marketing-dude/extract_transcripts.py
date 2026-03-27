#!/usr/bin/env python3
"""
Playwright-based YouTube Transcript Extractor
Uses browser automation to click "Open transcript" on YouTube watch pages.
"""
import subprocess, json, sys, time, re, os
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

BASE_DIR = Path("/home/workspace/Knowledge-Base/affiliate-marketing-dude")
TRANSCRIPT_DIR = BASE_DIR / "transcripts"
TRANSCRIPT_DIR.mkdir(exist_ok=True)

VIDEO_LIST = BASE_DIR / "video_list_full.txt"

def load_videos():
    videos = []
    for line in VIDEO_LIST.read_text().strip().split("\n"):
        if "|||" not in line:
            continue
        parts = line.split("|||")
        if len(parts) >= 2:
            video_id = parts[0].strip()
            title = "|||".join(parts[1:]).strip()
            videos.append({"id": video_id, "title": title})
    return videos

def extract_transcript(page, video_id, title, retries=2):
    """Navigate to YouTube video, open transcript panel, extract text."""
    url = f"https://www.youtube.com/watch?v={video_id}"
    
    for attempt in range(retries):
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=15000)
            time.sleep(3)  # Wait for React/JS to render
            
            # Try to click "Show transcript" button (it appears below the video)
            # The button text is "Show transcript" or "Hide transcript"
            try:
                # Look for the transcript button in multiple ways
                page.evaluate("""
                    () => {
                        // YouTube's transcript button is usually in the below-video section
                        const buttons = document.querySelectorAll('button');
                        for (const btn of buttons) {
                            if (btn.innerText && btn.innerText.match(/transcript/i)) {
                                btn.click();
                                return 'found';
                            }
                        }
                        return 'not found';
                    }
                """)
                time.sleep(2)
            except Exception as e:
                pass
            
            # Alternative: click the "..." menu then find transcript
            try:
                page.evaluate("""
                    () => {
                        // Find the "More" button (three dots) below the video
                        const menus = document.querySelectorAll('yt-icon-button#top-level-buttons-computed-command-senderer, ytd-button-renderer#button');
                        for (const m of menus) {
                            const txt = m.innerText || m.textContent || '';
                            // The more button is usually the last icon button
                        }
                        // Try finding the menu button
                        const allButtons = document.querySelectorAll('button');
                        for (const b of allButtons) {
                            const rect = b.getBoundingClientRect();
                            // Button should be below the video (roughly)
                        }
                    }
                """)
            except:
                pass
            
            # Extract transcript text from the transcript panel
            # YouTube puts it in ytd-transcript-segment-list or similar
            transcript_text = page.evaluate("""
                () => {
                    // Try multiple selectors for transcript panel
                    const selectors = [
                        'ytd-transcript-segment-list-renderer',
                        'ytd-transcript-dialog',
                        '#transcript-segment-list',
                        'tp-yt-paper-dialog[transcript]',
                        'ytd-transcript-segment-renderer',
                    ];
                    for (const sel of selectors) {
                        const el = document.querySelector(sel);
                        if (el) {
                            const segments = el.querySelectorAll('yt-formatted-string, #content, .segment-text, [class*="segment"]');
                            if (segments.length > 0) {
                                return Array.from(segments).map(s => s.innerText || s.textContent || '').join(' ').trim();
                            }
                            return (el.innerText || el.textContent || '').trim();
                        }
                    }
                    return '';
                }
            """)
            
            if transcript_text and len(transcript_text) > 50:
                return transcript_text
            
        except PlaywrightTimeout:
            pass
        except Exception as e:
            pass
        
        time.sleep(2)
    
    return None

def main():
    videos = load_videos()
    print(f"Loaded {len(videos)} videos")
    
    # Load progress
    done_file = BASE_DIR / "transcripts_done.json"
    if done_file.exists():
        done = set(json.loads(done_file.read_text()))
    else:
        done = set()
    
    print(f"Already done: {len(done)}")
    remaining = [v for v in videos if v["id"] not in done]
    print(f"Remaining: {len(remaining)}")
    
    results = {"success": 0, "failed": 0, "no_transcript": 0}
    
    with sync_playwright() as p:
        # Use chromium with anti-detection args
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
                "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        
        # Block heavy resources to speed up
        page.route("**/*.{png,jpg,jpeg,gif,svg,css,woff,woff2,ttf,otf}", lambda route: route.abort())
        
        for i, video in enumerate(remaining):
            vid = video["id"]
            title = video["title"]
            out_file = TRANSCRIPT_DIR / f"{vid}.txt"
            
            print(f"[{i+1}/{len(remaining)}] {vid}: {title[:50]}")
            
            text = extract_transcript(page, vid, title)
            
            if text and len(text) > 50:
                out_file.write_text(text)
                done.add(vid)
                results["success"] += 1
                print(f"  ✓ Got {len(text)} chars")
            else:
                results["no_transcript"] += 1
                print(f"  ✗ No transcript")
            
            # Save progress every 10 videos
            if (i + 1) % 10 == 0:
                done_file.write_text(json.dumps(list(done)))
                print(f"  Progress: {len(done)}/{len(videos)} done | {results}")
            
            # Rate limit to avoid IP ban
            time.sleep(2)
        
        done_file.write_text(json.dumps(list(done)))
        browser.close()
    
    print(f"\n=== FINAL: {results} ===")
    print(f"Total done: {len(done)}/{len(videos)}")

if __name__ == "__main__":
    main()
