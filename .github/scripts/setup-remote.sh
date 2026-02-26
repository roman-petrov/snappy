#!/usr/bin/env bash
# cspell:word setcap
set -e

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

if ! command -v bun &>/dev/null; then
  echo "📦 Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="${HOME}/.bun" && export PATH="${BUN_INSTALL}/bin:${PATH}"
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

echo ""
echo "📊 Installed versions:"
echo "  - Node.js: $(node --version)"
echo "  - Bun: $(bun --version 2>/dev/null || echo 'not in PATH')"
echo "  - PM2: $(pm2 --version)"
echo ""
