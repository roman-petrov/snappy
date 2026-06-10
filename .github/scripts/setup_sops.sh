#!/usr/bin/env bash

setup_sops() {
  if command -v sops &>/dev/null; then
    echo "✅ SOPS already installed: $(sops --version 2>&1 | head -n 1)"
    return
  fi

  echo "📦 Installing SOPS..."
  version="3.13.1"
  curl -fsSL "https://github.com/getsops/sops/releases/download/v${version}/sops-v${version}.linux.amd64" -o /tmp/sops
  chmod +x /tmp/sops
  sudo mv /tmp/sops /usr/local/bin/sops
  echo "✅ SOPS installed: $(sops --version 2>&1 | head -n 1)"
}
