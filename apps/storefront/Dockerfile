# Base stage
FROM node:24-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/storefront/package.json ./apps/storefront/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN pnpm install --frozen-lockfile --filter @fashion-store/storefront...

# Build stage
FROM deps AS builder
COPY packages/shared-types ./packages/shared-types
COPY apps/storefront ./apps/storefront
RUN pnpm --filter @fashion-store/shared-types build
RUN pnpm --filter @fashion-store/storefront build

# Production Runner stage
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

COPY --from=builder /app/apps/storefront/.output ./apps/storefront/.output

EXPOSE 3001
CMD ["node", "apps/storefront/.output/server/index.mjs"]
