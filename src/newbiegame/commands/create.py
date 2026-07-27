"""Command implementation for newbiegame create."""

from pathlib import Path
from typing import Optional
import typer
from rich.panel import Panel
from rich.prompt import Prompt, Confirm

from newbiegame.utils import console
from newbiegame.errors import handle_error, NewbieGameError
from newbiegame.services.validator import (
    validate_project_name,
    validate_destination_directory,
    validate_template_name,
    VALID_TEMPLATES
)
from newbiegame.services.generator import generate_project
from newbiegame.services.git import initialize_git_repository


def run_create_command(
    name: Optional[str] = None,
    template: str = "topdown",
    include_assets: bool = True,
    include_tutorial: bool = True,
    git: bool = True,
    force: bool = False
) -> None:
    """Execute create workflow interactively or non-interactively."""
    try:
        console.print(Panel("[bold cyan]🎮 Welcome to NewbieGame CLI![/bold cyan]\n[dim]Let's create your first web game.[/dim]", border_style="cyan"))

        # Interactive prompts if name is not provided
        if not name:
            name = Prompt.ask("[bold yellow]? Project name[/bold yellow]", default="dino-adventure")
            
            console.print("\n[bold yellow]? Choose a starter template:[/bold yellow]")
            for t_id, info in VALID_TEMPLATES.items():
                console.print(f"  [bold green]{t_id:10}[/bold green] - {info.icon} {info.name} ({info.description})")
            
            template = Prompt.ask("\n[bold yellow]Select template[/bold yellow]", default="topdown", choices=list(VALID_TEMPLATES.keys()))
            include_assets = Confirm.ask("[bold yellow]? Include example assets & sounds?[/bold yellow]", default=True)
            include_tutorial = Confirm.ask("[bold yellow]? Include beginner tutorial (GUIDE.md)?[/bold yellow]", default=True)
            git = Confirm.ask("[bold yellow]? Initialize Git repository?[/bold yellow]", default=True)

        # Validate inputs
        valid_name = validate_project_name(name)
        valid_template = validate_template_name(template)
        cwd = Path.cwd()
        target_dir = validate_destination_directory(cwd, valid_name, force=force)

        console.print(f"\n🚀 [bold cyan]Creating '{valid_name}' using template '{valid_template}'...[/bold cyan]")

        # Generate files atomically
        generate_project(
            target_dir=target_dir,
            project_name=valid_name,
            template_id=valid_template,
            include_assets=include_assets,
            include_tutorial=include_tutorial
        )

        console.print("  [bold green]✓[/bold green] Project folder created")
        console.print("  [bold green]✓[/bold green] Game files generated")
        console.print("  [bold green]✓[/bold green] Example assets copied")
        if include_tutorial:
            console.print("  [bold green]✓[/bold green] Beginner tutorial (GUIDE.md) generated")

        # Initialize Git if requested
        if git:
            if initialize_git_repository(target_dir):
                console.print("  [bold green]✓[/bold green] Git repository initialized")

        console.print(Panel(
            f"[bold green]✨ Your game is ready![/bold green]\n\n"
            f"[bold yellow]Next steps:[/bold yellow]\n"
            f"  [cyan]cd {valid_name}[/cyan]\n"
            f"  [cyan]newbiegame serve[/cyan]\n\n"
            f"Then open [bold underline]http://localhost:8000[/bold underline] in your browser!",
            border_style="green"
        ))

    except Exception as err:
        handle_error(err)
