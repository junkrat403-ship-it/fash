<template>
  <div class="min-h-screen bg-[#0A1931] flex items-center justify-center p-4 sm:p-6">
    <div class="bg-[#F6FAFD] rounded-3xl p-8 sm:p-10 shadow-2xl max-w-md w-full border border-[#B3CFE5]/50 relative overflow-hidden">

      <div class="text-center mb-8">
        <div class="inline-block px-3 py-1 rounded-full bg-[#28537A]/10 text-[#28537A] text-[11px] font-bold tracking-widest uppercase mb-3">
          Administration Console
        </div>
        <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-[#0A1931] tracking-[0.2em] uppercase">
          AURA
        </h1>
        <p class="text-xs text-[#1A3D63] mt-2 font-light">
          Sign in to manage catalog, inventory, and WhatsApp orders
        </p>
      </div>

      <div v-if="error" class="mb-6 p-4 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200 shadow-xs flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-[#1A3D63] uppercase tracking-wider mb-2">
            Email Address *
          </label>
          <input 
            v-model="email" 
            type="email" 
            required 
            placeholder="admin@fashionstore.com"
            class="w-full px-4 py-3 rounded-2xl border border-[#B3CFE5]/60 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931] shadow-xs"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#1A3D63] uppercase tracking-wider mb-2">
            Password *
          </label>
          <input 
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-2xl border border-[#B3CFE5]/60 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931] shadow-xs"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-3.5 rounded-2xl btn-primary-flat font-bold text-white text-xs sm:text-sm disabled:opacity-50 transition cursor-pointer mt-2"
        >
          {{ loading ? 'Signing in...' : 'Sign In to Dashboard' }}
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-[#B3CFE5]/40 text-center text-xs text-[#1A3D63]">
        <span class="font-light">Default Seed Account:</span><br>
        <code class="bg-[#B3CFE5]/30 text-[#0A1931] px-3 py-1 rounded-xl font-mono text-[11px] mt-2 inline-block font-semibold">
          admin@fashionstore.com / AdminPass123!
        </code>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('admin@fashionstore.com');
const password = ref('AdminPass123!');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (e: any) {
    error.value = e.message || 'Login failed. Please verify credentials.';
  } finally {
    loading.value = false;
  }
};
</script>
