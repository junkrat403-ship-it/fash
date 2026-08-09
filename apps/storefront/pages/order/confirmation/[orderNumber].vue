<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    
    <div v-if="loading" class="animate-pulse py-20 text-center text-slate-400">
      Loading order confirmation details...
    </div>

    <div v-else-if="!order" class="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
      <h1 class="font-serif text-2xl font-bold text-slate-900">Order Not Found</h1>
      <p class="text-xs text-slate-500 mt-2 mb-6">We couldn't locate details for this order reference.</p>
      <NuxtLink to="/products" class="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold">
        Return to Catalog
      </NuxtLink>
    </div>

    <div v-else class="space-y-8">
      
      <!-- Top Success Banner -->
      <div class="bg-emerald-900 text-white p-8 sm:p-10 rounded-3xl text-center space-y-4 shadow-xl">
        <div class="w-16 h-16 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center mx-auto text-white">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span class="inline-block text-xs uppercase tracking-[0.25em] font-semibold text-emerald-300">
          Order Created Successfully
        </span>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
          {{ order.orderNumber }}
        </h1>
        <p class="text-xs sm:text-sm text-emerald-200 max-w-md mx-auto leading-relaxed">
          Your order has been recorded. Finalize payment and delivery details directly with our store specialist over WhatsApp.
        </p>

        <!-- Primary WhatsApp Action Button -->
        <div class="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <a 
            :href="order.whatsappRedirectUrl" 
            target="_blank"
            class="px-8 py-4 rounded-xl bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>Open WhatsApp Chat</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <button 
            @click="copyMessageText"
            class="px-6 py-4 rounded-xl border border-emerald-700 bg-emerald-800/60 hover:bg-emerald-800 text-white font-medium text-sm transition flex items-center justify-center gap-2"
          >
            <span>{{ copied ? '✓ Message Copied!' : 'Copy Order Text' }}</span>
          </button>
        </div>
      </div>

      <!-- Fallback Instructions Alert -->
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
        <span class="text-lg">💡</span>
        <div>
          <span class="font-bold text-amber-950 block mb-0.5">Did WhatsApp fail to open automatically?</span>
          If your browser blocked the popup, click the <strong>"Open WhatsApp Chat"</strong> button above, or click <strong>"Copy Order Text"</strong> and paste it directly into your WhatsApp message to <strong>+62 812 3456 7890</strong>.
        </div>
      </div>

      <!-- Order Details Recap Card -->
      <div class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-2">
          <div>
            <h2 class="font-serif font-bold text-xl text-slate-900">Order Summary Details</h2>
            <p class="text-xs text-slate-500 mt-1">Placed on {{ formatDate(order.createdAt) }}</p>
          </div>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            Status: Pending WhatsApp Confirmation
          </span>
        </div>

        <!-- Customer & Delivery Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1">
            <h3 class="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Customer Details</h3>
            <p><span class="text-slate-400">Name:</span> <strong>{{ order.customerName }}</strong></p>
            <p><span class="text-slate-400">Phone:</span> {{ order.customerPhone }}</p>
            <p v-if="order.customerEmail"><span class="text-slate-400">Email:</span> {{ order.customerEmail }}</p>
          </div>

          <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1">
            <h3 class="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Shipping Address</h3>
            <p class="font-medium text-slate-900">{{ order.shippingAddress?.line1 }}</p>
            <p v-if="order.shippingAddress?.line2">{{ order.shippingAddress?.line2 }}</p>
            <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.province }} {{ order.shippingAddress?.postalCode }}</p>
            <p class="text-slate-400 mt-1" v-if="order.notes">Notes: "{{ order.notes }}"</p>
          </div>
        </div>

        <!-- Line Items Table -->
        <div>
          <h3 class="font-serif font-bold text-base text-slate-900 mb-4">Ordered Items</h3>
          <div class="space-y-3">
            <div 
              v-for="item in order.orderItems" 
              :key="item.id"
              class="flex justify-between items-center py-3 border-b border-slate-100 text-xs"
            >
              <div>
                <h4 class="font-bold text-slate-900">{{ item.productNameSnapshot }}</h4>
                <p class="text-slate-500 text-[11px] mt-0.5">
                  {{ item.variantSnapshot }} | SKU: {{ item.skuSnapshot }} | Qty: {{ item.quantity }}
                </p>
              </div>
              <span class="font-bold text-slate-900">
                Rp{{ formatPrice(item.lineTotal) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Total -->
        <div class="pt-4 border-t border-slate-200 flex justify-between items-center text-lg font-bold text-slate-900">
          <span>Total Order Price</span>
          <span class="text-xl">Rp{{ formatPrice(order.total) }}</span>
        </div>

        <!-- Copyable Formatted WhatsApp Message Preview Box -->
        <div>
          <h3 class="font-semibold text-xs text-slate-700 uppercase tracking-wider mb-2">Formatted Message Sent to Store</h3>
          <pre class="bg-slate-900 text-emerald-400 p-5 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 overflow-x-auto">{{ order.whatsappMessage }}</pre>
        </div>

      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { fetchApi } = useApi();

const orderNumber = route.params.orderNumber as string;
const autoRedirect = route.query.autoRedirect === 'true';

const order = ref<any>(null);
const loading = ref(true);
const copied = ref(false);

const copyMessageText = async () => {
  if (!order.value?.whatsappMessage) return;
  try {
    await navigator.clipboard.writeText(order.value.whatsappMessage);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } catch (e) {
    console.error('Clipboard copy failed', e);
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    const data = await fetchApi<any>(`/orders/${orderNumber}/confirmation`);
    order.value = data;

    // Auto redirect to WhatsApp deep link if autoRedirect parameter is present
    if (autoRedirect && data?.whatsappRedirectUrl) {
      setTimeout(() => {
        window.location.href = data.whatsappRedirectUrl;
      }, 800);
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
const formatDate = (val: any) => new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
</script>
