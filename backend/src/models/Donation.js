import pool from '../config/database.js';

// Track donation (when donor accepts a request)
export const createDonation = async (donationData) => {
  const { requestId, donorId, status } = donationData;
  const [result] = await pool.query(
    'INSERT INTO donations (request_id, donor_id, status, created_at) VALUES (?, ?, ?, NOW())',
    [requestId, donorId, status || 'accepted']
  );
  return result.insertId;
};

// Get donation by ID
export const getDonationById = async (donationId) => {
  const [rows] = await pool.query('SELECT * FROM donations WHERE id = ?', [donationId]);
  return rows[0];
};

// Get donations for a request
export const getDonationsByRequest = async (requestId) => {
  const [rows] = await pool.query(
    `SELECT d.*, u.name, u.email, u.phone 
     FROM donations d 
     JOIN users u ON d.donor_id = u.id 
     WHERE d.request_id = ?`,
    [requestId]
  );
  return rows;
};

// Get donor's donations
export const getDonorDonations = async (donorId) => {
  const [rows] = await pool.query(
    `SELECT d.*, r.title, r.status 
     FROM donations d 
     JOIN requests r ON d.request_id = r.id 
     WHERE d.donor_id = ? 
     ORDER BY d.created_at DESC`,
    [donorId]
  );
  return rows;
};

// Update donation status
export const updateDonationStatus = async (donationId, status) => {
  await pool.query('UPDATE donations SET status = ? WHERE id = ?', [status, donationId]);
};

// Check if donor already accepted
export const checkDonorAccepted = async (requestId, donorId) => {
  const [rows] = await pool.query(
    'SELECT * FROM donations WHERE request_id = ? AND donor_id = ?',
    [requestId, donorId]
  );
  return rows.length > 0;
};
