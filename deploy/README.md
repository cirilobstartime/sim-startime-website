# SIMF deployment and recovery manual

This guide covers a manual deployment of the SIMF Next.js and Payload CMS
application on an Ubuntu AWS EC2 `t3.small`. The application listens only on
`127.0.0.1:3004`; Nginx provides the public HTTPS endpoint.

The CMS database and uploaded files are deliberately stored outside the Git
checkout:

- Application: `/var/www/simf/app`
- SQLite database: `/var/www/simf/shared/simf.db`
- CMS media: `/var/www/simf/shared/uploads/media`
- Form uploads: `/var/www/simf/shared/uploads/form-uploads`
- Environment file: `/etc/simf/simf.env`
- Backups: `/var/backups/simf`

Never replace `/var/www/simf/shared` or `/etc/simf/simf.env` during a code
deployment. This preserves live CMS content, users, form submissions, images,
Arabic content, and marketing configuration.

## 1. Server requirements

- Ubuntu 22.04 LTS or 24.04 LTS
- EC2 `t3.small` or larger
- At least 20 GB gp3 storage
- Node.js 20 or 22 LTS and npm
- Nginx, Certbot, SQLite, Git, rsync and build tools
- A stable public/Elastic IP with DNS pointing to it
- Ports 22, 80 and 443 allowed in the security group

Install the operating-system packages:

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx sqlite3 rsync git build-essential
```

Install Node.js from the approved NodeSource or company package source, then
verify it:

```bash
node --version
npm --version
```

The version must satisfy the `engines.node` range in `package.json`.

### Configure swap for a t3.small

A production build can briefly need more memory than the 2 GB available on a
`t3.small`. Add 2 GB swap once per server:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

Do not add the `/etc/fstab` entry a second time if swap already exists.

## 2. First deployment

Create the application and persistent directories:

```bash
sudo install -d -o ubuntu -g ubuntu -m 0750 /var/www/simf/app
sudo install -d -o ubuntu -g ubuntu -m 0750 /var/www/simf/shared/uploads/media
sudo install -d -o ubuntu -g ubuntu -m 0750 /var/www/simf/shared/uploads/form-uploads
sudo install -d -o root -g root -m 0750 /etc/simf
```

Clone and build the application:

```bash
git clone git@github.com:cirilobstartime/sim-startime-website.git /var/www/simf/app
cd /var/www/simf/app
npm ci
NODE_OPTIONS=--max-old-space-size=1536 NEXT_TELEMETRY_DISABLED=1 npm run build
```

Create `/etc/simf/simf.env` from `.env.example`. Generate different random
values of at least 32 characters for `PAYLOAD_SECRET`,
`FORM_SECURITY_SECRET`, and `ATTRIBUTION_SECURITY_SECRET`. Keep SMTP passwords
and all credentials only in this server file.

Production paths and port must be:

```dotenv
DATABASE_URL=file:/var/www/simf/shared/simf.db
MEDIA_UPLOAD_DIR=/var/www/simf/shared/uploads/media
FORM_UPLOAD_DIR=/var/www/simf/shared/uploads/form-uploads
NEXT_PUBLIC_APP_URL=https://sim.startime.sa
NEXT_PUBLIC_ALLOW_INDEXING=true
PORT=3004
```

Protect the environment file:

```bash
sudo chown root:root /etc/simf/simf.env
sudo chmod 600 /etc/simf/simf.env
```

Install and start the service:

```bash
sudo cp deploy/simf.service /etc/systemd/system/simf.service
sudo systemctl daemon-reload
sudo systemctl enable --now simf
sudo systemctl status simf --no-pager
curl -I http://127.0.0.1:3004/
```

## 3. Nginx and HTTPS

Install the rate-limit configuration in Nginx's `http` context and validate it:

```bash
sudo cp deploy/nginx-simf-rate-limit.conf /etc/nginx/conf.d/simf-rate-limit.conf
sudo nginx -t
```

Before a certificate exists, use the HTTP configuration and request the
certificate:

```bash
sudo cp deploy/nginx-simf.conf /etc/nginx/sites-available/simf
sudo ln -sfn /etc/nginx/sites-available/simf /etc/nginx/sites-enabled/simf
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d sim.startime.sa -d www.sim.startime.sa
```

After Certbot succeeds, install the maintained SSL configuration:

```bash
sudo cp deploy/nginx-simf-ssl.conf /etc/nginx/sites-available/simf
sudo nginx -t
sudo systemctl reload nginx
curl -I https://sim.startime.sa/
```

Never reload Nginx if `sudo nginx -t` reports an error.

## 4. Enable automatic backups

Install the backup command and timer:

```bash
sudo install -m 0750 deploy/simf-backup.sh /usr/local/sbin/simf-backup
sudo cp deploy/simf-backup.service /etc/systemd/system/simf-backup.service
sudo cp deploy/simf-backup.timer /etc/systemd/system/simf-backup.timer
sudo systemctl daemon-reload
sudo systemctl enable --now simf-backup.timer
sudo systemctl start simf-backup.service
sudo systemctl status simf-backup.service --no-pager
sudo ls -lh /var/backups/simf
```

The backup script keeps the latest successful database-and-uploads recovery
pair. Copy important backups to storage outside the instance before destructive
infrastructure changes.

## 5. Routine code deployment

These steps update code without replacing live CMS data. Record the current
revision and check server health:

```bash
cd /var/www/simf/app
git rev-parse HEAD
git status --short
df -h
free -h
sudo systemctl status simf --no-pager
```

The production checkout should be clean. Investigate unexpected local changes
instead of overwriting them.

Create and verify a backup:

```bash
sudo systemctl start simf-backup.service
sudo systemctl status simf-backup.service --no-pager
sudo ls -lh /var/backups/simf
```

Fetch, build and restart:

```bash
cd /var/www/simf/app
git fetch origin
git switch main
git pull --ff-only origin main
npm ci
NODE_OPTIONS=--max-old-space-size=1536 NEXT_TELEMETRY_DISABLED=1 npm run build
sudo systemctl restart simf
sudo systemctl status simf --no-pager
curl -I http://127.0.0.1:3004/
curl -I https://sim.startime.sa/
```

Verify the homepage, one content page, `/content-admin`, an uploaded image and
each public form. Do not run the seed command on production. Run a named data
migration only when that deployment explicitly requires it.

## 6. Roll back a failed code deployment

Use the commit recorded before deployment:

```bash
cd /var/www/simf/app
git switch --detach PREVIOUS_COMMIT_SHA
npm ci
NODE_OPTIONS=--max-old-space-size=1536 NEXT_TELEMETRY_DISABLED=1 npm run build
sudo systemctl restart simf
curl -I http://127.0.0.1:3004/
```

After the problem is fixed in `main`, return with `git switch main`, pull and
deploy normally. A code rollback does not alter the shared database or uploads.

## 7. Restore CMS data and uploads

Only restore data when the database or uploads are damaged. Identify a backup
and validate its checksum:

```bash
cd /var/backups/simf
sha256sum -c simf-YYYYMMDDTHHMMSSZ.tar.gz.sha256
```

Stop the application and extract into a temporary directory:

```bash
sudo systemctl stop simf
restore_dir="$(mktemp -d /var/backups/simf/restore-XXXXXX)"
sudo tar -xzf /var/backups/simf/simf-YYYYMMDDTHHMMSSZ.tar.gz -C "$restore_dir"
sudo sqlite3 "$restore_dir/simf.db" 'PRAGMA integrity_check;'
```

Proceed only if SQLite returns `ok`. Preserve the damaged data before replacing
it, then restore:

```bash
sudo mv /var/www/simf/shared/simf.db /var/www/simf/shared/simf.db.before-restore
sudo rsync -a /var/www/simf/shared/uploads/ /var/www/simf/shared/uploads.before-restore/
sudo install -o ubuntu -g ubuntu -m 0640 "$restore_dir/simf.db" /var/www/simf/shared/simf.db
sudo rsync -a "$restore_dir/uploads/" /var/www/simf/shared/uploads/
sudo chown -R ubuntu:ubuntu /var/www/simf/shared/uploads
sudo systemctl start simf
sudo systemctl status simf --no-pager
```

## 8. Troubleshooting

### Website shows 502 Bad Gateway

```bash
sudo systemctl status simf --no-pager
sudo journalctl -u simf -n 150 --no-pager
sudo ss -ltnp | grep 3004
curl -I http://127.0.0.1:3004/
sudo nginx -t
sudo tail -n 100 /var/log/nginx/error.log
```

If port 3004 is absent, fix the application error shown in the journal. Do not
change Nginx to another port unless the service environment was intentionally
changed too.

### Build is killed or reports out-of-memory

```bash
free -h
swapon --show
df -h
```

Confirm the 2 GB swap is active, close unnecessary processes, and use the
documented `NODE_OPTIONS` build limit. Avoid building while a large image
conversion or backup is active.

### CMS freezes while saving or uploading

```bash
free -h
df -h
sudo journalctl -u simf --since '20 minutes ago' --no-pager
sudo sqlite3 /var/www/simf/shared/simf.db 'PRAGMA integrity_check;'
sudo find /var/www/simf/shared -maxdepth 2 -printf '%u:%g %m %p\n' | head -80
```

The database integrity result must be `ok`, the shared directories must be
writable by `ubuntu`, and the disk must have free space. Check image dimensions
and file size when the issue occurs only for one upload.

### Disk is nearly full

```bash
df -h
sudo du -xhd1 /var /var/www /var/backups 2>/dev/null | sort -h
sudo journalctl --disk-usage
npm cache verify
```

Remove only confirmed caches or obsolete files. Never delete
`/var/www/simf/shared`, `/etc/simf`, or the latest verified backup. To reduce
journal size safely:

```bash
sudo journalctl --vacuum-time=14d
```

### Uploaded images return 404

```bash
sudo grep -E '^(MEDIA_UPLOAD_DIR|FORM_UPLOAD_DIR|DATABASE_URL)=' /etc/simf/simf.env
sudo ls -la /var/www/simf/shared/uploads/media | head
sudo chown -R ubuntu:ubuntu /var/www/simf/shared/uploads
sudo systemctl restart simf
```

### Form succeeds but email is not received

```bash
sudo grep -E '^(SMTP_HOST|SMTP_PORT|SMTP_SECURE|SMTP_USER|EMAIL_FROM_ADDRESS|FORM_NOTIFICATION_EMAIL|FORM_NOTIFICATION_CC)=' /etc/simf/simf.env
sudo journalctl -u simf --since '30 minutes ago' --no-pager
```

Do not print `SMTP_PASSWORD`. Confirm the Google Workspace app password is
valid, the sender matches the authenticated mailbox, and the recipient has not
quarantined the message.

### Certificate renewal fails

```bash
sudo certbot certificates
sudo certbot renew --dry-run
sudo nginx -t
sudo journalctl -u certbot.timer -n 100 --no-pager
```

DNS must still resolve to this instance and inbound port 80 must be reachable
for an HTTP challenge.

### Analytics or pixels stop loading

Confirm the IDs in Payload Marketing Settings, then inspect the browser network
panel and Content Security Policy errors. The application supplies a per-request
nonce for approved inline scripts. Do not weaken the policy globally to solve a
single blocked third-party endpoint.

## 9. Operational checklist

- Keep database files, uploads and secrets out of Git.
- Keep CMS data in `/var/www/simf/shared`.
- Back up before every deployment and infrastructure change.
- Test `nginx -t` before every reload.
- Deploy one infrastructure change at a time.
- Keep at least one recovery copy outside the EC2 instance.
- Monitor disk space and memory on the `t3.small`.
- Apply operating-system and npm security updates during a tested maintenance
  window.
