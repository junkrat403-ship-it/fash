<template>
  <main class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-28">
    <div class="max-w-xl mx-auto text-center mb-10">
      <span class="text-xs uppercase tracking-widest text-[#E04F26] font-bold">Final Step</span>
      <h1 class="font-serif text-3xl sm:text-4xl font-black text-[#1A170F] mt-1 tracking-tight">Order Checkout</h1>
      <p class="text-xs text-[#8C8275] mt-2 font-medium">Enter your delivery details to generate your WhatsApp order request.</p>
    </div>

    <!-- Empty Cart Fallback -->
    <div v-if="!cartStore.cart?.cartItems?.length" class="py-16 text-center bg-[#FAF6F1] rounded-3xl border border-[#E4D8CC] shadow-xs max-w-xl mx-auto">
      <h2 class="text-xl font-serif font-black text-[#1A170F]">Your cart is empty</h2>
      <p class="text-xs text-[#8C8275] mt-1 mb-6 font-medium">Please add items to your cart before proceeding to checkout.</p>
      <NuxtLink to="/products" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#1A170F] text-[#FAF6F1] hover:bg-[#E04F26] text-xs uppercase tracking-wider font-bold transition shadow-sm">
        Explore Collection →
      </NuxtLink>
    </div>

    <!-- Active Checkout Form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

      <div class="lg:col-span-2 bg-[#FAF6F1] p-6 sm:p-10 rounded-3xl border border-[#E4D8CC] shadow-xs space-y-8">
        
        <!-- Guest Login Prompt Banner -->
        <div 
          v-if="!authStore.isAuthenticated && showGuestBanner" 
          class="p-4 rounded-2xl bg-[#E4D8CC]/40 border border-[#E4D8CC] flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#1A170F] text-[#FAF6F1] flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p class="text-xs text-[#1A170F]">
              Have a Jubi & Lee account? 
              <NuxtLink to="/login?redirect=/checkout" class="font-extrabold text-[#E04F26] hover:underline ml-1">
                Sign In for faster checkout →
              </NuxtLink>
            </p>
          </div>
          <button @click="showGuestBanner = false" class="text-[#8C8275] hover:text-[#1A170F] text-xs font-bold p-1">
            ✕
          </button>
        </div>

        <!-- Logged-in Customer Badge -->
        <div 
          v-else-if="authStore.isAuthenticated"
          class="p-4 rounded-2xl bg-white border border-[#E4D8CC] flex items-center justify-between gap-4 shadow-2xs"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#1A170F] text-[#FAF6F1] flex items-center justify-center font-serif font-bold text-xs shrink-0">
              {{ authStore.userInitials }}
            </div>
            <div>
              <p class="text-xs font-bold text-[#1A170F]">Logged in as {{ authStore.user?.name }}</p>
              <p class="text-[11px] text-[#8C8275]">{{ authStore.user?.email || authStore.user?.phone }}</p>
            </div>
          </div>
          <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ✓ Details Autofilled
          </span>
        </div>

        <form @submit.prevent="submitCheckout" class="space-y-8" novalidate>
          <div v-if="error" class="p-4 bg-[#FBEAE5] text-[#E04F26] rounded-2xl text-xs font-bold border border-[#E04F26]/30 flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Section 1: Contact Information -->
          <div class="space-y-4">
            <h2 class="font-serif font-black text-lg text-[#1A170F] pb-2 border-b border-[#E4D8CC] flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-full bg-[#1A170F] text-[#FAF6F1] text-xs flex items-center justify-center font-sans font-bold">1</span>
              <span>Contact Information</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Full Name *</label>
                <input 
                  v-model="form.customer.name" 
                  @input="clearFieldError('name')"
                  type="text" 
                  placeholder="Dinda Pratiwi"
                  :class="[fieldErrors.name ? 'border-[#E04F26] ring-1 ring-[#E04F26]' : 'border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26]']"
                  class="w-full h-11 px-4 rounded-xl border text-sm bg-white focus:outline-none text-[#1A170F] transition"
                />
                <span v-if="fieldErrors.name" class="text-[#E04F26] text-xs font-bold mt-1 block">
                  {{ fieldErrors.name }}
                </span>
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">WhatsApp Phone Number *</label>
                <input 
                  v-model="form.customer.phone" 
                  @input="clearFieldError('phone')"
                  type="tel" 
                  placeholder="081234567890"
                  :class="[fieldErrors.phone ? 'border-[#E04F26] ring-1 ring-[#E04F26]' : 'border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26]']"
                  class="w-full h-11 px-4 rounded-xl border text-sm bg-white focus:outline-none text-[#1A170F] transition"
                />
                <span v-if="fieldErrors.phone" class="text-[#E04F26] text-xs font-bold mt-1 block">
                  {{ fieldErrors.phone }}
                </span>
                <span v-else class="text-[10px] text-[#8C8275] mt-1 block font-medium">Store staff will confirm your order on this WhatsApp number.</span>
              </div>
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Email Address (Optional)</label>
              <input 
                v-model="form.customer.email" 
                @input="clearFieldError('email')"
                type="email" 
                placeholder="dinda@example.com"
                :class="[fieldErrors.email ? 'border-[#E04F26] ring-1 ring-[#E04F26]' : 'border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26]']"
                class="w-full h-11 px-4 rounded-xl border text-sm bg-white focus:outline-none text-[#1A170F] transition"
              />
              <span v-if="fieldErrors.email" class="text-[#E04F26] text-xs font-bold mt-1 block">
                {{ fieldErrors.email }}
              </span>
            </div>
          </div>

          <!-- Section 2: Shipping Address -->
          <div class="space-y-4 pt-4 border-t border-[#E4D8CC]">
            <div class="flex items-center justify-between pb-2 border-b border-[#E4D8CC]">
              <h2 class="font-serif font-black text-lg text-[#1A170F] flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-full bg-[#1A170F] text-[#FAF6F1] text-xs flex items-center justify-center font-sans font-bold">2</span>
                <span>Shipping Address</span>
              </h2>

              <!-- Saved Addresses Quick Picker for Logged-In Users -->
              <div v-if="savedAddresses.length > 0" class="flex items-center gap-2">
                <span class="text-[11px] font-bold text-[#8C8275]">Use Saved:</span>
                <select
                  @change="applySavedAddress(($event.target as HTMLSelectElement).value)"
                  class="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-[#E4D8CC] text-[#1A170F] focus:outline-none focus:border-[#E04F26] cursor-pointer"
                >
                  <option value="" disabled selected>Select Address</option>
                  <option v-for="addr in savedAddresses" :key="addr.id" :value="addr.id">
                    {{ addr.label || 'Address' }} ({{ addr.recipientName }})
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Street Address *</label>
              <input 
                v-model="form.shippingAddress.line1" 
                @input="clearFieldError('line1')"
                type="text" 
                placeholder="Jl. Senopati No. 45"
                :class="[fieldErrors.line1 ? 'border-[#E04F26] ring-1 ring-[#E04F26]' : 'border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26]']"
                class="w-full h-11 px-4 rounded-xl border text-sm bg-white focus:outline-none text-[#1A170F] transition"
              />
              <span v-if="fieldErrors.line1" class="text-[#E04F26] text-xs font-bold mt-1 block">
                {{ fieldErrors.line1 }}
              </span>
            </div>

            <div>
              <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Apartment / Unit / Landmark (Optional)</label>
              <input 
                v-model="form.shippingAddress.line2" 
                type="text" 
                placeholder="Apartemen Senopati, Tower 2 Lt. 12"
                class="w-full h-11 px-4 rounded-xl border border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] text-sm bg-white focus:outline-none text-[#1A170F] transition"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">City / District *</label>
                <input 
                  v-model="form.shippingAddress.city" 
                  @input="clearFieldError('city')"
                  type="text" 
                  placeholder="Jakarta Selatan"
                  :class="[fieldErrors.city ? 'border-[#E04F26] ring-1 ring-[#E04F26]' : 'border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26]']"
                  class="w-full h-11 px-4 rounded-xl border text-sm bg-white focus:outline-none text-[#1A170F] transition"
                />
                <span v-if="fieldErrors.city" class="text-[#E04F26] text-xs font-bold mt-1 block">
                  {{ fieldErrors.city }}
                </span>
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Province</label>
                <input 
                  v-model="form.shippingAddress.province" 
                  type="text" 
                  placeholder="DKI Jakarta"
                  class="w-full h-11 px-4 rounded-xl border border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] text-sm bg-white focus:outline-none text-[#1A170F] transition"
                />
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Postal Code</label>
                <input 
                  v-model="form.shippingAddress.postalCode" 
                  type="text" 
                  placeholder="12190"
                  class="w-full h-11 px-4 rounded-xl border border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] text-sm bg-white focus:outline-none text-[#1A170F] transition"
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Notes -->
          <div class="space-y-4 pt-4 border-t border-[#E4D8CC]">
            <h2 class="font-serif font-black text-lg text-[#1A170F] pb-2 border-b border-[#E4D8CC] flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-full bg-[#1A170F] text-[#FAF6F1] text-xs flex items-center justify-center font-sans font-bold">3</span>
              <span>Order Notes (Optional)</span>
            </h2>

            <div>
              <textarea 
                v-model="form.notes" 
                rows="2"
                placeholder="Special delivery instructions or gifting notes..."
                class="w-full p-4 rounded-xl border border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] text-sm bg-white focus:outline-none text-[#1A170F] transition resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Submit Action -->
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm uppercase tracking-[0.14em] shadow-md flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="submitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <template v-else>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{{ submitting ? 'Processing Order...' : 'Complete Order via WhatsApp' }}</span>
            </template>
          </button>
        </form>
      </div>

      <!-- Right Column: Order Summary -->
      <div class="bg-[#FAF6F1] p-6 sm:p-8 rounded-3xl border border-[#E4D8CC] shadow-xs space-y-6 lg:sticky lg:top-28">
        <h3 class="font-serif font-black text-xl text-[#1A170F] pb-4 border-b border-[#E4D8CC]">
          Order Summary ({{ cartStore.totalItems }})
        </h3>

        <div class="space-y-4 max-h-80 overflow-y-auto pr-1">
          <div 
            v-for="item in cartStore.cart?.cartItems" 
            :key="item.id"
            class="flex items-center gap-4 text-xs"
          >
            <div class="w-14 h-18 bg-white border border-[#E4D8CC] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
              <img 
                v-if="item.variant.product.productImages?.[0]?.url" 
                :src="item.variant.product.productImages[0].url" 
                :alt="item.variant.product.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-[10px] text-[#8C8275]">J&L</span>
            </div>
            
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-[#1A170F] truncate">{{ item.variant.product.name }}</h4>
              <p class="text-[#8C8275] text-[11px] mt-0.5">
                {{ item.variant.size ? `Size: ${item.variant.size}` : '' }}
                {{ item.variant.color ? ` / Color: ${item.variant.color}` : '' }}
              </p>
              <div class="flex items-center justify-between mt-1">
                <span class="text-[#8C8275] font-semibold">Qty: {{ item.quantity }}</span>
                <span class="font-bold text-[#1A170F]">
                  Rp{{ formatPrice((Number(item.variant.priceOverride || item.variant.product['basePrice'] || 0)) * item.quantity) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-[#E4D8CC] space-y-2">
          <div class="flex justify-between text-xs text-[#8C8275] font-medium">
            <span>Subtotal</span>
            <span>Rp{{ formatPrice(cartStore.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-xs text-[#8C8275] font-medium">
            <span>Shipping</span>
            <span class="text-[#E04F26] font-bold">Arranged via WhatsApp</span>
          </div>
          <div class="flex justify-between font-serif font-black text-lg text-[#1A170F] pt-2 border-t border-[#E4D8CC]">
            <span>Total</span>
            <span>Rp{{ formatPrice(cartStore.subtotal) }}</span>
          </div>
        </div>
      </div>

    </div>
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
  title: 'Checkout — Jubi & Lee',
  description: 'Complete your delivery details to place an order via WhatsApp with Jubi & Lee.',
});

const showGuestBanner = ref(true);
const savedAddresses = ref<any[]>([]);

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
const submitting = ref(false);
const error = ref('');

onMounted(async () => {
  if (authStore.isAuthenticated && authStore.user) {
    form.value.customer.name = authStore.user.name || '';
    form.value.customer.phone = authStore.user.phone || '';
    form.value.customer.email = authStore.user.email || '';

    try {
      savedAddresses.value = await fetchApi<any[]>('/customer/addresses');
      const defaultAddr = savedAddresses.value.find((a) => a.isDefault) || savedAddresses.value[0];
      if (defaultAddr) {
        applyAddressObject(defaultAddr);
      }
    } catch {}
  }
});

const applySavedAddress = (addressId: string) => {
  const addr = savedAddresses.value.find((a) => a.id === addressId);
  if (addr) {
    applyAddressObject(addr);
  }
};

const applyAddressObject = (addr: any) => {
  if (addr.recipientName) form.value.customer.name = addr.recipientName;
  if (addr.phone) form.value.customer.phone = addr.phone;
  form.value.shippingAddress.line1 = addr.line1 || '';
  form.value.shippingAddress.line2 = addr.line2 || '';
  form.value.shippingAddress.city = addr.city || '';
  form.value.shippingAddress.province = addr.province || '';
  form.value.shippingAddress.postalCode = addr.postalCode || '';
};

const clearFieldError = (field: keyof FieldErrors) => {
  delete fieldErrors.value[field];
  if (Object.keys(fieldErrors.value).length === 0) {
    error.value = '';
  }
};

const validateForm = (): boolean => {
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

const submitCheckout = async () => {
  if (!validateForm()) return;

  try {
    submitting.value = true;
    error.value = '';

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

    const res = await fetchApi<any>('/checkout', {
      method: 'POST',
      body: sanitizedPayload,
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
      error.value = 'Failed to submit checkout. Please try again.';
    }
  } finally {
    submitting.value = false;
  }
};

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
