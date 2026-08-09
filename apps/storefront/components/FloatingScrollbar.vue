<template>
  <ClientOnly>
    <div 
      v-if="shouldShow" 
      class="fixed top-4 bottom-4 right-3 sm:right-4 z-[9999] w-3 flex flex-col justify-start pointer-events-none select-none"
    >
      <!-- Track area (Clickable) -->
      <div 
        ref="trackRef"
        @click="handleTrackClick"
        class="relative w-full h-full pointer-events-auto cursor-pointer"
      >
        <!-- Floating Pill Thumb -->
        <div 
          @mousedown.prevent="startDrag"
          @touchstart.prevent="startTouchDrag"
          :style="{
            height: `${thumbHeight}px`,
            transform: `translateY(${thumbTop}px)`
          }"
          :class="[
            isDragging || isHovered || isScrolling 
              ? 'opacity-100 bg-slate-900 shadow-lg scale-110' 
              : 'opacity-40 bg-slate-700 hover:opacity-90'
          ]"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          class="absolute right-0 w-2.5 rounded-full transition-opacity transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing backdrop-blur-xs"
        ></div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const trackRef = ref<HTMLElement | null>(null);
const shouldShow = ref(false);
const thumbHeight = ref(40);
const thumbTop = ref(0);

const isDragging = ref(false);
const isHovered = ref(false);
const isScrolling = ref(false);

let scrollHideTimeout: any = null;
let dragStartY = 0;
let dragStartScrollTop = 0;
let styleMutationObserver: MutationObserver | null = null;
let resizeObserver: ResizeObserver | null = null;

const isScrollLocked = () => {
  if (typeof document === 'undefined') return false;
  return document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden';
};

const updateScrollbar = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (isScrollLocked()) {
    shouldShow.value = false;
    return;
  }

  const docEl = document.documentElement;
  const scrollHeight = docEl.scrollHeight;
  const clientHeight = window.innerHeight;
  const scrollTop = window.scrollY || docEl.scrollTop;

  const maxScroll = scrollHeight - clientHeight;

  if (maxScroll <= 10) {
    shouldShow.value = false;
    return;
  }

  shouldShow.value = true;

  const trackHeight = clientHeight - 32; // 16px top and bottom inset
  const calculatedHeight = Math.max(36, (clientHeight / scrollHeight) * trackHeight);
  thumbHeight.value = Math.min(calculatedHeight, trackHeight - 20);

  const maxThumbTop = trackHeight - thumbHeight.value;
  thumbTop.value = Math.min(maxThumbTop, Math.max(0, (scrollTop / maxScroll) * maxThumbTop));
};

const onScroll = () => {
  if (isScrollLocked()) {
    shouldShow.value = false;
    return;
  }
  updateScrollbar();
  isScrolling.value = true;

  if (scrollHideTimeout) clearTimeout(scrollHideTimeout);
  scrollHideTimeout = setTimeout(() => {
    isScrolling.value = false;
  }, 1000);
};

const handleTrackClick = (e: MouseEvent) => {
  if (!trackRef.value || isDragging.value || isScrollLocked()) return;
  const rect = trackRef.value.getBoundingClientRect();
  const clickY = e.clientY - rect.top;
  const trackHeight = rect.height;
  
  const docEl = document.documentElement;
  const maxScroll = docEl.scrollHeight - window.innerHeight;
  
  const targetScroll = (clickY / trackHeight) * maxScroll;
  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
};

const startDrag = (e: MouseEvent) => {
  if (isScrollLocked()) return;
  isDragging.value = true;
  dragStartY = e.clientY;
  dragStartScrollTop = window.scrollY;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || isScrollLocked()) return;
  const deltaY = e.clientY - dragStartY;
  
  const docEl = document.documentElement;
  const clientHeight = window.innerHeight;
  const maxScroll = docEl.scrollHeight - clientHeight;
  const trackHeight = clientHeight - 32;
  const maxThumbTop = trackHeight - thumbHeight.value;

  if (maxThumbTop <= 0) return;

  const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
  window.scrollTo({ top: dragStartScrollTop + scrollDelta });
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

const startTouchDrag = (e: TouchEvent) => {
  if (!e.touches[0] || isScrollLocked()) return;
  isDragging.value = true;
  dragStartY = e.touches[0].clientY;
  dragStartScrollTop = window.scrollY;

  window.addEventListener('touchmove', onTouchDrag);
  window.addEventListener('touchend', stopTouchDrag);
};

const onTouchDrag = (e: TouchEvent) => {
  if (!isDragging.value || !e.touches[0] || isScrollLocked()) return;
  const deltaY = e.touches[0].clientY - dragStartY;
  
  const docEl = document.documentElement;
  const clientHeight = window.innerHeight;
  const maxScroll = docEl.scrollHeight - clientHeight;
  const trackHeight = clientHeight - 32;
  const maxThumbTop = trackHeight - thumbHeight.value;

  if (maxThumbTop <= 0) return;

  const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
  window.scrollTo({ top: dragStartScrollTop + scrollDelta });
};

const stopTouchDrag = () => {
  isDragging.value = false;
  window.removeEventListener('touchmove', onTouchDrag);
  window.removeEventListener('touchend', stopTouchDrag);
};

onMounted(() => {
  updateScrollbar();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateScrollbar, { passive: true });

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateScrollbar());
    resizeObserver.observe(document.body);
  }

  if (typeof MutationObserver !== 'undefined') {
    styleMutationObserver = new MutationObserver(() => {
      updateScrollbar();
    });
    styleMutationObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    styleMutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', updateScrollbar);
  }
  if (scrollHideTimeout) clearTimeout(scrollHideTimeout);
  if (resizeObserver) resizeObserver.disconnect();
  if (styleMutationObserver) styleMutationObserver.disconnect();
  stopDrag();
});
</script>
