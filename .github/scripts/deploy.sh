#!/usr/bin/env bash
set -e

REMOTE_PATH=/home/deploy/snappy
SSH_OPTS="-p 22 -o StrictHostKeyChecking=no"
SCP_OPTS="-P 22 -o StrictHostKeyChecking=no"
TARGET="${SSH_USER}@${SSH_HOST}"
SNAPPY_CONFIG_B64=$(echo -n "${SNAPPY_CONFIG}" | base64 -w 0)
# SNAPPY_VERSION is set by the workflow (inputs.version) and passed to deploy-remote.sh

echo "⚙️ Setting up server..."
ssh ${SSH_OPTS} "${TARGET}" "bash -s" < .github/scripts/setup-remote.sh

echo "📤 Uploading artifact..."
ssh ${SSH_OPTS} "${TARGET}" "mkdir -p ${REMOTE_PATH}"
scp ${SCP_OPTS} "${DIST_ZIP}" "${TARGET}:${REMOTE_PATH}/snappy.zip"

echo "🚀 Running deploy on server..."
ssh ${SSH_OPTS} "${TARGET}" "bash -s" -- "${REMOTE_PATH}" "${SNAPPY_CONFIG_B64}" "${SNAPPY_VERSION}" < .github/scripts/deploy-remote.sh
