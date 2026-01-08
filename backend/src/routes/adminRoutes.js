import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(authMiddleware, roleMiddleware('admin'));

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/block', adminController.blockUser);
router.patch('/users/:userId/unblock', adminController.unblockUser);
router.delete('/users/:userId', adminController.deleteUser);

// Request management
router.get('/requests', adminController.getAllRequests);
router.delete('/requests/:requestId', adminController.deleteRequest);

export default router;
