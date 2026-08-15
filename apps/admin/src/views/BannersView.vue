<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-serif font-bold text-slate-900">Marketing Banners</h1>
          <p class="text-xs text-slate-500 mt-1">Manage hero banners and promo strips for the storefront</p>
        </div>
        <button v-if="authStore.hasPermission('banners.write')" @click="openModal()" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
          + Add Banner
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="b in banners" :key="b.id" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <img v-if="b.imageUrl" :src="b.imageUrl" :alt="b.title" class="w-full h-40 object-cover" />
          <div class="p-4 space-y-2 text-xs">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{{ b.placement }}</span>
                <h3 class="font-serif font-bold text-slate-900 text-sm mt-1">{{ b.title || 'Untitled Banner' }}</h3>
              </div>
              <span :class="[b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700']" class="px-2 py-0.5 rounded text-[10px] font-bold">
                {{ b.isActive ? 'Active' : 'Draft' }}
              </span>
            </div>
            <p class="text-slate-500">{{ b.subtitle }}</p>
            <p class="text-slate-400 text-[10px]" v-if="b.linkUrl">Target: {{ b.linkUrl }}</p>
            <div class="pt-3 border-t flex justify-end space-x-2">
              <button v-if="authStore.hasPermission('banners.write')" @click="openModal(b)" class="text-indigo-600 font-semibold">Edit</button>
              <button v-if="authStore.hasPermission('banners.write')" @click="deleteBanner(b.id)" class="text-rose-600 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-xs">
          <h2 class="font-serif font-bold text-lg text-slate-900">{{ editingId ? 'Edit Banner' : 'Create Banner' }}</h2>
          <form @submit.prevent="saveBanner" class="space-y-3">
            <div>
              <label class="block font-semibold">Placement</label>
              <select v-model="form.placement" class="w-full p-2 border rounded-xl bg-white">
                <option value="hero">Hero Carousel</option>
                <option value="promo_strip">Promo Strip</option>
                <option value="category_page">Category Header</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold">Title</label>
              <input v-model="form.title" type="text" class="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label class="block font-semibold">Subtitle</label>
              <input v-model="form.subtitle" type="text" class="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label class="block font-semibold">Image URL *</label>
              <input v-model="form.imageUrl" type="url" required class="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label class="block font-semibold">Link Target URL</label>
              <input v-model="form.linkUrl" type="text" class="w-full p-2 border rounded-xl" />
            </div>
            <div class="flex justify-end space-x-2 pt-3 border-t">
              <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-xl">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl">Save Banner</button>
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
const banners = ref<any[]>([]);
const showModal = ref(false);
const editingId = ref<string | null>(null);

const form = ref({ placement: 'hero', title: '', subtitle: '', imageUrl: '', linkUrl: '', isActive: true });

const fetchBanners = async () => {
  const res = await fetch('http://localhost:3000/api/v1/admin/banners', {
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  banners.value = await res.json();
};

const openModal = (b: any = null) => {
  if (b) {
    editingId.value = b.id;
    form.value = { placement: b.placement, title: b.title || '', subtitle: b.subtitle || '', imageUrl: b.imageUrl, linkUrl: b.linkUrl || '', isActive: b.isActive };
  } else {
    editingId.value = null;
    form.value = { placement: 'hero', title: '', subtitle: '', imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d', linkUrl: '/products', isActive: true };
  }
  showModal.value = true;
};

const saveBanner = async () => {
  const method = editingId.value ? 'PATCH' : 'POST';
  const url = editingId.value ? `http://localhost:3000/api/v1/admin/banners/${editingId.value}` : 'http://localhost:3000/api/v1/admin/banners';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
    body: JSON.stringify(form.value),
  });

  showModal.value = false;
  fetchBanners();
};

const deleteBanner = async (id: string) => {
  if (!confirm('Delete banner?')) return;
  await fetch(`http://localhost:3000/api/v1/admin/banners/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authStore.token}` },
  });
  fetchBanners();
};

onMounted(fetchBanners);
</script>
