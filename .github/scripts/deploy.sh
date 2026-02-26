#!/usr/bin/env bash
# cspell:word setcap
set -e

echo "⚙️ Setting up server..."
if ! command -v node &>/dev/null; then
  echo "📦 Installing Node.js..."
  sudo apt-get update -qq
  sudo apt-get install -y -qq curl unzip
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
  echo "✅ Node.js installed: $(node --version)"
else
  echo "✅ Node.js already installed: $(node --version)"
fi

NODE_BIN=$(command -v node)
if [ -n "${NODE_BIN}" ]; then
  echo "🔓 Allowing Node to bind to port 80..."
  sudo setcap 'cap_net_bind_service=+ep' "$(readlink -f "${NODE_BIN}")" 2>/dev/null || true
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
  sudo npm install -g pm2
  sudo pm2 startup systemd -u "${USER}" --hp "${HOME}" || true
  echo "✅ PM2 installed: $(pm2 --version)"
else
  echo "✅ PM2 already installed: $(pm2 --version)"
fi

echo "🚀 Deploying app..."
REMOTE_PATH="${REMOTE_PATH:-/home/deploy/snappy}"
REPO_URL="https://x-access-token:${REPO_CLONE_TOKEN}@github.com/${GITHUB_REPO}.git"

rm -rf "${REMOTE_PATH}"
mkdir -p "$(dirname "${REMOTE_PATH}")"
git clone --depth 1 "${REPO_URL}" "${REMOTE_PATH}"
cd "${REMOTE_PATH}"
git fetch --depth 1 origin "${DEPLOY_REF}"
git checkout FETCH_HEAD

bun install --frozen-lockfile

pm2 delete snappy 2>/dev/null || true

pm2 start "bun do run" --name snappy --update-env
pm2 save

echo "📊 PM2 status:"
pm2 status
echo "✅ Deploy completed."
