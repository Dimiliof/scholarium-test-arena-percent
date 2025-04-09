
export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipientId?: string; // null για όλους τους μαθητές
  recipientIds?: string[]; // συγκεκριμένοι μαθητές
  senderId: string;
  senderName: string;
  timestamp: number;
  isRead: boolean;
  classroomId?: string; // για ειδοποιήσεις προς συγκεκριμένη τάξη
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  getNotificationsForUser: (userId: string) => Notification[];
}
