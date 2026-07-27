"""Atomic project generator service."""

import os
from pathlib import Path
import shutil
import tempfile
from jinja2 import Environment, FileSystemLoader
from newbiegame.utils import console
from newbiegame.errors import NewbieGameError, TemplateNotFound
from newbiegame.models.project import ProjectConfig

def get_templates_dir() -> Path:
    """Locate package templates directory."""
    pkg_dir = Path(__file__).parent.parent
    templates_dir = pkg_dir / "templates"
    if not templates_dir.exists():
        raise TemplateNotFound("Templates folder missing from installation.")
    return templates_dir


def render_and_copy_file(src_file: Path, dst_file: Path, context: dict) -> None:
    """Copy file, rendering with Jinja2 if it's text/template file."""
    dst_file.parent.mkdir(parents=True, exist_ok=True)
    
    text_extensions = {".html", ".js", ".css", ".json", ".md", ".gitignore", ".txt"}
    if src_file.suffix in text_extensions or src_file.name in {".gitignore", "README", "LICENSE"}:
        try:
            env = Environment(loader=FileSystemLoader(str(src_file.parent)))
            template = env.get_template(src_file.name)
            rendered = template.render(**context)
            with open(dst_file, "w", encoding="utf-8") as f:
                f.write(rendered)
            return
        except Exception:
            # Fallback to direct raw copy if Jinja rendering fails (e.g. invalid syntax in JS)
            pass

    shutil.copy2(src_file, dst_file)


def generate_project(
    target_dir: Path,
    project_name: str,
    template_id: str = "topdown",
    include_assets: bool = True,
    include_tutorial: bool = True
) -> Path:
    """Generate project atomically using temporary folder."""
    templates_dir = get_templates_dir()
    template_src = templates_dir / template_id

    if not template_src.exists() or not template_src.is_dir():
        raise TemplateNotFound(f"Template directory '{template_id}' not found.")

    context = {
        "project_name": project_name,
        "template_id": template_id,
        "canvas_width": 800,
        "canvas_height": 450,
        "include_assets": include_assets,
        "include_tutorial": include_tutorial
    }

    with tempfile.TemporaryDirectory(prefix=f"newbiegame_{project_name}_") as tmp_dir_str:
        tmp_path = Path(tmp_dir_str)

        # Recursively render/copy files from template
        for root, dirs, files in os.walk(template_src):
            rel_root = Path(root).relative_to(template_src)
            dst_root = tmp_path / rel_root

            for file_name in files:
                src_file = Path(root) / file_name
                dst_file = dst_root / file_name

                # Skip optional features if disabled
                if not include_tutorial and file_name in {"GUIDE.md", "first-steps.md"}:
                    continue
                if not include_assets and "public/assets" in str(src_file):
                    continue

                render_and_copy_file(src_file, dst_file, context)

        # Ensure newbiegame.json is saved
        config = ProjectConfig(
            name=project_name,
            template=template_id,
            width=800,
            height=450
        )
        config.save(tmp_path)

        # Atomically move from temp directory to target_dir
        if target_dir.exists():
            shutil.rmtree(target_dir)

        shutil.copytree(tmp_path, target_dir)

    return target_dir
