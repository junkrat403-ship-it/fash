import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  let rafId: number;
  function raf(time: number) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);

  const router = useRouter();
  router.afterEach(() => {
    lenis.scrollTo(0, { immediate: true });
  });

  return {
    provide: {
      lenis,
    },
  };
});
