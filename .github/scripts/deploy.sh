#!/usr/bin/env bash
set -e

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "⚙️ Setting up server..."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'

if ! command -v node &>/dev/null; then
  echo "📦 Installing Node.js..."
  apt-get update -qq
  apt-get install -y -qq curl unzip
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
  apt-get install -y -qq nodejs
  echo "✅ Node.js installed: $(node --version)"
else
  echo "✅ Node.js already installed: $(node --version)"
fi

export PATH="${HOME}/.bun/bin:${PATH}"
if ! command -v bun &>/dev/null; then
  echo "📦 Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  echo "✅ Bun installed: $(bun --version)"
else
  echo "✅ Bun already installed: $(bun --version)"
fi

if ! command -v pm2 &>/dev/null; then
  echo "📦 Installing PM2..."
  npm install -g pm2
  pm2 startup systemd -u "${USER}" --hp "${HOME}" || true
  echo "✅ PM2 installed: $(pm2 --version)"
else
  echo "✅ PM2 already installed: $(pm2 --version)"
fi

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "🚀 Deploying app..."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'

DEPLOY_PATH="/home/deploy/snappy"
ARCHIVE="/tmp/snappy.tar.gz"

rm -rf "${DEPLOY_PATH}"
mkdir -p "${DEPLOY_PATH}"
tar -xzf "${ARCHIVE}" -C "${DEPLOY_PATH}"
cd "${DEPLOY_PATH}"

bun install --frozen-lockfile

pm2 delete snappy 2>/dev/null || true
pm2 start "bun do deploy-run" --name snappy --update-env
pm2 save
pm2 status

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "✅ Deploy completed."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'