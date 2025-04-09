
import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle, XCircle, Check, Trash2 } from 'lucide-react';
import { Notification as NotificationType } from '@/types/notification';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

export const NotificationList: React.FC = () => {
  const { getNotificationsForUser, markAsRead, markAllAsRead, removeNotification } = useNotification();
  const { user } = useAuth();

  if (!user) return null;

  const userNotifications = getNotificationsForUser(user.id);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleMarkAsRead = (notification: NotificationType) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(id);
  };

  if (userNotifications.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        <p>Δεν έχετε ειδοποιήσεις αυτή τη στιγμή.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <Check className="mr-2 h-4 w-4" />
          Μαρκάρισμα όλων ως αναγνωσμένων
        </Button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto space-y-2 pr-1">
        {userNotifications.map((notification) => (
          <Alert 
            key={notification.id} 
            variant={notification.isRead ? "default" : "default"}
            className={`cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
            onClick={() => handleMarkAsRead(notification)}
          >
            <div className="flex items-center">
              {getNotificationIcon(notification.type)}
              <div className="ml-2 flex-1">
                <AlertTitle className="font-semibold flex items-center justify-between">
                  <span>{notification.title}</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {format(new Date(notification.timestamp), 'dd MMM, HH:mm', { locale: el })}
                  </span>
                </AlertTitle>
                <AlertDescription className="mt-1">
                  {notification.message}
                </AlertDescription>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Από: {notification.senderName}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={(e) => handleDelete(notification.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </div>
  );
};
