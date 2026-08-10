<template>
  <main class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 flex-1 min-h-screen">
    
    <div v-if="loading" class="animate-pulse space-y-8">
      <div class="h-96 bg-slate-100 rounded-3xl max-w-4xl mx-auto"></div>
    </div>

    <div v-else-if="!product" class="py-20 text-center">
      <h1 class="font-serif text-2xl font-black text-[#1A170F]">Product Not Found</h1>
      <NuxtLink to="/products" class="mt-4 inline-block px-6 py-3 rounded-2xl bg-[#E04F26] text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-md">
        Return to Catalog
      </NuxtLink>
    </div>

    <div v-else class="space-y-16">
      
      <!-- PDP Main Content: Well-proportioned gallery and natural info column flow -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        <!-- Gallery Column -->
        <div class="space-y-3">
          <!-- Main Image Display with Lightbox Click Trigger -->
          <div 
            @click="isLightboxOpen = true"
            class="max-h-110 sm:max-h-[480px] lg:max-h-[500px] aspect-4/5 w-full rounded-3xl overflow-hidden bg-[#FAF6F1] border border-[#E4D8CC] shadow-md relative group cursor-zoom-in"
            title="Click to view full image & zoom"
          >
            <img 
              :src="activeMainImage" 
              :alt="product.name" 
              class="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />


            <!-- Stock Status Badges -->
            <span 
              v-if="selectedVariant && selectedVariant.stockQuantity <= 0"
              class="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md"
            >
              Out of Stock
            </span>
            <span 
              v-else-if="selectedVariant && selectedVariant.stockQuantity < 5"
              class="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md"
            >
              Only {{ selectedVariant.stockQuantity }} Left
            </span>
          </div>

          <!-- Thumbnails Gallery Row -->
          <div v-if="allImages.length > 0" class="flex space-x-3 overflow-x-auto pb-1 pt-1 shrink-0">
            <button 
              v-for="(img, idx) in allImages" 
              :key="img.id || idx"
              @click="selectedImage = img.url"
              :class="[
                activeMainImage === img.url 
                  ? 'ring-2 ring-[#1A170F] scale-95 opacity-100 border-transparent shadow-md' 
                  : 'opacity-65 hover:opacity-100 hover:scale-105 border-[#E4D8CC]'
              ]"
              class="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF6F1] shrink-0 border transition-all duration-200 cursor-pointer"
            >
              <img :src="img.url" :alt="img.altText || product.name" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Info Column -->
        <div class="space-y-6 sm:space-y-8">
          <div>
            <span class="text-xs uppercase tracking-widest text-[#E04F26] font-bold">
              {{ product.category?.name || 'Apparel' }}
            </span>
            <h1 class="font-serif text-3xl sm:text-4xl font-black text-[#1A170F] mt-1">
              {{ product.name }}
            </h1>
            <p class="text-2xl font-extrabold text-[#1A170F] mt-3 tnum">
              Rp{{ formatPrice(currentPrice) }}
            </p>
          </div>

          <!-- Color Selector -->
          <div v-if="availableColors.length">
            <label class="block text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-2">
              Color: <span class="text-[#E04F26] font-extrabold">{{ selectedColor }}</span>
            </label>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="color in availableColors" 
                :key="color"
                @click="selectColor(color)"
                :class="[selectedColor === color ? 'pill-flat-selected' : 'pill-flat']"
                class="px-4 py-2 text-xs transition cursor-pointer font-medium"
              >
                {{ color }}
              </button>
            </div>
          </div>

          <!-- Clean Modern Flat Size Selector Pills -->
          <div v-if="availableSizes.length">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-[#1A3D63]">
                Select Size
              </label>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="variant in filteredVariants" 
                :key="variant.id"
                @click="selectVariant(variant)"
                :disabled="variant.stockQuantity <= 0"
                :class="[
                  selectedVariant?.id === variant.id ? 'pill-flat-selected' : 'pill-flat',
                  variant.stockQuantity <= 0 ? 'opacity-40 line-through cursor-not-allowed' : 'cursor-pointer'
                ]"
                class="px-4 py-2.5 text-xs transition min-w-[50px] text-center font-medium"
              >
                {{ variant.size }}
                <span v-if="variant.stockQuantity <= 0" class="block text-[9px] no-underline">OOS</span>
              </button>
            </div>
          </div>

          <!-- Quantity Stepper & Add to Cart -->
          <div class="space-y-4 pt-4 border-t border-[#E4D8CC]">
            <div class="flex items-center space-x-4">
              <label class="text-xs font-bold uppercase tracking-wider text-[#1A170F]">Quantity</label>
              <div class="flex items-center space-x-2">
                <button 
                  @click="quantity > 1 && quantity--" 
                  :disabled="quantity <= 1"
                  class="w-9 h-9 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] flex items-center justify-center text-sm font-bold text-[#1A170F] disabled:opacity-30 cursor-pointer hover:bg-[#F4ECE5]"
                >
                  -
                </button>
                <span class="w-10 text-center font-bold text-sm text-[#1A170F]">{{ quantity }}</span>
                <button 
                  @click="quantity < (selectedVariant?.stockQuantity || 1) && quantity++" 
                  :disabled="!selectedVariant || quantity >= selectedVariant.stockQuantity"
                  class="w-9 h-9 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] flex items-center justify-center text-sm font-bold text-[#1A170F] disabled:opacity-30 cursor-pointer hover:bg-[#F4ECE5]"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Primary CTA Button -->
            <button 
              @click="handleAddToCart"
              :disabled="!selectedVariant || selectedVariant.stockQuantity <= 0 || adding"
              :class="[
                !selectedVariant || selectedVariant.stockQuantity <= 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50' 
                  : 'bg-[#E04F26] hover:bg-[#C8431E] text-white shadow-xl'
              ]"
              class="w-full py-4 rounded-2xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 cursor-pointer transition-all duration-200"
            >
              <span>{{ selectedVariant?.stockQuantity <= 0 ? 'Out of Stock' : (adding ? 'ADDING TO CART...' : '+ ADD TO CART') }}</span>
            </button>
          </div>

          <!-- Accordion Details immediately following Add to Cart CTA -->
          <div class="pt-6 border-t border-[#B3CFE5]/50 space-y-4">
            <details class="group">
              <summary class="flex justify-between items-center font-serif font-bold text-[#0A1931] cursor-pointer list-none text-sm">
                <span>Description & Fabric Care</span>
                <span class="transition group-open:rotate-180">↓</span>
              </summary>
              <p class="mt-3 text-xs leading-relaxed text-[#1A3D63] font-light">
                {{ product.description || 'Handcrafted premium apparel crafted with precision tailoring and sustainable fabric selection.' }}
              </p>
            </details>

            <details class="group">
              <summary class="flex justify-between items-center font-serif font-bold text-[#0A1931] cursor-pointer list-none text-sm">
                <span>WhatsApp Ordering & Shipping</span>
                <span class="transition group-open:rotate-180">↓</span>
              </summary>
              <p class="mt-3 text-xs leading-relaxed text-[#1A3D63] font-light">
                Orders are generated instantly and handed off to WhatsApp. Shipping costs and delivery estimates are confirmed directly with our team.
              </p>
            </details>
          </div>

        </div>

      </div>

      <!-- Related Products Section ("You May Also Like") -->
      <section v-if="relatedProducts.length" class="pt-12 border-t border-[#B3CFE5]/50 space-y-6">
        <div class="flex justify-between items-end">
          <div>
            <span class="text-xs uppercase tracking-widest text-[#4A7FA7] font-semibold">Curated Recommendations</span>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-[#0A1931] mt-1">You May Also Like</h2>
          </div>
          <NuxtLink to="/products" class="text-xs font-semibold text-[#4A7FA7] hover:text-[#0A1931] transition cursor-pointer">
            Explore All Catalog →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="rel in relatedProducts" 
            :key="rel.id"
            :class="[
              isProductInStock(rel) 
                ? 'bg-[#FAF6F1] text-[#1A170F]' 
                : 'bg-[#FAF6F1]/80 text-[#1A170F]/70 border-[#E4D8CC]/80'
            ]"
            class="group rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E4D8CC] hover:border-[#E04F26] flex flex-col justify-between overflow-hidden h-[420px] sm:h-[460px]"
          >
            <!-- Top Portion: Dedicated Clickable Navigation Area (Always Clickable) -->
            <div 
              @click="navigateToProduct(rel.slug)"
              class="flex-1 flex flex-col min-h-0 cursor-pointer"
            >
              <!-- Tall Image container (occupies flex-1, shrinks internally on hover) -->
              <div class="relative w-full flex-1 rounded-2xl overflow-hidden bg-slate-200 min-h-0 transition-all duration-300 ease-in-out">
                <img 
                  :src="rel.productImages?.[0]?.url || 'https://via.placeholder.com/400x500'" 
                  :alt="rel.name" 
                  :class="[
                    isProductInStock(rel) 
                      ? 'opacity-100 group-hover:scale-105' 
                      : 'opacity-60 grayscale-[35%] group-hover:scale-105'
                  ]"
                  class="w-full h-full object-cover object-top transition-all duration-500" 
                />
                
                <!-- Status Badges -->
                <span 
                  v-if="!isProductInStock(rel)"
                  class="absolute top-3 left-3 bg-[#1A170F]/80 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md z-10"
                >
                  OUT OF STOCK
                </span>
                <span 
                  v-else
                  class="absolute top-3 left-3 bg-[#1A170F] text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md z-10"
                >
                  {{ rel.category?.name || 'Apparel' }}
                </span>
              </div>

              <!-- Product Title & Price -->
              <div class="px-1 pt-3 shrink-0">
                <h3 
                  :class="[isProductInStock(rel) ? 'text-[#1A170F] group-hover:text-[#E04F26]' : 'text-[#1A170F]/60']"
                  class="font-serif font-bold text-sm transition leading-snug line-clamp-1"
                >
                  {{ rel.name }}
                </h3>
                <p 
                  :class="[isProductInStock(rel) ? 'text-[#1A170F]' : 'text-[#1A170F]/60']"
                  class="text-xs font-extrabold mt-1 tnum"
                >
                  Rp{{ formatPrice(rel.basePrice) }}
                </p>
              </div>
            </div>

            <!-- Bottom Portion: Isolated ADD TO CART Button -->
            <div 
              @click.stop.prevent
              class="max-h-0 opacity-0 translate-y-2 group-hover:max-h-14 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-3 transition-all duration-300 ease-in-out shrink-0 overflow-hidden"
            >
              <button 
                v-if="isProductInStock(rel)"
                type="button"
                @click.stop.prevent="quickAddToCart(rel, $event)"
                :disabled="addingRelId === rel.id"
                class="w-full py-2.5 rounded-xl border-2 border-[#1A170F] text-[#1A170F] hover:bg-[#1A170F] hover:text-[#F4ECE5] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span v-if="addedRelId === rel.id" class="text-emerald-700 font-black">ADDED ✓</span>
                <span v-else-if="addingRelId === rel.id">ADDING...</span>
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

    <!-- Product Lightbox Modal Component -->
    <ProductLightbox
      :is-open="isLightboxOpen"
      :images="allImages"
      :selected-index="lightboxIndex"
      :product-name="product?.name"
      @close="isLightboxOpen = false"
      @select="handleLightboxSelect"
    />

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import ProductLightbox from '~/components/ProductLightbox.vue';

const route = useRoute();
const cartStore = useCartStore();
const { fetchApi } = useApi();

const product = ref<any>(null);
const relatedProducts = ref<any[]>([]);
const loading = ref(true);
const adding = ref(false);
const addingRelId = ref<string | null>(null);
const addedRelId = ref<string | null>(null);

const isProductInStock = (prod: any) => {
  const variants = prod?.productVariants || prod?.variants || [];
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

const isLightboxOpen = ref(false);

const selectedImage = ref<string>('');
const selectedColor = ref<string>('');
const selectedVariant = ref<any>(null);
const quantity = ref<number>(1);

const navigateToProduct = (slug: string) => {
  navigateTo(`/products/${slug}`);
};

const quickAddToCart = async (relProduct: any, e: Event) => {
  e.preventDefault();
  e.stopPropagation();

  if (addingRelId.value) return;

  try {
    addingRelId.value = relProduct.id;
    let variantId = relProduct.variants?.[0]?.id;

    if (!variantId) {
      const fullProd = await fetchApi<any>(`/products/${relProduct.slug}`).catch(() => null);
      variantId = fullProd?.variants?.[0]?.id;
    }

    if (variantId) {
      await cartStore.addItem(variantId, 1);
      addedRelId.value = relProduct.id;
      cartStore.isDrawerOpen = true;

      setTimeout(() => {
        if (addedRelId.value === relProduct.id) {
          addedRelId.value = null;
        }
      }, 2000);
    } else {
      navigateToProduct(relProduct.slug);
    }
  } catch (err) {
    console.error('Quick Add to Cart Error:', err);
  } finally {
    addingRelId.value = null;
  }
};

const allImages = computed(() => {
  if (!product.value) return [];
  if (product.value.productImages && product.value.productImages.length > 0) {
    return product.value.productImages;
  }
  return [];
});

const activeMainImage = computed(() => {
  if (selectedImage.value) return selectedImage.value;
  if (product.value?.productImages?.[0]?.url) return product.value.productImages[0].url;
  return 'https://via.placeholder.com/600x800';
});

const lightboxIndex = computed(() => {
  if (!allImages.value.length) return 0;
  const idx = allImages.value.findIndex((img: any) => img.url === activeMainImage.value);
  return idx >= 0 ? idx : 0;
});

const handleLightboxSelect = (idx: number) => {
  if (allImages.value[idx]?.url) {
    selectedImage.value = allImages.value[idx].url;
  }
};

const availableColors = computed(() => {
  if (!product.value?.productVariants) return [];
  const colors = product.value.productVariants.map((v: any) => v.color).filter(Boolean);
  return [...new Set(colors)] as string[];
});

const filteredVariants = computed(() => {
  if (!product.value?.productVariants) return [];
  if (!selectedColor.value) return product.value.productVariants;
  return product.value.productVariants.filter((v: any) => v.color === selectedColor.value);
});

const availableSizes = computed(() => {
  return filteredVariants.value.map((v: any) => v.size).filter(Boolean);
});

const currentPrice = computed(() => {
  if (selectedVariant.value?.priceOverride) return selectedVariant.value.priceOverride;
  return product.value?.basePrice || 0;
});

const selectColor = (color: string) => {
  selectedColor.value = color;
  const firstMatch = filteredVariants.value[0];
  if (firstMatch) {
    selectVariant(firstMatch);
  }
};

const selectVariant = (variant: any) => {
  selectedVariant.value = variant;
  quantity.value = 1;
};

const toast = useToast();

const handleAddToCart = async () => {
  if (!selectedVariant.value) return;
  try {
    adding.value = true;
    await cartStore.addItem(selectedVariant.value.id, quantity.value);

    // Trigger Sonner-style toast notification
    const variantDesc = [selectedColor.value, selectedVariant.value.size].filter(Boolean).join(' / ');
    toast.showAddedToCart(
      product.value?.name || 'Item',
      variantDesc,
      activeMainImage.value
    );
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to add item to cart');
  } finally {
    adding.value = false;
  }
};

const fetchProductData = async () => {
  const slug = route.params.slug as string;
  if (!slug) return;

  try {
    loading.value = true;
    const [pData, relData] = await Promise.all([
      fetchApi<any>(`/products/${slug}`),
      fetchApi<any[]>(`/products/${slug}/related`).catch(() => []),
    ]);

    product.value = pData;
    relatedProducts.value = sortInStockFirst(relData || []);

    if (pData?.productImages?.length) {
      selectedImage.value = pData.productImages[0].url;
    }

    if (pData?.productVariants?.length) {
      selectedColor.value = pData.productVariants[0].color || '';
      selectedVariant.value = pData.productVariants[0];
    }
  } catch (e) {
    console.error('Error loading product by slug:', e);
    product.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProductData();
});

watch(() => route.params.slug, () => {
  fetchProductData();
});

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
