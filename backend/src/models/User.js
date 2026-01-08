import pool from '../config/database.js';

// Get user by ID
export const getUserById = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
};

// Get user by email
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Create new user
export const createUser = async (userData) => {
  const { fullName, email, password, role, phone, institutionName, address } = userData;
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role, phone, organization_name, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [fullName, email, password, role, phone, institutionName || null, address || null]
  );
  return result.insertId;
};

// Update user profile
export const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'phone', 'address', 'organization_name', 'bio', 'is_verified'];
  const updates = [];
  const values = [];

  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(updateData[key]);
    }
  });

  if (updates.length === 0) return;

  values.push(userId);
  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  await pool.query(query, values);
};

// Get user stats
export const getUserStats = async (userId, role) => {
  if (role === 'caretaker') {
    const [requests] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as fulfilled FROM requests WHERE user_id = ?',
      [userId]
    );
    return requests[0];
  } else if (role === 'donor') {
    const [donations] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as fulfilled FROM donations WHERE donor_id = ?',
      [userId]
    );
    return donations[0];
  }
};
