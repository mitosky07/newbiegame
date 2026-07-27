"""Command implementation for newbiegame templates."""

from rich.table import Table
from newbiegame.utils import console
from newbiegame.services.validator import VALID_TEMPLATES

def run_templates_command() -> None:
    """List available game templates in a rich formatted table."""
    table = Table(title="🎮 Available NewbieGame Starter Templates", border_style="cyan")
    table.add_column("Template ID", style="bold green")
    table.add_column("Name", style="bold cyan")
    table.add_column("Genre", style="yellow")
    table.add_column("Description")

    for t_id, info in VALID_TEMPLATES.items():
        table.add_row(t_id, f"{info.icon} {info.name}", info.genre, info.description)

    console.print()
    console.print(table)
    console.print("\n[dim]Usage example:[/dim] [cyan]newbiegame create my-game --template topdown[/cyan]\n")
