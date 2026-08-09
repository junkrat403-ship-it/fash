import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import ProductsView from '../views/ProductsView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import InventoryView from '../views/InventoryView.vue';
import OrdersView from '../views/OrdersView.vue';
import CustomersView from '../views/CustomersView.vue';
import BannersView from '../views/BannersView.vue';
import DiscountsView from '../views/DiscountsView.vue';
import MessagesView from '../views/MessagesView.vue';
import SettingsView from '../views/SettingsView.vue';
import UsersView from '../views/UsersView.vue';
import ActivityLogsView from '../views/ActivityLogsView.vue';
import AnalyticsView from '../views/AnalyticsView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
      meta: { requiresAuth: true, permission: 'products.read' },
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView,
      meta: { requiresAuth: true, permission: 'categories.read' },
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryView,
      meta: { requiresAuth: true, permission: 'products.read' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true, permission: 'orders.read' },
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersView,
      meta: { requiresAuth: true, permission: 'orders.read' },
    },
    {
      path: '/content/banners',
      name: 'banners',
      component: BannersView,
      meta: { requiresAuth: true, permission: 'banners.read' },
    },
    {
      path: '/marketing/discounts',
      name: 'discounts',
      component: DiscountsView,
      meta: { requiresAuth: true, permission: 'discounts.read' },
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagesView,
      meta: { requiresAuth: true, permission: 'messages.read' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true, permission: 'settings.read' },
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true, permission: 'users.read' },
    },
    {
      path: '/activity-logs',
      name: 'activity-logs',
      component: ActivityLogsView,
      meta: { requiresAuth: true, permission: 'activity_logs.read' },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: AnalyticsView,
      meta: { requiresAuth: true, permission: 'analytics.read' },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' });
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
    return next({ name: 'dashboard' });
  }

  next();
});

export default router;
