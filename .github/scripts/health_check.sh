#!/usr/bin/env bash
set -euo pipefail

MAX_ATTEMPTS=10
RETRY_DELAY=3
FINGERPRINT_PATTERN='"sha256_cert_fingerprints":\["[0-9A-F]{2}(:[0-9A-F]{2}){31}"\]'

CHECKS=(
  "https://snappy-ai.ru/|"
  "https://snappy-ai.ru/app/|"
  "https://snappy-ai.ru/.well-known/assetlinks.json|${FINGERPRINT_PATTERN}"
)

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "🩺 Health check..."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'

check() {
  local url="$1"
  local pattern="${2:-}"
  local attempt=1
  local body

  while (( attempt <= MAX_ATTEMPTS )); do
    if body="$(curl -fsSL --max-time 30 "$url" 2>/dev/null)" && { [[ -z "$pattern" ]] || printf '%s' "$body" | grep -Eq "$pattern"; }; then
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

for entry in "${CHECKS[@]}"; do
  IFS='|' read -r url pattern <<< "$entry"
  check "$url" "$pattern"
done

echo '.'
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo "✅ All health checks passed."
echo "🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠"
echo '.'
