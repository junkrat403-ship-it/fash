import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

import { API_BASE_URL } from '../config';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('admin_token') || '');
  const user = ref<AdminUser | null>(
    JSON.parse(localStorage.getItem('admin_user') || 'null'),
  );
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const userPermissions = computed(() => user.value?.permissions || []);

  const hasPermission = (perm: string) => {
    if (!user.value) return false;
    if (user.value.role === 'Owner') return true;
    return userPermissions.value.includes(perm);
  };

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Invalid credentials');
      }

      const data = await res.json();
      token.value = data.accessToken;
      user.value = data.user;

      localStorage.setItem('admin_token', data.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));

      return data;
    } catch (e: any) {
      error.value = e.message || 'Login failed';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    userPermissions,
    hasPermission,
    login,
    logout,
  };
});
