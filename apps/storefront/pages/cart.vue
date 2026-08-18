<template>
  <main class="w-full flex-1 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    
    <div class="mb-8 flex items-center justify-between border-b border-[#E4D8CC] pb-4">
      <div>
        <h1 class="font-serif font-black text-2xl sm:text-3xl text-[#1A170F] tracking-tight">Shopping Bag</h1>
        <p class="text-xs sm:text-sm text-[#8C8275] font-medium mt-1">Review your selected items and finalize delivery details.</p>
      </div>
      
      <NuxtLink 
        to="/products"
        class="text-xs uppercase tracking-wider font-extrabold text-[#E04F26] hover:text-[#1A170F] transition flex items-center gap-1"
      >
        <span>Explore Collection</span>
        <span>→</span>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="!cartStore.cart?.cartItems?.length" class="text-center py-20 px-4 bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl max-w-xl mx-auto shadow-xs">
      <div class="w-16 h-16 rounded-full bg-[#E4D8CC]/60 flex items-center justify-center mx-auto mb-4 text-[#8C8275]">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      <h2 class="font-serif font-black text-xl text-[#1A170F] mb-1">Your bag is currently empty</h2>
      <p class="text-xs sm:text-sm text-[#8C8275] max-w-sm mx-auto mb-6">
        Explore our curated collection and add timeless staples to your cart.
      </p>
      <NuxtLink
        to="/products"
        class="inline-flex items-center justify-center h-11 px-8 rounded-xl bg-[#1A170F] text-[#FAF6F1] hover:bg-[#E04F26] font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
      >
        Start Shopping →
      </NuxtLink>
    </div>

    <!-- Active Cart Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      <!-- Left Column: Bag Items Table -->
      <div class="lg:col-span-7 space-y-4">
        <div class="bg-[#FAF6F1] p-6 rounded-3xl border border-[#E4D8CC] shadow-xs">
          <h2 class="font-serif font-bold text-lg text-[#1A170F] pb-4 border-b border-[#E4D8CC] flex items-center justify-between">
            <span>Items ({{ cartStore.totalItems }})</span>
            <span class="text-xs font-sans text-[#8C8275] font-normal">Prices in IDR (Rp)</span>
          </h2>

          <div class="divide-y divide-[#E4D8CC]">
            <article 
              v-for="item in cartStore.cart?.cartItems" 
              :key="item.id"
              class="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div class="flex items-center space-x-4">
                <img 
                  :src="item.variant?.product?.productImages?.[0]?.url || 'https://via.placeholder.com/150'" 
                  :alt="item.variant?.product?.name"
                  class="w-20 h-24 object-cover rounded-2xl bg-white border border-[#E4D8CC] shrink-0"
                />
                
                <div class="space-y-1">
                  <h3 class="font-serif font-bold text-sm text-[#1A170F]">
                    {{ item.variant?.product?.name }}
                  </h3>

                  <div v-if="item.variant?.product?.productVariants?.length > 1" class="pt-0.5">
                    <AppSelect 
                      :model-value="item.variantId" 
                      :options="item.variant.product.productVariants.map((v: any) => ({
                        value: v.id,
                        label: `${v.size || 'STD'}${v.color ? ` · ${v.color}` : ''}${v.stockQuantity <= 0 ? ' (Out of stock)' : ''}`,
                        disabled: v.stockQuantity <= 0
                      }))"
                      :loading="changingVariantItemId === item.id"
                      placeholder="Select variant"
                      @update:model-value="(newVal) => changeItemVariant(item.id, newVal)"
                    />
                  </div>
                  <p v-else class="text-xs text-[#8C8275]">
                    Size: {{ item.variant?.size || 'Standard' }}
                    <span v-if="item.variant?.color"> · {{ item.variant.color }}</span>
                  </p>

                  <p class="text-xs font-bold text-[#E04F26]">
                    Rp{{ formatPrice(Number(item.variant?.priceOverride || item.variant?.product?.basePrice || 0)) }}
                  </p>
                </div>
              </div>

              <!-- Quantity Controls & Line Price -->
              <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                <div class="flex items-center border border-[#E4D8CC] rounded-xl bg-white p-1">
                  <button 
                    @click="handleMinusClick(item)" 
                    class="w-7 h-7 flex items-center justify-center text-[#1A170F] hover:bg-[#F4ECE5] rounded-lg transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span class="w-8 text-center text-xs font-bold text-[#1A170F]">{{ item.quantity }}</span>
                  <button 
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)" 
                    :disabled="item.quantity >= item.variant.stockQuantity"
                    class="w-7 h-7 flex items-center justify-center text-[#1A170F] hover:bg-[#F4ECE5] rounded-lg transition disabled:opacity-30 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div class="text-right min-w-[90px]">
                  <p class="font-serif font-black text-sm text-[#1A170F]">
                    Rp{{ formatPrice((Number(item.variant?.priceOverride || item.variant?.product?.basePrice || 0)) * item.quantity) }}
                  </p>
                  <button 
                    @click="promptRemoveItem(item)" 
                    class="text-[10px] uppercase tracking-wider text-rose-600 hover:underline font-bold mt-0.5 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div class="flex items-center justify-between px-2 text-xs">
          <NuxtLink to="/products" class="text-[#E04F26] hover:text-[#1A170F] font-bold flex items-center gap-1 cursor-pointer">
            <span>← Continue Shopping</span>
          </NuxtLink>
          <span class="text-[#1A170F]/70 font-medium">
            {{ cartStore.totalItems }} item(s) in cart
          </span>
        </div>
      </div>

      <!-- Right Column: Order Summary & Delivery Details -->
      <div class="lg:col-span-5 bg-[#FAF6F1] p-6 sm:p-8 rounded-3xl border border-[#E4D8CC] shadow-md space-y-6 lg:sticky lg:top-28">
        <h2 class="font-serif font-black text-xl text-[#1A170F] pb-4 border-b border-[#E4D8CC]">Order Summary</h2>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between text-[#1A170F]/80">
            <span>Items Subtotal</span>
            <span class="font-bold text-[#1A170F] tnum">Rp{{ formatPrice(cartStore.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-[#1A170F]/80">
            <span>Estimated Shipping</span>
            <span class="text-xs font-medium text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">Calculated over WhatsApp</span>
          </div>
        </div>

        <div class="pt-4 border-t border-[#E4D8CC] flex justify-between text-lg font-black text-[#1A170F]">
          <span>Estimated Total</span>
          <span class="tnum">Rp{{ formatPrice(cartStore.subtotal) }}</span>
        </div>

        <form @submit.prevent="handleCheckout" class="space-y-4 pt-4 border-t border-[#E4D8CC]" novalidate>
          <div v-if="error" class="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-medium border border-rose-200">
            {{ error }}
          </div>

          <div class="flex items-center justify-between">
            <h3 class="font-serif font-bold text-sm text-[#1A170F]">
              Customer & Delivery Details
            </h3>
            <NuxtLink
              to="/account/addresses"
              class="text-[11px] font-bold text-[#E04F26] hover:underline"
            >
              Manage Saved Addresses →
            </NuxtLink>
          </div>

          <!-- Loading Skeleton for Addresses -->
          <div v-if="isLoadingAddresses" class="space-y-2">
            <div v-for="i in 2" :key="i" class="h-20 bg-white/60 border border-[#E4D8CC] rounded-xl animate-pulse"></div>
          </div>

          <!-- Saved Address Selectable Cards List -->
          <div v-else-if="savedAddresses.length > 0" class="space-y-2.5">
            <label class="block text-[11px] font-bold text-[#1A170F]/70 uppercase tracking-wider">
              Select delivery destination:
            </label>

            <!-- Saved Address Cards -->
            <div
              v-for="addr in savedAddresses"
              :key="addr.id"
              @click="selectedAddressId = addr.id"
              :class="[
                selectedAddressId === addr.id
                  ? 'border-2 border-[#1A170F] bg-white ring-2 ring-[#1A170F]/10 shadow-xs'
                  : 'border border-[#E4D8CC] bg-[#F4ECE5]/70 hover:border-[#1A170F]/40'
              ]"
              class="p-3.5 rounded-2xl transition cursor-pointer flex items-start justify-between gap-3 relative"
            >
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 rounded bg-[#E4D8CC]/80 text-[#1A170F] text-[10px] font-extrabold uppercase tracking-wider">
                    {{ addr.label || 'Home' }}
                  </span>
                  <span v-if="addr.isDefault" class="px-1.5 py-0.2 text-[10px] font-bold text-[#E04F26] bg-[#E04F26]/10 rounded">
                    Default
                  </span>
                </div>
                <p class="text-xs font-bold text-[#1A170F] truncate">{{ addr.recipientName }}</p>
                <p class="text-[11px] text-[#8C8275]">{{ addr.phone }}</p>
                <p class="text-[11px] text-[#1A170F]/80 mt-1 line-clamp-2 leading-tight">
                  {{ addr.line1 }}<span v-if="addr.line2">, {{ addr.line2 }}</span>, {{ addr.city }} {{ addr.postalCode }}
                </p>
              </div>

              <div 
                :class="[
                  selectedAddressId === addr.id
                    ? 'bg-[#1A170F] border-[#1A170F] text-white'
                    : 'bg-white border-[#E4D8CC] text-transparent'
                ]"
                class="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 transition"
              >
                ✓
              </div>
            </div>

            <!-- "+ Add New Address" Card Option -->
            <div
              @click="selectedAddressId = 'new'"
              :class="[
                selectedAddressId === 'new'
                  ? 'border-2 border-[#1A170F] bg-white ring-2 ring-[#1A170F]/10 shadow-xs'
                  : 'border-2 border-dashed border-[#E4D8CC] bg-white/40 hover:bg-white hover:border-[#1A170F]/40'
              ]"
              class="p-3 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 text-center"
            >
              <svg class="w-4 h-4 text-[#1A170F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-xs font-bold text-[#1A170F] uppercase tracking-wider">+ Add New Address</span>
            </div>
          </div>

          <!-- Blank Manual Form (Rendered if 'new' is selected or user has 0 saved addresses) -->
          <div v-if="selectedAddressId === 'new' || (!isLoadingAddresses && savedAddresses.length === 0)" class="space-y-3 pt-1">
            <div v-if="savedAddresses.length > 0" class="flex items-center justify-between pb-1 border-b border-[#E4D8CC]/60">
              <span class="text-xs font-bold text-[#1A170F]">New Address Form:</span>
              <button
                type="button"
                @click="selectedAddressId = defaultAddressId"
                class="text-xs font-bold text-[#E04F26] hover:underline"
              >
                ← Use Saved Address
              </button>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1">Full Name *</label>
              <input 
                v-model="form.customer.name" 
                @input="clearFieldError('name')"
                type="text" 
                placeholder="Dinda Pratiwi"
                :class="[fieldErrors.name ? 'border-rose-400 focus:ring-rose-500' : 'border-[#E4D8CC] focus:ring-[#E04F26]']"
                class="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-[#F4ECE5] focus:outline-none focus:ring-2 text-[#1A170F]"
              />
              <span v-if="fieldErrors.name" class="text-rose-600 text-[11px] font-medium mt-1 block">
                {{ fieldErrors.name }}
              </span>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1">WhatsApp Phone *</label>
              <input 
                v-model="form.customer.phone" 
                @input="clearFieldError('phone')"
                type="tel" 
                placeholder="+6281234567890"
                :class="[fieldErrors.phone ? 'border-rose-400 focus:ring-rose-500' : 'border-[#E4D8CC] focus:ring-[#E04F26]']"
                class="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-[#F4ECE5] focus:outline-none focus:ring-2 text-[#1A170F]"
              />
              <span v-if="fieldErrors.phone" class="text-rose-600 text-[11px] font-medium mt-1 block">
                {{ fieldErrors.phone }}
              </span>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1">Email (Optional)</label>
              <input 
                v-model="form.customer.email" 
                @input="clearFieldError('email')"
                type="email" 
                placeholder="dinda@example.com"
                :class="[fieldErrors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-[#E4D8CC] focus:ring-[#E04F26]']"
                class="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-[#F4ECE5] focus:outline-none focus:ring-2 text-[#1A170F]"
              />
              <span v-if="fieldErrors.email" class="text-rose-600 text-[11px] font-medium mt-1 block">
                {{ fieldErrors.email }}
              </span>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1">Street Address *</label>
              <input 
                v-model="form.shippingAddress.line1" 
                @input="clearFieldError('line1')"
                type="text" 
                placeholder="Jl. Merdeka No. 10"
                :class="[fieldErrors.line1 ? 'border-rose-400 focus:ring-rose-500' : 'border-[#E4D8CC] focus:ring-[#E04F26]']"
                class="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-[#F4ECE5] focus:outline-none focus:ring-2 text-[#1A170F]"
              />
              <span v-if="fieldErrors.line1" class="text-rose-600 text-[11px] font-medium mt-1 block">
                {{ fieldErrors.line1 }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1">City / District *</label>
                <input 
                  v-model="form.shippingAddress.city" 
                  @input="clearFieldError('city')"
                  type="text" 
                  placeholder="Medan"
                  :class="[fieldErrors.city ? 'border-rose-400 focus:ring-rose-500' : 'border-[#E4D8CC] focus:ring-[#E04F26]']"
                  class="w-full px-3 py-2.5 rounded-xl border text-xs bg-[#F4ECE5] focus:outline-none focus:ring-2 text-[#1A170F]"
                />
                <span v-if="fieldErrors.city" class="text-rose-600 text-[11px] font-medium mt-1 block">
                  {{ fieldErrors.city }}
                </span>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1">Postal Code</label>
                <input 
                  v-model="form.shippingAddress.postalCode" 
                  type="text" 
                  placeholder="20111"
                  class="w-full px-3 py-2.5 rounded-xl border border-[#E4D8CC] text-xs bg-[#F4ECE5] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F]"
                />
              </div>
            </div>

            <label class="flex items-center space-x-2 text-xs text-[#1A170F]/80 cursor-pointer pt-1">
              <input 
                v-model="saveInfo" 
                type="checkbox" 
                class="rounded border-[#E4D8CC] text-[#E04F26] focus:ring-[#E04F26]"
              />
              <span>Save this address to my account for future orders</span>
            </label>
          </div>

          <!-- Order Notes (Available in all states) -->
          <div>
            <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1">Order Notes (Optional)</label>
            <textarea 
              v-model="form.notes" 
              rows="2" 
              placeholder="e.g. Please leave with security"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D8CC] text-xs bg-[#F4ECE5] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F] resize-none"
            ></textarea>
          </div>

          <!-- Checkout via WhatsApp Action Button -->
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full py-4 rounded-2xl bg-[#E04F26] hover:bg-[#C8431E] font-extrabold text-xs uppercase tracking-widest text-white disabled:opacity-50 transition flex items-center justify-center space-x-2 mt-2 cursor-pointer shadow-xl"
          >
            <span>💬 {{ submitting ? 'Processing Order...' : 'Checkout via WhatsApp' }}</span>
          </button>
        </form>

        <div class="bg-[#F4ECE5] p-4 rounded-2xl text-xs text-[#1A170F]/80 leading-relaxed border border-[#E4D8CC] font-light">
          <p class="font-bold text-[#1A170F] mb-1">💬 How WhatsApp Checkout Works:</p>
          Submitting checkout will save your order record and automatically redirect you to WhatsApp with a pre-formatted order summary ready to send to our store desk.
        </div>

      </div>

    </div>

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

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import { useCustomerAuthStore } from '~/stores/customerAuth';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useCustomerAuthStore();
const { fetchApi } = useApi();

useSeoMeta({
  title: 'Your Shopping Cart — Jubi & Lee Studio',
  description: 'Review items in your shopping cart and complete your order via WhatsApp with Jubi & Lee Studio.',
  ogTitle: 'Your Shopping Cart — Jubi & Lee Studio',
  ogDescription: 'Review items in your shopping cart and complete your order via WhatsApp with Jubi & Lee Studio.',
});

const savedAddresses = ref<any[]>([]);
const defaultAddressId = ref<string>('');
const selectedAddressId = ref<string>('new');
const isLoadingAddresses = ref<boolean>(true);

const itemToRemove = ref<{ id: string; name: string } | null>(null);
const changingVariantItemId = ref<string | null>(null);

const form = ref({
  customer: {
    name: '',
    phone: '',
    email: '',
  },
  shippingAddress: {
    line1: '',
    line2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Indonesia',
  },
  notes: '',
});

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  line1?: string;
  city?: string;
  notes?: string;
}

const fieldErrors = ref<FieldErrors>({});
const saveInfo = ref(true);
const submitting = ref(false);
const error = ref('');

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.initAuth();
  }
  if (!authStore.isAuthenticated) {
    await navigateTo('/login?redirect=/cart');
    return;
  }

  if (authStore.user) {
    form.value.customer.name = authStore.user.name || '';
    form.value.customer.phone = authStore.user.phone || '';
    form.value.customer.email = authStore.user.email || '';
  }

  await loadAddresses();
});

const loadAddresses = async () => {
  try {
    isLoadingAddresses.value = true;
    const data = await fetchApi<any[]>('/customer/addresses');
    savedAddresses.value = Array.isArray(data) ? data : [];

    if (savedAddresses.value.length > 0) {
      const defaultAddr = savedAddresses.value.find((a) => a.isDefault) || savedAddresses.value[0];
      defaultAddressId.value = defaultAddr.id;
      selectedAddressId.value = defaultAddr.id;
    } else {
      selectedAddressId.value = 'new';
    }
  } catch {
    savedAddresses.value = [];
    selectedAddressId.value = 'new';
  } finally {
    isLoadingAddresses.value = false;
  }
};

const changeItemVariant = async (itemId: string, newVariantId: string) => {
  try {
    changingVariantItemId.value = itemId;
    await cartStore.updateItemVariant(itemId, newVariantId);
  } catch (e: any) {
    alert(e?.data?.message || e?.message || 'Failed to update variant');
  } finally {
    changingVariantItemId.value = null;
  }
};

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

const clearFieldError = (field: keyof FieldErrors) => {
  delete fieldErrors.value[field];
  if (Object.keys(fieldErrors.value).length === 0) {
    error.value = '';
  }
};

const validateManualForm = (): boolean => {
  fieldErrors.value = {};
  let isValid = true;

  const trimmedName = form.value.customer.name.trim();
  if (!trimmedName) {
    fieldErrors.value.name = 'Please enter your full name.';
    isValid = false;
  } else if (trimmedName.length < 2) {
    fieldErrors.value.name = 'Full name must be at least 2 characters long.';
    isValid = false;
  }

  const trimmedPhone = form.value.customer.phone.trim();
  const phoneRegex = /^(\+?[0-9\s\-]{8,18})$/;
  if (!trimmedPhone) {
    fieldErrors.value.phone = 'Please enter your WhatsApp phone number.';
    isValid = false;
  } else if (!phoneRegex.test(trimmedPhone)) {
    fieldErrors.value.phone = 'Please enter a valid phone number (at least 8 digits).';
    isValid = false;
  }

  const trimmedEmail = form.value.customer.email.trim();
  if (trimmedEmail !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      fieldErrors.value.email = 'Please enter a valid email address.';
      isValid = false;
    }
  }

  const trimmedLine1 = form.value.shippingAddress.line1.trim();
  if (!trimmedLine1) {
    fieldErrors.value.line1 = 'Please enter your street address.';
    isValid = false;
  } else if (trimmedLine1.length < 5) {
    fieldErrors.value.line1 = 'Street address must be at least 5 characters long.';
    isValid = false;
  }

  const trimmedCity = form.value.shippingAddress.city.trim();
  if (!trimmedCity) {
    fieldErrors.value.city = 'Please enter your city or district.';
    isValid = false;
  } else if (trimmedCity.length < 2) {
    fieldErrors.value.city = 'City / District must be at least 2 characters long.';
    isValid = false;
  }

  if (!isValid) {
    error.value = 'Please correct the highlighted fields below.';
  }

  return isValid;
};

const handleCheckout = async () => {
  if (!cartStore.cart?.cartItems?.length) return;

  try {
    submitting.value = true;
    error.value = '';

    let recipientName = '';
    let phone = '';
    let email = form.value.customer.email?.trim() || authStore.user?.email || undefined;
    let line1 = '';
    let line2: string | undefined = undefined;
    let city = '';
    let province: string | undefined = undefined;
    let postalCode: string | undefined = undefined;
    let country = 'Indonesia';

    if (selectedAddressId.value !== 'new') {
      const selectedAddr = savedAddresses.value.find((a) => a.id === selectedAddressId.value);
      if (!selectedAddr) {
        error.value = 'Please select a delivery address.';
        submitting.value = false;
        return;
      }
      recipientName = selectedAddr.recipientName;
      phone = selectedAddr.phone;
      line1 = selectedAddr.line1;
      line2 = selectedAddr.line2 || undefined;
      city = selectedAddr.city;
      province = selectedAddr.province || undefined;
      postalCode = selectedAddr.postalCode || undefined;
      country = selectedAddr.country || 'Indonesia';
    } else {
      if (!validateManualForm()) {
        submitting.value = false;
        return;
      }
      recipientName = form.value.customer.name.trim();
      phone = form.value.customer.phone.trim();
      line1 = form.value.shippingAddress.line1.trim();
      line2 = form.value.shippingAddress.line2?.trim() || undefined;
      city = form.value.shippingAddress.city.trim();
      province = form.value.shippingAddress.province?.trim() || undefined;
      postalCode = form.value.shippingAddress.postalCode?.trim() || undefined;

      if (saveInfo.value) {
        try {
          await fetchApi('/customer/addresses', {
            method: 'POST',
            body: {
              label: 'Delivery Address',
              recipientName,
              phone,
              line1,
              line2,
              city,
              province,
              postalCode,
              country,
              isDefault: savedAddresses.value.length === 0,
            },
          });
        } catch {}
      }
    }

    const payload = {
      customer: {
        name: recipientName,
        phone,
        email,
      },
      shippingAddress: {
        line1,
        line2,
        city,
        province,
        postalCode,
        country,
      },
      notes: form.value.notes?.trim() || undefined,
      cartId: cartStore.cart?.id,
      guestToken: cartStore.guestToken,
    };

    const res = await fetchApi<any>('/checkout', {
      method: 'POST',
      body: payload,
    });

    await cartStore.fetchCart();

    if (res?.whatsappRedirectUrl) {
      window.location.href = res.whatsappRedirectUrl;
    } else {
      router.push(`/order/confirmation/${res.orderNumber}`);
    }
  } catch (e: any) {
    const rawMsg = e?.data?.message || e.message || '';
    if (typeof rawMsg === 'string' && rawMsg.length > 0) {
      const cleaned = rawMsg.replace(/^customer\./i, '').replace(/^shippingAddress\./i, '');
      error.value = cleaned;
    } else {
      error.value = 'Failed to complete checkout. Please try again.';
    }
  } finally {
    submitting.value = false;
  }
};

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
