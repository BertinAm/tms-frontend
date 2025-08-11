 "use client";
import React from "react";
import { useNotifications } from "../../../hooks/useNotifications";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const { notifications, unreadCount, isConnected, markAsRead, clearAll, fetchNotifications } = useNotifications();
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Notification System Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          This page demonstrates the real-time notification system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">WebSocket Connection:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Unread Notifications:</span>
              <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                {unreadCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Notifications:</span>
              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                {notifications.length}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button
              onClick={fetchNotifications}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Refresh Notifications
            </button>
            <button
              onClick={clearAll}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Notifications
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
                <p>No notifications yet</p>
                {!isConnected && (
                  <p className="text-xs text-red-500 mt-2">WebSocket disconnected</p>
                )}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    markAsRead(notification.id);
                    router.push(`/tickets/${notification.ticket_id}`);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {notification.ticket_id}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>{notification.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          How to Test
        </h3>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>1. Make sure the Django backend is running with Redis</p>
          <p>2. The notification system will automatically connect via WebSocket</p>
          <p>3. When new tickets are created, notifications will appear in real-time</p>
          <p>4. Check the notification bell icon in the header for live updates</p>
          <p>5. Browser notifications will also appear if permission is granted</p>
        </div>
      </div>
    </div>
  );
}