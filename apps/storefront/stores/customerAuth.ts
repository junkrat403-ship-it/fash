import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCartStore } from './cart';

export interface CustomerUser {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  isGuest?: boolean;
  totalOrders?: number;
}

export const useCustomerAuthStore = defineStore('customerAuth', () => {
  const token = ref<string | null>(null);
  const user = ref<CustomerUser | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userInitials = computed(() => {
    if (!user.value?.name) return 'U';
    return user.value.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  const initAuth = async () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('jl_customer_token');
      if (storedToken) {
        token.value = storedToken;
        await fetchProfile();
      }
    }
  };

  const fetchProfile = async () => {
    if (!token.value) return;
    const { fetchApi } = useApi();
    try {
      isLoading.value = true;
      error.value = null;
      const data = await fetchApi<CustomerUser>('/customer/profile');
      user.value = data;
    } catch (e: any) {
      token.value = null;
      user.value = null;
      if (import.meta.client) {
        localStorage.removeItem('jl_customer_token');
      }
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    const { fetchApi } = useApi();
    const cartStore = useCartStore();
    try {
      isLoading.value = true;
      error.value = null;
      const data = await fetchApi<{ accessToken: string; user: CustomerUser }>('/auth/customer/login', {
        method: 'POST',
        body: { email, password },
      });

      token.value = data.accessToken;
      user.value = data.user;
      if (import.meta.client) {
        localStorage.setItem('jl_customer_token', data.accessToken);
      }

      await cartStore.mergeWithCustomer();
      return true;
    } catch (e: any) {
      error.value = e?.data?.message || e.message || 'Invalid email or password';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const { fetchApi } = useApi();
    const cartStore = useCartStore();
    try {
      isLoading.value = true;
      error.value = null;
      const data = await fetchApi<{ accessToken: string; user: CustomerUser }>('/auth/customer/register', {
        method: 'POST',
        body: { name, email, phone, password },
      });

      token.value = data.accessToken;
      user.value = data.user;
      if (import.meta.client) {
        localStorage.setItem('jl_customer_token', data.accessToken);
      }

      await cartStore.mergeWithCustomer();
      return true;
    } catch (e: any) {
      error.value = e?.data?.message || e.message || 'Registration failed';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    token.value = null;
    user.value = null;
    const cartStore = useCartStore();
    cartStore.cart = null;

    if (import.meta.client) {
      localStorage.removeItem('jl_customer_token');
      const newGuestToken = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('guest_cart_token', newGuestToken);
      cartStore.guestToken = newGuestToken;
    }

    await cartStore.fetchCart();
    await navigateTo('/');
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    userInitials,
    initAuth,
    fetchProfile,
    login,
    register,
    logout,
  };
});
