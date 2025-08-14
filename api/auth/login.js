const { getUsers, findUserByCredentials } = require('../shared-data');

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
    const { email, password } = req.body;
    
    // Simple validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }
    
    // Sample users for testing (in production, this would come from a database)
    const sampleUsers = [
      {
        id: 1,
        email: "ziranfuzooly@gmail.com",
        password: "Ziran2797@",
        first_name: "Ziran",
        last_name: "Fuzooly",
        phone: "+94767997527",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        email: "test@example.com",
        password: "password123",
        first_name: "Test",
        last_name: "User",
        phone: "+1234567890",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    // Try to find user in sample users first
    let user = sampleUsers.find(u => u.email === email && u.password === password);
    
    // If not found in sample users, try shared data store
    if (!user) {
      const users = getUsers();
      user = findUserByCredentials(email, password);
    }
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    // Generate tokens
    const accessToken = `token_${Date.now()}_${Math.random()}`;
    const refreshToken = `refresh_${Date.now()}_${Math.random()}`;
    
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
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
