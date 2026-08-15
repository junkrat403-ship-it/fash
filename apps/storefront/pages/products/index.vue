<template>
  <main ref="catalogTopRef" class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 flex-1 flex flex-col justify-between min-h-[calc(100vh-80px)] w-full">
    
    <div>
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 sm:pb-8 border-b border-[#E4D8CC] gap-4">
        <div>
          <h1 class="font-serif text-2xl sm:text-4xl font-black text-[#1A170F]">Catalog Collection</h1>
          <p class="text-xs text-[#1A170F]/70 mt-1 font-light">Showing {{ meta.total }} product(s)</p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div class="relative flex-1 md:w-64 min-w-[180px]">
            <input 
              v-model="filters.q" 
              @input="debounceSearch"
              type="text" 
              placeholder="Search catalog..." 
              class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E4D8CC] text-xs bg-[#FAF6F1] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F]"
            />
            <svg class="w-4 h-4 absolute left-3 top-3 text-[#1A170F]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>

          <select 
            v-model="filters.sort" 
            @change="fetchProducts"
            class="px-3 py-2.5 rounded-xl border border-[#E4D8CC] text-xs bg-[#FAF6F1] focus:outline-none focus:ring-2 focus:ring-[#E04F26] font-medium text-[#1A170F]"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="bestselling">Best Selling</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <button 
            @click="mobileFilterOpen = true"
            class="lg:hidden px-3.5 py-2.5 rounded-xl bg-[#1A170F] text-[#F4ECE5] hover:bg-[#E04F26] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
            </svg>
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 pt-4">
        <span class="text-xs text-[#1A170F]/70 font-medium">Active Filters:</span>
        <span v-if="filters.q" class="inline-flex items-center gap-1.5 text-xs bg-[#1A170F] text-[#F4ECE5] px-3 py-1 rounded-full shadow-xs">
          Search: {{ filters.q }}
          <button @click="clearFilter('q')" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove search filter">×</button>
        </span>
        <span v-if="filters.category" class="inline-flex items-center gap-1.5 text-xs bg-[#1A170F] text-[#F4ECE5] px-3 py-1 rounded-full shadow-xs">
          Category: {{ filters.category }}
          <button @click="clearFilter('category')" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove category filter">×</button>
        </span>
        <span v-if="filters.size" class="inline-flex items-center gap-1.5 text-xs bg-[#1A170F] text-[#F4ECE5] px-3 py-1 rounded-full shadow-xs">
          Size: {{ filters.size }}
          <button @click="clearFilter('size')" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove size filter">×</button>
        </span>
        <span v-if="filters.color" class="inline-flex items-center gap-1.5 text-xs bg-[#1A170F] text-[#F4ECE5] px-3 py-1 rounded-full shadow-xs">
          Color: {{ filters.color }}
          <button @click="clearFilter('color')" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove color filter">×</button>
        </span>
        <span v-if="filters.maxPrice" class="inline-flex items-center gap-1.5 text-xs bg-[#1A170F] text-[#F4ECE5] px-3 py-1 rounded-full shadow-xs">
          Max Price: Rp{{ formatPrice(filters.maxPrice) }}
          <button @click="clearFilter('maxPrice')" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove price filter">×</button>
        </span>
        <button @click="clearAllFilters" class="text-xs text-[#E04F26] font-semibold underline cursor-pointer hover:text-[#1A170F] ml-1">Reset All</button>
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        <aside class="hidden lg:block space-y-8 pr-6 border-r border-[#E4D8CC] sticky top-28 self-start max-h-[calc(100vh-130px)] overflow-y-auto">

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Categories</h3>
            <div class="space-y-2">
              <button 
                @click="setCategory('')"
                :class="[!filters.category ? 'font-bold text-[#E04F26]' : 'text-[#1A170F]/80']"
                class="block text-xs hover:text-[#E04F26] transition text-left cursor-pointer"
              >
                All Categories
              </button>
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="setCategory(cat.slug)"
                :class="[filters.category === cat.slug ? 'font-bold text-[#E04F26]' : 'text-[#1A170F]/80']"
                class="block text-xs hover:text-[#E04F26] transition text-left cursor-pointer"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Sizes</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="size in availableSizes" 
                :key="size"
                @click="toggleSize(size)"
                :class="[filters.size === size ? 'bg-[#1A170F] text-[#F4ECE5]' : 'bg-[#FAF6F1] text-[#1A170F] border border-[#E4D8CC]']"
                class="w-9 h-9 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center justify-center"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Colors</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="c in availableColors" 
                :key="c"
                @click="toggleColor(c)"
                :class="[filters.color === c ? 'bg-[#1A170F] text-[#F4ECE5]' : 'bg-[#FAF6F1] text-[#1A170F] border border-[#E4D8CC]']"
                class="px-3 py-1.5 text-xs font-medium rounded-xl transition cursor-pointer"
              >
                {{ c }}
              </button>
            </div>
          </div>

        </aside>

        <section class="lg:col-span-3">
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
          </div>

          <div v-else-if="!products.length" class="py-20 text-center bg-[#FAF6F1] rounded-3xl border border-[#E4D8CC]">
            <p class="text-lg font-serif font-black text-[#1A170F]">No products match your criteria</p>
            <p class="text-xs text-[#1A170F]/70 mt-1 font-light">Try clearing some filters or searching for another term.</p>
            <button @click="clearAllFilters" class="mt-4 px-5 py-2.5 rounded-xl bg-[#E04F26] text-white text-xs font-bold uppercase tracking-wider">
              Clear All Filters
            </button>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="p in products" 
              :key="p.id"
              :class="[
                isProductInStock(p) 
                  ? 'bg-[#FAF6F1] text-[#1A170F]' 
                  : 'bg-[#FAF6F1]/80 text-[#1A170F]/70 border-[#E4D8CC]/80'
              ]"
              class="group rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E4D8CC] hover:border-[#E04F26] flex flex-col justify-between overflow-hidden h-[450px] sm:h-[490px]"
            >
              
              <div 
                @click="navigateToProduct(p.slug)"
                class="flex-1 flex flex-col min-h-0 cursor-pointer"
              >
                
                <div class="relative w-full flex-1 rounded-2xl overflow-hidden bg-slate-200 min-h-0 transition-all duration-300 ease-in-out">
                  <img 
                    :src="p.productImages?.[0]?.url || 'https://via.placeholder.com/400x500'" 
                    :alt="p.name"
                    loading="lazy"
                    decoding="async"
                    :class="[
                      isProductInStock(p) 
                        ? 'opacity-100 group-hover:scale-105' 
                        : 'opacity-60 grayscale-[35%] group-hover:scale-105'
                    ]"
                    class="w-full h-full object-cover object-top transition-all duration-500"
                  />

                  <span 
                    v-if="!isProductInStock(p)"
                    class="absolute top-3 left-3 bg-[#1A170F]/80 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md z-10"
                  >
                    OUT OF STOCK
                  </span>
                  <span 
                    v-else
                    class="absolute top-3 left-3 bg-[#1A170F] text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md z-10"
                  >
                    {{ p.category?.name || 'Item' }}
                  </span>
                </div>

                <div class="px-1 pt-3 shrink-0">
                  <h3 
                    :class="[isProductInStock(p) ? 'text-[#1A170F] group-hover:text-[#E04F26]' : 'text-[#1A170F]/60']"
                    class="font-serif font-bold text-base transition leading-snug line-clamp-1"
                  >
                    {{ p.name }}
                  </h3>
                  <p 
                    :class="[isProductInStock(p) ? 'text-[#1A170F]' : 'text-[#1A170F]/60']"
                    class="text-sm font-extrabold mt-1 tnum"
                  >
                    Rp{{ formatPrice(p.basePrice) }}
                  </p>
                </div>
              </div>

              <div 
                @click.stop.prevent
                class="max-h-0 opacity-0 translate-y-2 group-hover:max-h-14 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-3 transition-all duration-300 ease-in-out shrink-0 overflow-hidden"
              >
                <button 
                  v-if="isProductInStock(p)"
                  type="button"
                  @click.stop.prevent="quickAddToCart(p, $event)"
                  :disabled="addingProductId === p.id"
                  class="w-full py-2.5 rounded-xl border-2 border-[#1A170F] text-[#1A170F] hover:bg-[#1A170F] hover:text-[#F4ECE5] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <span v-if="addedProductId === p.id" class="text-emerald-700 font-black">ADDED ✓</span>
                  <span v-else-if="addingProductId === p.id">ADDING...</span>
                  <span v-else>ADD TO CART</span>
                </button>

                <button 
                  v-else
                  type="button"
                  disabled
                  class="w-full py-2.5 rounded-xl border-2 border-slate-300 bg-slate-200 text-slate-500 font-extrabold text-xs uppercase tracking-wider cursor-not-allowed opacity-80 flex items-center justify-center"
                >
                  OUT OF STOCK
                </button>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>

    <div v-if="meta.totalPages > 1" class="mt-12 mb-8 flex justify-center items-center gap-2">
      <button 
        @click="changePage(meta.page - 1)" 
        :disabled="meta.page <= 1"
        class="px-4 py-2 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-xs font-bold text-[#1A170F] disabled:opacity-40 cursor-pointer hover:bg-[#F4ECE5]"
      >
        Previous
      </button>
      <span class="text-xs text-[#1A170F]/80 px-3 font-semibold">Page {{ meta.page }} of {{ meta.totalPages }}</span>
      <button 
        @click="changePage(meta.page + 1)" 
        :disabled="meta.page >= meta.totalPages"
        class="px-4 py-2 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-xs font-bold text-[#1A170F] disabled:opacity-40 cursor-pointer hover:bg-[#F4ECE5]"
      >
        Next
      </button>
    </div>

    <div 
      v-if="mobileFilterOpen" 
      class="lg:hidden fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity"
      @click="mobileFilterOpen = false"
    >
      <div 
        class="bg-[#FAF6F1] text-[#1A170F] w-full max-w-xs h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl border-l border-[#E4D8CC]"
        @click.stop
      >
        <div class="space-y-6">
          <div class="flex justify-between items-center pb-4 border-b border-[#E4D8CC]">
            <h2 class="font-serif text-lg font-bold text-[#1A170F]">Filter Products</h2>
            <button 
              @click="mobileFilterOpen = false" 
              class="p-1 rounded-lg text-[#1A170F]/60 hover:text-[#1A170F] hover:bg-[#E4D8CC]/40 transition text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Categories</h3>
            <div class="space-y-2">
              <button 
                @click="setCategory(''); mobileFilterOpen = false"
                :class="[!filters.category ? 'font-bold text-[#E04F26] bg-[#F4ECE5]' : 'text-[#1A170F]/80']"
                class="w-full text-left text-xs px-3 py-2 rounded-xl transition cursor-pointer"
              >
                All Categories
              </button>
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="setCategory(cat.slug); mobileFilterOpen = false"
                :class="[filters.category === cat.slug ? 'font-bold text-[#E04F26] bg-[#F4ECE5]' : 'text-[#1A170F]/80']"
                class="w-full text-left text-xs px-3 py-2 rounded-xl transition cursor-pointer"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Sizes</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="size in availableSizes" 
                :key="size"
                @click="toggleSize(size)"
                :class="[filters.size === size ? 'bg-[#1A170F] text-[#F4ECE5]' : 'bg-[#F4ECE5] text-[#1A170F] border border-[#E4D8CC]']"
                class="w-10 h-10 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Colors</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="c in availableColors" 
                :key="c"
                @click="toggleColor(c)"
                :class="[filters.color === c ? 'bg-[#1A170F] text-[#F4ECE5]' : 'bg-[#F4ECE5] text-[#1A170F] border border-[#E4D8CC]']"
                class="px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {{ c }}
              </button>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-[#E4D8CC] space-y-3">
          <button 
            @click="clearAllFilters(); mobileFilterOpen = false"
            class="w-full py-2.5 rounded-xl border border-[#E4D8CC] text-[#1A170F] font-bold text-xs uppercase tracking-wider hover:bg-[#F4ECE5] transition"
          >
            Clear All Filters
          </button>
          <button 
            @click="mobileFilterOpen = false"
            class="w-full py-3 rounded-xl bg-[#E04F26] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-[#C8431E] transition"
          >
            Apply & View Results
          </button>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const router = useRouter();
const { fetchApi } = useApi();
const cartStore = useCartStore();

const products = ref<any[]>([]);
const categories = ref<any[]>([]);

const pageTitle = computed(() => {
  if (route.query.search) return `Search: "${route.query.search}" — Catalog | Jubi & Lee Studio`;
  if (route.query.category) {
    const cat = categories.value.find(c => c.slug === route.query.category);
    if (cat) return `${cat.name} — Catalog | Jubi & Lee Studio`;
  }
  return 'Shop All Apparel — Catalog | Jubi & Lee Studio';
});

useSeoMeta({
  title: pageTitle,
  description: 'Explore our full collection of women\'s luxury apparel, tops, dresses, outerwear, and wardrobe essentials at Jubi & Lee Studio.',
  ogTitle: pageTitle,
  ogDescription: 'Explore our full collection of women\'s luxury apparel at Jubi & Lee Studio.',
});
const loading = ref(true);
const mobileFilterOpen = ref(false);
const addingProductId = ref<string | null>(null);
const addedProductId = ref<string | null>(null);

const isProductInStock = (product: any) => {
  const variants = product?.productVariants || product?.variants || [];
  if (!variants.length) return true;
  return variants.some((v: any) => (v.stockQuantity || 0) > 0 && v.isActive !== false);
};

const sortInStockFirst = (items: any[]) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const aStock = isProductInStock(a) ? 1 : 0;
    const bStock = isProductInStock(b) ? 1 : 0;
    return bStock - aStock;
  });
};

const navigateToProduct = (slug: string) => {
  navigateTo(`/products/${slug}`);
};

const quickAddToCart = async (product: any, e?: Event) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (!isProductInStock(product) || addingProductId.value) return;

  try {
    addingProductId.value = product.id;
    let variants = product.variants || [];
    if (!variants.length) {
      const fullProd = await fetchApi<any>(`/products/${product.slug}`).catch(() => null);
      variants = fullProd?.productVariants || fullProd?.variants || [];
    }

    const defaultVariant = variants.find((v: any) => v.stockQuantity > 0 && v.isActive !== false) || variants[0];
    const variantId = defaultVariant?.id;

    if (variantId) {
      await cartStore.addItem(variantId, 1);
      addedProductId.value = product.id;
      cartStore.isDrawerOpen = true;

      setTimeout(() => {
        if (addedProductId.value === product.id) {
          addedProductId.value = null;
        }
      }, 2000);
    }
  } catch (err: any) {
    console.error('Quick Add to Cart Error:', err);
    alert(err?.data?.message || err?.message || 'Failed to add item to cart');
  } finally {
    addingProductId.value = null;
  }
};

const availableSizes = ['S', 'M', 'L', 'XL', 'One Size'];
const availableColors = ['Black', 'White', 'Beige', 'Navy', 'Olive', 'Brown'];

const filters = ref({
  category: (route.query.category as string) || '',
  size: (route.query.size as string) || '',
  color: (route.query.color as string) || '',
  maxPrice: (route.query.maxPrice as string) || '',
  sort: (route.query.sort as string) || 'newest',
  q: (route.query.q as string) || '',
  page: Number(route.query.page || 1),
});

const meta = ref({
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
});

const catalogTopRef = ref<HTMLElement | null>(null);

const hasActiveFilters = computed(() => {
  return !!(
    filters.value.category ||
    filters.value.size ||
    filters.value.color ||
    filters.value.maxPrice ||
    filters.value.q
  );
});

watch(() => route.query, (newQuery) => {
  filters.value.category = (newQuery.category as string) || '';
  filters.value.size = (newQuery.size as string) || '';
  filters.value.color = (newQuery.color as string) || '';
  filters.value.maxPrice = (newQuery.maxPrice as string) || '';
  filters.value.sort = (newQuery.sort as string) || 'newest';
  filters.value.q = (newQuery.q as string) || '';
  filters.value.page = Number(newQuery.page || 1);
  fetchProducts();
});

let debounceTimer: any = null;
const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    filters.value.page = 1;
    fetchProducts();
  }, 400);
};

const fetchProducts = async () => {
  try {
    loading.value = true;
    const queryParams = new URLSearchParams();
    if (filters.value.category) queryParams.set('category', filters.value.category);
    if (filters.value.size) queryParams.set('size', filters.value.size);
    if (filters.value.color) queryParams.set('color', filters.value.color);
    if (filters.value.maxPrice) queryParams.set('maxPrice', filters.value.maxPrice);
    if (filters.value.sort) queryParams.set('sort', filters.value.sort);
    if (filters.value.q) queryParams.set('q', filters.value.q);
    queryParams.set('page', String(filters.value.page));

    router.replace({ query: Object.fromEntries(queryParams.entries()) });

    const res = await fetchApi<any>(`/products?${queryParams.toString()}`);
    products.value = sortInStockFirst(res.items || []);
    meta.value = res.meta || { total: 0, page: 1, limit: 12, totalPages: 1 };
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const setCategory = (slug: string) => {
  filters.value.category = slug;
  filters.value.page = 1;
  fetchProducts();
};

const toggleSize = (size: string) => {
  filters.value.size = filters.value.size === size ? '' : size;
  filters.value.page = 1;
  fetchProducts();
};

const toggleColor = (c: string) => {
  filters.value.color = filters.value.color === c ? '' : c;
  filters.value.page = 1;
  fetchProducts();
};

const clearFilter = (key: keyof typeof filters.value) => {
  if (key === 'page') {
    filters.value.page = 1;
  } else if (key === 'sort') {
    filters.value.sort = 'newest';
  } else {
    (filters.value[key] as string) = '';
  }
  filters.value.page = 1;
  fetchProducts();
};

const clearAllFilters = () => {
  filters.value = {
    category: '',
    size: '',
    color: '',
    maxPrice: '',
    sort: 'newest',
    q: '',
    page: 1,
  };
  fetchProducts();
};

const changePage = (newPage: number) => {
  if (newPage < 1 || newPage > meta.value.totalPages) return;
  filters.value.page = newPage;
  fetchProducts();
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const formatPrice = (val: any) => {
  return Number(val || 0).toLocaleString('id-ID');
};

onMounted(async () => {
  try {
    const categoriesData = await fetchApi<any[]>('/categories').catch(() => []);
    categories.value = categoriesData || [];
  } catch (e) {
    console.error(e);
  }
  fetchProducts();
});
</script>
