<template>
  <AdminLayout>
    <div class="space-y-6 max-w-4xl">
      <div>
        <h1 class="text-2xl font-serif font-bold text-slate-900">Website & Store Settings</h1>
        <p class="text-xs text-slate-500 mt-1">Configure WhatsApp desk number, store metadata, and shipping policies</p>
      </div>

      <div v-if="successMsg" class="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
        {{ successMsg }}
      </div>

      <form @submit.prevent="saveSettings" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6 text-xs">
        <div>
          <label class="block font-semibold uppercase tracking-wider text-slate-700 mb-1">WhatsApp Desk Number *</label>
          <input v-model="settings.whatsappNumber" type="text" required placeholder="6281234567890" class="w-full p-3 rounded-xl border font-mono" />
          <span class="text-[10px] text-slate-400 mt-1 block">Full country code without plus sign (e.g. 6281234567890 for Indonesia).</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold uppercase tracking-wider text-slate-700 mb-1">Store Name</label>
            <input v-model="settings.info.name" type="text" class="w-full p-3 rounded-xl border" />
          </div>
          <div>
            <label class="block font-semibold uppercase tracking-wider text-slate-700 mb-1">Tagline</label>
            <input v-model="settings.info.tagline" type="text" class="w-full p-3 rounded-xl border" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold uppercase tracking-wider text-slate-700 mb-1">Contact Email</label>
            <input v-model="settings.info.email" type="email" class="w-full p-3 rounded-xl border" />
          </div>
          <div>
            <label class="block font-semibold uppercase tracking-wider text-slate-700 mb-1">Store Address</label>
            <input v-model="settings.info.address" type="text" class="w-full p-3 rounded-xl border" />
          </div>
        </div>

        <div class="pt-4 border-t flex justify-end">
          <button v-if="authStore.hasPermission('settings.write')" type="submit" :disabled="saving" class="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800">
            {{ saving ? 'Saving Settings...' : 'Save All Settings' }}
          </button>
        </div>
      </form>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const saving = ref(false);
const successMsg = ref('');

const settings = ref({
  whatsappNumber: '6281234567890',
  info: {
    name: 'AURA Fashion Studio',
    tagline: 'Modern Mobile-First Apparel',
    email: 'info@fashionstore.com',
    address: 'Jl. Sudirman No. 45, Jakarta',
  },
});

const fetchSettings = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/admin/settings', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      data.forEach((s: any) => {
        if (s.key === 'store_whatsapp_number') settings.value.whatsappNumber = s.value;
        if (s.key === 'store_info') settings.value.info = s.value;
      });
    }
  } catch {}
};

const saveSettings = async () => {
  try {
    saving.value = true;
    successMsg.value = '';

    await Promise.all([
      fetch('http://localhost:3000/api/v1/admin/settings/store_whatsapp_number', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
        body: JSON.stringify({ value: settings.value.whatsappNumber }),
      }),
      fetch('http://localhost:3000/api/v1/admin/settings/store_info', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
        body: JSON.stringify({ value: settings.value.info }),
      }),
    ]);

    successMsg.value = 'Store settings updated successfully!';
  } catch (e: any) {
    alert(e.message);
  } finally {
    saving.value = false;
  }
};

onMounted(fetchSettings);
</script>
