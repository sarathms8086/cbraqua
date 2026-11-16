FROM node:20-bookworm-slim

WORKDIR /app

# Install openssl and ca-certificates (required for Prisma engine)
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package descriptors
COPY package*.json ./
COPY server/package*.json ./server/

# Install root & server dependencies
RUN npm install
RUN cd server && npm install

# Copy repository source code
COPY . .

# Generate Prisma client for Linux and compile both frontend & backend
RUN cd server && npx prisma generate
RUN npm run build
RUN cd server && npm run build

# Default environment configuration
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL="file:./dev.db"

EXPOSE 3001

# Push database schema, seed if needed, and run Express server
CMD ["sh", "-c", "cd server && npx prisma db push && (npx prisma db seed || true) && node dist/src/index.js"]
