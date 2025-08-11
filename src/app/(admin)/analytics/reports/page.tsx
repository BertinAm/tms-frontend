"use client";
import React, { useState } from "react";

export default function ReportsPage() {
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleGenerateReport = async (reportType: string) => {
    setGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false);
      // In real implementation, this would download a file
      alert(`${reportType} report generated successfully!`);
    }, 2000);
  };

  const reports = [
    {
      title: "Monthly Ticket Summary",
      description: "Comprehensive monthly report of all ticket activities",
      icon: "📊",
      type: "monthly_summary"
    },
    {
      title: "Priority Analysis Report",
      description: "Detailed analysis of ticket priorities and trends",
      icon: "⚠️",
      type: "priority_analysis"
    },
    {
      title: "Resolution Performance",
      description: "Performance metrics and resolution times",
      icon: "⚡",
      type: "performance"
    },
    {
      title: "Abuse Type Distribution",
      description: "Breakdown of different types of abuse complaints",
      icon: "🔍",
      type: "abuse_types"
    },
    {
      title: "Response Time Analysis",
      description: "Average response times and efficiency metrics",
      icon: "⏱️",
      type: "response_times"
    },
    {
      title: "System Health Report",
      description: "Overall system performance and uptime statistics",
      icon: "🏥",
      type: "system_health"
    }
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">Generate and download comprehensive reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {reports.map((report) => (
          <div key={report.type} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="text-2xl sm:text-3xl">{report.icon}</div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {report.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {report.description}
                </p>
                <button
                  onClick={() => handleGenerateReport(report.title)}
                  disabled={generatingReport}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  {generatingReport ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Export Section */}
      <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Export</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs sm:text-sm">Export CSV</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs sm:text-sm">Export PDF</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs sm:text-sm">Export JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
} 