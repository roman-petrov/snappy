#!/usr/bin/env bash
set -euo pipefail

MAX_ATTEMPTS=10
RETRY_DELAY=3
URLS=(
  "https://snappy-ai.ru/"
  "https://snappy-ai.ru/app/"
)

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "🩺 Health check..."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'

check_url() {
  local url="$1"
  local attempt=1

  while (( attempt <= MAX_ATTEMPTS )); do
    if curl -fsSL --max-time 30 "$url" -o /dev/null; then
      echo "✅ ${url}"
      return 0
    fi

    echo "❌ ${url} (attempt ${attempt}/${MAX_ATTEMPTS})"
    if (( attempt < MAX_ATTEMPTS )); then
      echo "⏳ Retry in ${RETRY_DELAY}s..."
      sleep "${RETRY_DELAY}"
    fi
    attempt=$((attempt + 1))
  done

  echo "💥 Health check failed: ${url}"
  return 1
}

for url in "${URLS[@]}"; do
  check_url "${url}"
done

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "✅ All health checks passed."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'
