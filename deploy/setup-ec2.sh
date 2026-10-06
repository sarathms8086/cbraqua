#!/bin/bash

# Configuration
PEM_FILE="Danywens.pem"
REMOTE_USER="ubuntu" # Or ec2-user depending on the AMI
SERVER_IP=$1

if [ -z "$SERVER_IP" ]; then
    echo "Usage: ./deploy/setup-ec2.sh <server_ip>"
    exit 1
fi

echo "Connecting to $SERVER_IP..."

# Update and install dependencies
ssh -i $PEM_FILE $REMOTE_USER@$SERVER_IP << 'EOF'
    sudo apt-get update
    sudo apt-get install -y curl gnupg
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs nginx git

    # Install PM2
    sudo npm install -g pm2

    # Configure Nginx
    sudo tee /etc/nginx/sites-available/danywens << 'NGINX_CONF'
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /var/www/danywens/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        alias /var/www/danywens/server/uploads;
    }
}
NGINX_CONF

    sudo ln -s /etc/nginx/sites-available/danywens /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo systemctl restart nginx

    # Create app directory
    sudo mkdir -p /var/www/danywens
    sudo chown -R $USER:$USER /var/www/danywens
EOF

echo "Setup complete."
