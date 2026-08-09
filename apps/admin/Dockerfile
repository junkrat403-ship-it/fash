# Build stage
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN pnpm install --frozen-lockfile --filter @fashion-store/admin...

COPY packages/shared-types ./packages/shared-types
COPY apps/admin ./apps/admin
RUN pnpm --filter @fashion-store/shared-types build
RUN pnpm --filter @fashion-store/admin build

# Nginx Production Stage
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
