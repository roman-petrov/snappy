#!/usr/bin/env bash

deploy_env_value() {
  local key=$1
  local value=$2

  case "${key}" in
    SSL_CERT_PEM | SSL_KEY_PEM) echo -n "${value}" | base64 -w 0 ;;
    *) printf '%s' "${value}" ;;
  esac
}

encode_deploy_env() {
  local keys_file=$1
  local key value optional

  while IFS= read -r key || [[ -n "${key}" ]]; do
    [[ -z "${key}" || "${key}" == \#* ]] && continue
    optional=false
    if [[ "${key}" == \?* ]]; then
      optional=true
      key="${key:1}"
    fi
    value="${!key:-}"
    if [[ -z "${value}" ]]; then
      if [[ "${optional}" == true ]]; then
        continue
      fi
      echo "Missing environment variable: ${key}" >&2
      return 1
    fi
    value="$(deploy_env_value "${key}" "${value}")"
    printf '%s=%q\n' "${key}" "${value}"
  done < "${keys_file}" | base64 -w 0
}

load_deploy_env() {
  if [[ -z "${DEPLOY_ENV_B64:-}" ]]; then
    echo "Missing DEPLOY_ENV_B64" >&2
    return 1
  fi

  set -a
  source <(echo -n "${DEPLOY_ENV_B64}" | base64 -d)
  set +a
}
