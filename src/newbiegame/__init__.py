"""NewbieGame CLI package."""

import sys

__version__ = "0.1.0"

# Fix Windows console encoding for Rich Unicode/Emoji support
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

