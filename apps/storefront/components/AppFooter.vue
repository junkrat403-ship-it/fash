<template>
  <!-- Footer styled with #1A3D63 (Secondary Dark Tone Token) -->
  <footer class="bg-[#1A3D63] text-slate-200 pt-16 pb-12 border-t border-[#4A7FA7]/30">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <!-- Brand Info -->
        <div class="md:col-span-1">
          <span class="font-serif text-3xl font-bold tracking-wider text-white">AURA</span>
          <p class="mt-4 text-xs leading-relaxed text-slate-300 font-light">
            Elevated fashion essentials designed for effortless elegance and sustainable quality.
          </p>
          <div class="mt-6 flex space-x-4">
            <a href="#" class="text-slate-300 hover:text-white transition">Instagram</a>
            <a href="#" class="text-slate-300 hover:text-white transition">TikTok</a>
            <a href="#" class="text-slate-300 hover:text-white transition">Pinterest</a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-xs font-semibold text-white uppercase tracking-widest mb-4">Shop</h4>
          <ul class="space-y-2.5 text-xs text-slate-300">
            <li><NuxtLink to="/products?category=tops" class="hover:text-white transition">Tops & Shirts</NuxtLink></li>
            <li><NuxtLink to="/products?category=outerwear" class="hover:text-white transition">Outerwear & Blazers</NuxtLink></li>
            <li><NuxtLink to="/products?category=bottoms" class="hover:text-white transition">Tailored Bottoms</NuxtLink></li>
            <li><NuxtLink to="/products?category=accessories" class="hover:text-white transition">Leather Accessories</NuxtLink></li>
          </ul>
        </div>

        <!-- Brand Story -->
        <div>
          <h4 class="text-xs font-semibold text-white uppercase tracking-widest mb-4">Information</h4>
          <ul class="space-y-2.5 text-xs text-slate-300">
            <li><NuxtLink to="/about" class="hover:text-white transition">Our Story & Values</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-white transition">Customer Support</NuxtLink></li>
            <li><a href="#" class="hover:text-white transition">Shipping & Delivery Policy</a></li>
            <li><a href="#" class="hover:text-white transition">Terms & Privacy</a></li>
          </ul>
        </div>

        <!-- Direct Support & WhatsApp Order Handoff Info -->
        <div>
          <h4 class="text-xs font-semibold text-white uppercase tracking-widest mb-4">Direct Order Support</h4>
          <p class="text-xs text-slate-300 leading-relaxed mb-4 font-light">
            Have questions about fit, size, or material? Speak directly with our styling team via WhatsApp.
          </p>
          <div class="inline-flex items-center space-x-2 bg-[#0A1931]/60 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-lg text-xs font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>WhatsApp Direct Desk Online</span>
          </div>
        </div>

      </div>

      <div class="pt-8 border-t border-[#4A7FA7]/30 flex flex-col md:flex-row justify-between items-center text-xs text-slate-300 space-y-4 md:space-y-0">
        <p>© 2026 AURA Fashion Studio. All rights reserved.</p>
        <p class="text-[11px]">Crafted for smooth WhatsApp-first Checkout</p>
      </div>
    </div>
  </footer>
</template>
