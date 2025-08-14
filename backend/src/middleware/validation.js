const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Room search validation
const validateRoomSearch = [
  query('check_in')
    .optional()
    .isISO8601()
    .withMessage('Check-in date must be a valid date'),
  query('check_out')
    .optional()
    .isISO8601()
    .withMessage('Check-out date must be a valid date'),
  query('guests')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Guest count must be between 1 and 10'),
  query('room_type')
    .optional()
    .isIn(['standard', 'deluxe', 'premium', 'suite', 'business'])
    .withMessage('Invalid room type'),
  query('min_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('max_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  handleValidationErrors
];

// Booking creation validation
const validateBooking = [
  body('room_id')
    .isInt({ min: 1 })
    .withMessage('Room ID must be a positive integer'),
  body('check_in_date')
    .isISO8601()
    .withMessage('Check-in date must be a valid date')
    .custom((value) => {
      const checkIn = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkIn < today) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),
  body('check_out_date')
    .isISO8601()
    .withMessage('Check-out date must be a valid date')
    .custom((value, { req }) => {
      const checkOut = new Date(value);
      const checkIn = new Date(req.body.check_in_date);
      
      if (checkOut <= checkIn) {
        throw new Error('Check-out date must be after check-in date');
      }
      
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 30) {
        throw new Error('Booking cannot exceed 30 days');
      }
      
      return true;
    }),
  body('guest_count')
    .isInt({ min: 1, max: 10 })
    .withMessage('Guest count must be between 1 and 10'),
  body('special_requests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Special requests cannot exceed 500 characters'),
  handleValidationErrors
];

// User profile update validation
const validateProfileUpdate = [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// Booking ID validation
const validateBookingId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Booking ID must be a positive integer'),
  handleValidationErrors
];

// Room ID validation
const validateRoomId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Room ID must be a positive integer'),
  handleValidationErrors
];

// Refresh token validation
const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateRoomSearch,
  validateBooking,
  validateProfileUpdate,
  validateBookingId,
  validateRoomId,
  validateRefreshToken,
  handleValidationErrors
};
