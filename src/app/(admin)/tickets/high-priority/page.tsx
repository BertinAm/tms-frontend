"use client";
import React, { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { useRouter } from "next/navigation";

export default function HighPriorityTicketsPage() {
  const { tickets, loading, error, connectionStatus } = useTickets();
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const router = useRouter();
  
  const highPriorityTickets = tickets.filter(ticket => ticket.priority === 'high');
  
  // Calculate pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = highPriorityTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(highPriorityTickets.length / ticketsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {connectionStatus === 'failed' ? 'Connection Failed' : 'Error Loading Tickets'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Troubleshooting Steps:</h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Start Django server: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">python manage.py runserver</code></li>
              <li>• Create sample tickets: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">python manage.py create_sample_tickets</code></li>
              <li>• Check if backend is accessible at: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">http://localhost:8000/api/tickets</code></li>
              <li>• Verify database has tickets</li>
            </ul>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">High Priority Tickets</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Critical tickets requiring immediate attention</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">High Priority Tickets ({highPriorityTickets.length})</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">⚠️ Requires Immediate Action</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {indexOfFirstTicket + 1}-{Math.min(indexOfLastTicket, highPriorityTickets.length)} of {highPriorityTickets.length}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {currentTickets.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No high priority tickets found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">All tickets are currently at normal priority</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentTickets.map((ticket) => (
                <div key={ticket.ticket_id} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">#{ticket.ticket_id}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-words line-clamp-2 mb-1">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(ticket.received_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        {ticket.priority}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ticket.status === 'open' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' :
                        ticket.status === 'closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {ticket.status}
                      </span>
                      <button
                        onClick={() => router.push(`/tickets/${ticket.ticket_id}`)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}