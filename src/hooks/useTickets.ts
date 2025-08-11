import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Ticket {
  ticket_id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  received_at: string;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      
      console.log('🔍 Attempting to fetch tickets from backend...');
      console.log('📍 API URL: http://localhost:8000/api/tickets');
      
      const response = await axios.get('http://localhost:8000/api/tickets', {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
        // Add additional options to help with debugging
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      });
      
      console.log('✅ API Response Status:', response.status);
      console.log('✅ API Response Headers:', response.headers);
      console.log('✅ API Response Data Type:', typeof response.data);
      console.log('✅ API Response Data:', response.data);
      console.log('✅ Is Array?', Array.isArray(response.data));
      
      // Handle both array and string responses
      let ticketData = response.data;
      
      // If response is a string, try to parse it as JSON
      if (typeof response.data === 'string') {
        console.log('⚠️ Response is a string, attempting to parse as JSON...');
        try {
          ticketData = JSON.parse(response.data);
          console.log('✅ Successfully parsed string as JSON');
        } catch (parseError) {
          console.error('❌ Failed to parse string as JSON:', parseError);
          setError('Invalid JSON response from server');
          setTickets([]);
          setConnectionStatus('failed');
          return; 
        }
      }
      
      // Ensure we have an array
      if (Array.isArray(ticketData)) {
        console.log('✅ Response is an array, setting tickets...');
        setTickets(ticketData);
        setError(null);
        setConnectionStatus('connected');
        console.log(`✅ Successfully loaded ${ticketData.length} tickets`);
        
        // Log sample ticket data for debugging
        if (ticketData.length > 0) {
          console.log('📋 Sample ticket:', ticketData[0]);
        }
      } else {
        console.error('❌ Unexpected response format:', ticketData);
        console.error('❌ Response type:', typeof ticketData);
        console.error('❌ Response keys:', Object.keys(ticketData || {}));
        setError('Invalid response format from server - expected array but got: ' + typeof ticketData);
        setTickets([]);
        setConnectionStatus('failed');
      }
    } catch (err: any) {
      console.error('❌ Error fetching tickets:', err);
      console.error('❌ Error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      // Provide specific error messages based on the error
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to backend server. Please ensure Django server is running on port 8000.');
        setConnectionStatus('failed');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check if the backend is properly configured.');
        setConnectionStatus('failed');
      } else if (err.response?.status === 500) {
        setError('Backend server error. Please check Django logs.');
        setConnectionStatus('failed');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check if the backend server is responding.');
        setConnectionStatus('failed');
      } else {
        setError(`Failed to load tickets: ${err.message}`);
        setConnectionStatus('failed');
      }
      
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 useTickets hook initialized, fetching tickets...');
    fetchTickets();
    // Refresh tickets every 30 seconds
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStats = () => {
    // Ensure tickets is always an array
    const ticketsArray = Array.isArray(tickets) ? tickets : [];
    
    const total = ticketsArray.length;
    const open = ticketsArray.filter(t => t.status === 'open').length;
    const highPriority = ticketsArray.filter(t => t.priority === 'high').length;
    const resolved = ticketsArray.filter(t => t.status === 'closed').length;

    console.log('📊 Stats calculated:', { total, open, highPriority, resolved });
    console.log('📊 Current tickets state:', tickets);
    return { total, open, highPriority, resolved };
  };

  return {
    tickets: Array.isArray(tickets) ? tickets : [],
    loading,
    error,
    connectionStatus,
    stats: getStats(),
    refetch: fetchTickets
  };
}; 