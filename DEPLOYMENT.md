# Production Deployment Runbook — AURA E-Commerce Platform

This guide outlines the production deployment procedure for the AURA Fashion E-Commerce platform using Docker Compose, PostgreSQL 18, and Redis 8.

---

## 📋 Prerequisites

1. Linux server (Ubuntu 22.04 LTS or Debian 12 recommended) with Docker Engine and Docker Compose v2.x installed.
2. Domain names configured with DNS A-records pointing to server IP:
   - `api.yourdomain.com` -> API Gateway
   - `shop.yourdomain.com` -> Nuxt Storefront
   - `admin.yourdomain.com` -> Admin Dashboard

---

## 🛠️ Step-by-Step Production Deployment

### Step 1: Clone Repository & Configure `.env`
```bash
git clone https://github.com/your-org/fashion-store.git /var/www/fashion-store
cd /var/www/fashion-store

cp .env.example .env
nano .env
```

Ensure production values are set in `.env`:
```env
POSTGRES_USER=fashion_prod_user
POSTGRES_PASSWORD=SecureProductionPassword123!
POSTGRES_DB=fashion_prod_db
JWT_SECRET=ComplexRandomSecretKeyForJWTAuth2026!
STORE_WHATSAPP_NUMBER=6281234567890
STOREFRONT_URL=https://shop.yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

---

### Step 2: Launch Database Containers & Run Prisma Migrations
```bash
# Start PostgreSQL & Redis services in background
docker-compose -f docker-compose.prod.yml up -d postgres redis

# Install dependencies locally to push database migrations & seed
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
```

---

### Step 3: Build & Launch Production Application Containers
```bash
# Build and run API, Storefront, and Admin containers
docker-compose -f docker-compose.prod.yml up -d --build
```

Verify service health:
```bash
docker-compose -f docker-compose.prod.yml ps
```

All 5 services (`fashion_postgres_prod`, `fashion_redis_prod`, `fashion_api_prod`, `fashion_storefront_prod`, `fashion_admin_prod`) should show status `Up (healthy)`.

---

### Step 4: Go-Live Verification Checklist

- [ ] Visit `https://shop.yourdomain.com` and test product browsing, filter sidebar, cart drawer, and WhatsApp checkout redirection.
- [ ] Complete a test checkout and verify that the generated WhatsApp message contains:
  - Sequential Order Reference Number (`ORD-YYYYMMDD-XXXX`)
  - Line items summary & subtotal
  - Customer contact name and shipping address
- [ ] Sign in to `https://admin.yourdomain.com` with initial credentials (`admin@fashionstore.com` / `AdminPass123!`).
- [ ] Verify that the test order appears in the **Orders Pipeline** under `Pending WA`.
- [ ] Change the admin password and store desk number under **Store Settings**.

---

## 🔒 Database Backup & Recovery Procedure

### Backup Database
```bash
docker exec -t fashion_postgres_prod pg_dump -U fashion_prod_user fashion_prod_db > /backups/fashion_db_$(date +%F).sql
```

### Restore Database
```bash
cat /backups/fashion_db_2026-07-30.sql | docker exec -i fashion_postgres_prod psql -U fashion_prod_user -d fashion_prod_db
```
