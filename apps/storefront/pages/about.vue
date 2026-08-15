<template>
  <main class="pt-24 sm:pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-[#1A170F]">
    <div class="text-center mb-16">
      <span class="text-xs uppercase tracking-widest text-[#E04F26] font-bold">Our Identity</span>
      <h1 class="font-serif text-4xl sm:text-5xl font-black text-[#1A170F] mt-2">The Jubi & Lee Story</h1>
      <p class="mt-4 text-[#1A170F]/80 max-w-xl mx-auto text-base leading-relaxed">
        A contemporary fashion studio dedicated to conscious craftsmanship, timeless silhouettes, and seamless customer experiences.
      </p>
    </div>

    <div class="space-y-12 text-[#1A170F] leading-relaxed font-light">
      <div class="aspect-21/9 rounded-3xl overflow-hidden shadow-xl bg-[#FAF6F1] border border-[#E4D8CC]">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1400&auto=format&fit=crop&fm=webp" 
          alt="Studio lookbook" 
          class="w-full h-full object-cover"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-[#E4D8CC]">
        <div>
          <h3 class="font-serif text-xl font-bold text-[#1A170F] mb-2">Purity of Materials</h3>
          <p class="text-sm text-[#1A170F]/80">
            We work exclusively with certified organic cottons, natural European linens, and recycled wool blends. Every fabric is selected for its touch, breathability, and lifespan.
          </p>
        </div>
        <div>
          <h3 class="font-serif text-xl font-bold text-[#1A170F] mb-2">Seamless WhatsApp Commerce</h3>
          <p class="text-sm text-[#1A170F]/80">
            We remove rigid payment gateways in favor of personalized WhatsApp interaction, allowing you to ask fit questions and arrange local delivery directly with our team.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About Our Studio — Jubi & Lee Studio',
  description: 'Learn about the philosophy, craftsmanship, natural fibers, and personalized service behind Jubi & Lee Studio.',
  ogTitle: 'About Our Studio — Jubi & Lee Studio',
  ogDescription: 'Learn about the philosophy, craftsmanship, and natural fibers behind Jubi & Lee Studio.',
});
</script>
