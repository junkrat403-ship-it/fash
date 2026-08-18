export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || 'http://localhost:3000/api/v1';

  const fetchApi = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (import.meta.client) {
      const token = localStorage.getItem('jl_customer_token');
      if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return $fetch<T>(`${apiBase}${endpoint}`, {
      ...options,
      headers,
    });
  };

  return {
    fetchApi,
    apiBase,
  };
};

type FetchOptions = Parameters<typeof $fetch>[1];
