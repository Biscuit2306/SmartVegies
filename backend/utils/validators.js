// Email Validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password Validation
const validatePassword = (password) => {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

// Phone Number Validation
const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

// URL Validation
const validateURL = (url) => {
  const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return re.test(url);
};

// Numeric Validation
const validateNumeric = (value) => {
  return !isNaN(value) && isFinite(value);
};

// Positive Number Validation
const validatePositiveNumber = (value) => {
  return validateNumeric(value) && value > 0;
};

// Array Validation
const validateArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};

// String Length Validation
const validateStringLength = (str, min = 1, max = 255) => {
  return typeof str === "string" && str.length >= min && str.length <= max;
};

// Name Validation
const validateName = (name) => {
  const re = /^[a-zA-Z\s]{2,50}$/;
  return re.test(name);
};

// Sanitize Input
const sanitizeInput = (str) => {
  if (typeof str !== "string") return str;
  return str.trim().replace(/[<>\"']/g, "");
};

// Validate Object Properties
const validateObjectProperties = (obj, requiredProps) => {
  return requiredProps.every((prop) => obj.hasOwnProperty(prop) && obj[prop] !== null && obj[prop] !== undefined);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateURL,
  validateNumeric,
  validatePositiveNumber,
  validateArray,
  validateStringLength,
  validateName,
  sanitizeInput,
  validateObjectProperties,
};
