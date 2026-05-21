setup_node() {
  local version dir
  version="$(tr -d '[:space:]' < .node-version)"
  dir="${HOME}/.local/node-v${version}"

  export PATH="${dir}/bin:${PATH}"

  if [[ -x "${dir}/bin/node" ]] && [[ "$("${dir}/bin/node" -v 2>/dev/null)" == "v${version}" ]]; then
    echo "✅ Node.js already installed: $("${dir}/bin/node" --version)"
    return
  fi

  echo "📦 Installing Node.js..."
  rm -rf "${dir}"
  mkdir -p "${dir}"
  curl -fsSL "https://nodejs.org/dist/v${version}/node-v${version}-linux-x64.tar.xz" |
    tar -xJ --strip-components=1 -C "${dir}"
  echo "✅ Node.js installed: $("${dir}/bin/node" --version)"
}
