"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      console.log('🧪 Testing frontend-backend connection...');
      
      const response = await axios.get('/api/tickets', {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Test successful:', response.data);
      setTestResult(`✅ Connection successful! Found ${response.data.length} tickets`);
      
    } catch (error: any) {
      console.error('❌ Test failed:', error);
      setTestResult(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        API Connection Test
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        {testResult && (
          <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm font-mono">{testResult}</p>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Troubleshooting Steps:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Ensure Django server is running on port 8000</li>
            <li>• Check if backend is accessible at http://localhost:8000/api/tickets</li>
            <li>• Verify Next.js proxy configuration in next.config.ts</li>
            <li>• Check browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 