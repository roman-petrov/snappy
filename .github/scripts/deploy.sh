#!/usr/bin/env bash
set -e

REMOTE_PATH="$1"
SNAPPY_CONFIG_B64="$2"

export PATH="$HOME/.bun/bin:$PATH"
cd "${REMOTE_PATH}"

echo "📦 Installing dependencies..."
bun install --production

echo "🔄 Restarting PM2..."
pm2 delete snappy-bot 2>/dev/null || true
cd packages/snappy-bot
SNAPPY_CONFIG="${SNAPPY_CONFIG_B64}" pm2 start bun --name snappy-bot --update-env -- run start
pm2 save

echo "📊 PM2 status:"
pm2 status snappy-bot
echo "✅ Deploy completed."
