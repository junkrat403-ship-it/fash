<template>
  <main class="w-full flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="w-full max-w-md bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
      
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1A170F] text-[#FAF6F1] mb-4 shadow-sm font-serif font-black text-lg">
          J&L
        </div>
        <h1 class="text-2xl sm:text-3xl font-serif font-black text-[#1A170F] tracking-tight">Create Account</h1>
        <p class="text-xs sm:text-sm text-[#8C8275] mt-1.5 font-medium">Join Jubi & Lee for seamless orders and saved details</p>
      </div>

      <div v-if="error" class="mb-6 p-4 rounded-2xl bg-[#FBEAE5] border border-[#E04F26]/30 text-[#E04F26] text-xs font-semibold flex items-center gap-2.5">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4 sm:space-y-5">
        <div>
          <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5" for="name">
            Full Name
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="e.g. Dinda Pratiwi"
            class="w-full h-11 px-4 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] placeholder-[#1A170F]/30 text-sm focus:outline-none focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] transition-all"
          />
        </div>

        <div>
          <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5" for="email">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full h-11 px-4 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] placeholder-[#1A170F]/30 text-sm focus:outline-none focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] transition-all"
          />
        </div>

        <div>
          <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5" for="phone">
            WhatsApp Phone Number
          </label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            required
            placeholder="e.g. 081234567890"
            class="w-full h-11 px-4 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] placeholder-[#1A170F]/30 text-sm focus:outline-none focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] transition-all"
          />
        </div>

        <div>
          <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5" for="password">
            Password (min. 8 characters)
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="8"
              placeholder="••••••••"
              class="w-full h-11 px-4 pr-11 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] placeholder-[#1A170F]/30 text-sm focus:outline-none focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8275] hover:text-[#1A170F] p-1 cursor-pointer"
              aria-label="Toggle password visibility"
            >
              <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full h-12 mt-2 rounded-xl bg-[#1A170F] text-[#FAF6F1] font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#E04F26] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-[#E4D8CC] text-center">
        <p class="text-xs text-[#8C8275]">
          Already have an account?
          <NuxtLink :to="loginLink" class="font-extrabold text-[#1A170F] hover:text-[#E04F26] ml-1">
            Sign In →
          </NuxtLink>
        </p>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCustomerAuthStore } from '~/stores/customerAuth';

useHead({
  title: 'Create Account — Jubi & Lee',
  meta: [
    { name: 'description', content: 'Create your Jubi & Lee customer account for instant order history and saved delivery preferences.' }
  ]
});

const route = useRoute();
const router = useRouter();
const authStore = useCustomerAuthStore();

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);

const loginLink = computed(() => {
  const redirect = route.query.redirect as string;
  return redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';
});

const handleRegister = async () => {
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long';
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    await authStore.register(name.value, email.value, phone.value, password.value);
    
    const redirectUrl = (route.query.redirect as string) || '/account/orders';
    await router.push(redirectUrl);
  } catch (err: any) {
    error.value = err?.data?.message || err.message || 'Registration failed. Please check your information.';
  } finally {
    isLoading.value = false;
  }
};
</script>
