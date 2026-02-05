#!/usr/bin/env bash
set -e

REMOTE_PATH=/home/deploy/snappy
SSH_OPTS="-p 22 -o StrictHostKeyChecking=no"
TARGET="${SSH_USER}@${SSH_HOST}"
SNAPPY_CONFIG_B64=$(echo -n "${SNAPPY_CONFIG}" | base64 -w 0)
SNAPPY_VERSION="${GITHUB_SHA}"

echo "⚙️ Setting up server..."
ssh ${SSH_OPTS} "${TARGET}" "bash -s" < .github/scripts/setup-remote.sh

echo "📤 Syncing files..."
ssh ${SSH_OPTS} "${TARGET}" "mkdir -p ${REMOTE_PATH}"
rsync -avz --delete -e "ssh ${SSH_OPTS}" \
  --exclude='node_modules' --exclude='.git' --exclude='.github' \
  ./ "${TARGET}:${REMOTE_PATH}/"

echo "🚀 Running deploy on server..."
ssh ${SSH_OPTS} "${TARGET}" "bash -s" -- "${REMOTE_PATH}" "${SNAPPY_CONFIG_B64}" "${SNAPPY_VERSION}" < .github/scripts/deploy-remote.sh
