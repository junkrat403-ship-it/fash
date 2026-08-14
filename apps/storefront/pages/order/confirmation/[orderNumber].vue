<template>
  <main class="bg-[#F4ECE5] min-h-screen text-[#1A170F] py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      
      <div v-if="loading" class="animate-pulse py-20 text-center space-y-4">
        <div class="h-8 bg-[#E4D8CC] w-48 mx-auto rounded-xl"></div>
        <div class="h-4 bg-[#E4D8CC] w-64 mx-auto rounded-lg"></div>
      </div>

      <div v-else-if="!order" class="py-16 px-6 text-center bg-[#FAF6F1] rounded-3xl border border-[#E4D8CC] shadow-md space-y-4">
        <div class="w-16 h-16 rounded-full bg-[#1A170F]/5 border border-[#1A170F]/15 flex items-center justify-center mx-auto text-[#1A170F]/60">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="font-serif text-2xl font-bold text-[#1A170F]">Order Not Found</h1>
        <p class="text-xs text-[#1A170F]/70 max-w-sm mx-auto leading-relaxed">
          We couldn't locate details for this order reference. Please check your order number or contact support.
        </p>
        <div class="pt-2">
          <NuxtLink 
            to="/products" 
            class="px-6 py-3 rounded-2xl bg-[#E04F26] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#C8431E] transition shadow-md inline-block"
          >
            Return to Catalog
          </NuxtLink>
        </div>
      </div>

      <div v-else class="space-y-6 sm:space-y-8">

        <div class="bg-[#1A170F] text-[#F4ECE5] p-6 sm:p-10 rounded-3xl text-center space-y-4 shadow-xl border border-[#1A170F]/90 relative overflow-hidden">
          <div class="w-16 h-16 rounded-full bg-[#E04F26]/20 border border-[#E04F26]/40 flex items-center justify-center mx-auto text-[#E04F26]">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <span class="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] font-extrabold text-[#E04F26] bg-[#E04F26]/10 px-3 py-1 rounded-full border border-[#E04F26]/30 mb-2">
              ORDER CREATED SUCCESSFULLY
            </span>
            <h1 class="font-serif text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
              Order #{{ order.orderNumber }}
            </h1>
          </div>

          <p class="text-xs sm:text-sm text-[#F4ECE5]/80 max-w-md mx-auto leading-relaxed font-light">
            Your order has been recorded. Finalize payment and delivery details directly with our store specialist over WhatsApp.
          </p>

          <div class="pt-4 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <a 
              :href="order.whatsappRedirectUrl" 
              target="_blank"
              class="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#E04F26] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#C8431E] transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>Open WhatsApp Chat</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            <button 
              type="button"
              @click="copyMessageText"
              class="px-6 sm:px-8 py-3.5 rounded-2xl border border-[#F4ECE5]/30 bg-[#F4ECE5]/10 hover:bg-[#F4ECE5]/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{{ copied ? '✓ Message Copied!' : 'Copy Order Text' }}</span>
            </button>
          </div>
        </div>

        <div class="bg-[#FAF6F1] border border-[#E4D8CC] rounded-2xl p-4 sm:p-6 text-[#1A170F] text-xs leading-relaxed flex items-start gap-3.5 shadow-xs">
          <span class="text-xl shrink-0 mt-0.5">💡</span>
          <div class="space-y-1">
            <span class="font-extrabold text-[#1A170F] block">Did WhatsApp fail to open automatically?</span>
            <p class="text-[#1A170F]/80">
              If your browser blocked the popup, click the <strong class="text-[#E04F26]">"Open WhatsApp Chat"</strong> button above, or click <strong class="text-[#1A170F]">"Copy Order Text"</strong> and paste it directly into your WhatsApp message to our store number <strong class="text-[#1A170F]">+62 812 3456 7890</strong>.
            </p>
          </div>
        </div>

        <div class="bg-[#FAF6F1] p-6 sm:p-10 rounded-3xl border border-[#E4D8CC] shadow-sm space-y-6 sm:space-y-8">
          
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E4D8CC] gap-3">
            <div>
              <h2 class="font-serif font-bold text-xl text-[#1A170F]">Order Summary Details</h2>
              <p class="text-xs text-[#1A170F]/60 mt-0.5">Placed on {{ formatDate(order.createdAt) }}</p>
            </div>
            <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E04F26]/10 text-[#E04F26] border border-[#E04F26]/30 uppercase tracking-wider">
              Pending WhatsApp Confirmation
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#1A170F]">
            <div class="bg-[#F4ECE5] p-5 rounded-2xl border border-[#E4D8CC] space-y-1.5">
              <h3 class="font-extrabold text-[#1A170F] uppercase tracking-wider text-[11px] mb-2 text-[#E04F26]">Customer Details</h3>
              <p><span class="text-[#1A170F]/60">Name:</span> <strong class="text-[#1A170F]">{{ order.customerName }}</strong></p>
              <p><span class="text-[#1A170F]/60">Phone:</span> <strong class="text-[#1A170F]">{{ order.customerPhone }}</strong></p>
              <p v-if="order.customerEmail"><span class="text-[#1A170F]/60">Email:</span> {{ order.customerEmail }}</p>
            </div>

            <div class="bg-[#F4ECE5] p-5 rounded-2xl border border-[#E4D8CC] space-y-1.5">
              <h3 class="font-extrabold text-[#1A170F] uppercase tracking-wider text-[11px] mb-2 text-[#E04F26]">Shipping Address</h3>
              <p class="font-bold text-[#1A170F]">{{ order.shippingAddress?.line1 }}</p>
              <p v-if="order.shippingAddress?.line2">{{ order.shippingAddress?.line2 }}</p>
              <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.province }} {{ order.shippingAddress?.postalCode }}</p>
              <p class="text-[#1A170F]/70 italic mt-1" v-if="order.notes">Notes: "{{ order.notes }}"</p>
            </div>
          </div>

          <div>
            <h3 class="font-serif font-bold text-base text-[#1A170F] mb-4">Ordered Items</h3>
            <div class="divide-y divide-[#E4D8CC]">
              <div 
                v-for="item in order.orderItems" 
                :key="item.id"
                class="py-3.5 flex justify-between items-center gap-4 text-xs"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-12 h-14 rounded-xl overflow-hidden bg-[#F4ECE5] border border-[#E4D8CC] shrink-0">
                    <img 
                      :src="item.productImage || 'https://via.placeholder.com/100x120'" 
                      :alt="item.productNameSnapshot" 
                      loading="lazy"
                      decoding="async"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="min-w-0">
                    <h4 class="font-bold text-[#1A170F] truncate">{{ item.productNameSnapshot }}</h4>
                    <p class="text-[#1A170F]/60 text-[11px] mt-0.5">
                      {{ item.variantSnapshot }} | SKU: {{ item.skuSnapshot }}
                    </p>
                    <p class="text-[#1A170F]/80 text-[11px] mt-0.5">
                      Qty: {{ item.quantity }} × Rp{{ formatPrice(item.unitPriceSnapshot) }}
                    </p>
                  </div>
                </div>

                <span class="font-extrabold text-[#1A170F] text-sm shrink-0">
                  Rp{{ formatPrice(item.lineTotal) }}
                </span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-[#E4D8CC] flex justify-between items-center text-lg font-bold text-[#1A170F]">
            <span>Total Order Price</span>
            <span class="text-xl text-[#E04F26] font-black">Rp{{ formatPrice(order.total) }}</span>
          </div>

          <div class="space-y-2">
            <h3 class="font-extrabold text-xs text-[#1A170F] uppercase tracking-wider">Formatted Message Sent to Store</h3>
            <pre class="bg-[#1A170F] text-[#F4ECE5] p-4 sm:p-5 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-[#1A170F] overflow-x-auto shadow-inner">{{ order.whatsappMessage }}</pre>
          </div>

        </div>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { fetchApi } = useApi();

const orderNumber = route.params.orderNumber as string;
const autoRedirect = route.query.autoRedirect === 'true';

const order = ref<any>(null);
const loading = ref(true);
const copied = ref(false);

useSeoMeta({
  title: computed(() => order.value ? `Order #${order.value.orderNumber} Confirmation - Jubi & Lee Studio` : 'Order Confirmation - Jubi & Lee Studio'),
  description: 'View your Jubi & Lee Studio order confirmation details and connect directly with our store team via WhatsApp.'
});

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
