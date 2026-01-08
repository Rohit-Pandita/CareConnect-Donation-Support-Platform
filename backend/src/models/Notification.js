import pool from '../config/database.js';

// Create notification
export const createNotification = async (notificationData) => {
  const { userId, type, message, relatedId, relatedType } = notificationData;
  await pool.query(
    'INSERT INTO notifications (user_id, type, message, related_id, related_type, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
    [userId, type, message, relatedId || null, relatedType || null, false]
  );
};

// Get user notifications
export const getUserNotifications = async (userId, limit = 20, offset = 0) => {
  const [rows] = await pool.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [userId, limit, offset]
  );
  return rows;
};

// Get unread notifications count
export const getUnreadCount = async (userId) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
    [userId]
  );
  return rows[0].count;
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  await pool.query('UPDATE notifications SET is_read = true WHERE id = ?', [notificationId]);
};

// Mark all as read
export const markAllAsRead = async (userId) => {
  await pool.query('UPDATE notifications SET is_read = true WHERE user_id = ?', [userId]);
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  await pool.query('DELETE FROM notifications WHERE id = ?', [notificationId]);
};
