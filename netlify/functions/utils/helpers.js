const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

function generateId() {
  return uuidv4();
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function extractToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

function getUserFromToken(event) {
  const token = extractToken(event);
  if (!token) return null;
  
  return verifyToken(token);
}

function successResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers,
    body: JSON.stringify({
      success: true,
      data
    })
  };
}

function errorResponse(message, statusCode = 400) {
  return {
    statusCode,
    headers,
    body: JSON.stringify({
      success: false,
      error: message
    })
  };
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateUsername(username) {
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
}

function validatePassword(password) {
  if (password.length < 8 || password.length > 32) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpper && hasLower && hasNumber;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

function paginate(array, page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: array.length,
      totalPages: Math.ceil(array.length / limit)
    }
  };
}

module.exports = {
  generateId,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  extractToken,
  getUserFromToken,
  successResponse,
  errorResponse,
  validateEmail,
  validateUsername,
  validatePassword,
  sanitizeInput,
  paginate,
  headers
};
