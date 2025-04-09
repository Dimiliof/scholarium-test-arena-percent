
import React, { createContext, useContext } from 'react';
import { Notification, NotificationContextType } from '@/types/notification';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {
    return {} as Notification;
  },
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  getNotificationsForUser: () => []
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationState = useNotifications();
  
  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
