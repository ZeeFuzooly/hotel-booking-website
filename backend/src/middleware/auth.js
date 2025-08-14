const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Verify JWT token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'No token provided' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Token is invalid or expired' 
      });
    }
    req.user = user;
    next();
  });
};

// Verify refresh token middleware
const authenticateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ 
      error: 'Refresh token required',
      message: 'No refresh token provided' 
    });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or expired' 
      });
    }

    // Check if refresh token exists in database
    const checkTokenQuery = `
      SELECT * FROM refresh_tokens 
      WHERE token = ? AND user_id = ? AND expires_at > datetime('now')
    `;

    db.get(checkTokenQuery, [refreshToken, user.id], (err, tokenRecord) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Database error',
          message: 'Error verifying refresh token' 
        });
      }

      if (!tokenRecord) {
        return res.status(403).json({ 
          error: 'Invalid refresh token',
          message: 'Refresh token not found or expired' 
        });
      }

      req.user = user;
      req.refreshToken = refreshToken;
      next();
    });
  });
};

// Optional authentication middleware (for routes that work with or without auth)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  });
};

// Generate JWT tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Store refresh token in database
const storeRefreshToken = (userId, refreshToken) => {
  return new Promise((resolve, reject) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const insertQuery = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `;

    db.run(insertQuery, [userId, refreshToken, expiresAt.toISOString()], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Remove refresh token from database
const removeRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE FROM refresh_tokens WHERE token = ?`;

    db.run(deleteQuery, [refreshToken], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Clean up expired refresh tokens
const cleanupExpiredTokens = () => {
  const deleteQuery = `DELETE FROM refresh_tokens WHERE expires_at < datetime('now')`;

  db.run(deleteQuery, (err) => {
    if (err) {
      console.error('Error cleaning up expired tokens:', err);
    } else {
      console.log('Expired refresh tokens cleaned up');
    }
  });
};

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
  optionalAuth,
  generateTokens,
  storeRefreshToken,
  removeRefreshToken
};
