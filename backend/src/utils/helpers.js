import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import dotenv from 'dotenv';

dotenv.config();

// Password hashing
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// JWT token generation
export const generateAccessToken = (payload) => {
  return jwt.encode(payload, process.env.JWT_SECRET, 'HS256');
};

export const generateRefreshToken = (payload) => {
  return jwt.encode(payload, process.env.JWT_REFRESH_SECRET, 'HS256');
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.decode(token, process.env.JWT_SECRET, true, 'HS256');
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.decode(token, process.env.JWT_REFRESH_SECRET, true, 'HS256');
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Error response handler
export const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

export const sendSuccessResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Format user object (without password)
export const formatUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};
