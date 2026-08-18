<template>
  <main class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-28">
    <div class="max-w-xl mx-auto text-center mb-10">
      <span class="text-xs uppercase tracking-widest text-[#E04F26] font-bold">Final Step</span>
      <h1 class="font-serif text-3xl sm:text-4xl font-black text-[#1A170F] mt-1 tracking-tight">Order Checkout</h1>
      <p class="text-xs text-[#8C8275] mt-2 font-medium">Select your delivery destination and submit your WhatsApp order request.</p>
    </div>

    <!-- Empty Cart Fallback -->
    <div v-if="!cartStore.cart?.cartItems?.length" class="py-16 text-center bg-[#FAF6F1] rounded-3xl border border-[#E4D8CC] shadow-xs max-w-xl mx-auto">
      <h2 class="text-xl font-serif font-black text-[#1A170F]">Your cart is empty</h2>
      <p class="text-xs text-[#8C8275] mt-1 mb-6 font-medium">Please add items to your cart before proceeding to checkout.</p>
      <NuxtLink to="/products" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#1A170F] text-[#FAF6F1] hover:bg-[#E04F26] text-xs uppercase tracking-wider font-bold transition shadow-sm">
        Explore Collection →
      </NuxtLink>
    </div>

    <!-- Active Checkout Flow -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

      <div class="lg:col-span-2 bg-[#FAF6F1] p-6 sm:p-10 rounded-3xl border border-[#E4D8CC] shadow-xs space-y-8">
        
        <!-- Logged-in Customer Banner -->
        <div class="p-4 rounded-2xl bg-white border border-[#E4D8CC] flex items-center justify-between gap-4 shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#1A170F] text-[#FAF6F1] flex items-center justify-center font-serif font-bold text-xs shrink-0">
              {{ authStore.userInitials }}
            </div>
            <div>
              <p class="text-xs font-bold text-[#1A170F]">Logged in as {{ authStore.user?.name }}</p>
              <p class="text-[11px] text-[#8C8275]">{{ authStore.user?.email || authStore.user?.phone }}</p>
            </div>
          </div>
          <NuxtLink to="/account/addresses" class="text-[11px] font-bold text-[#E04F26] hover:underline">
            Manage Saved Addresses →
          </NuxtLink>
        </div>

        <form @submit.prevent="submitCheckout" class="space-y-8" novalidate>
          <div v-if="error" class="p-4 bg-[#FBEAE5] text-[#E04F26] rounded-2xl text-xs font-bold border border-[#E04F26]/30 flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Section: Delivery Address Selection -->
          <div class="space-y-5">
            <div class="flex items-center justify-between pb-2 border-b border-[#E4D8CC]">
              <h2 class="font-serif font-black text-lg text-[#1A170F] flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-full bg-[#1A170F] text-[#FAF6F1] text-xs flex items-center justify-center font-sans font-bold">1</span>
                <span>Delivery Address</span>
              </h2>
            </div>

            <!-- Loading Skeleton for Addresses -->
            <div v-if="isLoadingAddresses" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="i in 2" :key="i" class="h-36 bg-white/70 border border-[#E4D8CC] rounded-2xl animate-pulse"></div>
            </div>

            <!-- Case A: Saved Addresses Exist -->
            <div v-else-if="savedAddresses.length > 0" class="space-y-4">
              <p class="text-xs font-bold uppercase tracking-wider text-[#1A170F]/70">
                Select a saved address for this order:
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Address Card -->
                <div
                  v-for="addr in savedAddresses"
                  :key="addr.id"
                  @click="selectedAddressId = addr.id"
                  :class="[
                    selectedAddressId === addr.id
                      ? 'border-2 border-[#1A170F] bg-white ring-2 ring-[#1A170F]/10 shadow-sm'
                      : 'border border-[#E4D8CC] bg-[#FAF6F1] hover:border-[#1A170F]/40'
                  ]"
                  class="p-5 rounded-2xl transition cursor-pointer flex flex-col justify-between relative"
                >
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="px-2.5 py-0.5 rounded-lg bg-[#E4D8CC]/60 text-[#1A170F] text-[10px] font-extrabold uppercase tracking-wider">
                        {{ addr.label || 'Delivery Address' }}
                      </span>
                      <div class="flex items-center gap-1.5">
                        <span v-if="addr.isDefault" class="px-2 py-0.5 rounded-md bg-[#E04F26]/10 text-[#E04F26] text-[10px] font-bold uppercase tracking-wider">
                          Default
                        </span>
                        <div 
                          :class="[
                            selectedAddressId === addr.id
                              ? 'bg-[#1A170F] border-[#1A170F] text-white'
                              : 'bg-white border-[#E4D8CC] text-transparent'
                          ]"
                          class="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-black transition"
                        >
                          ✓
                        </div>
                      </div>
                    </div>

                    <h4 class="font-bold text-[#1A170F] text-sm mb-0.5">
                      {{ addr.recipientName }}
                    </h4>
                    <p class="text-xs text-[#8C8275] font-medium mb-2.5">
                      {{ addr.phone }}
                    </p>

                    <p class="text-xs text-[#1A170F]/80 leading-relaxed">
                      {{ addr.line1 }}<span v-if="addr.line2">, {{ addr.line2 }}</span><br />
                      {{ addr.city }}<span v-if="addr.province">, {{ addr.province }}</span> {{ addr.postalCode }}<br />
                      {{ addr.country || 'Indonesia' }}
                    </p>
                  </div>
                </div>

                <!-- "+ Add New Address" Card -->
                <div
                  @click="selectedAddressId = 'new'"
                  :class="[
                    selectedAddressId === 'new'
                      ? 'border-2 border-[#1A170F] bg-white ring-2 ring-[#1A170F]/10 shadow-sm'
                      : 'border-2 border-dashed border-[#E4D8CC] bg-white/50 hover:bg-white hover:border-[#1A170F]/40'
                  ]"
                  class="p-5 rounded-2xl transition cursor-pointer flex flex-col items-center justify-center text-center min-h-[150px]"
                >
                  <div class="w-9 h-9 rounded-full bg-[#E4D8CC]/60 text-[#1A170F] flex items-center justify-center mb-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span class="font-bold text-xs text-[#1A170F] uppercase tracking-wider">+ Add New Address</span>
                  <span class="text-[11px] text-[#8C8275] mt-0.5">Ship to a different destination</span>
                </div>
              </div>
            </div>

            <!-- Case B: Manual Entry Form (Shown if '+ Add New Address' is selected OR user has 0 saved addresses) -->
            <div v-if="selectedAddressId === 'new' || (!isLoadingAddresses && savedAddresses.length === 0)" class="space-y-4 pt-2">
              <div v-if="savedAddresses.length > 0" class="flex items-center justify-between pb-2 border-b border-[#E4D8CC]/70">
                <span class="text-xs font-bold uppercase tracking-wider text-[#1A170F]">Enter New Destination Details:</span>
                <button
                  type="button"
                  @click="selectedAddressId = defaultAddressId"
                  class="text-xs font-bold text-[#E04F26] hover:underline"
                >
                  ← Use Saved Address
                </button>
              </div>
              <p v-else class="text-xs font-bold uppercase tracking-wider text-[#1A170F]/70">
                Enter your delivery destination:
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Recipient Name *</label>
                  <input 
                    v-model="newAddressForm.recipientName" 
                    @input="clearFieldError('recipientName')"
                    type="text" 
                    placeholder="Dinda Pratiwi"
                    :class="[fieldErrors.recipientName ? 'border-[#E04F26] ring-1 ring-[#E04F26]' : 'border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26]']"
                    class="w-full h-11 px-4 rounded-xl border text-sm bg-white focus:outline-none text-[#1A170F] transition"
                  />
                  <span v-if="fieldErrors.recipientName" class="text-[#E04F26] text-xs font-bold mt-1 block">
                    {{ fieldErrors.recipientName }}
                  </span>
                </div>

                <div>
                  <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">WhatsApp Phone *</label>
                  <input 
                    v-model="newAddressForm.phone" 
                    @input="clearFieldError('phone')"
                    type="tel" 
                    placeholder="081234567890"
                    :class="[fieldErrors.phone ? 'border-[#E04F26] ring-1 ring-[#E04F26]' : 'border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26]']"
                    class="w-full h-11 px-4 rounded-xl border text-sm bg-white focus:outline-none text-[#1A170F] transition"
                  />
                  <span v-if="fieldErrors.phone" class="text-[#E04F26] text-xs font-bold mt-1 block">
                    {{ fieldErrors.phone }}
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Street Address *</label>
                <input 
                  v-model="newAddressForm.line1" 
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
                  v-model="newAddressForm.line2" 
                  type="text" 
                  placeholder="Apartemen Senopati, Tower 2 Lt. 12"
                  class="w-full h-11 px-4 rounded-xl border border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] text-sm bg-white focus:outline-none text-[#1A170F] transition"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">City / District *</label>
                  <input 
                    v-model="newAddressForm.city" 
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
                    v-model="newAddressForm.province" 
                    type="text" 
                    placeholder="DKI Jakarta"
                    class="w-full h-11 px-4 rounded-xl border border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] text-sm bg-white focus:outline-none text-[#1A170F] transition"
                  />
                </div>

                <div>
                  <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1.5">Postal Code</label>
                  <input 
                    v-model="newAddressForm.postalCode" 
                    type="text" 
                    placeholder="12190"
                    class="w-full h-11 px-4 rounded-xl border border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] text-sm bg-white focus:outline-none text-[#1A170F] transition"
                  />
                </div>
              </div>

              <!-- Option to save new address to account -->
              <div class="flex items-center gap-2 pt-2">
                <input
                  id="saveNewAddress"
                  v-model="saveNewAddress"
                  type="checkbox"
                  class="w-4 h-4 rounded text-[#E04F26] focus:ring-[#E04F26]"
                />
                <label for="saveNewAddress" class="text-xs text-[#1A170F] font-bold cursor-pointer">
                  Save this address to my account for future orders
                </label>
              </div>
            </div>
          </div>

          <!-- Section: Order Notes -->
          <div class="space-y-4 pt-4 border-t border-[#E4D8CC]">
            <h2 class="font-serif font-black text-lg text-[#1A170F] pb-2 border-b border-[#E4D8CC] flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-full bg-[#1A170F] text-[#FAF6F1] text-xs flex items-center justify-center font-sans font-bold">2</span>
              <span>Order Notes (Optional)</span>
            </h2>

            <div>
              <textarea 
                v-model="notes" 
                rows="2"
                placeholder="Special delivery instructions, packaging notes, or delivery timing preferences..."
                class="w-full p-4 rounded-xl border border-[#E4D8CC] focus:border-[#E04F26] focus:ring-1 focus:ring-[#E04F26] text-sm bg-white focus:outline-none text-[#1A170F] transition resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Submit WhatsApp Checkout -->
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

const savedAddresses = ref<any[]>([]);
const defaultAddressId = ref<string>('');
const selectedAddressId = ref<string>('new');
const isLoadingAddresses = ref<boolean>(true);
const saveNewAddress = ref<boolean>(true);
const notes = ref<string>('');

const newAddressForm = ref({
  recipientName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Indonesia',
});

interface FieldErrors {
  recipientName?: string;
  phone?: string;
  line1?: string;
  city?: string;
}

const fieldErrors = ref<FieldErrors>({});
const submitting = ref(false);
const error = ref('');

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.initAuth();
  }

  if (!authStore.isAuthenticated) {
    await navigateTo('/login?redirect=/checkout');
    return;
  }

  if (authStore.user) {
    newAddressForm.value.recipientName = authStore.user.name || '';
    newAddressForm.value.phone = authStore.user.phone || '';
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
  } catch (err) {
    savedAddresses.value = [];
    selectedAddressId.value = 'new';
  } finally {
    isLoadingAddresses.value = false;
  }
};

const clearFieldError = (field: keyof FieldErrors) => {
  delete fieldErrors.value[field];
  if (Object.keys(fieldErrors.value).length === 0) {
    error.value = '';
  }
};

const validateNewAddressForm = (): boolean => {
  fieldErrors.value = {};
  let isValid = true;

  const trimmedName = newAddressForm.value.recipientName.trim();
  if (!trimmedName) {
    fieldErrors.value.recipientName = 'Please enter recipient name.';
    isValid = false;
  } else if (trimmedName.length < 2) {
    fieldErrors.value.recipientName = 'Name must be at least 2 characters long.';
    isValid = false;
  }

  const trimmedPhone = newAddressForm.value.phone.trim();
  const phoneRegex = /^(\+?[0-9\s\-]{8,18})$/;
  if (!trimmedPhone) {
    fieldErrors.value.phone = 'Please enter WhatsApp phone number.';
    isValid = false;
  } else if (!phoneRegex.test(trimmedPhone)) {
    fieldErrors.value.phone = 'Please enter a valid phone number (at least 8 digits).';
    isValid = false;
  }

  const trimmedLine1 = newAddressForm.value.line1.trim();
  if (!trimmedLine1) {
    fieldErrors.value.line1 = 'Please enter street address.';
    isValid = false;
  } else if (trimmedLine1.length < 5) {
    fieldErrors.value.line1 = 'Street address must be at least 5 characters long.';
    isValid = false;
  }

  const trimmedCity = newAddressForm.value.city.trim();
  if (!trimmedCity) {
    fieldErrors.value.city = 'Please enter city or district.';
    isValid = false;
  } else if (trimmedCity.length < 2) {
    fieldErrors.value.city = 'City must be at least 2 characters long.';
    isValid = false;
  }

  if (!isValid) {
    error.value = 'Please fill out all required address fields below.';
  }

  return isValid;
};

const submitCheckout = async () => {
  try {
    submitting.value = true;
    error.value = '';

    let recipientName = '';
    let phone = '';
    let email = authStore.user?.email || undefined;
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
      if (!validateNewAddressForm()) {
        submitting.value = false;
        return;
      }
      recipientName = newAddressForm.value.recipientName.trim();
      phone = newAddressForm.value.phone.trim();
      line1 = newAddressForm.value.line1.trim();
      line2 = newAddressForm.value.line2?.trim() || undefined;
      city = newAddressForm.value.city.trim();
      province = newAddressForm.value.province?.trim() || undefined;
      postalCode = newAddressForm.value.postalCode?.trim() || undefined;

      if (saveNewAddress.value) {
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
      notes: notes.value?.trim() || undefined,
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
      error.value = 'Failed to submit checkout. Please try again.';
    }
  } finally {
    submitting.value = false;
  }
};

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
