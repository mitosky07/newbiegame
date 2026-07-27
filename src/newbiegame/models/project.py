"""Project configuration model for newbiegame.json."""

from dataclasses import dataclass, asdict
import json
from pathlib import Path
from typing import Optional

@dataclass
class ProjectConfig:
    name: str
    template: str
    version: str = "0.1.0"
    entry: str = "src/main.js"
    width: int = 800
    height: int = 450

    def to_dict(self) -> dict:
        return asdict(self)

    def save(self, project_dir: Path) -> Path:
        config_path = project_dir / "newbiegame.json"
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(self.to_dict(), f, indent=2)
        return config_path

    @classmethod
    def load(cls, project_dir: Path) -> Optional["ProjectConfig"]:
        config_path = project_dir / "newbiegame.json"
        if not config_path.exists():
            return None
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return cls(
                name=data.get("name", "my-game"),
                template=data.get("template", "blank"),
                version=data.get("version", "0.1.0"),
                entry=data.get("entry", "src/main.js"),
                width=data.get("width", 800),
                height=data.get("height", 450)
            )
        except Exception:
            return None
