"use client";

import React, { useState } from "react";
import { axiosApiCall } from "../../utils/api";

export default function DirectTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axiosApiCall('/api/tickets', {
        method: 'GET',
        timeout: 10000
      });

      setResult(response);
    } catch (err: any) {
      console.error("Direct test error:", err);
      setError(`Failed to connect: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Direct Connection Test
      </h1>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={testDirectConnection}
              disabled={loading}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            {loading && <p className="text-sm font-mono">Testing connection...</p>}
            {error && <p className="text-sm font-mono text-red-600">{error}</p>}
            {result && (
              <div>
                <p className="text-sm font-mono text-green-600">✅ Connection successful!</p>
                <p className="text-sm font-mono">Found {Array.isArray(result) ? result.length : 0} tickets</p>
              </div>
            )}
            {!loading && !error && !result && <p className="text-sm font-mono">Click a button to start testing...</p>}
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            What to check:
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• If proxy fails but direct works: Next.js proxy issue</li>
            <li>• If both fail: Backend server issue</li>
            <li>• If both work: Frontend code issue</li>
            <li>• Check browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 