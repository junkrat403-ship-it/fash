<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start animate-pulse">
    <div class="space-y-3">
      <div class="max-h-110 sm:max-h-[480px] lg:max-h-[500px] aspect-4/5 w-full rounded-3xl bg-[#FAF6F1] border border-[#E4D8CC] overflow-hidden p-3">
        <div class="w-full h-full bg-[#E4D8CC]/50 rounded-2xl"></div>
      </div>
      <div class="flex space-x-3 overflow-x-auto pb-1 pt-1">
        <div v-for="i in 4" :key="i" class="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC] shrink-0 p-1.5">
          <div class="w-full h-full bg-[#E4D8CC]/50 rounded-xl"></div>
        </div>
      </div>
    </div>

    <div class="space-y-6 sm:space-y-8">
      <div class="space-y-3">
        <div class="h-3 bg-[#E4D8CC]/80 rounded-md w-20"></div>
        <div class="h-9 bg-[#E4D8CC] rounded-xl w-3/4"></div>
        <div class="h-7 bg-[#E4D8CC]/70 rounded-xl w-1/3"></div>
      </div>

      <div class="space-y-2.5">
        <div class="h-3 bg-[#E4D8CC] rounded-md w-24"></div>
        <div class="flex flex-wrap gap-2.5">
          <div v-for="i in 3" :key="i" class="w-20 h-9 bg-[#E4D8CC]/60 rounded-xl"></div>
        </div>
      </div>

      <div class="space-y-2.5">
        <div class="h-3 bg-[#E4D8CC] rounded-md w-24"></div>
        <div class="flex flex-wrap gap-2.5">
          <div v-for="i in 4" :key="i" class="w-14 h-10 bg-[#E4D8CC]/60 rounded-xl"></div>
        </div>
      </div>

      <div class="pt-4 space-y-3">
        <div class="h-14 bg-[#E4D8CC] rounded-2xl w-full"></div>
        <div class="h-12 bg-[#E4D8CC]/50 rounded-2xl w-full"></div>
      </div>
    </div>
  </div>
</template>
