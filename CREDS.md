# Credentials (pointers only — never put secret values here)

| What | Where it lives | Env var / file |
|------|----------------|----------------|
| EC2 SSH key | repo root (gitignored) | `Danywens.pem` |
| Razorpay keys | `~/Downloads/rzp-key.csv` (read by `deploy/ship.sh`) | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| Mail (GoDaddy, hello@danywens.com) | server only: `/var/www/danywens/server/.env` (preserved by `ship.sh`) | `SMTP_PASS` (optional: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SUPPORT_EMAIL`) |

Rotating `SMTP_PASS`: change it in GoDaddy, edit the server `.env` line, then `pm2 restart danywens-api --update-env`.
