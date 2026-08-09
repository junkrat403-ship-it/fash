/// <reference types="vite/client" />

const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('.devtunnels.ms')) {
      const protocol = window.location.protocol;
      if (hostname.includes('-3002.')) {
        return `${protocol}//${hostname.replace('-3002.', '-3000.')}/api/v1`;
      }
    }
  }

  return 'http://localhost:3000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();
