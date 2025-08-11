"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTickets } from "@/hooks/useTickets";
import { useGrokChat } from "@/hooks/useGrokChat";

export default function GrokChat() {
  const [inputValue, setInputValue] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { tickets, loading: ticketsLoading } = useTickets();
  const { messages, isLoading, error, sendMessage, analyzeTicket, resetConversation, conversationLength, messageCount } = useGrokChat();

  // Function to clean Grok responses by removing markdown symbols
  const cleanGrokResponse = (content: string): string => {
    return content
      .replace(/#{1,6}\s*/g, '') // Remove headers (#, ##, ###, etc.)
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold (**text**)
      .replace(/\*(.*?)\*/g, '$1') // Remove italic (*text*)
      .replace(/`(.*?)`/g, '$1') // Remove inline code (`text`)
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/---+/g, '') // Remove horizontal rules
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n'); // Clean up excessive spacing
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageToSend = inputValue.trim();
    setInputValue(''); // Clear input immediately
    
    await sendMessage(messageToSend, selectedTicket);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleQuickAction = async (action: string) => {
    setInputValue(action);
    await sendMessage(action);
    setInputValue('');
  };

  const handleTicketAnalysis = async (ticketId: string) => {
    const analysis = await analyzeTicket(ticketId);
    if (analysis) {
      const analysisMessage = `Analysis for Ticket #${ticketId}:

Key Issues: ${analysis.key_issues.join(', ')}
Urgency Level: ${analysis.urgency_level}
Threat Assessment: ${analysis.threat_assessment || 'Not specified'}
Technical Details: ${analysis.technical_details || 'Not specified'}

Recommended Actions:
${analysis.recommended_actions.map((action: string) => `• ${action}`).join('\n')}

Response Template:
${analysis.response_template}

Compliance Notes: ${analysis.compliance_notes || 'Not specified'}`;

      await sendMessage(analysisMessage, ticketId);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              TMS Chat
            </h2>
            <button
              onClick={resetConversation}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                "Show me high priority tickets",
                "What are the latest tickets?",
                "Help me analyze a ticket",
                "How do I respond to abuse complaints?"
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Tickets - Compact version */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Recent Tickets</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {ticketsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mx-auto"></div>
                </div>
              ) : tickets.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No tickets available</p>
              ) : (
                tickets.slice(0, 3).map((ticket) => (
                  <button
                    key={ticket.ticket_id}
                    onClick={() => setSelectedTicket(ticket.ticket_id)}
                    className={`w-full text-left p-2 text-xs rounded-lg transition-colors duration-200 ${
                      selectedTicket === ticket.ticket_id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">#{ticket.ticket_id}</span>
                      <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                      {ticket.subject}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-base font-bold">G</span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Grok AI Assistant</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your AI-powered ticket management assistant</p>
              </div>
            </div>
            {/* Mobile menu button */}
            <button className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {message.role === 'user' ? message.content : cleanGrokResponse(message.content)}
                    </p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(cleanGrokResponse(message.content))}
                      className="ml-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Grok is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Grok about tickets, abuse complaints, or anything else..."
              className="flex-1 px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          
          {/* Mobile Quick Actions */}
          <div className="mt-3 lg:hidden">
            <div className="flex flex-wrap gap-2">
              {[
                "High priority tickets",
                "Latest tickets",
                "Analyze ticket",
                "Abuse response"
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 