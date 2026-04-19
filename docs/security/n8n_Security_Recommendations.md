# Do.Qix n8n Security Recommendations

**Version:** 1.1
**Date:** February 11, 2026
**Aligned with:** Terms_and_Conditions.md, DoQix_Architecture.md, Pricing_Strategy.md
**Purpose:** Security hardening, POPIA compliance, and operational resilience for Do.Qix's self-hosted n8n infrastructure. This document covers the n8n automation platform that powers all client workflow services.

*This document should be reviewed by a qualified IT security professional and a POPIA compliance specialist before implementation.*

---

## 1. Critical: Upgrade to n8n v2.5.2+ (Minimum Safe Version)

n8n has had **multiple critical sandbox escape vulnerabilities** since late 2025. Running anything below v2.5.2 exposes the host to remote code execution.

| CVE | CVSS | Description | Fixed In |
|-----|------|-------------|----------|
| CVE-2025-68668 | 9.9 | Pyodide sandbox escape in Python Code Node (N8Scape) | v2.0.0 |
| CVE-2026-25049 | 9.4 | JavaScript expression sandbox bypass via template literals | v2.4.0 |
| CVE-2026-1470 | 9.9 | JavaScript AST sandbox escape via `with` statement | v2.5.1 |
| CVE-2026-0863 | 8.5 | Python AST sandbox escape via format-string introspection | v2.4.2 |

**Action items:**
- Upgrade to **n8n v2.5.2+** immediately — this is the minimum version that patches all known critical CVEs. Prefer the latest stable release (v2.7.1 as of Feb 2026).
- Enable external task runners (mandatory since v2.0.0):
  ```bash
  N8N_RUNNERS_MODE=external
  N8N_RUNNERS_ENABLED=true
  ```
- Block `$env` access in Code nodes: `N8N_BLOCK_ENV_ACCESS_IN_NODE=true`
- If upgrade is delayed, mitigate by disabling Python: `N8N_PYTHON_ENABLED=false`
- Subscribe to [n8n GitHub Security Advisories](https://github.com/n8n-io/n8n/security/advisories) — new CVEs are being disclosed regularly

**Sources:**
- [Cyera Research Labs — N8Scape (CVE-2025-68668)](https://www.cyera.com/research-labs/n8scape-pyodide-sandbox-escape-9-9-critical-post-auth-rce-in-n8n-cve-2025-68668)
- [JFrog — CVE-2026-1470 & CVE-2026-0863](https://research.jfrog.com/post/achieving-remote-code-execution-on-n8n-via-sandbox-escape/)
- [n8n v2.0 Breaking Changes](https://docs.n8n.io/2-0-breaking-changes/)
- [NVD — CVE-2025-68668](https://nvd.nist.gov/vuln/detail/CVE-2025-68668)

---

## 2. Infrastructure Architecture

### Recommended Stack (Docker Deployment)

```
Internet → Cloudflare → Traefik (TLS) → n8n (port 5678, internal only)
                                      → PostgreSQL (internal only)
                                      → n8n Task Runner (internal only)
```

> **Note:** Traefik is recommended for Docker deployments due to native container integration. Alternatives include **Caddy** (simpler config, automatic HTTPS) or **Nginx**. If using Cloudflare Tunnels, the reverse proxy can be simplified further.

### Hosting — SA-First

| Option | Location | Latency | POPIA | Cost |
|--------|----------|---------|-------|------|
| AWS `af-south-1` | Cape Town | Low | SA data residency | ~R800-2,000/mo |
| Hetzner Cloud (EU) | Germany/Finland | Medium | Needs DPA | ~R400-800/mo |
| Hetzner SA VPS | Johannesburg | Low | SA data residency | ~R500-1,500/mo |
| On-premises | Your office | Lowest | Full control | Hardware + power |

**Recommendation:** Cloud hosting in SA (AWS Cape Town or Hetzner SA) eliminates load-shedding risk and provides guaranteed uptime. Matches our T&Cs commitment of 99.5% uptime.

### Network Rules

| Port | Access | Purpose |
|------|--------|---------|
| 443 | Public | HTTPS (Traefik reverse proxy) |
| 80 | Public | HTTP redirect to HTTPS only |
| 5678 | Internal only | n8n application (NEVER expose) |
| 5432 | Internal only | PostgreSQL (NEVER expose) |

---

## 3. n8n Application Security

### Essential Environment Variables

```bash
# Encryption — CRITICAL. Generate once, back up securely, never change.
N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)

# Protocol and host
N8N_PROTOCOL=https
N8N_HOST=n8n.doqix.co.za
WEBHOOK_URL=https://n8n.doqix.co.za/
N8N_PROXY_HOPS=1

# Database
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=postgres
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=<strong_random_password>
DB_POSTGRESDB_SSL_ENABLED=true

# Security hardening
N8N_BLOCK_ENV_ACCESS_IN_NODE=true
N8N_RUNNERS_MODE=external
N8N_RUNNERS_ENABLED=true
N8N_PERSONALIZATION_ENABLED=false

# Disable telemetry — prevent data leaving your infrastructure
N8N_DIAGNOSTICS_ENABLED=false
N8N_DIAGNOSTICS_CONFIG_FRONTEND=false
N8N_DIAGNOSTICS_CONFIG_BACKEND=false

# Execution data — minimize stored personal information
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=168           # 7 days — adjust per client DPA
EXECUTIONS_DATA_SAVE_ON_SUCCESS=none  # Don't store successful execution data
EXECUTIONS_DATA_SAVE_ON_ERROR=all     # Keep error data for debugging

# Monitoring
N8N_METRICS=true
N8N_METRICS_PREFIX=n8n_
```

### The Encryption Key

The `N8N_ENCRYPTION_KEY` encrypts all stored credentials (API keys, OAuth tokens, passwords). If lost, **all credentials become unrecoverable**.

- Generate once: `openssl rand -hex 32`
- Store in a secrets manager (not just `.env`)
- Back up encrypted copies in 2+ locations
- Never commit to version control
- Never rotate (would invalidate all stored credentials)

**Practical secrets management options:**

| Option | Cost | Suitable For |
|--------|------|-------------|
| Bitwarden (self-hosted or cloud) | Free–R150/mo | Team password + secrets vault |
| 1Password | ~R130/user/mo | Team secrets with CLI integration |
| KeePassXC (local encrypted DB) | Free | Solo operator, offline backup |
| AWS Secrets Manager | ~R8/secret/mo | If already on AWS infrastructure |
| `gpg`-encrypted file on USB + cloud | Free | Minimum viable for day one |

At minimum: store the encryption key in a password manager AND as a GPG-encrypted file in a separate location from your backups. If the key is only in your `.env` file and that server dies, all n8n credentials are permanently lost.

### Webhook Security

Every webhook endpoint is a public URL. Protect them:

1. **Header authentication** — require a secret header on all webhook triggers
2. **IP allowlisting** — restrict webhook sources where possible
3. **HMAC validation** — verify webhook signatures (Shopify, GitHub, Stripe all support this)
4. **Rate limiting** — configure in Traefik/Nginx to prevent abuse

**HMAC verification example** (n8n Code Node — Shopify webhook):

```javascript
// Place this Code node immediately after the Webhook trigger
const crypto = require('crypto');
const secret = '<your_shopify_webhook_secret>';
const signature = $input.first().headers['x-shopify-hmac-sha256'];
const body = $input.first().json._rawBody; // requires rawBody parsing

const computed = crypto
  .createHmac('sha256', secret)
  .update(body, 'utf8')
  .digest('base64');

if (signature !== computed) {
  throw new Error('Invalid HMAC signature — rejecting webhook');
}

return $input.all();
```

> Adapt for GitHub (`x-hub-signature-256`, hex digest) or Stripe (`stripe-signature`, timestamp + payload). Never skip signature verification on production webhooks.

### User Management

n8n Community Edition has **no RBAC** (role-based access control). All users see all workflows.

**Mitigation for Community Edition:**
- Limit user accounts to Do.Qix staff only — clients never get n8n access
- Use strong passwords + 2FA where supported
- Separate instances per client (see Section 8)

**If upgrading to n8n Enterprise/Pro:**
- Project-based access control (workflows isolated per client project)
- Custom roles (Editor, Viewer)
- Audit logging

---

## 4. Docker Hardening

### Production Docker Compose

```yaml
services:
  traefik:
    image: traefik:v3.3
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_data:/letsencrypt
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=hello@doqix.co.za"
    networks:
      - n8n_public
    security_opt:
      - no-new-privileges:true

  postgres:
    image: postgres:16.2-alpine    # Pin exact version
    container_name: n8n_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - n8n_internal               # Internal only — no public access
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'

  n8n:
    image: n8nio/n8n:2.7.1         # Pin exact version — NEVER use :latest
    container_name: n8n
    restart: unless-stopped
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      # ... all env vars from Section 3
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - n8n_public
      - n8n_internal
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.n8n.rule=Host(`n8n.doqix.co.za`)"
      - "traefik.http.routers.n8n.entrypoints=websecure"
      - "traefik.http.routers.n8n.tls.certresolver=letsencrypt"
      - "traefik.http.services.n8n.loadbalancer.server.port=5678"
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'

  n8n-runner:
    image: n8nio/runners:2.7.1     # Task runner for Code node isolation
    container_name: n8n_runner
    restart: unless-stopped
    networks:
      - n8n_internal
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

networks:
  n8n_public:
    driver: bridge
  n8n_internal:
    driver: bridge
    internal: true    # No external access — container-to-container only

volumes:
  traefik_data:
  postgres_data:
  n8n_data:
```

### Container Checklist

| Check | Why |
|-------|-----|
| Pin exact image versions | Prevents unexpected breaking changes |
| `no-new-privileges` on all containers | Blocks privilege escalation |
| Resource limits (CPU + memory) | Prevents single container from starving host |
| Internal network for DB + runner | Database never reachable from outside |
| Docker socket mounted `:ro` | Traefik needs it, but read-only limits risk |
| Non-root user | n8n image already runs as `node` (UID 1000) |
| Volume permissions pre-set | `chown 1000:1000` for n8n, `999:999` for postgres |

---

## 5. Database Security

**Use PostgreSQL, not SQLite.** SQLite is not suitable for production — no concurrent access, no network encryption, limited backup options.

### PostgreSQL Hardening

```ini
# postgresql.conf
ssl = on
ssl_min_protocol_version = 'TLSv1.2'
password_encryption = scram-sha-256
max_connections = 50
log_connections = on
log_disconnections = on
log_statement = 'ddl'

# Data integrity (load-shedding protection)
fsync = on
synchronous_commit = on
full_page_writes = on
wal_level = replica
```

```
# pg_hba.conf — restrict access to n8n container network only
local   all      all                     scram-sha-256
host    n8n      n8n_user  172.18.0.0/16 scram-sha-256
host    all      all       0.0.0.0/0     reject
```

- Never use the `postgres` superuser for n8n
- Create a dedicated `n8n_user` with access only to the `n8n` database

---

## 6. Backup & Recovery

### Daily Automated Backup

```bash
#!/bin/bash
set -euo pipefail
# /opt/n8n/scripts/backup.sh — run via cron at 02:00

# Load environment
source /opt/n8n/.env

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/n8n/backups"
LOG_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.log"

log() { echo "[$(date '+%H:%M:%S')] $1" | tee -a "${LOG_FILE}"; }

log "Starting backup"

# 1. PostgreSQL dump
log "Dumping PostgreSQL"
docker exec n8n_postgres pg_dump -U "${POSTGRES_USER}" -Fc "${POSTGRES_DB}" \
  > "${BACKUP_DIR}/db_${TIMESTAMP}.dump"

# 2. n8n data directory
log "Copying n8n data"
docker cp n8n:/home/node/.n8n "${BACKUP_DIR}/n8n_data_${TIMESTAMP}"

# 3. Encrypt and compress
log "Encrypting backup"
tar -czf - -C "${BACKUP_DIR}" "db_${TIMESTAMP}.dump" "n8n_data_${TIMESTAMP}" \
  | gpg --batch --yes --symmetric --cipher-algo AES256 \
    --passphrase-file /opt/n8n/.backup-passphrase \
    -o "${BACKUP_DIR}/n8n_full_${TIMESTAMP}.tar.gz.gpg"

# 4. Remove intermediate files (only after encryption succeeds)
log "Cleaning intermediate files"
rm -f "${BACKUP_DIR}/db_${TIMESTAMP}.dump"
rm -rf "${BACKUP_DIR}/n8n_data_${TIMESTAMP}"

# 5. Upload to off-site (Google Drive / S3)
log "Uploading to remote"
rclone copy "${BACKUP_DIR}/n8n_full_${TIMESTAMP}.tar.gz.gpg" remote:n8n-backups/

# 6. Cleanup old backups (30-day retention)
find "${BACKUP_DIR}" -name "n8n_full_*.tar.gz.gpg" -mtime +30 -delete
find "${BACKUP_DIR}" -name "backup_*.log" -mtime +30 -delete

log "Backup complete: n8n_full_${TIMESTAMP}.tar.gz.gpg"
```

> **Note:** Store the GPG passphrase file (`/opt/n8n/.backup-passphrase`) with `chmod 600` and back it up alongside your encryption key. Without it, backups are unrecoverable.

### What to Back Up

| Item | Frequency | Priority |
|------|-----------|----------|
| PostgreSQL database | Daily | Critical |
| `N8N_ENCRYPTION_KEY` | Once (then secure in 2+ locations) | Critical |
| `.n8n` data directory | Daily | High |
| `docker-compose.yml` + `.env` (encrypted) | On change | High |
| Traefik/TLS config | On change | Medium |

### Test Restores Monthly

A backup you've never tested is not a backup. Schedule monthly restore tests on a staging environment.

---

## 7. POPIA Compliance

### Do.Qix's Dual Role Under POPIA

Do.Qix occupies **both roles** depending on context:

| Context | Role | POPIA Term |
|---------|------|------------|
| Building/running client workflows | Processes data per client instructions | **Operator** (Section 1) |
| Client determines what data to process | Decides purpose and means | **Responsible Party** |
| Do.Qix's own business data (CRM, marketing) | Decides purpose and means | **Responsible Party** |
| Execution logs, metadata, retention decisions | Do.Qix determines how long to keep | **Responsible Party** (for that data) |

When you exercise discretion over *how* data is processed (e.g., choosing log retention, selecting metadata to capture), you become a responsible party for that specific processing — even while remaining an operator for the primary client data.

### Juristic Person Protection (Unique to POPIA)

POPIA protects **companies** (juristic persons) as data subjects — not just natural persons. This is unique globally and affects your B2B services:
- Company names, registration numbers, tax numbers, financial data = "personal information" under POPIA
- International service DPAs (Google, Xero, Shopify) are designed for GDPR which only covers natural persons
- You may need supplementary clauses in DPAs to cover B2B data flows under POPIA's broader scope

### Mandatory Compliance Steps

**1. Data Processing Agreement (DPA) with every client** (Section 21)

Each client engagement must include a written DPA covering:
- Scope and purpose of data processing
- Security measures Do.Qix will maintain
- Restrictions on further processing
- Breach notification obligations
- Data retention and deletion terms
- Sub-processor engagement rules

**2. Information Officer + PAIA Manual** (Sections 55, 56)

Appoint and register an Information Officer with the Information Regulator. This is mandatory. The CEO/MD is the default Information Officer by law. Register via the [Information Regulator's online registration portal](https://inforegulator.org.za/information-officers/). You must also publish a **PAIA Section 51 manual** on your website describing what records you hold and how to request access.

**3. Personal Information Impact Assessment (PIIA)** (Regulation 4(1)(b))

Conduct a PIIA for each new client engagement to document:
- What personal information flows through workflows
- Where it's stored and for how long
- Who has access
- What risks exist and how they're mitigated

**4. Breach Notification** (Section 22)

If a data breach occurs:
- Report to the Information Regulator via the eServices Portal — "as soon as reasonably possible"
- Notify affected data subjects
- Document the breach, its impact, and remediation steps
- Notify the affected client immediately (per DPA)

**5. Cross-Border Data Transfer** (Section 72)

When workflows connect to international services (Google, Shopify, Xero):
- Ensure the receiving country has adequate data protection, OR
- Client consents to the transfer, OR
- Transfer is necessary for contract performance, OR
- A binding agreement compels POPIA-equivalent handling

**Practical approach:** Document all cross-border data flows per client. Most will be covered by "necessary for contract performance" (the client asked us to connect to Shopify, which requires sending data to Shopify's servers).

**6. Data Minimization in n8n**

```bash
# Auto-prune execution data
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=168  # 7 days default — adjust per client DPA
EXECUTIONS_DATA_SAVE_ON_SUCCESS=none
```

- Only process the minimum personal information necessary
- Auto-delete execution logs (contain data snapshots)
- Disable n8n telemetry to prevent data leaving your infrastructure

**7. Automated Decision Making** (Section 71)

If any workflows make automated decisions that substantially affect individuals (credit scoring, application approvals, etc.), human intervention must be built in. Data subjects may not be subject to decisions based solely on automated processing.

**8. Record Keeping**

Maintain records of:
- All processing activities per client
- Security measures implemented
- Breach incidents and responses
- Data subject access requests (must respond within **30 days** — PAIA Section 56(1), as amended by the Protection of Personal Information Amendment Act, 2025)
- DPAs with all clients and sub-processors
- PIIAs conducted
- Cross-border transfer legal bases

### Enforcement Context — This Is Real

The Information Regulator is actively enforcing POPIA:

| Entity | Year | Penalty |
|--------|------|---------|
| Dept. of Basic Education | 2025 | R5,000,000 |
| Blouberg Municipality | 2025 | R500,000 |
| Lancet Laboratories | 2025 | R100,000 (failure to notify breach) |
| FT Rams Consulting | 2025 | R100,000 (unsolicited marketing) |

Maximum penalty: **R10 million and/or 10 years imprisonment** (Section 107). Personal criminal liability is also possible.

---

## 8. Multi-Tenant Architecture

### Recommendation: Separate Instances Per Client

n8n Community Edition has no native multi-tenancy. All users see all workflows. For POPIA compliance, **separate instances per client** is strongly recommended.

```
/opt/n8n/
  client-a/
    docker-compose.yml
    .env                # Separate encryption key per client
  client-b/
    docker-compose.yml
    .env
```

**Each client gets:**
- Separate Docker Compose stack
- Separate PostgreSQL database
- Separate `N8N_ENCRYPTION_KEY`
- Separate subdomain (e.g., `client-a.n8n.doqix.co.za`)
- Independent backup and restore

**Why this matters:**
- Complete data isolation — a misconfigured workflow can't leak cross-client data
- Simplifies POPIA compliance — each client's data is physically separated
- Independent resource allocation — one client's heavy workload won't affect others
- Per-client breach containment

**Resource Sizing Per Client Instance:**

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| n8n container | 512MB RAM, 0.5 CPU | 1–2GB RAM, 1 CPU |
| PostgreSQL | 256MB RAM, 0.25 CPU | 512MB RAM, 0.5 CPU |
| Task Runner | 256MB RAM, 0.25 CPU | 512MB RAM, 0.5 CPU |
| Disk (data + backups) | 5GB | 20GB |
| **Total per client** | **~1GB RAM, 1 CPU** | **~3GB RAM, 2 CPU** |

For 5 clients at recommended spec: ~16GB RAM, 10 CPU cores, 100GB disk. An 8-core VPS with 32GB RAM (AWS `m6g.2xlarge` or Hetzner CCX33) comfortably hosts 5–8 client instances.

**Trade-off:** Higher infrastructure cost and management overhead. Mitigate with Docker Compose templating (per-client `.env` + shared `docker-compose.yml`) or Kubernetes at scale.

---

## 9. Monitoring & Alerting

### Monitoring Stack

| Tool | Purpose |
|------|---------|
| Prometheus | Metrics collection from n8n (`/metrics` endpoint) |
| Grafana | Dashboards and visualization |
| Node Exporter | Host-level metrics (CPU, memory, disk) |
| UptimeRobot / Better Uptime | External health check on `https://n8n.doqix.co.za/healthz` |

### Alert Conditions

| Metric | Threshold | Severity |
|--------|-----------|----------|
| n8n process down | > 1 minute | Critical |
| Workflow failure rate | > 10% in 5 min | High |
| Memory usage | > 80% of limit | Warning |
| Disk space | < 20% free | Critical |
| TLS certificate expiry | < 14 days | Warning |
| DB connections | > 80% of max | Warning |

### n8n Error Workflow

Create an internal "Error Trigger" workflow that catches all workflow failures and sends notifications via email/Slack/Telegram. This also provides per-client error visibility.

---

## 10. Incident Response Runbook

When a security incident or data breach is detected, follow this sequence:

### Phase 1: Contain (First 30 Minutes)

| Step | Action | Who |
|------|--------|-----|
| 1 | Confirm the incident is real (not a false positive) | On-call engineer |
| 2 | Isolate affected client instance(s) — `docker compose stop n8n` | On-call engineer |
| 3 | Preserve evidence — snapshot logs, DB, and container state before any changes | On-call engineer |
| 4 | Rotate compromised credentials (n8n login, API keys, DB passwords) | Lead engineer |
| 5 | Notify internal team via designated channel (Slack/WhatsApp) | On-call engineer |

### Phase 2: Assess (First 4 Hours)

- Determine scope: which clients, which data, which workflows
- Check execution logs for unauthorized workflow runs
- Review n8n audit log (Enterprise) or access logs (Community)
- Check for persistence: unauthorized users, modified workflows, new webhooks
- Document timeline of events

### Phase 3: Notify (Within 24–72 Hours)

| Notification | Deadline | Method |
|-------------|----------|--------|
| Affected client(s) | Immediately per DPA | Email + phone call |
| Information Regulator | As soon as reasonably possible (Section 22) | [eServices Portal](https://inforegulator.org.za/) |
| Affected data subjects | As soon as reasonably possible | Per client's instruction |

### Phase 4: Remediate & Document

- Patch the vulnerability or close the attack vector
- Restore from clean backup if necessary
- Conduct post-incident review within 7 days
- Update security measures based on findings
- File incident report with: timeline, impact, root cause, remediation, prevention measures

### Incident Log Template

Maintain a running incident register (even if no incidents have occurred — auditors check for this):

```
Date | Severity | Description | Clients Affected | Root Cause | Resolution | Regulator Notified
```

---

## 11. Update & Patch Management

| Update Type | Frequency | Process |
|-------------|-----------|---------|
| Security patches (CVEs) | Within 48 hours | Backup → staging test → deploy |
| Minor versions | Monthly | Backup → review changelog → staging → deploy |
| Major versions | Quarterly review | Plan migration, test thoroughly |

### Update Process

```bash
# 1. Backup first
/opt/n8n/scripts/backup.sh

# 2. Update image tag in docker-compose.yml
# 3. Pull and restart
docker compose pull && docker compose down && docker compose up -d

# 4. Verify
docker compose logs -f n8n
```

- Subscribe to [n8n GitHub releases](https://github.com/n8n-io/n8n/releases)
- Review [breaking changes docs](https://docs.n8n.io/2-0-breaking-changes/) before major upgrades
- Keep Docker Engine, host OS, and all images up to date

---

## 12. Load-Shedding Resilience (SA-Specific)

### Cloud Hosting (Recommended)

Cloud providers have generator backup, redundant power, and UPS. Hosting in AWS Cape Town or Hetzner Cloud **eliminates server-side load-shedding risk entirely**.

### If Hosting On-Premises

1. **UPS** — minimum 30-minute runtime, online/double-conversion type
2. **Graceful shutdown script** — triggered by UPS low-battery signal:
   ```bash
   docker compose stop n8n
   docker exec n8n_postgres pg_dump -U n8n_user -Fc n8n > /opt/n8n/backups/emergency.dump
   docker compose down
   ```
3. **Surge protection** on all equipment
4. **LTE/5G failover** router for internet backup during outages

### Connectivity Resilience

- Fibre with battery backup at ISP node (confirm with provider)
- LTE failover router (Mikrotik dual-WAN or similar)
- Configure retry logic in workflows for webhook failures during outages

---

## Security Checklist Summary

| # | Action | Priority | Status |
|---|--------|----------|--------|
| 1 | Upgrade to n8n v2.5.2+ (all known CVEs patched) | Critical | [ ] |
| 2 | Set `N8N_ENCRYPTION_KEY` (strong, backed up in secrets manager) | Critical | [ ] |
| 3 | HTTPS via reverse proxy (TLS 1.2+) | Critical | [ ] |
| 4 | PostgreSQL (not SQLite) | Critical | [ ] |
| 5 | Enable external task runners | Critical | [ ] |
| 6 | Firewall: only 80/443 public, 5678/5432 internal | Critical | [ ] |
| 7 | Daily automated encrypted backups | Critical | [ ] |
| 8 | DPA signed with every client | Critical | [ ] |
| 9 | Appoint & register Information Officer | Critical | [ ] |
| 10 | Publish PAIA Section 51 manual on website | Critical | [ ] |
| 11 | `N8N_BLOCK_ENV_ACCESS_IN_NODE=true` | High | [ ] |
| 12 | Pin Docker image versions (no `:latest`) | High | [ ] |
| 13 | Resource limits on all containers | High | [ ] |
| 14 | Internal Docker network for DB/runner | High | [ ] |
| 15 | Webhook HMAC authentication on all endpoints | High | [ ] |
| 16 | Separate n8n instances per client | High | [ ] |
| 17 | Monitoring (Prometheus + Grafana + uptime) | High | [ ] |
| 18 | Monthly backup restore tests | High | [ ] |
| 19 | PIIA per client engagement | High | [ ] |
| 20 | Incident response runbook documented and tested | High | [ ] |
| 21 | Encryption key stored in secrets manager (not just .env) | High | [ ] |
| 22 | PostgreSQL SSL enabled | Medium | [ ] |
| 23 | Disable telemetry (`N8N_DIAGNOSTICS_ENABLED=false`) | Medium | [ ] |
| 24 | Centralized log management | Medium | [ ] |
| 25 | Execution data auto-pruning | Medium | [ ] |
| 26 | SA cloud hosting (load-shedding resilience) | Medium | [ ] |
| 27 | Review third-party DPAs for juristic person coverage | Medium | [ ] |
| 28 | Audit automated decision-making in workflows (Section 71) | Medium | [ ] |
| 29 | Subscribe to n8n GitHub Security Advisories | Medium | [ ] |
| 30 | Docker image scanning (Trivy) | Low | [ ] |

---

## References

**n8n Documentation:**
- [n8n Environment Variables](https://docs.n8n.io/hosting/configuration/environment-variables/)
- [n8n Docker Compose Setup](https://docs.n8n.io/hosting/installation/server-setups/docker-compose/)
- [n8n v2.0 Breaking Changes](https://docs.n8n.io/2-0-breaking-changes/)
- [n8n Community Edition Features](https://docs.n8n.io/hosting/community-edition-features/)
- [n8n GitHub Security Advisories](https://github.com/n8n-io/n8n/security/advisories)

**Security Vulnerabilities:**
- [NVD — CVE-2025-68668](https://nvd.nist.gov/vuln/detail/CVE-2025-68668) (CVSS 9.9, Pyodide sandbox escape)
- [Cyera Research Labs — N8Scape](https://www.cyera.com/research-labs/n8scape-pyodide-sandbox-escape-9-9-critical-post-auth-rce-in-n8n-cve-2025-68668)
- [JFrog — CVE-2026-1470 & CVE-2026-0863](https://research.jfrog.com/post/achieving-remote-code-execution-on-n8n-via-sandbox-escape/) (sandbox escapes, fixed in v2.5.1)
- [The Hacker News — CVE-2025-68668](https://thehackernews.com/2026/01/new-n8n-vulnerability-99-cvss-lets.html)

**POPIA & Legal:**
- [POPIA Full Text](https://popia.co.za/)
- [POPIA Section 19 — Security Measures](https://popia.co.za/section-19-security-measures-on-integrity-and-confidentiality-of-personal-information/)
- [POPIA Section 72 — Cross-Border Transfers](https://popia.co.za/section-72-transfers-of-personal-information-outside-republic/)
- [PIIA Under POPIA — Michalsons](https://www.michalsons.com/blog/personal-information-impact-assessments-under-popia/77834)
- [SA Information Regulator — eServices Portal](https://inforegulator.org.za/)
- [Information Officer Registration](https://inforegulator.org.za/information-officers/)

**Infrastructure Security:**
- [PostgreSQL Security Hardening — Percona](https://www.percona.com/blog/postgresql-database-security-what-you-need-to-know/)
- [Docker Security Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
