# Danywens storefront

## Deploy
- Production (danywens.com) is served entirely by nginx on EC2 `54.90.130.215` — frontend `dist/` and the Express API (PM2 process `danywens-api`). Vercel project is stale and not used.
- Deploy: `bash deploy/ship.sh 54.90.130.215` (needs `Danywens.pem` in repo root and `~/Downloads/rzp-key.csv`). It rebuilds, rsyncs, backs up the SQLite DB to `server/prisma/backups/`, runs `prisma db push`, restarts PM2.
- After deploying, smoke-test: `curl -s -o /dev/null -w "%{http_code}" https://danywens.com/api/products` must be 200. PM2 can show "online" for a second before crash-looping — check `pm2 jlist` restarts on the server.
- Every server `require` must be in `server/package.json`; remote runs `npm install --production` (a missing `nodemailer` caused a 502 once).
- Images: `/api/upload` writes a `<file>.webp` sibling + `-lqip` placeholder per image; nginx (`deploy/nginx.conf`) serves the `.webp` via `try_files $uri$webp_suffix` when Accept has webp. Original JPGs on disk are raw camera files (up to 21 MB) — never serve them directly. Check with `curl -H 'Accept: image/webp' -w '%{content_type} %{size_download}'`.
- `ship.sh` rewrites the remote `server/.env` with DATABASE_URL/PORT/Razorpay keys, but preserves any existing `SMTP_*`/`SUPPORT_EMAIL` lines. SMTP is set by hand on the server (`/var/www/danywens/server/.env`, GoDaddy `smtpout.secureserver.net:465`, user `hello@danywens.com`). Without `SMTP_PASS` all mail is off: contact form falls back to the customer's mailto, order emails silently skip; API logs `WARNING: SMTP_PASS not set` on boot.
- Frontend `node_modules` may be absent locally — run `npm ci` before `ship.sh` (it doesn't `set -e`, so a failed build still ships stale `dist/`).

## Checkout
- Shipping is India-only: shipping Country is a locked "India" field (no dropdown — a mis-set dropdown blocked a real Indian customer, Nov 2026). Server also 403s non-India `shippingCountry`.
- Paid orders send two emails (when SMTP is set): `sendOrderNotification` → support inbox, `sendCustomerConfirmation` → customer.

## Data
- SQLite via Prisma; schema changes are applied with `db push` (no migrations). Keep new columns optional.
- Product page tab text: per-product `shippingText`/`washcareText` override the site-wide `siteSettings` values when non-empty.
