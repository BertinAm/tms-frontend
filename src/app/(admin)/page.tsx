"use client";

import React from "react";
import { useTickets } from "@/hooks/useTickets";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function TMSDashboard() {
  const { tickets, loading, stats } = useTickets();
  const { user } = useAuth();
  const router = useRouter();

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Good Morning' : currentTime < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.first_name || user?.username || 'User'}! 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your tickets today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button className="flex-1 px-4 py-3 sm:px-6 sm:py-3 bg-secondary-500 hover:bg-secondary-600 text-gray-900 rounded-[40px] text-sm sm:text-base font-medium transition-colors duration-200 animate-pulse-glow">
          View All Tickets
        </button>
        <button 
          onClick={() => window.location.href = '/chat'}
          className="flex-1 px-4 py-3 sm:px-6 sm:py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-[40px] text-sm sm:text-base font-medium transition-all duration-200 animate-gradient-shift"
        >
          Chat with Grok
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Tickets
                </h2>
                <button className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-500"></div>
                  <span className="ml-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading tickets...</span>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">No tickets found</p>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first ticket to get started</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div 
                      key={ticket.ticket_id} 
                      className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                      onClick={() => router.push(`/tickets/${ticket.ticket_id}`)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">#{ticket.ticket_id}</span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white break-words line-clamp-2 mb-1">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(ticket.received_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                          <span className={`inline-flex px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded-full ${
                            ticket.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {ticket.priority}
                          </span>
                          <span className={`inline-flex px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded-full ${
                            ticket.status === 'open' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' :
                            ticket.status === 'closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: '🎫', message: 'New high priority ticket received', time: '2 min ago', color: 'red' },
                  { icon: '💬', message: 'Live chat session started', time: '5 min ago', color: 'blue' },
                  { icon: '✅', message: 'Ticket #1234 has been resolved', time: '1 hour ago', color: 'green' },
                  { icon: '⚙️', message: 'System maintenance completed', time: '3 hours ago', color: 'purple' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-${activity.color}-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs sm:text-sm">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
