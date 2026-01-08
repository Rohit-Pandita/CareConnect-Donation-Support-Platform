import pool from '../config/database.js';

// Create request
export const createRequest = async (requestData) => {
  const { title, description, category, createdBy, imageUrl } = requestData;
  const [result] = await pool.query(
    'INSERT INTO requests (title, description, category, user_id, image_url) VALUES (?, ?, ?, ?, ?)',
    [title, description, category, createdBy, imageUrl || null]
  );
  return result.insertId;
};

// Get request by ID
export const getRequestById = async (requestId) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.name as created_by_name, u.email, u.phone, u.organization_name 
     FROM requests r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.id = ?`,
    [requestId]
  );
  return rows[0];
};

// Get all requests with pagination and filters
export const getAllRequests = async (filters = {}) => {
  let query = `SELECT r.*, u.name as created_by_name, u.organization_name 
               FROM requests r 
               JOIN users u ON r.user_id = u.id 
               WHERE 1=1`;
  const values = [];

  if (filters.status) {
    query += ' AND r.status = ?';
    values.push(filters.status);
  }

  if (filters.category) {
    query += ' AND r.category = ?';
    values.push(filters.category);
  }

  if (filters.search) {
    query += ' AND (r.title LIKE ? OR r.description LIKE ?)';
    values.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  query += ' ORDER BY r.created_at DESC';

  if (filters.limit && filters.offset) {
    query += ' LIMIT ? OFFSET ?';
    values.push(filters.limit, filters.offset);
  }

  const [rows] = await pool.query(query, values);
  return rows;
};

// Get user's requests
export const getUserRequests = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

// Update request status
export const updateRequestStatus = async (requestId, status) => {
  await pool.query('UPDATE requests SET status = ? WHERE id = ?', [status, requestId]);
};

// Update request
export const updateRequest = async (requestId, updateData) => {
  const allowedFields = ['title', 'description', 'category', 'quantity', 'urgency'];
  const updates = [];
  const values = [];

  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(updateData[key]);
    }
  });

  if (updates.length === 0) return;

  values.push(requestId);
  const query = `UPDATE requests SET ${updates.join(', ')} WHERE id = ?`;
  await pool.query(query, values);
};

// Delete request
export const deleteRequest = async (requestId) => {
  await pool.query('DELETE FROM requests WHERE id = ?', [requestId]);
};

// Get total requests count
export const getRequestsCount = async (filters = {}) => {
  let query = 'SELECT COUNT(*) as count FROM requests WHERE 1=1';
  const values = [];

  if (filters.status) {
    query += ' AND status = ?';
    values.push(filters.status);
  }

  if (filters.category) {
    query += ' AND category = ?';
    values.push(filters.category);
  }

  const [rows] = await pool.query(query, values);
  return rows[0].count;
};
