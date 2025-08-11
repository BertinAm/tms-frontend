"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface PerformanceData {
  system_metrics: {
    total_tickets: number;
    avg_response_time: number;
    resolution_rate: number;
    uptime_percentage: number;
  };
  response_times: Array<{
    date: string;
    avg_time: number;
  }>;
  resolution_trends: Array<{
    date: string;
    resolved: number;
    total: number;
  }>;
  top_issues: Array<{
    issue_type: string;
    count: number;
    percentage: number;
  }>;
}

export default function PerformanceAnalyticsPage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data since we don't have performance API yet
  const mockPerformanceData: PerformanceData = {
    system_metrics: {
      total_tickets: 156,
      avg_response_time: 2.4,
      resolution_rate: 87.5,
      uptime_percentage: 99.8
    },
    response_times: [
      { date: '2025-01-01', avg_time: 2.1 },
      { date: '2025-01-02', avg_time: 2.3 },
      { date: '2025-01-03', avg_time: 2.5 },
      { date: '2025-01-04', avg_time: 2.2 },
      { date: '2025-01-05', avg_time: 2.4 },
      { date: '2025-01-06', avg_time: 2.6 },
      { date: '2025-01-07', avg_time: 2.4 }
    ],
    resolution_trends: [
      { date: '2025-01-01', resolved: 12, total: 15 },
      { date: '2025-01-02', resolved: 18, total: 22 },
      { date: '2025-01-03', resolved: 15, total: 18 },
      { date: '2025-01-04', resolved: 20, total: 25 },
      { date: '2025-01-05', resolved: 16, total: 19 },
      { date: '2025-01-06', resolved: 14, total: 17 },
      { date: '2025-01-07', resolved: 22, total: 26 }
    ],
    top_issues: [
      { issue_type: 'Spam Abuse', count: 45, percentage: 28.8 },
      { issue_type: 'Copyright Violation', count: 32, percentage: 20.5 },
      { issue_type: 'Resource Abuse', count: 28, percentage: 17.9 },
      { issue_type: 'Security Breach', count: 25, percentage: 16.0 },
      { issue_type: 'DDoS Attack', count: 26, percentage: 16.7 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        // In real implementation, this would be an API call
        // const response = await axios.get('/api/analytics/performance');
        // setPerformanceData(response.data);
        
        // For now, use mock data
        setTimeout(() => {
          setPerformanceData(mockPerformanceData);
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        setError(err.message || 'Failed to load performance data');
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Performance Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">System performance and response metrics</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{performanceData.system_metrics.avg_response_time}h</p>
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
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Resolution Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{performanceData.system_metrics.resolution_rate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{performanceData.system_metrics.uptime_percentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{performanceData.system_metrics.total_tickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Response Time Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Time Trend</h3>
          <div className="space-y-3">
            {performanceData.response_times.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(day.avg_time / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white w-8 sm:w-12 text-right">
                    {day.avg_time}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Rate Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Resolution Rate Trend</h3>
          <div className="space-y-3">
            {performanceData.resolution_trends.map((day, index) => {
              const rate = (day.resolved / day.total) * 100;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white w-12 sm:w-16 text-right">
                      {rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Issues */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Top Issue Types</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {performanceData.top_issues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{issue.issue_type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{issue.count} tickets</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${issue.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white w-8 sm:w-12 text-right">
                    {issue.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 