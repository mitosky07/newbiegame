"""Template metadata model."""

from dataclasses import dataclass

@dataclass
class TemplateInfo:
    id: str
    name: str
    description: str
    genre: str
    icon: str
