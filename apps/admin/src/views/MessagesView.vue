<template>
  <AdminLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-serif font-bold text-slate-900">Contact Message Inbox</h1>
        <p class="text-xs text-slate-500 mt-1">Review contact submissions and respond directly over WhatsApp or email</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div v-if="!messages.length" class="p-12 text-center text-xs text-slate-500">No contact messages received yet.</div>
        
        <table v-else class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 border-b font-semibold uppercase text-slate-500">
            <tr>
              <th class="py-3 px-4">Sender</th>
              <th class="py-3 px-4">Contact Info</th>
              <th class="py-3 px-4">Subject & Message</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Received</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="m in messages" :key="m.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-bold text-slate-900 font-serif text-sm">{{ m.name }}</td>
              <td class="py-3 px-4 space-y-0.5">
                <div v-if="m.phone" class="font-mono text-emerald-700 font-semibold">{{ m.phone }}</div>
                <div v-if="m.email" class="text-slate-500">{{ m.email }}</div>
              </td>
              <td class="py-3 px-4 max-w-xs">
                <div class="font-bold text-slate-900">{{ m.subject || 'General Inquiry' }}</div>
                <div class="text-slate-600 line-clamp-2 text-[11px] mt-0.5">{{ m.message }}</div>
              </td>
              <td class="py-3 px-4">
                <span 
                  :class="[
                    m.status === 'unread' ? 'bg-amber-100 text-amber-900' :
                    m.status === 'replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  ]"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize"
                >
                  {{ m.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-400 text-[11px]">{{ formatDate(m.createdAt) }}</td>
              <td class="py-3 px-4 text-right space-x-2">
                <a 
                  v-if="m.phone"
                  :href="`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(m.name)}%2C%20kami%20dari%20AURA...`"
                  target="_blank"
                  @click="updateStatus(m.id, 'replied')"
                  class="px-2.5 py-1 rounded bg-emerald-700 text-white text-[10px] font-bold hover:bg-emerald-800 inline-block"
                >
                  Reply via WA
                </a>
                <button 
                  v-if="m.status === 'unread'" 
                  @click="updateStatus(m.id, 'read')"
                  class="text-slate-600 font-semibold text-xs"
                >
                  Mark Read
                </button>
              </td>
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
const messages = ref<any[]>([]);

const fetchMessages = async () => {
  const res = await fetch('http://localhost:3000/api/v1/admin/messages', {
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  messages.value = await res.json();
};

const updateStatus = async (id: string, status: string) => {
  await fetch(`http://localhost:3000/api/v1/admin/messages/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
    body: JSON.stringify({ status }),
  });
  fetchMessages();
};

onMounted(fetchMessages);
const formatDate = (val: any) => new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' });
</script>
