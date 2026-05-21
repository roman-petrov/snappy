setup_bun() {
  export PATH="${HOME}/.bun/bin:${PATH}"

  if command -v bun &>/dev/null; then
    echo "✅ Bun already installed: $(bun --version)"
    return
  fi

  echo "📦 Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="${HOME}/.bun/bin:${PATH}"
  echo "✅ Bun installed: $(bun --version)"
}
