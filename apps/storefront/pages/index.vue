<template>
  <main class="bg-[#F4ECE5] text-[#1A170F] min-h-screen">

    <section ref="heroRef" class="relative pt-16 xs:pt-18 sm:pt-24 pb-0 max-w-[1600px] mx-auto px-4 sm:px-8 h-screen min-h-[560px] max-h-[1080px] flex flex-col justify-between overflow-hidden">

      <div class="flex items-center justify-center gap-4 sm:gap-6 mb-1 sm:mb-2 w-full shrink-0 z-30">
        <div class="h-px bg-[#1A170F]/25 flex-1"></div>
        <span class="text-[9px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#1A170F]/80 shrink-0">
          Jubi & Lee Studio
        </span>
        <div class="h-px bg-[#1A170F]/25 flex-1"></div>
      </div>

      <h1 
        :style="headingParallaxStyle"
        class="font-serif text-[2.75rem] xs:text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[12rem] 2xl:text-[14rem] font-black tracking-tighter leading-[0.84] uppercase text-[#1A170F] opacity-95 select-none text-center shrink-0 z-10 relative"
      >
        PURE<br />COMFORT
      </h1>

      <div 
        :style="modelParallaxStyle"
        class="relative z-20 flex-1 flex items-end justify-center w-full -mt-10 xs:-mt-14 sm:-mt-16 md:-mt-28 lg:-mt-44 xl:-mt-60 2xl:-mt-76 pointer-events-none select-none"
      >

        <img 
          src="/images/models-solo.png" 
          alt="Jubi & Lee Solo Model"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="block sm:hidden h-[60vh] xs:h-[64vh] max-h-[560px] w-auto object-contain object-bottom drop-shadow-xl align-bottom"
        />

        <img 
          src="/images/models-duo.png" 
          alt="Jubi & Lee Duo Collection Models"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="hidden sm:block lg:hidden h-[58vh] md:h-[64vh] max-h-[640px] w-auto object-contain object-bottom drop-shadow-xl align-bottom"
        />

        <img 
          src="/images/models-hero.png" 
          alt="Jubi & Lee Collection Models"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="hidden lg:block h-[60vh] xl:h-[65vh] 2xl:h-[68vh] max-h-[780px] w-auto object-contain object-bottom drop-shadow-2xl align-bottom"
        />
      </div>

      <div class="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 lg:left-8 lg:right-8 z-30 flex flex-row justify-between items-end gap-2.5 sm:gap-4 pointer-events-auto">
        
        <p class="text-[10px] xs:text-xs md:text-sm text-[#1A170F]/90 font-normal leading-relaxed text-left max-w-[160px] xs:max-w-[210px] sm:max-w-xs md:max-w-md bg-[#F4ECE5]/95 backdrop-blur-md p-2 xs:p-3 sm:p-3.5 rounded-2xl border border-[#E4D8CC] shadow-xs">
          Designed for everyday movement. Soft natural fibers, relaxed silhouettes, and effortless comfort.
        </p>

        <div class="flex flex-col sm:flex-col lg:flex-row justify-end items-end lg:items-center gap-2 xs:gap-2.5 sm:gap-3 shrink-0">
          <NuxtLink 
            to="/products"
            class="px-3 xs:px-6 sm:px-8 lg:px-8 xl:px-12 py-2 xs:py-3 sm:py-3.5 lg:py-4 xl:py-5 rounded-2xl bg-[#E04F26] text-white hover:bg-[#C8431E] font-extrabold text-[9px] xs:text-xs lg:text-sm xl:text-base uppercase tracking-widest transition-all duration-200 shadow-xl cursor-pointer text-center"
          >
            SHOP THE COLLECTION
          </NuxtLink>

          <NuxtLink 
            to="/products?sort=newest"
            class="px-3 xs:px-6 sm:px-8 lg:px-8 xl:px-12 py-2 xs:py-3 sm:py-3.5 lg:py-4 xl:py-5 rounded-2xl border-2 border-[#1A170F] bg-[#F4ECE5]/85 backdrop-blur-md text-[#1A170F] hover:bg-[#1A170F] hover:text-[#F4ECE5] font-extrabold text-[9px] xs:text-xs lg:text-sm xl:text-base uppercase tracking-widest transition-all duration-200 cursor-pointer text-center"
          >
            EXPLORE NEW ARRIVALS
          </NuxtLink>
        </div>
      </div>

    </section>

    <section class="bg-[#1A170F] text-[#F4ECE5] py-12 sm:py-24">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-8">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <span class="inline-block bg-[#E04F26] text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-md mb-2 sm:mb-3">
              HOT PICKS
            </span>
            <h2 class="font-serif text-2xl sm:text-5xl font-black uppercase tracking-tight leading-none text-white">
              EVERYDAY STYLES WOMEN LOVE
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 max-w-xs font-light leading-relaxed">
            Carefully curated bestsellers designed for comfort, confidence, and everyday elegance.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div 
            v-for="product in featuredProducts" 
            :key="product.id"
            :class="[
              isProductInStock(product) 
                ? 'bg-[#FAF6F1] text-[#1A170F]' 
                : 'bg-[#FAF6F1]/80 text-[#1A170F]/70 border-[#E4D8CC]/80'
            ]"
            class="group rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 flex flex-col justify-between overflow-hidden h-[430px] sm:h-[490px]"
          >
            
            <div 
              @click="navigateToProduct(product.slug)"
              class="flex-1 flex flex-col min-h-0 cursor-pointer"
            >
              
              <div class="relative w-full flex-1 rounded-2xl overflow-hidden bg-slate-200 min-h-0 transition-all duration-300 ease-in-out">
                <img 
                  :src="product.productImages?.[0]?.url || 'https://via.placeholder.com/400x500'" 
                  :alt="product.name"
                  loading="lazy"
                  decoding="async"
                  :class="[
                    isProductInStock(product) 
                      ? 'opacity-100 group-hover:scale-105' 
                      : 'opacity-60 grayscale-[35%] group-hover:scale-105'
                  ]"
                  class="w-full h-full object-cover object-top transition-all duration-500"
                />

                <span 
                  v-if="!isProductInStock(product)"
                  class="absolute top-3 left-3 bg-[#1A170F]/80 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md z-10"
                >
                  OUT OF STOCK
                </span>
                <span 
                  v-else
                  class="absolute top-3 left-3 bg-[#1A170F] text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md z-10"
                >
                  ● BEST SELLER
                </span>
              </div>

              <div class="px-1 pt-3 shrink-0">
                <h3 
                  :class="[isProductInStock(product) ? 'text-[#1A170F] group-hover:text-[#E04F26]' : 'text-[#1A170F]/60']"
                  class="font-serif font-bold text-base transition leading-snug line-clamp-1"
                >
                  {{ product.name }}
                </h3>
                <p 
                  :class="[isProductInStock(product) ? 'text-[#1A170F]' : 'text-[#1A170F]/60']"
                  class="text-sm font-extrabold mt-1 tnum"
                >
                  Rp{{ formatPrice(product.basePrice) }}
                </p>
              </div>
            </div>

            <div 
              @click.stop.prevent
              class="max-h-0 opacity-0 translate-y-2 group-hover:max-h-14 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-3 transition-all duration-300 ease-in-out shrink-0 overflow-hidden"
            >
              <button 
                v-if="isProductInStock(product)"
                type="button"
                @click.stop.prevent="quickAddToCart(product, $event)"
                :disabled="addingProductId === product.id"
                class="w-full py-2.5 rounded-xl border-2 border-[#1A170F] text-[#1A170F] hover:bg-[#1A170F] hover:text-[#F4ECE5] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span v-if="addedProductId === product.id" class="text-emerald-700 font-black">ADDED ✓</span>
                <span v-else-if="addingProductId === product.id">ADDING...</span>
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

      </div>
    </section>

    <section class="py-12 sm:py-24 max-w-[1600px] mx-auto px-4 sm:px-8">
      <div class="text-center max-w-xl mx-auto mb-8 sm:mb-12">
        <span class="text-xs font-bold uppercase tracking-widest text-[#E04F26]">ESSENTIAL WARDROBE</span>
        <h2 class="font-serif text-2xl sm:text-4xl font-black text-[#1A170F] mt-1">Shop by Category</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink 
          v-for="cat in categories" 
          :key="cat.id" 
          :to="`/products?category=${cat.slug}`"
          class="group relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-[#E4D8CC]"
        >
          <img 
            :src="cat.imageUrl || 'https://via.placeholder.com/400x500'" 
            :alt="cat.name"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#1A170F]/85 via-[#1A170F]/20 to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6">
            <h3 class="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition">{{ cat.name }}</h3>
            <p class="text-xs text-slate-200 mt-1 line-clamp-1 font-light">{{ cat.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCartStore } from '~/stores/cart';

const { fetchApi } = useApi();
const cartStore = useCartStore();

useSeoMeta({
  title: 'Jubi & Lee Studio — Modern Editorial Fashion & Luxury Apparel',
  description: 'Discover curated luxury apparel, everyday essentials, and modern wardrobe pieces designed for movement and elegance at Jubi & Lee Studio.',
  ogTitle: 'Jubi & Lee Studio — Modern Editorial Fashion',
  ogDescription: 'Discover curated luxury apparel, everyday essentials, and modern wardrobe pieces.',
});

const heroRef = ref<HTMLElement | null>(null);
const scrollY = ref(0);
const heroHeight = ref(800);
let ticking = false;

const updateScroll = () => {
  if (typeof window === 'undefined') return;
  scrollY.value = window.scrollY;
  ticking = false;
};

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScroll);
    ticking = true;
  }
};

const updateHeroHeight = () => {
  if (heroRef.value) {
    heroHeight.value = heroRef.value.offsetHeight || window.innerHeight;
  }
};

const modelParallaxStyle = computed(() => {
  const y = scrollY.value;
  if (y === 0) return {};
  const translateY = y * 0.65;
  return {
    transform: `translate3d(0, ${translateY.toFixed(1)}px, 0)`,
    willChange: 'transform',
  };
});

const headingParallaxStyle = computed(() => {
  const y = scrollY.value;
  if (y === 0) return {};
  const translateY = y * 0.15;
  return {
    transform: `translate3d(0, ${translateY.toFixed(1)}px, 0)`,
    willChange: 'transform',
  };
});

const categories = ref<any[]>([]);
const featuredProducts = ref<any[]>([]);
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

onMounted(async () => {
  if (typeof window !== 'undefined') {
    updateHeroHeight();
    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateHeroHeight, { passive: true });
  }

  try {
    const [categoriesData, productsData] = await Promise.all([
      fetchApi<any[]>('/categories').catch(() => []),
      fetchApi<any>('/products?limit=4').catch(() => ({ items: [] })),
    ]);

    categories.value = categoriesData || [];
    featuredProducts.value = sortInStockFirst(productsData?.items || []);
  } catch (e) {
    console.error('Error loading homepage data', e);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', updateHeroHeight);
  }
});

const formatPrice = (val: any) => {
  return Number(val || 0).toLocaleString('id-ID');
};
</script>
