#!/bin/sh
  set -e

  # This script lives in artifacts/api-server/ (Vercel Root Directory)
  # Go up 2 levels to reach the repo root
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
  echo "==> api-server dir: $SCRIPT_DIR"
  echo "==> Repo root: $REPO_ROOT"
  echo "==> CWD: $(pwd)"

  # Build the Vite frontend from the repo root
  cd "$REPO_ROOT"
  pnpm --filter @workspace/mockup-sandbox run build

  # Frontend outputs to artifacts/mockup-sandbox/dist
  SRC="$REPO_ROOT/artifacts/mockup-sandbox/dist"
  # Vercel outputDirectory is "public" relative to Root Directory (artifacts/api-server)
  DEST="$SCRIPT_DIR/public"

  echo "==> Checking build output at: $SRC"
  if [ ! -d "$SRC" ]; then
    echo "ERROR: Build output not found at $SRC"
    find "$REPO_ROOT" -name "index.html" -not -path "*/node_modules/*" 2>/dev/null | head -10
    exit 1
  fi

  echo "==> Build output found:"
  ls -la "$SRC"

  rm -rf "$DEST"
  cp -r "$SRC" "$DEST"
  echo "==> Copied to: $DEST"
  ls "$DEST"
  