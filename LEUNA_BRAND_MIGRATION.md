# Leuna brand migration (Docutracker → Leuna)

Code and database changes for the rebrand. Use this checklist for local dev and production (e.g. Railway).

## 1. Environment variables

### Rename in Railway / production dashboard

| Variable | Notes |
|----------|--------|
| `NEXT_PRIVATE_LEUNA_LICENSE_KEY` | Enterprise license; leave empty if unused |
| `LEUNA_DISABLE_TELEMETRY` | Set to `true` to disable telemetry |

### No rename required (already correct)

| Variable | Purpose |
|----------|---------|
| `NEXT_PRIVATE_ENCRYPTION_KEY` | Primary encryption (exposed in code as `LEUNA_ENCRYPTION_KEY`) |
| `NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY` | Secondary encryption (`LEUNA_ENCRYPTION_SECONDARY_KEY`) |
| `NEXT_PRIVATE_SMTP_FROM_NAME` | Email display name (e.g. `Leuna`) |
| `NEXT_PRIVATE_SMTP_FROM_ADDRESS` | Email from address (e.g. `noreply@leuna.app`) |

**Do not change encryption key values** unless you intend to re-encrypt stored secrets — existing encrypted data would become unreadable.

### Local `.env`

Your local `.env` is already updated with the new variable names. Empty values are fine for license and telemetry unless you use those features.

## 2. Database migration

Renames Postgres enum value `IdentityProvider.SIGN_DOCUTRACKER` → `LEUNA` for email/password accounts.

### Local

```bash
npm run prisma:migrate-dev
```

### Production (Railway)

After deploying the code that includes migration `20260603120000_rename_identity_provider_to_leuna`:

```bash
npm run prisma:migrate-deploy
```

Or trigger your platform’s deploy hook that runs migrations on release.

**No data loss:** existing users keep the same row; only the enum label changes.

## 3. Deploy order

1. Set `NEXT_PRIVATE_LEUNA_LICENSE_KEY` and `LEUNA_DISABLE_TELEMETRY` in Railway (if used).
2. Deploy application code (includes migration file).
3. Run `prisma migrate deploy` against production DB.
4. Smoke test: sign in, send document email, OIDC portal (if used).

Old migration SQL files still mention `SIGN_DOCUTRACKER`; that is historical only.
