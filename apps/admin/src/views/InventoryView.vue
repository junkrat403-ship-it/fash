<template>
  <AdminLayout>
    <div class="space-y-6">

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-serif font-bold text-[#0A1931]">Inventory & Stock Audit</h1>
          <p class="text-xs text-slate-500 mt-1">Monitor variant stock levels grouped by product and record restock audit logs</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-[#B3CFE5]/50 shadow-2xs flex flex-wrap items-center gap-4">
        <div class="relative flex-1 min-w-[240px]">
          <input 
            v-model="searchQuery" 
            @input="debounceSearch"
            type="text" 
            placeholder="Search inventory by product name or SKU..." 
            class="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#B3CFE5]/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#28537A] bg-white text-[#0A1931]"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        <label class="flex items-center space-x-2 text-xs text-[#0A1931] bg-white px-3.5 py-2 rounded-xl border border-[#B3CFE5]/60 cursor-pointer shadow-2xs">
          <input v-model="lowStockOnly" @change="fetchInventory" type="checkbox" class="rounded accent-[#28537A]" />
          <span class="font-bold text-rose-700">Show Low-Stock Alerts Only</span>
        </label>
      </div>

      <div class="bg-white rounded-2xl border border-[#B3CFE5]/50 shadow-2xs overflow-hidden">
        <div v-if="loading" class="p-12 text-center text-xs text-slate-400">Loading inventory...</div>
        <div v-else-if="!groupedInventory.length" class="p-12 text-center text-slate-500 text-xs">
          No inventory records match your query.
        </div>
        
        <table v-else class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-[#B3CFE5]/40">
            <tr>
              <th class="py-3.5 px-4">SKU</th>
              <th class="py-3.5 px-4">Product Name</th>
              <th class="py-3.5 px-4">Size / Color</th>
              <th class="py-3.5 px-4">Stock Quantity</th>
              <th class="py-3.5 px-4">Stock Status</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="group in groupedInventory" :key="group.product?.id || group.product?.name">

              <tr class="bg-slate-100/80 border-t-2 border-b border-slate-200">
                <td colspan="6" class="py-3 px-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <img 
                        :src="group.product?.productImages?.[0]?.url || 'https://via.placeholder.com/50'" 
                        :alt="group.product?.name"
                        class="w-8 h-10 object-cover rounded-lg bg-white border border-slate-200 shrink-0"
                      />
                      <div>
                        <span class="font-serif font-bold text-[#0A1931] text-sm sm:text-base">{{ group.product?.name || 'Unassigned Product' }}</span>
                        <span class="text-[11px] text-slate-500 font-mono ml-2">/products/{{ group.product?.slug }}</span>
                      </div>
                    </div>

                    <div class="flex items-center space-x-2">
                      <span class="text-[11px] font-medium text-slate-500">Total Stock:</span>
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#28537A]/15 text-[#28537A]">
                        {{ group.totalStock }} unit(s)
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-for="v in group.variants" :key="v.id" class="hover:bg-slate-50/80 border-b border-slate-100 transition">
                <td class="py-3 px-4 font-mono font-semibold text-[#0A1931] pl-8">
                  <span class="text-slate-400 mr-1 font-sans">└</span> {{ v.sku }}
                </td>
                <td class="py-3 px-4 text-slate-500">
                  {{ group.product?.name }}
                </td>
                <td class="py-3 px-4 font-semibold text-[#0A1931]">
                  {{ v.size || 'N/A' }} / {{ v.color || 'N/A' }}
                </td>
                <td class="py-3 px-4 font-bold text-[#0A1931] text-sm tabular-nums">
                  {{ v.stockQuantity }}
                </td>
                <td class="py-3 px-4">
                  <span 
                    v-if="v.stockQuantity <= 0" 
                    class="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    Out of Stock
                  </span>
                  <span 
                    v-else-if="v.stockQuantity <= v.lowStockThreshold" 
                    class="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    Low Stock Alert (≤ {{ v.lowStockThreshold }})
                  </span>
                  <span v-else class="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    In Stock
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <button 
                    v-if="authStore.hasPermission('products.write')"
                    @click="openAdjustModal(v)"
                    class="px-3 py-1.5 rounded-xl btn-primary-flat text-[11px] font-bold shadow-xs cursor-pointer"
                  >
                    Adjust Stock
                  </button>
                </td>
              </tr>

            </template>
          </tbody>
        </table>
      </div>

      <div v-if="showAdjustModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
          <h2 class="font-serif font-bold text-lg text-[#0A1931]">Record Stock Adjustment</h2>
          <p class="text-xs text-slate-500">
            SKU: <strong class="font-mono text-[#0A1931]">{{ selectedVariant?.sku }}</strong> (Current Stock: {{ selectedVariant?.stockQuantity }})
          </p>

          <form @submit.prevent="submitAdjustment" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-[#1A3D63] uppercase tracking-wider mb-1.5">Quantity Delta (+ restock, - deduction) *</label>
              <input v-model.number="adjustForm.delta" type="number" required placeholder="e.g. 10 or -2" class="w-full px-4 py-2.5 rounded-xl border border-[#B3CFE5]/60 text-xs focus:ring-2 focus:ring-[#28537A]" />
            </div>

            <div>
              <label class="block font-bold text-[#1A3D63] uppercase tracking-wider mb-1.5">Mandatory Reason / Audit Note *</label>
              <input v-model="adjustForm.reason" type="text" required placeholder="e.g. Restock from supplier shipment PO-102" class="w-full px-4 py-2.5 rounded-xl border border-[#B3CFE5]/60 text-xs focus:ring-2 focus:ring-[#28537A]" />
            </div>

            <div class="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button type="button" @click="showAdjustModal = false" class="px-4 py-2 rounded-xl pill-flat text-xs font-bold text-[#0A1931]">Cancel</button>
              <button type="submit" :disabled="submitting" class="px-5 py-2 rounded-xl btn-primary-flat text-xs font-bold">
                {{ submitting ? 'Saving Audit Log...' : 'Confirm Adjustment' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const inventory = ref<any[]>([]);
const loading = ref(true);
const lowStockOnly = ref(false);
const searchQuery = ref('');

const showAdjustModal = ref(false);
const selectedVariant = ref<any>(null);
const submitting = ref(false);

const adjustForm = ref({
  delta: 10,
  reason: '',
});

const groupedInventory = computed(() => {
  const map = new Map<string, { product: any; variants: any[]; totalStock: number }>();

  for (const item of inventory.value) {
    const pId = item.product?.id || item.product?.name || 'unassigned';
    if (!map.has(pId)) {
      map.set(pId, {
        product: item.product || { name: 'Unassigned Product', slug: '#' },
        variants: [],
        totalStock: 0,
      });
    }
    const group = map.get(pId)!;
    group.variants.push(item);
    group.totalStock += Number(item.stockQuantity || 0);
  }

  return Array.from(map.values());
});

let debounceTimer: any = null;
const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchInventory();
  }, 400);
};

const fetchInventory = async () => {
  try {
    loading.value = true;
    const url = `http://localhost:3000/api/v1/admin/inventory?lowStock=${lowStockOnly.value}&search=${encodeURIComponent(searchQuery.value)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    inventory.value = await res.json();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const openAdjustModal = (variant: any) => {
  selectedVariant.value = variant;
  adjustForm.value = { delta: 10, reason: '' };
  showAdjustModal.value = true;
};

const submitAdjustment = async () => {
  if (!selectedVariant.value) return;
  try {
    submitting.value = true;
    const res = await fetch(`http://localhost:3000/api/v1/admin/inventory/${selectedVariant.value.id}/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(adjustForm.value),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Stock adjustment failed');
    }

    showAdjustModal.value = false;
    fetchInventory();
  } catch (e: any) {
    alert(e.message);
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchInventory);
</script>
