#!/usr/bin/env bash
set -euo pipefail

if command -v gitleaks >/dev/null 2>&1; then
  exec gitleaks git --redact --no-banner
fi

pattern='(BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY|AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|github_pat_[A-Za-z0-9_]{20,}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|SMTP_PASSWORD=[^[:space:]]+|PAYLOAD_SECRET=[^[:space:]]{20,}|FORM_SECURITY_SECRET=[^[:space:]]{20,}|ATTRIBUTION_SECURITY_SECRET=[^[:space:]]{20,})'

matches="$({ git grep -I -n -E "$pattern" -- ':!.env.example' ':!scripts/check-secrets.sh' || true; })"
if [[ -n "$matches" ]]; then
  echo "Potential secret detected in tracked files:" >&2
  echo "$matches" | sed -E 's/(=).+$/=REDACTED/' >&2
  exit 1
fi

echo "No common credential patterns detected in tracked files."
