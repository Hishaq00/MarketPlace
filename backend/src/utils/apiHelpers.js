export const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

export const successResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const paginateQuery = (query, page = 1, limit = 12) => {
  const skip = (Number(page) - 1) * Number(limit);
  return query.skip(skip).limit(Number(limit));
};
