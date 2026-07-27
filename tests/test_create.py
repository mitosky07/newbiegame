"""Integration tests for project generator."""

from pathlib import Path
from newbiegame.services.generator import generate_project
from newbiegame.models.project import ProjectConfig

def test_generate_topdown_project(tmp_path):
    target = tmp_path / "test-dino-game"
    project_dir = generate_project(
        target_dir=target,
        project_name="test-dino-game",
        template_id="topdown",
        include_assets=True,
        include_tutorial=True
    )

    assert project_dir.exists()
    assert (project_dir / "index.html").exists()
    assert (project_dir / "src" / "main.js").exists()
    assert (project_dir / "GUIDE.md").exists()

    config = ProjectConfig.load(project_dir)
    assert config is not None
    assert config.name == "test-dino-game"
    assert config.template == "topdown"

def test_generate_blank_project(tmp_path):
    target = tmp_path / "blank-game"
    project_dir = generate_project(
        target_dir=target,
        project_name="blank-game",
        template_id="blank",
        include_assets=False,
        include_tutorial=False
    )

    assert project_dir.exists()
    assert (project_dir / "index.html").exists()
    assert not (project_dir / "GUIDE.md").exists()
