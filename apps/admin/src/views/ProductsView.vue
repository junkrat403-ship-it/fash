<template>
  <AdminLayout>
    <div class="space-y-6">

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-serif font-bold text-slate-900">Product Management</h1>
          <p class="text-xs text-slate-500 mt-1">Manage catalog items, pricing, variants, and visibility</p>
        </div>

        <button 
          v-if="authStore.hasPermission('products.write')"
          @click="openModal()"
          class="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-md flex items-center space-x-1.5"
        >
          <span>+ Add New Product</span>
        </button>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-4">
        <input 
          v-model="searchQuery" 
          @input="debounceSearch"
          type="text" 
          placeholder="Search products by name, SKU prefix, slug..." 
          class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        <select 
          v-model="statusFilter" 
          @change="fetchProducts"
          class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div v-if="loading" class="p-12 text-center text-xs text-slate-400">
          Loading products...
        </div>

        <div v-else-if="!products.length" class="p-12 text-center text-slate-500 text-xs">
          No products found. Click "+ Add New Product" to create one.
        </div>

        <table v-else class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3.5 px-4">Product</th>
              <th class="py-3.5 px-4">Category</th>
              <th class="py-3.5 px-4">Base Price</th>
              <th class="py-3.5 px-4">Variants</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="p in products" :key="p.id" class="hover:bg-slate-50/80 transition">
              <td class="py-3 px-4">
                <div class="flex items-center space-x-3">
                  <img 
                    :src="p.productImages?.[0]?.url || 'https://via.placeholder.com/60'" 
                    :alt="p.name" 
                    class="w-10 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200"
                  />
                  <div>
                    <div class="font-bold text-slate-900 font-serif text-sm">{{ p.name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">/products/{{ p.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                {{ p.category?.name || 'Unassigned' }}
              </td>
              <td class="py-3 px-4 font-bold text-slate-900">
                Rp{{ formatPrice(p.basePrice) }}
              </td>
              <td class="py-3 px-4">
                <span class="bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded text-[11px]">
                  {{ p.productVariants?.length || 0 }} variant(s)
                </span>
              </td>
              <td class="py-3 px-4">
                <span 
                  :class="[
                    p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 
                    p.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  ]"
                  class="capitalize px-2.5 py-1 rounded-full text-[10px] font-bold"
                >
                  {{ p.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <button 
                  v-if="authStore.hasPermission('products.write')"
                  @click="openModal(p)"
                  class="text-indigo-600 hover:text-indigo-900 font-semibold text-xs"
                >
                  Edit
                </button>
                <button 
                  v-if="authStore.hasPermission('products.write')"
                  @click="deleteProduct(p.id)"
                  class="text-rose-600 hover:text-rose-900 font-semibold text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          
          <div class="flex justify-between items-center pb-4 border-b border-slate-200">
            <h2 class="font-serif font-bold text-lg text-slate-900">
              {{ editingId ? 'Edit Product' : 'Create New Product' }}
            </h2>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-6 text-xs">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Product Name *</label>
                <input v-model="form.name" @input="autoSlug" type="text" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Slug *</label>
                <input v-model="form.slug" type="text" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                <select v-model="form.categoryId" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white">
                  <option value="">Unassigned</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Base Price (IDR) *</label>
                <input v-model.number="form.basePrice" type="number" min="0" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs" />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                <select v-model="form.status" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 uppercase tracking-wider mb-1">Primary Image URL</label>
              <input v-model="form.imageUrl" type="url" placeholder="https://images.unsplash.com/..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs" />
            </div>

            <div v-if="!editingId" class="pt-4 border-t border-slate-200 space-y-3">
              <div class="flex justify-between items-center">
                <h3 class="font-bold text-slate-900">Product Variants & Initial Stock</h3>
                <button type="button" @click="addVariantRow" class="text-xs font-semibold text-indigo-600">+ Add Variant</button>
              </div>

              <div v-for="(v, idx) in form.variants" :key="idx" class="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-5 gap-2 items-center">
                <input v-model="v.sku" type="text" placeholder="SKU" required class="px-2 py-1.5 rounded border text-xs" />
                <input v-model="v.size" type="text" placeholder="Size (M)" class="px-2 py-1.5 rounded border text-xs" />
                <input v-model="v.color" type="text" placeholder="Color (Black)" class="px-2 py-1.5 rounded border text-xs" />
                <input v-model.number="v.stockQuantity" type="number" min="0" placeholder="Initial Stock" required class="px-2 py-1.5 rounded border text-xs" />
                <button type="button" @click="removeVariantRow(idx)" class="text-rose-600 font-bold text-xs">Remove</button>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <button type="button" @click="showModal = false" class="px-4 py-2 rounded-xl border text-slate-700 text-xs font-semibold">Cancel</button>
              <button type="submit" :disabled="saving" class="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800">
                {{ saving ? 'Saving...' : 'Save Product' }}
              </button>
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
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);
const showModal = ref(false);
const editingId = ref<string | null>(null);

const searchQuery = ref('');
const statusFilter = ref('');

const form = ref({
  name: '',
  slug: '',
  categoryId: '',
  basePrice: 199000,
  status: 'published',
  description: '',
  imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
  variants: [
    { sku: '', size: 'M', color: 'Black', stockQuantity: 10 },
  ],
});

const autoSlug = () => {
  if (!editingId.value) {
    form.value.slug = form.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (form.value.variants.length && form.value.name) {
      form.value.variants[0].sku = 'SKU-' + form.value.slug.toUpperCase() + '-M-BLK';
    }
  }
};

const addVariantRow = () => {
  form.value.variants.push({ sku: `SKU-${Date.now()}`, size: 'L', color: 'Black', stockQuantity: 10 });
};

const removeVariantRow = (idx: number) => {
  form.value.variants.splice(idx, 1);
};

let debounceTimer: any = null;
const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchProducts();
  }, 400);
};

const fetchProducts = async () => {
  try {
    loading.value = true;
    const url = `http://localhost:3000/api/v1/admin/products?q=${searchQuery.value}&status=${statusFilter.value}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    products.value = data.items || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/v1/admin/categories', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    categories.value = await res.json();
  } catch {}
};

const openModal = (product: any = null) => {
  if (product && typeof product === 'object' && 'id' in product && typeof product.id === 'string') {
    editingId.value = product.id;
    form.value = {
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId || '',
      basePrice: Number(product.basePrice),
      status: product.status,
      description: product.description || '',
      imageUrl: product.productImages?.[0]?.url || '',
      variants: [],
    };
  } else {
    editingId.value = null;
    form.value = {
      name: '',
      slug: '',
      categoryId: '',
      basePrice: 199000,
      status: 'published',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
      variants: [{ sku: 'SKU-ITEM-M-BLK', size: 'M', color: 'Black', stockQuantity: 10 }],
    };
  }
  showModal.value = true;
};

const saveProduct = async () => {
  try {
    saving.value = true;
    const method = editingId.value ? 'PATCH' : 'POST';
    const url = editingId.value 
      ? `http://localhost:3000/api/v1/admin/products/${editingId.value}`
      : 'http://localhost:3000/api/v1/admin/products';

    const body: any = {
      name: form.value.name,
      slug: form.value.slug,
      categoryId: form.value.categoryId || undefined,
      basePrice: form.value.basePrice,
      status: form.value.status,
      description: form.value.description,
    };

    if (!editingId.value) {
      body.images = [{ url: form.value.imageUrl, isPrimary: true }];
      body.variants = form.value.variants;
    }

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Save failed');
    }

    showModal.value = false;
    await fetchProducts();
  } catch (e: any) {
    alert(e.message);
  } finally {
    saving.value = false;
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  try {
    await fetch(`http://localhost:3000/api/v1/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    await fetchProducts();
  } catch (e) {
    alert('Failed to delete product');
  }
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
