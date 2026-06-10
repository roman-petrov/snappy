#!/usr/bin/env bash
set -e

DEPLOY_PATH="/home/deploy/snappy"
ARCHIVE="/tmp/snappy.tar.gz"

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "⚙️ Setting up server..."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'

rm -rf "${DEPLOY_PATH}"
mkdir -p "${DEPLOY_PATH}"
tar -xzf "${ARCHIVE}" -C "${DEPLOY_PATH}"
cd "${DEPLOY_PATH}"

setup_node
setup_bun
setup_pm2

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "🚀 Deploying app..."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'

bun install --frozen-lockfile

pm2 delete snappy 2>/dev/null || true
NODE_ENV=production bun do db:migrate:deploy
NODE_ENV=production NODE_OPTIONS="--use-system-ca" pm2 start "bun do server:prod" --name snappy --update-env
pm2 save
pm2 status

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "✅ Deploy completed."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'
