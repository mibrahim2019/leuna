# Leuna icon rebrand — remaining work

Status of the brand-mark rollout. **Done** items are already live in the working tree
(new yellow asterisk mark + "leuna" lockups). This file lists what's left.

## ✅ Already done (this pass)
- Favicons (PNG): `apps/remix/public/{favicon-16x16,favicon-32x32,apple-touch-icon,android-chrome-192x192,android-chrome-512x512}.png`
- Docs favicons: `apps/docs/public/{favicon-16x16,favicon-32x32,apple-touch-icon}.png`, `apps/docs/src/app/apple-icon.png`
- Nav/wordmark icon + PDF fallback: `packages/assets/logo.svg`, `apps/remix/app/components/general/branding-logo-icon.tsx`
- Email + app raster lockups: `packages/email/static/logo.png`, `apps/remix/public/static/logo.png`, `apps/docs/public/logo.png`
- **Navbar + everywhere wordmark lockup** (replaced the live-text `SignWordmarkLogo`):
  - New transparent lockup assets generated from `leuna-assets/email-header-logo-600x200.png`
    (white keyed out, halos un-premultiplied): `packages/assets/wordmark.png` (black text, light
    surfaces) + `packages/assets/wordmark-dark.png` (white text, dark surfaces).
    Generator: `leuna-assets/make-wordmark.cjs`.
  - New component `apps/remix/app/components/general/wordmark-logo.tsx` with a
    `variant` prop (`auto` | `light` | `dark`) so the lockup contrasts on every surface.
  - `SignWordmarkLogo` **deleted** (`apps/remix/app/components/general/sign-wordmark-logo.tsx`
    removed); all 16 usages migrated — app/marketing/profile/signer/editor headers + mobile nav
    (light/auto), and the near-black "Powered by" badges (dark). Test mock updated. `tsc` + `eslint` clean.
- Emails confirmed on new branding: `template-shell.tsx` renders the new `logo.png` lockup; no stale
  "Documenso" text in any email template/footer.

---

## 🔲 Remaining

### 1. ✅ `favicon.ico` (multi-resolution) — DONE
All three `.ico` files now hold the new mark as a clean, true multi-resolution ICO
(16/32/48 PNG-compressed entries, ~4 KB):
- `apps/remix/public/favicon.ico`
- `apps/docs/src/app/favicon.ico`
- `packages/assets/favicon.ico`

Note: `png-to-ico` upscaled and injected a stray 256×256 uncompressed BMP (~285 KB), and the
source `leuna-assets/favicon-*.png` are oversized (72/120/168 px). Final ico was hand-built with
sharp: resized exactly to 16/32/48 from `leuna-assets/favicon-48x48.png`, embedded as PNG.
(Optional, not done: add `favicon.svg` from `packages/assets/logo.svg` + reference in `root.tsx` head.)

### 2. Open Graph / social share image — HIGH (this is the "Google/social card") — DEFERRED
`apps/remix/app/utils/meta.ts` points `og:image` + `twitter:image` at `/opengraph-image.jpg`,
and HAS NO matching export in `leuna-assets/` — **and the file `apps/remix/public/opengraph-image.jpg`
does not even exist**, so social cards are currently broken (404). Owner chose to defer until a
designed card is ready.
- Export a 1200×630 OG card from the Pencil file (icon + "leuna" + tagline) into `leuna-assets/`.
- Add `apps/remix/public/opengraph-image.jpg` (resize/convert with sharp).

### 3. ✅ Stale brand references in meta — DONE
In `apps/remix/app/utils/meta.ts`:
- `twitter:site` (`@documenso`) **removed** entirely (no Leuna handle yet).

### 4. ✅ Brand color consistency — DONE (decision: yellow)
- Manifests `theme_color` set to brand yellow `#FFD400` in both
  `apps/remix/public/site.webmanifest` and `packages/assets/site.webmanifest`.
  `background_color` stays `#FFFFFF`.
- ✅ ~~`SignWordmarkLogo` renders the "a" in `#2563eb` (blue)~~ — resolved: the live-text
  wordmark was deleted and replaced everywhere by the `WordmarkLogo` image lockup (yellow mark +
  black/white "leuna"). No blue accent remains in the wordmark.

### 5. ✅ Legacy wordmark vector — DONE
`apps/remix/app/components/general/branding-logo.tsx` (OLD swirl + wordmark vector) had no module
imports and no `<BrandingLogo>` JSX usages — confirmed dead and **deleted**.

### 6. Verify in the running app — before merge
- `apps/remix`: load the app, check the nav wordmark, browser-tab favicon, and a sent email.
- `apps/docs`: check tab favicon + header logo.
- Send/preview one transactional email to confirm `packages/email/static/logo.png` looks right.
- Generate a PDF with default branding to confirm `packages/assets/logo.svg` fallback renders.

### 7. Other social assets exported but not yet wired — OPTIONAL
`leuna-assets/` also has `linkedin-logo-400x400.png`, `reddit-icon-300x300.png`,
`bimi-logo.png`, `email-signature-logo-320x132.png`. These are for external profiles /
email-signature / BIMI DNS — upload manually where needed (not codebase files).
Note: BIMI specifically requires an **SVG Tiny PS** `bimi-logo.svg` (not PNG) hosted at a
public URL referenced from a DNS TXT record.

---

## Source assets
All exports live in `leuna-assets/` (hi-res, white background, yellow mark with black border).
Vector source of truth for the mark: `packages/assets/logo.svg` (viewBox `0 0 88 88`).
