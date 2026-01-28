# --- Stage 1: Build the Next.js app ---
FROM node:lts-trixie-slim AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire app
COPY . .

# Build the app
RUN npm run build

# --- Stage 2: Run the production build ---
FROM node:lts-trixie-slim AS runner

WORKDIR /app

# Copy only necessary build output and dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose your Next.js app port
EXPOSE 5000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
