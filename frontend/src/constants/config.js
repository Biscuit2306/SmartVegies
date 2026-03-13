// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: "SmartVegies",
  VERSION: "1.0.0",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Date Format
export const DATE_FORMAT = "MMM DD, YYYY";
export const TIME_FORMAT = "HH:mm";
export const DATETIME_FORMAT = "MMM DD, YYYY HH:mm";

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 1 hour
};

// User Types
export const USER_TYPES = {
  FARMER: "farmer",
  BUYER: "buyer",
};

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  PREFERENCES: "preferences",
};
