"use client";

import React, { useState } from 'react';
import { axiosApiCall } from "../../utils/api";
import ApiDebug from "../../components/ApiDebug";

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('List the high priority tickets');
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testTicketsAPI = async () => {
    setIsLoading(true);
    addLog('Testing tickets API...');
    
    try {
      const response = await axiosApiCall('/api/tickets', {
        method: 'GET'
      });
      
      addLog(`✅ Tickets API successful: ${Array.isArray(response) ? response.length : 'Invalid response'} tickets`);
      addLog(`📋 Sample ticket: ${JSON.stringify(response[0] || 'No tickets')}`);
    } catch (error: any) {
      addLog(`❌ Tickets API failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testChatAPI = async () => {
    setIsLoading(true);
    addLog('Testing chat API...');
    
    try {
      const response = await axiosApiCall('/api/chat', {
        method: 'POST',
        data: {
          message: testMessage,
          session_id: 'debug-test',
          reset: false
        }
      });
      
      addLog(`✅ Chat API successful`);
      addLog(`📋 Response: ${response.response?.substring(0, 100)}...`);
    } catch (error: any) {
      addLog(`❌ Chat API failed: ${error.message}`);
      addLog(`🔍 Error details: ${JSON.stringify(error.response?.data || error.message)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnectivity = async () => {
    setIsLoading(true);
    addLog('Testing basic connectivity...');
    
    try {
      const response = await fetch('https://tms-backend-mnf4.onrender.com/api/', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (response.ok) {
        addLog(`✅ Basic connectivity successful: ${response.status}`);
      } else {
        addLog(`⚠️ Basic connectivity failed: ${response.status}`);
      }
    } catch (error: any) {
      addLog(`❌ Basic connectivity failed: ${error.message}`);
    } finally {
      setIsLoading(false);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Test Connectivity</h2>
          <button
            onClick={testConnectivity}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Basic Connectivity'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Test Tickets API</h2>
          <button
            onClick={testTicketsAPI}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Tickets API'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Test Chat API</h2>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter test message"
          />
          <button
            onClick={testChatAPI}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Chat API'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Debug Logs</h2>
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Run a test to see results.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setLogs([])}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
} 