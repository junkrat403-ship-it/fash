import { ref } from 'vue';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  imageUrl?: string;
  type?: 'success' | 'info' | 'error';
  duration?: number;
}

const toasts = ref<ToastMessage[]>([]);

export const useToast = () => {
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 4000;
    const newToast: ToastMessage = { id, ...toast };

    toasts.value.unshift(newToast);

    if (toasts.value.length > 3) {
      toasts.value.pop();
    }

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const showAddedToCart = (productName: string, variantDetails?: string, imageUrl?: string) => {
    addToast({
      title: 'Added to cart',
      message: `${productName}${variantDetails ? ` (${variantDetails})` : ''}`,
      imageUrl,
      type: 'success',
      duration: 4000,
    });
  };

  return {
    toasts,
    addToast,
    removeToast,
    showAddedToCart,
  };
};
