<template>
  <div class="fixed bottom-6 right-4 sm:right-8 z-[100] flex flex-col space-y-3 max-w-sm w-full pointer-events-none px-2 sm:px-0">
    <TransitionGroup 
      name="toast" 
      tag="div" 
      class="flex flex-col space-y-3 items-end w-full"
    >
      <div 
        v-for="t in toasts" 
        :key="t.id"
        class="pointer-events-auto bg-[#0A1931] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-[#4A7FA7]/40 flex items-center space-x-3.5 w-full transform transition-all duration-300 backdrop-blur-md"
      >
        <!-- Product Thumbnail Image if present -->
        <div v-if="t.imageUrl" class="w-12 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
          <img :src="t.imageUrl" :alt="t.title" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- Toast Text Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-300 leading-none">
              {{ t.title }}
            </h4>
          </div>
          <p v-if="t.message" class="text-xs text-slate-200 mt-1 font-medium line-clamp-1">
            {{ t.message }}
          </p>
          <button 
            @click="openCart" 
            class="text-[11px] font-semibold text-[#B3CFE5] hover:text-white underline mt-1 block cursor-pointer transition"
          >
            View Cart & Checkout →
          </button>
        </div>

        <!-- Close button -->
        <button 
          @click="removeToast(t.id)" 
          class="text-slate-400 hover:text-white p-1 transition cursor-pointer shrink-0 text-sm font-bold"
          title="Dismiss"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';
import { useCartStore } from '~/stores/cart';

const { toasts, removeToast } = useToast();
const cartStore = useCartStore();

const openCart = () => {
  cartStore.toggleDrawer();
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(1rem) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem) scale(0.9);
}
</style>
