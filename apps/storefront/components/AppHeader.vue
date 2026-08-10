<template>
  <!-- Full-Width Seamless Navbar -->
  <header 
    :class="[
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
    ]"
    class="fixed top-0 left-0 right-0 z-50 bg-[#F4ECE5] text-[#1A170F] border-b border-[#E4D8CC]/60 transition-all duration-300 transform shadow-xs"
  >
    <!-- Main Navigation Bar -->
    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
      
      <!-- Left Section: Mobile Toggle & Brand Logo -->
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Toggle Button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-1.5 rounded-lg text-[#1A170F] hover:bg-[#E4D8CC]/40 transition cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Brand Logo -->
        <NuxtLink to="/" class="inline-flex items-center gap-2 group cursor-pointer">
          <div class="px-2 py-1 rounded-lg bg-[#1A170F] text-[#F4ECE5] flex items-center justify-center font-serif font-black text-xs tracking-wider">
            J&L
          </div>
          <div>
            <span class="font-serif text-xl font-black tracking-tight text-[#1A170F] leading-none block">Jubi & Lee</span>
            <span class="block text-[8px] uppercase tracking-[0.25em] text-[#8C8275] font-sans font-bold">Studio</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Center Desktop Navigation Links (HOME, CATALOG, ABOUT, CONTACT) -->
      <nav class="hidden lg:flex items-center space-x-8 font-sans">
        <NuxtLink 
          v-for="item in navLinks" 
          :key="item.path"
          :to="item.path" 
          :class="[
            isNavActive(item.path) 
              ? 'font-bold text-[#E04F26] border-b-2 border-[#E04F26] pb-0.5' 
              : 'font-semibold text-[#1A170F]/80 hover:text-[#E04F26] pb-0.5'
          ]"
          class="text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- Right Action Icons & Cart Drawer Trigger -->
      <div class="flex items-center space-x-3">
        <button 
          @click="navigateTo('/products')"
          class="p-2 rounded-xl text-[#1A170F] hover:bg-[#E4D8CC]/50 transition cursor-pointer" 
          title="Search Catalog"
          aria-label="Search Catalog"
        >
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        <button 
          @click="cartStore.toggleDrawer()"
          class="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E4D8CC]/60 hover:bg-[#E4D8CC] text-[#1A170F] transition cursor-pointer text-xs font-bold"
          title="Shopping Cart"
          aria-label="Shopping Cart"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100 1.5.75.75 0 000-1.5zm7.5 0a.75.75 0 100 1.5.75.75 0 000-1.5z" />
          </svg>
          <span class="hidden sm:inline">Cart</span>
          <span 
            v-if="cartStore.totalItems > 0" 
            class="bg-[#E04F26] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>
      </div>

    </div>

    <!-- Mobile Drawer Menu Overlay -->
    <div 
      v-if="mobileMenuOpen" 
      class="lg:hidden fixed inset-0 top-16 bg-slate-950/60 backdrop-blur-xs z-40"
      @click="mobileMenuOpen = false"
    >
      <div 
        class="bg-[#F4ECE5] w-full p-6 space-y-4 border-b border-[#E4D8CC] shadow-xl text-[#1A170F]"
        @click.stop
      >
        <div class="flex justify-between items-center pb-3 border-b border-[#E4D8CC]">
          <span class="font-serif font-bold text-lg">Navigation</span>
          <button @click="mobileMenuOpen = false" class="text-xs text-[#1A170F]/60 hover:text-[#1A170F] font-bold p-1">Close ✕</button>
        </div>
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
          class="block py-2.5 text-sm uppercase tracking-wider transition-colors"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const cartStore = useCartStore();

const isVisible = ref(true);
const mobileMenuOpen = ref(false);
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
  } else if (currentScrollPosition < lastScrollPosition - 10) {
    isVisible.value = true;
  }
  
  lastScrollPosition = currentScrollPosition;
};

onMounted(() => {
  cartStore.initCart();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll);
  }
});
</script>
