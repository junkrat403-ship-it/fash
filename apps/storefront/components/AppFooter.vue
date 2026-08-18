<template>
  <footer class="bg-[#1A170F] text-[#F4ECE5] pt-16 pb-12 border-t border-white/10">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

        <!-- Col 1: Brand & Tagline -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="px-2 py-1 rounded-lg bg-[#E04F26] text-white flex items-center justify-center font-serif font-black text-xs">
              J&L
            </div>
            <span class="font-serif text-2xl font-black tracking-wider text-white">Jubi & Lee</span>
          </div>
          <p class="text-xs leading-relaxed text-slate-300 font-light">
            Elevated fashion essentials designed for effortless elegance and sustainable quality.
          </p>
          <div class="mt-6 flex space-x-4 text-xs font-semibold">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-slate-300 hover:text-white transition">Instagram</a>
            <a href="#" class="text-slate-300 hover:text-white transition">TikTok</a>
            <a href="#" class="text-slate-300 hover:text-white transition">Pinterest</a>
          </div>
        </div>

        <!-- Col 2: Shop -->
        <div>
          <h4 class="text-xs font-bold text-white uppercase tracking-widest mb-4">Shop</h4>
          <ul class="space-y-2.5 text-xs text-slate-300 font-medium">
            <li><NuxtLink to="/products?category=tops" class="hover:text-white transition">Tops & Shirts</NuxtLink></li>
            <li><NuxtLink to="/products?category=outerwear" class="hover:text-white transition">Outerwear & Blazers</NuxtLink></li>
            <li><NuxtLink to="/products?category=bottoms" class="hover:text-white transition">Tailored Bottoms</NuxtLink></li>
            <li><NuxtLink to="/products?category=accessories" class="hover:text-white transition">Leather Accessories</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 3: Information -->
        <div>
          <h4 class="text-xs font-bold text-white uppercase tracking-widest mb-4">Information</h4>
          <ul class="space-y-2.5 text-xs text-slate-300 font-medium">
            <li><NuxtLink to="/about" class="hover:text-white transition">Our Story & Values</NuxtLink></li>
            <li><a href="#" class="hover:text-white transition">Shipping & Delivery Policy</a></li>
            <li><a href="#" class="hover:text-white transition">Terms & Privacy</a></li>
          </ul>
        </div>

        <!-- Col 4: Customer Support -->
        <div>
          <h4 class="text-xs font-bold text-white uppercase tracking-widest mb-4">Customer Support</h4>
          <ul class="space-y-2.5 text-xs text-slate-300 font-medium">
            <li>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="hover:text-white transition flex items-center gap-1.5"
              >
                <span>WhatsApp:</span>
                <span class="text-[#E04F26] hover:underline font-semibold">+62 812 3456 7890</span>
              </a>
            </li>
            <li>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="hover:text-white transition flex items-center gap-1.5"
              >
                <span>Instagram:</span>
                <span class="text-[#E04F26] hover:underline font-semibold">@jubiandlee</span>
              </a>
            </li>
            <li>
              <a 
                href="mailto:info@jubiandlee.com" 
                class="hover:text-white transition flex items-center gap-1.5"
              >
                <span>Email:</span>
                <span class="text-[#E04F26] hover:underline font-semibold">info@jubiandlee.com</span>
              </a>
            </li>
            
          </ul>
        </div>

      </div>

      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 space-y-4 md:space-y-0">
        <p>© 2026 Jubi & Lee. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
