"use client";

import React from 'react';
import { useTickets } from '@/hooks/useTickets';

export default function HookTestPage() {
  const { tickets, loading, error, connectionStatus, stats } = useTickets();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Hook Test Page
      </h1>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Hook Status:</h2>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Loading:</span>
              <span className={`px-2 py-1 rounded text-sm ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {loading ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Connection Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {connectionStatus}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Error:</span>
              <span className="text-sm text-red-600 dark:text-red-400">
                {error || 'None'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Tickets Count:</span>
              <span className="text-sm">{tickets.length}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">Stats:</span>
              <span className="text-sm">
                Total: {stats.total}, Open: {stats.open}, High Priority: {stats.highPriority}, Resolved: {stats.resolved}
              </span>
            </div>
          </div>
        </div>
        
        {tickets.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Sample Tickets:</h2>
            <div className="space-y-2">
              {tickets.slice(0, 3).map((ticket, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="text-sm font-medium">{ticket.ticket_id}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{ticket.subject}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Instructions:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Check browser console for detailed logs</li>
            <li>• Look for API call logs starting with 🔍</li>
            <li>• Verify if the hook is being called</li>
            <li>• Check if API response is being processed</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 