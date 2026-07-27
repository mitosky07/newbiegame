"""Command implementation for newbiegame serve."""

from pathlib import Path
from newbiegame.utils import console
from newbiegame.errors import handle_error
from newbiegame.services.server import start_dev_server

def run_serve_command(
    port: int = 8000,
    open_browser: bool = True,
    host: str = "127.0.0.1"
) -> None:
    """Run local dev server in current directory."""
    try:
        cwd = Path.cwd()
        start_dev_server(project_dir=cwd, port=port, open_browser=open_browser, host=host)
    except Exception as err:
        handle_error(err)
