<template>
  <!-- Single, Consistent Wider Floating Navbar with Rich Elevation Shadow & Rounded Corners Site-Wide -->
  <header 
    :class="[
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0 pointer-events-none'
    ]"
    class="fixed top-2.5 sm:top-3.5 inset-x-2.5 sm:inset-x-6 z-50 w-[calc(100%-1.25rem)] sm:w-[calc(100%-3rem)] max-w-[1600px] mx-auto transition-all duration-300 transform"
  >
    <div class="bg-[#F6FAFD]/95 text-[#0A1931] rounded-2xl shadow-md shadow-[#0A1931]/15 border border-[#B3CFE5]/40 px-4 sm:px-8 py-1 sm:py-1.5 backdrop-blur-md w-full">
      <div class="flex items-center justify-between h-9 sm:h-10">
        
        <!-- Mobile Menu Toggle Button -->
        <div class="flex items-center lg:hidden">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-1.5 rounded-xl text-[#0A1931] hover:bg-[#B3CFE5]/30 transition cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Brand Logo (Far Left) -->
        <div class="flex items-center shrink-0">
          <NuxtLink to="/" class="inline-block group cursor-pointer p-1 rounded-xl hover:bg-[#B3CFE5]/20 transition">
            <span class="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#0A1931] group-hover:text-[#4A7FA7] transition leading-none">AURA</span>
            <span class="block text-[7px] uppercase tracking-[0.25em] text-[#4A7FA7] font-sans font-medium -mt-0.5">Studio</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation Links (Padded Bounding Boxes for Generous Click/Hover Hit Area) -->
        <nav class="hidden lg:flex items-center space-x-1 sm:space-x-2 font-sans">
          <NuxtLink 
            to="/" 
            active-class="font-bold text-[#0A1931] bg-[#B3CFE5]/40" 
            class="px-3.5 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-[#1A3D63] hover:text-[#0A1931] hover:bg-[#B3CFE5]/30 transition-all duration-150 cursor-pointer inline-flex items-center"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            active-class="font-bold text-[#0A1931] bg-[#B3CFE5]/40" 
            class="px-3.5 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-[#1A3D63] hover:text-[#0A1931] hover:bg-[#B3CFE5]/30 transition-all duration-150 cursor-pointer inline-flex items-center"
          >
            Catalog
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            active-class="font-bold text-[#0A1931] bg-[#B3CFE5]/40" 
            class="px-3.5 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-[#1A3D63] hover:text-[#0A1931] hover:bg-[#B3CFE5]/30 transition-all duration-150 cursor-pointer inline-flex items-center"
          >
            About Story
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            active-class="font-bold text-[#0A1931] bg-[#B3CFE5]/40" 
            class="px-3.5 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-[#1A3D63] hover:text-[#0A1931] hover:bg-[#B3CFE5]/30 transition-all duration-150 cursor-pointer inline-flex items-center"
          >
            Contact
          </NuxtLink>
        </nav>

        <!-- Right Action Icons (Far Right: Search & Cart) -->
        <div ref="searchContainerRef" class="flex items-center space-x-2">
          
          <!-- Search Icon Button (Slides left smoothly as search box expands) -->
          <button 
            @click="toggleSearch"
            :class="[
              searchOpen ? 'bg-[#0A1931] text-white shadow-sm' : 'text-[#1A3D63] hover:text-[#0A1931] hover:bg-[#B3CFE5]/30'
            ]"
            class="p-1.5 rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center shrink-0" 
            title="Search catalog"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          <!-- Animated Expanding Search Input Box -->
          <div 
            :class="[
              searchOpen 
                ? 'w-40 sm:w-56 opacity-100 pl-3 pr-7 border-[#B3CFE5]/50 bg-white/90' 
                : 'w-0 opacity-0 p-0 border-transparent bg-transparent pointer-events-none'
            ]"
            class="relative flex items-center transition-all duration-300 ease-out overflow-hidden rounded-xl border shrink-0"
          >
            <input 
              ref="searchInputRef"
              v-model="searchQuery" 
              @keydown.enter="submitSearch"
              @keydown.escape="closeSearch"
              type="text" 
              placeholder="Search catalog..." 
              class="w-full bg-transparent text-[11px] text-[#0A1931] focus:outline-none placeholder-slate-400 py-1 font-medium"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''; searchInputRef?.focus()" 
              class="absolute right-2 text-slate-400 hover:text-[#0A1931] text-xs font-bold cursor-pointer"
            >
              ×
            </button>
          </div>

          <!-- Shopping Cart Drawer Button -->
          <button 
            @click="cartStore.toggleDrawer()"
            class="relative p-1.5 rounded-xl text-[#1A3D63] hover:text-[#0A1931] hover:bg-[#B3CFE5]/30 transition flex items-center cursor-pointer shrink-0"
            title="Shopping Cart"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span 
              v-if="cartStore.totalItems > 0"
              class="absolute -top-0.5 -right-0.5 bg-[#0A1931] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
            >
              {{ cartStore.totalItems }}
            </span>
          </button>

        </div>

      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div v-if="mobileMenuOpen" class="lg:hidden mt-2 bg-[#F6FAFD] rounded-2xl p-4 shadow-2xl border border-[#B3CFE5]/40 space-y-2">
      <NuxtLink to="/" @click="mobileMenuOpen = false" class="block px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0A1931] hover:bg-[#B3CFE5]/30">Home</NuxtLink>
      <NuxtLink to="/products" @click="mobileMenuOpen = false" class="block px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0A1931] hover:bg-[#B3CFE5]/30">Catalog</NuxtLink>
      <NuxtLink to="/about" @click="mobileMenuOpen = false" class="block px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0A1931] hover:bg-[#B3CFE5]/30">About Story</NuxtLink>
      <NuxtLink to="/contact" @click="mobileMenuOpen = false" class="block px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0A1931] hover:bg-[#B3CFE5]/30">Contact</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const router = useRouter();
const mobileMenuOpen = ref(false);
const isVisible = ref(true);
const cartStore = useCartStore();

// Animated Inline Search State
const searchOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchContainerRef = ref<HTMLElement | null>(null);

watch(mobileMenuOpen, (open) => {
  if (import.meta.client) {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }
});

const toggleSearch = () => {
  if (searchOpen.value) {
    if (searchQuery.value.trim()) {
      submitSearch();
    } else {
      closeSearch();
    }
  } else {
    searchOpen.value = true;
    setTimeout(() => {
      searchInputRef.value?.focus();
    }, 100);
  }
};

const submitSearch = () => {
  if (!searchQuery.value.trim()) return;
  router.push({ path: '/products', query: { q: searchQuery.value.trim() } });
  closeSearch();
};

const closeSearch = () => {
  searchOpen.value = false;
  searchQuery.value = '';
};

const handleClickOutside = (e: MouseEvent) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(e.target as Node)) {
    closeSearch();
  }
};

let lastScrollY = 0;
let scrollTimeout: any = null;

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY < 20) {
    isVisible.value = true;
    lastScrollY = currentScrollY;
    return;
  }

  if (currentScrollY > lastScrollY && currentScrollY > 60) {
    isVisible.value = false;
    closeSearch();
  } else if (currentScrollY < lastScrollY) {
    isVisible.value = true;
  }

  lastScrollY = currentScrollY;

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isVisible.value = true;
  }, 350);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
  if (scrollTimeout) clearTimeout(scrollTimeout);
  if (import.meta.client) {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
});
</script>
