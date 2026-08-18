<template>
  <main class="w-full flex-1 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    
    <!-- Account Header Banner -->
    <div class="bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-[#1A170F] text-[#FAF6F1] flex items-center justify-center font-serif font-black text-xl shadow-xs">
          {{ authStore.userInitials }}
        </div>
        <div>
          <h1 class="font-serif font-black text-xl sm:text-2xl text-[#1A170F] leading-tight">
            {{ authStore.user?.name || 'My Account' }}
          </h1>
          <p class="text-xs sm:text-sm text-[#8C8275] font-medium mt-0.5">
            {{ authStore.user?.email || authStore.user?.phone }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button
          @click="authStore.logout()"
          class="flex-1 sm:flex-initial h-10 px-5 rounded-xl border border-[#E4D8CC] bg-white text-[#1A170F] hover:bg-[#FBEAE5] hover:text-[#E04F26] hover:border-[#E04F26]/40 text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>

    <!-- Navigation Tabs & Add Button -->
    <div class="flex items-center justify-between border-b border-[#E4D8CC] mb-8 pb-3">
      <div class="flex items-center gap-6 sm:gap-8">
        <NuxtLink
          to="/account/orders"
          class="text-xs uppercase tracking-[0.14em] font-bold text-[#1A170F]/60 hover:text-[#1A170F] transition"
        >
          My Orders
        </NuxtLink>
        <NuxtLink
          to="/account/addresses"
          class="text-xs uppercase tracking-[0.14em] font-extrabold text-[#E04F26] transition flex items-center gap-2"
        >
          <span>Saved Addresses</span>
          <span v-if="addresses.length" class="px-2 py-0.5 rounded-full bg-[#E04F26]/10 text-[#E04F26] text-[10px] font-black">
            {{ addresses.length }}
          </span>
        </NuxtLink>
      </div>

      <button
        @click="showAddModal = true"
        class="h-9 px-4 rounded-xl bg-[#1A170F] text-[#FAF6F1] hover:bg-[#E04F26] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Address
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="h-44 bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!addresses.length" class="text-center py-16 px-4 bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl">
      <div class="w-16 h-16 rounded-full bg-[#E4D8CC]/60 flex items-center justify-center mx-auto mb-4 text-[#8C8275]">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 class="font-serif font-black text-xl text-[#1A170F] mb-1">No Saved Addresses</h3>
      <p class="text-xs sm:text-sm text-[#8C8275] max-w-sm mx-auto mb-6">
        Save your delivery destinations for quick one-click autofill during checkout.
      </p>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#1A170F] text-[#FAF6F1] hover:bg-[#E04F26] font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
      >
        Add Address Now →
      </button>
    </div>

    <!-- Addresses Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <article
        v-for="addr in addresses"
        :key="addr.id"
        class="bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl p-6 shadow-xs flex flex-col justify-between relative hover:border-[#1A170F]/30 transition"
      >
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-lg bg-[#E4D8CC]/60 text-[#1A170F] text-[11px] font-extrabold uppercase tracking-wider">
              {{ addr.label || 'Delivery Address' }}
            </span>
            <span v-if="addr.isDefault" class="px-2.5 py-1 rounded-lg bg-[#E04F26]/10 text-[#E04F26] text-[11px] font-bold uppercase tracking-wider">
              Default
            </span>
          </div>

          <h4 class="font-bold text-[#1A170F] text-sm sm:text-base mb-1">
            {{ addr.recipientName }}
          </h4>
          <p class="text-xs text-[#8C8275] font-medium mb-3">
            {{ addr.phone }}
          </p>

          <p class="text-xs sm:text-sm text-[#1A170F]/80 leading-relaxed">
            {{ addr.line1 }}<span v-if="addr.line2">, {{ addr.line2 }}</span><br />
            {{ addr.city }}<span v-if="addr.province">, {{ addr.province }}</span> {{ addr.postalCode }}<br />
            {{ addr.country || 'Indonesia' }}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-[#E4D8CC]/70 flex items-center justify-end">
          <button
            @click="handleDelete(addr.id)"
            class="text-xs font-bold text-[#E04F26] hover:underline cursor-pointer flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
      </article>
    </div>

    <!-- Add Address Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6 pb-3 border-b border-[#E4D8CC]">
          <h3 class="font-serif font-bold text-xl text-[#1A170F]">Add Delivery Address</h3>
          <button @click="showAddModal = false" class="text-[#8C8275] hover:text-[#1A170F] p-1 font-bold">✕</button>
        </div>

        <form @submit.prevent="handleCreateAddress" class="space-y-4">
          <div>
            <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1" for="label">
              Label (e.g. Home, Office, Studio)
            </label>
            <input
              id="label"
              v-model="newForm.label"
              type="text"
              placeholder="Home"
              class="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] text-xs sm:text-sm focus:outline-none focus:border-[#E04F26]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1" for="recipientName">
                Recipient Name
              </label>
              <input
                id="recipientName"
                v-model="newForm.recipientName"
                type="text"
                required
                placeholder="Full Name"
                class="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] text-xs sm:text-sm focus:outline-none focus:border-[#E04F26]"
              />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1" for="newPhone">
                Recipient Phone
              </label>
              <input
                id="newPhone"
                v-model="newForm.phone"
                type="tel"
                required
                placeholder="081234567890"
                class="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] text-xs sm:text-sm focus:outline-none focus:border-[#E04F26]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1" for="line1">
              Street Address
            </label>
            <input
              id="line1"
              v-model="newForm.line1"
              type="text"
              required
              placeholder="Jl. Thamrin No. 10"
              class="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] text-xs sm:text-sm focus:outline-none focus:border-[#E04F26]"
            />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1" for="line2">
              Apartment / Unit / Landmark (Optional)
            </label>
            <input
              id="line2"
              v-model="newForm.line2"
              type="text"
              placeholder="Tower A, Unit 12B"
              class="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] text-xs sm:text-sm focus:outline-none focus:border-[#E04F26]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1" for="city">
                City
              </label>
              <input
                id="city"
                v-model="newForm.city"
                type="text"
                required
                placeholder="Jakarta Selatan"
                class="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] text-xs sm:text-sm focus:outline-none focus:border-[#E04F26]"
              />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1" for="province">
                Province
              </label>
              <input
                id="province"
                v-model="newForm.province"
                type="text"
                placeholder="DKI Jakarta"
                class="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] text-xs sm:text-sm focus:outline-none focus:border-[#E04F26]"
              />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider font-extrabold text-[#1A170F]/70 mb-1" for="postalCode">
                Postal Code
              </label>
              <input
                id="postalCode"
                v-model="newForm.postalCode"
                type="text"
                placeholder="12190"
                class="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E4D8CC] text-[#1A170F] text-xs sm:text-sm focus:outline-none focus:border-[#E04F26]"
              />
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input
              id="isDefault"
              v-model="newForm.isDefault"
              type="checkbox"
              class="w-4 h-4 rounded text-[#E04F26] focus:ring-[#E04F26]"
            />
            <label for="isDefault" class="text-xs text-[#1A170F] font-bold cursor-pointer">
              Set as default shipping address
            </label>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-[#E4D8CC]">
            <button
              type="button"
              @click="showAddModal = false"
              class="h-10 px-4 rounded-xl text-xs font-bold text-[#8C8275] hover:text-[#1A170F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="h-10 px-5 rounded-xl bg-[#1A170F] text-[#FAF6F1] hover:bg-[#E04F26] text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Address' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCustomerAuthStore } from '~/stores/customerAuth';

useHead({
  title: 'Saved Addresses — Jubi & Lee',
  meta: [
    { name: 'description', content: 'Manage your saved delivery destinations for quick checkout.' }
  ]
});

const authStore = useCustomerAuthStore();
const { fetchApi } = useApi();

const addresses = ref<any[]>([]);
const isLoading = ref(true);
const showAddModal = ref(false);
const isSubmitting = ref(false);

const newForm = ref({
  label: 'Home',
  recipientName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  province: '',
  postalCode: '',
  isDefault: false,
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.initAuth();
  }

  if (!authStore.isAuthenticated) {
    await navigateTo('/login?redirect=/account/addresses');
    return;
  }

  if (authStore.user) {
    newForm.value.recipientName = authStore.user.name || '';
    newForm.value.phone = authStore.user.phone || '';
  }

  await loadAddresses();
});

const loadAddresses = async () => {
  try {
    isLoading.value = true;
    addresses.value = await fetchApi<any[]>('/customer/addresses');
  } catch {
    addresses.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleCreateAddress = async () => {
  try {
    isSubmitting.value = true;
    await fetchApi('/customer/addresses', {
      method: 'POST',
      body: newForm.value,
    });
    showAddModal.value = false;
    newForm.value = {
      label: 'Home',
      recipientName: authStore.user?.name || '',
      phone: authStore.user?.phone || '',
      line1: '',
      line2: '',
      city: '',
      province: '',
      postalCode: '',
      isDefault: false,
    };
    await loadAddresses();
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to save address');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to remove this saved address?')) return;
  try {
    await fetchApi(`/customer/addresses/${id}`, {
      method: 'DELETE',
    });
    await loadAddresses();
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to delete address');
  }
};
</script>
