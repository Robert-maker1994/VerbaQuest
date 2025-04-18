# ---- Base Node ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies ----
# Install ALL dependencies first to leverage Docker caching for this layer
FROM base AS deps
COPY package.json package-lock.json* ./
COPY packages/types/package.json ./packages/types/
COPY packages/api/package.json ./packages/api/
RUN npm install --loglevel error

# ---- Builder ----
# Build the types and api packages using the full node_modules
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build -w @verbaquest/types
RUN npm run build -w @verbaquest/api

# ---- Prune Dev Dependencies ---
FROM base AS prod-deps
COPY package.json package-lock.json* ./
COPY packages/api/package.json ./packages/api/
RUN npm ci --omit=dev --loglevel error

# ---- Runner ----
FROM node:18-alpine AS runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV PORT=8080

COPY /packages/api/seeder ./packages/api/seeder
COPY --from=prod-deps /app/node_modules ./node_modules

COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/api/package.json ./packages/api/package.json

COPY --from=builder /app/packages/types/package.json ./node_modules/@verbaquest/types/package.json
COPY --from=builder /app/packages/types/dist ./node_modules/@verbaquest/types/dist

EXPOSE 8080

# Define the command to run the application using the api's built entrypoint
CMD ["node", "packages/api/dist/server.js"]