<template>
  <main class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-28">
    <div class="max-w-xl mx-auto text-center mb-10">
      <span class="text-xs uppercase tracking-widest text-[#4A7FA7] font-semibold">Final Step</span>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold text-[#0A1931] mt-1">Order Checkout</h1>
      <p class="text-xs text-[#1A3D63] mt-2 font-light">Enter your delivery details to generate your WhatsApp order request.</p>
    </div>

    <div v-if="!cartStore.cart?.cartItems?.length" class="py-16 text-center bg-[#F6FAFD] rounded-3xl border border-[#B3CFE5]/50 shadow-xs max-w-xl mx-auto">
      <h2 class="text-xl font-serif font-bold text-[#0A1931]">Your cart is empty</h2>
      <p class="text-xs text-[#1A3D63] mt-1 mb-6 font-light">Please add items to your cart before proceeding to checkout.</p>
      <NuxtLink to="/products" class="px-6 py-3 rounded-2xl btn-primary-flat text-xs font-bold">
        Explore Catalog
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      
      <!-- Checkout Form Column -->
      <div class="lg:col-span-2 bg-[#F6FAFD] p-6 sm:p-10 rounded-3xl border border-[#B3CFE5]/50 shadow-xs space-y-8">
        
        <form @submit.prevent="submitCheckout" class="space-y-8" novalidate>
          <div v-if="error" class="p-4 bg-rose-50 text-rose-800 rounded-xl text-sm font-medium border border-rose-200">
            {{ error }}
          </div>

          <!-- Step 1: Customer Contact Information -->
          <div class="space-y-4">
            <h2 class="font-serif font-bold text-lg text-[#0A1931] pb-2 border-b border-[#B3CFE5]/40 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#0A1931] text-white text-xs flex items-center justify-center font-sans font-semibold">1</span>
              <span>Contact Information</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-[#1A3D63] uppercase tracking-wider mb-2">Full Name *</label>
                <input 
                  v-model="form.customer.name" 
                  @input="clearFieldError('name')"
                  type="text" 
                  placeholder="Dinda Pratiwi"
                  :class="[fieldErrors.name ? 'border-rose-400 focus:ring-rose-500' : 'border-[#B3CFE5]/60 focus:ring-[#28537A]']"
                  class="w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 text-[#0A1931]"
                />
                <span v-if="fieldErrors.name" class="text-rose-600 text-xs font-medium mt-1 block">
                  {{ fieldErrors.name }}
                </span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#1A3D63] uppercase tracking-wider mb-2">WhatsApp Phone Number *</label>
                <input 
                  v-model="form.customer.phone" 
                  @input="clearFieldError('phone')"
                  type="tel" 
                  placeholder="+6281234567890"
                  :class="[fieldErrors.phone ? 'border-rose-400 focus:ring-rose-500' : 'border-[#B3CFE5]/60 focus:ring-[#28537A]']"
                  class="w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 text-[#0A1931]"
                />
                <span v-if="fieldErrors.phone" class="text-rose-600 text-xs font-medium mt-1 block">
                  {{ fieldErrors.phone }}
                </span>
                <span v-else class="text-[10px] text-[#1A3D63] mt-1 block font-light">Store staff will confirm your order on this number.</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#1A3D63] uppercase tracking-wider mb-2">Email Address (Optional)</label>
              <input 
                v-model="form.customer.email" 
                @input="clearFieldError('email')"
                type="email" 
                placeholder="dinda@example.com"
                :class="[fieldErrors.email ? 'border-rose-400 focus:ring-rose-500' : 'border-[#B3CFE5]/60 focus:ring-[#28537A]']"
                class="w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 text-[#0A1931]"
              />
              <span v-if="fieldErrors.email" class="text-rose-600 text-xs font-medium mt-1 block">
                {{ fieldErrors.email }}
              </span>
            </div>
          </div>

          <!-- Step 2: Shipping Address -->
          <div class="space-y-4 pt-4 border-t border-[#B3CFE5]/40">
            <h2 class="font-serif font-bold text-lg text-[#0A1931] pb-2 border-b border-[#B3CFE5]/40 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#0A1931] text-white text-xs flex items-center justify-center font-sans font-semibold">2</span>
              <span>Shipping Address</span>
            </h2>

            <div>
              <label class="block text-xs font-semibold text-[#1A3D63] uppercase tracking-wider mb-2">Street Address *</label>
              <input 
                v-model="form.shippingAddress.line1" 
                @input="clearFieldError('line1')"
                type="text" 
                placeholder="Jl. Merdeka No. 10"
                :class="[fieldErrors.line1 ? 'border-rose-400 focus:ring-rose-500' : 'border-[#B3CFE5]/60 focus:ring-[#28537A]']"
                class="w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 text-[#0A1931]"
              />
              <span v-if="fieldErrors.line1" class="text-rose-600 text-xs font-medium mt-1 block">
                {{ fieldErrors.line1 }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-[#1A3D63] uppercase tracking-wider mb-2">City / District *</label>
                <input 
                  v-model="form.shippingAddress.city" 
                  @input="clearFieldError('city')"
                  type="text" 
                  placeholder="Medan"
                  :class="[fieldErrors.city ? 'border-rose-400 focus:ring-rose-500' : 'border-[#B3CFE5]/60 focus:ring-[#28537A]']"
                  class="w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 text-[#0A1931]"
                />
                <span v-if="fieldErrors.city" class="text-rose-600 text-xs font-medium mt-1 block">
                  {{ fieldErrors.city }}
                </span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#1A3D63] uppercase tracking-wider mb-2">Province</label>
                <input 
                  v-model="form.shippingAddress.province" 
                  type="text" 
                  placeholder="North Sumatra"
                  class="w-full px-4 py-3 rounded-xl border border-[#B3CFE5]/60 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931]"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#1A3D63] uppercase tracking-wider mb-2">Postal Code</label>
                <input 
                  v-model="form.shippingAddress.postalCode" 
                  type="text" 
                  placeholder="20111"
                  class="w-full px-4 py-3 rounded-xl border border-[#B3CFE5]/60 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931]"
                />
              </div>
            </div>
          </div>

          <!-- Step 3: Order Notes -->
          <div class="space-y-4 pt-4 border-t border-[#B3CFE5]/40">
            <label class="block text-xs font-semibold text-[#1A3D63] uppercase tracking-wider mb-2">Delivery Notes (Optional)</label>
            <textarea 
              v-model="form.notes" 
              rows="3" 
              placeholder="e.g., Please call before delivery or leave with security."
              class="w-full px-4 py-3 rounded-xl border border-[#B3CFE5]/60 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931]"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full py-4 rounded-2xl btn-primary-flat font-bold text-white text-sm disabled:opacity-50 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>💬 Send Order via WhatsApp</span>
          </button>
        </form>

      </div>

      <!-- Order Summary Column -->
      <div class="bg-[#F6FAFD] p-6 sm:p-8 rounded-3xl border border-[#B3CFE5]/50 shadow-xs space-y-6">
        <h2 class="font-serif font-bold text-xl text-[#0A1931] pb-4 border-b border-[#B3CFE5]/40">
          Order Summary ({{ cartStore.totalItems }})
        </h2>

        <div class="space-y-4 max-h-80 overflow-y-auto pr-2">
          <div 
            v-for="item in cartStore.cart?.cartItems" 
            :key="item.id"
            class="flex items-center space-x-4 text-xs"
          >
            <img 
              :src="item.variant?.product?.productImages?.[0]?.url" 
              :alt="item.variant?.product?.name"
              class="w-14 h-18 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
            />
            <div class="flex-1">
              <h4 class="font-serif font-bold text-[#0A1931] line-clamp-1">{{ item.variant?.product?.name }}</h4>
              <p class="text-[#1A3D63] mt-0.5 font-light">
                Qty: {{ item.quantity }} × Rp{{ formatPrice(item.variant?.priceOverride || item.variant?.product?.['basePrice']) }}
              </p>
              <p class="text-[#4A7FA7] text-[10px] mt-0.5">
                {{ item.variant?.size ? `Size: ${item.variant.size}` : '' }} 
                {{ item.variant?.color ? `| Color: ${item.variant.color}` : '' }}
              </p>
            </div>
            <span class="font-bold text-[#0A1931]">
              Rp{{ formatPrice((item.variant?.priceOverride || item.variant?.product?.['basePrice']) * item.quantity) }}
            </span>
          </div>
        </div>

        <div class="pt-4 border-t border-[#B3CFE5]/40 space-y-2 text-sm">
          <div class="flex justify-between text-[#1A3D63]">
            <span>Subtotal</span>
            <span class="font-semibold text-[#0A1931]">Rp{{ formatPrice(cartStore.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-[#1A3D63]">
            <span>Shipping</span>
            <span class="text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md font-medium">Arranged via WA</span>
          </div>
          <div class="flex justify-between font-bold text-base text-[#0A1931] pt-2 border-t border-[#B3CFE5]/40">
            <span>Total</span>
            <span>Rp{{ formatPrice(cartStore.subtotal) }}</span>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const router = useRouter();
const cartStore = useCartStore();
const { fetchApi } = useApi();

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

const clearFieldError = (field: keyof FieldErrors) => {
  delete fieldErrors.value[field];
  if (Object.keys(fieldErrors.value).length === 0) {
    error.value = '';
  }
};

const validateForm = (): boolean => {
  fieldErrors.value = {};
  let isValid = true;

  // 1. Full Name
  const trimmedName = form.value.customer.name.trim();
  if (!trimmedName) {
    fieldErrors.value.name = 'Please enter your full name.';
    isValid = false;
  } else if (trimmedName.length < 2) {
    fieldErrors.value.name = 'Full name must be at least 2 characters long.';
    isValid = false;
  }

  // 2. WhatsApp Phone
  const trimmedPhone = form.value.customer.phone.trim();
  const phoneRegex = /^(\+?[0-9\s\-]{8,18})$/;
  if (!trimmedPhone) {
    fieldErrors.value.phone = 'Please enter your WhatsApp phone number.';
    isValid = false;
  } else if (!phoneRegex.test(trimmedPhone)) {
    fieldErrors.value.phone = 'Please enter a valid phone number (at least 8 digits).';
    isValid = false;
  }

  // 3. Email (Optional)
  const trimmedEmail = form.value.customer.email.trim();
  if (trimmedEmail !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      fieldErrors.value.email = 'Please enter a valid email address.';
      isValid = false;
    }
  }

  // 4. Street Address
  const trimmedLine1 = form.value.shippingAddress.line1.trim();
  if (!trimmedLine1) {
    fieldErrors.value.line1 = 'Please enter your street address.';
    isValid = false;
  } else if (trimmedLine1.length < 5) {
    fieldErrors.value.line1 = 'Street address must be at least 5 characters long.';
    isValid = false;
  }

  // 5. City / District
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
    router.push(`/order/confirmation/${res.orderNumber}?autoRedirect=true`);
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
