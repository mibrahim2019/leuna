# Cloudflare setup for leuna.app (you do these; then send me the R2 creds)

Two parts: **(A) DNS** so leuna.app points at Railway, and **(B) R2** for document storage.

---

## A. DNS records (Cloudflare → leuna.app → DNS → Records)

Add these **exactly**. Set **Proxy status = DNS only (grey cloud)** on the CNAMEs —
Railway issues its own TLS cert and the Cloudflare orange-proxy blocks that.

| Type  | Name                | Content / Target                          | Proxy     |
|-------|---------------------|-------------------------------------------|-----------|
| CNAME | `@`                 | `plrcd7a1.up.railway.app`                 | DNS only  |
| TXT   | `_railway-verify`   | `railway-verify=b3ca6cf55bf7cf6cc188c4764a8a2a603b29773e60ea36c9f42a9da39ed22285` | n/a |
| CNAME | `www`               | `dkosg07f.up.railway.app`                 | DNS only  |
| TXT   | `_railway-verify.www` | `railway-verify=63476b4e415a466406c59c7e44440e57c869fd066c45b1f42102f98362c912b1` | n/a |

> Cloudflare auto-flattens the root (`@`) CNAME, so a root CNAME is fine.
> The TXT `Content` above already includes the `railway-verify=` prefix once
> (Railway's CLI double-printed it — use the single-prefix value shown here).

After adding, Railway verifies + provisions TLS automatically (minutes, up to 72h worst case).

---

## B. Cloudflare R2 (document storage)

1. **Create bucket:** Cloudflare dashboard → **R2** → *Create bucket* → name it
   **`leuna-documents`** → Location: Automatic → Create.

2. **Create an API token:** R2 → *Manage R2 API Tokens* → **Create API token**
   - Permissions: **Object Read & Write**
   - Scope: *Apply to specific buckets* → `leuna-documents` (or all)
   - Create. **Copy these now (shown once):**
     - **Access Key ID**
     - **Secret Access Key**
     - **Account ID** (in the page header / endpoint) — your S3 endpoint is
       `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

3. **CORS** (browser uploads go directly to R2 via presigned URLs):
   bucket `leuna-documents` → **Settings** → *CORS policy* → Edit → paste:

   ```json
   [
     {
       "AllowedOrigins": ["https://leuna.app", "https://www.leuna.app"],
       "AllowedMethods": ["GET", "PUT", "HEAD"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

---

## Send me back

```
R2 Account ID:        <...>
R2 Access Key ID:     <...>
R2 Secret Access Key: <...>
```

I'll set the `NEXT_PRIVATE_UPLOAD_*` vars on Railway (endpoint, keys, bucket=leuna-documents,
region=auto, force-path-style=true). Changing vars triggers an automatic redeploy.
