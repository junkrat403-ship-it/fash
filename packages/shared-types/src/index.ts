// Enums matching DB DDL
export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum OrderStatus {
  PENDING_WHATSAPP = 'pending_whatsapp',
  CONTACTED = 'contacted',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount'
}

export enum ContactMessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  REPLIED = 'replied'
}

export enum BannerPlacement {
  HERO = 'hero',
  PROMO_STRIP = 'promo_strip',
  CATEGORY_PAGE = 'category_page'
}

// User Roles
export enum UserRole {
  OWNER = 'Owner',
  MANAGER = 'Manager',
  STAFF = 'Staff',
  SUPPORT = 'Support'
}

// Permission Codes
export type PermissionCode =
  | 'products.read'
  | 'products.write'
  | 'categories.read'
  | 'categories.write'
  | 'orders.read'
  | 'orders.write'
  | 'discounts.read'
  | 'discounts.write'
  | 'banners.read'
  | 'banners.write'
  | 'messages.read'
  | 'messages.write'
  | 'settings.read'
  | 'settings.write'
  | 'users.read'
  | 'users.write'
  | 'activity_logs.read'
  | 'analytics.read';

// DTO Interfaces
export interface AdminUserPayload {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
    permissions: string[];
  };
}

export interface CustomerUserPayload {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  isGuest: boolean;
}

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'admin' | 'customer';
  role?: string;
  permissions?: string[];
}

export interface CheckoutRequest {
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
  notes?: string;
  cartId?: string;
}

export interface CheckoutResponse {
  orderNumber: string;
  total: number;
  whatsappRedirectUrl: string;
  whatsappMessagePreview: string;
}
