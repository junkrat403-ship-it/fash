<template>
  <main class="space-y-20 pb-20">
    
    <!-- Hero Section — Exact 100% Viewport Height (h-screen) with Zero Gaps -->
    <section class="relative bg-slate-950 text-white h-screen min-h-screen flex items-center overflow-hidden">
      
      <!-- Auto-Rotating Background Images Carousel (ONLY Images Rotate) -->
      <div class="absolute inset-0 z-0">
        <div 
          v-for="(imgUrl, idx) in heroImages" 
          :key="idx"
          :class="[
            currentImageIndex === idx ? 'opacity-60 scale-105' : 'opacity-0 scale-100 pointer-events-none'
          ]"
          class="absolute inset-0 transition-all duration-1000 ease-in-out"
        >
          <img 
            :src="imgUrl" 
            alt="Hero Background" 
            class="w-full h-full object-cover object-center"
          />
        </div>
        <!-- Gradient Overlay over all images for high text readability -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
      </div>

      <!-- Static Fixed Text Content (Heading, Subtitle & Button STAY FIXED) -->
      <div class="relative z-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-left w-full">
        <span class="inline-block text-xs uppercase tracking-[0.3em] font-semibold text-amber-300 mb-4 bg-amber-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/30">
          NEW RELEASE — SUMMER 2026
        </span>
        
        <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-3xl leading-[1.1]">
          Summer 2026 Capsule Collection
        </h1>
        
        <p class="mt-6 text-base sm:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
          Effortless silhouettes, refined tailoring, and sustainable organic linens designed for modern living.
        </p>

        <div class="mt-10 flex flex-wrap gap-4">
          <NuxtLink 
            to="/products"
            class="px-8 py-4 rounded-2xl btn-primary-flat text-sm font-bold flex items-center gap-2 group cursor-pointer"
          >
            <span>Explore Collection</span>
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>

    </section>

    <!-- Category Highlights Grid -->
    <section class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
        <div>
          <span class="text-xs font-semibold tracking-widest text-[#4A7FA7] uppercase">Curated Catalog</span>
          <h2 class="font-serif text-3xl md:text-4xl font-bold text-[#0A1931] mt-1">Shop by Category</h2>
        </div>
        <NuxtLink to="/products" class="mt-4 md:mt-0 text-sm font-semibold text-[#0A1931] hover:text-[#4A7FA7] transition flex items-center gap-1">
          <span>View All Categories</span>
          <span>→</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink 
          v-for="cat in categories" 
          :key="cat.id" 
          :to="`/products?category=${cat.slug}`"
          class="group relative h-80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-[#B3CFE5]/40"
        >
          <img 
            :src="cat.imageUrl || 'https://via.placeholder.com/400x500'" 
            :alt="cat.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6">
            <h3 class="text-xl font-serif font-bold text-white group-hover:text-amber-200 transition">{{ cat.name }}</h3>
            <p class="text-xs text-slate-300 mt-1 line-clamp-1 font-light">{{ cat.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Bestselling Products Rail -->
    <section class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-12">
        <span class="text-xs font-semibold tracking-widest text-[#4A7FA7] uppercase">Season Favorites</span>
        <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#0A1931] mt-1">Featured Wardrobe</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <NuxtLink 
          v-for="product in featuredProducts" 
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="group block bg-[#F6FAFD] rounded-2xl p-3 border border-[#B3CFE5]/50 hover:border-[#4A7FA7] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div class="relative aspect-3/4 rounded-xl overflow-hidden bg-slate-100 mb-4">
            <img 
              :src="product.productImages?.[0]?.url || 'https://via.placeholder.com/400x500'" 
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span class="absolute top-3 left-3 bg-[#0A1931]/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
              {{ product.category?.name || 'New' }}
            </span>
          </div>

          <div class="px-2 pb-1">
            <h3 class="font-serif font-bold text-base text-[#0A1931] group-hover:text-[#4A7FA7] transition">
              {{ product.name }}
            </h3>
            <p class="text-sm font-semibold text-[#0A1931] mt-1">
              Rp{{ formatPrice(product.basePrice) }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Brand Highlight Teaser -->
    <section class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-[#1A3D63] rounded-3xl p-8 sm:p-16 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span class="text-xs uppercase tracking-widest text-amber-300 font-semibold">Craftsmanship & Sustainability</span>
          <h2 class="font-serif text-3xl sm:text-5xl font-bold mt-2 leading-tight">Designed to endure season after season</h2>
          <p class="mt-6 text-slate-200 leading-relaxed font-light text-sm sm:text-base">
            At AURA, we believe in mindful fashion. Every piece is cut from high-grade natural fibers with meticulous attention to fit, durability, and modern minimalist aesthetics.
          </p>
          <div class="mt-8">
            <NuxtLink to="/about" class="inline-flex items-center gap-2 px-6 py-3 rounded.2xl btn-primary-flat text-sm font-medium transition">
              <span>Read Our Full Story</span>
              <span>→</span>
            </NuxtLink>
          </div>
        </div>
        <div class="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop" 
            alt="Atelier"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const { fetchApi } = useApi();

const fetchedBanners = ref<any[]>([]);
const categories = ref<any[]>([]);
const featuredProducts = ref<any[]>([]);
const currentImageIndex = ref<number>(0);
let bgCarouselTimer: any = null;

const defaultHeroImages = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop',
];

const heroImages = computed(() => {
  const customImages = fetchedBanners.value
    .filter((b: any) => b.placement === 'hero' && b.imageUrl)
    .map((b: any) => b.imageUrl);
    
  return customImages.length > 0 ? customImages : defaultHeroImages;
});

const startBackgroundCarousel = () => {
  bgCarouselTimer = setInterval(() => {
    if (heroImages.value.length > 0) {
      currentImageIndex.value = (currentImageIndex.value + 1) % heroImages.value.length;
    }
  }, 4500);
};

onMounted(async () => {
  try {
    const [bannersData, categoriesData, productsData] = await Promise.all([
      fetchApi<any[]>('/banners').catch(() => []),
      fetchApi<any[]>('/categories').catch(() => []),
      fetchApi<any>('/products?limit=4').catch(() => ({ items: [] })),
    ]);

    fetchedBanners.value = bannersData || [];
    categories.value = categoriesData || [];
    featuredProducts.value = productsData?.items || [];
  } catch (e) {
    console.error('Error loading homepage data', e);
  }

  startBackgroundCarousel();
});

onUnmounted(() => {
  if (bgCarouselTimer) {
    clearInterval(bgCarouselTimer);
  }
});

const formatPrice = (val: any) => {
  return Number(val || 0).toLocaleString('id-ID');
};
</script>
