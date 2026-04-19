# Do.Qix Security Implementation Guide

**Version:** 1.0
**Date:** February 11, 2026
**Purpose:** Step-by-step checklist to close all security gaps before onboarding paying clients
**Production server:** iMac at `<SERVER_IP>` (native macOS, LaunchAgents)
**SSH:** `ssh <ADMIN_USER>@<SERVER_IP>`

---

## How to Use This Document

Work through the phases in order. Each phase has numbered steps. Check off each step as you complete it. Do not skip to a later phase unless the current one is complete — later phases depend on earlier ones.

**Time estimate:** Phase 1 in a weekend. Phase 2 in a week. Phase 3 ongoing.

---

## Phase 1: Infrastructure Hardening (Do This Weekend)

These protect against data loss and downtime on your local iMac setup.

---

### Step 1.1 — Verify n8n Security Configuration

SSH into the iMac and check your current environment variables.

```bash
ssh <ADMIN_USER>@<SERVER_IP>
```

```bash
# Check all security-related env vars
grep -E 'RUNNERS|BLOCK_ENV|DIAGNOSTICS|PRUNE|SAVE_ON' ~/.n8n-native/config.env
```

**You need ALL of these to be set. If any are missing, add them to `~/.n8n-native/config.env`:**

```bash
# Task runner isolation (CVE mitigation)
N8N_RUNNERS_MODE=external
N8N_RUNNERS_ENABLED=true

# Block env var access in Code nodes
N8N_BLOCK_ENV_ACCESS_IN_NODE=true

# Disable telemetry (no data leaves your infra)
N8N_DIAGNOSTICS_ENABLED=false
N8N_DIAGNOSTICS_CONFIG_FRONTEND=false
N8N_DIAGNOSTICS_CONFIG_BACKEND=false

# Auto-prune execution data (contains client data snapshots)
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=168
EXECUTIONS_DATA_SAVE_ON_SUCCESS=none
EXECUTIONS_DATA_SAVE_ON_ERROR=all
```

**After adding any missing variables, restart n8n services:**

```bash
launchctl kickstart -k gui/$(id -u)/com.n8n.web
launchctl kickstart -k gui/$(id -u)/com.n8n.worker
launchctl kickstart -k gui/$(id -u)/com.n8n.webhook
```

**Verify they're running:**

```bash
launchctl list | grep n8n
```

All services should show a `0` or small number in the status column (not a `-`).

- [ ] All env vars confirmed set
- [ ] Services restarted and running

---

### Step 1.2 — Store Encryption Key in Password Manager

If this key is lost, ALL n8n credentials (API keys, OAuth tokens, passwords) become permanently unrecoverable.

**1. Get the current key:**

```bash
ssh <ADMIN_USER>@<SERVER_IP>
grep N8N_ENCRYPTION_KEY ~/.n8n-native/config.env
```

**2. Store it in TWO separate locations:**

| Location | How |
|----------|-----|
| **Password manager** (Bitwarden, 1Password, or KeePassXC) | Create a secure note titled "Do.Qix n8n Encryption Key". Paste the full key value. |
| **GPG-encrypted USB** | See commands below |

**Create a GPG-encrypted backup file:**

```bash
# On your Mac (not the iMac — keep it separate)
echo "YOUR_ENCRYPTION_KEY_HERE" | gpg --symmetric --cipher-algo AES256 -o n8n-encryption-key.gpg
# Enter a strong passphrase when prompted — store THIS passphrase in your password manager too
```

Store the `.gpg` file on a USB drive kept in a different physical location from the iMac (e.g. a safe, a locked drawer at another location).

- [ ] Key saved in password manager
- [ ] Key saved as GPG file on USB / separate location
- [ ] Verified you can decrypt it: `gpg -d n8n-encryption-key.gpg`

---

### Step 1.3 — Encrypt Backups Before Google Drive Sync

Your current backups are gzipped but not encrypted. They contain database dumps with client data and sit on Google Drive in cleartext.

**1. Create a backup encryption passphrase:**

```bash
ssh <ADMIN_USER>@<SERVER_IP>
openssl rand -base64 32 > ~/.n8n-native/.backup-passphrase
chmod 600 ~/.n8n-native/.backup-passphrase
```

**Save this passphrase in your password manager** (same secure note as the encryption key). Without it, backups are unrecoverable.

**2. Update the database backup script** (`~/.n8n-native/bin/n8n-db-backup.sh`):

Find the line that creates the gzipped dump and add GPG encryption after it. The modified script should:

```bash
#!/bin/bash
set -euo pipefail

source ~/.n8n-native/bin/_common.sh

TS=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-$HOME/n8n-backups/db}"
PASSPHRASE_FILE="$HOME/.n8n-native/.backup-passphrase"
LOG_FILE="${BACKUP_DIR}/backup_${TS}.log"

log() { echo "[$(date '+%H:%M:%S')] $1" | tee -a "${LOG_FILE}"; }

log "Starting database backup"

# 1. Dump database
log "Dumping PostgreSQL"
pg_dump -U "${DB_USER:-n8n}" -h "${DB_HOST:-localhost}" -Fc "${DB_NAME:-n8n}" \
  > "${BACKUP_DIR}/n8n-${TS}.dump"

# 2. Encrypt with GPG
log "Encrypting backup"
gpg --batch --yes --symmetric --cipher-algo AES256 \
  --passphrase-file "${PASSPHRASE_FILE}" \
  -o "${BACKUP_DIR}/n8n-${TS}.dump.gpg" \
  "${BACKUP_DIR}/n8n-${TS}.dump"

# 3. Remove unencrypted dump
rm -f "${BACKUP_DIR}/n8n-${TS}.dump"

# 4. Cleanup old backups (14-day retention)
find "${BACKUP_DIR}" -name "*.dump.gpg" -mtime +${BACKUP_RETENTION_DAYS:-14} -delete
find "${BACKUP_DIR}" -name "backup_*.log" -mtime +${BACKUP_RETENTION_DAYS:-14} -delete

log "Backup complete: n8n-${TS}.dump.gpg"
```

**3. Update the config backup script** (`~/.n8n-native/bin/backup-config.sh`) — same pattern:

```bash
#!/bin/bash
set -euo pipefail

source ~/.n8n-native/bin/_common.sh

TS=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-$HOME/n8n-backups/config}"
PASSPHRASE_FILE="$HOME/.n8n-native/.backup-passphrase"

# 1. Create tarball
tar -czf "${BACKUP_DIR}/n8n-config-${TS}.tar.gz" -C "$HOME" .n8n

# 2. Encrypt
gpg --batch --yes --symmetric --cipher-algo AES256 \
  --passphrase-file "${PASSPHRASE_FILE}" \
  -o "${BACKUP_DIR}/n8n-config-${TS}.tar.gz.gpg" \
  "${BACKUP_DIR}/n8n-config-${TS}.tar.gz"

# 3. Remove unencrypted tarball
rm -f "${BACKUP_DIR}/n8n-config-${TS}.tar.gz"

# 4. Cleanup
find "${BACKUP_DIR}" -name "*.tar.gz.gpg" -mtime +${BACKUP_RETENTION_DAYS:-14} -delete
```

**4. Test the new backup scripts manually:**

```bash
~/.n8n-native/bin/n8n-db-backup.sh
~/.n8n-native/bin/backup-config.sh

# Verify encrypted files were created
ls -la ~/n8n-backups/db/*.gpg
ls -la ~/n8n-backups/config/*.gpg

# Verify you can decrypt them
gpg --batch --passphrase-file ~/.n8n-native/.backup-passphrase \
  -d ~/n8n-backups/db/n8n-*.dump.gpg > /dev/null
echo "Decrypt successful"
```

**5. Wait 12 hours, then verify encrypted backups synced to Google Drive:**

```bash
rclone ls gdrive:2.work/Digital_Ops/ai_projects/n8n_backups/ | head -10
# Should show .gpg files, NOT bare .dump or .tar.gz files
```

- [ ] Passphrase file created with `chmod 600`
- [ ] Passphrase saved in password manager
- [ ] DB backup script updated with GPG encryption
- [ ] Config backup script updated with GPG encryption
- [ ] Manual test: encrypted files created
- [ ] Manual test: decrypt works
- [ ] After next sync cycle: .gpg files visible on Google Drive

---

### Step 1.4 — Physical Infrastructure (Load-Shedding Protection)

Your T&Cs promise 99.5% uptime. A single load-shedding event without protection breaks this.

**1. UPS (Uninterruptible Power Supply):**

| Requirement | Minimum |
|-------------|---------|
| Type | Online/double-conversion (NOT standby) |
| Runtime | 30 minutes at iMac load (~200W) |
| Outlets | iMac + router + ONT (fibre box) |
| Budget | R2,000–R5,000 |
| Brands (SA available) | Mecer, RCT, APC |

Connect: iMac, fibre ONT, and router to UPS. Everything else (monitors, speakers) goes on a surge protector only.

**2. LTE/5G failover:**

| Option | How |
|--------|-----|
| **Mikrotik router with dual WAN** | Automatic failover when fibre drops. Best option. R1,500–R3,000 + SIM with data. |
| **USB LTE dongle on iMac** | Manual failover. Cheapest but requires intervention. |
| **Dedicated LTE router** | Plug in when fibre fails. Semi-manual. R500–R1,000 + SIM. |

**3. Surge protection:**

Plug the UPS itself into a dedicated surge protector. SA power grid surges after load-shedding restoration are the #1 killer of electronics.

- [ ] UPS purchased and connected (iMac + router + ONT)
- [ ] UPS tested: unplug power, verify iMac stays running
- [ ] LTE failover in place
- [ ] LTE tested: disconnect fibre, verify `https://n8n.digitaloperations.co.za` still responds
- [ ] Surge protection on all equipment

---

### Step 1.5 — Test a Full Backup Restore

A backup you've never restored is not a backup.

**1. Create a test restore directory:**

```bash
ssh <ADMIN_USER>@<SERVER_IP>
mkdir -p ~/n8n-restore-test
cd ~/n8n-restore-test
```

**2. Copy the latest encrypted backup:**

```bash
LATEST_DB=$(ls -t ~/n8n-backups/db/*.gpg | head -1)
cp "$LATEST_DB" .
echo "Testing restore of: $LATEST_DB"
```

**3. Decrypt:**

```bash
gpg --batch --passphrase-file ~/.n8n-native/.backup-passphrase \
  -o test-restore.dump -d "$(basename $LATEST_DB)"
```

**4. Restore to a temporary database (does NOT touch production):**

```bash
createdb -U <ADMIN_USER> n8n_restore_test
pg_restore -U <ADMIN_USER> -d n8n_restore_test test-restore.dump
```

**5. Verify data is there:**

```bash
psql -U <ADMIN_USER> -d n8n_restore_test -c "SELECT count(*) FROM workflow_entity;"
# Should return a number matching your workflow count
```

**6. Clean up:**

```bash
dropdb -U <ADMIN_USER> n8n_restore_test
rm -rf ~/n8n-restore-test
```

**Document the result:**

```
Date: ___________
Backup file: ___________
Decrypt: PASS / FAIL
Restore: PASS / FAIL
Row count matches: PASS / FAIL
Time taken: ___ minutes
```

Do this monthly. Set a calendar reminder.

- [ ] Restore test completed successfully
- [ ] Result documented
- [ ] Monthly calendar reminder set

---

## Phase 2: Legal & Compliance (Do This Week)

These are POPIA legal requirements. Without them, you face personal criminal liability (up to R10 million fine and/or 10 years imprisonment).

---

### Step 2.1 — Register as Information Officer

**Why:** POPIA makes the CEO/MD the default Information Officer. Registration is mandatory.

**How:**

1. Go to [https://inforegulator.org.za/information-officers/](https://inforegulator.org.za/information-officers/)
2. Download the registration form (Form 1)
3. Complete with Do.Qix details:
   - Name of responsible party: Do.Qix (Pty) Ltd (or your registered entity name)
   - Information Officer: Your name (as director)
   - Contact details: hello@doqix.co.za
4. Submit via the eServices portal or email to: inforeg@justice.gov.za
5. Keep the confirmation/reference number

- [ ] Registration form submitted
- [ ] Confirmation received and filed

---

### Step 2.2 — Create the PAIA Section 51 Manual

**Why:** PAIA requires every private body (including your company) to publish a manual describing what records you hold and how people can request access. Must be on your website.

**Create a document covering:**

```
1. Contact details of Information Officer
   - Name, email, phone, physical address

2. Guide on how to make a PAIA request
   - What form to use (Form 2 — prescribed by PAIA)
   - Where to send it
   - Fees (if any)
   - Response timeframe: 30 days

3. Categories of records held
   - Client records (workflow configs, execution logs, contact details)
   - Employee records (if applicable)
   - Financial records (invoices, contracts)
   - Operational records (system logs, backup records)

4. Purpose of processing
   - "To provide automation workflow services as contracted by clients"

5. Categories of data subjects
   - Clients (juristic and natural persons)
   - Client's customers (data flowing through workflows)
   - Do.Qix staff

6. Cross-border transfers
   - List services: Google, Shopify, Xero, etc.
   - Legal basis: necessary for contract performance

7. Security measures
   - Reference the Client Security Statement

8. How to complain
   - Information Regulator contact details
```

**Publish this as a page on the Do.Qix website** (e.g., `doqix.co.za/paia-manual`). Also have a downloadable PDF version.

- [ ] PAIA manual drafted
- [ ] Reviewed by legal advisor (recommended)
- [ ] Published on website
- [ ] PDF version available for download

---

### Step 2.3 — Draft the Data Processing Agreement (DPA)

**Why:** POPIA Section 21 requires a written agreement between operator (you) and responsible party (client) before any data processing.

**The DPA must cover:**

```
1. Scope
   - What data will be processed
   - Purpose of processing
   - Duration

2. Do.Qix obligations
   - Process only per client's documented instructions
   - Ensure staff confidentiality
   - Implement security measures (reference Client Security Statement)
   - Assist client with data subject requests
   - Delete or return all data on termination

3. Client obligations
   - Ensure lawful basis for processing
   - Provide accurate data scope

4. Sub-processors
   - List: Google Cloud (if using Google APIs), Cloudflare, Healthchecks.io
   - Client consent required before adding new sub-processors

5. Breach notification
   - Do.Qix notifies client within 24 hours of discovering breach
   - Cooperate with investigation
   - Assist with regulator notification

6. Data retention
   - Execution logs: 7 days (configurable)
   - Client data: duration of contract + 30 days
   - After termination: permanent deletion

7. Cross-border transfers
   - Listed with legal basis

8. Audit rights
   - Client may request evidence of compliance (annual)

9. Liability
   - Align with your T&Cs (limited to 3 months' fees)
```

**Get this reviewed by a lawyer.** Template cost: R2,000–R5,000 from an SA attorney familiar with POPIA. Worth every cent.

**Sign before onboarding each client.** Include as a schedule/annexure to your standard T&Cs.

- [ ] DPA drafted
- [ ] Reviewed by legal professional
- [ ] Template ready for client signature
- [ ] Process: DPA signed before any work begins

---

### Step 2.4 — Create PIIA Template (Per-Client)

**Why:** POPIA Regulation 4(1)(b) requires a Personal Information Impact Assessment before processing.

**Create a template document you complete for each new client:**

```
CLIENT PIIA — [Client Name]
Date: ___________
Completed by: ___________

1. WORKFLOW DESCRIPTION
   - What does this workflow do?
   - What apps/services does it connect?

2. PERSONAL INFORMATION INVENTORY
   | Data Element | Source | Destination | Retention |
   |-------------|--------|-------------|-----------|
   | e.g. Customer email | Shopify | Xero | 7 days in logs |
   | e.g. Order details | Shopify | Google Sheets | 7 days in logs |

3. DATA SUBJECTS AFFECTED
   - [ ] Client's customers (natural persons)
   - [ ] Client's employees
   - [ ] Client's suppliers/partners (juristic persons)

4. CROSS-BORDER TRANSFERS
   | Service | Country | Legal Basis |
   |---------|---------|-------------|
   | e.g. Google Sheets | USA | Contract performance |

5. RISK ASSESSMENT
   | Risk | Likelihood | Impact | Mitigation |
   |------|-----------|--------|------------|
   | Data leak via misconfigured workflow | Low | High | Workflow review before go-live |
   | Unauthorized access | Low | High | Cloudflare + auth + no client n8n access |

6. AUTOMATED DECISION-MAKING
   - Does this workflow make decisions affecting individuals? YES / NO
   - If YES: human review step included? YES / NO

7. SIGN-OFF
   Do.Qix: ___________ Date: ___________
   Client: ___________ Date: ___________
```

Complete one per client. Store securely. Takes 30-60 minutes per client.

- [ ] PIIA template created
- [ ] Process: complete before building each client's workflows

---

### Step 2.5 — Incident Response Contacts

The incident response runbook in the security recommendations doc has the structure. You need to fill in the actual names and numbers.

**Create a physical card (and digital copy) with:**

```
DO.QIX INCIDENT RESPONSE — KEEP ACCESSIBLE

1. CONFIRM INCIDENT
   On-call: [Your Name] — [Your Phone]
   Backup: [Trusted Person] — [Their Phone]

2. ISOLATE
   SSH: ssh <ADMIN_USER>@<SERVER_IP>
   Stop n8n: launchctl bootout gui/$(id -u)/com.n8n.web
   Stop webhooks: launchctl bootout gui/$(id -u)/com.n8n.webhook

3. PRESERVE EVIDENCE
   Snapshot logs: cp -r ~/.n8n-native/logs/ ~/incident-$(date +%Y%m%d)/
   Snapshot DB: pg_dump -U n8n -Fc n8n > ~/incident-$(date +%Y%m%d)/db.dump

4. NOTIFY
   Information Regulator: https://inforegulator.org.za/
   Phone: 010 023 5207
   Email: complaints.IR@justice.gov.za

5. CLIENT NOTIFICATION
   Template email: [draft a template and store it]
   Call first, email second.

6. ROTATE CREDENTIALS
   n8n login passwords: change in n8n UI
   DB password: edit config.env, restart PostgreSQL + n8n
   Cloudflare API token: regenerate in Cloudflare dashboard
   Encryption key: DO NOT ROTATE (breaks all credentials)
```

- [ ] Contact card created (digital + printed)
- [ ] Client notification email template drafted
- [ ] Card accessible from phone (not only on the iMac)
- [ ] Dry run: walk through steps 1-3 without actually stopping services

---

## Phase 3: Webhook & Workflow Security (Per Client)

Do these for every client engagement.

---

### Step 3.1 — Webhook HMAC Verification

Every webhook is a public URL. Without verification, anyone who discovers the URL can trigger your client's workflows.

**For each webhook workflow, add a Code node immediately after the Webhook trigger:**

**Shopify example:**
```javascript
const crypto = require('crypto');
const secret = 'client_shopify_webhook_secret_here';
const signature = $input.first().headers['x-shopify-hmac-sha256'];
const body = JSON.stringify($input.first().json);

const computed = crypto
  .createHmac('sha256', secret)
  .update(body, 'utf8')
  .digest('base64');

if (signature !== computed) {
  throw new Error('Invalid HMAC signature — rejecting webhook');
}

return $input.all();
```

**GitHub example:**
```javascript
const crypto = require('crypto');
const secret = 'client_github_webhook_secret_here';
const signature = $input.first().headers['x-hub-signature-256'];
const body = JSON.stringify($input.first().json);

const computed = 'sha256=' + crypto
  .createHmac('sha256', secret)
  .update(body, 'utf8')
  .digest('hex');

if (signature !== computed) {
  throw new Error('Invalid HMAC signature — rejecting webhook');
}

return $input.all();
```

**For services without HMAC support**, use header authentication:
- Set a random secret header in the Webhook node (e.g., `X-Webhook-Secret: random-string-here`)
- Configure the sending service to include this header
- The Webhook node rejects requests without the correct header

- [ ] Process: every webhook workflow gets HMAC or header auth before go-live
- [ ] Document each webhook's auth method in the client PIIA

---

### Step 3.2 — Pre-Launch Workflow Review Checklist

Before activating any client workflow in production, check:

```
WORKFLOW REVIEW — [Client Name] — [Workflow Name]
Date: ___________

SECURITY
[ ] All webhooks have HMAC or header authentication
[ ] No hardcoded credentials (use n8n credentials store)
[ ] No unnecessary data fields passed between nodes
[ ] Error workflow connected (sends alert on failure)

DATA
[ ] PIIA completed for this client
[ ] Execution data pruning confirmed (7 days)
[ ] Only minimum required data flows through each node
[ ] No personal data written to logs unnecessarily

TESTING
[ ] Workflow tested with sample data
[ ] Error handling tested (what happens when an API is down?)
[ ] Webhook tested with valid AND invalid signatures

SIGN-OFF
Reviewed by: ___________ Date: ___________
```

- [ ] Checklist template created
- [ ] Process: complete for every workflow before activation

---

## Phase 4: Cloudflare Hardening (30 Minutes)

Quick wins you can do right now in the Cloudflare dashboard.

---

### Step 4.1 — Enable Cloudflare Access (Zero-Trust Login)

Adds a second authentication layer before anyone even sees the n8n login page.

1. Log in to Cloudflare dashboard → Zero Trust → Access → Applications
2. Add application:
   - Name: `n8n Editor`
   - Domain: `n8n.digitaloperations.co.za`
   - Policy: Allow — email ends with `@digitaloperations.co.za` (or your specific email)
3. Save

Now anyone visiting `n8n.digitaloperations.co.za` must authenticate through Cloudflare FIRST, then through n8n. Two layers.

**Do NOT apply this to `hooks.digitaloperations.co.za`** — webhooks need to be publicly accessible.

- [ ] Cloudflare Access configured for n8n editor domain
- [ ] Verified: you can still log in through both layers
- [ ] Verified: webhooks still work on hooks domain

---

### Step 4.2 — Geo-Blocking (Optional)

If you and your clients are all in South Africa, restrict access by country.

1. Cloudflare dashboard → Security → WAF → Custom Rules
2. Create rule:
   - Name: `Block non-SA traffic to editor`
   - Expression: `(http.host eq "n8n.digitaloperations.co.za" and ip.geoip.country ne "ZA")`
   - Action: Block
3. Save

**Caution:** If you ever need to access n8n while travelling, you'll need to disable this or add your travel country. Cloudflare Access (Step 4.1) is more flexible.

- [ ] Geo-blocking rule created (if applicable)
- [ ] Tested: can access from SA
- [ ] Documented: how to temporarily disable if needed

---

## Phase 5: Future — Cloud Migration Planning

Not required for launch, but plan for it as you scale past 3-5 clients.

---

### Step 5.1 — When to Migrate

Migrate to cloud hosting when ANY of these become true:

- You have 5+ active clients
- A client requires contractual guaranteed uptime (not just "target")
- Load-shedding frequency makes UPS runtime insufficient
- You need multi-tenant isolation (separate n8n per client)
- You're spending more time maintaining infrastructure than building workflows

### Step 5.2 — Target Architecture

```
Internet → Cloudflare → Docker host (AWS af-south-1 or Hetzner SA)
                      → Traefik (reverse proxy, auto-TLS)
                      → Per-client Docker Compose stacks:
                          client-a: n8n + PostgreSQL + task-runner
                          client-b: n8n + PostgreSQL + task-runner
```

### Step 5.3 — Sizing

| Clients | Server Spec | Monthly Cost (est.) |
|---------|------------|-------------------|
| 1-3 | 4 CPU, 8GB RAM, 80GB SSD | R500–R800 (Hetzner SA) |
| 4-8 | 8 CPU, 32GB RAM, 200GB SSD | R1,500–R2,500 (Hetzner SA) |
| 8+ | Multiple servers or Kubernetes | R3,000+ |

### Step 5.4 — Migration Steps (High Level)

1. Provision cloud server (Ubuntu 24.04 LTS)
2. Install Docker, set up Traefik with Let's Encrypt
3. Deploy n8n per `docker-compose.yml` from security recommendations doc
4. Export workflows from iMac n8n (Settings → Export)
5. Dump and restore PostgreSQL to cloud server
6. Copy `N8N_ENCRYPTION_KEY` (critical — without it credentials break)
7. Update Cloudflare DNS to point to cloud server IP
8. Test everything
9. Decommission iMac n8n (keep as local backup/staging)

Detailed migration guide to be written when the time comes.

- [ ] Decision criteria documented
- [ ] Cloud provider shortlisted
- [ ] Budget allocated

---

## Master Checklist

Print this page and check off as you go.

### Phase 1 — Infrastructure (Weekend)
- [ ] 1.1 — n8n security env vars verified and services restarted
- [ ] 1.2 — Encryption key stored in password manager + GPG on USB
- [ ] 1.3 — Backup scripts updated with GPG encryption
- [ ] 1.4 — UPS connected and tested
- [ ] 1.4 — LTE failover in place and tested
- [ ] 1.5 — Full backup restore test completed and documented

### Phase 2 — Legal (This Week)
- [ ] 2.1 — Information Officer registered with Information Regulator
- [ ] 2.2 — PAIA Section 51 manual published on website
- [ ] 2.3 — DPA template drafted and reviewed by lawyer
- [ ] 2.4 — PIIA template created
- [ ] 2.5 — Incident response contact card created and tested

### Phase 3 — Per Client (Each Engagement)
- [ ] 3.1 — HMAC/header auth on all webhooks
- [ ] 3.2 — Workflow review checklist completed before go-live

### Phase 4 — Cloudflare (30 Minutes)
- [ ] 4.1 — Cloudflare Access on editor domain
- [ ] 4.2 — Geo-blocking (if applicable)

### Phase 5 — Cloud Migration (When Ready)
- [ ] 5.1 — Migration criteria defined
- [ ] 5.2 — Cloud provider selected
- [ ] 5.3 — Migration executed

---

## Monthly Maintenance

Set recurring calendar reminders:

| Task | Frequency | Calendar Day |
|------|-----------|-------------|
| Backup restore test | Monthly | 1st of month |
| Check n8n version for security updates | Weekly | Monday |
| Review Cloudflare analytics for anomalies | Weekly | Monday |
| Review n8n execution errors | Weekly | Friday |
| Check SSL certificate expiry (automated, but verify) | Monthly | 15th |
| Update this checklist | Quarterly | 1st of quarter |
| PIIA review per active client | Annually | Client anniversary |

---

*This document is operational — update it as you complete steps. When fully checked off, you are launch-ready.*
