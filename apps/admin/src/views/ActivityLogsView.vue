<template>
  <AdminLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-serif font-bold text-slate-900">Activity Audit Trail</h1>
        <p class="text-xs text-slate-500 mt-1">Immutable audit log of all admin mutations and system changes</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div v-if="!logs.length" class="p-12 text-center text-xs text-slate-500">No activity logs recorded yet.</div>
        
        <table v-else class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 border-b font-semibold uppercase text-slate-500">
            <tr>
              <th class="py-3 px-4">Actor</th>
              <th class="py-3 px-4">Action</th>
              <th class="py-3 px-4">Entity Type</th>
              <th class="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="l in logs" :key="l.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-bold text-slate-900">{{ l.adminUser?.name || 'System / Automated' }}</td>
              <td class="py-3 px-4 font-mono font-semibold text-indigo-700">{{ l.action }}</td>
              <td class="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">{{ l.entityType }}</td>
              <td class="py-3 px-4 text-slate-400 text-[11px]">{{ formatDate(l.createdAt) }}</td>
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
const logs = ref<any[]>([]);

const fetchLogs = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/admin/activity-logs', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    logs.value = data.items || [];
  } catch {}
};

onMounted(fetchLogs);
const formatDate = (val: any) => new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
</script>
