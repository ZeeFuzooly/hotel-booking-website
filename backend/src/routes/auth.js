const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  authenticateRefreshToken 
} = require('../middleware/auth');
const { 
  validateRegistration, 
  validateLogin, 
  validateRefreshToken 
} = require('../middleware/validation');

// Register new user
router.post('/register', validateRegistration, authController.register);

// Login user
router.post('/login', validateLogin, authController.login);

// Refresh access token
router.post('/refresh', validateRefreshToken, authenticateRefreshToken, authController.refreshToken);

// Logout user
router.post('/logout', authController.logout);

module.exports = router;
