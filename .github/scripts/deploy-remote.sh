#!/usr/bin/env bash
set -e

REMOTE_PATH="$1"
SNAPPY_CONFIG_B64="$2"
SNAPPY_VERSION="$3"

cd "${REMOTE_PATH}"
echo "📦 Unpacking artifact..."
unzip -o -q snappy.zip
rm -f snappy.zip

echo "🔄 Restarting PM2..."
pm2 delete snappy-bot 2>/dev/null || true
pm2 delete snappy-site 2>/dev/null || true

cd "${REMOTE_PATH}"
SNAPPY_CONFIG="${SNAPPY_CONFIG_B64}" SNAPPY_VERSION="${SNAPPY_VERSION}" pm2 start node --name snappy-bot --update-env -- dist/bot/snappy-bot.js
pm2 start node --name snappy-site --update-env -- dist/site-server.js

pm2 save

echo "📊 PM2 status:"
pm2 status
echo "✅ Deploy completed."
