<template>
  <div class="min-h-screen bg-[#E6ECF0] flex text-[#0A1931] font-sans">

    <aside class="w-64 bg-white border-r border-[#B3CFE5]/40 flex flex-col justify-between shrink-0 hidden md:flex shadow-xs">
      <div class="overflow-y-auto">
        
        <div class="p-6 border-b border-[#B3CFE5]/30">
          <div class="font-serif text-2xl font-extrabold text-[#0A1931] tracking-[0.2em]">AURA</div>
          <p class="text-[10px] text-[#28537A] font-bold uppercase tracking-widest mt-0.5">Admin Portal</p>
        </div>

        <nav class="p-4 space-y-1 text-xs font-medium">
          
          <RouterLink 
            to="/" 
            exact-active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span>Dashboard</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('products.read')"
            to="/products" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <span>Products</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('categories.read')"
            to="/categories" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <span>Categories</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('products.read')"
            to="/inventory" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <span>Inventory</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('orders.read')"
            to="/orders" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span>Orders Pipeline</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('orders.read')"
            to="/customers" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <span>Customers</span>
          </RouterLink>

          <div class="pt-4 pb-1 px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Marketing & Content</div>

          <RouterLink 
            v-if="authStore.hasPermission('banners.read')"
            to="/content/banners" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" />
            </svg>
            <span>Banners</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('discounts.read')"
            to="/marketing/discounts" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V9a3 3 0 01-.879 2.121l-9.192 9.192a3 3 0 01-4.242 0l-1.5-1.5a3 3 0 010-4.242L12.88 5.379A3 3 0 0115 4.5h3.75a.75.75 0 01.75.75z" />
            </svg>
            <span>Discounts</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('messages.read')"
            to="/messages" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.375v5.25c0 1.035.84 1.875 1.875 1.875h16.5c1.035 0 1.875-.84 1.875-1.875v-5.25m-19.5 0V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v7.125" />
            </svg>
            <span>Contact Inbox</span>
          </RouterLink>

          <div class="pt-4 pb-1 px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">System & Audit</div>

          <RouterLink 
            v-if="authStore.hasPermission('analytics.read')"
            to="/analytics" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 005.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
            <span>Sales Analytics</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('settings.read')"
            to="/settings" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Store Settings</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('users.read')"
            to="/users" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span>Users & Roles</span>
          </RouterLink>

          <RouterLink 
            v-if="authStore.hasPermission('activity_logs.read')"
            to="/activity-logs" 
            active-class="bg-[#28537A]/10 text-[#28537A] font-bold border-l-4 border-[#28537A] shadow-2xs"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0A1931] transition"
          >
            
            <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Activity Logs</span>
          </RouterLink>
        </nav>
      </div>

      <div class="p-4 border-t border-[#B3CFE5]/30">
        <div class="flex items-center space-x-3 mb-3 px-2">
          <div class="w-8 h-8 rounded-full bg-[#0A1931] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {{ authStore.user?.name?.charAt(0) || 'A' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-semibold text-[#0A1931] truncate">{{ authStore.user?.name }}</p>
            <span class="inline-block text-[9px] bg-[#28537A]/15 text-[#28537A] px-1.5 py-0.5 rounded font-bold uppercase">
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>

        <button 
          @click="handleLogout"
          class="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition text-left flex items-center space-x-2.5 cursor-pointer"
        >
          <svg class="w-4 h-4 shrink-0 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">

      <header class="bg-white border-b border-[#B3CFE5]/40 h-16 px-6 flex items-center justify-between shadow-2xs">
        <div class="font-semibold text-[#0A1931] text-sm">
          Fashion E-Commerce Administration
        </div>

        <div class="flex items-center space-x-4">
          <span class="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API Online</span>
          </span>
        </div>
      </header>

      <main class="p-6 sm:p-8 overflow-y-auto flex-1">
        <slot />
      </main>

    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
