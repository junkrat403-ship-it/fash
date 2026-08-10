<template>
  <div class="min-h-screen bg-[#F4ECE5] text-[#1A170F] font-sans flex flex-col justify-between selection:bg-[#1A170F] selection:text-[#F4ECE5] relative">
    <AppHeader />
    
    <div class="flex-1 flex flex-col w-full">
      <NuxtPage />
    </div>

    <AppFooter />
    <CartDrawer />
    <ToastNotification />
    <FloatingScrollbar />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
import CartDrawer from '~/components/CartDrawer.vue';
import ToastNotification from '~/components/ToastNotification.vue';
import FloatingScrollbar from '~/components/FloatingScrollbar.vue';

const cartStore = useCartStore();

onMounted(() => {
  cartStore.initCart();
});
</script>
