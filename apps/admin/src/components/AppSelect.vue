<template>
  <div 
    ref="containerRef" 
    class="relative"
    :class="[fullWidth ? 'w-full block' : 'inline-block']"
  >
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      :class="[
        compact 
          ? 'px-2.5 py-1 text-[11px] rounded-lg' 
          : 'px-3.5 py-2.5 text-xs rounded-xl',
        fullWidth ? 'w-full justify-between' : '',
        isOpen ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-400',
        disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'bg-white cursor-pointer',
        btnClass
      ]"
      class="border text-slate-800 font-semibold flex items-center gap-2 transition shadow-2xs select-none max-w-full"
      :title="selectedLabel"
      :aria-expanded="isOpen"
    >
      <div class="flex items-center gap-1.5 min-w-0 truncate">
        <!-- Optional Icon -->
        <svg 
          v-if="icon === 'filter'" 
          class="w-3.5 h-3.5 text-[#E04F26] shrink-0" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
        </svg>

        <span class="truncate">{{ selectedLabel }}</span>
      </div>

      <!-- Chevron Indicator -->
      <svg 
        :class="[isOpen ? 'rotate-180 text-slate-900' : 'text-slate-400']"
        class="w-3.5 h-3.5 transition-transform duration-200 shrink-0 ml-auto" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2.5" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <!-- Dropdown Menu Popover -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        :class="[
          align === 'right' ? 'right-0' : 'left-0',
          fullWidth ? 'w-full' : 'min-w-[180px]',
          compact ? 'p-1 rounded-xl' : 'p-1.5 rounded-2xl',
          menuClass
        ]"
        class="absolute top-full mt-1.5 bg-white border border-slate-200 shadow-xl z-50 max-h-60 overflow-y-auto"
      >
        <button
          v-for="opt in normalizedOptions"
          :key="String(opt.value)"
          type="button"
          :disabled="opt.disabled"
          @click="selectOption(opt)"
          :class="[
            compact ? 'px-2.5 py-1.5 text-[11px] rounded-lg' : 'px-3 py-2 text-xs rounded-xl',
            isSelected(opt.value)
              ? 'bg-slate-900 text-white font-extrabold shadow-xs'
              : opt.disabled
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold cursor-pointer'
          ]"
          class="w-full text-left transition flex items-center justify-between gap-2"
        >
          <span class="truncate">{{ opt.label }}</span>
          <svg 
            v-if="isSelected(opt.value)" 
            class="w-3.5 h-3.5 text-[#E04F26] shrink-0" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2.5" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface OptionItem {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    options: Array<string | number | OptionItem>;
    placeholder?: string;
    icon?: string;
    disabled?: boolean;
    compact?: boolean;
    fullWidth?: boolean;
    align?: 'left' | 'right';
    btnClass?: string;
    menuClass?: string;
  }>(),
  {
    modelValue: '',
    placeholder: 'Select option...',
    icon: '',
    disabled: false,
    compact: false,
    fullWidth: false,
    align: 'left',
    btnClass: '',
    menuClass: '',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const normalizedOptions = computed<OptionItem[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value,
        label: opt.label !== undefined ? String(opt.label) : String(opt.value),
        disabled: !!opt.disabled,
      };
    }
    return {
      value: opt,
      label: String(opt),
      disabled: false,
    };
  });
});

const selectedLabel = computed(() => {
  const found = normalizedOptions.value.find((opt) => String(opt.value) === String(props.modelValue ?? ''));
  return found ? found.label : props.placeholder;
});

const isSelected = (val: string | number) => {
  return String(val) === String(props.modelValue ?? '');
};

const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

const selectOption = (opt: OptionItem) => {
  if (opt.disabled) return;
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  isOpen.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('keydown', handleKeyDown);
  }
});
</script>
