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
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build -w @verbaquest/types

# Needed for type decorations for the api 
RUN npm install

RUN npm run build -w @verbaquest/api

# ---- Prune Dev Dependencies ---
FROM base AS prod-deps
ARG USER
ARG DB_USER
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_NAME
ARG PG_PORT

ENV USER=${USER}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_HOST=${DB_HOST}
ENV DB_NAME=${DB_NAME}
ENV PG_PORT=5432
COPY package.json package-lock.json* ./
COPY packages/api/package.json ./packages/api/
RUN npm ci --omit=dev --loglevel error

# ---- Runner ----
# FROM node:18-alpine AS runner
# WORKDIR /app

# # Set NODE_ENV to production
ENV NODE_ENV=production
ENV PORT=8080

COPY /packages/api/seeder ./packages/api/seeder
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/api/package.json ./packages/api/package.json

COPY --from=builder /app/packages/types/package.json ./node_modules/@verbaquest/types/package.json
COPY --from=builder /app/packages/types/dist ./node_modules/@verbaquest/types/dist

EXPOSE 8080

CMD ["node", "packages/api/dist/server.js"]