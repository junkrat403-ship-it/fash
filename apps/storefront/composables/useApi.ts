export const useApi = () => {
  const config = useRuntimeConfig();
  let apiBase = config.public.apiBase;

  // On client side, allow overriding or auto-deriving Microsoft Dev Tunnels URL
  if (import.meta.client && typeof window !== 'undefined') {
    const customBase = window.localStorage.getItem('NUXT_PUBLIC_API_BASE') || (window as any).__API_BASE_URL__;
    if (customBase) {
      apiBase = customBase;
    } else {
      const hostname = window.location.hostname;
      const port = window.location.port;
      const protocol = window.location.protocol;

      // Auto-detect Microsoft Dev Tunnels (.devtunnels.ms)
      if (hostname.includes('.devtunnels.ms')) {
        // Pattern 1: Subdomain port (e.g. 74k8gtb3-3001.jpe1.devtunnels.ms -> 74k8gtb3-3000.jpe1.devtunnels.ms)
        if (hostname.includes('-3001.')) {
          const apiHost = hostname.replace('-3001.', '-3000.');
          apiBase = `${protocol}//${apiHost}/api/v1`;
        } else if (hostname.includes('-3002.')) {
          const apiHost = hostname.replace('-3002.', '-3000.');
          apiBase = `${protocol}//${apiHost}/api/v1`;
        } 
        // Pattern 2: Port suffix or root domain (e.g. 74k8gtb3.jpe1.devtunnels.ms:3001 -> :3000)
        else if (port === '3001' || port === '3002') {
          apiBase = `${protocol}//${hostname}:3000/api/v1`;
        } else if (!hostname.includes('-3000.') && port !== '3000') {
          apiBase = `${protocol}//${hostname}:3000/api/v1`;
        }
      }
    }
  }

  const fetchApi = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    return $fetch<T>(`${apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };

  return {
    fetchApi,
    apiBase,
  };
};

type FetchOptions = Parameters<typeof $fetch>[1];
