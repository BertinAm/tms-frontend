import { useState, useCallback } from 'react';
import { axiosApiCall } from '../utils/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TicketAnalysis {
  key_issues: string[];
  urgency_level: string;
  recommended_actions: string[];
  response_template: string;
  threat_assessment?: string;
  compliance_notes?: string;
  technical_details?: string;
}

interface UseGrokChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, ticketId?: string) => Promise<void>;
  analyzeTicket: (ticketId: string) => Promise<TicketAnalysis | null>;
  resetConversation: () => void;
  conversationLength: number;
  messageCount: number;
}

export const useGrokChat = (): UseGrokChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationLength, setConversationLength] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  const sendMessage = useCallback(async (message: string, ticketId?: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Send message to unified chat endpoint using API utility
      const response = await axiosApiCall('/api/chat', {
        method: 'POST',
        data: {
          message,
          session_id: 'tms-chat',
          reset: false
        }
      });

      console.log('✅ Chat API Response:', response);
      console.log('✅ Response type:', typeof response);
      console.log('✅ Response keys:', typeof response === 'object' ? Object.keys(response) : 'Not an object');

      if (response.response) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response,
          timestamp: response.timestamp || new Date().toISOString(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setConversationLength(response.conversation_length || 0);
        setMessageCount(response.message_count || 0);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeTicket = useCallback(async (ticketId: string): Promise<TicketAnalysis | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosApiCall('/api/tickets/analyze', {
        method: 'POST',
        data: {
          ticket_id: ticketId
        }
      });

      if (response.analysis) {
        return response.analysis;
      }
      return null;
    } catch (err) {
      console.error('Ticket analysis error:', err);
      setError('Failed to analyze ticket. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetConversation = useCallback(async () => {
    try {
      // Reset conversation on backend
      await axiosApiCall('/api/chat/history', {
        method: 'DELETE'
      });
      
      // Clear local messages
      setMessages([]);
      setConversationLength(0);
      setMessageCount(0);
      setError(null);
    } catch (err) {
      console.error('Reset conversation error:', err);
      setError('Failed to reset conversation. Please try again.');
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    analyzeTicket,
    resetConversation,
    conversationLength,
    messageCount,
  };
}; 