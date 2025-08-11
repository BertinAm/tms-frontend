"use client";

import React, { useState, useEffect } from "react";
import { axiosApiCall } from "../../../../utils/api";

export default function TicketAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosApiCall(`/api/tickets/analytics?days=${timeRange}`, {
        method: "GET"
      });

      setAnalytics(response);
    } catch (err: any) {
      console.error("Error loading analytics:", err);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={fetchAnalytics} 
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Ticket Analytics</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">Comprehensive analysis of ticket data</p>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{analytics.summary.total_tickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{analytics.summary.open_tickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{analytics.summary.high_priority}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{analytics.summary.closed_tickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Daily Ticket Count */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Ticket Count</h3>
          <div className="space-y-2">
            {analytics.daily_counts.map((day: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((day.count / Math.max(...analytics.daily_counts.map((d: any) => d.count))) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white w-6 sm:w-8 text-right">
                    {day.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">High Priority</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{analytics.priority_distribution.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Medium Priority</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{analytics.priority_distribution.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Low Priority</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{analytics.priority_distribution.low}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
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
          {analytics.recent_tickets.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">No tickets found</p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">No recent tickets available for this period</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {analytics.recent_tickets.map((ticket: any) => (
                <div 
                  key={ticket.ticket_id} 
                  className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                  onClick={() => window.location.href = `/tickets/${ticket.ticket_id}`}
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
  );
} 