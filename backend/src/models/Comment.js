import pool from '../config/database.js';

// Create comment
export const createComment = async (commentData) => {
  const { requestId, userId, content } = commentData;
  const [result] = await pool.query(
    'INSERT INTO comments (request_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
    [requestId, userId, content]
  );
  return result.insertId;
};

// Get comments by request ID
export const getCommentsByRequest = async (requestId) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.name, u.role 
     FROM comments c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.request_id = ? 
     ORDER BY c.created_at DESC`,
    [requestId]
  );
  return rows;
};

// Delete comment
export const deleteComment = async (commentId) => {
  await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);
};

// Get comment by ID
export const getCommentById = async (commentId) => {
  const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [commentId]);
  return rows[0];
};
