<template>
  <main class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-28 text-[#1A170F]">
    <h1 class="font-serif text-3xl font-black text-[#1A170F] mb-8">Shopping Cart</h1>

    <div v-if="!cartStore.cart?.cartItems?.length" class="py-16 text-center bg-[#FAF6F1] rounded-3xl border border-[#E4D8CC] shadow-md max-w-xl mx-auto">
      <svg class="w-16 h-16 mx-auto text-[#1A170F]/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
      <h2 class="text-xl font-serif font-black text-[#1A170F]">Your cart is currently empty</h2>
      <p class="text-xs text-[#1A170F]/70 mt-1 mb-6 font-light">Discover our latest summer arrivals and wardrobe staples.</p>
      <NuxtLink to="/products" class="px-8 py-3.5 rounded-2xl bg-[#E04F26] text-white hover:bg-[#C8431E] text-xs font-extrabold uppercase tracking-wider shadow-md">
        Browse Catalog
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      
      <!-- Left Column: Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cartStore.cart?.cartItems" 
          :key="item.id"
          class="bg-[#FAF6F1] p-4 sm:p-6 rounded-3xl border border-[#E4D8CC] shadow-md flex space-x-4 sm:space-x-6 items-center"
        >
          <img 
            :src="item.variant?.product?.productImages?.[0]?.url" 
            :alt="item.variant?.product?.name" 
            class="w-24 h-32 object-cover rounded-2xl bg-slate-200 border border-[#E4D8CC] shrink-0"
          />

          <div class="flex-1 flex flex-col justify-between h-32 py-1">
            <div>
              <div class="flex justify-between items-start">
                <h3 class="font-serif font-bold text-base text-[#1A170F]">
                  <NuxtLink :to="`/products/${item.variant?.product?.slug}`" class="hover:text-[#E04F26]">
                    {{ item.variant?.product?.name }}
                  </NuxtLink>
                </h3>
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
              <!-- In-Cart Variant Editing: Size & Color Dropdown -->
              <div v-if="item.variant?.product?.productVariants?.length > 1" class="mt-1.5">
                <select 
                  :value="item.variantId" 
                  @change="changeItemVariant(item.id, ($event.target as HTMLSelectElement).value)"
                  :disabled="changingVariantItemId === item.id"
                  class="text-[11px] font-bold bg-[#F4ECE5] border border-[#E4D8CC] rounded-lg px-2.5 py-1 text-[#1A170F] focus:outline-none focus:ring-1 focus:ring-[#E04F26] cursor-pointer max-w-full disabled:opacity-50"
                >
                  <option 
                    v-for="v in item.variant.product.productVariants" 
                    :key="v.id" 
                    :value="v.id"
                    :disabled="v.stockQuantity <= 0"
                  >
                    {{ v.size || 'STD' }} {{ v.color ? `· ${v.color}` : '' }} {{ v.stockQuantity <= 0 ? '(Out of stock)' : '' }}
                  </option>
                </select>
              </div>
              <p v-else class="text-xs text-[#1A170F]/70 mt-1 font-light">
                {{ item.variant?.size ? `Size: ${item.variant.size}` : '' }} 
                {{ item.variant?.color ? `| Color: ${item.variant.color}` : '' }}
              </p>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-3">
                <button 
                  @click="handleMinusClick(item)"
                  class="w-8 h-8 rounded-xl bg-white border border-[#E4D8CC] flex items-center justify-center text-xs font-bold text-[#1A170F] cursor-pointer hover:bg-[#F4ECE5]"
                  :title="item.quantity === 1 ? 'Remove item' : 'Decrease quantity'"
                >
                  -
                </button>
                <span class="text-xs font-bold text-[#1A170F]">{{ item.quantity }}</span>
                <button 
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  :disabled="item.quantity >= item.variant.stockQuantity"
                  class="w-8 h-8 rounded-xl bg-white border border-[#E4D8CC] flex items-center justify-center text-xs font-bold text-[#1A170F] disabled:opacity-30 cursor-pointer hover:bg-[#F4ECE5]"
                >
                  +
                </button>
              </div>

              <p class="font-extrabold text-base text-[#1A170F] tnum">
                Rp{{ formatPrice((item.variant?.priceOverride || item.variant?.product?.['basePrice']) * item.quantity) }}
              </p>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-between items-center text-xs">
          <NuxtLink to="/products" class="text-[#E04F26] hover:text-[#1A170F] font-bold flex items-center gap-1 cursor-pointer">
            <span>← Continue Shopping</span>
          </NuxtLink>
          <span class="text-[#1A170F]/70 font-medium">
            {{ cartStore.totalItems }} item(s) in cart
          </span>
        </div>
      </div>

      <!-- Right Column: Order Summary & Customer Info Checkout Form -->
      <div class="bg-[#FAF6F1] p-6 sm:p-8 rounded-3xl border border-[#E4D8CC] shadow-md space-y-6">
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

        <!-- Customer Checkout Form -->
        <form @submit.prevent="handleCheckout" class="space-y-4 pt-4 border-t border-[#E4D8CC]" novalidate>
          <div v-if="error" class="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-medium border border-rose-200">
            {{ error }}
          </div>

          <h3 class="font-serif font-bold text-sm text-[#1A170F] flex items-center justify-between">
            <span>Customer & Delivery Details</span>
            <span v-if="autoFilled" class="text-[10px] font-sans font-normal text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
              ✓ Auto-filled
            </span>
          </h3>

          <!-- Field 1: Full Name -->
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

          <!-- Field 2: WhatsApp Phone -->
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

          <!-- Field 3: Email (Optional) -->
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

          <!-- Field 4: Street Address -->
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

          <!-- Field 5: City / District & Postal Code -->
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

          <!-- Field 6: Order Notes (Optional) -->
          <div>
            <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1">Order Notes (Optional)</label>
            <textarea 
              v-model="form.notes" 
              rows="2" 
              placeholder="e.g. Please leave with security"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D8CC] text-xs bg-[#F4ECE5] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F] resize-none"
            ></textarea>
          </div>

          <!-- Save Info Checkbox -->
          <label class="flex items-center space-x-2 text-xs text-[#1A170F]/80 cursor-pointer pt-1">
            <input 
              v-model="saveInfo" 
              type="checkbox" 
              class="rounded border-[#E4D8CC] text-[#E04F26] focus:ring-[#E04F26]"
            />
            <span>Save my info for faster checkout next time</span>
          </label>

          <!-- Primary Action Button: Checkout -->
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

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const router = useRouter();
const cartStore = useCartStore();
const { fetchApi } = useApi();

const itemToRemove = ref<{ id: string; name: string } | null>(null);
const changingVariantItemId = ref<string | null>(null);

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
const autoFilled = ref(false);
const submitting = ref(false);
const error = ref('');

const LOCAL_STORAGE_KEY = 'aura_customer_checkout_info';

onMounted(() => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.customer) {
        form.value.customer = { ...form.value.customer, ...parsed.customer };
      }
      if (parsed.shippingAddress) {
        form.value.shippingAddress = { ...form.value.shippingAddress, ...parsed.shippingAddress };
      }
      autoFilled.value = true;
    }
  } catch (e) {
    console.error('Failed to parse saved customer info from localStorage', e);
  }
});

const clearFieldError = (field: keyof FieldErrors) => {
  delete fieldErrors.value[field];
  if (Object.keys(fieldErrors.value).length === 0) {
    error.value = '';
  }
};

const validateForm = (): boolean => {
  fieldErrors.value = {};
  let isValid = true;

  // 1. Full Name: required, min 2 chars
  const trimmedName = form.value.customer.name.trim();
  if (!trimmedName) {
    fieldErrors.value.name = 'Please enter your full name.';
    isValid = false;
  } else if (trimmedName.length < 2) {
    fieldErrors.value.name = 'Full name must be at least 2 characters long.';
    isValid = false;
  }

  // 2. WhatsApp Phone: required, valid phone number format (at least 8 digits)
  const trimmedPhone = form.value.customer.phone.trim();
  const phoneRegex = /^(\+?[0-9\s\-]{8,18})$/;
  if (!trimmedPhone) {
    fieldErrors.value.phone = 'Please enter your WhatsApp phone number.';
    isValid = false;
  } else if (!phoneRegex.test(trimmedPhone)) {
    fieldErrors.value.phone = 'Please enter a valid phone number (at least 8 digits).';
    isValid = false;
  }

  // 3. Email: OPTIONAL! Only validate format if non-empty
  const trimmedEmail = form.value.customer.email.trim();
  if (trimmedEmail !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      fieldErrors.value.email = 'Please enter a valid email address.';
      isValid = false;
    }
  }

  // 4. Street Address: required, min 5 chars
  const trimmedLine1 = form.value.shippingAddress.line1.trim();
  if (!trimmedLine1) {
    fieldErrors.value.line1 = 'Please enter your street address.';
    isValid = false;
  } else if (trimmedLine1.length < 5) {
    fieldErrors.value.line1 = 'Street address must be at least 5 characters long.';
    isValid = false;
  }

  // 5. City / District: required, min 2 chars
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

  // Run client-side validation
  if (!validateForm()) {
    return;
  }

  try {
    submitting.value = true;
    error.value = '';

    // Sanitize payload (trim whitespace and map empty optional strings to undefined)
    const sanitizedPayload = {
      customer: {
        name: form.value.customer.name.trim(),
        phone: form.value.customer.phone.trim(),
        email: form.value.customer.email.trim() || undefined,
      },
      shippingAddress: {
        line1: form.value.shippingAddress.line1.trim(),
        line2: form.value.shippingAddress.line2?.trim() || undefined,
        city: form.value.shippingAddress.city.trim(),
        province: form.value.shippingAddress.province?.trim() || undefined,
        postalCode: form.value.shippingAddress.postalCode?.trim() || undefined,
        country: 'Indonesia',
      },
      notes: form.value.notes?.trim() || undefined,
      cartId: cartStore.cart?.id,
      guestToken: cartStore.guestToken,
    };

    // 1. Save or clear customer info from localStorage based on checkbox
    if (saveInfo.value) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        customer: sanitizedPayload.customer,
        shippingAddress: sanitizedPayload.shippingAddress,
      }));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    // 2. Submit order creation to API backend
    const res = await fetchApi<any>('/checkout', {
      method: 'POST',
      body: sanitizedPayload,
    });

    // 3. Refresh cart state after order creation
    await cartStore.fetchCart();

    // 4. Redirect to Order Confirmation page with autoRedirect flag to trigger WhatsApp deep link
    router.push(`/order/confirmation/${res.orderNumber}?autoRedirect=true`);
  } catch (e: any) {
    const rawMsg = e?.data?.message || e.message || '';
    if (typeof rawMsg === 'string' && rawMsg.length > 0) {
      // Clean raw object paths like "customer.email" => "email"
      const cleaned = rawMsg.replace(/^customer\./i, '').replace(/^shippingAddress\./i, '');
      error.value = cleaned;

      // Map to inline field errors if matching field name
      if (/email/i.test(cleaned)) fieldErrors.value.email = cleaned;
      if (/name/i.test(cleaned)) fieldErrors.value.name = cleaned;
      if (/phone/i.test(cleaned)) fieldErrors.value.phone = cleaned;
      if (/street|line1/i.test(cleaned)) fieldErrors.value.line1 = cleaned;
      if (/city/i.test(cleaned)) fieldErrors.value.city = cleaned;
    } else {
      error.value = 'Failed to complete checkout. Please try again.';
    }
  } finally {
    submitting.value = false;
  }
};

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
