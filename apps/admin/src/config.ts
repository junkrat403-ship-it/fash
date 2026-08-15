
const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  return 'https://fashion-store-api-lttn.onrender.com/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();
