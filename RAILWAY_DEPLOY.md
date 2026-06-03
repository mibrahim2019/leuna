# Railway Production Deployment Guide — All-Railway (DB + App + MinIO storage)

> Set all secrets in **Railway → Service → Variables** (or `railway variables --set`).
> `.env` is gitignored — keep secrets out of git.

## Architecture

```
                    Railway project
  ┌──────────────┐   internal    ┌──────────────────┐
  │   App (web)  │ ────────────▶ │ Postgres (Railway)│
  │  Dockerfile  │  railway.internal └──────────────┘
  └──────┬───────┘
         │ presigned PUT/GET URLs (host = public MinIO domain)
         ▼  ── browser uploads/downloads go DIRECT to MinIO ──
  ┌──────────────────────────┐
  │ MinIO (public domain)     │── Railway Volume (/data)
  │ S3-compatible, path-style │
  └──────────────────────────┘
```

**Key fact:** this app generates **presigned S3 URLs**. The browser PUTs/GETs files
directly to the storage endpoint, so **MinIO must be publicly reachable** (a Railway
public domain) — an internal-only URL will not work. CORS must allow the app origin.

---

## Pre-flight (verified)
- ✅ `.env` gitignored; no live secret ever committed (only an old, stale DB URL).
- ✅ `docker/start.sh` auto-runs `prisma migrate deploy` on boot.
- ✅ Healthcheck `/api/health`; `railway.toml` updated with healthcheck + restart policy.
- ✅ App reads `NEXT_PRIVATE_UPLOAD_ENDPOINT` / `_FORCE_PATH_STYLE` / `_REGION` and uses presigned PUT+GET.

---

## 1. Postgres service (Railway)

1. Add a **PostgreSQL** service to the project.
2. On the **App** service set (no pgbouncer on Railway PG, so app + direct URL are the same):
   ```
   NEXT_PRIVATE_DATABASE_URL=${{Postgres.DATABASE_URL}}
   NEXT_PRIVATE_DIRECT_DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
   `${{Postgres.DATABASE_URL}}` resolves to the **internal** URL (`postgres.railway.internal`) —
   no egress cost, fast. Migrations run automatically on boot.
3. (Optional) cap Prisma connections by appending `?connection_limit=10` if you scale instances.
4. You are dropping Supabase — the old `pooler.supabase.com` URLs in `.env` are no longer used.

---

## 2. MinIO storage service (Railway)

1. **New service → Docker image:** `minio/minio:latest`
2. **Start command:**
   ```
   server /data --console-address ":9001"
   ```
3. **Volume:** add a Railway Volume mounted at **`/data`** (this is your durable storage; size it for expected document volume).
4. **Variables on the MinIO service:**
   ```
   MINIO_ROOT_USER=<long-random-user>
   MINIO_ROOT_PASSWORD=<long-random-password>
   MINIO_API_CORS_ALLOW_ORIGIN=https://<your-app-domain>
   ```
   (CORS is required — the browser uploads cross-origin from the app domain to MinIO.)
5. **Networking → expose a public domain**, target port **9000** (the S3 API; 9001 is just the web console). Note the generated `https://minio-xxxx.up.railway.app`.
6. **Create the bucket:** open the MinIO console (expose 9001 temporarily or use `mc`), log in with the root creds, create bucket **`leuna-documents`**. Recommended: create a dedicated access key for the app instead of using root creds.

---

## 3. App service — storage variables

```
NEXT_PUBLIC_UPLOAD_TRANSPORT=s3
NEXT_PRIVATE_UPLOAD_ENDPOINT=https://minio-xxxx.up.railway.app   # PUBLIC MinIO domain
NEXT_PRIVATE_UPLOAD_FORCE_PATH_STYLE=true                        # REQUIRED for MinIO
NEXT_PRIVATE_UPLOAD_REGION=us-east-1
NEXT_PRIVATE_UPLOAD_BUCKET=leuna-documents
NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID=<minio app access key>
NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY=<minio app secret key>
```
- Endpoint MUST be the public domain (presigned URLs are used by the browser).
- `forcePathStyle=true` is mandatory: MinIO on a single Railway domain can't do
  virtual-host `bucket.domain` style.

---

## 4. App service — security variables (fix before go-live)

| Var | Action |
|-----|--------|
| `NEXT_PUBLIC_WEBAPP_URL` | Set to `https://<your-app-domain>` (signed links + emails break otherwise). |
| `NEXT_PRIVATE_INTERNAL_WEBAPP_URL` | `http://localhost:3000` (in-container self-calls). |
| `POLAR_*` | Use the **production** set (`.env` L199-202). Delete the stray sandbox `railway variable set ...` lines (L204-207) from `.env`. |
| `NEXT_PRIVATE_SMTP_FROM_ADDRESS` | Brand is Leuna; keep leuna.app verified in Resend OR switch to a `leuna.app` sender — add SPF + DKIM + DMARC or mail goes to spam. |
| `NEXTAUTH_SECRET`, `NEXT_PRIVATE_ENCRYPTION_KEY`, `NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY` | Copy verbatim. ⚠️ **Back these up** — losing the encryption key makes stored data permanently undecryptable. |
| `NEXT_PRIVATE_SIGNING_PASSPHRASE` + `..._LOCAL_FILE_CONTENTS` | Keep (self-signed local signing). Stronger signatures later: `gcloud-hsm` / CA cert + `NEXT_PRIVATE_SIGNING_TIMESTAMP_AUTHORITY`. |
| `NEXT_PRIVATE_GOOGLE_CLIENT_*` | Add prod redirect URI `https://<your-app-domain>/api/auth/callback/google` in Google Console. |
| `DANGEROUS_BYPASS_RATE_LIMITS` | Keep **empty**. |
| `E2E_TEST_*`, `PORT` | Don't set in Railway (Railway injects `PORT`). |
| `NEXT_PRIVATE_RESEND_API_KEY` | Copy from `.env`. |

---

## 5. Performance / cost notes
- MinIO + volume keeps Postgres small (metadata only) → cheaper, faster DB. ✅
- Volume is your single source of document truth — **set up Railway volume backups/snapshots**; unlike S3 there's no built-in redundancy.
- Jobs: `NEXT_PRIVATE_JOBS_PROVIDER=local` loses in-flight jobs on every redeploy. Fine for MVP. For reliability add a Railway **Redis** service and:
  ```
  NEXT_PRIVATE_JOBS_PROVIDER=bullmq
  NEXT_PRIVATE_REDIS_URL=${{Redis.REDIS_URL}}
  NEXT_PRIVATE_REDIS_PREFIX=leuna
  ```
- Healthcheck (already in `railway.toml`) restarts failed deploys instead of billing a hung container.

---

## 6. Deploy order
1. Create **Postgres** service.
2. Create **MinIO** service + volume, expose public domain, create bucket + app key.
3. On **App**: set all §1/§3/§4 variables. Build is handled by `railway.toml` → `docker/Dockerfile`.
4. Add the app's custom domain; set `NEXT_PUBLIC_WEBAPP_URL` and MinIO `MINIO_API_CORS_ALLOW_ORIGIN` to it.
5. Deploy app (migrations run on boot).

## 7. Smoke test
- `https://<app>/api/health` → 200
- `https://<app>/api/certificate-status` → signing ready
- Upload a document → confirm the object lands in the `leuna-documents` bucket (MinIO console).
- Sign a document; download it; confirm completion email arrives (not spam).
