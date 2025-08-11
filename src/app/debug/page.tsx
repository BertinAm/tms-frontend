"use client";

import React, { useState, useEffect } from "react";
import { axiosApiCall } from "../../utils/api";
import ApiDebug from "../../components/ApiDebug";

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    setLoading(true);
    setDebugInfo([]);
    
    addLog('Starting API test...');
    
    try {
      addLog('Making request to /api/tickets...');
      
      const response = await axiosApiCall('/api/tickets', {
        method: 'GET',
        timeout: 10000
      });
      
      addLog(`✅ Response status: ${response.status || 'N/A'}`);
      addLog(`✅ Response data type: ${typeof response}`);
      addLog(`✅ Is array: ${Array.isArray(response)}`);
      addLog(`✅ Data length: ${response?.length || 0}`);
      
      if (Array.isArray(response) && response.length > 0) {
        addLog(`✅ Sample ticket: ${JSON.stringify(response[0], null, 2)}`);
      }
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      addLog(`❌ Error code: ${error.code}`);
      addLog(`❌ Response status: ${error.response?.status}`);
      addLog(`❌ Response data: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectBackend = async () => {
    setLoading(true);
    addLog('Testing direct backend connection...');
    
    try {
      const response = await axiosApiCall('/api/tickets', {
        method: 'GET',
        timeout: 10000
      });
      
      addLog(`✅ Direct backend status: Success`);
      addLog(`✅ Direct backend data length: ${response?.length || 0}`);
      
    } catch (error: any) {
      addLog(`❌ Direct backend error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        API Debug Page
      </h1>
      
      <div className="mb-6">
        <ApiDebug />
      </div>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={testAPI}
              disabled={loading}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg"
            >
              {loading ? 'Testing...' : 'Test API'}
            </button>
            
            <button
              onClick={testDirectBackend}
              disabled={loading}
              className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 disabled:bg-gray-300 text-gray-900 rounded-lg"
            >
              {loading ? 'Testing...' : 'Test Direct Backend'}
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2">Debug Logs:</h3>
            {debugInfo.length === 0 ? (
              <p className="text-gray-500">Click a button to start testing...</p>
            ) : (
              <div className="space-y-1">
                {debugInfo.map((log: string, index: number) => (
                  <div key={index} className="text-sm font-mono bg-white dark:bg-gray-600 p-2 rounded">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Troubleshooting Steps:
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Check if Django server is running on port 8000</li>
            <li>• Verify Next.js proxy configuration in next.config.ts</li>
            <li>• Check browser console for CORS errors</li>
            <li>• Ensure both servers are restarted after config changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 