#!/bin/sh
  set -e

  # Always resolve paths relative to this script's location (repo root)
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  echo "==> Script dir (repo root): $SCRIPT_DIR"
  echo "==> Original CWD: $(pwd)"

  # Change to repo root so all relative paths are predictable
  cd "$SCRIPT_DIR"

  # Build the Vite frontend
  pnpm --filter @workspace/mockup-sandbox run build

  # vite.config.ts outputs to: artifacts/mockup-sandbox/dist (absolute)
  SRC="$SCRIPT_DIR/artifacts/mockup-sandbox/dist"
  DEST="$SCRIPT_DIR/public"

  echo "==> Checking build output at: $SRC"
  if [ ! -d "$SRC" ]; then
    echo "ERROR: Build output not found at $SRC"
    echo "==> Searching for index.html in repo:"
    find "$SCRIPT_DIR" -name "index.html" -not -path "*/node_modules/*" 2>/dev/null | head -10
    exit 1
  fi

  echo "==> Build output found:"
  ls -la "$SRC"

  rm -rf "$DEST"
  cp -r "$SRC" "$DEST"
  echo "==> Deployed to: $DEST"
  ls "$DEST"
  