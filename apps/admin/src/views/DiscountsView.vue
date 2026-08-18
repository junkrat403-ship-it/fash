<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-slate-900">Discount Engine</h1>
          <p class="text-xs text-slate-500 mt-1">Manage promotional discount codes and usage limits</p>
        </div>
        <button v-if="authStore.hasPermission('discounts.write')" @click="openModal()" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
          + Create Discount
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 border-b font-semibold uppercase text-slate-500">
            <tr>
              <th class="py-3 px-4">Code</th>
              <th class="py-3 px-4">Type</th>
              <th class="py-3 px-4">Discount Value</th>
              <th class="py-3 px-4">Min Order</th>
              <th class="py-3 px-4">Redemptions</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="d in discounts" :key="d.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-mono font-bold text-slate-900">{{ d.code || 'Automatic' }}</td>
              <td class="py-3 px-4 capitalize">{{ d.type }}</td>
              <td class="py-3 px-4 font-bold text-slate-900">
                {{ d.type === 'percentage' ? `${d.value}%` : `Rp${formatPrice(d.value)}` }}
              </td>
              <td class="py-3 px-4">Rp{{ formatPrice(d.minOrderValue) }}</td>
              <td class="py-3 px-4 font-semibold">{{ d._count?.discountRedemptions || d.usageCount || 0 }} times</td>
              <td class="py-3 px-4">
                <span :class="[d.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700']" class="px-2 py-0.5 rounded text-[10px] font-bold">
                  {{ d.isActive ? 'Active' : 'Disabled' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <button v-if="authStore.hasPermission('discounts.write')" @click="deleteDiscount(d.id)" class="text-rose-600 font-semibold">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-xs">
          <h2 class="font-serif font-bold text-lg text-slate-900">Create Discount Code</h2>
          <form @submit.prevent="saveDiscount" class="space-y-3">
            <div>
              <label class="block font-semibold">Code (e.g. SUMMER20)</label>
              <input v-model="form.code" type="text" placeholder="SUMMER20" class="w-full p-2 border rounded-xl font-mono uppercase" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold mb-1">Type</label>
                <AppSelect v-model="form.type" :options="discountTypeOptions" :full-width="true" />
              </div>
              <div>
                <label class="block font-semibold">Value *</label>
                <input v-model.number="form.value" type="number" required class="w-full p-2 border rounded-xl" />
              </div>
            </div>
            <div>
              <label class="block font-semibold">Min Order Value (IDR)</label>
              <input v-model.number="form.minOrderValue" type="number" class="w-full p-2 border rounded-xl" />
            </div>
            <div class="flex justify-end space-x-2 pt-3 border-t">
              <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-xl">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl">Save Discount</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import AppSelect from '../components/AppSelect.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const discounts = ref<any[]>([]);
const showModal = ref(false);

const discountTypeOptions = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed_amount', label: 'Fixed Amount (IDR)' },
];

const form = ref({ code: 'SUMMER20', type: 'percentage', value: 20, minOrderValue: 100000, isActive: true });

const fetchDiscounts = async () => {
  const res = await fetch('http://localhost:3000/api/v1/admin/discounts', {
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  discounts.value = await res.json();
};

const openModal = () => {
  form.value = { code: 'SUMMER20', type: 'percentage', value: 20, minOrderValue: 100000, isActive: true };
  showModal.value = true;
};

const saveDiscount = async () => {
  await fetch('http://localhost:3000/api/v1/admin/discounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
    body: JSON.stringify(form.value),
  });
  showModal.value = false;
  fetchDiscounts();
};

const deleteDiscount = async (id: string) => {
  if (!confirm('Delete discount?')) return;
  await fetch(`http://localhost:3000/api/v1/admin/discounts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  fetchDiscounts();
};

onMounted(fetchDiscounts);
const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
