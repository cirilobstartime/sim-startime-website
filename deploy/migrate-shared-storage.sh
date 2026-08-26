#!/usr/bin/env bash
set -euo pipefail

app_dir="/var/www/simf/app"
shared_dir="/var/www/simf/shared"
legacy_db="${app_dir}/simf.db"
shared_db="${shared_dir}/simf.db"
temporary_db="${shared_dir}/.simf.db.migrating"

if systemctl is-active --quiet simf; then
  echo "Stop simf.service before migrating CMS storage." >&2
  exit 1
fi

install -d -o ubuntu -g ubuntu -m 0750 \
  "${shared_dir}" \
  "${shared_dir}/uploads/media" \
  "${shared_dir}/uploads/form-uploads"

if [[ -f "${shared_db}" ]]; then
  echo "Shared database already exists; leaving it unchanged."
elif [[ -f "${legacy_db}" ]]; then
  sqlite3 "${legacy_db}" ".backup '${temporary_db}'"
  chown ubuntu:ubuntu "${temporary_db}"
  chmod 0640 "${temporary_db}"
  mv "${temporary_db}" "${shared_db}"
  echo "Copied the legacy CMS database into shared storage."
else
  echo "No legacy database found; Payload will create the shared database on first start."
fi

for directory in media form-uploads; do
  legacy_uploads="${app_dir}/uploads/${directory}/"
  shared_uploads="${shared_dir}/uploads/${directory}/"
  if [[ -d "${legacy_uploads}" ]]; then
    rsync -a --ignore-existing "${legacy_uploads}" "${shared_uploads}"
    echo "Copied existing ${directory} files without overwriting shared files."
  fi
done

chown -R ubuntu:ubuntu "${shared_dir}/uploads"

echo "Shared CMS storage is ready. Legacy files were not deleted."
