#!/usr/bin/env bash
set -e

REMOTE_PATH=/home/deploy/snappy
SSH_OPTS="-p 22 -o StrictHostKeyChecking=no"
SCP_OPTS="-P 22 -o StrictHostKeyChecking=no"
TARGET="${SSH_USER}@${SSH_HOST}"

encode() { echo -n "$1" | base64 -w 0; }

SSL_CERT_B64=$(encode "${SSL_CERT_PEM}")
SSL_KEY_B64=$(encode "${SSL_KEY_PEM}")

echo "⚙️ Setting up server..."
ssh ${SSH_OPTS} "${TARGET}" "bash -s" < .github/scripts/setup-remote.sh

echo "🧹 Cleaning deployment directory (contents only, keep dir to avoid uv_cwd ENOENT)..."
ssh ${SSH_OPTS} "${TARGET}" "mkdir -p ${REMOTE_PATH} && rm -rf ${REMOTE_PATH}/* ${REMOTE_PATH}/.??* 2>/dev/null; true"

echo "📤 Uploading artifact..."
scp ${SCP_OPTS} "${DIST_ZIP}" "${TARGET}:${REMOTE_PATH}/snappy.zip"

echo "🚀 Running deploy on server..."
ssh ${SSH_OPTS} "${TARGET}" \
  SNAPPY_VERSION="${SNAPPY_VERSION}" \
  DB_HOST="${DB_HOST}" \
  DB_PORT="${DB_PORT}" \
  DB_USER="${DB_USER}" \
  DB_PASSWORD="${DB_PASSWORD}" \
  DB_NAME="${DB_NAME}" \
  BOT_TOKEN="${BOT_TOKEN}" \
  BOT_API_KEY="${BOT_API_KEY}" \
  JWT_SECRET="${JWT_SECRET}" \
  GIGACHAT_AUTH_KEY="${GIGACHAT_AUTH_KEY}" \
  YOOKASSA_SECRET_KEY="${YOOKASSA_SECRET_KEY}" \
  YOOKASSA_SHOP_ID="${YOOKASSA_SHOP_ID}" \
  SSL_CERT_B64="${SSL_CERT_B64}" \
  SSL_KEY_B64="${SSL_KEY_B64}" \
  "bash -s" -- "${REMOTE_PATH}" < .github/scripts/deploy-remote.sh
