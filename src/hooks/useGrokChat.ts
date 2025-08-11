import { useState, useCallback } from 'react';
import axios from 'axios';

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

      // Send message to unified chat endpoint using direct URL
      const response = await axios.post('http://localhost:8000/api/chat', {
        message,
        session_id: 'tms-chat',
        reset: false
      });

      if (response.data.response) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.response,
          timestamp: response.data.timestamp || new Date().toISOString(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setConversationLength(response.data.conversation_length || 0);
        setMessageCount(response.data.message_count || 0);
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
      const response = await axios.post('http://localhost:8000/api/tickets/analyze', {
        ticket_id: ticketId
      });

      if (response.data.analysis) {
        return response.data.analysis;
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
      await axios.delete('http://localhost:8000/api/chat/history');
      
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