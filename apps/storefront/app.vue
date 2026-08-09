<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-slate-900 selection:text-white relative">
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
