'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';

interface Ticket {
  ticket_id: string;
  subject: string;
  status: string;
  priority: string;
  received_at: string;
  sender_email: string;
  recipient_email: string;
  body: string;
  analysis?: string;
  created_at: string;
  updated_at: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.ticket_id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tickets/${ticketId}`);
        if (!response.ok) {
          throw new Error('Ticket not found');
        }
        const data = await response.json();
        setTicket(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Ticket Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The requested ticket could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <PageBreadCrumb pageTitle="Ticket Details" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Ticket Information */}
        <div className="lg:col-span-2">
          <ComponentCard title="Ticket Information">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {ticket.subject}
              </h1>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket ID:</span>
                    <p className="text-gray-900 dark:text-white font-mono">{ticket.ticket_id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Received:</span>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(ticket.received_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created:</span>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated:</span>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(ticket.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">From:</span>
                    <p className="text-gray-900 dark:text-white">{ticket.sender_email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">To:</span>
                    <p className="text-gray-900 dark:text-white">{ticket.recipient_email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Content</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                  {ticket.body}
                </pre>
              </div>
            </div>

            {ticket.analysis && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Analysis</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{ticket.analysis}</p>
                </div>
              </div>
            )}
          </ComponentCard>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ComponentCard title="Quick Actions">
            <div className="space-y-3">
              <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Mark as Resolved
              </button>
              <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                Request Analysis
              </button>
              <button className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                Export Details
              </button>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
} 