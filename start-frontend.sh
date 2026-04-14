#!/usr/bin/env zsh
set -euo pipefail

PROJECT_ROOT="/Users/macbookpro/Desktop/PROJET"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
LOG_FILE="/tmp/frontend-vite.log"

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "Frontend directory not found: $FRONTEND_DIR" >&2
  exit 1
fi

if [[ -f "$HOME/.nvm/nvm.sh" ]]; then
  source "$HOME/.nvm/nvm.sh"
  nvm use 22 >/dev/null
  NODE_BIN="$(nvm which 22)"
else
  echo "nvm not found at $HOME/.nvm/nvm.sh" >&2
  exit 1
fi

cd "$FRONTEND_DIR"
exec "$NODE_BIN" ./node_modules/vite/bin/vite.js --port 3000 --host 127.0.0.1 --clearScreen false
