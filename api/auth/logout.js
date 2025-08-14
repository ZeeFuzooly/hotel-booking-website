const { removeRefreshToken } = require('../shared-data');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only handle POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { refreshToken } = req.body;
    
    // Simple validation
    if (!refreshToken) {
      return res.status(400).json({
        error: 'Missing refresh token',
        message: 'Refresh token is required'
      });
    }
    
    // Remove the refresh token from the shared data store
    const removed = removeRefreshToken(refreshToken);
    
    if (removed) {
      res.json({
        message: 'Logout successful',
        success: true
      });
    } else {
      res.json({
        message: 'Logout successful (token not found)',
        success: true
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
