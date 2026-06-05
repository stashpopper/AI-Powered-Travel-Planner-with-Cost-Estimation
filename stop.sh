#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Stopping services..."

# Kill backend (uvicorn reloader process)
if [ -f "$PROJECT_DIR/backend.pid" ]; then
    kill $(cat "$PROJECT_DIR/backend.pid") 2>/dev/null
    rm "$PROJECT_DIR/backend.pid"
fi
pkill -f "uvicorn app.main:app" 2>/dev/null

# Kill frontend
if [ -f "$PROJECT_DIR/frontend.pid" ]; then
    kill $(cat "$PROJECT_DIR/frontend.pid") 2>/dev/null
    rm "$PROJECT_DIR/frontend.pid"
fi
pkill -f "npm run dev" 2>/dev/null

echo "Services stopped."
