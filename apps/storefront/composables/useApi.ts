export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || 'http://localhost:3000/api/v1';

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
