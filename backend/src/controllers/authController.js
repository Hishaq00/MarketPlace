import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiHelpers.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, 400, 'Please provide name, email and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return errorResponse(res, 409, 'User with this email already exists');
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user._id);

  return successResponse(res, 201, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  }, 'Registration successful');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  return successResponse(res, 200, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  }, 'Login successful');
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return errorResponse(res, 404, 'User not found');

  return successResponse(res, 200, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  return successResponse(res, 200, users);
});

// @desc    Delete user (Admin)
// @route   DELETE /api/auth/users/:id
// @access  Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return errorResponse(res, 404, 'User not found');
  return successResponse(res, 200, null, 'User deleted successfully');
});
