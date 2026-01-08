import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers.js';
import * as UserModel from '../models/User.js';
import * as RequestModel from '../models/Request.js';
import * as NotificationModel from '../models/Notification.js';
import pool from '../config/database.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // Total users
    const [users] = await pool.query('SELECT COUNT(*) as total FROM users');
    
    // Users by role
    const [usersByRole] = await pool.query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );

    // Total requests
    const [requests] = await pool.query('SELECT COUNT(*) as total FROM requests');

    // Requests by status
    const [requestsByStatus] = await pool.query(
      'SELECT status, COUNT(*) as count FROM requests GROUP BY status'
    );

    // Total donations
    const [donations] = await pool.query('SELECT COUNT(*) as total FROM donations');

    // Recent activity
    const [recentComments] = await pool.query(
      'SELECT c.*, u.name, r.title FROM comments c JOIN users u ON c.user_id = u.id JOIN requests r ON c.request_id = r.id ORDER BY c.created_at DESC LIMIT 10'
    );

    return sendSuccessResponse(res, 200, 'Dashboard stats fetched', {
      totalUsers: users[0].total,
      usersByRole,
      totalRequests: requests[0].total,
      requestsByStatus,
      totalDonations: donations[0].total,
      recentActivity: recentComments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, is_blocked, created_at FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM users');

    return sendSuccessResponse(res, 200, 'Users fetched', {
      users,
      pagination: {
        total: totalCount[0].count,
        page,
        limit,
        pages: Math.ceil(totalCount[0].count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    await pool.query('UPDATE users SET is_active = false WHERE id = ?', [userId]);
    return sendSuccessResponse(res, 200, 'User blocked successfully');
  } catch (error) {
    next(error);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    await pool.query('UPDATE users SET is_active = true WHERE id = ?', [userId]);
    return sendSuccessResponse(res, 200, 'User unblocked successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    // Delete related data (comments, donations, requests)
    await pool.query('DELETE FROM comments WHERE user_id = ? OR request_id IN (SELECT id FROM requests WHERE created_by = ?)', [userId, userId]);
    await pool.query('DELETE FROM donations WHERE donor_id = ? OR request_id IN (SELECT id FROM requests WHERE created_by = ?)', [userId, userId]);
    await pool.query('DELETE FROM requests WHERE created_by = ?', [userId]);
    await pool.query('DELETE FROM notifications WHERE user_id = ?', [userId]);
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    return sendSuccessResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getAllRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      status: req.query.status,
      category: req.query.category,
      limit,
      offset,
    };

    const requests = await RequestModel.getAllRequests(filters);
    const totalCount = await RequestModel.getRequestsCount(filters);

    return sendSuccessResponse(res, 200, 'Requests fetched', {
      requests,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const request = await RequestModel.getRequestById(requestId);

    if (!request) {
      return sendErrorResponse(res, 404, 'Request not found');
    }

    // Delete related data
    await pool.query('DELETE FROM comments WHERE request_id = ?', [requestId]);
    await pool.query('DELETE FROM donations WHERE request_id = ?', [requestId]);
    await pool.query('DELETE FROM requests WHERE id = ?', [requestId]);

    return sendSuccessResponse(res, 200, 'Request deleted successfully');
  } catch (error) {
    next(error);
  }
};
