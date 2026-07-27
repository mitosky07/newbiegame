"""Command implementation for newbiegame doctor."""

from pathlib import Path
import sys
from newbiegame.utils import console
from newbiegame.models.project import ProjectConfig

def run_doctor_command() -> None:
    """Run health check on environment and current project."""
    console.print("\n[bold cyan]🩺 Checking NewbieGame Project Health...[/bold cyan]\n")

    # 1. Python version check
    py_ver = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    if sys.version_info >= (3, 10):
        console.print(f"  [bold green]✓[/bold green] Python version {py_ver} supported")
    else:
        console.print(f"  [bold red]❌ Python version {py_ver} is outdated (requires 3.10+)[/bold red]")

    # 2. Check project structure
    cwd = Path.cwd()
    config = ProjectConfig.load(cwd)
    if config:
        console.print(f"  [bold green]✓[/bold green] Project configuration found ([cyan]{config.name}[/cyan])")
    else:
        console.print("  [bold yellow]⚠️ No newbiegame.json found in current directory[/bold yellow]")

    # 3. Check HTML entry point
    index_html = cwd / "index.html"
    if index_html.exists():
        console.print("  [bold green]✓[/bold green] index.html exists")
    else:
        console.print("  [bold red]❌ index.html missing![/bold red]")

    # 4. Check main JS entry point
    main_js = cwd / "src" / "main.js"
    if main_js.exists():
        console.print("  [bold green]✓[/bold green] Main JavaScript file (src/main.js) exists")
    else:
        console.print("  [bold yellow]⚠️ src/main.js missing[/bold yellow]")

    # 5. Check GUIDE.md
    guide = cwd / "GUIDE.md"
    if guide.exists():
        console.print("  [bold green]✓[/bold green] Beginner tutorial (GUIDE.md) exists")
    else:
        console.print("  [bold dim]ℹ️ GUIDE.md not present[/bold dim]")

    console.print("\n[bold green]Doctor check complete![/bold green]\n")
