#!/bin/bash

# Exit on errors
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "========================================"
echo "  AI-Powered Travel Planner - Startup"
echo "========================================"

# --- Backend Setup ---
echo ""
echo "[1/4] Setting up backend..."

# Create virtual environment if it doesn't exist
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo "  Creating Python virtual environment..."
    python3 -m venv "$BACKEND_DIR/.venv"
fi

# Activate virtual environment
source "$BACKEND_DIR/.venv/bin/activate"

# Install dependencies using the venv's own pip (never system pip, which is
# externally managed on modern Debian/Ubuntu and would fail with
# "externally-managed-environment").
VENV_PYTHON="$BACKEND_DIR/.venv/bin/python"
if ! "$VENV_PYTHON" -c "import fastapi" >/dev/null 2>&1; then
    echo "  Installing Python dependencies..."
    # Bootstrap pip into the venv if missing, then install.
    "$VENV_PYTHON" -m ensurepip --upgrade >/dev/null 2>&1 || true
    "$VENV_PYTHON" -m pip install -q -r "$BACKEND_DIR/requirements.txt"
fi

# Create .env if it doesn't exist
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "  WARNING: No .env file found. Creating from .env.example..."
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    echo "  Please edit $BACKEND_DIR/.env and add your API keys before starting."
fi

# Start backend (must cd into backend dir for the 'app' module to be importable)
echo "  Starting backend on http://127.0.0.1:8000..."
cd "$BACKEND_DIR" && nohup "$VENV_PYTHON" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > "$PROJECT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

# Wait for backend to be ready
echo -n "  Waiting for backend..."
for i in $(seq 1 30); do
    if curl -s http://127.0.0.1:8000/docs > /dev/null 2>&1; then
        echo " OK"
        break
    fi
    echo -n "."
    sleep 1
done

# --- Frontend Setup ---
echo ""
echo "[2/4] Setting up frontend..."

# Install dependencies if node_modules is missing or outdated
if [ ! -d "$FRONTEND_DIR/node_modules" ] || \
   [ "$FRONTEND_DIR/package.json" -nt "$FRONTEND_DIR/node_modules/.package-lock.json" ]; then
    echo "  Installing npm dependencies..."
    cd "$FRONTEND_DIR" && npm install
fi

# Fix vite permissions if needed
if [ -x "$FRONTEND_DIR/node_modules/.bin/vite" ]; then
    chmod +x "$FRONTEND_DIR/node_modules/.bin/vite"
fi

# Start frontend
echo "  Starting frontend on http://127.0.0.1:5173..."
cd "$FRONTEND_DIR" && nohup npm run dev > "$PROJECT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"

# Wait for frontend to be ready
echo -n "  Waiting for frontend..."
for i in $(seq 1 30); do
    if curl -s http://127.0.0.1:5173 > /dev/null 2>&1; then
        echo " OK"
        break
    fi
    echo -n "."
    sleep 1
done

# --- Done ---
echo ""
echo "========================================"
echo "  Both services are running!"
echo "========================================"
echo ""
echo "  Frontend: http://127.0.0.1:5173"
echo "  Backend:  http://127.0.0.1:8000"
echo "  API Docs: http://127.0.0.1:8000/docs"
echo ""
echo "  Backend PID:  $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "  Logs:"
echo "    Backend:  $PROJECT_DIR/backend.log"
echo "    Frontend: $PROJECT_DIR/frontend.log"
echo ""
echo "  To stop both services, run: $PROJECT_DIR/stop.sh"
echo ""
