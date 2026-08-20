#!/usr/bin/env bash
# Run the portfolio locally. Usage: ./run_all.sh [port]
#
#   ./run_all.sh            dev server with hot reload (default)
#   ./run_all.sh 3000       dev server on port 3000
#   ./run_all.sh --preview  build, then serve dist/ exactly as GitHub Pages will
set -euo pipefail
cd "$(dirname "$0")"

MODE="dev"
PORT="5173"

for arg in "$@"; do
  case "$arg" in
    --preview) MODE="preview"; PORT="4173" ;;
    ''|*[!0-9]*) echo "Ignoring unrecognised argument: $arg" ;;
    *) PORT="$arg" ;;
  esac
done

# Install once, or whenever package.json is newer than node_modules
if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
  echo ""
  echo "  Installing dependencies..."
  npm install
fi

# Free the port if a previous run is still holding it
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
fi

echo ""
if [ "$MODE" = "preview" ]; then
  echo "  Building production bundle..."
  npm run build
  echo ""
  echo "  Preview (production build) at:  http://localhost:${PORT}"
  echo "  (Ctrl+C to stop)"
  echo ""
  exec npm run preview -- --port "$PORT" --host
else
  echo "  Portfolio running at:  http://localhost:${PORT}"
  echo "  (Ctrl+C to stop)"
  echo ""
  exec npm run dev -- --port "$PORT" --host
fi
