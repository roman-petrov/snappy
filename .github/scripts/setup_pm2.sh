setup_pm2() {
  if command -v pm2 &>/dev/null; then
    echo "✅ PM2 already installed: $(pm2 --version)"
    return
  fi

  echo "📦 Installing PM2..."
  npm install -g pm2
  pm2 startup systemd -u "${USER}" --hp "${HOME}" || true
  echo "✅ PM2 installed: $(pm2 --version)"
}
