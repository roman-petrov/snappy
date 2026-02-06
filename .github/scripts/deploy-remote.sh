#!/usr/bin/env bash
set -e

REMOTE_PATH="$1"
SNAPPY_CONFIG_B64="$2"
SNAPPY_VERSION="$3"
SSL_CERT_B64="$4"
SSL_KEY_B64="$5"

cd "${REMOTE_PATH}"
echo "📦 Unpacking artifact..."
unzip -o -q snappy.zip
rm -f snappy.zip

echo "🔄 Restarting PM2..."
pm2 delete snappy-bot 2>/dev/null || true
pm2 delete snappy-site 2>/dev/null || true

export SNAPPY_CONFIG="${SNAPPY_CONFIG_B64}"
export SNAPPY_VERSION="${SNAPPY_VERSION}"
export SSL_CERT_PEM="${SSL_CERT_B64}"
export SSL_KEY_PEM="${SSL_KEY_B64}"

cd "${REMOTE_PATH}"
pm2 start dist/bot/app.js --name snappy-bot --update-env
pm2 start dist/site/server.js --name snappy-site --update-env

pm2 save

echo "📊 PM2 status:"
pm2 status
echo "✅ Deploy completed."
