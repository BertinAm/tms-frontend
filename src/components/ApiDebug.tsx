"use client";

import { useEffect, useState } from 'react';
import { getApiUrl, getApiUrls } from '../utils/api';

export default function ApiDebug() {
  const [apiInfo, setApiInfo] = useState<any>(null);

  useEffect(() => {
    const info = {
      primaryUrl: getApiUrl(),
      allUrls: getApiUrls(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_RENDER_API_URL: process.env.NEXT_PUBLIC_RENDER_API_URL,
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
      }
    };
    setApiInfo(info);
  }, []);

  if (!apiInfo) return <div>Loading API debug info...</div>;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="font-bold mb-2">API Configuration Debug</h3>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(apiInfo, null, 2)}
      </pre>
    </div>
  );
}
