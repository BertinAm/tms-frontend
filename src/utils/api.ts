// API URL configuration for both localhost and Render
const API_URLS = {
  LOCAL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  RENDER: process.env.NEXT_PUBLIC_RENDER_API_URL || 'https://tms-backend-mnf4.onrender.com'
};

// Function to get the appropriate API URL based on environment
export const getApiUrl = (): string => {
  // In production or when Render URL is explicitly set, use Render
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_RENDER_API_URL) {
    return API_URLS.RENDER;
  }
  
  // In development, use localhost
  return API_URLS.LOCAL;
};

// Function to get all available API URLs for fallback
export const getApiUrls = (): string[] => {
  // In production, prioritize Render backend
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_RENDER_API_URL) {
    return [API_URLS.RENDER, API_URLS.LOCAL];
  }
  
  // In development, try localhost first
  return [API_URLS.LOCAL, API_URLS.RENDER];
};

// Function to make API calls with fallback
export const apiCall = async (
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    headers?: Record<string, string>;
    timeout?: number;
  } = {}
): Promise<any> => {
  const urls = getApiUrls();
  const { method = 'GET', data, headers = {}, timeout = 10000 } = options;

  for (const baseUrl of urls) {
    try {
      const url = `${baseUrl}${endpoint}`;
      console.log(`🔄 Trying API call to: ${url}`);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(timeout),
      });

      if (response.ok) {
        console.log(`✅ API call successful to: ${baseUrl}`);
        return await response.json();
      }
    } catch (error) {
      console.warn(`⚠️ API call failed to ${baseUrl}:`, error);
      continue;
    }
  }

  throw new Error('All API endpoints failed');
};

// Axios wrapper for backward compatibility
export const axiosApiCall = async (
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    headers?: Record<string, string>;
    timeout?: number;
  } = {}
): Promise<any> => {
  const urls = getApiUrls();
  const { method = 'GET', data, headers = {}, timeout = 10000 } = options;

  for (const baseUrl of urls) {
    try {
      const url = `${baseUrl}${endpoint}`;
      console.log(`🔄 Trying axios call to: ${url}`);
      
      const axios = (await import('axios')).default;
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        timeout,
      });

      console.log(`✅ Axios call successful to: ${baseUrl}`);
      return response.data;
    } catch (error) {
      console.warn(`⚠️ Axios call failed to ${baseUrl}:`, error);
      continue;
    }
  }

  throw new Error('All API endpoints failed');
};

// Export the base URLs for direct use
export const API_BASE_URLS = API_URLS;