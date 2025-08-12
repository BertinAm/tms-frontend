// API URL configuration for both localhost and Render
const API_URLS = {
  LOCAL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  RENDER: process.env.NEXT_PUBLIC_RENDER_API_URL || 'https://tms-backend-mnf4.onrender.com'
};

// Function to get the appropriate API URL based on environment
export const getApiUrl = (): string => {
  // Debug logging
  console.log('🔍 Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_RENDER_API_URL: process.env.NEXT_PUBLIC_RENDER_API_URL,
    window_location: typeof window !== 'undefined' ? window.location.hostname : 'server'
  });

  // Force Render backend if we're not on localhost
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.log('🌐 Using Render backend (not localhost)');
    return API_URLS.RENDER;
  }

  // In production or when Render URL is explicitly set, use Render
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_RENDER_API_URL) {
    console.log('🚀 Using Render backend (production/Render URL set)');
    return API_URLS.RENDER;
  }
  
  // In development, use localhost
  console.log('🏠 Using localhost backend (development)');
  return API_URLS.LOCAL;
};

// Function to get all available API URLs for fallback
export const getApiUrls = (): string[] => {
  // Force Render backend if we're not on localhost
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.log('🌐 Prioritizing Render backend (not localhost)');
    return [API_URLS.RENDER, API_URLS.LOCAL];
  }

  // In production, prioritize Render backend
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_RENDER_API_URL) {
    console.log('🚀 Prioritizing Render backend (production/Render URL set)');
    return [API_URLS.RENDER, API_URLS.LOCAL];
  }
  
  // In development, try localhost first
  console.log('🏠 Prioritizing localhost backend (development)');
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
  const { method = 'GET', data, headers = {}, timeout = 15000 } = options;

  for (const baseUrl of urls) {
    try {
      const url = `${baseUrl}${endpoint}`;
      console.log(`🔄 Trying axios call to: ${url}`);
      console.log(`📤 Request method: ${method}`);
      console.log(`📤 Request data:`, data);
      console.log(`📤 Request headers:`, headers);
      
      const axios = (await import('axios')).default;
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        timeout,
        withCredentials: false, // Disable credentials for CORS
      });

      console.log(`✅ Axios call successful to: ${baseUrl}`);
      console.log(`📥 Response status:`, response.status);
      console.log(`📥 Response data:`, response.data);
      return response.data;
    } catch (error: any) {
      console.warn(`⚠️ Axios call failed to ${baseUrl}:`, error);
      console.warn(`⚠️ Error details:`, {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
      
      // If it's the last URL, throw the error
      if (baseUrl === urls[urls.length - 1]) {
        throw error;
      }
      continue;
    }
  }

  throw new Error('All API endpoints failed');
};

// Export the base URLs for direct use
export const API_BASE_URLS = API_URLS;