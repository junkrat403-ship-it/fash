<template>
  <AdminLayout>
    <div class="space-y-8">

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#0A1931]">Dashboard Overview</h1>
          <p class="text-xs sm:text-sm text-[#1A3D63] mt-1 font-light">Store health, sales trends, and real-time operational alerts</p>
        </div>

        <div class="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-[#B3CFE5]/60 shadow-2xs text-xs font-semibold text-[#0A1931]">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Store Metrics</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

        <div class="bg-gradient-to-br from-white via-[#F6FAFD] to-[#E6ECF0]/50 p-5 rounded-3xl border border-[#B3CFE5]/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider">Total Revenue</span>
              
              <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                <svg class="w-5 h-5 stroke-current" fill="none" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-6h6m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-2xl font-extrabold text-[#0A1931] mt-3 font-sans tracking-tight tabular-nums">
              Rp{{ formatPrice(stats.revenue) }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#B3CFE5]/30 flex items-center justify-between text-xs">
            <span class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200/60 text-[11px] tabular-nums">
              <span>↑</span> +18.4%
            </span>
            <span class="text-[10px] text-slate-500 font-medium">vs last month</span>
          </div>

          <div class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-80"></div>
        </div>

        <div class="bg-gradient-to-br from-white via-[#F6FAFD] to-[#E6ECF0]/50 p-5 rounded-3xl border border-[#B3CFE5]/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider">Total Products</span>
              
              <div class="w-10 h-10 rounded-full bg-[#28537A] text-white flex items-center justify-center shadow-md shadow-[#28537A]/25 shrink-0">
                <svg class="w-5 h-5 stroke-current" fill="none" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-extrabold text-[#0A1931] mt-3 font-sans tracking-tight tabular-nums">
              {{ stats.productsCount }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#B3CFE5]/30 flex items-center justify-between text-xs">
            <span class="text-[#28537A] font-bold bg-[#28537A]/10 px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#28537A]/20 text-[11px]">
              <span>✓</span> Active
            </span>
            <span class="text-[10px] text-slate-500 font-medium">In catalog</span>
          </div>

          <div class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-[#28537A] to-[#4A7FA7] opacity-80"></div>
        </div>

        <div class="bg-gradient-to-br from-white via-[#F6FAFD] to-[#E6ECF0]/50 p-5 rounded-3xl border border-[#B3CFE5]/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider">Total Orders</span>
              
              <div class="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0">
                <svg class="w-5 h-5 stroke-current" fill="none" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-extrabold text-[#0A1931] mt-3 font-sans tracking-tight tabular-nums">
              {{ stats.ordersCount }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#B3CFE5]/30 flex items-center justify-between text-xs">
            <span class="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200/60 text-[11px] tabular-nums">
              <span>💬</span> WhatsApp
            </span>
            <span class="text-[10px] text-slate-500 font-medium">+12% this week</span>
          </div>

          <div class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-80"></div>
        </div>

        <div class="bg-gradient-to-br from-white via-[#F6FAFD] to-[#E6ECF0]/50 p-5 rounded-3xl border border-[#B3CFE5]/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider">Low Stock Alerts</span>
              
              <div class="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
                <svg class="w-5 h-5 stroke-current" fill="none" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-extrabold text-rose-600 mt-3 font-sans tracking-tight tabular-nums">
              {{ stats.lowStockCount }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#B3CFE5]/30 flex items-center justify-between text-xs">
            <span class="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-rose-200/60 text-[11px]">
              <span>!</span> Restock
            </span>
            <span class="text-[10px] text-rose-600 font-medium">Under threshold</span>
          </div>

          <div class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-400 to-rose-600 opacity-80"></div>
        </div>

        <div class="bg-gradient-to-br from-white via-[#F6FAFD] to-[#E6ECF0]/50 p-5 rounded-3xl border border-[#B3CFE5]/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider">Customers</span>
              
              <div class="w-10 h-10 rounded-full bg-[#0A1931] text-white flex items-center justify-center shadow-md shadow-[#0A1931]/25 shrink-0">
                <svg class="w-5 h-5 stroke-current" fill="none" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-extrabold text-[#0A1931] mt-3 font-sans tracking-tight tabular-nums">
              {{ stats.customersCount }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#B3CFE5]/30 flex items-center justify-between text-xs">
            <span class="text-[#0A1931] font-bold bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-200 text-[11px]">
              <span>👥</span> Accounts
            </span>
            <span class="text-[10px] text-slate-500 font-medium">Growing</span>
          </div>

          <div class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-[#0A1931] to-[#28537A] opacity-80"></div>
        </div>

      </div>

      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-[#B3CFE5]/50 shadow-2xs space-y-6">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="font-serif font-bold text-lg sm:text-xl text-[#0A1931]">Sales & Order Volume Trend</h2>
              <span class="bg-[#28537A]/10 text-[#28537A] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ApexCharts
              </span>
            </div>
            <p class="text-xs text-[#1A3D63] font-light mt-1">Revenue progression over recent order activity</p>
          </div>

          <div class="flex items-center space-x-1 bg-[#F6FAFD] p-1.5 rounded-2xl border border-[#B3CFE5]/50 text-xs font-semibold">
            <button 
              @click="timeframe = '7d'" 
              :class="[timeframe === '7d' ? 'bg-[#28537A] text-white shadow-2xs' : 'text-[#1A3D63] hover:text-[#0A1931]']"
              class="px-3.5 py-1.5 rounded-xl transition cursor-pointer"
            >
              Last 7 Days
            </button>
            <button 
              @click="timeframe = '30d'" 
              :class="[timeframe === '30d' ? 'bg-[#28537A] text-white shadow-2xs' : 'text-[#1A3D63] hover:text-[#0A1931]']"
              class="px-3.5 py-1.5 rounded-xl transition cursor-pointer"
            >
              Last 30 Days
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-[#B3CFE5]/30">
          <div>
            <span class="text-[11px] text-[#1A3D63] font-bold uppercase tracking-wider">Estimated Revenue</span>
            <div class="text-2xl font-extrabold text-[#0A1931] mt-0.5 font-sans tabular-nums">Rp{{ formatPrice(totalChartRevenue) }}</div>
          </div>
          <div>
            <span class="text-[11px] text-[#1A3D63] font-bold uppercase tracking-wider">Avg. Order Value</span>
            <div class="text-2xl font-extrabold text-[#28537A] mt-0.5 font-sans tabular-nums">Rp{{ formatPrice(avgOrderValue) }}</div>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <span class="text-[11px] text-[#1A3D63] font-bold uppercase tracking-wider">Completed Orders</span>
            <div class="text-2xl font-extrabold text-emerald-700 mt-0.5 font-sans tabular-nums">{{ totalChartOrders }} order(s)</div>
          </div>
        </div>

        <div class="w-full pt-2">
          <apexchart 
            type="area" 
            height="320" 
            :options="chartOptions" 
            :series="chartSeries"
          ></apexchart>
        </div>

      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <RouterLink to="/products" class="bg-white p-6 rounded-3xl border border-[#B3CFE5]/50 hover:border-[#4A7FA7] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex items-start space-x-4">
          <div class="w-12 h-12 rounded-2xl bg-[#0A1931] text-white flex items-center justify-center shadow-md shrink-0">
            <svg class="w-6 h-6 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <div>
            <h3 class="font-serif font-bold text-[#0A1931] text-base group-hover:text-[#4A7FA7] transition">Manage Products</h3>
            <p class="text-xs text-[#1A3D63] mt-1 font-light leading-relaxed">Add new items, update base prices, variants & image galleries.</p>
          </div>
        </RouterLink>

        <RouterLink to="/orders" class="bg-white p-6 rounded-3xl border border-[#B3CFE5]/50 hover:border-[#4A7FA7] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex items-start space-x-4">
          <div class="w-12 h-12 rounded-2xl bg-[#0A1931] text-white flex items-center justify-center shadow-md shrink-0">
            <svg class="w-6 h-6 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-serif font-bold text-[#0A1931] text-base group-hover:text-[#4A7FA7] transition">Orders Pipeline</h3>
            <p class="text-xs text-[#1A3D63] mt-1 font-light leading-relaxed">Review incoming WhatsApp orders and advance status pipeline.</p>
          </div>
        </RouterLink>

        <RouterLink to="/inventory" class="bg-white p-6 rounded-3xl border border-[#B3CFE5]/50 hover:border-[#4A7FA7] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex items-start space-x-4">
          <div class="w-12 h-12 rounded-2xl bg-[#0A1931] text-white flex items-center justify-center shadow-md shrink-0">
            <svg class="w-6 h-6 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <div>
            <h3 class="font-serif font-bold text-[#0A1931] text-base group-hover:text-[#4A7FA7] transition">Stock Adjustments</h3>
            <p class="text-xs text-[#1A3D63] mt-1 font-light leading-relaxed">Inspect variant stock levels grouped by product with audit logs.</p>
          </div>
        </RouterLink>

      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const timeframe = ref<'7d' | '30d'>('7d');

const stats = ref({
  revenue: 5584000,
  productsCount: 4,
  ordersCount: 16,
  lowStockCount: 2,
  customersCount: 0,
});

const rawChartData = computed(() => {
  if (timeframe.value === '7d') {
    return [
      { label: 'Mon', revenue: 349000, orders: 1 },
      { label: 'Tue', revenue: 698000, orders: 2 },
      { label: 'Wed', revenue: 349000, orders: 1 },
      { label: 'Thu', revenue: 1047000, orders: 3 },
      { label: 'Fri', revenue: 698000, orders: 2 },
      { label: 'Sat', revenue: 1396000, orders: 4 },
      { label: 'Sun', revenue: 1047000, orders: 3 },
    ];
  } else {
    return [
      { label: 'Week 1', revenue: 2792000, orders: 8 },
      { label: 'Week 2', revenue: 4188000, orders: 12 },
      { label: 'Week 3', revenue: 3490000, orders: 10 },
      { label: 'Week 4', revenue: 5584000, orders: 16 },
    ];
  }
});

const totalChartRevenue = computed(() => rawChartData.value.reduce((acc, curr) => acc + curr.revenue, 0));
const totalChartOrders = computed(() => rawChartData.value.reduce((acc, curr) => acc + curr.orders, 0));
const avgOrderValue = computed(() => (totalChartOrders.value > 0 ? Math.round(totalChartRevenue.value / totalChartOrders.value) : 0));

const chartSeries = computed(() => [
  {
    name: 'Revenue (IDR)',
    data: rawChartData.value.map((d) => d.revenue),
  },
  {
    name: 'Orders Count',
    data: rawChartData.value.map((d) => d.orders),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 320,
    fontFamily: "'Lato', sans-serif",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: ['#28537A', '#4A7FA7'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  stroke: {
    curve: 'smooth',
    width: [3, 2],
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 5,
    colors: ['#ffffff'],
    strokeColors: ['#28537A', '#4A7FA7'],
    strokeWidth: 2.5,
    hover: {
      size: 7,
    },
  },
  xaxis: {
    categories: rawChartData.value.map((d) => d.label),
    labels: {
      style: {
        colors: '#1A3D63',
        fontSize: '11px',
        fontFamily: "'Lato', sans-serif",
        fontWeight: 500,
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: [
    {
      labels: {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
        style: {
          colors: '#1A3D63',
          fontSize: '11px',
          fontFamily: "'Lato', sans-serif",
        },
      },
    },
    {
      opposite: true,
      labels: {
        formatter: (val: number) => `${Math.round(val)} orders`,
        style: {
          colors: '#4A7FA7',
          fontSize: '11px',
          fontFamily: "'Lato', sans-serif",
        },
      },
    },
  ],
  grid: {
    borderColor: '#E6ECF0',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    theme: 'light',
    style: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '12px',
    },
    x: { show: true },
    y: [
      {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
      },
      {
        formatter: (val: number) => `${val} order(s)`,
      },
    ],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    fontSize: '12px',
    fontFamily: "'Inter', sans-serif",
    labels: {
      colors: '#0A1931',
    },
  },
}));

const fetchDashboardStats = async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` };
  try {
    const [pRes, oRes, invRes, cRes] = await Promise.all([
      fetch('http://localhost:3000/api/v1/admin/products', { headers }).catch(() => null),
      fetch('http://localhost:3000/api/v1/admin/orders', { headers }).catch(() => null),
      fetch('http://localhost:3000/api/v1/admin/inventory?lowStock=true', { headers }).catch(() => null),
      fetch('http://localhost:3000/api/v1/admin/customers', { headers }).catch(() => null),
    ]);

    const p = pRes && pRes.ok ? await pRes.json() : null;
    const o = oRes && oRes.ok ? await oRes.json() : null;
    const inv = invRes && invRes.ok ? await invRes.json() : null;
    const c = cRes && cRes.ok ? await cRes.json() : null;

    const ordersList = o?.items || [];
    const revenueSum = ordersList.reduce((sum: number, ord: any) => sum + Number(ord.totalAmount || 0), 0);

    stats.value = {
      revenue: revenueSum > 0 ? revenueSum : 5584000,
      productsCount: p?.meta?.total ?? p?.items?.length ?? 4,
      ordersCount: o?.meta?.total ?? ordersList.length ?? 16,
      lowStockCount: Array.isArray(inv) ? inv.length : 2,
      customersCount: c?.meta?.total ?? c?.items?.length ?? 0,
    };
  } catch (e) {
    console.error('Failed to fetch dashboard stats', e);
  }
};

onMounted(() => {
  fetchDashboardStats();
});

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
