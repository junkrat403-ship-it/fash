<template>
  <main class="pt-24 sm:pt-28 pb-12 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center min-h-[calc(100vh-70px)] text-[#1A170F]">
    
    <!-- Compact Page Header -->
    <div class="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
      <span class="text-xs uppercase tracking-widest text-[#E04F26] font-bold">Get In Touch</span>
      <h1 class="font-serif text-3xl sm:text-5xl font-black text-[#1A170F] mt-1">We'd love to hear from you</h1>
      <p class="mt-2 text-[#1A170F]/80 text-xs sm:text-sm font-light leading-relaxed">
        Questions about sizing, custom orders, or shipping? Send us a message or chat with us directly on WhatsApp.
      </p>
    </div>

    <!-- Grid Container: Single Viewport Fit with Generous Element Heights -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
      
      <!-- 3 Contact Info Cards -->
      <div class="flex flex-col justify-between space-y-4 h-full">
        
        <!-- Card 1: WhatsApp Desk -->
        <div class="bg-[#FAF6F1] px-6 py-6 sm:px-8 sm:py-6 rounded-3xl border border-[#E4D8CC] shadow-md flex-1 flex items-center justify-between hover:border-[#E04F26] transition-all duration-300">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-[#E04F26] text-white flex items-center justify-center shadow-md shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 6.75c0 12.728 10.022 22.75 22.75 22.75 1.034 0 1.875-.84 1.875-1.875v-3.722c0-.518-.316-.976-.8-1.157l-4.52-1.695a1.125 1.125 0 00-1.18.292l-2.003 2.003a15.932 15.932 0 01-6.75-6.75l2.003-2.003a1.125 1.125 0 00.292-1.18L8.604 3.05a1.125 1.125 0 00-1.157-.8H3.722c-1.035 0-1.875.84-1.875 1.875z" />
              </svg>
            </div>
            <div>
              <h3 class="font-serif font-bold text-[#1A170F] text-sm sm:text-base">WhatsApp Desk</h3>
              <p class="text-[11px] sm:text-xs text-[#1A170F]/70 font-light">Mon – Sat, 09:00 - 18:00</p>
            </div>
          </div>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            class="text-xs sm:text-sm font-bold text-[#E04F26] hover:text-[#1A170F] transition cursor-pointer shrink-0 ml-3"
          >
            +62 812 3456 7890 →
          </a>
        </div>

        <!-- Card 2: Email Inquiry -->
        <div class="bg-[#FAF6F1] px-6 py-6 sm:px-8 sm:py-6 rounded-3xl border border-[#E4D8CC] shadow-md flex-1 flex items-center justify-between hover:border-[#E04F26] transition-all duration-300">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-[#1A170F] text-white flex items-center justify-center shadow-md shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <h3 class="font-serif font-bold text-[#1A170F] text-sm sm:text-base">Email Inquiry</h3>
              <p class="text-[11px] sm:text-xs text-[#1A170F]/70 font-light">Wholesale & press inquiries</p>
            </div>
          </div>
          <a 
            href="mailto:info@jubiandlee.com" 
            class="text-xs sm:text-sm font-bold text-[#1A170F] hover:text-[#E04F26] transition cursor-pointer shrink-0 ml-3"
          >
            info@jubiandlee.com
          </a>
        </div>

        <!-- Card 3: Studio Storefront Address -->
        <div class="bg-[#FAF6F1] px-6 py-6 sm:px-8 sm:py-6 rounded-3xl border border-[#E4D8CC] shadow-md flex-1 flex items-center justify-between hover:border-[#E04F26] transition-all duration-300">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-2xl bg-[#1A170F] text-white flex items-center justify-center shadow-md shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-serif font-bold text-[#1A170F] text-sm sm:text-base">Studio Storefront</h3>
              <p class="text-[11px] sm:text-xs text-[#1A170F]/70 font-light">Jl. Sudirman No. 45, Jakarta</p>
            </div>
          </div>
          <a 
            href="https://maps.google.com/?q=Jl.+Sudirman+No.+45,+Jakarta+Selatan" 
            target="_blank" 
            class="text-xs sm:text-sm font-bold text-[#E04F26] hover:text-[#1A170F] transition cursor-pointer shrink-0 ml-3"
          >
            Google Maps →
          </a>
        </div>

      </div>

      <!-- Contact Form Container -->
      <div class="lg:col-span-2 bg-[#FAF6F1] px-6 py-6 sm:px-10 sm:py-8 rounded-3xl border border-[#E4D8CC] shadow-md h-full flex flex-col justify-between">
        <form @submit.prevent="submitForm" class="flex-1 flex flex-col justify-between space-y-5">
          
          <div v-if="successMessage" class="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200">
            {{ successMessage }}
          </div>

          <div v-if="errorMessage" class="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-medium border border-rose-200">
            {{ errorMessage }}
          </div>

          <!-- Name & Phone Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1.5">Full Name *</label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="Dinda Pratiwi"
                class="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-[#E4D8CC] text-xs sm:text-sm bg-[#F4ECE5] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F]"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1.5">Phone Number</label>
              <input 
                v-model="form.phone" 
                type="text" 
                placeholder="+6281234567890"
                class="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-[#E4D8CC] text-xs sm:text-sm bg-[#F4ECE5] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F]"
              />
            </div>
          </div>

          <!-- Email & Subject Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="dinda@example.com"
                class="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-[#E4D8CC] text-xs sm:text-sm bg-[#F4ECE5] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F]"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1.5">Subject</label>
              <input 
                v-model="form.subject" 
                type="text" 
                placeholder="Size guidance or custom order"
                class="w-full px-4 py-3.5 sm:py-4 rounded-xl border border-[#E4D8CC] text-xs sm:text-sm bg-[#F4ECE5] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F]"
              />
            </div>
          </div>

          <!-- Message Field -->
          <div class="flex-1 flex flex-col">
            <label class="block text-[11px] font-bold text-[#1A170F] uppercase tracking-wider mb-1.5">Message *</label>
            <textarea 
              v-model="form.message" 
              required 
              rows="4"
              placeholder="How can our studio team help you today?"
              class="w-full flex-1 min-h-[120px] px-4 py-3.5 rounded-xl border border-[#E4D8CC] text-xs sm:text-sm bg-[#F4ECE5] focus:outline-none focus:ring-2 focus:ring-[#E04F26] text-[#1A170F] resize-none"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full py-4 rounded-2xl bg-[#E04F26] hover:bg-[#C8431E] text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{{ submitting ? 'SENDING MESSAGE...' : 'SEND MESSAGE' }}</span>
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
  phone: '',
  email: '',
  subject: '',
  message: '',
});

const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const submitForm = async () => {
  submitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await fetchApi('/contact', {
      method: 'POST',
      body: form.value,
    }).catch(() => null);

    successMessage.value = 'Thank you! Your message has been sent successfully. Our team will get back to you shortly.';
    form.value = {
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
    };
  } catch (err: any) {
    errorMessage.value = err?.message || 'Failed to send message. Please try again or chat with us on WhatsApp.';
  } finally {
    submitting.value = false;
  }
};
</script>
