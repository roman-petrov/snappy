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

VERSION="$(tr -d '[:space:]' < .node-version)"
NODE_DIR="${HOME}/.local/node-v${VERSION}"

if [[ ! -x "${NODE_DIR}/bin/node" ]] || [[ "$("${NODE_DIR}/bin/node" -v 2>/dev/null)" != "v${VERSION}" ]]; then
  echo "📦 Installing Node.js..."
  rm -rf "${NODE_DIR}"
  mkdir -p "${NODE_DIR}"
  curl -fsSL "https://nodejs.org/dist/v${VERSION}/node-v${VERSION}-linux-x64.tar.xz" |
    tar -xJ --strip-components=1 -C "${NODE_DIR}"
  echo "✅ Node.js installed: $("${NODE_DIR}/bin/node" --version)"
else
  echo "✅ Node.js already installed: $("${NODE_DIR}/bin/node" --version)"
fi

export PATH="${NODE_DIR}/bin:${HOME}/.bun/bin:${PATH}"

if ! command -v bun &>/dev/null; then
  echo "📦 Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="${HOME}/.bun/bin:${PATH}"
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

bun install --frozen-lockfile

pm2 delete snappy 2>/dev/null || true
NODE_ENV=production NODE_OPTIONS="--use-system-ca" pm2 start "bun do deploy-run" --name snappy --update-env
pm2 save
pm2 status

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "✅ Deploy completed."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'
