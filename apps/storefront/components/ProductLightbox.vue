<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center select-none overflow-hidden cursor-default"
        @click="handleContainerClick"
      >
        <!-- Top Right Control Cluster -->
        <div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-white shadow-2xl backdrop-blur-md cursor-default">
          <button 
            @click.stop="zoomOut" 
            :disabled="zoomLevel <= 1.0"
            class="w-9 h-9 rounded-xl hover:bg-white/15 flex items-center justify-center text-lg font-bold transition disabled:opacity-30 cursor-pointer"
            title="Zoom Out (-)"
          >
            -
          </button>
          <button 
            @click.stop="zoomIn" 
            :disabled="zoomLevel >= 3.5"
            class="w-9 h-9 rounded-xl hover:bg-white/15 flex items-center justify-center text-lg font-bold transition disabled:opacity-30 cursor-pointer"
            title="Zoom In (+)"
          >
            +
          </button>
          <div class="w-px h-5 bg-slate-700 mx-1"></div>
          <button 
            @click.stop="close" 
            class="w-9 h-9 rounded-xl hover:bg-rose-600/30 hover:text-rose-400 flex items-center justify-center text-lg font-bold transition cursor-pointer"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        <!-- Left / Right Navigation Arrows -->
        <button 
          v-if="images.length > 1"
          @click.stop="prevImage" 
          class="absolute left-4 sm:left-6 z-30 w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition cursor-pointer shadow-2xl backdrop-blur-md"
          title="Previous Image (←)"
        >
          ‹
        </button>

        <button 
          v-if="images.length > 1"
          @click.stop="nextImage" 
          class="absolute right-4 sm:right-6 z-30 w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 text-white flex items-center justify-center text-2xl hover:bg-white/20 transition cursor-pointer shadow-2xl backdrop-blur-md"
          title="Next Image (→)"
        >
          ›
        </button>

        <!-- Main Image Stage -->
        <div 
          class="relative w-full h-full p-4 flex items-center justify-center overflow-hidden cursor-default"
          @wheel.prevent="handleWheel"
          @mousedown="startPan"
          @mousemove="doPan"
          @mouseup="endPan"
          @mouseleave="endPan"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Image Element (Zoom-in / Zoom-out cursors, native drag disabled) -->
          <img 
            @click="handleImageClick"
            @dragstart.prevent
            draggable="false"
            :src="images[currentIndex]?.url" 
            :alt="images[currentIndex]?.altText || productName || 'Product Image'"
            class="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl pointer-events-auto select-none"
            :class="[
              isDragging 
                ? 'cursor-grabbing transition-none' 
                : (zoomLevel > 1.0 ? 'cursor-zoom-out transition-transform duration-150 ease-out' : 'cursor-zoom-in transition-transform duration-150 ease-out')
            ]"
            :style="{
              transform: `translate3d(${panX}px, ${panY}px, 0px) scale(${zoomLevel})`,
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }"
          />
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

export interface LightboxImage {
  url: string;
  altText?: string;
  id?: string;
}

const props = defineProps<{
  isOpen: boolean;
  images: LightboxImage[];
  selectedIndex: number;
  productName?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', index: number): void;
}>();

const currentIndex = ref(0);
const zoomLevel = ref(1.0);
const panX = ref(0);
const panY = ref(0);

const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const initialPanX = ref(0);
const initialPanY = ref(0);

const clickStartX = ref(0);
const clickStartY = ref(0);
const hasMoved = ref(false);

let rafId: number | null = null;
const touchStartDist = ref(0);
const initialZoom = ref(1.0);

watch(
  () => props.selectedIndex,
  (newIdx) => {
    if (newIdx >= 0 && newIdx < props.images.length) {
      currentIndex.value = newIdx;
      resetZoom();
    }
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      resetZoom();
      if (import.meta.client) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }
    } else {
      if (import.meta.client) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }
  }
);

const close = () => {
  resetZoom();
  emit('close');
};

const handleContainerClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target && !target.closest('img') && !target.closest('button')) {
    close();
  }
};

const handleImageClick = (e: MouseEvent) => {
  e.stopPropagation();
  if (hasMoved.value) return;

  if (zoomLevel.value > 1.0) {
    resetZoom();
  } else {
    zoomLevel.value = 2.0;
  }
};

const resetZoom = () => {
  zoomLevel.value = 1.0;
  panX.value = 0;
  panY.value = 0;
};

const zoomIn = () => {
  zoomLevel.value = Math.min(3.5, Number((zoomLevel.value + 0.5).toFixed(1)));
};

const zoomOut = () => {
  const newZoom = Math.max(1.0, Number((zoomLevel.value - 0.5).toFixed(1)));
  zoomLevel.value = newZoom;
  if (newZoom === 1.0) {
    panX.value = 0;
    panY.value = 0;
  }
};

const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY < 0 ? 0.25 : -0.25;
  const newZoom = Math.min(3.5, Math.max(1.0, Number((zoomLevel.value + delta).toFixed(2))));
  zoomLevel.value = newZoom;
  if (newZoom === 1.0) {
    panX.value = 0;
    panY.value = 0;
  }
};

const prevImage = () => {
  if (props.images.length <= 1) return;
  const nextIdx = (currentIndex.value - 1 + props.images.length) % props.images.length;
  currentIndex.value = nextIdx;
  resetZoom();
  emit('select', nextIdx);
};

const nextImage = () => {
  if (props.images.length <= 1) return;
  const nextIdx = (currentIndex.value + 1) % props.images.length;
  currentIndex.value = nextIdx;
  resetZoom();
  emit('select', nextIdx);
};

const updatePan = (newX: number, newY: number) => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    panX.value = newX;
    panY.value = newY;
  });
};

// Panning Handlers (Mouse)
const startPan = (e: MouseEvent) => {
  e.preventDefault(); // Disable native browser image/file dragging & text selection
  clickStartX.value = e.clientX;
  clickStartY.value = e.clientY;
  hasMoved.value = false;

  if (zoomLevel.value <= 1.0) return;
  isDragging.value = true;
  dragStartX.value = e.clientX;
  dragStartY.value = e.clientY;
  initialPanX.value = panX.value;
  initialPanY.value = panY.value;
};

const doPan = (e: MouseEvent) => {
  const dist = Math.hypot(e.clientX - clickStartX.value, e.clientY - clickStartY.value);
  if (dist > 5) {
    hasMoved.value = true;
  }

  if (!isDragging.value || zoomLevel.value <= 1.0) return;
  const dx = e.clientX - dragStartX.value;
  const dy = e.clientY - dragStartY.value;
  updatePan(initialPanX.value + dx, initialPanY.value + dy);
};

const endPan = () => {
  isDragging.value = false;
};

// Panning & Pinch Handlers (Mobile Touch)
const getTouchDistance = (touches: TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
};

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    touchStartDist.value = getTouchDistance(e.touches);
    initialZoom.value = zoomLevel.value;
  } else if (e.touches.length === 1 && zoomLevel.value > 1.0) {
    isDragging.value = true;
    dragStartX.value = e.touches[0].clientX;
    dragStartY.value = e.touches[0].clientY;
    initialPanX.value = panX.value;
    initialPanY.value = panY.value;
  }
};

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 2 && touchStartDist.value > 0) {
    const currentDist = getTouchDistance(e.touches);
    const scale = currentDist / touchStartDist.value;
    zoomLevel.value = Math.min(3.5, Math.max(1.0, Number((initialZoom.value * scale).toFixed(2))));
  } else if (e.touches.length === 1 && isDragging.value && zoomLevel.value > 1.0) {
    const dx = e.touches[0].clientX - dragStartX.value;
    const dy = e.touches[0].clientY - dragStartY.value;
    updatePan(initialPanX.value + dx, initialPanY.value + dy);
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;
  touchStartDist.value = 0;
};

// Global Keyboard Shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.isOpen) return;
  if (e.key === 'Escape') {
    close();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  } else if (e.key === 'ArrowRight') {
    nextImage();
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    if (rafId) cancelAnimationFrame(rafId);
  }
});
</script>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease-out;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
