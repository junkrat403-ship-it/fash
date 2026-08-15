<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <div>
        <h1 class="text-2xl font-serif font-bold text-slate-900">Customer Accounts</h1>
        <p class="text-xs text-slate-500 mt-1">View customer profiles and order purchase history</p>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <input 
          v-model="searchQuery" 
          @input="debounceSearch" 
          type="text" 
          placeholder="Search by customer name, phone, email..." 
          class="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div v-if="loading" class="p-12 text-center text-xs text-slate-400">Loading customers...</div>
        <div v-else-if="!customers.length" class="p-12 text-center text-xs text-slate-500">No customer records found.</div>
        
        <table v-else class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3.5 px-4">Name</th>
              <th class="py-3.5 px-4">Phone Number</th>
              <th class="py-3.5 px-4">Email</th>
              <th class="py-3.5 px-4">Account Type</th>
              <th class="py-3.5 px-4">Total Orders</th>
              <th class="py-3.5 px-4">Joined Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="c in customers" :key="c.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-bold text-slate-900 font-serif text-sm">{{ c.name }}</td>
              <td class="py-3 px-4 font-mono font-medium text-slate-800">{{ c.phone }}</td>
              <td class="py-3 px-4 text-slate-600">{{ c.email || 'N/A' }}</td>
              <td class="py-3 px-4">
                <span :class="[c.isGuest ? 'bg-slate-100 text-slate-700' : 'bg-indigo-100 text-indigo-800']" class="px-2 py-0.5 rounded text-[10px] font-bold">
                  {{ c.isGuest ? 'Guest' : 'Registered' }}
                </span>
              </td>
              <td class="py-3 px-4 font-semibold text-slate-900">{{ c._count?.orders || 0 }} order(s)</td>
              <td class="py-3 px-4 text-slate-500 text-[11px]">{{ formatDate(c.createdAt) }}</td>
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

const authStore = useAuthStore();
const customers = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref('');

let debounceTimer: any = null;
const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchCustomers();
  }, 400);
};

const fetchCustomers = async () => {
  try {
    loading.value = true;
    const res = await fetch(`http://localhost:3000/api/v1/admin/customers?search=${searchQuery.value}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    customers.value = data.items || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCustomers);
const formatDate = (val: any) => new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' });
</script>
