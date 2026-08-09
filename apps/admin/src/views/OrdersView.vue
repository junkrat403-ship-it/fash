<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <div>
        <h1 class="text-2xl font-serif font-bold text-slate-900">Orders Fulfillment Pipeline</h1>
        <p class="text-xs text-slate-500 mt-1">Manage order status transitions, inspect line item snapshots, and view WhatsApp messages</p>
      </div>

      <!-- Pipeline Tabs -->
      <div class="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button 
          v-for="tab in pipelineTabs" 
          :key="tab.value"
          @click="selectTab(tab.value)"
          :class="[activeTab === tab.value ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200']"
          class="px-3.5 py-1.5 rounded-xl text-xs transition"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Orders List Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div v-if="loading" class="p-12 text-center text-xs text-slate-400">Loading orders pipeline...</div>
        <div v-else-if="!orders.length" class="p-12 text-center text-xs text-slate-500">No orders found in this pipeline state.</div>
        
        <table v-else class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3.5 px-4">Order Ref</th>
              <th class="py-3.5 px-4">Customer</th>
              <th class="py-3.5 px-4">Total</th>
              <th class="py-3.5 px-4">Pipeline Status</th>
              <th class="py-3.5 px-4">Date</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="o in orders" :key="o.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-mono font-bold text-slate-900">{{ o.orderNumber }}</td>
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900">{{ o.customerName }}</div>
                <div class="text-[10px] text-slate-400">{{ o.customerPhone }}</div>
              </td>
              <td class="py-3 px-4 font-bold text-slate-900">
                Rp{{ formatPrice(o.total) }}
              </td>
              <td class="py-3 px-4">
                <span 
                  :class="statusBadgeClass(o.status)"
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold capitalize"
                >
                  {{ o.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-500 text-[11px]">
                {{ formatDate(o.createdAt) }}
              </td>
              <td class="py-3 px-4 text-right">
                <button 
                  @click="openOrderModal(o.id)"
                  class="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800"
                >
                  Inspect Order
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Detail Modal -->
      <div v-if="showModal && selectedOrder" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
          
          <div class="flex justify-between items-center pb-4 border-b border-slate-200">
            <div>
              <span class="text-[10px] font-mono uppercase text-slate-400">Order Inspection</span>
              <h2 class="font-serif font-bold text-xl text-slate-900">{{ selectedOrder.orderNumber }}</h2>
            </div>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-base font-bold">✕</button>
          </div>

          <!-- Status Pipeline Action Bar -->
          <div v-if="authStore.hasPermission('orders.write')" class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 class="font-bold text-slate-900">Update Pipeline Status</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="st in ['contacted', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']" 
                :key="st"
                @click="updateStatus(st)"
                :disabled="selectedOrder.status === st"
                :class="[selectedOrder.status === st ? 'bg-slate-900 text-white font-bold' : 'bg-white border text-slate-800 hover:bg-slate-100']"
                class="px-3 py-1.5 rounded-xl capitalize font-semibold transition"
              >
                Set to {{ st }}
              </button>
            </div>
          </div>

          <!-- Customer & Address Snapshots -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 class="font-bold text-slate-900 mb-2">Customer Info (Snapshot)</h4>
              <p>Name: <strong>{{ selectedOrder.customerName }}</strong></p>
              <p>Phone: {{ selectedOrder.customerPhone }}</p>
              <p v-if="selectedOrder.customerEmail">Email: {{ selectedOrder.customerEmail }}</p>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 class="font-bold text-slate-900 mb-2">Shipping Address (Snapshot)</h4>
              <p>{{ selectedOrder.shippingAddressSnapshot?.line1 }}</p>
              <p>{{ selectedOrder.shippingAddressSnapshot?.city }}, {{ selectedOrder.shippingAddressSnapshot?.province }} {{ selectedOrder.shippingAddressSnapshot?.postalCode }}</p>
              <p v-if="selectedOrder.notes" class="text-slate-500 mt-1 font-italic">Notes: "{{ selectedOrder.notes }}"</p>
            </div>
          </div>

          <!-- Order Item Snapshots Table -->
          <div>
            <h4 class="font-serif font-bold text-sm text-slate-900 mb-2">Ordered Items (Price Snapshot)</h4>
            <div class="space-y-2">
              <div v-for="item in selectedOrder.orderItems" :key="item.id" class="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div class="font-bold text-slate-900">{{ item.productNameSnapshot }}</div>
                  <div class="text-[10px] text-slate-500">{{ item.variantSnapshot }} | SKU: {{ item.skuSnapshot }}</div>
                </div>
                <div class="font-bold text-slate-900">
                  {{ item.quantity }}x Rp{{ formatPrice(item.unitPrice) }} = Rp{{ formatPrice(item.lineTotal) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Exact WhatsApp Message -->
          <div>
            <h4 class="font-bold text-slate-900 mb-1">Generated WhatsApp Order Message</h4>
            <pre class="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-[11px] whitespace-pre-wrap">{{ selectedOrder.whatsappMessage }}</pre>
          </div>

        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const orders = ref<any[]>([]);
const loading = ref(true);
const activeTab = ref('');
const showModal = ref(false);
const selectedOrder = ref<any>(null);

const pipelineTabs = [
  { label: 'All Orders', value: '' },
  { label: 'Pending WA', value: 'pending_whatsapp' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const fetchOrders = async () => {
  try {
    loading.value = true;
    const url = `http://localhost:3000/api/v1/admin/orders?status=${activeTab.value}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    orders.value = data.items || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const selectTab = (val: string) => {
  activeTab.value = val;
  fetchOrders();
};

const openOrderModal = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/v1/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  selectedOrder.value = await res.json();
  showModal.value = true;
};

const updateStatus = async (status: string) => {
  if (!selectedOrder.value) return;
  const note = prompt(`Optional status note for transitioning to "${status}":`) || `Moved to ${status} by admin`;
  try {
    const res = await fetch(`http://localhost:3000/api/v1/admin/orders/${selectedOrder.value.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ status, note }),
    });

    if (!res.ok) throw new Error('Failed to update status');

    await openOrderModal(selectedOrder.value.id);
    await fetchOrders();
  } catch (e: any) {
    alert(e.message);
  }
};

const statusBadgeClass = (st: string) => {
  switch (st) {
    case 'pending_whatsapp': return 'bg-amber-100 text-amber-900 border border-amber-200';
    case 'contacted': return 'bg-blue-100 text-blue-800';
    case 'confirmed': return 'bg-emerald-100 text-emerald-800';
    case 'processing': return 'bg-indigo-100 text-indigo-800';
    case 'shipped': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-900 font-bold';
    case 'cancelled': return 'bg-rose-100 text-rose-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

onMounted(fetchOrders);

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
const formatDate = (val: any) => new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
</script>
