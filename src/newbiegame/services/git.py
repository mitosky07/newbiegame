"""Git initialization service."""

from pathlib import Path
import shutil
import subprocess
from newbiegame.utils import console

def initialize_git_repository(project_dir: Path) -> bool:
    """Initialize a git repository inside project_dir if git is available."""
    git_binary = shutil.which("git")
    if not git_binary:
        console.print("  [dim]⚠️ Git is not installed on this system. Skipped git init.[/dim]")
        return False

    try:
        res = subprocess.run(
            [git_binary, "init"],
            cwd=project_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10
        )
        if res.returncode == 0:
            return True
        else:
            console.print(f"  [dim]⚠️ Git init returned status {res.returncode}. Skipped.[/dim]")
            return False
    except Exception as e:
        console.print(f"  [dim]⚠️ Failed to initialize git repository: {e}[/dim]")
        return False
