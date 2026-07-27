"""Validation service for project names, paths, and templates."""

import re
from pathlib import Path
from newbiegame.errors import InvalidProjectName, ProjectAlreadyExists, TemplateNotFound
from newbiegame.models.template import TemplateInfo

RESERVED_NAMES = {"con", "prn", "aux", "nul", "com1", "com2", "lpt1", "node_modules", "public", "src"}
VALID_TEMPLATES = {
    "topdown": TemplateInfo(
        id="topdown",
        name="Top-down Adventure",
        description="2D adventure with WASD movement, collectible coins, score, and victory screen.",
        genre="Adventure",
        icon="🏃"
    ),
    "platformer": TemplateInfo(
        id="platformer",
        name="Platformer 2D",
        description="2D Platformer with gravity, jumping, platforms, and collision physics.",
        genre="Platformer",
        icon="🪂"
    ),
    "cards": TemplateInfo(
        id="cards",
        name="Card Game Engine",
        description="Interactive card hand, card selection, turn logic, and score tracking.",
        genre="Card Game",
        icon="🃏"
    ),
    "blank": TemplateInfo(
        id="blank",
        name="Blank Canvas Starter",
        description="Minimal HTML5 Canvas with Game Loop and clean code structure.",
        genre="Starter",
        icon="🖼️"
    )
}

def validate_project_name(name: str) -> str:
    """Validate project name for security and formatting."""
    name = name.strip()
    if not name:
        raise InvalidProjectName("Project name cannot be empty.", "Try: newbiegame create my-first-game")
    
    if len(name) > 64:
        raise InvalidProjectName("Project name is too long (max 64 characters).", "Use a shorter name like 'dino-game'.")

    # Anti Path Traversal
    if ".." in name or "/" in name or "\\" in name or ":" in name:
        raise InvalidProjectName(
            f"Project name '{name}' contains forbidden path characters.",
            "Use simple names with lowercase letters, numbers, and hyphens (e.g. 'dino-game')."
        )

    # Regex validation
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9_-]*$", name):
        raise InvalidProjectName(
            f"Invalid project name '{name}'. Must start with a letter and contain only letters, numbers, and hyphens.",
            "Examples: 'dino-adventure', 'card-battle', 'space-shooter'."
        )

    if name.lower() in RESERVED_NAMES:
        raise InvalidProjectName(f"'{name}' is a reserved system or project name.", "Choose a different name.")

    return name


def validate_destination_directory(base_dir: Path, name: str, force: bool = False) -> Path:
    """Ensure target directory is safe and clean."""
    target_dir = (base_dir / name).resolve()
    
    # Path traversal safety check
    try:
        target_dir.relative_to(base_dir.resolve())
    except ValueError:
        raise InvalidProjectName("Target path attempts to leave the working directory.", "Specify a valid local project name.")

    if target_dir.exists() and any(target_dir.iterdir()):
        if not force:
            raise ProjectAlreadyExists(
                f"The folder '{name}' already exists and contains files.",
                f"Choose another name or run: newbiegame create {name} --force"
            )

    return target_dir


def validate_template_name(template_id: str) -> str:
    """Check if requested template exists."""
    template_id = template_id.strip().lower()
    if template_id not in VALID_TEMPLATES:
        available = ", ".join(VALID_TEMPLATES.keys())
        raise TemplateNotFound(
            f"Unknown template: '{template_id}'.",
            f"Available templates: {available}\nRun 'newbiegame templates' to see details."
        )
    return template_id
