<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-slate-900">Users & RBAC Management</h1>
          <p class="text-xs text-slate-500 mt-1">Manage staff user accounts and role-based access permissions</p>
        </div>
        <button v-if="authStore.hasPermission('users.write')" @click="openModal()" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
          + Invite Staff User
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 border-b font-semibold uppercase text-slate-500">
            <tr>
              <th class="py-3 px-4">Name</th>
              <th class="py-3 px-4">Email</th>
              <th class="py-3 px-4">Assigned Role</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Last Login</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-bold text-slate-900 font-serif text-sm">{{ u.name }}</td>
              <td class="py-3 px-4 font-mono text-slate-600">{{ u.email }}</td>
              <td class="py-3 px-4">
                <span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                  {{ u.role?.name }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span :class="[u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800']" class="px-2 py-0.5 rounded text-[10px] font-bold">
                  {{ u.isActive ? 'Active' : 'Disabled' }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-400 text-[11px]">{{ u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- User Invite Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-xs">
          <h2 class="font-serif font-bold text-lg text-slate-900">Invite Staff User</h2>
          <form @submit.prevent="saveUser" class="space-y-3">
            <div>
              <label class="block font-semibold">Full Name *</label>
              <input v-model="form.name" type="text" required class="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label class="block font-semibold">Email *</label>
              <input v-model="form.email" type="email" required class="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label class="block font-semibold">Initial Password *</label>
              <input v-model="form.password" type="password" required class="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label class="block font-semibold">Role *</label>
              <select v-model="form.roleId" required class="w-full p-2 border rounded-xl bg-white">
                <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }} - {{ r.description }}</option>
              </select>
            </div>
            <div class="flex justify-end space-x-2 pt-3 border-t">
              <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-xl">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl">Create Account</button>
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
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const users = ref<any[]>([]);
const roles = ref<any[]>([]);
const showModal = ref(false);

const form = ref({ name: '', email: '', password: 'StaffPass123!', roleId: '' });

const fetchUsersAndRoles = async () => {
  const [uRes, rRes] = await Promise.all([
    fetch('http://localhost:3000/api/v1/admin/users', { headers: { Authorization: `Bearer ${authStore.token}` } }),
    fetch('http://localhost:3000/api/v1/admin/roles', { headers: { Authorization: `Bearer ${authStore.token}` } }),
  ]);
  users.value = await uRes.json();
  roles.value = await rRes.json();
  if (roles.value.length) form.value.roleId = roles.value[0].id;
};

const openModal = () => {
  form.value = { name: '', email: '', password: 'StaffPass123!', roleId: roles.value[0]?.id || '' };
  showModal.value = true;
};

const saveUser = async () => {
  const res = await fetch('http://localhost:3000/api/v1/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
    body: JSON.stringify(form.value),
  });

  if (!res.ok) {
    const err = await res.json();
    alert(err.message || 'Failed to create user');
    return;
  }

  showModal.value = false;
  fetchUsersAndRoles();
};

onMounted(fetchUsersAndRoles);
const formatDate = (val: any) => new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' });
</script>
