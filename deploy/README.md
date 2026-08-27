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

## Database and dataset availability

The production database is intentionally not committed to GitHub. The company
repository is public, while the SQLite database can contain CMS accounts,
password hashes, sessions, contact details, form submissions, attribution data
and references to private uploads. Upload archives may also contain documents
submitted through forms. A Git commit is permanent history and is therefore
not an acceptable database delivery mechanism, even if the file is removed in
a later commit.

Two supported setup paths are available:

1. **Clean reproducible environment:** create a new local SQLite database and
   run `npm run seed`. This installs the approved public English and Arabic
   pages, forms, media sourced from the repository, news content and CMS
   settings without copying production users or submissions.
2. **Exact authorized recovery:** obtain the latest verified
   database-and-uploads archive from the infrastructure owner through private,
   access-controlled storage. Production creates this archive under
   `/var/backups/simf`; it must never be attached to a GitHub issue, sent by
   ordinary email or chat, or committed to either repository.

### Where an exact production recovery archive is obtained

The authoritative live files are:

- Database: `/var/www/simf/shared/simf.db`
- Media and private uploads: `/var/www/simf/shared/uploads`
- Latest recovery archive: `/var/backups/simf/simf-<UTC_TIMESTAMP>.tar.gz`
- Integrity checksum: the matching `.tar.gz.sha256` file
- Protected runtime configuration: `/etc/simf/simf.env`

Only an authorized infrastructure operator may access these paths. Before
providing a recovery copy, create a fresh consistent archive and verify it on
the server:

```bash
sudo systemctl start simf-backup.service
sudo systemctl status simf-backup.service --no-pager
sudo ls -1t /var/backups/simf/simf-*.tar.gz | head -n 1
cd /var/backups/simf
sudo sha256sum -c simf-YYYYMMDDTHHMMSSZ.tar.gz.sha256
```

Transfer the archive and checksum only over an approved encrypted channel. For
example, an authorized engineer can use SSH/rsync from their workstation:

```bash
mkdir -m 0700 private-recovery
rsync -av --rsync-path='sudo rsync' \
  ubuntu@SERVER_ADDRESS:/var/backups/simf/simf-YYYYMMDDTHHMMSSZ.tar.gz \
  ubuntu@SERVER_ADDRESS:/var/backups/simf/simf-YYYYMMDDTHHMMSSZ.tar.gz.sha256 \
  private-recovery/
cd private-recovery
sha256sum -c simf-YYYYMMDDTHHMMSSZ.tar.gz.sha256
```

Replace `SERVER_ADDRESS` and the timestamp with values supplied by the
infrastructure owner. Do not add the downloaded directory to the repository.
For long-term off-instance retention, use a private company-controlled object
storage location with encryption, versioning, least-privilege access and an
appropriate retention policy. Store its access instructions in the company's
credential or infrastructure system, not in Git.

The environment file is backed up and distributed separately through the
company's secret-management process. Never bundle `/etc/simf/simf.env` into the
database archive. An engineer who only needs a local test environment must use
new development secrets and must not request production SMTP credentials.

### Create a clean local database

Use this path for development, build verification and most deployment tests:

```bash
git clone git@github.com:cirilobstartime/sim-startime-website.git
cd sim-startime-website
cp .env.example .env.local
npm ci
npm run seed
npm run dev -- --port 3004
```

Set development-only values of at least 32 characters for `PAYLOAD_SECRET`,
`FORM_SECURITY_SECRET` and `ATTRIBUTION_SECURITY_SECRET` in `.env.local`.
Leave SMTP variables empty unless email delivery is explicitly being tested.
Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` locally.

Create a local administrator without placing its password in a file or shell
history:

```bash
export ADMIN_EMAIL='developer@example.com'
read -s ADMIN_PASSWORD
export ADMIN_PASSWORD
npm run create-admin
unset ADMIN_EMAIL ADMIN_PASSWORD
```

The seed command is intended for a new local database. Do not run it against
production or an exact recovery copy because it can replace CMS-managed public
content with repository defaults.

### Restore an authorized archive locally

After receiving the archive and verifying its checksum, restore it outside the
Git working tree's tracked files:

```bash
mkdir -p .runtime/restore .runtime/uploads
tar -xzf private-recovery/simf-YYYYMMDDTHHMMSSZ.tar.gz -C .runtime/restore
sqlite3 .runtime/restore/simf.db 'PRAGMA integrity_check;'
install -m 0600 .runtime/restore/simf.db .runtime/simf.db
rsync -a .runtime/restore/uploads/ .runtime/uploads/
```

Proceed only when SQLite prints `ok`. Configure `.env.local` with explicit
absolute paths for that workstation:

```dotenv
DATABASE_URL=file:/ABSOLUTE/PATH/TO/sim-startime-website/.runtime/simf.db
MEDIA_UPLOAD_DIR=/ABSOLUTE/PATH/TO/sim-startime-website/.runtime/uploads/media
FORM_UPLOAD_DIR=/ABSOLUTE/PATH/TO/sim-startime-website/.runtime/uploads/form-uploads
NEXT_PUBLIC_APP_URL=http://localhost:3004
NEXT_PUBLIC_ALLOW_INDEXING=false
PORT=3004
```

Also configure new local-only security secrets. Production SMTP credentials
are not required to browse and verify restored content. If email testing is
necessary, use an approved non-production mailbox. Then run:

```bash
npm ci
npm run build
npm run dev -- --port 3004
```

Verify the homepage, English and Arabic records, CMS media, and representative
content. Do not submit real forms from a production recovery copy. When work is
complete, securely remove the local recovery archive and `.runtime` data in
accordance with company policy.

### Required database configuration

`DATABASE_URL` is the only database connection variable. SIMF uses Payload's
SQLite adapter with write-ahead logging enabled. Media files are not stored
inside SQLite, so `MEDIA_UPLOAD_DIR` and `FORM_UPLOAD_DIR` must point to the
matching restored upload directories. Restoring only `simf.db` can leave media
records without their files.

The following values are also required for a functioning application but are
not database credentials:

- `PAYLOAD_SECRET`: signs Payload sessions; production requires 32+ characters.
- `FORM_SECURITY_SECRET`: protects form security controls.
- `ATTRIBUTION_SECURITY_SECRET`: protects campaign attribution data.
- `NEXT_PUBLIC_APP_URL`: canonical application origin.
- `NEXT_PUBLIC_ALLOW_INDEXING`: `true` only on the intended production site.
- `MEDIA_UPLOAD_DIR` and `FORM_UPLOAD_DIR`: filesystem locations paired with
  the database.
- SMTP and notification variables: required only when transactional email must
  be delivered.

The database, uploads and environment file form one recovery set. Preserve all
three through private backup procedures; Git contains the application,
migrations, clean seed content and operational instructions only.

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

If Node.js is not already managed by the company package repository, install
Node.js 22 from NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs
node --version
npm --version
```

The EC2 instance must be able to read the private GitHub repository. Use a
dedicated read-only GitHub deploy key or an approved machine identity. Store its
private key only in the server user's `~/.ssh` directory with mode `0600`; never
place it in this repository.

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

Generate server secrets without displaying them in shell history:

```bash
openssl rand -hex 32
```

Run that command separately for each secret and paste the results directly into
the protected environment file. Configure the SMTP variables from the approved
Google Workspace mailbox. `SMTP_PASSWORD` must be an application password, not
the user's normal account password.

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

DNS can be checked before requesting a certificate:

```bash
getent ahostsv4 sim.startime.sa
curl -4 https://ifconfig.me
```

The resolved address must be the intended server address. If it is not, correct
DNS and wait for its TTL before running Certbot.

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

### Deployment verification checklist

After every production restart, verify all of the following before closing the
maintenance window:

```bash
curl -fsS http://127.0.0.1:3004/ >/dev/null
curl -fsS https://sim.startime.sa/ >/dev/null
curl -fsS https://sim.startime.sa/robots.txt
curl -fsS https://sim.startime.sa/sitemap.xml >/dev/null
```

- Homepage and navigation on desktop and mobile
- English public routes and the intentionally hidden/redirected Arabic state
- CMS login and one non-destructive content edit
- Existing CMS image and a small test upload
- Contact, sponsorship and B2G form submission paths
- Form notification delivery to the configured recipients
- Browser console and network panel for blocked CSP, analytics or media calls
- `systemctl status simf`, Nginx logs and available disk/memory

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

### Service fails immediately after restart

```bash
sudo systemctl reset-failed simf
sudo journalctl -u simf -n 200 --no-pager
sudo systemctl cat simf
sudo test -r /etc/simf/simf.env && echo 'environment file is readable'
sudo -u ubuntu test -r /var/www/simf/shared/simf.db && echo 'database is readable'
```

Common causes are a missing environment variable, an unsupported Node.js
version, an unreadable database, or a build produced with different dependency
versions. Correct the reported cause, run `npm ci` and `npm run build`, then
restart. Do not create a new database if the shared production database exists.

### Port 3004 is already in use

```bash
sudo ss -ltnp | grep ':3004'
sudo systemctl status simf --no-pager
```

If an old SIMF process is running outside systemd, identify why it was started,
stop only that confirmed process, and restart `simf.service`. Do not kill an
unknown process solely by port number.

### Git fetch, clone or pull fails

For `Permission denied (publickey)`, verify the server's GitHub deploy key and
repository access:

```bash
ssh -T git@github.com
git -C /var/www/simf/app remote -v
```

For `Not possible to fast-forward`, stop and inspect `git status` and
`git log --oneline --decorate -10`. Production must not contain unreviewed local
commits. Do not force-pull or erase files until the local changes are understood
and preserved.

### npm ci fails

```bash
node --version
npm --version
df -h
npm cache verify
```

Use the committed `package-lock.json`. Do not replace `npm ci` with
`npm install` on production to bypass a lockfile error. If the registry times
out, retry after connectivity is restored. If a package integrity error repeats,
clear only the npm cache with `npm cache clean --force`, then run `npm ci` again.

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

### CMS login returns 401, 403 or repeatedly expires

Confirm the browser is using the HTTPS domain, the system clock is correct and
the application sees the forwarded HTTPS protocol:

```bash
timedatectl status
sudo nginx -T | grep -n 'X-Forwarded-Proto'
sudo journalctl -u simf --since '20 minutes ago' --no-pager
```

Clear only the site's cookies and log in again. Do not delete CMS users or
change `PAYLOAD_SECRET` as a login fix; changing that secret invalidates every
existing session.

### SQLite reports database is locked

```bash
sudo systemctl status simf --no-pager
sudo lsof /var/www/simf/shared/simf.db
sudo find /var/www/simf/shared -maxdepth 1 -name 'simf.db*' -ls
```

Only one production application service should write to SQLite. Stop duplicate
application processes and allow the active request to finish. Never delete
`simf.db-wal` or `simf.db-shm` while the application is running. Back up first
and run an integrity check if locking continues.

### A schema or migration error appears after deployment

Stop repeated restart attempts, preserve the journal output and confirm the
deployment's required migration. Create a backup before running any migration:

```bash
sudo systemctl start simf-backup.service
cd /var/www/simf/app
sudo -u ubuntu env DATABASE_URL=file:/var/www/simf/shared/simf.db npm run migrate:partner-badges
```

The command above is only for the named partner-badge migration. Do not use it
for unrelated errors. Roll code back if the release documentation does not name
a migration.

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

If space is still low, locate large files without crossing into other mounted
filesystems:

```bash
sudo find /var -xdev -type f -size +200M -printf '%s %p\n' 2>/dev/null | sort -n
sudo du -xhd2 /var/www/simf /var/log /var/cache 2>/dev/null | sort -h | tail -40
```

Safe candidates may include old package caches and already-rotated logs. Live
databases, uploads, environment files and the newest verified backup are not
cleanup candidates. If the EBS volume must be enlarged, take a snapshot first,
increase the AWS volume, then extend the partition and filesystem using the
commands appropriate to the actual device and filesystem; do not guess device
names.

### Backup service fails

```bash
sudo systemctl status simf-backup.service --no-pager
sudo journalctl -u simf-backup.service -n 150 --no-pager
sudo test -r /var/www/simf/shared/simf.db && echo 'database readable'
df -h /var/backups/simf /var/www/simf/shared
```

Resolve the reported permission, integrity or disk-space problem, then rerun the
service. Confirm both a `.tar.gz` and matching `.sha256` exist before relying on
the backup.

### Uploaded images return 404

```bash
sudo grep -E '^(MEDIA_UPLOAD_DIR|FORM_UPLOAD_DIR|DATABASE_URL)=' /etc/simf/simf.env
sudo ls -la /var/www/simf/shared/uploads/media | head
sudo chown -R ubuntu:ubuntu /var/www/simf/shared/uploads
sudo systemctl restart simf
```

### Upload returns 413 Request Entity Too Large

Check the Nginx `client_max_body_size` value and the application's configured
form/media limit. The maintained production configuration allows 12 MB at the
edge. Prefer resizing unusually large images instead of raising the global
limit. If a business requirement changes the limit, update both layers, test
memory use on the `t3.small`, run `nginx -t`, and reload Nginx.

### Domain redirects repeatedly or shows the wrong website

```bash
curl -IL https://sim.startime.sa/
sudo nginx -T | grep -nE 'server_name|proxy_pass|return 301'
```

Confirm there is only one enabled SIMF production virtual host and that its
proxy points to `127.0.0.1:3004`. Investigate any additional SIMF virtual host
before disabling its exact symlink under `/etc/nginx/sites-enabled`.

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

### Instance is slow or CPU credits are low

```bash
uptime
free -h
top
sudo journalctl -u simf --since '30 minutes ago' --no-pager
```

Check EC2 CloudWatch `CPUUtilization`, `CPUCreditBalance` and
`CPUSurplusCreditBalance`. A sustained low credit balance means the burstable
instance is continuously busy. Identify the process or request pattern before
resizing. Do not solve unexplained load by weakening request limits.

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
