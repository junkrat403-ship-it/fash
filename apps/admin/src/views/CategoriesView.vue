<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-slate-900">Category Management</h1>
          <p class="text-xs text-slate-500 mt-1">Organize storefront catalog structure</p>
        </div>

        <button 
          v-if="authStore.hasPermission('categories.write')"
          @click="openModal()"
          class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
        >
          + Add Category
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3.5 px-4">Category Name</th>
              <th class="py-3.5 px-4">Slug</th>
              <th class="py-3.5 px-4">Product Count</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="c in categories" :key="c.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-bold text-slate-900 font-serif text-sm">
                {{ c.name }}
              </td>
              <td class="py-3 px-4 font-mono text-slate-500">{{ c.slug }}</td>
              <td class="py-3 px-4 font-semibold text-slate-800">{{ c._count?.products || 0 }} products</td>
              <td class="py-3 px-4">
                <span :class="[c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700']" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {{ c.isActive ? 'Active' : 'Disabled' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <button v-if="authStore.hasPermission('categories.write')" @click="openModal(c)" class="text-indigo-600 font-semibold">Edit</button>
                <button v-if="authStore.hasPermission('categories.write')" @click="deleteCategory(c.id)" class="text-rose-600 font-semibold">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
          <h2 class="font-serif font-bold text-lg text-slate-900">{{ editingId ? 'Edit Category' : 'Create Category' }}</h2>
          <form @submit.prevent="saveCategory" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Name *</label>
              <input v-model="form.name" @input="autoSlug" type="text" required class="w-full px-3 py-2 rounded-xl border" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Slug *</label>
              <input v-model="form.slug" type="text" required class="w-full px-3 py-2 rounded-xl border" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Image URL</label>
              <input v-model="form.imageUrl" type="url" class="w-full px-3 py-2 rounded-xl border" />
            </div>
            <div class="flex items-center space-x-2">
              <input v-model="form.isActive" type="checkbox" id="catActive" class="rounded" />
              <label for="catActive" class="font-semibold text-slate-700">Active on Storefront</label>
            </div>
            <div class="flex justify-end space-x-2 pt-3 border-t">
              <button type="button" @click="showModal = false" class="px-4 py-2 rounded-xl border text-xs">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">Save</button>
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
const categories = ref<any[]>([]);
const showModal = ref(false);
const editingId = ref<string | null>(null);

const form = ref({ name: '', slug: '', imageUrl: '', isActive: true });

const autoSlug = () => {
  if (!editingId.value) {
    form.value.slug = form.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
};

const fetchCategories = async () => {
  const res = await fetch('http://localhost:3000/api/v1/admin/categories', {
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  categories.value = await res.json();
};

const openModal = (cat: any = null) => {
  if (cat) {
    editingId.value = cat.id;
    form.value = { name: cat.name, slug: cat.slug, imageUrl: cat.imageUrl || '', isActive: cat.isActive };
  } else {
    editingId.value = null;
    form.value = { name: '', slug: '', imageUrl: '', isActive: true };
  }
  showModal.value = true;
};

const saveCategory = async () => {
  const method = editingId.value ? 'PATCH' : 'POST';
  const url = editingId.value 
    ? `http://localhost:3000/api/v1/admin/categories/${editingId.value}` 
    : 'http://localhost:3000/api/v1/admin/categories';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
    body: JSON.stringify(form.value),
  });

  showModal.value = false;
  fetchCategories();
};

const deleteCategory = async (id: string) => {
  if (!confirm('Delete category?')) return;
  await fetch(`http://localhost:3000/api/v1/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  fetchCategories();
};

onMounted(fetchCategories);
</script>
