#!/usr/bin/env bash
set -e

REMOTE_PATH="$1"
export PATH="${HOME}/.bun/bin:${PATH}"

cd "${REMOTE_PATH}"
echo "📦 Unpacking artifact..."
unzip -o -q snappy.zip
rm -f snappy.zip

echo "📥 Installing production dependencies..."
bun install --production --frozen-lockfile

echo "🔄 Restarting PM2..."
pm2 delete snappy 2>/dev/null || true

export SNAPPY_VERSION="${SNAPPY_VERSION}"
export DB_HOST="${DB_HOST}"
export DB_PORT="${DB_PORT}"
export DB_USER="${DB_USER}"
export DB_PASSWORD="${DB_PASSWORD}"
export DB_NAME="${DB_NAME}"
export BOT_TOKEN="${BOT_TOKEN}"
export BOT_API_KEY="${BOT_API_KEY}"
export JWT_SECRET="${JWT_SECRET}"
export GIGACHAT_AUTH_KEY="${GIGACHAT_AUTH_KEY}"
export YOOKASSA_SECRET_KEY="${YOOKASSA_SECRET_KEY}"
export YOOKASSA_SHOP_ID="${YOOKASSA_SHOP_ID}"
export SSL_CERT_PEM="${SSL_CERT_B64}"
export SSL_KEY_PEM="${SSL_KEY_B64}"

cd "${REMOTE_PATH}"
pm2 start dist/server.js --name snappy --update-env

pm2 save

echo "📊 PM2 status:"
pm2 status
echo "✅ Deploy completed."
