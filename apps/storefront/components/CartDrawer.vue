<template>
  <div v-if="cartStore.isDrawerOpen" class="relative z-[110]">
    <!-- Backdrop -->
    <div 
      @click="cartStore.toggleDrawer()" 
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
      title="Close cart drawer"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col isolate contain-content">
        
        <!-- Header -->
        <div class="px-6 py-6 border-b border-slate-200 flex items-center justify-between">
          <h2 class="text-lg font-serif font-bold text-[#0A1931] flex items-center gap-2">
            <span>Shopping Cart</span>
            <span class="text-xs font-sans font-normal text-[#1A3D63] bg-[#B3CFE5]/30 px-2 py-0.5 rounded-full">
              {{ cartStore.totalItems }} items
            </span>
          </h2>
          <button 
            @click="cartStore.toggleDrawer()"
            class="text-slate-400 hover:text-[#0A1931] p-1 transition cursor-pointer"
            aria-label="Close drawer"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div v-if="cartStore.isLoading && !cartStore.cart?.cartItems?.length" class="py-12 text-center text-slate-400">
            Loading cart details...
          </div>

          <div v-else-if="!cartStore.cart?.cartItems?.length" class="py-16 text-center">
            <svg class="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p class="text-[#0A1931] font-medium">Your cart is currently empty</p>
            <NuxtLink 
              to="/products" 
              @click="cartStore.toggleDrawer()"
              class="mt-4 inline-block px-6 py-2.5 rounded-2xl btn-primary-flat text-xs font-bold"
            >
              Explore Catalog
            </NuxtLink>
          </div>

          <div 
            v-else
            v-for="item in cartStore.cart?.cartItems" 
            :key="item.id"
            class="flex space-x-4 pb-6 border-b border-slate-100"
          >
            <img 
              :src="item.variant?.product?.productImages?.[0]?.url || 'https://via.placeholder.com/150'" 
              :alt="item.variant?.product?.name"
              class="w-20 h-24 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
            />
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <h3 class="text-sm font-medium text-[#0A1931] line-clamp-1 pr-2">
                    {{ item.variant?.product?.name }}
                  </h3>

                  <!-- Red Destructive Trash Icon Button -->
                  <button 
                    @click="promptRemoveItem(item)" 
                    class="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-[#1A3D63] mt-1 font-light">
                  {{ item.variant?.size ? `Size: ${item.variant.size}` : '' }} 
                  {{ item.variant?.color ? `| Color: ${item.variant.color}` : '' }}
                </p>
                <p class="text-sm font-semibold text-[#0A1931] mt-1">
                  Rp{{ formatPrice(item.variant?.priceOverride || item.variant?.product?.['basePrice']) }}
                </p>
              </div>

              <div class="flex items-center space-x-3 mt-2">
                <!-- Minus Button: Triggers removal confirmation when quantity is 1 -->
                <button 
                  @click="handleMinusClick(item)"
                  class="w-7 h-7 rounded pill-flat flex items-center justify-center text-xs font-bold text-[#0A1931] cursor-pointer"
                  :title="item.quantity === 1 ? 'Remove item' : 'Decrease quantity'"
                >
                  -
                </button>
                <span class="text-xs font-semibold text-[#0A1931]">{{ item.quantity }}</span>
                <button 
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  :disabled="item.quantity >= item.variant.stockQuantity"
                  class="w-7 h-7 rounded pill-flat flex items-center justify-center text-xs font-bold text-[#0A1931] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  +
                </button>
                
                <Transition name="fade-badge">
                  <span v-if="item.quantity >= item.variant.stockQuantity" class="text-[10px] text-amber-700 font-medium shrink-0">
                    Max stock
                  </span>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer / Subtotal -->
        <div v-if="cartStore.cart?.cartItems?.length" class="p-6 border-t border-slate-200 bg-[#F6FAFD]">
          <div class="flex justify-between text-sm font-medium text-[#0A1931] mb-2">
            <span>Subtotal</span>
            <span class="font-bold">Rp{{ formatPrice(cartStore.subtotal) }}</span>
          </div>
          <p class="text-[11px] text-[#1A3D63] mb-4 font-light">
            Shipping costs and final confirmation will be calculated & confirmed over WhatsApp.
          </p>

          <NuxtLink
            to="/cart"
            @click="cartStore.toggleDrawer()"
            class="block w-full text-center py-3.5 px-4 rounded-2xl btn-primary-flat text-sm font-bold"
          >
            View Full Cart & Checkout
          </NuxtLink>
        </div>

      </div>
    </div>

    <!-- Confirmation Modal Dialog for Item Removal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div 
          v-if="itemToRemove" 
          class="fixed inset-0 z-[140] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          @click.self="itemToRemove = null"
        >
          <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            
            <div>
              <h3 class="font-serif font-bold text-lg text-[#0A1931]">Remove Item?</h3>
              <p class="text-xs text-[#1A3D63] mt-1.5 font-light">
                Are you sure you want to remove <span class="font-semibold text-[#0A1931]">"{{ itemToRemove.name }}"</span> from your cart?
              </p>
            </div>

            <div class="flex space-x-3 pt-2">
              <button 
                @click="itemToRemove = null" 
                class="flex-1 py-2.5 rounded-xl pill-flat text-xs font-bold text-[#0A1931] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                @click="confirmRemoveItem" 
                class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const itemToRemove = ref<{ id: string; name: string } | null>(null);

const promptRemoveItem = (item: any) => {
  itemToRemove.value = {
    id: item.id,
    name: item.variant?.product?.name || 'this item',
  };
};

const handleMinusClick = (item: any) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1);
  } else {
    promptRemoveItem(item);
  }
};

const confirmRemoveItem = async () => {
  if (itemToRemove.value) {
    const id = itemToRemove.value.id;
    itemToRemove.value = null;
    await cartStore.removeItem(id);
  }
};

watch(
  () => cartStore.isDrawerOpen,
  (open) => {
    if (import.meta.client) {
      if (open) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }
  },
  { immediate: true }
);

const handleKeydown = (e: KeyboardEvent) => {
  if (cartStore.isDrawerOpen && e.key === 'Escape') {
    if (itemToRemove.value) {
      itemToRemove.value = null;
    } else {
      cartStore.toggleDrawer();
    }
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
});

const formatPrice = (val: any) => {
  const num = Number(val || 0);
  return num.toLocaleString('id-ID');
};
</script>

<style scoped>
.fade-badge-enter-active,
.fade-badge-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}
.fade-badge-enter-from,
.fade-badge-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease-out;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
