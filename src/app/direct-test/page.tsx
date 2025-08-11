"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function DirectTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testProxy = async () => {
    setLoading(true);
    setTestResult('Testing proxy connection...');
    
    try {
      console.log('🧪 Testing proxy connection...');
      
      const response = await axios.get('/api/tickets', {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Proxy test successful:', response.data);
      setTestResult(`✅ Proxy successful! Found ${response.data.length} tickets`);
      
    } catch (error: any) {
      console.error('❌ Proxy test failed:', error);
      setTestResult(`❌ Proxy failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirect = async () => {
    setLoading(true);
    setTestResult('Testing direct connection...');
    
    try {
      console.log('🧪 Testing direct connection...');
      
      const response = await axios.get('http://localhost:8000/api/tickets', {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Direct test successful:', response.data);
      setTestResult(`✅ Direct successful! Found ${response.data.length} tickets`);
      
    } catch (error: any) {
      console.error('❌ Direct test failed:', error);
      setTestResult(`❌ Direct failed: ${error.message}`);
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
              onClick={testProxy}
              disabled={loading}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg"
            >
              {loading ? 'Testing...' : 'Test Proxy'}
            </button>
            
            <button
              onClick={testDirect}
              disabled={loading}
              className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 disabled:bg-gray-300 text-gray-900 rounded-lg"
            >
              {loading ? 'Testing...' : 'Test Direct'}
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <p className="text-sm font-mono">{testResult || 'Click a button to start testing...'}</p>
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