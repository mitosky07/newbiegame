"""Custom exceptions and friendly error handler for NewbieGame CLI."""

import sys
from newbiegame.utils import console

class NewbieGameError(Exception):
    """Base exception for NewbieGame errors."""
    def __init__(self, message: str, suggestion: str = ""):
        super().__init__(message)
        self.message = message
        self.suggestion = suggestion

class InvalidProjectName(NewbieGameError):
    """Raised when project name violates validation rules."""
    pass

class ProjectAlreadyExists(NewbieGameError):
    """Raised when target project directory already exists and is non-empty."""
    pass

class TemplateNotFound(NewbieGameError):
    """Raised when requested starter template does not exist."""
    pass

class ProjectConfigNotFound(NewbieGameError):
    """Raised when running commands outside a valid NewbieGame project."""
    pass


def handle_error(err: Exception) -> None:
    """Format and print errors gracefully with suggestions."""
    if isinstance(err, NewbieGameError):
        console.print(f"\n[bold red]❌ Error:[/bold red] {err.message}")
        if err.suggestion:
            console.print(f"[bold yellow]💡 Suggestion:[/bold yellow] {err.suggestion}\n")
    else:
        console.print(f"\n[bold red]❌ Unexpected Error:[/bold red] {err}\n")
    sys.exit(1)
