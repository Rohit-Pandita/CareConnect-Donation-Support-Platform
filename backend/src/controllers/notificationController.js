import { sendSuccessResponse } from '../utils/helpers.js';
import * as NotificationModel from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const notifications = await NotificationModel.getUserNotifications(req.user.id, limit, offset);
    const unreadCount = await NotificationModel.getUnreadCount(req.user.id);

    return sendSuccessResponse(res, 200, 'Notifications fetched', {
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await NotificationModel.markAsRead(notificationId);
    return sendSuccessResponse(res, 200, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await NotificationModel.markAllAsRead(req.user.id);
    return sendSuccessResponse(res, 200, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await NotificationModel.deleteNotification(notificationId);
    return sendSuccessResponse(res, 200, 'Notification deleted');
  } catch (error) {
    next(error);
  }
};
