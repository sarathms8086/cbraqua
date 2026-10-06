#!/bin/bash

# Configuration
PEM_FILE="Danywens.pem"
REMOTE_USER="ubuntu"
SERVER_IP=$1
APP_DIR="/var/www/danywens"
RZP_KEY_CSV="${RZP_KEY_CSV:-$HOME/Downloads/rzp-key.csv}"

if [ -z "$SERVER_IP" ]; then
    echo "Usage: ./deploy/ship.sh <server_ip>"
    exit 1
fi

if [ ! -f "$RZP_KEY_CSV" ]; then
    echo "Missing Razorpay key CSV at $RZP_KEY_CSV"
    exit 1
fi

RZP_LINE=$(tail -n +2 "$RZP_KEY_CSV" | head -n 1)
RAZORPAY_KEY_ID=$(printf "%s" "$RZP_LINE" | cut -d, -f1 | tr -d '\r')
RAZORPAY_KEY_SECRET=$(printf "%s" "$RZP_LINE" | cut -d, -f2 | tr -d '\r')

if [ -z "$RAZORPAY_KEY_ID" ] || [ -z "$RAZORPAY_KEY_SECRET" ] || [[ "$RAZORPAY_KEY_ID" == *placeholder* ]] || [[ "$RAZORPAY_KEY_SECRET" == *placeholder* ]]; then
    echo "Razorpay keys are missing or still placeholders."
    exit 1
fi

export VITE_RAZORPAY_KEY_ID="$RAZORPAY_KEY_ID"

echo "Building frontend..."
npm run build

echo "Preparing server..."
cd server
npm install
npm run build
cd ..

echo "Shipping to $SERVER_IP..."

# Sync files with --delete to remove stale large assets
rsync -avz --delete -e "ssh -i $PEM_FILE" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude 'uploads' \
    --exclude 'server/prisma/dev.db' \
    --exclude 'server/prisma/dev.db-*' \
    --exclude 'server/prisma/backups' \
    --exclude 'originals_backup' \
    dist \
    server \
    $REMOTE_USER@$SERVER_IP:$APP_DIR

# Also sync nginx conf
scp -i $PEM_FILE deploy/nginx.conf $REMOTE_USER@$SERVER_IP:/tmp/nginx.conf

# Install and restart on remote
ssh -i $PEM_FILE $REMOTE_USER@$SERVER_IP << EOF
    # Update active Nginx config
    sudo mv /tmp/nginx.conf /etc/nginx/sites-available/danywens
    sudo ln -sfn /etc/nginx/sites-available/danywens /etc/nginx/sites-enabled/danywens
    sudo systemctl reload nginx

    cd $APP_DIR/server
    npm install --production
    
    # Create .env on remote
    cat > .env << EOL
DATABASE_URL="file:./dev.db"
PORT=3001
RAZORPAY_KEY_ID="$RAZORPAY_KEY_ID"
RAZORPAY_KEY_SECRET="$RAZORPAY_KEY_SECRET"
EOL

    npx prisma generate

    # Preserve live SQLite data. Back up before schema sync and never overwrite
    # the remote DB from the local checkout.
    if [ -f prisma/dev.db ]; then
        mkdir -p prisma/backups
        cp prisma/dev.db "prisma/backups/dev-$(date +%Y%m%d-%H%M%S).db"
    fi
    npx prisma db push
    
    # Restart app with PM2
    pm2 delete danywens-api || true
    pm2 delete danywens-backend || true
    pm2 start dist/src/index.js --name danywens-api
    pm2 save
EOF

echo "Shipment complete! Site should be live at http://$SERVER_IP"
