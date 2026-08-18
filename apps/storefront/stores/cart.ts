import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  productImages?: { url: string; altText?: string }[];
}

export interface CartItemVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  priceOverride?: number;
  stockQuantity: number;
  product: CartItemProduct;
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: CartItemVariant;
}

export interface CartData {
  id: string;
  guestToken?: string;
  cartItems: CartItem[];
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref<CartData | null>(null);
  const guestToken = ref<string>('');
  const isLoading = ref<boolean>(false);
  const isDrawerOpen = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Debounce maps for rapid quantity updates
  const updateDebounceTimers = new Map<string, any>();
  const originalQuantities = new Map<string, number>();

  const totalItems = computed(() => {
    if (!cart.value?.cartItems) return 0;
    return cart.value.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  });

  const subtotal = computed(() => {
    if (!cart.value?.cartItems) return 0;
    return cart.value.cartItems.reduce((acc, item) => {
      const price = Number(item.variant?.priceOverride || item.variant?.product?.['basePrice'] || 0);
      return acc + price * item.quantity;
    }, 0);
  });

  const initCart = async () => {
    if (import.meta.client) {
      let token = localStorage.getItem('guest_cart_token');
      if (!token) {
        token = 'guest_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('guest_cart_token', token);
      }
      guestToken.value = token;
      await fetchCart();
    }
  };

  const fetchCart = async () => {
    const { fetchApi } = useApi();
    try {
      isLoading.value = true;
      error.value = null;
      const data = await fetchApi<CartData>(`/cart?guestToken=${guestToken.value}`);
      cart.value = data;
    } catch (e: any) {
      error.value = e.message || 'Failed to load cart';
    } finally {
      isLoading.value = false;
    }
  };

  const addItem = async (variantId: string, quantity: number = 1, customRedirectUrl?: string) => {
    const authStore = useCustomerAuthStore();
    if (!authStore.isAuthenticated) {
      if (import.meta.client) {
        const returnUrl = customRedirectUrl || window.location.pathname + window.location.search;
        await navigateTo(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      }
      return;
    }

    const { fetchApi } = useApi();
    try {
      isLoading.value = true;
      error.value = null;
      const data = await fetchApi<CartData>('/cart/items', {
        method: 'POST',
        body: {
          variantId,
          quantity,
          guestToken: guestToken.value,
        },
      });
      cart.value = data;
    } catch (e: any) {
      error.value = e?.data?.message || e.message || 'Failed to add item to cart';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!cart.value?.cartItems) return;
    const item = cart.value.cartItems.find((i) => i.id === itemId);
    if (!item) return;

    const maxStock = item.variant?.stockQuantity ?? 99;
    const targetQty = Math.max(1, Math.min(maxStock, newQuantity));

    if (item.quantity === targetQty) return;

    // 1. Store original quantity for rollback if this is the first click in a rapid sequence
    if (!originalQuantities.has(itemId)) {
      originalQuantities.set(itemId, item.quantity);
    }

    // 2. OPTIMISTIC UPDATE: Instant 0ms local state & subtotal update
    item.quantity = targetQty;

    // Clear previous pending debounced API timer for this item if user clicked rapidly
    if (updateDebounceTimers.has(itemId)) {
      clearTimeout(updateDebounceTimers.get(itemId));
    }

    // 3. DEBOUNCED BACKEND SYNC (300ms debounce window)
    const timer = setTimeout(async () => {
      const { fetchApi } = useApi();
      const rollbackQty = originalQuantities.get(itemId);
      originalQuantities.delete(itemId);
      updateDebounceTimers.delete(itemId);

      try {
        error.value = null;
        const data = await fetchApi<CartData>(`/cart/items/${itemId}`, {
          method: 'PATCH',
          body: { quantity: targetQty },
        });
        cart.value = data;
      } catch (e: any) {
        if (rollbackQty !== undefined && item) {
          item.quantity = rollbackQty;
        }
        error.value = e?.data?.message || e.message || 'Failed to update item';
      }
    }, 300);

    updateDebounceTimers.set(itemId, timer);
  };

  const removeItem = async (itemId: string) => {
    if (!cart.value?.cartItems) return;
    const index = cart.value.cartItems.findIndex((i) => i.id === itemId);
    if (index === -1) return;

    const removedItem = cart.value.cartItems[index];

    // OPTIMISTIC REMOVAL: Instant 0ms removal from screen
    cart.value.cartItems.splice(index, 1);

    const { fetchApi } = useApi();
    try {
      error.value = null;
      const data = await fetchApi<CartData>(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      cart.value = data;
    } catch (e: any) {
      if (removedItem) {
        cart.value.cartItems.splice(index, 0, removedItem);
      }
      error.value = e?.data?.message || e.message || 'Failed to remove item';
    }
  };

  const updateItemVariant = async (itemId: string, newVariantId: string) => {
    const { fetchApi } = useApi();
    try {
      isLoading.value = true;
      error.value = null;
      const data = await fetchApi<CartData>(`/cart/items/${itemId}`, {
        method: 'PATCH',
        body: { variantId: newVariantId },
      });
      cart.value = data;
    } catch (e: any) {
      error.value = e?.data?.message || e.message || 'Failed to update variant';
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
  };

  const mergeWithCustomer = async () => {
    const { fetchApi } = useApi();
    try {
      if (guestToken.value) {
        const data = await fetchApi<CartData>('/cart/merge', {
          method: 'POST',
          body: { guestToken: guestToken.value },
        });
        cart.value = data;
      } else {
        await fetchCart();
      }
    } catch {
      await fetchCart();
    }
  };

  return {
    cart,
    guestToken,
    isLoading,
    isDrawerOpen,
    error,
    totalItems,
    subtotal,
    initCart,
    initializeCart: initCart,
    fetchCart,
    addItem,
    updateQuantity,
    updateItemVariant,
    removeItem,
    toggleDrawer,
    mergeWithCustomer,
  };
});
