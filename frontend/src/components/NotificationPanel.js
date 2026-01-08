import { useState, useEffect } from 'react';
import { notificationService } from '../services/api.js';
import '../styles/NotificationPanel.css';

export const NotificationPanel = ({ socket, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off('notification');
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications({ limit: 20 });
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
              onClick={() => handleMarkAsRead(notif.id)}
            >
              <div className="notification-content">
                <p className="notification-message">{notif.message}</p>
                <small className="notification-time">{new Date(notif.created_at).toLocaleString()}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
