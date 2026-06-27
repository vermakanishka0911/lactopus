#!/bin/sh
  set -e

  REPO_ROOT="$(pwd)"
  echo "==> Running from: $REPO_ROOT"

  # Build the Vite frontend
  pnpm --filter @workspace/mockup-sandbox run build

  # The build outputs to artifacts/mockup-sandbox/dist
  SRC="$REPO_ROOT/artifacts/mockup-sandbox/dist"
  DEST="$REPO_ROOT/public"

  echo "==> Source dist: $SRC"
  ls -la "$SRC" || { echo "ERROR: dist not found at $SRC"; exit 1; }

  # Copy to /public where Vercel will find it
  rm -rf "$DEST"
  cp -r "$SRC" "$DEST"

  echo "==> Copied to: $DEST"
  ls -la "$DEST"
  