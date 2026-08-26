#!/usr/bin/env bash
set -euo pipefail

backup_dir="/var/backups/simf"
source_dir="/var/www/simf/shared"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
work_dir="$(mktemp -d /var/backups/simf/.backup-work-XXXXXX)"
archive="${backup_dir}/simf-${timestamp}.tar.gz"

cleanup() {
  rm -rf -- "${work_dir}"
}
trap cleanup EXIT

install -d -m 0700 "${backup_dir}"
sqlite3 "${source_dir}/simf.db" ".backup '${work_dir}/simf.db'"
tar -czf "${archive}" \
  -C "${work_dir}" simf.db \
  -C "${source_dir}" uploads
sha256sum "${archive}" > "${archive}.sha256"
chmod 0600 "${archive}" "${archive}.sha256"

# A completed archive and checksum become the sole recovery pair. Cleanup only
# runs after both were created, so a failed backup never removes the last good
# recovery point.
find "${backup_dir}" -maxdepth 1 -type f \
  \( -name 'simf-*.tar.gz' -o -name 'simf-*.tar.gz.sha256' -o -name 'simf-*.db' \) \
  ! -path "${archive}" \
  ! -path "${archive}.sha256" \
  -delete
