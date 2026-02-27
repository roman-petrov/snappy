#!/usr/bin/env bash
set -e

printf '\n'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "⚙️ Setting up server..."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
printf '\n'

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

printf '\n'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "🚀 Deploying app..."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
printf '\n'

REMOTE_PATH="/home/deploy/snappy"
REPO_URL="https://x-access-token:${REPO_CLONE_TOKEN}@github.com/${GITHUB_REPO}.git"

rm -rf "${REMOTE_PATH}"
mkdir -p "${REMOTE_PATH}"
git clone --depth 1 "${REPO_URL}" "${REMOTE_PATH}"
cd "${REMOTE_PATH}"
git fetch --depth 1 origin "${DEPLOY_REF}"
git checkout FETCH_HEAD

bun install --frozen-lockfile

export NODE_ENV=production
export SNAPPY_VERSION="${DEPLOY_REF}"

pm2 delete snappy 2>/dev/null || true
pm2 start "bun do run" --name snappy --update-env
pm2 save
pm2 status

printf '\n'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "✅ Deploy completed."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
printf '\n'