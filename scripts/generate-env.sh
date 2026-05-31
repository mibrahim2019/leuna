#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_FILE="$ROOT_DIR/.env.example"
OUTPUT_FILE="$ROOT_DIR/.env"
FORCE=0

if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
fi

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "Template file not found: $TEMPLATE_FILE" >&2
  exit 1
fi

if [[ -f "$OUTPUT_FILE" && "$FORCE" -ne 1 ]]; then
  echo ".env already exists at $OUTPUT_FILE" >&2
  echo "Re-run with --force to overwrite it." >&2
  exit 1
fi

random_base64() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -base64 32 | tr -d '\n'
    return
  fi

  node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
}

random_hex() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32 | tr -d '\n'
    return
  fi

  node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
}

NEXTAUTH_SECRET_VALUE="$(random_base64)"
ENCRYPTION_KEY_VALUE="$(random_hex)"
ENCRYPTION_SECONDARY_KEY_VALUE="$(random_hex)"

while IFS= read -r line || [[ -n "$line" ]]; do
  case "$line" in
    'NEXTAUTH_SECRET="secret"')
      printf 'NEXTAUTH_SECRET="%s"\n' "$NEXTAUTH_SECRET_VALUE"
      ;;
    'NEXT_PRIVATE_ENCRYPTION_KEY="CAFEBABE"')
      printf 'NEXT_PRIVATE_ENCRYPTION_KEY="%s"\n' "$ENCRYPTION_KEY_VALUE"
      ;;
    'NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY="DEADBEEF"')
      printf 'NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY="%s"\n' "$ENCRYPTION_SECONDARY_KEY_VALUE"
      ;;
    'NEXT_PRIVATE_GOOGLE_CLIENT_ID=""')
      printf 'NEXT_PRIVATE_GOOGLE_CLIENT_ID="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_GOOGLE_CLIENT_SECRET=""')
      printf 'NEXT_PRIVATE_GOOGLE_CLIENT_SECRET="CHANGE_ME"\n'
      ;;
    'NEXT_PUBLIC_WEBAPP_URL="http://localhost:3000"')
      printf 'NEXT_PUBLIC_WEBAPP_URL="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_INTERNAL_WEBAPP_URL="http://localhost:3000"')
      printf 'NEXT_PRIVATE_INTERNAL_WEBAPP_URL="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_DATABASE_URL="postgres://documenso:password@127.0.0.1:54320/documenso"')
      printf 'NEXT_PRIVATE_DATABASE_URL="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_DIRECT_DATABASE_URL="postgres://documenso:password@127.0.0.1:54320/documenso"')
      printf 'NEXT_PRIVATE_DIRECT_DATABASE_URL="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_SIGNING_PASSPHRASE=')
      printf 'NEXT_PRIVATE_SIGNING_PASSPHRASE="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_SIGNING_LOCAL_FILE_PATH=')
      printf 'NEXT_PRIVATE_SIGNING_LOCAL_FILE_PATH="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_SIGNING_LOCAL_FILE_CONTENTS=')
      printf 'NEXT_PRIVATE_SIGNING_LOCAL_FILE_CONTENTS="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_KEY_PATH=')
      printf 'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_KEY_PATH=\n'
      ;;
    'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_PUBLIC_CRT_FILE_PATH=')
      printf 'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_PUBLIC_CRT_FILE_PATH=\n'
      ;;
    'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_PUBLIC_CRT_FILE_CONTENTS=')
      printf 'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_PUBLIC_CRT_FILE_CONTENTS=\n'
      ;;
    'NEXT_PRIVATE_SIGNING_GCLOUD_APPLICATION_CREDENTIALS_CONTENTS=')
      printf 'NEXT_PRIVATE_SIGNING_GCLOUD_APPLICATION_CREDENTIALS_CONTENTS=\n'
      ;;
    'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_CERT_CHAIN_FILE_PATH=')
      printf 'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_CERT_CHAIN_FILE_PATH=\n'
      ;;
    'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_CERT_CHAIN_CONTENTS=')
      printf 'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_CERT_CHAIN_CONTENTS=\n'
      ;;
    'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_SECRET_MANAGER_CERT_PATH=')
      printf 'NEXT_PRIVATE_SIGNING_GCLOUD_HSM_SECRET_MANAGER_CERT_PATH=\n'
      ;;
    'NEXT_PUBLIC_UPLOAD_TRANSPORT="database"')
      printf 'NEXT_PUBLIC_UPLOAD_TRANSPORT="database"\n'
      ;;
    'NEXT_PRIVATE_UPLOAD_ENDPOINT="http://127.0.0.1:9002"')
      printf 'NEXT_PRIVATE_UPLOAD_ENDPOINT=\n'
      ;;
    'NEXT_PRIVATE_UPLOAD_REGION="unknown"')
      printf 'NEXT_PRIVATE_UPLOAD_REGION=\n'
      ;;
    'NEXT_PRIVATE_UPLOAD_BUCKET="documenso"')
      printf 'NEXT_PRIVATE_UPLOAD_BUCKET=\n'
      ;;
    'NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID="documenso"')
      printf 'NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID=\n'
      ;;
    'NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY="password"')
      printf 'NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY=\n'
      ;;
    'NEXT_PRIVATE_SMTP_TRANSPORT="smtp-auth"')
      printf 'NEXT_PRIVATE_SMTP_TRANSPORT="resend"\n'
      ;;
    'NEXT_PRIVATE_SMTP_HOST="127.0.0.1"')
      printf 'NEXT_PRIVATE_SMTP_HOST=\n'
      ;;
    'NEXT_PRIVATE_SMTP_PORT=2500')
      printf 'NEXT_PRIVATE_SMTP_PORT=\n'
      ;;
    'NEXT_PRIVATE_SMTP_USERNAME="documenso"')
      printf 'NEXT_PRIVATE_SMTP_USERNAME=\n'
      ;;
    'NEXT_PRIVATE_SMTP_PASSWORD="password"')
      printf 'NEXT_PRIVATE_SMTP_PASSWORD=\n'
      ;;
    'NEXT_PRIVATE_SMTP_FROM_NAME="Sign"')
      printf 'NEXT_PRIVATE_SMTP_FROM_NAME="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_SMTP_FROM_ADDRESS="noreply@leuna.app"')
      printf 'NEXT_PRIVATE_SMTP_FROM_ADDRESS="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_RESEND_API_KEY=')
      printf 'NEXT_PRIVATE_RESEND_API_KEY="CHANGE_ME"\n'
      ;;
    'NEXT_PRIVATE_SES_ACCESS_KEY_ID=')
      printf 'NEXT_PRIVATE_SES_ACCESS_KEY_ID=\n'
      ;;
    'NEXT_PRIVATE_SES_SECRET_ACCESS_KEY=')
      printf 'NEXT_PRIVATE_SES_SECRET_ACCESS_KEY=\n'
      ;;
    'NEXT_PRIVATE_SES_REGION=')
      printf 'NEXT_PRIVATE_SES_REGION=\n'
      ;;
    'NEXT_PRIVATE_JOBS_PROVIDER="local"')
      printf 'NEXT_PRIVATE_JOBS_PROVIDER="local"\n'
      ;;
    'NEXT_PRIVATE_INNGEST_EVENT_KEY=')
      printf 'NEXT_PRIVATE_INNGEST_EVENT_KEY=\n'
      ;;
    'NEXT_PRIVATE_REDIS_URL="redis://localhost:63790"')
      printf 'NEXT_PRIVATE_REDIS_URL=\n'
      ;;
    'NEXT_PRIVATE_REDIS_PREFIX="documenso"')
      printf 'NEXT_PRIVATE_REDIS_PREFIX=\n'
      ;;
    *)
      printf '%s\n' "$line"
      ;;
  esac
done < "$TEMPLATE_FILE" > "$OUTPUT_FILE"

cat <<EOF
Generated $OUTPUT_FILE

Generated secrets:
- NEXTAUTH_SECRET
- NEXT_PRIVATE_ENCRYPTION_KEY
- NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY

Still set to CHANGE_ME:
- NEXT_PUBLIC_WEBAPP_URL
- NEXT_PRIVATE_INTERNAL_WEBAPP_URL
- NEXT_PRIVATE_DATABASE_URL
- NEXT_PRIVATE_DIRECT_DATABASE_URL
- NEXT_PRIVATE_GOOGLE_CLIENT_ID
- NEXT_PRIVATE_GOOGLE_CLIENT_SECRET
- NEXT_PRIVATE_RESEND_API_KEY
- NEXT_PRIVATE_SMTP_FROM_NAME
- NEXT_PRIVATE_SMTP_FROM_ADDRESS
- NEXT_PRIVATE_SIGNING_PASSPHRASE
- NEXT_PRIVATE_SIGNING_LOCAL_FILE_PATH
- NEXT_PRIVATE_SIGNING_LOCAL_FILE_CONTENTS
EOF
