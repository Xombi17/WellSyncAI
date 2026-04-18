#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Vaxi Babu — Backend Dev Launch Script
#
# Usage:
#   ./run_dev.sh          → stable mode (no auto-reload, best for Streamlit demo)
#   ./run_dev.sh --watch  → reload on changes to app/ only (for active coding)
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Kill any lingering uvicorn on port 8000
lsof -ti :8000 | xargs kill -9 2>/dev/null && echo "🔪 Killed previous process on :8000" || true
sleep 1

if [[ "$1" == "--watch" ]]; then
    echo "🚀 Starting Vaxi Babu backend (WATCH MODE — watches app/ only)..."
    ~/.local/bin/uv run uvicorn app.main:app \
        --reload \
        --reload-dir app \
        --host 0.0.0.0 \
        --port 8000 \
        --log-level info
else
    echo "🚀 Starting Vaxi Babu backend (STABLE MODE — no auto-reload)..."
    ~/.local/bin/uv run uvicorn app.main:app \
        --host 0.0.0.0 \
        --port 8000 \
        --log-level info \
        --workers 1
fi
