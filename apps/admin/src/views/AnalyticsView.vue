<template>
  <AdminLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-serif font-bold text-slate-900">Sales & Revenue Analytics</h1>
        <p class="text-xs text-slate-500 mt-1">Track store revenue performance, order volume, and top-selling products</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Confirmed Revenue</span>
          <div class="text-3xl font-bold text-slate-900 mt-2">Rp{{ formatPrice(summary.totalRevenue) }}</div>
          <span class="text-[11px] text-emerald-600 font-medium mt-1 block">Confirmed & delivered orders</span>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Sales Revenue</span>
          <div class="text-3xl font-bold text-slate-900 mt-2">Rp{{ formatPrice(summary.todayRevenue) }}</div>
          <span class="text-[11px] text-slate-400 mt-1 block">Since 00:00 today</span>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders Placed</span>
          <div class="text-3xl font-bold text-slate-900 mt-2">{{ summary.totalOrders }}</div>
          <span class="text-[11px] text-amber-600 font-medium mt-1 block">{{ summary.pendingOrders }} pending WA handoff</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 class="font-serif font-bold text-lg text-slate-900">Top Selling Products</h3>
        
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 border-b font-semibold uppercase text-slate-500">
            <tr>
              <th class="py-3 px-4">Product Name</th>
              <th class="py-3 px-4">Base Price</th>
              <th class="py-3 px-4">Units Sold</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in summary.topSellingProducts" :key="p.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-bold text-slate-900 font-serif text-sm">{{ p.name }}</td>
              <td class="py-3 px-4 font-bold text-slate-900">Rp{{ formatPrice(p.basePrice) }}</td>
              <td class="py-3 px-4 font-semibold text-indigo-700">{{ p.salesCount }} unit(s)</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';

interface TopSellingProduct {
  id: string;
  name: string;
  basePrice: number;
  salesCount: number;
}

interface AnalyticsSummary {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  topSellingProducts: TopSellingProduct[];
}

const authStore = useAuthStore();
const summary = ref<AnalyticsSummary>({
  totalRevenue: 0,
  todayRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  topSellingProducts: [],
});

const fetchAnalytics = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/admin/analytics/dashboard', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    summary.value = await res.json();
  } catch {}
};

onMounted(fetchAnalytics);
const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
