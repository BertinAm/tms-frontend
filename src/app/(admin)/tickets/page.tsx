"use client";
import React, { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { useRouter } from "next/navigation";

export default function TicketsPage() {
  const { tickets, loading, error, connectionStatus } = useTickets();
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const router = useRouter();

  // Calculate pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

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
              <li>• Check if backend is accessible at the configured API endpoints</li>
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
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">All Tickets</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">Manage and view all system tickets</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              All Tickets ({tickets.length})
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Showing {indexOfFirstTicket + 1}-{Math.min(indexOfLastTicket, tickets.length)} of {tickets.length}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {currentTickets.length === 0 ? (
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
              {currentTickets.map((ticket) => (
                <div key={ticket.ticket_id} className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
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
                      <button
                        onClick={() => router.push(`/tickets/${ticket.ticket_id}`)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors"
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
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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