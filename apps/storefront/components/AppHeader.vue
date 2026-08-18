<template>
  
  <header 
    :class="[
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
    ]"
    class="fixed top-0 left-0 right-0 z-50 bg-[#F4ECE5] text-[#1A170F] border-b border-[#E4D8CC]/70 transition-all duration-300 transform shadow-xs"
  >
    
    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between relative">

      <!-- Left: Mobile Toggle & Brand Logo -->
      <div class="flex items-center gap-3 sm:gap-4 shrink-0">
        
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#1A170F] hover:bg-[#E4D8CC]/40 transition cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <NuxtLink to="/" class="inline-flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none">
          <div class="h-8 sm:h-9 px-2.5 rounded-lg bg-[#1A170F] text-[#F4ECE5] flex items-center justify-center font-serif font-black text-xs sm:text-sm tracking-wider shadow-xs">
            J&L
          </div>
          <div class="flex flex-col justify-center">
            <span class="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#1A170F] leading-none block">Jubi & Lee</span>
            <span class="block text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-[#8C8275] font-sans font-bold mt-0.5">Studio</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Center: Navigation Links -->
      <nav class="hidden lg:flex items-center space-x-8 xl:space-x-10 h-full font-sans">
        <NuxtLink 
          v-for="item in navLinks" 
          :key="item.path"
          :to="item.path" 
          :class="[
            isNavActive(item.path) 
              ? 'font-bold text-[#E04F26] after:scale-x-100' 
              : 'font-semibold text-[#1A170F]/80 hover:text-[#E04F26] after:scale-x-0'
          ]"
          class="text-sm uppercase tracking-[0.14em] transition-colors cursor-pointer relative py-2 flex items-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#E04F26] after:transition-transform after:duration-200"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- Right: Search, Account & Cart Controls -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0 relative" ref="searchContainerRef">
        
        <!-- Desktop Search Form (Inline Expanding) -->
        <div class="hidden sm:flex items-center">
          <div 
            :class="[
              isSearchOpen 
                ? 'w-64 md:w-72 lg:w-80 opacity-100 px-3.5 py-1.5 border-2 border-[#E04F26] bg-[#E4D8CC]/60' 
                : 'w-10 opacity-100 p-0 border-transparent bg-transparent'
            ]"
            class="h-10 rounded-full flex items-center transition-all duration-300 ease-out overflow-hidden shadow-xs"
          >
            <button 
              @click="toggleSearch"
              class="w-10 h-10 flex items-center justify-center bg-[#E4D8CC]/60 text-[#1A170F] hover:text-[#E04F26] shrink-0 cursor-pointer transition-colors"
              title="Search Catalog"
              aria-label="Search Catalog"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <form 
              v-if="isSearchOpen" 
              @submit.prevent="submitSearch" 
              class="flex-1 flex items-center min-w-0 pl-1 pr-1 gap-2"
            >
              <input 
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Search collection..."
                class="w-full bg-transparent text-xs sm:text-sm text-[#1A170F] placeholder-[#1A170F]/45 focus:outline-none"
                @keydown.esc="closeSearch"
              />
              <button 
                v-if="searchQuery"
                type="button" 
                @click="searchQuery = ''; searchInputRef?.focus()"
                class="text-[#1A170F]/50 hover:text-[#1A170F] text-xs font-bold p-0.5 cursor-pointer shrink-0"
              >
                ✕
              </button>
              <button 
                type="button" 
                @click="closeSearch"
                class="text-[11px] font-bold text-[#1A170F]/60 hover:text-[#E04F26] cursor-pointer shrink-0 pl-1 border-l border-[#E4D8CC]"
              >
                ESC
              </button>
            </form>
          </div>
        </div>

        <!-- Mobile Search Button -->
        <button 
          @click="openMobileSearch"
          class="sm:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#1A170F] hover:bg-[#E4D8CC]/50 transition cursor-pointer"
          title="Search Catalog"
          aria-label="Search Catalog"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        <!-- Account Button / Dropdown -->
        <div class="relative" ref="accountMenuRef">
          <!-- Logged In State: Avatar Initial Pill -->
          <button
            v-if="authStore.isAuthenticated"
            @click="isAccountMenuOpen = !isAccountMenuOpen"
            class="w-10 h-10 rounded-full bg-[#1A170F] text-[#FAF6F1] hover:bg-[#E04F26] flex items-center justify-center font-serif font-black text-xs transition-all duration-200 cursor-pointer shadow-xs select-none"
            title="My Account"
            aria-label="My Account"
          >
            {{ authStore.userInitials }}
          </button>

          <!-- Logged Out State: User Icon -->
          <NuxtLink
            v-else
            to="/login"
            class="w-10 h-10 rounded-full bg-[#E4D8CC]/60 hover:bg-[#E4D8CC] hover:text-[#E04F26] text-[#1A170F] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs"
            title="Sign In / Register"
            aria-label="Sign In / Register"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </NuxtLink>

          <!-- Account Dropdown Popover -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-1"
          >
            <div
              v-if="isAccountMenuOpen && authStore.isAuthenticated"
              class="absolute right-0 mt-2 w-56 bg-[#FAF6F1] border border-[#E4D8CC] rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
            >
              <div class="px-4 py-3 border-b border-[#E4D8CC]/70">
                <p class="font-bold text-xs text-[#1A170F] truncate">{{ authStore.user?.name }}</p>
                <p class="text-[11px] text-[#8C8275] truncate mt-0.5">{{ authStore.user?.email || authStore.user?.phone }}</p>
              </div>

              <div class="py-1">
                <NuxtLink
                  to="/account/orders"
                  @click="isAccountMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A170F] hover:bg-[#E4D8CC]/40 transition"
                >
                  <svg class="w-4 h-4 text-[#8C8275]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  My Orders
                </NuxtLink>

                <NuxtLink
                  to="/account/addresses"
                  @click="isAccountMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A170F] hover:bg-[#E4D8CC]/40 transition"
                >
                  <svg class="w-4 h-4 text-[#8C8275]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Saved Addresses
                </NuxtLink>
              </div>

              <div class="pt-1 border-t border-[#E4D8CC]/70">
                <button
                  type="button"
                  @click="handleLogout"
                  class="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#E04F26] hover:bg-[#FBEAE5] transition cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Cart Button (Icon only with badge) -->
        <button 
          @click="cartStore.toggleDrawer()"
          class="w-10 h-10 rounded-full bg-[#E4D8CC]/60 hover:bg-[#E4D8CC] hover:text-[#E04F26] text-[#1A170F] flex items-center justify-center relative transition-all duration-200 cursor-pointer shrink-0 shadow-2xs"
          title="Shopping Cart"
          aria-label="Shopping Cart"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100 1.5.75.75 0 000-1.5zm7.5 0a.75.75 0 100 1.5.75.75 0 000-1.5z" />
          </svg>
          <span 
            v-if="cartStore.totalItems > 0" 
            class="absolute -top-1 -right-1 bg-[#E04F26] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-[#F4ECE5]"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>
      </div>

      <!-- Mobile Full-Width Search Overlay Bar -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div 
          v-if="isMobileSearchOpen" 
          class="sm:hidden absolute inset-0 bg-[#F4ECE5] px-4 flex items-center gap-3 z-30 shadow-md"
        >
          <form @submit.prevent="submitSearch" class="flex-1 flex items-center gap-2 bg-[#FAF6F1] border-2 border-[#1A170F] rounded-full px-3.5 py-1.5 shadow-xs">
            <svg class="w-4.5 h-4.5 text-[#E04F26] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input 
              ref="mobileSearchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Search catalog..."
              class="w-full bg-transparent text-xs font-medium text-[#1A170F] placeholder-[#1A170F]/50 focus:outline-none"
            />
            <button 
              v-if="searchQuery"
              type="button" 
              @click="searchQuery = ''; mobileSearchInputRef?.focus()"
              class="text-[#1A170F]/50 font-bold p-0.5"
            >
              ✕
            </button>
          </form>
          <button 
            type="button" 
            @click="closeMobileSearch"
            class="text-xs font-extrabold text-[#1A170F] hover:text-[#E04F26] px-1 py-2 cursor-pointer uppercase tracking-wider shrink-0"
          >
            Cancel
          </button>
        </div>
      </Transition>

    </div>

    <!-- Mobile Drawer Menu -->
    <div 
      v-if="mobileMenuOpen"
      class="lg:hidden bg-[#FAF6F1] border-b border-[#E4D8CC] px-6 py-6 transition-all duration-300 shadow-md"
    >
      <div class="space-y-3 font-sans pb-4 border-b border-[#E4D8CC]">
        <NuxtLink 
          v-for="item in navLinks" 
          :key="item.path"
          :to="item.path"
          @click="mobileMenuOpen = false"
          :class="[
            isNavActive(item.path) 
              ? 'font-extrabold text-[#E04F26]' 
              : 'font-semibold text-[#1A170F]/80 hover:text-[#E04F26]'
          ]"
          class="block py-2 text-base uppercase tracking-wider transition-colors"
        >
          {{ item.name }}
        </NuxtLink>
      </div>

      <!-- Mobile Account Section -->
      <div class="pt-4">
        <template v-if="authStore.isAuthenticated">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-[#1A170F] text-[#FAF6F1] flex items-center justify-center font-serif font-black text-xs">
              {{ authStore.userInitials }}
            </div>
            <div>
              <p class="font-bold text-xs text-[#1A170F]">{{ authStore.user?.name }}</p>
              <p class="text-[10px] text-[#8C8275]">{{ authStore.user?.email || authStore.user?.phone }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <NuxtLink
              to="/account/orders"
              @click="mobileMenuOpen = false"
              class="block py-1.5 text-xs font-bold uppercase tracking-wider text-[#1A170F] hover:text-[#E04F26]"
            >
              📦 My Orders
            </NuxtLink>
            <NuxtLink
              to="/account/addresses"
              @click="mobileMenuOpen = false"
              class="block py-1.5 text-xs font-bold uppercase tracking-wider text-[#1A170F] hover:text-[#E04F26]"
            >
              📍 Saved Addresses
            </NuxtLink>
            <button
              @click="handleLogout"
              class="block py-1.5 text-xs font-bold uppercase tracking-wider text-[#E04F26]"
            >
              🚪 Sign Out
            </button>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center gap-3 pt-1">
            <NuxtLink
              to="/login"
              @click="mobileMenuOpen = false"
              class="flex-1 h-10 rounded-xl bg-[#1A170F] text-[#FAF6F1] font-bold text-xs uppercase tracking-wider flex items-center justify-center"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/register"
              @click="mobileMenuOpen = false"
              class="flex-1 h-10 rounded-xl border border-[#E4D8CC] bg-white text-[#1A170F] font-bold text-xs uppercase tracking-wider flex items-center justify-center"
            >
              Register
            </NuxtLink>
          </div>
        </template>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import { useCustomerAuthStore } from '~/stores/customerAuth';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useCustomerAuthStore();

const isVisible = ref(true);
const mobileMenuOpen = ref(false);
const isSearchOpen = ref(false);
const isMobileSearchOpen = ref(false);
const isAccountMenuOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);
const mobileSearchInputRef = ref<HTMLInputElement | null>(null);
const searchContainerRef = ref<HTMLElement | null>(null);
const accountMenuRef = ref<HTMLElement | null>(null);

let lastScrollPosition = 0;

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'CATALOG', path: '/products' },
  { name: 'ABOUT', path: '/about' },
  { name: 'CONTACT', path: '/contact' },
];

const isNavActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const toggleSearch = () => {
  if (isSearchOpen.value) {
    if (searchQuery.value.trim()) {
      submitSearch();
    } else {
      closeSearch();
    }
  } else {
    isSearchOpen.value = true;
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
};

const closeSearch = () => {
  isSearchOpen.value = false;
};

const openMobileSearch = () => {
  isMobileSearchOpen.value = true;
  nextTick(() => {
    mobileSearchInputRef.value?.focus();
  });
};

const closeMobileSearch = () => {
  isMobileSearchOpen.value = false;
};

const submitSearch = () => {
  const query = searchQuery.value.trim();
  if (query) {
    router.push({ path: '/products', query: { q: query } });
  } else {
    router.push('/products');
  }
  closeSearch();
  closeMobileSearch();
};

const handleLogout = async () => {
  isAccountMenuOpen.value = false;
  mobileMenuOpen.value = false;
  await authStore.logout();
};

const handleClickOutside = (e: MouseEvent) => {
  if (isSearchOpen.value && searchContainerRef.value && !searchContainerRef.value.contains(e.target as Node)) {
    closeSearch();
  }
  if (isAccountMenuOpen.value && accountMenuRef.value && !accountMenuRef.value.contains(e.target as Node)) {
    isAccountMenuOpen.value = false;
  }
};

const onScroll = () => {
  if (typeof window === 'undefined') return;
  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
  
  if (currentScrollPosition < 50) {
    isVisible.value = true;
    return;
  }
  
  if (currentScrollPosition > lastScrollPosition + 10) {
    isVisible.value = false;
    mobileMenuOpen.value = false;
    isMobileSearchOpen.value = false;
    isAccountMenuOpen.value = false;
  } else if (currentScrollPosition < lastScrollPosition - 10) {
    isVisible.value = true;
  }
  
  lastScrollPosition = currentScrollPosition;
};

onMounted(() => {
  cartStore.initCart();
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('click', handleClickOutside);
  }
});
</script>
