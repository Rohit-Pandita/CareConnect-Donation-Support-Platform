import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get notifications
router.get('/', authMiddleware, notificationController.getNotifications);

// Mark as read
router.patch('/:notificationId/read', authMiddleware, notificationController.markAsRead);

// Mark all as read
router.patch('/mark-all-read', authMiddleware, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);

export default router;
