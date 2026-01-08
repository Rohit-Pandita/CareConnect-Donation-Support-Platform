import { sendSuccessResponse, sendErrorResponse, hashPassword, generateAccessToken, generateRefreshToken, comparePassword, verifyRefreshToken } from '../utils/helpers.js';
import { registerValidation, loginValidation, updateProfileValidation } from '../utils/validators.js';
import * as UserModel from '../models/User.js';

export const register = async (req, res, next) => {
  try {
    const { error, value } = registerValidation(req.body);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const existingUser = await UserModel.getUserByEmail(value.email);
    if (existingUser) {
      return sendErrorResponse(res, 409, 'Email already registered');
    }

    const hashedPassword = await hashPassword(value.password);
    const userId = await UserModel.createUser({
      ...value,
      password: hashedPassword,
    });

    const payload = { id: userId, email: value.email, role: value.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return sendSuccessResponse(res, 201, 'User registered successfully', {
      userId,
      accessToken,
      refreshToken,
      user: { id: userId, email: value.email, role: value.role, fullName: value.fullName },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error, value } = loginValidation(req.body);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const user = await UserModel.getUserByEmail(value.email);
    if (!user) {
      return sendErrorResponse(res, 401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(value.password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Invalid email or password');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return sendSuccessResponse(res, 200, 'Login successful', {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        institutionName: user.organization_name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return sendErrorResponse(res, 400, 'Refresh token required');
    }

    const payload = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken({ id: payload.id, email: payload.email, role: payload.role });

    return sendSuccessResponse(res, 200, 'Token refreshed', { accessToken: newAccessToken });
  } catch (error) {
    return sendErrorResponse(res, 401, 'Invalid refresh token');
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.getUserById(req.user.id);
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return sendSuccessResponse(res, 200, 'Profile fetched', userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateProfileValidation(req.body);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    await UserModel.updateUserProfile(req.user.id, value);
    const updatedUser = await UserModel.getUserById(req.user.id);

    const { password, ...userWithoutPassword } = updatedUser;
    return sendSuccessResponse(res, 200, 'Profile updated successfully', userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
