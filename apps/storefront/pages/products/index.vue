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

          <!-- Desktop Sort Dropdown -->
          <select 
            v-model="filters.sort" 
            @change="fetchProducts"
            class="hidden lg:block px-3 py-2.5 rounded-xl border border-[#E4D8CC] text-xs bg-[#FAF6F1] focus:outline-none focus:ring-2 focus:ring-[#E04F26] font-medium text-[#1A170F] cursor-pointer"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="bestselling">Best Selling</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <!-- Mobile Sort Button (Opens Centered Sort Modal) -->
          <button 
            @click="mobileSortOpen = true"
            class="lg:hidden px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-[#1A170F] hover:border-[#E04F26] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            title="Sort catalog"
          >
            <svg class="w-3.5 h-3.5 text-[#E04F26]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            <span>{{ currentSortLabel }}</span>
          </button>

          <!-- Mobile Filters Button (Opens Centered Filter Modal) -->
          <button 
            @click="openMobileFilter"
            class="lg:hidden px-3.5 py-2.5 rounded-xl bg-[#1A170F] text-[#F4ECE5] hover:bg-[#E04F26] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
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
          Category: {{ getCategoryName(filters.category) }}
          <button @click="clearFilter('category')" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove category filter">×</button>
        </span>
        <span v-if="filters.size" class="inline-flex items-center gap-1.5 text-xs bg-[#1A170F] text-[#F4ECE5] px-3 py-1 rounded-full shadow-xs">
          Size: {{ filters.size }}
          <button @click="clearFilter('size')" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove size filter">×</button>
        </span>
        <span v-if="filters.color" class="inline-flex items-center gap-1.5 text-xs bg-[#1A170F] text-[#F4ECE5] px-3 py-1 rounded-full shadow-xs">
          <span :style="getColorStyle(filters.color)" class="w-2.5 h-2.5 rounded-full inline-block border border-white/40"></span>
          Color: {{ filters.color }}
          <button @click="clearFilter('color')" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove color filter">×</button>
        </span>
        <span v-if="activePriceRangeLabel" class="inline-flex items-center gap-1.5 text-xs bg-[#1A170F] text-[#F4ECE5] px-3 py-1 rounded-full shadow-xs">
          Price: {{ activePriceRangeLabel }}
          <button @click="clearPriceFilter" class="hover:text-[#E04F26] font-bold ml-0.5 cursor-pointer" title="Remove price filter">×</button>
        </span>
        <button @click="clearAllFilters" class="text-xs text-[#E04F26] font-semibold underline cursor-pointer hover:text-[#1A170F] ml-1">Reset All</button>
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        <aside class="hidden lg:block space-y-8 pl-1 pr-6 border-r border-[#E4D8CC] sticky top-28 self-start max-h-[calc(100vh-130px)] overflow-y-auto">

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
                :class="[filters.size === size ? 'bg-[#1A170F] text-[#F4ECE5]' : 'bg-[#FAF6F1] text-[#1A170F] border border-[#E4D8CC] hover:border-[#1A170F]']"
                class="w-9 h-9 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center justify-center"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Colors</h3>
            <div class="flex flex-wrap gap-3 p-1 -m-1">
              <div 
                v-for="c in availableColors" 
                :key="c"
                class="relative group/swatch flex items-center justify-center p-0.5"
              >
                <button 
                  @click="toggleColor(c)"
                  :style="getColorStyle(c)"
                  :class="[
                    filters.color === c 
                      ? 'ring-2 ring-[#E04F26] ring-offset-2 ring-offset-[#FAF6F1] scale-110' 
                      : 'hover:scale-105 border border-[#1A170F]/15 shadow-2xs'
                  ]"
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center origin-center"
                  :aria-label="`Filter by ${c}`"
                >
                  <svg 
                    v-if="filters.color === c" 
                    :class="isDarkColor(c) ? 'text-white' : 'text-[#1A170F]'" 
                    class="w-3.5 h-3.5 font-bold" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="3" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </button>

                <div class="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#1A170F] text-[#FAF6F1] text-[10px] font-bold rounded-md shadow-md opacity-0 pointer-events-none group-hover/swatch:opacity-100 group-hover/swatch:-translate-y-0.5 transition-all duration-150 whitespace-nowrap z-50">
                  {{ c }}
                  <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A170F]"></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Price</h3>
            <div class="space-y-2.5">
              <label 
                v-for="range in priceRanges" 
                :key="range.id"
                class="flex items-center gap-2.5 text-xs text-[#1A170F]/80 hover:text-[#E04F26] cursor-pointer group transition select-none"
              >
                <input 
                  type="radio" 
                  name="priceRangeDesktop" 
                  :value="range.id" 
                  :checked="filters.priceRange === range.id"
                  @click="selectPriceRange(range)"
                  class="w-3.5 h-3.5 text-[#E04F26] border-[#E4D8CC] focus:ring-[#E04F26] accent-[#E04F26] cursor-pointer"
                />
                <span :class="[filters.priceRange === range.id ? 'font-bold text-[#E04F26]' : 'font-normal']">
                  {{ range.label }}
                </span>
              </label>
            </div>
          </div>

        </aside>

        <section class="lg:col-span-3">
          <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <ProductCardSkeleton v-for="n in 6" :key="n" />
          </div>

          <div v-else-if="!products.length" class="py-20 text-center bg-[#FAF6F1] rounded-3xl border border-[#E4D8CC]">
            <p class="text-lg font-serif font-black text-[#1A170F]">No products match your criteria</p>
            <p class="text-xs text-[#1A170F]/70 mt-1 font-light">Try clearing some filters or searching for another term.</p>
            <button @click="clearAllFilters" class="mt-4 px-5 py-2.5 rounded-xl bg-[#E04F26] text-white text-xs font-bold uppercase tracking-wider">
              Clear All Filters
            </button>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <div 
              v-for="p in products" 
              :key="p.id"
              :class="[
                isProductInStock(p) 
                  ? 'bg-[#FAF6F1] text-[#1A170F]' 
                  : 'bg-[#FAF6F1]/80 text-[#1A170F]/70 border-[#E4D8CC]/80'
              ]"
              class="group rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E4D8CC] hover:border-[#E04F26] flex flex-col justify-between overflow-hidden h-[300px] xs:h-[350px] sm:h-[490px]"
            >
              
              <div 
                @click="navigateToProduct(p.slug)"
                class="flex-1 flex flex-col min-h-0 cursor-pointer"
              >
                
                <div class="relative w-full flex-1 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200 min-h-0 transition-all duration-300 ease-in-out">
                  <img 
                    :src="formatImageUrl(p.productImages?.[0]?.url)" 
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
                    class="absolute top-2 left-2 xs:top-3 xs:left-3 bg-[#1A170F]/80 backdrop-blur-xs text-white text-[7px] xs:text-[9px] uppercase font-bold tracking-wider px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-md z-10"
                  >
                    OUT OF STOCK
                  </span>
                  <span 
                    v-else
                    class="absolute top-2 left-2 xs:top-3 xs:left-3 bg-[#1A170F] text-white text-[7px] xs:text-[9px] uppercase font-bold tracking-wider px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-md z-10"
                  >
                    {{ p.category?.name || 'Item' }}
                  </span>
                </div>

                <div class="px-0.5 xs:px-1 pt-2 sm:pt-3 shrink-0">
                  <h3 
                    :class="[isProductInStock(p) ? 'text-[#1A170F] group-hover:text-[#E04F26]' : 'text-[#1A170F]/60']"
                    class="font-serif font-bold text-xs xs:text-sm sm:text-base transition leading-snug line-clamp-1"
                  >
                    {{ p.name }}
                  </h3>
                  <p 
                    :class="[isProductInStock(p) ? 'text-[#1A170F]' : 'text-[#1A170F]/60']"
                    class="text-xs xs:text-sm sm:text-base font-extrabold mt-0.5 xs:mt-1 tnum"
                  >
                    Rp{{ formatPrice(p.basePrice) }}
                  </p>
                </div>
              </div>

              <div 
                @click.stop.prevent
                class="max-h-0 opacity-0 translate-y-2 group-hover:max-h-14 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mt-2 sm:group-hover:mt-3 transition-all duration-300 ease-in-out shrink-0 overflow-hidden"
              >
                <button 
                  v-if="isProductInStock(p)"
                  type="button"
                  @click.stop.prevent="quickAddToCart(p, $event)"
                  :disabled="addingProductId === p.id"
                  class="w-full py-1.5 xs:py-2 sm:py-2.5 rounded-xl border-2 border-[#1A170F] text-[#1A170F] hover:bg-[#1A170F] hover:text-[#F4ECE5] font-extrabold text-[9px] xs:text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <span v-if="addedProductId === p.id" class="text-emerald-700 font-black">ADDED ✓</span>
                  <span v-else-if="addingProductId === p.id">ADDING...</span>
                  <span v-else>ADD TO CART</span>
                </button>

                <button 
                  v-else
                  type="button"
                  disabled
                  class="w-full py-1.5 xs:py-2 sm:py-2.5 rounded-xl border-2 border-slate-300 bg-slate-200 text-slate-500 font-extrabold text-[9px] xs:text-[11px] sm:text-xs uppercase tracking-wider cursor-not-allowed opacity-80 flex items-center justify-center"
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

    <!-- Centered Mobile Filter Popup Modal -->
    <div v-if="mobileFilterOpen" class="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop (Pure fade animation, never scales) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="mobileFilterOpen" 
          class="fixed inset-0 bg-black/65"
          @click="closeMobileFilter"
        ></div>
      </Transition>

      <!-- Modal Dialog (Scale & Fade transition) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="mobileFilterOpen" 
          class="bg-[#FAF6F1] text-[#1A170F] w-full max-w-md max-h-[85vh] rounded-3xl p-6 shadow-2xl border border-[#E4D8CC] flex flex-col justify-between overflow-hidden relative z-10"
          @click.stop
          data-lenis-prevent
        >
          <!-- Modal Header -->
          <div class="flex justify-between items-center pb-4 border-b border-[#E4D8CC] shrink-0">
            <div>
              <span class="text-[10px] uppercase font-black tracking-widest text-[#E04F26]">Refine Catalog</span>
              <h2 class="font-serif text-xl font-bold text-[#1A170F]">Filter Products</h2>
            </div>
            <button 
              @click="closeMobileFilter" 
              class="w-8 h-8 rounded-full bg-[#E4D8CC]/50 hover:bg-[#E4D8CC] text-[#1A170F] flex items-center justify-center transition cursor-pointer text-sm font-bold"
              title="Close filter modal"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <!-- Scrollable Filter Content -->
          <div class="py-4 space-y-6 overflow-y-auto flex-1 pr-1">
            <!-- Categories -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Categories</h3>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="togglePendingCategory('')"
                  :class="[!pendingFilters.category ? 'font-bold text-[#E04F26] bg-[#F4ECE5] border-[#E04F26]' : 'text-[#1A170F]/80 bg-white/60 border-[#E4D8CC]']"
                  class="w-full text-left text-xs px-3 py-2.5 rounded-xl border transition cursor-pointer truncate"
                >
                  All Categories
                </button>
                <button 
                  v-for="cat in categories" 
                  :key="cat.id"
                  @click="togglePendingCategory(cat.slug)"
                  :class="[pendingFilters.category === cat.slug ? 'font-bold text-[#E04F26] bg-[#F4ECE5] border-[#E04F26]' : 'text-[#1A170F]/80 bg-white/60 border-[#E4D8CC]']"
                  class="w-full text-left text-xs px-3 py-2.5 rounded-xl border transition cursor-pointer truncate"
                >
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <!-- Sizes -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Sizes</h3>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="size in availableSizes" 
                  :key="size"
                  @click="togglePendingSize(size)"
                  :class="[pendingFilters.size === size ? 'bg-[#1A170F] text-[#F4ECE5]' : 'bg-[#F4ECE5] text-[#1A170F] border border-[#E4D8CC]']"
                  class="w-10 h-10 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Colors (Swatches with Tooltip) -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Colors</h3>
              <div class="flex flex-wrap gap-3">
                <div 
                  v-for="c in availableColors" 
                  :key="c"
                  class="relative group/swatch flex items-center justify-center"
                >
                  <button 
                    @click="togglePendingColor(c)"
                    :style="getColorStyle(c)"
                    :class="[
                      pendingFilters.color === c 
                        ? 'ring-2 ring-[#E04F26] ring-offset-2 ring-offset-[#FAF6F1] scale-110' 
                        : 'border border-[#1A170F]/15 shadow-2xs'
                    ]"
                    class="w-8 h-8 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center"
                    :aria-label="`Filter by ${c}`"
                  >
                    <svg 
                      v-if="pendingFilters.color === c" 
                      :class="isDarkColor(c) ? 'text-white' : 'text-[#1A170F]'" 
                      class="w-4 h-4 font-bold" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="3" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </button>

                  <div class="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#1A170F] text-[#FAF6F1] text-[10px] font-bold rounded-md shadow-md opacity-0 pointer-events-none group-hover/swatch:opacity-100 transition-all duration-150 whitespace-nowrap z-30">
                    {{ c }}
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A170F]"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Range -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#1A170F] mb-3">Price</h3>
              <div class="space-y-2.5">
                <label 
                  v-for="range in priceRanges" 
                  :key="range.id"
                  class="flex items-center gap-3 text-xs text-[#1A170F]/80 hover:text-[#E04F26] cursor-pointer group transition select-none bg-white/60 p-2.5 rounded-xl border border-[#E4D8CC]"
                >
                  <input 
                    type="radio" 
                    name="mobilePriceRange" 
                    :value="range.id" 
                    :checked="pendingFilters.priceRange === range.id"
                    @click="selectPendingPriceRange(range)"
                    class="w-4 h-4 text-[#E04F26] border-[#E4D8CC] focus:ring-[#E04F26] accent-[#E04F26] cursor-pointer"
                  />
                  <span :class="[pendingFilters.priceRange === range.id ? 'font-bold text-[#E04F26]' : 'font-normal']">
                    {{ range.label }}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="pt-4 border-t border-[#E4D8CC] flex items-center gap-3 shrink-0">
            <button 
              @click="clearPendingFilters"
              class="flex-1 py-3 rounded-xl border border-[#E4D8CC] text-[#1A170F] font-bold text-xs uppercase tracking-wider hover:bg-[#F4ECE5] transition cursor-pointer"
            >
              Clear All
            </button>
            <button 
              @click="applyMobileFilters"
              class="flex-1 py-3 rounded-xl bg-[#E04F26] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-[#C8431E] transition cursor-pointer text-center"
            >
              Apply & View
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Centered Mobile Sort Popup Modal -->
    <div v-if="mobileSortOpen" class="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop (Pure fade animation, never scales) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="mobileSortOpen" 
          class="fixed inset-0 bg-black/65"
          @click="mobileSortOpen = false"
        ></div>
      </Transition>

      <!-- Modal Dialog (Scale & Fade transition) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="mobileSortOpen" 
          class="bg-[#FAF6F1] text-[#1A170F] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E4D8CC] flex flex-col justify-between overflow-hidden relative z-10"
          @click.stop
          data-lenis-prevent
        >
          <!-- Modal Header -->
          <div class="flex justify-between items-center pb-4 border-b border-[#E4D8CC] shrink-0">
            <div>
              <span class="text-[10px] uppercase font-black tracking-widest text-[#E04F26]">Order Catalog</span>
              <h2 class="font-serif text-xl font-bold text-[#1A170F]">Sort Products</h2>
            </div>
            <button 
              @click="mobileSortOpen = false" 
              class="w-8 h-8 rounded-full bg-[#E4D8CC]/50 hover:bg-[#E4D8CC] text-[#1A170F] flex items-center justify-center transition cursor-pointer text-sm font-bold"
              title="Close sort modal"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <!-- Sort Options List -->
          <div class="py-4 space-y-2.5">
            <button 
              v-for="opt in sortOptions" 
              :key="opt.value"
              @click="selectSortOption(opt.value)"
              :class="[
                filters.sort === opt.value 
                  ? 'bg-[#1A170F] text-[#FAF6F1] font-bold border-[#1A170F] shadow-sm' 
                  : 'bg-white/70 text-[#1A170F] hover:bg-white border-[#E4D8CC]'
              ]"
              class="w-full text-left px-4 py-3.5 rounded-2xl border text-xs transition flex items-center justify-between cursor-pointer"
            >
              <span>{{ opt.label }}</span>
              <svg 
                v-if="filters.sort === opt.value" 
                class="w-4 h-4 text-[#E04F26]" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2.5" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </button>
          </div>

          <!-- Modal Footer -->
          <div class="pt-4 border-t border-[#E4D8CC] shrink-0">
            <button 
              @click="mobileSortOpen = false"
              class="w-full py-3 rounded-xl bg-[#E04F26] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-[#C8431E] transition cursor-pointer text-center"
            >
              Apply & View
            </button>
          </div>
        </div>
      </Transition>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
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
const mobileSortOpen = ref(false);
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
const availableColors = ['Black', 'White', 'Beige', 'Navy', 'Olive', 'Brown', 'Cream', 'Terracotta'];

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const currentSortLabel = computed(() => {
  const found = sortOptions.find(o => o.value === filters.value.sort);
  return found ? found.label : 'Sort';
});

const selectSortOption = (val: string) => {
  filters.value.sort = val;
  filters.value.page = 1;
  fetchProducts();
  mobileSortOpen.value = false;
};

// Background scroll lock when mobile filter or sort modal is open
watch([mobileFilterOpen, mobileSortOpen], ([filterOpen, sortOpen]) => {
  if (typeof document !== 'undefined') {
    const isModalOpen = filterOpen || sortOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const nuxtApp = useNuxtApp();
      if ((nuxtApp as any).$lenis) {
        (nuxtApp as any).$lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      const nuxtApp = useNuxtApp();
      if ((nuxtApp as any).$lenis) {
        (nuxtApp as any).$lenis.start();
      }
    }
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    const nuxtApp = useNuxtApp();
    if ((nuxtApp as any).$lenis) {
      (nuxtApp as any).$lenis.start();
    }
  }
});

const colorHexMap: Record<string, { bg: string; border?: string; textDark?: boolean }> = {
  black: { bg: '#1A170F' },
  white: { bg: '#FFFFFF', border: '#D1C7BD', textDark: true },
  cream: { bg: '#FAF6F0', border: '#E2D7CC', textDark: true },
  beige: { bg: '#D8C7B5', border: '#C4B19E' },
  brown: { bg: '#6E473B' },
  navy: { bg: '#1E293B' },
  olive: { bg: '#556B2F' },
  terracotta: { bg: '#E04F26' },
  sage: { bg: '#879F84' },
  grey: { bg: '#71717A' },
  gray: { bg: '#71717A' },
  khaki: { bg: '#BDB092' },
  pink: { bg: '#E2B4BD' },
  blush: { bg: '#E2B4BD' },
  rust: { bg: '#B7410E' },
};

const getColorStyle = (colorName: string) => {
  const normalized = (colorName || '').toLowerCase().trim();
  const found = colorHexMap[normalized] || { bg: '#A89F91' };
  return {
    backgroundColor: found.bg,
    borderColor: found.border || 'transparent',
  };
};

const isDarkColor = (colorName: string) => {
  const normalized = (colorName || '').toLowerCase().trim();
  const found = colorHexMap[normalized];
  return !found?.textDark;
};

interface PriceRangeOption {
  id: string;
  label: string;
  min: number | null;
  max: number | null;
}

const priceRanges: PriceRangeOption[] = [
  { id: 'under-200k', label: 'Under Rp200,000', min: null, max: 200000 },
  { id: '200k-350k', label: 'Rp200,000 – Rp350,000', min: 200000, max: 350000 },
  { id: '350k-500k', label: 'Rp350,000 – Rp500,000', min: 350000, max: 500000 },
  { id: '500k-plus', label: 'Rp500,000+', min: 500000, max: null },
];

const filters = ref({
  category: (route.query.category as string) || '',
  size: (route.query.size as string) || '',
  color: (route.query.color as string) || '',
  minPrice: (route.query.minPrice as string) || '',
  maxPrice: (route.query.maxPrice as string) || '',
  priceRange: (route.query.priceRange as string) || '',
  sort: (route.query.sort as string) || 'newest',
  q: (route.query.q as string) || '',
  page: Number(route.query.page || 1),
});

// Local draft state for mobile filter modal (only applied on "Apply & View" click)
const pendingFilters = ref({
  category: '',
  size: '',
  color: '',
  minPrice: '',
  maxPrice: '',
  priceRange: '',
});

const openMobileFilter = () => {
  pendingFilters.value = {
    category: filters.value.category,
    size: filters.value.size,
    color: filters.value.color,
    minPrice: filters.value.minPrice,
    maxPrice: filters.value.maxPrice,
    priceRange: filters.value.priceRange,
  };
  mobileFilterOpen.value = true;
};

const closeMobileFilter = () => {
  mobileFilterOpen.value = false;
};

const togglePendingCategory = (slug: string) => {
  pendingFilters.value.category = pendingFilters.value.category === slug ? '' : slug;
};

const togglePendingSize = (size: string) => {
  pendingFilters.value.size = pendingFilters.value.size === size ? '' : size;
};

const togglePendingColor = (c: string) => {
  pendingFilters.value.color = pendingFilters.value.color === c ? '' : c;
};

const selectPendingPriceRange = (range: PriceRangeOption) => {
  if (pendingFilters.value.priceRange === range.id) {
    pendingFilters.value.priceRange = '';
    pendingFilters.value.minPrice = '';
    pendingFilters.value.maxPrice = '';
  } else {
    pendingFilters.value.priceRange = range.id;
    pendingFilters.value.minPrice = range.min !== null ? String(range.min) : '';
    pendingFilters.value.maxPrice = range.max !== null ? String(range.max) : '';
  }
};

const clearPendingFilters = () => {
  pendingFilters.value = {
    category: '',
    size: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    priceRange: '',
  };
};

const applyMobileFilters = () => {
  filters.value.category = pendingFilters.value.category;
  filters.value.size = pendingFilters.value.size;
  filters.value.color = pendingFilters.value.color;
  filters.value.minPrice = pendingFilters.value.minPrice;
  filters.value.maxPrice = pendingFilters.value.maxPrice;
  filters.value.priceRange = pendingFilters.value.priceRange;
  filters.value.page = 1;
  fetchProducts();
  mobileFilterOpen.value = false;
};

const meta = ref({
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
});

const catalogTopRef = ref<HTMLElement | null>(null);

const getCategoryName = (slug: string) => {
  const cat = categories.value.find(c => c.slug === slug);
  return cat ? cat.name : slug;
};

const activePriceRangeLabel = computed(() => {
  if (!filters.value.priceRange) return '';
  const found = priceRanges.find(r => r.id === filters.value.priceRange);
  return found ? found.label : '';
});

const hasActiveFilters = computed(() => {
  return !!(
    filters.value.category ||
    filters.value.size ||
    filters.value.color ||
    filters.value.minPrice ||
    filters.value.maxPrice ||
    filters.value.priceRange ||
    filters.value.q
  );
});

watch(() => route.query, (newQuery) => {
  filters.value.category = (newQuery.category as string) || '';
  filters.value.size = (newQuery.size as string) || '';
  filters.value.color = (newQuery.color as string) || '';
  filters.value.minPrice = (newQuery.minPrice as string) || '';
  filters.value.maxPrice = (newQuery.maxPrice as string) || '';
  filters.value.priceRange = (newQuery.priceRange as string) || '';
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
    if (filters.value.category && filters.value.category.trim() !== '') {
      queryParams.set('category', filters.value.category.trim());
    }
    if (filters.value.size && filters.value.size.trim() !== '') {
      queryParams.set('size', filters.value.size.trim());
    }
    if (filters.value.color && filters.value.color.trim() !== '') {
      queryParams.set('color', filters.value.color.trim());
    }
    if (filters.value.minPrice && String(filters.value.minPrice).trim() !== '' && !isNaN(Number(filters.value.minPrice))) {
      queryParams.set('minPrice', String(filters.value.minPrice).trim());
    }
    if (filters.value.maxPrice && String(filters.value.maxPrice).trim() !== '' && !isNaN(Number(filters.value.maxPrice))) {
      queryParams.set('maxPrice', String(filters.value.maxPrice).trim());
    }
    if (filters.value.priceRange && filters.value.priceRange.trim() !== '') {
      queryParams.set('priceRange', filters.value.priceRange.trim());
    }
    if (filters.value.sort && filters.value.sort !== 'newest') {
      queryParams.set('sort', filters.value.sort);
    }
    if (filters.value.q && filters.value.q.trim() !== '') {
      queryParams.set('q', filters.value.q.trim());
    }
    if (filters.value.page > 1) {
      queryParams.set('page', String(filters.value.page));
    }

    router.replace({ query: Object.fromEntries(queryParams.entries()) });

    const res = await fetchApi<any>(`/products?${queryParams.toString()}`);
    products.value = sortInStockFirst(res.items || []);
    meta.value = res.meta || { total: 0, page: 1, limit: 12, totalPages: 1 };
  } catch (e) {
    console.error('Fetch products error:', e);
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

const selectPriceRange = (range: PriceRangeOption) => {
  if (filters.value.priceRange === range.id) {
    filters.value.priceRange = '';
    filters.value.minPrice = '';
    filters.value.maxPrice = '';
  } else {
    filters.value.priceRange = range.id;
    filters.value.minPrice = range.min !== null ? String(range.min) : '';
    filters.value.maxPrice = range.max !== null ? String(range.max) : '';
  }
  filters.value.page = 1;
  fetchProducts();
};

const clearPriceFilter = () => {
  filters.value.priceRange = '';
  filters.value.minPrice = '';
  filters.value.maxPrice = '';
  filters.value.page = 1;
  fetchProducts();
};

const clearFilter = (key: keyof typeof filters.value) => {
  if (key === 'page') {
    filters.value.page = 1;
  } else if (key === 'sort') {
    filters.value.sort = 'newest';
  } else if (key === 'priceRange' || key === 'minPrice' || key === 'maxPrice') {
    clearPriceFilter();
    return;
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
    minPrice: '',
    maxPrice: '',
    priceRange: '',
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
