"""Unit tests for validator service."""

import pytest
from pathlib import Path
from newbiegame.errors import InvalidProjectName, TemplateNotFound, ProjectAlreadyExists
from newbiegame.services.validator import (
    validate_project_name,
    validate_template_name,
    validate_destination_directory
)

def test_valid_project_names():
    assert validate_project_name("dino-game") == "dino-game"
    assert validate_project_name("card_battle_2026") == "card_battle_2026"
    assert validate_project_name("myGame") == "myGame"

def test_invalid_project_names():
    with pytest.raises(InvalidProjectName):
        validate_project_name("")

    with pytest.raises(InvalidProjectName):
        validate_project_name("../outside")

    with pytest.raises(InvalidProjectName):
        validate_project_name("123game") # must start with letter

    with pytest.raises(InvalidProjectName):
        validate_project_name("my game!") # invalid chars

def test_template_validation():
    assert validate_template_name("topdown") == "topdown"
    assert validate_template_name("BLANK") == "blank"

    with pytest.raises(TemplateNotFound):
        validate_template_name("minecraft")

def test_destination_directory_traversal(tmp_path):
    with pytest.raises(InvalidProjectName):
        validate_destination_directory(tmp_path, "../outside")
