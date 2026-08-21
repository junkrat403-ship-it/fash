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

  const checkTokenExpiry = (storedToken: string): boolean => {
    try {
      const expStr = localStorage.getItem('jl_customer_token_exp');
      if (expStr && Date.now() >= Number(expStr)) {
        return true;
      }
      const parts = storedToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          return true;
        }
      }
      return false;
    } catch {
      return true;
    }
  };

  const clearAuthSession = () => {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('jl_customer_token');
      localStorage.removeItem('jl_customer_token_exp');
    }
  };

  const initAuth = async () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('jl_customer_token');
      if (storedToken) {
        if (checkTokenExpiry(storedToken)) {
          clearAuthSession();
          return;
        }
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
      clearAuthSession();
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const { fetchApi } = useApi();
    const cartStore = useCartStore();
    try {
      isLoading.value = true;
      error.value = null;
      const data = await fetchApi<{ accessToken: string; expiresIn?: number; user: CustomerUser }>('/auth/customer/login', {
        method: 'POST',
        body: { email, password, rememberMe },
      });

      token.value = data.accessToken;
      user.value = data.user;

      if (import.meta.client) {
        const expiresInSec = data.expiresIn || (rememberMe ? 3 * 24 * 60 * 60 : 60 * 60);
        const expiresAtMs = Date.now() + expiresInSec * 1000;
        localStorage.setItem('jl_customer_token', data.accessToken);
        localStorage.setItem('jl_customer_token_exp', String(expiresAtMs));
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
      const data = await fetchApi<{ accessToken: string; expiresIn?: number; user: CustomerUser }>('/auth/customer/register', {
        method: 'POST',
        body: { name, email, phone, password },
      });

      token.value = data.accessToken;
      user.value = data.user;

      if (import.meta.client) {
        const expiresAtMs = Date.now() + 3 * 24 * 60 * 60 * 1000;
        localStorage.setItem('jl_customer_token', data.accessToken);
        localStorage.setItem('jl_customer_token_exp', String(expiresAtMs));
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
    clearAuthSession();
    const cartStore = useCartStore();
    cartStore.cart = null;

    if (import.meta.client) {
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
