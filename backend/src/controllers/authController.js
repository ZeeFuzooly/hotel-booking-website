const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { 
  generateTokens, 
  storeRefreshToken, 
  removeRefreshToken 
} = require('../middleware/auth');

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    // Check if user already exists
    const checkUserQuery = 'SELECT id FROM users WHERE email = ?';
    
    db.get(checkUserQuery, [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error checking user existence'
        });
      }

      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert new user
      const insertUserQuery = `
        INSERT INTO users (email, password, first_name, last_name, phone)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(insertUserQuery, [email, hashedPassword, first_name, last_name, phone], function(err) {
        if (err) {
          return res.status(500).json({
            error: 'Database error',
            message: 'Error creating user'
          });
        }

        const userId = this.lastID;

        // Get user data (without password)
        const getUserQuery = `
          SELECT id, email, first_name, last_name, phone, created_at
          FROM users WHERE id = ?
        `;

        db.get(getUserQuery, [userId], (err, user) => {
          if (err) {
            return res.status(500).json({
              error: 'Database error',
              message: 'Error retrieving user data'
            });
          }

          // Generate tokens
          const { accessToken, refreshToken } = generateTokens(user);

          // Store refresh token
          storeRefreshToken(userId, refreshToken)
            .then(() => {
              res.status(201).json({
                message: 'User registered successfully',
                user: {
                  id: user.id,
                  email: user.email,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  phone: user.phone
                },
                tokens: {
                  accessToken,
                  refreshToken
                }
              });
            })
            .catch((error) => {
              console.error('Error storing refresh token:', error);
              res.status(500).json({
                error: 'Token storage error',
                message: 'Error storing authentication token'
              });
            });
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const getUserQuery = 'SELECT * FROM users WHERE email = ?';

    db.get(getUserQuery, [email], async (err, user) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error',
          message: 'Error finding user'
        });
      }

      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user);

      // Store refresh token
      try {
        await storeRefreshToken(user.id, refreshToken);

        res.json({
          message: 'Login successful',
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone
          },
          tokens: {
            accessToken,
            refreshToken
          }
        });
      } catch (error) {
        console.error('Error storing refresh token:', error);
        res.status(500).json({
          error: 'Token storage error',
          message: 'Error storing authentication token'
        });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error during login'
    });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(req.user);

    // Remove old refresh token and store new one
    try {
      await removeRefreshToken(refreshToken);
      await storeRefreshToken(req.user.id, newRefreshToken);

      res.json({
        message: 'Token refreshed successfully',
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      res.status(500).json({
        error: 'Token refresh error',
        message: 'Error refreshing authentication tokens'
      });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error refreshing token'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await removeRefreshToken(refreshToken);
    }

    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error during logout'
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout
};
