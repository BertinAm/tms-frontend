import { useState, useEffect } from 'react';
import { axiosApiCall } from '../utils/api';

export interface ActivityLog {
  id: string;
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
  activity_type: string;
  activity_type_display: string;
  severity: string;
  severity_display: string;
  description: string;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  related_ticket: {
    ticket_id: string;
    subject: string;
  } | null;
  created_at: string;
}

export const useActivityLogs = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosApiCall('/api/activity-logs/', {
        method: 'GET'
      });

      setActivities(response.activities);
    } catch (err: any) {
      console.error('Error fetching activity logs:', err);
      setError('Failed to load activity logs');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'error':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
    }
  };

  const getActivityTypeIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'user_login':
        return '🔐';
      case 'user_logout':
        return '🚪';
      case 'ticket_view':
        return '👁️';
      case 'ticket_create':
        return '➕';
      case 'ticket_update':
        return '✏️';
      case 'ticket_status_change':
        return '🔄';
      case 'ticket_priority_change':
        return '⚡';
      case 'chat_message':
        return '💬';
      case 'ai_analysis':
        return '🤖';
      case 'email_received':
        return '📧';
      case 'notification_sent':
        return '📢';
      case 'error_occurred':
        return '❌';
      default:
        return '📝';
    }
  };

  return {
    activities,
    loading,
    error,
    fetchActivityLogs,
    getSeverityColor,
    getActivityTypeIcon,
  };
};
