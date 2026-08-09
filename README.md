# AURA — Modern Mobile-First Fashion E-Commerce Platform

A production-grade, monorepo fashion e-commerce platform featuring a **Nuxt 4 Storefront**, a **Vue 3 + Vite Admin Dashboard**, a decoupled **NestJS 11 REST API**, and a **WhatsApp-based Checkout Flow**.

---

## 🏗️ Architecture Overview

- **Monorepo**: Managed via `pnpm` workspaces + `Turborepo`.
- **Apps**:
  - [`apps/storefront`](file:///f:/30072026/apps/storefront): Nuxt 4 (Vue 3.5) SSR/SSG storefront with Pinia, Tailwind CSS 4, Google Fonts (`Playfair Display` + `Inter`), and responsive drawer menus.
  - [`apps/admin`](file:///f:/30072026/apps/admin): Vue 3.5 + Vite SPA admin dashboard with Pinia, server-side RBAC permission guards, product CRUD, inventory stock audit, orders pipeline, and sales analytics.
  - [`apps/api`](file:///f:/30072026/apps/api): NestJS 11.x REST API (`/api/v1`) with Swagger OpenAPI documentation (`/api/docs`), Passport JWT authentication, and global exception filtering.
  - [`packages/shared-types`](file:///f:/30072026/packages/shared-types): Shared TypeScript interfaces, enums, DTOs, and permission codes.
- **Databases & Infrastructure**: PostgreSQL 18 (Prisma ORM 7.x) and Redis 8.

---

## 💬 WhatsApp Checkout Flow

Instead of an expensive or complex payment gateway for v1, checkout creates an order record (`pending_whatsapp` status), snapshots customer info, shipping address, items, and unit prices, decrements stock atomically, and constructs a pre-filled, URL-encoded WhatsApp deep link:
`https://wa.me/<store_number>?text=...`

If the browser blocks the automatic redirect, a fallback screen displays an **"Open WhatsApp Chat"** button and a **"Copy Order Text"** button with toast notifications.

---

## 🚀 Quick Start (Local Development)

### 1. Requirements
- Node.js >= 22.0.0
- pnpm >= 9.15.0
- Docker & Docker Compose

### 2. Setup Infrastructure & Environment
```bash
# Clone and enter directory
cd fashion-store

# Copy environment file
cp .env.example .env

# Start local PostgreSQL 18 & Redis 8
docker-compose up -d
```

### 3. Database Migration & Seeding
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed default roles, permissions, superadmin user, and rich catalog data
pnpm db:seed
```

### 4. Run Development Stack
```bash
# Launch storefront (port 3001), admin (port 3002), and API (port 3000) concurrently
pnpm dev
```

- **Storefront**: [http://localhost:3001](http://localhost:3001)
- **Admin Dashboard**: [http://localhost:3002](http://localhost:3002) (Login: `admin@fashionstore.com` / `AdminPass123!`)
- **API Swagger Documentation**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🧪 Testing

```bash
# Run NestJS unit and integration test suites
pnpm --filter @fashion-store/api test
```

---

## 📜 Production Deployment

Refer to [`DEPLOYMENT.md`](file:///f:/30072026/DEPLOYMENT.md) for full Docker production deployment instructions.
