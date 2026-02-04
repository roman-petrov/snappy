#!/usr/bin/env bash
set -e

[ -d "$HOME/.bun/bin" ] && export PATH="$HOME/.bun/bin:$PATH"

echo "📦 Updating system packages..."
sudo apt-get update -qq

echo "🔧 Installing required utilities..."
sudo apt-get install -y -qq curl unzip

if ! command -v node &> /dev/null; then
  echo "📥 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
  echo "✅ Node.js installed: $(node --version)"
else
  echo "✅ Node.js already installed: $(node --version)"
fi

if ! command -v bun &> /dev/null; then
  echo "📥 Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
  echo "✅ Bun installed: $(bun --version)"
else
  echo "✅ Bun already installed: $(bun --version)"
fi

if ! command -v pm2 &> /dev/null; then
  echo "📥 Installing PM2..."
  sudo npm install -g pm2
  sudo pm2 startup systemd -u ${USER} --hp ${HOME} || true
  echo "✅ PM2 installed: $(pm2 --version)"
else
  echo "✅ PM2 already installed: $(pm2 --version)"
fi

echo ""
echo "🎉 Server setup completed successfully!"
echo ""
echo "📊 Installed versions:"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - Bun: $(bun --version)"
echo "  - PM2: $(pm2 --version)"
