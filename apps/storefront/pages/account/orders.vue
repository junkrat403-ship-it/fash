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

    <!-- Navigation Tabs -->
    <div class="flex items-center border-b border-[#E4D8CC] mb-8 gap-6 sm:gap-8">
      <NuxtLink
        to="/account/orders"
        class="pb-3 text-xs uppercase tracking-[0.14em] font-extrabold border-b-2 border-[#E04F26] text-[#E04F26] transition flex items-center gap-2"
      >
        <span>My Orders</span>
        <span v-if="orders.length" class="px-2 py-0.5 rounded-full bg-[#E04F26]/10 text-[#E04F26] text-[10px] font-black">
          {{ orders.length }}
        </span>
      </NuxtLink>
      <NuxtLink
        to="/account/addresses"
        class="pb-3 text-xs uppercase tracking-[0.14em] font-bold border-b-2 border-transparent text-[#1A170F]/60 hover:text-[#1A170F] transition"
      >
        Saved Addresses
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-44 bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!orders.length" class="text-center py-16 px-4 bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl">
      <div class="w-16 h-16 rounded-full bg-[#E4D8CC]/60 flex items-center justify-center mx-auto mb-4 text-[#8C8275]">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 class="font-serif font-black text-xl text-[#1A170F] mb-1">No Orders Yet</h3>
      <p class="text-xs sm:text-sm text-[#8C8275] max-w-sm mx-auto mb-6">
        When you place orders via WhatsApp checkout, they will automatically appear here with live tracking.
      </p>
      <NuxtLink
        to="/products"
        class="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#1A170F] text-[#FAF6F1] hover:bg-[#E04F26] font-bold text-xs uppercase tracking-wider transition shadow-sm"
      >
        Explore Collection →
      </NuxtLink>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-6">
      <article
        v-for="order in orders"
        :key="order.id"
        class="bg-[#FAF6F1] border border-[#E4D8CC] rounded-3xl p-6 sm:p-7 shadow-xs transition hover:border-[#1A170F]/30"
      >
        <!-- Top Row: Order Number, Date, Status Pill -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E4D8CC]/70">
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs sm:text-sm font-bold text-[#1A170F]">
              {{ order.orderNumber }}
            </span>
            <span class="text-xs text-[#8C8275]">
              {{ formatDate(order.createdAt) }}
            </span>
          </div>

          <div :class="statusStyle(order.status)" class="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border">
            {{ formatStatus(order.status) }}
          </div>
        </div>

        <!-- Middle: Items Summary -->
        <div class="py-4 space-y-3">
          <div
            v-for="item in order.orderItems"
            :key="item.id"
            class="flex items-center justify-between text-xs sm:text-sm"
          >
            <div class="flex items-center gap-2">
              <span class="font-bold text-[#1A170F]">{{ item.quantity }}x</span>
              <span class="text-[#1A170F] font-medium">{{ item.productNameSnapshot }}</span>
              <span class="text-[#8C8275] text-xs">({{ item.variantSnapshot }})</span>
            </div>
            <span class="font-bold text-[#1A170F]">
              Rp{{ item.lineTotal.toLocaleString('id-ID') }}
            </span>
          </div>
        </div>

        <!-- Bottom Row: Total & Action Buttons -->
        <div class="pt-4 border-t border-[#E4D8CC]/70 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span class="text-[11px] uppercase tracking-wider text-[#8C8275] font-bold block">Total Amount</span>
            <span class="font-serif font-black text-lg sm:text-xl text-[#1A170F]">
              Rp{{ order.total.toLocaleString('id-ID') }}
            </span>
          </div>

          <div class="flex items-center gap-2.5">
            <NuxtLink
              :to="`/order/confirmation/${order.orderNumber}`"
              class="h-9 px-4 rounded-xl border border-[#E4D8CC] bg-white text-[#1A170F] hover:bg-[#E4D8CC]/40 text-xs font-bold transition flex items-center justify-center"
            >
              Order Details
            </NuxtLink>
            <a
              :href="getWhatsAppUrl(order)"
              target="_blank"
              rel="noopener noreferrer"
              class="h-9 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Chat WA
            </a>
          </div>
        </div>
      </article>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCustomerAuthStore } from '~/stores/customerAuth';

useHead({
  title: 'My Orders — Jubi & Lee',
  meta: [
    { name: 'description', content: 'View and track your Jubi & Lee orders and WhatsApp fulfillment status.' }
  ]
});

const authStore = useCustomerAuthStore();
const { fetchApi } = useApi();

const orders = ref<any[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.initAuth();
  }

  if (!authStore.isAuthenticated) {
    await navigateTo('/login?redirect=/account/orders');
    return;
  }

  await loadOrders();
});

const loadOrders = async () => {
  try {
    isLoading.value = true;
    const response = await fetchApi<{ data: any[] }>('/customer/orders');
    orders.value = response.data || [];
  } catch {
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    pending_whatsapp: 'Pending WhatsApp',
    contacted: 'Contacted',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
};

const statusStyle = (status: string) => {
  const map: Record<string, string> = {
    pending_whatsapp: 'bg-amber-50 text-amber-800 border-amber-200',
    contacted: 'bg-blue-50 text-blue-800 border-blue-200',
    confirmed: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    processing: 'bg-purple-50 text-purple-800 border-purple-200',
    shipped: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
  };
  return map[status] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const getWhatsAppUrl = (order: any) => {
  const storePhone = '6281234567890';
  const text = order.whatsappMessage || `Halo Jubi & Lee, saya ingin cek status pesanan ${order.orderNumber}.`;
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
};
</script>
