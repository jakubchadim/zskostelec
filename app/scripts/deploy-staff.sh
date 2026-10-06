#!/usr/bin/env bash
# Prepares the production database for staff in the CMS (run BEFORE pushing the code):
#   1. applies pending migrations (new staff tables) to Neon
#   2. imports the 69 staff from scripts/staff-seed.ts (re-runnable, skips existing)
# Reads PROD_DATABASE_URL from app/.env.local; never prints it.
#
# Usage (from app/): ./scripts/deploy-staff.sh
set -euo pipefail

cd "$(dirname "$0")/.."

PROD_URL=$(grep -E '^PROD_DATABASE_URL=' .env.local | head -1 | cut -d= -f2- | sed -E 's/^["'\'']//; s/["'\'']$//')
if [ -z "$PROD_URL" ]; then
  echo "PROD_DATABASE_URL not found in app/.env.local" >&2
  exit 1
fi

HOST=$(echo "$PROD_URL" | sed -E 's#^[a-z]+://[^@]*@([^/:?]+).*#\1#')
echo "Production database: $HOST"
read -r -p "Run migrations + staff import against it? [y/N] " answer
[ "$answer" = "y" ] || [ "$answer" = "Y" ] || { echo "Cancelled."; exit 1; }

export DATABASE_URL="$PROD_URL"
export NODE_ENV=production

echo "→ Migrations"
npx payload migrate

echo "→ Staff import"
npx payload run scripts/import-staff.ts

echo
echo "Done. Now push the code (git push) - Vercel deploys and the site reads staff from the CMS."
