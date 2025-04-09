
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types/notification';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  // Φορτώνει τις ειδοποιήσεις από το localStorage κατά την αρχικοποίηση
  useEffect(() => {
    if (!user) return;
    
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const parsedNotifications: Notification[] = JSON.parse(storedNotifications);
      setNotifications(parsedNotifications);
    }
  }, [user]);

  // Αποθηκεύει τις ειδοποιήσεις στο localStorage όταν αλλάζουν
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Επιστρέφει μόνο τις ειδοποιήσεις που αφορούν τον συγκεκριμένο χρήστη
  const getNotificationsForUser = useCallback((userId: string) => {
    return notifications.filter(notification => 
      !notification.recipientId || // για όλους
      notification.recipientId === userId || // συγκεκριμένα για αυτόν
      (notification.recipientIds && notification.recipientIds.includes(userId)) // ανήκει στη λίστα παραληπτών
    );
  }, [notifications]);

  // Προσθέτει μια νέα ειδοποίηση
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Εμφανίζει ένα toast για την ειδοποίηση στον αποστολέα
    toast.success('Η ειδοποίηση στάλθηκε με επιτυχία');
    
    return newNotification;
  }, []);

  // Μαρκάρει μια ειδοποίηση ως αναγνωσμένη
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  }, []);

  // Μαρκάρει όλες τις ειδοποιήσεις ως αναγνωσμένες
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  // Διαγράφει μια ειδοποίηση
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  // Υπολογίζει τον αριθμό των μη αναγνωσμένων ειδοποιήσεων για τον τρέχοντα χρήστη
  const unreadCount = user 
    ? getNotificationsForUser(user.id).filter(n => !n.isRead).length 
    : 0;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getNotificationsForUser
  };
};
