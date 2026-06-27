#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "==> Script dir (repo root): $SCRIPT_DIR"
cd "$SCRIPT_DIR"

# Build the Lawctopus landing page
BASE_PATH="/" PORT=3000 NODE_ENV=production pnpm --filter @workspace/lawctopus-landing run build

SRC="$SCRIPT_DIR/artifacts/lawctopus-landing/dist/public"
DEST="$SCRIPT_DIR/public"

echo "==> Checking build output at: $SRC"
if [ ! -d "$SRC" ]; then
  echo "ERROR: Build output not found at $SRC"
  find "$SCRIPT_DIR" -name "index.html" -not -path "*/node_modules/*" 2>/dev/null | head -10
  exit 1
fi

echo "==> Build output found:"
ls -la "$SRC"

rm -rf "$DEST"
cp -r "$SRC" "$DEST"
echo "==> Deployed to: $DEST"
ls "$DEST"
