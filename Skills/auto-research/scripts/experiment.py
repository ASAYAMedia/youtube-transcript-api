#!/usr/bin/env python3
"""
Auto-research experiment template.
This is the file the AI agent edits. Contains experiment definitions.
Modify the EXPERIMENT dict and apply_changes() function.
"""
import os
import subprocess
from dataclasses import dataclass
from typing import List, Tuple

# ============================================================================
# EXPERIMENT CONFIGURATION
# Modify these for your experiment
# ============================================================================

EXPERIMENT = {
    "name": "defer-ads",
    "description": "Defer Google Ads script to improve initial paint",
    "target_file": "app/layout.tsx",
}

# Experiment ideas to try (uncomment and modify):
# EXPERIMENT = {
#     "name": "defer-scripts",
#     "description": "Defer non-critical scripts to improve FCP",
#     "target_file": "app/layout.tsx",
# }

# EXPERIMENT = {
#     "name": "optimize-images",
#     "description": "Add loading=lazy to below-fold images",
#     "target_file": "components/features.tsx",
# }

# EXPERIMENT = {
#     "name": "preload-fonts",
#     "description": "Add font-display: swap and preload",
#     "target_file": "app/globals.css",
# }

# ============================================================================
# APPLY CHANGES
# Implement your experiment here
# ============================================================================

def read_file(path: str) -> str:
    """Read file relative to repo root."""
    repo = "/home/workspace/tinytoolbox-github"
    full_path = os.path.join(repo, path)
    with open(full_path, "r") as f:
        return f.read()

def write_file(path: str, content: str) -> None:
    """Write file relative to repo root."""
    repo = "/home/workspace/tinytoolbox-github"
    full_path = os.path.join(repo, path)
    with open(full_path, "w") as f:
        f.write(content)

def apply_changes() -> bool:
    """
    Apply experiment modifications.
    Return True if changes were made, False for baseline.
    
    The agent should:
    1. Read the target file
    2. Make modifications
    3. Write the new content
    4. Return True
    
    For baseline: just return False without changes
    """
    if EXPERIMENT["name"] == "baseline":
        print("Baseline run - no changes")
        return False
    
    target = EXPERIMENT["target_file"]
    if not target:
        print("No target file specified")
        return False
    
    print(f"Applying experiment: {EXPERIMENT['name']}")
    print(f"Description: {EXPERIMENT['description']}")
    print(f"Target: {target}")
    
    # Read current content
    content = read_file(target)
    original = content
    
    # ================================================================
    # MAKE YOUR EDITS HERE
    # ================================================================
    
    if EXPERIMENT["name"] == "font-display-swap":
        # Find @font-face rules and add font-display: swap
        import re
        pattern = r'(@font-face\s*\{[^}]*)(\})'
        def add_font_display(match):
            block = match.group(1)
            if 'font-display' not in block:
                return block + '  font-display: swap;\n}'
            return match.group(0)
        content = re.sub(pattern, add_font_display, content, flags=re.DOTALL)
    
    elif EXPERIMENT["name"] == "lazy-load-images":
        # Add loading="lazy" to img tags that don't already have it
        import re
        # Match img tags without loading attribute
        content = re.sub(
            r'<img\s+([^>]*)(?!loading=)([^>]*?)>',
            lambda m: f'<img {m.group(1)}{m.group(2)} loading="lazy">',
            content
        )
    
    elif EXPERIMENT["name"] == "defer-ads":
        # Change async to defer or add defer to scripts
        content = content.replace('async src="https://pagead2.googlesyndication', 
                                   'defer src="https://pagead2.googlesyndication')
    
    # ================================================================
    
    # Check if changes were made
    if content == original:
        print("Warning: No changes detected - edit the replacement logic")
        return False
    
    # Write changes
    write_file(target, content)
    print(f"Modified {target}")
    return True

def run_build() -> bool:
    """Run build to verify changes work."""
    repo = "/home/workspace/tinytoolbox-github"
    print("Running build...")
    result = subprocess.run(
        ["npm", "run", "build"],
        cwd=repo,
        capture_output=True,
        text=True,
        timeout=300
    )
    
    if result.returncode == 0:
        print("Build successful")
        return True
    else:
        print(f"Build failed:\n{result.stderr}")
        return False

def commit_changes() -> str:
    """Commit changes and return commit hash."""
    repo = "/home/workspace/tinytoolbox-github"
    
    # Stage changes
    subprocess.run(["git", "add", "."], cwd=repo)
    
    # Commit with experiment description
    msg = f"[autoresearch] {EXPERIMENT['name']}: {EXPERIMENT['description']}"
    result = subprocess.run(
        ["git", "commit", "-m", msg],
        cwd=repo,
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Commit failed: {result.stderr}")
        return "unknown"
    
    # Get commit hash
    result = subprocess.run(
        ["git", "rev-parse", "--short", "HEAD"],
        cwd=repo,
        capture_output=True,
        text=True
    )
    
    commit = result.stdout.strip()
    print(f"Committed: {commit}")
    return commit

def main():
    """Run the experiment."""
    print("=" * 60)
    print(f"Experiment: {EXPERIMENT['name']}")
    print(f"Description: {EXPERIMENT['description']}")
    print("=" * 60)
    
    # Apply changes
    changes_made = apply_changes()
    
    if changes_made:
        # Verify build passes
        if not run_build():
            print("Build failed - aborting")
            return None
        
        # Commit
        commit = commit_changes()
    else:
        # Baseline - get current commit
        result = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd="/home/workspace/tinytoolbox-github",
            capture_output=True,
            text=True
        )
        commit = result.stdout.strip()
    
    return commit

if __name__ == "__main__":
    commit = main()
    if commit:
        print(f"\nReady for measurement. Commit: {commit}")
    else:
        print("\nExperiment failed")
