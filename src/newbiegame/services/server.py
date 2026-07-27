"""Native HTTP development server for newbiegame serve."""

import http.server
from pathlib import Path
import socket
import sys
import threading
import time
import webbrowser
from newbiegame.utils import console
from newbiegame.errors import ProjectConfigNotFound, NewbieGameError

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler that logs requests cleanly."""
    def log_message(self, format, *args):
        # Format logs in rich style instead of default stderr spam
        sys.stderr.write(f"  [HTTP {args[1]}] {args[0]}\n")


def find_available_port(host: str = "127.0.0.1", start_port: int = 8000, max_attempts: int = 50) -> int:
    """Find an open TCP port starting from start_port."""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind((host, port))
                return port
            except OSError:
                continue
    raise NewbieGameError(f"Could not find an open port in range {start_port}-{start_port + max_attempts}.")


def start_dev_server(project_dir: Path, port: int = 8000, open_browser: bool = True, host: str = "127.0.0.1") -> None:
    """Start local HTTP dev server."""
    project_dir = project_dir.resolve()
    config = ProjectConfig.load(project_dir)
    
    if not config and not (project_dir / "index.html").exists():
        raise ProjectConfigNotFound(
            f"No NewbieGame project found in '{project_dir}'.",
            "Make sure you are inside a project folder created with 'newbiegame create'."
        )

    actual_port = find_available_port(host=host, start_port=port)
    if actual_port != port:
        console.print(f"[yellow]⚠️ Port {port} is in use. Using port {actual_port} instead.[/yellow]")

    project_name = config.name if config else project_dir.name
    url = f"http://{host}:{actual_port}"

    class CustomHandler(QuietHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(project_dir), **kwargs)

    httpd = http.server.ThreadingHTTPServer((host, actual_port), CustomHandler)

    console.print(f"\n[bold green]🎮 Starting {project_name}[/bold green]")
    console.print(f"  [bold cyan]Local Server:[/bold cyan] {url}")
    console.print("  [dim]Press Ctrl+C to stop the server.[/dim]\n")

    if open_browser:
        def open_page():
            time.sleep(0.5)
            webbrowser.open(url)
        threading.Thread(target=open_page, daemon=True).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        console.print("\n[bold yellow]🛑 Dev server stopped. Happy hacking![/bold yellow]\n")
        httpd.server_close()
