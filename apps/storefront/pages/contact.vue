<template>
  <main class="pt-16 sm:pt-20 pb-6 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center min-h-[calc(100vh-70px)]">
    
    <!-- Compact Page Header -->
    <div class="text-center max-w-3xl mx-auto mb-4 sm:mb-6">
      <span class="text-xs uppercase tracking-widest text-[#4A7FA7] font-semibold">Get In Touch</span>
      <h1 class="font-serif text-2xl sm:text-4xl font-bold text-[#0A1931] mt-1">We'd love to hear from you</h1>
      <p class="mt-1 text-[#1A3D63] text-xs sm:text-sm font-light">
        Questions about sizing, custom orders, or shipping? Send us a message or chat with us on WhatsApp.
      </p>
    </div>

    <!-- Grid Container: Single Viewport Fit with Generous Element Heights -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
      
      <!-- 3 Contact Info Cards (py-6 Padding & 48px Icon Containers) -->
      <div class="flex flex-col justify-between space-y-4 h-full">
        
        <!-- Card 1: WhatsApp Desk -->
        <div class="bg-[#F6FAFD] px-6 py-6 sm:px-8 sm:py-6 rounded-2xl border border-[#B3CFE5]/50 shadow-xs flex-1 flex items-center justify-between hover:border-[#4A7FA7] transition-all duration-300">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-[#0A1931] text-white flex items-center justify-center shadow-md shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 6.75c0 12.728 10.022 22.75 22.75 22.75 1.034 0 1.875-.84 1.875-1.875v-3.722c0-.518-.316-.976-.8-1.157l-4.52-1.695a1.125 1.125 0 00-1.18.292l-2.003 2.003a15.932 15.932 0 01-6.75-6.75l2.003-2.003a1.125 1.125 0 00.292-1.18L8.604 3.05a1.125 1.125 0 00-1.157-.8H3.722c-1.035 0-1.875.84-1.875 1.875z" />
              </svg>
            </div>
            <div>
              <h3 class="font-serif font-bold text-[#0A1931] text-sm sm:text-base">WhatsApp Desk</h3>
              <p class="text-[11px] sm:text-xs text-[#1A3D63] font-light">Mon – Sat, 09:00 - 18:00</p>
            </div>
          </div>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            class="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer shrink-0 ml-3"
          >
            +62 812 3456 7890 →
          </a>
        </div>

        <!-- Card 2: Email Inquiry -->
        <div class="bg-[#F6FAFD] px-6 py-6 sm:px-8 sm:py-6 rounded-2xl border border-[#B3CFE5]/50 shadow-xs flex-1 flex items-center justify-between hover:border-[#4A7FA7] transition-all duration-300">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-[#0A1931] text-white flex items-center justify-center shadow-md shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <h3 class="font-serif font-bold text-[#0A1931] text-sm sm:text-base">Email Inquiry</h3>
              <p class="text-[11px] sm:text-xs text-[#1A3D63] font-light">Wholesale & press inquiries</p>
            </div>
          </div>
          <a 
            href="mailto:info@fashionstore.com" 
            class="text-xs sm:text-sm font-bold text-[#0A1931] hover:text-[#4A7FA7] transition cursor-pointer shrink-0 ml-3"
          >
            info@fashionstore.com
          </a>
        </div>

        <!-- Card 3: Studio Storefront Address -->
        <div class="bg-[#F6FAFD] px-6 py-6 sm:px-8 sm:py-6 rounded-2xl border border-[#B3CFE5]/50 shadow-xs flex-1 flex items-center justify-between hover:border-[#4A7FA7] transition-all duration-300">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-[#0A1931] text-white flex items-center justify-center shadow-md shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-serif font-bold text-[#0A1931] text-sm sm:text-base">Studio Storefront</h3>
              <p class="text-[11px] sm:text-xs text-[#1A3D63] font-light">Jl. Sudirman No. 45, Jakarta</p>
            </div>
          </div>
          <a 
            href="https://maps.google.com/?q=Jl.+Sudirman+No.+45,+Jakarta+Selatan" 
            target="_blank" 
            class="text-xs sm:text-sm font-bold text-[#4A7FA7] hover:text-[#1A3D63] transition cursor-pointer shrink-0 ml-3"
          >
            Google Maps →
          </a>
        </div>

      </div>

      <!-- Contact Form Container (py-3.5 / py-4 Inputs, min-h-[140px] Textarea, py-4 Button) -->
      <div class="lg:col-span-2 bg-[#F6FAFD] px-6 py-6 sm:px-10 sm:py-8 rounded-2xl border border-[#B3CFE5]/50 shadow-sm h-full flex flex-col justify-between">
        <form @submit.prevent="submitForm" class="flex-1 flex flex-col justify-between space-y-5">
          
          <div v-if="successMessage" class="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200">
            {{ successMessage }}
          </div>

          <div v-if="errorMessage" class="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-medium border border-rose-200">
            {{ errorMessage }}
          </div>

          <!-- Name & Phone Row (py-3.5 / py-4 Inputs) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label class="block text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider mb-1.5">Full Name *</label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="Dinda Pratiwi"
                class="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-[#B3CFE5]/60 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931]"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider mb-1.5">Phone Number</label>
              <input 
                v-model="form.phone" 
                type="text" 
                placeholder="+6281234567890"
                class="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-[#B3CFE5]/60 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931]"
              />
            </div>
          </div>

          <!-- Email & Subject Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label class="block text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="dinda@example.com"
                class="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-[#B3CFE5]/60 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931]"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider mb-1.5">Subject</label>
              <input 
                v-model="form.subject" 
                type="text" 
                placeholder="Size guidance or custom order"
                class="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-[#B3CFE5]/60 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931]"
              />
            </div>
          </div>

          <!-- Message Field (min-h-[140px]) -->
          <div class="flex-1 flex flex-col">
            <label class="block text-[11px] font-bold text-[#1A3D63] uppercase tracking-wider mb-1.5">Message *</label>
            <textarea 
              v-model="form.message" 
              required 
              placeholder="How can we help you?"
              class="w-full px-4 py-3.5 rounded-xl border border-[#B3CFE5]/60 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#28537A] text-[#0A1931] flex-1 min-h-[140px] resize-none"
            ></textarea>
          </div>

          <!-- Primary Submit Button (py-4) -->
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full py-4 rounded-xl btn-primary-flat font-bold text-white text-xs sm:text-sm disabled:opacity-50 transition cursor-pointer"
          >
            {{ submitting ? 'Sending Message...' : 'Send Message' }}
          </button>
        </form>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { fetchApi } = useApi();

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
});

const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const submitForm = async () => {
  try {
    submitting.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const res = await fetchApi<any>('/contact', {
      method: 'POST',
      body: form.value,
    });

    successMessage.value = res.message || 'Message sent successfully!';
    form.value = { name: '', email: '', phone: '', subject: '', message: '' };
  } catch (e: any) {
    errorMessage.value = e?.data?.message || 'Failed to submit form. Please try again.';
  } finally {
    submitting.value = false;
  }
};
</script>
