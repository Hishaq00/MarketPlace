import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiHelpers.js';

// @desc    Get all products (with search, filter, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 12, sort = '-createdAt' } = req.query;

  const query = { isActive: true };

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('seller', 'name email')
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return successResponse(res, 200, {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('seller', 'name email');
  if (!product || !product.isActive) {
    return errorResponse(res, 404, 'Product not found');
  }
  return successResponse(res, 200, product);
});

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, imageUrl, category, tags, fileUrl } = req.body;

  if (!title || !description || price === undefined || !imageUrl || !category) {
    return errorResponse(res, 400, 'Please provide all required fields');
  }

  const product = await Product.create({
    title,
    description,
    price: Number(price),
    imageUrl,
    category,
    tags: tags || [],
    fileUrl: fileUrl || '',
    seller: req.user._id,
  });

  const populated = await product.populate('seller', 'name email');
  return successResponse(res, 201, populated, 'Product created successfully');
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return errorResponse(res, 404, 'Product not found');

  const { title, description, price, imageUrl, category, tags, fileUrl, isActive } = req.body;

  product.title = title ?? product.title;
  product.description = description ?? product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.imageUrl = imageUrl ?? product.imageUrl;
  product.category = category ?? product.category;
  product.tags = tags ?? product.tags;
  product.fileUrl = fileUrl ?? product.fileUrl;
  product.isActive = isActive !== undefined ? isActive : product.isActive;

  const updated = await product.save();
  await updated.populate('seller', 'name email');

  return successResponse(res, 200, updated, 'Product updated successfully');
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return errorResponse(res, 404, 'Product not found');
  return successResponse(res, 200, null, 'Product deleted successfully');
});

// @desc    Get all products for Admin (including inactive)
// @route   GET /api/products/admin/all
// @access  Admin
export const getAdminProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const total = await Product.countDocuments();
  const products = await Product.find({})
    .populate('seller', 'name email')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return successResponse(res, 200, {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});
