<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start animate-pulse">
    <div class="lg:col-span-2 space-y-4">
      <div v-for="i in 3" :key="i" class="bg-[#FAF6F1] p-4 sm:p-6 rounded-3xl border border-[#E4D8CC] flex space-x-4 sm:space-x-6 items-center">
        <div class="w-24 h-32 rounded-2xl bg-[#E4D8CC]/50 border border-[#E4D8CC] shrink-0"></div>
        <div class="flex-1 flex flex-col justify-between h-32 py-1">
          <div class="space-y-2">
            <div class="h-4 bg-[#E4D8CC] rounded-md w-2/3"></div>
            <div class="h-3 bg-[#E4D8CC]/70 rounded-md w-1/3"></div>
          </div>
          <div class="flex justify-between items-center">
            <div class="w-24 h-8 bg-[#E4D8CC]/60 rounded-xl"></div>
            <div class="h-5 bg-[#E4D8CC] rounded-md w-24"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#FAF6F1] p-6 rounded-3xl border border-[#E4D8CC] space-y-6">
      <div class="h-6 bg-[#E4D8CC] rounded-md w-1/2"></div>
      <div class="space-y-3 pt-2">
        <div class="flex justify-between">
          <div class="h-4 bg-[#E4D8CC]/70 rounded-md w-1/3"></div>
          <div class="h-4 bg-[#E4D8CC]/70 rounded-md w-1/4"></div>
        </div>
        <div class="flex justify-between">
          <div class="h-4 bg-[#E4D8CC]/70 rounded-md w-1/3"></div>
          <div class="h-4 bg-[#E4D8CC]/70 rounded-md w-1/4"></div>
        </div>
        <div class="border-t border-[#E4D8CC] pt-3 flex justify-between">
          <div class="h-5 bg-[#E4D8CC] rounded-md w-1/3"></div>
          <div class="h-5 bg-[#E4D8CC] rounded-md w-1/3"></div>
        </div>
      </div>
      <div class="h-12 bg-[#E4D8CC] rounded-xl w-full mt-4"></div>
    </div>
  </div>
</template>
