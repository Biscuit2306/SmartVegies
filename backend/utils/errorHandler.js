// Custom Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async Error Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation Error Handler
const validationError = (message = "Validation Error") => {
  return new AppError(message, 400);
};

// Not Found Error Handler
const notFoundError = (message = "Resource not found") => {
  return new AppError(message, 404);
};

// Unauthorized Error Handler
const unauthorizedError = (message = "Unauthorized") => {
  return new AppError(message, 401);
};

// Forbidden Error Handler
const forbiddenError = (message = "Forbidden") => {
  return new AppError(message, 403);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  validationError,
  notFoundError,
  unauthorizedError,
  forbiddenError,
};
