import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/apiHelpers.js';

// @desc    Create order (mock checkout)
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return errorResponse(res, 400, 'No order items provided');
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    paymentMethod: paymentMethod || 'mock',
    isPaid: true,
    paidAt: new Date(),
    status: 'completed',
    transactionId: `MOCK-${Date.now()}`,
  });

  return successResponse(res, 201, order, 'Order placed successfully');
});

// @desc    Get logged-in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'title imageUrl')
    .sort({ createdAt: -1 });
  return successResponse(res, 200, orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'title imageUrl price');

  if (!order) return errorResponse(res, 404, 'Order not found');

  // Only allow owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Not authorized to view this order');
  }

  return successResponse(res, 200, order);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  return successResponse(res, 200, orders);
});
