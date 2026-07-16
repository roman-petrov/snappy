setup_pm2() {
  if ! command -v pm2 &>/dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
    pm2 startup systemd -u "${USER}" --hp "${HOME}" || true
    echo "✅ PM2 installed: $(pm2 --version)"
  else
    echo "✅ PM2 already installed: $(pm2 --version)"
  fi

  if ! pm2 describe pm2-logrotate &>/dev/null; then
    pm2 install pm2-logrotate
  fi
  pm2 set pm2-logrotate:max_size 10M
  pm2 set pm2-logrotate:retain 5
  pm2 set pm2-logrotate:compress true
}
