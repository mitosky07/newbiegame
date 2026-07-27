"""Typer CLI application definition for NewbieGame CLI."""

from typing import Optional
import typer

from newbiegame import __version__
from newbiegame.commands.create import run_create_command
from newbiegame.commands.serve import run_serve_command
from newbiegame.commands.add import run_add_command
from newbiegame.commands.doctor import run_doctor_command
from newbiegame.commands.templates_cmd import run_templates_command

app = typer.Typer(
    name="newbiegame",
    help="🎮 Create beginner-friendly 2D web games from your terminal in under 2 minutes.",
    add_completion=False
)

def version_callback(value: bool):
    if value:
        typer.echo(f"NewbieGame CLI v{__version__}")
        raise typer.Exit()

@app.callback()
def main(
    version: Optional[bool] = typer.Option(
        None, "--version", "-v", callback=version_callback, is_eager=True, help="Show version."
    )
):
    """NewbieGame CLI - Ship web games fast for Hack Club Anvil."""
    pass

@app.command("create")
def create(
    name: Optional[str] = typer.Argument(None, help="Name of your game project."),
    template: str = typer.Option("topdown", "--template", "-t", help="Starter template (topdown|platformer|cards|blank)."),
    no_assets: bool = typer.Option(False, "--no-assets", help="Do not include example assets."),
    no_tutorial: bool = typer.Option(False, "--no-tutorial", help="Do not generate GUIDE.md."),
    no_git: bool = typer.Option(False, "--no-git", help="Do not initialize Git repo."),
    force: bool = typer.Option(False, "--force", "-f", help="Overwrite target folder if empty/exists.")
):
    """Create a new web game project."""
    run_create_command(
        name=name,
        template=template,
        include_assets=not no_assets,
        include_tutorial=not no_tutorial,
        git=not no_git,
        force=force
    )

@app.command("serve")
def serve(
    port: int = typer.Option(8000, "--port", "-p", help="Port number for local server."),
    no_open: bool = typer.Option(False, "--no-open", help="Do not open browser automatically."),
    host: str = typer.Option("127.0.0.1", "--host", help="Host interface to bind to.")
):
    """Start local HTTP server and open browser."""
    run_serve_command(port=port, open_browser=not no_open, host=host)

@app.command("add")
def add(
    component: Optional[str] = typer.Argument(None, help="Component to inject (score|keyboard|collision|audio).")
):
    """Inject a reusable game component into the current project."""
    run_add_command(component)

@app.command("doctor")
def doctor():
    """Run health check on current project structure."""
    run_doctor_command()

@app.command("templates")
def templates():
    """List available starter templates."""
    run_templates_command()

if __name__ == "__main__":
    app()
